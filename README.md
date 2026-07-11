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
| Math Engine | math.js |
| Fonts | System fonts (Arial/Helvetica) |

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Authentication enabled

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

### 3. Run

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
│   └── api/auth/            # Auth API routes
├── components/
│   ├── AgentCard.js         # Agent card component
│   ├── Navbar.js            # Navigation bar
│   ├── ErrorBoundary.js     # Error boundary
│   └── agents/              # 10 AI agent components
├── context/AuthContext.js   # Auth provider
├── data/agents.js           # Agent metadata
├── lib/
│   ├── firebase.js          # Client Firebase SDK
│   └── firebase-admin.js    # Admin Firebase SDK
├── middleware.js             # Route protection + JWT verification
├── public/
│   └── land.mp4             # Background video
└── scripts/migrate.js       # Firestore migration script
```

## Deployment

Any Node.js hosting works. For Vercel:

```bash
npx vercel
```

Make sure to add your `.env.local` variables to your hosting platform's environment variables.

## License

MIT
