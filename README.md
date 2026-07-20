# AI CLUSTER

An AI agent marketplace built with Next.js 14, featuring 10 functional AI agents, Firebase authentication, and a dark cyberpunk UI with video backgrounds.

## Live Features

- **Firebase Auth** — Email/password sign-up, sign-in, Google OAuth, forgot password
- **10 Functional AI Agents** — all working with 100% free solutions (no API keys required):
  - **TextGPT** — Smart text generation with intent detection and streaming output
  - **ImageCraft** — Real AI image generation via Pollinations.ai
  - **CodeWizard** — Code generation across 6 languages with category detection
  - **DataAnalyzer** — Real CSV/JSON file parsing with statistical analysis
  - **TranslatePro** — Real-time translation via MyMemory API (20 languages)
  - **VoiceSynth** — Text-to-speech using the browser's Web Speech API
  - **SummaryBot** — Extractive summarization with word-frequency scoring
  - **ChatMate** — Context-aware conversational AI with topic detection
  - **SEOptimizer** — Real SEO analysis with Flesch-Kincaid readability scoring
  - **MathSolver** — Real equation solving via math.js with step-by-step breakdown
- **Animated splash screen** with particle effects
- **Dark cyberpunk UI** with video backgrounds and gradient accents
- **Responsive design** — works on mobile, tablet, and desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14.2 (App Router) |
| Styling | Tailwind CSS 3.4 |
| Auth | Firebase Auth (Client SDK + Admin SDK) |
| Session | httpOnly cookies with jose JWT decoding |
| Rate Limiting | Upstash Redis (serverless-friendly) |
| Math Engine | math.js |
| Fonts | System fonts (Arial/Helvetica) |

## Getting Started

### Prerequisites

- Node.js 22+
- A Firebase project with Authentication enabled
- An Upstash Redis account (free tier available)

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/ai-cluster.git
cd ai-cluster
npm install
```

### 2. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** > Sign-in methods: Email/Password + Google
4. Go to **Project Settings** > **Service accounts** > Generate new private key
5. Copy values into `.env.local`:

```env
# Client SDK (from Firebase Console > Project Settings > General)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Admin SDK (from the downloaded JSON file)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

### 3. Set up Upstash Redis

1. Go to [upstash.com](https://upstash.com) and create a free account
2. Click "Create Database" and choose Redis
3. Select a region close to your Vercel deployment
4. Copy the **REST API** credentials:

```env
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/
│   ├── page.js              # Splash screen
│   ├── home/page.js         # Landing page with agent grid
│   ├── signin/page.js       # Sign in
│   ├── signup/page.js       # Sign up
│   ├── agents/[id]/page.js  # Individual agent pages
│   └── api/
│       ├── auth/            # Auth API routes
│       └── generate-image/  # Image generation (authenticated)
├── components/
│   ├── AgentCard.js         # Agent card component
│   ├── Navbar.js            # Navigation bar
│   ├── ErrorBoundary.js     # Error boundary
│   └── agents/              # 10 AI agent components
├── context/AuthContext.js   # Auth provider
├── data/agents.js           # Agent metadata
├── lib/
│   ├── firebase.js          # Client Firebase SDK
│   ├── firebase-admin.js    # Admin Firebase SDK
│   ├── rateLimit.js         # Upstash rate limiter
│   └── upstash.js           # Redis client
├── middleware.js             # Route protection + rate limiting
├── public/
│   └── land.mp4             # Background video
└── scripts/migrate.js       # Firestore migration script
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Project Settings
4. Deploy

```bash
npx vercel
```

### Environment Variables for Vercel

Add these to your Vercel project settings:

| Variable | Source |
|----------|--------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Console |
| `FIREBASE_PROJECT_ID` | Firebase Service Account |
| `FIREBASE_CLIENT_EMAIL` | Firebase Service Account |
| `FIREBASE_PRIVATE_KEY` | Firebase Service Account |
| `HUGGINGFACE_API_KEY` | Hugging Face |
| `UPSTASH_REDIS_REST_URL` | Upstash Console |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Console |

## License

MIT
