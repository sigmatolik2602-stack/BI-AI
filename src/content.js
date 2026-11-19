// Each language supplies a complete local lesson, including when the API is offline.
export const languages = [
  ['en-US','🇺🇸','English','English'],
  ['ru-RU','🇷🇺','Русский','Russian'],
  ['kaa','☀️','Qaraqalpaqsha','Karakalpak'],
  ['uz-UZ','🇺🇿','Oʻzbekcha','Uzbek'],
  ['kk-KZ','🇰🇿','Қазақша','Kazakh'],
  ['tr-TR','🇹🇷','Türkçe','Turkish'],
  ['es-ES','🇪🇸','Español','Spanish'],
  ['de-DE','🇩🇪','Deutsch','German'],
  ['fr-FR','🇫🇷','Français','French'],
  ['zh-CN','🇨🇳','中文','Mandarin Chinese'],
].map(([code, flag, native, name]) => ({code, flag, native, name}))

// Greeting, safe chat prompts, repeat phrases, story opening, options, branches, riddle, answers, feedback.
const lessons = {
'en-US': [
  'Hello, little explorer!', ['What’s your favorite animal?', 'What color do you like?', 'What do you like to play?'],
  ['Hello, friend!', 'I like apples.', 'The sky is blue.'],
  'A little owl finds a glowing path. Where should we go?',
  ['The forest', 'The garden'],
  ['In the forest, we meet a friendly bear.', 'In the garden, we find a singing bird.'],
  'I have whiskers and say meow. What am I?', ['cat', 'dog'],
  ['Well done!', 'Let’s try again!', 'Hello! Let’s talk about something fun.']
],
'ru-RU': [
  'Привет, юный исследователь!', ['Какое у тебя любимое животное?', 'Какой цвет тебе нравится?', 'Во что ты любишь играть?'],
  ['Привет, друг!', 'Я люблю яблоки.', 'Небо голубое.'],
  'Совёнок нашёл светящуюся тропу. Куда пойдём?',
  ['В лес', 'В сад'], ['В лесу мы встретили доброго медведя.', 'В саду мы нашли поющую птицу.'],
  'У меня есть усы, и я говорю «мяу». Кто я?', ['кот', 'собака'],
  ['Молодец!', 'Давай попробуем ещё раз!', 'Привет! Поговорим о чём-нибудь весёлом.']
],
'kaa': [
  'Sálem, kishkene izertlewshi!', ['Qaysı haywandı jaqsı kóreseń?', 'Qaysı reń saǵan unaydı?', 'Qanday oyın oynawdı jaqsı kóreseń?'],
  ['Sálem, dosım!', 'Men almanı jaqsı kóremen.', 'Aspan kók.'],
  'Kishkene úki jarqıraǵan soqtıqtı taptı. Qay jerge baramız?',
  ['Toǵayǵa', 'Baǵqa'], ['Toǵayda miyrimli ayıwdı kórdik.', 'Baǵta sayraǵan qustı kórdik.'],
  'Murtım bar, miyawlayman. Men ne?', ['pıshıq', 'iyt'],
  ['Júdá jaqsı!', 'Jáne bir ret sınap kóreyik!', 'Sálem! Qızıqlı nárse haqqında sóyleseyik.']
],
'uz-UZ': [
  'Salom, kichik tadqiqotchi!', ['Sevimli hayvoning qaysi?', 'Qaysi rangni yoqtirasan?', 'Qanday oʻyin oʻynashni yoqtirasan?'],
  ['Salom, doʻstim!', 'Men olmani yaxshi koʻraman.', 'Osmon moviy.'],
  'Kichkina boyoʻgʻli nurli yoʻlni topdi. Qayerga boramiz?',
  ['Oʻrmonga', 'Bogʻga'], ['Oʻrmonda mehribon ayiqni uchratdik.', 'Bogʻda sayrayotgan qushni topdik.'],
  'Moʻylovim bor, miyovlayman. Men kimman?', ['mushuk', 'it'],
  ['Barakalla!', 'Yana urinib koʻraylik!', 'Salom! Qiziqarli narsa haqida gaplashamiz.']
],
'kk-KZ': [
  'Сәлем, кішкентай зерттеуші!', ['Қандай жануарды жақсы көресің?', 'Қай түс саған ұнайды?', 'Қандай ойын ойнағанды ұнатасың?'],
  ['Сәлем, досым!', 'Мен алманы жақсы көремін.', 'Аспан көк.'],
  'Кішкентай үкі жарқыраған жолды тапты. Қайда барамыз?',
  ['Орманға', 'Баққа'], ['Орманда мейірімді аюды кездестірдік.', 'Бақта әнші құсты көрдік.'],
  'Мұртым бар, мияулаймын. Мен кіммін?', ['мысық', 'ит'],
  ['Жарайсың!', 'Тағы бір рет байқап көрейік!', 'Сәлем! Қызықты нәрсе туралы сөйлесейік.']
],
'tr-TR': [
  'Merhaba, küçük kâşif!', ['En sevdiğin hayvan nedir?', 'Hangi rengi seversin?', 'Hangi oyunu seversin?'],
  ['Merhaba, arkadaşım!', 'Elmayı severim.', 'Gökyüzü mavi.'],
  'Küçük baykuş parlayan bir yol buldu. Nereye gidelim?',
  ['Ormana', 'Bahçeye'], ['Ormanda dost canlısı bir ayıyla tanıştık.', 'Bahçede şarkı söyleyen bir kuş bulduk.'],
  'Bıyıklarım var, miyav derim. Ben neyim?', ['kedi', 'köpek'],
  ['Aferin!', 'Bir daha deneyelim!', 'Merhaba! Eğlenceli bir şey konuşalım.']
],
'es-ES': [
  '¡Hola, peque explorador!', ['¿Cuál es tu animal favorito?', '¿Qué color te gusta?', '¿A qué te gusta jugar?'],
  ['¡Hola, amigo!', 'Me gustan las manzanas.', 'El cielo es azul.'],
  'Un búho encuentra un camino brillante. ¿Adónde vamos?',
  ['Al bosque', 'Al jardín'], ['En el bosque vimos un oso amable.', 'En el jardín encontramos un pájaro cantor.'],
  'Tengo bigotes y digo miau. ¿Quién soy?', ['gato', 'perro'],
  ['¡Muy bien!', '¡Intentémoslo otra vez!', '¡Hola! Vamos a hablar de algo divertido.']
],
'de-DE': [
  'Hallo, kleiner Entdecker!', ['Was ist dein Lieblingstier?', 'Welche Farbe magst du?', 'Was spielst du gern?'],
  ['Hallo, mein Freund!', 'Ich mag Äpfel.', 'Der Himmel ist blau.'],
  'Eine kleine Eule findet einen leuchtenden Weg. Wohin gehen wir?',
  ['In den Wald', 'In den Garten'], ['Im Wald trafen wir einen freundlichen Bären.', 'Im Garten fanden wir einen singenden Vogel.'],
  'Ich habe Schnurrhaare und sage Miau. Was bin ich?', ['Katze', 'Hund'],
  ['Gut gemacht!', 'Versuchen wir es noch einmal!', 'Hallo! Lass uns über etwas Lustiges reden.']
],
'fr-FR': [
  'Salut, petit explorateur !', ['Quel est ton animal préféré ?', 'Quelle couleur aimes-tu ?', 'À quoi aimes-tu jouer ?'],
  ['Salut, mon ami !', 'J’aime les pommes.', 'Le ciel est bleu.'],
  'Un petit hibou trouve un chemin lumineux. Où allons-nous ?',
  ['Dans la forêt', 'Dans le jardin'], ['Dans la forêt, nous avons rencontré un ours gentil.', 'Dans le jardin, nous avons trouvé un oiseau qui chante.'],
  'J’ai des moustaches et je dis miaou. Qui suis-je ?', ['chat', 'chien'],
  ['Bravo !', 'On réessaie ?', 'Salut ! Parlons de quelque chose de rigolo.']
],
'zh-CN': [
  '你好，小小探险家！', ['你最喜欢什么动物？', '你喜欢什么颜色？', '你喜欢玩什么？'],
  ['你好，朋友！', '我喜欢苹果。', '天空是蓝色的。'],
  '小猫头鹰发现了一条闪闪发光的小路。我们去哪儿？',
  ['去森林', '去花园'], ['我们在森林里遇到了一只友善的熊。', '我们在花园里发现了一只唱歌的小鸟。'],
  '我有胡须，会喵喵叫。我是谁？', ['猫', '狗'],
  ['真棒！', '我们再试一次吧！', '你好！我们聊点有趣的事吧。']
],
}

