import React, {useEffect, useRef, useState} from 'react'
import {createRoot} from 'react-dom/client'
import {AnimatePresence, motion} from 'framer-motion'
import {ArrowRight, AudioLines, BookOpen, ChevronDown, Clock3, Globe2, Keyboard, LockKeyhole, MessageCircle, Mic, Send, Sparkles, Star, Volume2, WandSparkles} from 'lucide-react'
import Owl from './Owl'
import {Modal, Parent, Pin} from './Parent'
import {languages, lessonFor, localReply, normalize, transcriptScore} from './content'
import {browserSpeak, canRecord, Recognition, rewardSound} from './voice'
import '@fontsource-variable/figtree'
import '@fontsource-variable/plus-jakarta-sans'
import './style.css'

const modes = [
  {id:'chat', name:'Free Chat', description:'Talk about anything!', icon:MessageCircle},
  {id:'repeat', name:'Repeat After Me', description:'Practice saying words', icon:AudioLines},
  {id:'story', name:'Story & Quiz', description:'Explore a little adventure', icon:BookOpen},
]
const day = () => new Date().toDateString()
const clock = seconds => Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0')
const initial = {
  stars:0, history:[], words:[], scores:[], speaking:0, usage:{day:day(), seconds:0},
  profile:{name:'', age:7, language:'en-US', mic:true, limit:5, online:false},
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem('bi-ai-v1')) || {}
    return {...initial, ...saved, profile:{...initial.profile, ...saved.profile}}
  } catch { return initial }
}

const Flag = ({language}) => language.code === 'kaa'
  ? <img className="flag" src="/kaa.svg" alt=""/>
  : <span className="flag" aria-hidden="true">{language.flag}</span>

