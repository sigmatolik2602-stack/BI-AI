import React from "react"
import {useEffect, useRef, useState} from 'react'
import {AudioLines, BookOpen, ChartNoAxesColumnIncreasing, Check, Clock3, LockKeyhole, Mic, Sparkles, Crown, X} from 'lucide-react'
import {languages} from './content'

export function Modal({title, close, children, wide = false}) {
  const ref = useRef(null)
  useEffect(() => {
    const dialog = ref.current
    dialog.showModal()
    return () => dialog.close()
  }, [])
  return <dialog ref={ref} className={wide ? 'modal wide' : 'modal'} onCancel={event => {event.preventDefault(); close()}} onClick={event => {
    if (event.target === ref.current) {
      const bounds = ref.current.getBoundingClientRect()
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close()
    }
  }} aria-label={title}>
    <button className="icon-button modal-close" aria-label="Close" onClick={close}><X size={20}/></button>
    <h2>{title}</h2>
    {children}
  </dialog>
}

export function Pin({unlock, close}) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  return <Modal title="Grown-ups only" close={close}>
    <div className="modal-emblem"><LockKeyhole size={22}/></div>
    <p>Enter the 4-digit parent PIN to continue.</p>
    <form className="pin-form" onSubmit={event => {
      event.preventDefault()
      if (pin === '1234') unlock()
      else {setPin(''); setError('That PIN didn’t match. Try again.')}
    }}>
      <label htmlFor="pin">Parent PIN</label>
      <input id="pin" autoFocus type="password" inputMode="numeric" autoComplete="off" maxLength={4} value={pin}
        onChange={event => {setPin(event.target.value.replace(/\D/g, '')); setError('')}} required />
      {error && <span role="alert" className="error">{error}</span>}
      <button className="primary" disabled={pin.length !== 4}>Unlock dashboard</button>
    </form>
  </Modal>
}

export function Parent({data, update, remaining, close, clearHistory, capabilities}) {
  const [plan, setPlan] = useState(null)
  const [confirm, setConfirm] = useState(false)
  const {profile, history, words, scores, speaking} = data
  const average = scores.length ? Math.round(scores.reduce((a,b) => a+b,0) / scores.length) + '%' : '—'
  return <Modal title="Parent dashboard" close={close} wide>
    <p>Manage your child’s learning space and see what they’ve practiced.</p>
    <div className="metrics">
      {[[AudioLines, 'Total speaking time', Math.floor(speaking / 60) + 'm ' + speaking % 60 + 's'],
        [BookOpen, 'Words practiced', words.length], [ChartNoAxesColumnIncreasing, 'Pronunciation score', average]].map(([Icon,label,value]) =>
        <div key={label}><Icon size={19}/><strong>{value}</strong><span>{label}</span></div>)}
    </div>
    <p className="small muted">Pronunciation score measures how closely the transcript matches the practice phrase.</p>
    <div className="parent-grid">
      <section className="parent-card">
        <h3>Child profile</h3>
        <label>Child’s name<input maxLength={28} placeholder="Little Explorer" value={profile.name} onChange={event => update({name:event.target.value})}/></label>
        <label>Age<select aria-label="Age" value={profile.age} onChange={event => update({age:Number(event.target.value)})}>
          {Array.from({length:9}, (_, i) => i + 4).map(age => <option key={age} value={age}>{age} years old</option>)}
        </select></label>
        <label>Learning language<select aria-label="Learning language" value={profile.language} onChange={event => update({language:event.target.value})}>
          {languages.map(language => <option key={language.code} value={language.code}>{language.native}</option>)}
        </select></label>
      </section>
      <section className="parent-card">
        <h3>Safety & controls</h3>
        <div className="control"><span><Mic size={17}/> Microphone</span><button type="button" role="switch" aria-label="Allow microphone" aria-checked={profile.mic} className={'switch '+(profile.mic?'on':'')} onClick={() => update({mic:!profile.mic})}><i/></button></div>
        <label>Daily time limit <strong>{profile.limit} min</strong><input aria-label="Daily time limit" type="range" min="5" max="60" step="1" value={profile.limit} onChange={event => update({limit:Number(event.target.value)})}/></label>
        <p className="small muted"><Clock3 size={15}/> {Math.floor(remaining/60)}m {remaining%60}s left today</p>
        {capabilities.chat && <div className="control"><span><Sparkles size={17}/> Online AI</span><button type="button" role="switch" aria-label="Allow online AI" aria-checked={profile.online} className={'switch '+(profile.online?'on':'')} onClick={() => update({online:!profile.online})}><i/></button></div>}
        <p className="small muted">{profile.online && capabilities.chat ? 'Online AI sends messages and optional voice recordings to OpenAI. Browser voice recognition may also use a speech service.' : 'Learning history is stored on this device. Browser voice recognition may use a speech service.'}</p>
      </section>
    </div>
    <section className="parent-card membership">
      <div><Crown size={19}/><h3>Free tier</h3><p>Includes 5 min/day by default</p></div>
      <button className="secondary" onClick={() => setPlan('monthly')}>Explore Premium</button>
    </section>
    <section className="parent-card">
      <div className="history-title"><h3>Recent conversations</h3>{history.length > 0 && <button className="text-button" onClick={() => setConfirm(true)}>Clear history</button>}</div>
      {confirm && <div className="control"><span>Remove all saved transcripts?</span><button className="secondary" onClick={() => setConfirm(false)}>Cancel</button><button className="primary" onClick={() => {clearHistory(); setConfirm(false)}}>Clear</button></div>}
      {!history.length && <p className="muted">Conversations will appear here after a lesson.</p>}
      <div className="history">{history.slice().reverse().map((entry, i) => <article key={i}>
        <span className="small muted">{new Date(entry.time).toLocaleString()} · {entry.language}</span>
        {entry.input && <p><b>Child:</b> {entry.input}</p>}<p><b>Bibi:</b> {entry.reply}</p>
      </article>)}</div>
      <h3 className="learned-heading">Learned words</h3>
      {words.length ? <div className="word-list">{words.map(word => <span key={word}>{word}</span>)}</div> : <p className="muted">Practice a phrase or solve a riddle to add words.</p>}
    </section>
    {plan && <Modal title="BI AI Premium" close={() => setPlan(null)}>
      <div className="modal-emblem"><Crown size={24}/></div>
      <p>More time to talk, play, and discover languages.</p>
      <div className="plan-options">{[['monthly','$10 / month'],['yearly','$120 / year']].map(([id,label]) => <button key={id} aria-pressed={plan===id} className={'secondary '+(plan===id?'selected':'')} onClick={() => setPlan(id)}>{label}{plan===id && <Check size={17}/>}</button>)}</div>
      <p className="small muted">Subscription preview. No payment is collected.</p>
      <button className="primary" onClick={() => setPlan(null)}>Done</button>
    </Modal>}
  </Modal>
}