const smallTalk = {
  'en-US': ['That’s fun!', 'I like learning with you!', 'Let’s play a word game!'],
  'ru-RU': ['Как весело!', 'Мне нравится учиться с тобой!', 'Давай поиграем в слова!'],
  kaa: ['Qanday qızıqlı!', 'Sen menen úyreniw maǵan unaydı!', 'Sóz oyının oynayıq!'],
  'uz-UZ': ['Qanday qiziq!', 'Sen bilan oʻrganish menga yoqadi!', 'Soʻz oʻyinini oʻynaymiz!'],
  'kk-KZ': ['Қандай қызық!', 'Сенімен бірге үйрену қызық!', 'Сөз ойынын ойнайық!'],
  'tr-TR': ['Ne eğlenceli!', 'Seninle öğrenmeyi seviyorum!', 'Bir kelime oyunu oynayalım!'],
  'es-ES': ['¡Qué divertido!', '¡Me gusta aprender contigo!', '¡Juguemos con palabras!'],
  'de-DE': ['Wie lustig!', 'Ich lerne gern mit dir!', 'Lass uns ein Wortspiel spielen!'],
  'fr-FR': ['C’est amusant !', 'J’aime apprendre avec toi !', 'Jouons avec les mots !'],
  'zh-CN': ['真有趣！', '我喜欢和你一起学习！', '我们来玩文字游戏吧！'],
}

