# CediApp — Ghana's Digital Future

> Unified repository: Unique ID decentralized cedi token platform + Next.js/Supabase web app.

## Repository Structure

```
/                        ← CediApp static site (Ghana Unique ID platform)
  index.html             ← Main app (vanilla HTML/JS + Supabase)
  vercel.json            ← Vercel deployment config (static site)
  package.json           ← Dependencies
  docs/                  ← Documentation
  DEPLOYMENT.md          ← Deployment guide
  CHANGELOG.md           ← Version history

/nextjs-app/             ← Next.js 15 + Supabase full-stack app
  app/                   ← Next.js App Router pages
  components/            ← React components
  lib/                   ← Supabase client utilities
  middleware.ts          ← Auth session middleware
  next.config.ts         ← Next.js configuration
  vercel.json            ← Vercel deployment config (Next.js)
```

## Projects

### 1. CediApp Static Site (root)

A static web application providing a decentralized unique ID system for Ghanaian citizens.

**Tech:** Vanilla HTML/JS, Supabase JS SDK, Vercel Speed Insights

**Deploy:** Connect root directory to Vercel. Add env vars:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 2. Next.js Supabase App (`/nextjs-app`)

A full-stack Next.js 15 application with Supabase authentication, AI chat, and protected routes.

**Tech:** Next.js 15, React 19, TypeScript, Supabase SSR, Tailwind CSS, OpenAI

**Deploy:** Connect `/nextjs-app` directory to Vercel. Add env vars:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `OPENAI_API_KEY`

## Quick Start

### Static Site
```bash
npm install
npm run dev   # serves on http://localhost:8000
```

### Next.js App
```bash
cd nextjs-app
npm install
cp .env.example .env.local   # fill in your credentials
npm run dev   # serves on http://localhost:3000
```

## License

MIT © [smtnewgh-blip](https://github.com/smtnewgh-blip)
