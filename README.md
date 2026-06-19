# CediApp — Ghana's Digital Future

> Unique ID decentralized cedi token platform for Ghana's digital identity infrastructure.

## Overview

CediApp is a static web application that provides a decentralized unique ID system for Ghanaian citizens, integrating with Supabase for secure data storage and authentication.

## Features

- Unique ID generation for Ghanaian citizens
- Supabase-powered authentication and database
- Vercel Speed Insights integration
- Fully responsive design

## Quick Start

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/smtnewgh-blip/Cedi-app.git
   cd Cedi-app
   ```

2. Create a `.env.local` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
   ```

3. Install dependencies and run locally:
   ```bash
   npm install
   npm run dev
   ```

4. Open [http://localhost:8000](http://localhost:8000)

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy — Vercel will auto-detect the static site configuration

### Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key |

## Documentation

- [Setup Guide](docs/SETUP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Security](docs/SECURITY.md)
- [Testing](docs/TESTING.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Contributing](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

## License

MIT © [smtnewgh-blip](https://github.com/smtnewgh-blip)
