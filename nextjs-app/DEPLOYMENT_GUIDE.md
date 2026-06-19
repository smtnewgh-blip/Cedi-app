# 🚀 Cedi App - Complete Deployment Guide

## Step 1: Get Your Vercel Credentials

### Get VERCEL_TOKEN:
1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name: `cedi-app-deployment`
4. Expiration: 7 days (or longer)
5. Copy the token immediately (you won't see it again!)

### Get VERCEL_ORG_ID:
1. Go to https://vercel.com/account
2. In URL, you'll see: `vercel.com/account?teamId=XXXXX`
3. Copy that XXXXX value

### Get VERCEL_PROJECT_ID:
1. Go to https://vercel.com/dashboard
2. Click on your Cedi App project
3. Go to Settings → General
4. Copy `Project ID`

---

## Step 2: Get Your Supabase Credentials

### Get NEXT_PUBLIC_SUPABASE_URL:
1. Go to https://supabase.com
2. Open your Cedi App project
3. Go to Settings → API
4. Copy `Project URL` (looks like: `https://xxxxx.supabase.co`)

### Get NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
1. Same Settings → API page
2. Copy `Publishable Key` (starts with `eyJhbG...`)

---

## Step 3: Get Your OpenAI API Key

### Get OPENAI_API_KEY:
1. Go to https://platform.openai.com/account/api-keys
2. Click "Create new secret key"
3. Copy immediately and save safely!

---

## Step 4: Add Secrets to GitHub

1. Go to: https://github.com/smtnewgh-blip/nextjs-with-supabase/settings/secrets/actions

2. Click "New repository secret" for each:

### Secret 1: VERCEL_TOKEN
- Name: `VERCEL_TOKEN`
- Value: `your-vercel-token-here`

### Secret 2: VERCEL_ORG_ID
- Name: `VERCEL_ORG_ID`
- Value: `your-org-id-here`

### Secret 3: VERCEL_PROJECT_ID
- Name: `VERCEL_PROJECT_ID`
- Value: `your-project-id-here`

### Secret 4: NEXT_PUBLIC_SUPABASE_URL
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://xxxxx.supabase.co`

### Secret 5: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- Name: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Value: `eyJhbG...`

### Secret 6: OPENAI_API_KEY
- Name: `OPENAI_API_KEY`
- Value: `sk-proj-xxxxx`

---

## Step 5: Deploy Your App

### Option A: Automatic Deploy (Recommended)
```bash
cd nextjs-with-supabase
git push origin main
```

GitHub Actions will automatically:
- ✅ Build your app
- ✅ Test everything
- ✅ Deploy to Vercel
- ✅ Your app goes LIVE!

Check progress: https://github.com/smtnewgh-blip/nextjs-with-supabase/actions

### Option B: Manual Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/smtnewgh-blip/nextjs-with-supabase)

---

## Step 6: Your Live App

After deployment, your app will be at:
```
https://nextjs-with-supabase-[random].vercel.app
```

Or with custom domain:
- Go to Vercel Dashboard → Your Project → Settings → Domains
- Add your custom domain

---

## ✅ Final Checklist

- [ ] Got Vercel Token
- [ ] Got Vercel Org ID
- [ ] Got Vercel Project ID
- [ ] Got Supabase URL
- [ ] Got Supabase Key
- [ ] Got OpenAI API Key
- [ ] Added all 6 secrets to GitHub
- [ ] Pushed to main branch
- [ ] GitHub Actions deployed
- [ ] App is LIVE! 🎉

---

## 🔗 Quick Links

| Item | Link |
|------|------|
| GitHub Secrets | https://github.com/smtnewgh-blip/nextjs-with-supabase/settings/secrets/actions |
| GitHub Actions | https://github.com/smtnewgh-blip/nextjs-with-supabase/actions |
| Vercel Dashboard | https://vercel.com/dashboard |
| Vercel Tokens | https://vercel.com/account/tokens |
| Supabase Dashboard | https://supabase.com |
| OpenAI API Keys | https://platform.openai.com/account/api-keys |

---

## 🆘 Troubleshooting

### "Build failed"
- Check GitHub Actions logs
- Verify all secrets are set
- Ensure secret values are correct (no extra spaces)

### "Deployment failed"
- Check Vercel dashboard
- Verify VERCEL_TOKEN is valid
- Ensure VERCEL_PROJECT_ID is correct

### "App won't load"
- Check browser console for errors
- Verify Supabase credentials
- Check OpenAI API key has credits

---

**🎉 Your app is ready to deploy! Follow the steps above to go LIVE!** 🚀