function App() {
  const [data, setData] = useState(load)
  const [mode, setMode] = useState('chat')
  const [dialog, setDialog] = useState(null)
  const [caps, setCaps] = useState({chat:false, speech:false})
  const [state, setState] = useState('idle')
  const [typed, setTyped] = useState(false)
  const [input, setInput] = useState('')
  const [message, setMessage] = useState('')
  const [notice, setNotice] = useState('')
  const [phrase, setPhrase] = useState(0)
  const [stage, setStage] = useState('choose')
  const [branch, setBranch] = useState(1)
  const [turn, setTurn] = useState(0)
  const [celebration, setCelebration] = useState(0)
  const [today, setToday] = useState(day)
  const [visible, setVisible] = useState(!document.hidden)
  const activity = useRef({id:0, stop:null, started:0})
  const speech = useRef({id:0, audio:null})
  const pending = useRef(0)
  const {profile} = data
  const selected = languages.find(language => language.code === profile.language) || languages[0]
  const lesson = lessonFor(selected.code, branch)
  const remaining = Math.max(0, profile.limit * 60 - (data.usage.day === today ? data.usage.seconds : 0))
  const online = profile.online && caps.chat
  const cloudSpeech = online && caps.speech
  const voiceAvailable = Boolean(Recognition || (cloudSpeech && canRecord))
  const blocked = !remaining
  const prompt = mode === 'repeat' ? lesson.phrases[phrase] : mode === 'story' ? (stage === 'quiz' ? lesson.riddle : lesson.opening) : lesson.prompts[0]

  useEffect(() => {
    fetch('/api/capabilities').then(response => response.json()).then(setCaps).catch(() => {})
    const onVisibility = () => {setVisible(!document.hidden); setToday(day())}
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    try {localStorage.setItem('bi-ai-v1', JSON.stringify(data))} catch {}
  }, [data])

  useEffect(() => {
    const tick = setInterval(() => {
      const current = day()
      setToday(current)
      if (!visible || dialog) return
      setData(previous => {
        const seconds = previous.usage.day === current ? previous.usage.seconds : 0
        if (seconds >= previous.profile.limit * 60) return previous
        return {...previous, usage:{day:current, seconds:seconds + 1}}
      })
    }, 1000)
    return () => clearInterval(tick)
  }, [dialog, visible])

  function stopSpeech() {
    speech.current.id++
    speech.current.audio?.abort()
    speech.current.audio = null
    window.speechSynthesis?.cancel()
  }

  function cancelActivity() {
    pending.current++
    activity.current.id++
    activity.current.stop?.(true)
    activity.current.stop = null
    clearTimeout(activity.current.timer)
    stopSpeech()
    setState('idle')
  }

  useEffect(() => {
    if (blocked || dialog || !visible) cancelActivity()
  }, [blocked, dialog, visible])

  function reset() {
    cancelActivity()
    setMessage('')
    setNotice('')
    setInput('')
    setPhrase(0)
    setStage('choose')
    setBranch(1)
    setTurn(0)
  }

  function selectMode(next) {
    if (next === mode) return
    reset()
    setMode(next)
    if (next === 'repeat') speak(lesson.phrases[0])
    if (next === 'story') speak(lesson.opening)
  }

  function updateProfile(patch) {
    if (patch.language && patch.language !== profile.language) reset()
    if (patch.mic === false) cancelActivity()
    setData(previous => ({...previous, profile:{...previous.profile, ...patch}}))
  }

  function openDialog(name) {
    cancelActivity()
    setDialog(name)
  }

  function speak(text) {
    if (blocked) return
    stopSpeech()
    const id = speech.current.id
    let timer
    const active = () => speech.current.id === id
    const end = () => {clearTimeout(timer); if (active()) setState('idle')}
    const start = () => {
      if (!active()) return
      clearTimeout(timer)
      setState('speaking')
      timer = setTimeout(() => {if (active()) {stopSpeech(); end(); setState('idle')}}, 18000)
    }
    const fallback = () => {
      if (!active()) return
      setState('thinking')
      timer = setTimeout(end, 2500)
      browserSpeak(text, selected.code, start, end)
    }
    if (!cloudSpeech) {
      fallback()
      return
    }
    setState('thinking')
    const controller = new AbortController()
    speech.current.audio = controller
    fetch('/api/speak', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({text}), signal:controller.signal})
      .then(response => {if (!response.ok) throw new Error(); return response.blob()})
      .then(blob => {
        if (!active()) return
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        const release = () => URL.revokeObjectURL(url)
        speech.current.audio = {abort:() => {audio.pause(); release()}}
        audio.onplaying = start
        audio.onended = () => {release(); end()}
        audio.onerror = () => {release(); fallback()}
        return audio.play().catch(() => {release(); fallback()})
      }).catch(fallback)
  }

  function log(text, reply, reward = false, practiced = [], score, seconds = 0) {
    setData(previous => ({
      ...previous, stars:previous.stars + Number(reward),
      words:[...new Set([...previous.words, ...practiced])].slice(-250),
      scores:score === undefined ? previous.scores : [...previous.scores, score].slice(-100),
      speaking:previous.speaking + seconds,
      history:[...previous.history, {time:Date.now(), input:text, reply, language:selected.native}].slice(-40),
    }))
    if (reward) {
      setCelebration(previous => previous + 1)
      rewardSound()
    }
    setMessage(reply)
    speak(reply)
  }

  async function submit(raw, seconds = 0) {
    const text = raw.trim().slice(0, 400)
    if (!text || blocked) return
    setInput('')
    setNotice('')
    if (mode === 'repeat') {
      const score = transcriptScore(text, prompt)
      const success = score >= 80
      const next = (phrase + 1) % lesson.phrases.length
      if (success) setPhrase(next)
      const words = Array.from(new Intl.Segmenter(selected.code === 'kaa' ? 'uz' : selected.code, {granularity:'word'}).segment(prompt))
        .filter(part => part.isWordLike).map(part => part.segment.toLocaleLowerCase())
      log(text, lesson.feedback[success ? 0 : 1] + ' ' + (success ? lesson.phrases[next] : prompt), success, success ? words : [], score, seconds)
      return
    }
    if (mode === 'story') {
      if (stage === 'choose') {
        const clean = normalize(text)
        const index = lesson.choices.findIndex(choice => {
          const option = normalize(choice)
          return clean.includes(option) || (clean.length >= 2 && option.includes(clean))
        })
        if (index < 0) {
          log(text, lesson.feedback[1] + ' ' + lesson.choices.join(' / '), false, [], undefined, seconds)
          return
        }
        setStage('quiz')
        setBranch(index)
        log(text, lesson.branches[index] + ' ' + lessonFor(selected.code, index).riddle, false, [], undefined, seconds)
      } else if (stage === 'quiz') {
        const answer = normalize(lesson.answers[0])
        const clean = normalize(text)
        const success = selected.code === 'zh-CN' ? clean.includes(answer) : clean.split(' ').includes(answer)
        if (success) setStage('done')
        log(text, lesson.feedback[success ? 0 : 1] + (success ? '' : ' ' + lesson.riddle), success, success ? [lesson.answers[0]] : [], undefined, seconds)
      }
      return
    }
    const current = ++pending.current
    setTurn(previous => previous + 1)
    setState('thinking')
    let reply = localReply(selected.code, text, turn, profile.age)
    if (online) {
      try {
        const response = await fetch('/api/chat', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body:JSON.stringify({text, language:selected.code, age:profile.age}),
          signal:AbortSignal.timeout(22000),
        })
        if (response.ok) {
          const result = await response.json()
          reply = result.redirect ? lesson.feedback[2] + ' ' + lesson.prompts[0] : result.reply || reply
        }
      } catch {}
    } else {
      // Keep the thinking state visible even when the lesson runs locally.
      await new Promise(resolve => setTimeout(resolve, 350))
    }
    if (pending.current === current) log(text, reply, false, [], undefined, seconds)
  }

  function listen(useCloud = cloudSpeech && canRecord) {
    if (blocked || !profile.mic || (mode === 'story' && stage === 'done')) return
    if (state === 'listening') {
      activity.current.stop?.(false)
      return
    }
    cancelActivity()
    setNotice('')
    if (!Recognition && !useCloud) {
      setTyped(true)
      setNotice('Voice recognition is unavailable. You can type instead.')
      return
    }
    const id = activity.current.id
    activity.current.started = 0
    const active = () => activity.current.id === id
    const listening = () => {
      activity.current.started = Date.now()
      setState('listening')
    }
    const finish = (text, started = activity.current.started) => {
      if (!active()) return
      clearTimeout(activity.current.timer)
      activity.current.stop = null
      setState('idle')
      if (text?.trim()) submit(text, started ? Math.max(1, Math.round((Date.now() - started) / 1000)) : 0)
      else setNotice('I didn’t catch that. Try the microphone again or type a message.')
    }
    const fail = () => {
      if (!active()) return
      clearTimeout(activity.current.timer)
      activity.current.stop = null
      setState('idle')
      setTyped(true)
      setNotice('Microphone unavailable. Check your browser permissions or type below.')
    }
    if (useCloud) {
      let stream, recorder
      const controller = new AbortController()
      activity.current.stop = cancel => {
        if (cancel) controller.abort()
        if (recorder?.state === 'recording') recorder.stop()
        stream?.getTracks().forEach(track => track.stop())
      }
      navigator.mediaDevices.getUserMedia({audio:true}).then(result => {
        stream = result
        if (!active()) {stream.getTracks().forEach(track => track.stop()); return}
        recorder = new MediaRecorder(stream)
        const chunks = []
        recorder.ondataavailable = event => chunks.push(event.data)
        recorder.onstop = async () => {
          if (!active()) return
          const start = activity.current.started
          const seconds = Math.max(1, Math.round((Date.now() - start) / 1000))
          setState('thinking')
          try {
            const response = await fetch('/api/transcribe?language=' + selected.code, {
              method:'POST', body:new Blob(chunks, {type:recorder.mimeType}), signal:controller.signal,
            })
            if (!response.ok) throw new Error()
            const {text} = await response.json()
            if (active() && text?.trim()) {
              setState('idle')
              activity.current.stop = null
              submit(text, seconds)
            } else finish('')
          } catch {
            if (active()) {
              setState('idle')
              setTyped(true)
              setNotice('Couldn’t transcribe that recording. Try typing your answer.')
            }
          }
        }
        recorder.start()
        listening()
        activity.current.timer = setTimeout(() => activity.current.stop?.(false), 12000)
      }).catch(() => {stream?.getTracks().forEach(track => track.stop()); fail()})
      return
    }
    const recognition = new Recognition()
    recognition.lang = selected.code === 'kaa' ? 'uz-UZ' : selected.code
    recognition.interimResults = false
    recognition.continuous = false
    let transcript = ''
    let failed = false
    recognition.onstart = () => {if (active()) listening()}
    recognition.onresult = event => {transcript = event.results[0][0].transcript}
    recognition.onerror = event => {
      failed = true
      if (event.error === 'no-speech') finish('')
      else fail()
    }
    recognition.onend = () => {if (!failed) finish(transcript)}
    activity.current.stop = cancel => {
      try {if (cancel) recognition.abort(); else recognition.stop()} catch {}
    }
    try {
      recognition.start()
      activity.current.timer = setTimeout(() => activity.current.stop?.(false), 12000)
    } catch {fail()}
  }

  const status = state === 'listening' ? 'Bibi is listening' : state === 'thinking' ? 'Bibi is thinking' : state === 'speaking' ? 'Bibi is speaking' : 'Bibi is ready'
  const mainMessage = blocked ? 'See you tomorrow!' : message || (mode === 'chat' ? lesson.greeting : prompt)
  const subtitle = blocked ? 'You’ve used your learning time for today.' : notice ||
    (state === 'listening' ? 'Go ahead, I’m listening!' : mode === 'repeat' ? 'Listen to Bibi, then say the phrase.' :
      mode === 'story' ? 'Listen, then choose or say your answer.' : 'I’m Bibi, your little language buddy.')
  const close = () => setDialog(null)
  const complete = mode === 'story' && stage === 'done'

  return <>
    <header className="topbar"><div className="top-inner">
      <div className="brand"><img src="/icon.svg" alt=""/><div><strong>BI<span> AI</span></strong><small>LANGUAGE PLAY</small></div></div>
      <div className="top-actions">
        <div className="star-count" aria-live="polite" aria-label={data.stars + ' stars'}><Star size={18} fill="currentColor"/><strong>{data.stars}</strong><span>stars</span></div>
        <button className="header-button language-button" onClick={() => openDialog('languages')} aria-label={'Learning language: ' + selected.native}><Flag language={selected}/><span>{selected.native}</span><ChevronDown size={14}/></button>
        <button className="header-button parent-button" aria-label="Parent Zone" onClick={() => openDialog('pin')}><LockKeyhole size={16}/><span>Parent Zone</span></button>
      </div>
    </div></header>
    <main>
      <div className="welcome">
        <h1>Little talks, <em>big discoveries.</em></h1>
        <p>{profile.name.trim() ? `Ready to play, ${profile.name.trim()}?` : "Pick an adventure and start speaking with Bibi!"}</p>
      </div>
      <nav className="modes" aria-label="Learning mode">{modes.map(({id,name,description,icon:Icon}) =>
        <button key={id} className={'mode ' + id + (mode === id ? ' active' : '')} aria-pressed={mode===id} onClick={() => selectMode(id)}>
          <span className="mode-icon"><Icon size={24} strokeWidth={2.15}/></span><span className="mode-label"><strong>{name}</strong><small>{description}</small></span>
          <span className="mode-arrow"><ArrowRight size={17} strokeWidth={2.5}/></span>
        </button>)}</nav>
      <div className="workspace">
        <section className="hero" aria-label="Learning with Bibi">
          <div className="hero-art">
            <div className="hero-status"><i className={state}/>{status}{state === 'thinking' && <span className="loading-dots">•••</span>}</div>
            <div className="sun-ring"></div><div className="sun-ring inner"></div>
            <Sparkles className="art-star star-a" size={28}/><Sparkles className="art-star star-b" size={20}/>
            <span className="art-dot dot-a"/><span className="art-dot dot-b"/><span className="art-dot dot-c"/>
            <Owl state={state}/>
            <AnimatePresence>{celebration > 0 && <div className="confetti" key={celebration} aria-hidden="true">
              {Array.from({length:22}, (_, index) => <motion.i key={index} style={{background:['#ff7b5c','#f8bc48','#19bc86','#aa8de4'][index%4]}}
                initial={{x:0,y:0,opacity:1,rotate:0}} animate={{x:Math.cos(index * 2.4)*(70+index*7),y:Math.sin(index*2.4)*100+80,opacity:0,rotate:index*35}}
                transition={{duration:0.85+index*0.025}} />)}
            </div>}</AnimatePresence>
          </div>
          <div className="hero-content">
            <div className="message" aria-live="polite"><h2>{mainMessage}</h2><p>{subtitle}</p></div>
            {!blocked && mode === 'story' && <div className="choice-row">
              {complete ? <button className="secondary" onClick={() => {reset(); speak(lesson.opening)}}>Play again</button> :
                (stage === 'choose' ? lesson.choices : lesson.answers).map(value => <button className="secondary" key={value} disabled={state === 'thinking' || state === 'listening'} onClick={() => submit(value)}>{value}</button>)}
            </div>}
            {!blocked && !complete && <div className="voice-row">
              <button className="icon-button side-action" aria-label="Read aloud" title="Read aloud" onClick={() => speak(message || (mode === 'chat' ? lesson.greeting : prompt))} disabled={state==='listening' || state==='thinking'}><Volume2 size={21}/></button>
              <button className={'mic-button ' + state} onClick={() => listen()} disabled={state==='thinking' || !profile.mic || !voiceAvailable} aria-label={state === 'listening' ? 'Stop listening' : 'Start microphone'}>{state === 'listening' ? <AudioLines size={29}/> : <Mic size={29}/>}</button>
              <button className={'icon-button side-action ' + (typed ? 'selected' : '')} title="Type instead" aria-label="Type instead" aria-expanded={typed} onClick={() => {if (!typed) cancelActivity(); setTyped(!typed)}}><Keyboard size={21}/></button>
            </div>}
            {!blocked && !complete && <div className="voice-caption">{!profile.mic ? 'Microphone turned off by a parent' : !voiceAvailable ? 'Type to talk with Bibi' : state === 'listening' ? 'Tap to stop' : 'Tap to talk'}</div>}
            {!blocked && !complete && typed && <form className="type-form" onSubmit={event => {event.preventDefault(); submit(input)}}>
              <input aria-label="Type a message" autoFocus placeholder="Type your answer…" value={input} onChange={event => setInput(event.target.value)} maxLength={400}/>
              <button className="icon-button" aria-label="Send message" disabled={!input.trim() || state==='thinking' || state==='listening'}><Send size={19}/></button>
            </form>}
          </div>
        </section>
        <aside className="sidebar">
          <section className="side-card prompt-card">
            <div className="side-title"><span className="side-icon purple"><WandSparkles size={20}/></span><div><h2>{mode === 'chat' ? 'Try saying…' : mode === 'repeat' ? 'Practice phrase' : 'Story time'}</h2><p>{mode === 'chat' ? 'Need an idea to get started?' : mode === 'repeat' ? 'Tap to hear every word.' : 'Tap to listen to the adventure.'}</p></div></div>
            <div className="prompt-list">
              {(mode === 'chat' ? (selected.code === 'en-US' ? ['Hello, Bibi!', 'Tell me about animals', 'What’s your favorite color?'] : [lesson.phrases[0], ...lesson.prompts.slice(0,2)]) : [prompt]).map((text, index) =>
                <button key={text} disabled={blocked || state === 'thinking' || state === 'listening' || complete} onClick={() => mode === 'chat' ? submit(text) : speak(text)}>
                  <span className={'prompt-emoji emoji-' + index} aria-hidden="true">{mode === 'chat' ? ['👋','🐻','🌈'][index] : <Volume2 size={17}/>}</span><span>{text}</span><ArrowRight size={15}/>
                </button>)}
            </div>
          </section>
          <section className="side-card timer-card">
            <div className="side-title"><span className="side-icon green"><Clock3 size={20}/></span><div><h2>Playtime today</h2></div></div>
            <div className="time"><strong>{clock(remaining)}</strong><span>time left</span></div>
            <div className="progress" role="progressbar" aria-label="Daily playtime remaining" aria-valuenow={remaining} aria-valuemax={profile.limit*60}><i style={{width: remaining / (profile.limit*60) * 100 + '%'}}/></div>
          </section>
        </aside>
      </div>
      <footer><span><LockKeyhole size={13}/> Kid Mode</span><button onClick={() => openDialog('languages')}><Globe2 size={14}/> {selected.native}</button></footer>
    </main>
    {dialog === 'languages' && <Modal title="Pick a language" close={close}>
      <p>Which language do you want to practice with Bibi?</p>
      <div className="language-grid">{languages.map(language => <button className={'secondary '+(selected.code===language.code?'selected':'')} key={language.code}
        aria-pressed={selected.code===language.code} onClick={() => {updateProfile({language:language.code}); close()}}><Flag language={language}/>{language.native}</button>)}</div>
    </Modal>}
    {dialog === 'pin' && <Pin unlock={() => setDialog('parent')} close={close}/>}
    {dialog === 'parent' && <Parent data={data} update={updateProfile} remaining={remaining} close={close} capabilities={caps} clearHistory={() => setData(previous => ({...previous, history:[]}))}/>}
  </>
}

createRoot(document.getElementById('root')).render(<App/>)
if (import.meta.env.PROD && 'serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {})
