# Faaah - Daily Friend Appreciation

Send 5 daily Faahs to your friends. Because they deserve it.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- Add/remove friends (stored locally)
- 5 Faahs per day, resets at midnight
- Custom "Faaah" sound on send/receive
- Confetti animations
- PWA installable (works offline)
- Dark/light mode
- Activity history & stats
- Demo mode (simulated receives)

## Deploy to Cloudflare Pages

```bash
npm run pages:build
npm run pages:deploy
```

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Canvas Confetti
- Local Storage persistence
