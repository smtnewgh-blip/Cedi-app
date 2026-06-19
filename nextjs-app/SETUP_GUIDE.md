# Cedi App Complete Setup Guide

This guide will walk you through setting up your Cedi App for production deployment.

## 📋 Prerequisites

Before you start, you'll need:
- **Node.js 18+** - [Download here](https://nodejs.org)
- **Supabase account** - [Create free account](https://supabase.com)
- **OpenAI API key** - [Get your key](https://platform.openai.com)
- **GitHub account** - (Already have it!)
- **Vercel account** - [Sign up free](https://vercel.com)

---

## 🚀 Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in the project details:
   - **Project Name**: `cedi-app`
   - **Database Password**: Create a strong password
   - **Region**: Select your closest region
4. Wait for project to be created (2-3 minutes)
5. Go to **Settings → API**
6. Copy these values:
   - `Project URL` (looks like: `https://xxx.supabase.co`)
   - `Publishable Key` (starts with `eyJhbG...`)

---

## 🤖 Step 2: Get OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in or create account
3. Go to **API keys** section
4. Click **"Create new secret key"**
5. Copy the key (you'll only see it once!)
6. Keep it safe - don't share it!

---

## 💻 Step 3: Local Setup

### Option A: Automated Setup (Recommended)

**On Mac/Linux:**
```bash
cd nextjs-with-supabase
chmod +x setup.sh
./setup.sh
```

**On Windows:**
```bash
cd nextjs-with-supabase
setup.bat
```

Then follow the prompts to enter your credentials.

### Option B: Manual Setup

1. Clone the repository:
```bash
git clone https://github.com/smtnewgh-blip/nextjs-with-supabase.git
cd nextjs-with-supabase
```

2. Create `.env.local` file:
```bash
cp .env.example .env.local
```

3. Edit `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbG...
OPENAI_API_KEY=sk-proj-xxx...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Install dependencies:
```bash
npm install
```

5. Start development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

---

## ✅ Step 4: Test Locally

1. Visit **http://localhost:3000**
2. You should see the Cedi App homepage
3. Test the theme switcher (moon/sun icon)
4. Check the browser console for errors

---

## 🌍 Step 5: Deploy to Vercel

### Automatic Deployment (Recommended)

1. Click this button:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/smtnewgh-blip/nextjs-with-supabase)

2. Sign in to Vercel
3. Authorize GitHub integration
4. Configure environment variables:
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - Add `OPENAI_API_KEY`
5. Click **Deploy**
6. Wait for deployment (2-5 minutes)
7. Your app is now live!

### Manual Deployment

1. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click **Add New Project**
4. Select your repository
5. Set environment variables
6. Click **Deploy**

---

## 🧪 Step 6: Test Production Features

### Test Authentication
1. Click "Sign up" button
2. Enter email and password
3. You should see a verification email

### Test AI Chat
1. Make a POST request to `/api/ai/chat`:
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

2. You should get an AI response

### Test Theme Switcher
1. Click the moon/sun icon
2. Page should switch between light and dark mode

---

## 🔐 Production Checklist

Before going live:

- [ ] Environment variables are set securely
- [ ] OpenAI API key has sufficient quota
- [ ] Supabase authentication is enabled
- [ ] Database backups are configured
- [ ] Domain is set up (optional)
- [ ] SSL certificate is active (automatic on Vercel)
- [ ] Error tracking is configured
- [ ] Logging is working
- [ ] Performance is optimized
- [ ] Security headers are in place

---

## 🆘 Troubleshooting

### "Missing environment variables"
- Check `.env.local` file exists
- Verify all three variables are present
- Restart dev server after changes

### "Supabase connection error"
- Verify URL format: `https://xxx.supabase.co`
- Check publishable key is correct
- Ensure Supabase project is active

### "OpenAI API error"
- Verify API key is correct
- Check you have API credits available
- Ensure API key has not been revoked

### "Build failed on Vercel"
- Check build logs in Vercel dashboard
- Verify environment variables are set
- Try deploying again

---

## 📚 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI Documentation](https://platform.openai.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

## 📞 Support

For issues:
1. Check the [GitHub Issues](https://github.com/smtnewgh-blip/nextjs-with-supabase/issues)
2. Review this guide's Troubleshooting section
3. Check official documentation for each service

---

## ✨ You're All Set!

Your Cedi App is ready to use. Happy coding! 🚀
