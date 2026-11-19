# BI AI

BI AI is a voice-first language-learning PWA for kids ages 4–12. It opens in Kid Mode with Free Chat, Repeat After Me, and Story & Quiz. The Parent Zone demo PIN is `1234`.

## Run locally

Requirements are Node.js 22.13+ or 24+, and npm.

```sh
npm ci
npm run dev
```

Open `http://localhost:5173`. To use a different port, run `npm run dev -- --port 3000`.

For the installable build and offline app shell:

```sh
npm run build
npm run preview
```

Open the site once online so the service worker can save the app shell. Install it from a supported browser’s menu. Serve the app over HTTPS outside localhost for service workers and microphone access. The backend serves the build and the API on the same origin.

## Voice and optional AI

The built-in tutor works without an API key. The microphone uses Web Speech recognition where available, and the speaker uses the system’s installed voices. The keyboard button opens text input. Recognition availability, accuracy, and offline capability depend on the browser. Karakalpak lessons stay in Karakalpak. Speech synthesis prefers a Karakalpak voice, then Uzbek or Russian. Browser recognition uses Uzbek as its Karakalpak fallback.

To enable online tutoring, copy `.env.example` to `.env`, set `OPENAI_API_KEY`, and restart the server. A parent can then enable Online AI in Parent Zone. The server uses GPT-4o-mini, an age- and language-specific tutor prompt, and input and output moderation. Set `OPENAI_SPEECH=1` to also enable Whisper transcription and OpenAI speech synthesis. Keep the API key on the server. The app uses local lesson replies if online chat is unavailable.

The demo stores progress, history, profile settings, and daily usage in browser local storage. The daily timer runs while Kid Mode is visible. The pronunciation score uses transcript similarity. The PIN is a local demo gate and the subscription buttons are a pricing mockup. For a public deployment with a paid API key, protect and rate-limit the API at the hosting layer.