export function lessonFor(code, branch = 1) {
  const [greeting, prompts, phrases, opening, choices, branches, riddle, answers, feedback] = lessons[code] || lessons['en-US']
  const quiz = branch === 0 ? (forestQuiz[code] || forestQuiz['en-US']) : [riddle, answers]
  return { greeting, prompts, phrases, opening, choices, branches, riddle:quiz[0], answers:quiz[1], feedback }
}

export function localReply(code, input, turn, age) {
  const lesson = lessonFor(code)
  const text = normalize(input)
  const topic = (topicWords[code] || topicWords['en-US']).findIndex(pattern => pattern.test(text))
  const next = topic >= 0 ? topic : turn % 3
  const intro = topic >= 0 ? (topicReplies[code] || topicReplies['en-US'])[topic]
    : age < 7 ? '' : (smallTalk[code] || smallTalk['en-US'])[next]
  return [intro, lesson.prompts[next]].filter(Boolean).join(' ')
}

export function normalize(text) {
  return text.normalize('NFKD').toLowerCase().replace(/[\p{M}'’ʻ‘`]/gu, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ').trim().replace(/\s+/g, ' ')
}

export function transcriptScore(input, target) {
  const actual = Array.from(normalize(input).replaceAll(' ', ''))
  const expected = Array.from(normalize(target).replaceAll(' ', ''))
  let row = Array.from({length: actual.length + 1}, (_, index) => index)
  expected.forEach((character, index) => {
    const next = [index + 1]
    actual.forEach((other, offset) => {
      next.push(Math.min(next[offset] + 1, row[offset + 1] + 1, row[offset] + Number(other !== character)))
    })
    row = next
  })
  return Math.round(100 * (1 - row[actual.length] / Math.max(actual.length, expected.length, 1)))
}

const forestQuiz = {
  'en-US': ['I’m sweet and grow on a tree. What am I?', ['apple', 'carrot']],
  'ru-RU': ['Я сладкое и расту на дереве. Что я?', ['яблоко', 'морковь']],
  kaa: ['Men mazalıman, terekte ósemen. Men ne?', ['alma', 'geshir']],
  'uz-UZ': ['Men shirinman va daraxtda oʻsaman. Men nimaman?', ['olma', 'sabzi']],
  'kk-KZ': ['Мен тәттімін, ағашта өсемін. Мен немін?', ['алма', 'сәбіз']],
  'tr-TR': ['Tatlıyım ve ağaçta büyürüm. Ben neyim?', ['elma', 'havuç']],
  'es-ES': ['Soy dulce y crezco en un árbol. ¿Qué soy?', ['manzana', 'zanahoria']],
  'de-DE': ['Ich bin süß und wachse am Baum. Was bin ich?', ['Apfel', 'Karotte']],
  'fr-FR': ['Je suis sucrée et je pousse sur un arbre. Qui suis-je ?', ['pomme', 'carotte']],
  'zh-CN': ['我甜甜的，长在树上。我是什么？', ['苹果', '胡萝卜']],
}

// Curated answers keep local chat responsive while avoiding echoing a child's input.
const topicReplies = {
  'en-US': ['Owls can turn their heads very far!', 'I like orange, like my feathers!', 'I like guessing games!'],
  'ru-RU': ['Совы могут далеко поворачивать голову!', 'Мне нравится оранжевый цвет моих перьев!', 'Я люблю загадки!'],
  kaa: ['Úkiler basın uzaqqa bura aladı!', 'Maǵan párlerimniń qızǵısh reńi unaydı!', 'Men jumsbaqlardı jaqsı kóremen!'],
  'uz-UZ': ['Boyoʻgʻlilar boshini ancha uzoqqa bura oladi!', 'Menga patlarimning toʻq sariq rangi yoqadi!', 'Men topishmoqlarni yaxshi koʻraman!'],
  'kk-KZ': ['Үкілер басын алыс бұра алады!', 'Маған қауырсындарымның қызғылт сары түсі ұнайды!', 'Мен жұмбақтарды жақсы көремін!'],
  'tr-TR': ['Baykuşlar başlarını çok uzağa çevirebilir!', 'Tüylerim gibi turuncuyu severim!', 'Bilmece oynamayı severim!'],
  'es-ES': ['¡Los búhos pueden girar mucho la cabeza!', '¡Me gusta el naranja, como mis plumas!', '¡Me gustan las adivinanzas!'],
  'de-DE': ['Eulen können ihren Kopf sehr weit drehen!', 'Ich mag Orange, so wie meine Federn!', 'Ich mag Rätsel!'],
  'fr-FR': ['Les hiboux peuvent tourner la tête très loin !', 'J’aime l’orange, comme mes plumes !', 'J’aime les devinettes !'],
  'zh-CN': ['猫头鹰能把头转得很远！', '我喜欢橙色，像我的羽毛一样！', '我喜欢猜谜语！'],
}

const topicWords = {
  'en-US': [/animal|\bowl|\bcat\b|\bdog\b/, /colou?r|\bblue\b|\bgreen\b/, /\bgame|\bplay\b/],
  'ru-RU': [/животн|сова|кошка|собак/, /цвет|сини|зелен/, /игр|загад/],
  kaa: [/haywan|uki|pıshıq|iyt/, /ren|kok|jasıl/, /oyın|jumsbaq/],
  'uz-UZ': [/hayvon|boyogli|mushuk/, /rang|moviy|yashil/, /oyin|topishmoq/],
  'kk-KZ': [/жануар|укі|мысық/, /тус|кок|жасыл/, /оиын|жумбақ/],
  'tr-TR': [/hayvan|baykus|kedi/, /renk|mavi|yesil/, /oyun|bilmece/],
  'es-ES': [/animal|buho|gato/, /color|azul|verde/, /juego|adivinanza/],
  'de-DE': [/tier|eule|katze/, /farbe|blau|grun/, /spiel|ratsel/],
  'fr-FR': [/animal|hibou|chat/, /couleur|bleu|vert/, /jeu|devinette/],
  'zh-CN': [/动物|猫|狗/, /颜色|蓝色|绿色/, /游戏|玩|谜语/],
}
