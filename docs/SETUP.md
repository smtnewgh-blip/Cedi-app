# Deployment & Setup Guide

**Get CediApp running locally or in production**

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites

- Node.js 16+ (optional, for local dev)
- Git installed
- GitHub account
- Supabase account (free at https://supabase.com)

### Step 1: Clone Repository

```bash
git clone https://github.com/smtnewgh-blip/Cedi-app.git
cd Cedi-app
```

### Step 2: Setup Supabase

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Get API credentials (URL + Key)
3. Create `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_KEY=YOUR_ANON_KEY
```

### Step 3: Run Database Setup

Copy-paste SQL from `docs/SUPABASE.md` into **Supabase SQL Editor**

### Step 4: Test Locally

```bash
# Option 1: Simple HTTP server
python3 -m http.server 8000
# Visit http://localhost:8000

# Option 2: Using npm (if Node installed)
npm install
npm run dev
```

### Step 5: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
# Follow prompts, connects to GitHub automatically
```

**That's it! Your app is live! 🎉**

---

## 🌍 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Pros:**
- ✅ 1-click deployment
- ✅ Free tier (perfect for MVP)
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ GitHub integration

**Steps:**

1. Push code to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Go to [vercel.com](https://vercel.com) → Import GitHub repo
3. Click "Import"
4. Fill in environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_KEY`
5. Click "Deploy"
6. Done! Your app is at `https://cediapp.vercel.app`

**Custom Domain:**
1. Vercel Dashboard → Your project → Settings → Domains
2. Add `cediapp.gh` (if owned)
3. Add DNS records (Vercel provides)
4. Wait 24h for DNS propagation

**Cost:** Free for MVP (up to 100K visitors/month)

---

### Option 2: Netlify (Easy Alternative)

**Pros:**
- ✅ Similar to Vercel
- ✅ Free tier
- ✅ Automatic deployments
- ✅ Easy form handling

**Steps:**

1. Push to GitHub (same as Vercel)
2. Go to [netlify.com](https://netlify.com) → "New site from Git"
3. Choose GitHub
4. Select `smtnewgh-blip/Cedi-app`
5. Build command: (leave blank - it's static HTML)
6. Publish directory: `.` (root)
7. Add environment variables
8. Click "Deploy"

**Your app is at `https://YOUR_SITE.netlify.app`**

**Cost:** Free for MVP

---

### Option 3: Custom Server (Advanced)

For full control, use your own server.

#### Using DigitalOcean (Cheapest - $5/month)

**Setup:**

1. Create DigitalOcean account
2. Create Droplet (Ubuntu 22.04, $5/month)
3. SSH into server

```bash
ssh root@YOUR_IP
```

4. Install dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Nginx
apt install nginx -y

# Install Node.js (if running backend)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install nodejs -y
```

5. Clone repository

```bash
cd /var/www
git clone https://github.com/smtnewgh-blip/Cedi-app.git
cd Cedi-app
```

6. Configure Nginx

```bash
# Create config
sudo nano /etc/nginx/sites-available/cediapp
```

Paste:
```nginx
server {
    listen 80;
    server_name cediapp.gh;  # Your domain
    
    root /var/www/Cedi-app;
    index index.html;
    
    # Serve static files
    location / {
        try_files $uri $uri/ =404;
    }
}
```

7. Enable site and restart

```bash
sudo ln -s /etc/nginx/sites-available/cediapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

8. Setup HTTPS with Let's Encrypt

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d cediapp.gh
# Follow prompts, auto-renews every 90 days
```

9. Set environment variables

```bash
# Create .env file
echo "VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co" > /var/www/Cedi-app/.env
echo "VITE_SUPABASE_KEY=YOUR_ANON_KEY" >> /var/www/Cedi-app/.env
```

**Cost:** $5/month (DigitalOcean)

---

### Option 4: Docker Deployment

For containerization and easy scaling.

#### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install

ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_KEY=${VITE_SUPABASE_KEY}

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

#### Build & Run

```bash
# Build image
docker build -t cediapp .

# Run container
docker run -p 3000:3000 \
  -e VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co \
  -e VITE_SUPABASE_KEY=YOUR_ANON_KEY \
  cediapp
```

#### Deploy to Cloud

**Google Cloud Run** (free tier):
```bash
gcloud run deploy cediapp \
  --source . \
  --platform managed \
  --region us-central1
```

**AWS ECS:**
```bash
# Push to ECR, create task definition, deploy
aws ecs create-service ...
```

---

## 📱 Environment Configuration

### .env.local (Development)

```env
# Supabase
VITE_SUPABASE_URL=https://xyzabc.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Email (optional, for transactional emails)
VITE_SENDGRID_KEY=SG.xxx...

# Analytics (optional)
VITE_MIXPANEL_TOKEN=xxx...

# Feature flags
VITE_ENABLE_EMAIL_VERIFICATION=false
VITE_ENABLE_2FA=false
```

### Production Variables

Same as above, but obtained from secure vaults:

**Vercel:**
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_KEY
```

**Self-hosted:**
```bash
# Use systemd environment
sudo systemctl set-environment VITE_SUPABASE_URL="..."
```

---

## 🔄 Continuous Deployment

### GitHub Actions (CI/CD)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

**Setup:**

1. Create GitHub token: Settings → Developer settings → Personal access tokens
2. Create Vercel token: Account settings → Tokens
3. Add to GitHub secrets: Settings → Secrets → New repository secret

---

## 🔍 Monitoring

### Sentry (Error Tracking)

```javascript
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Errors automatically captured and sent to Sentry
```

### Monitoring Dashboard

Get alerts for:
- ❌ 404 errors
- ❌ Database connection failures
- ❌ Slow API responses
- ⚠️ High error rates
- 📊 Traffic spikes

---

## 🧪 Testing

### Local Testing

```bash
# Test registration flow
1. Open http://localhost:8000
2. Click "Register Now"
3. Fill in form
4. Choose tier
5. Submit
6. Check Supabase DB for new record
```

### Production Testing

```bash
# Test live site
1. Visit https://cediapp.gh
2. Register with test email
3. Verify record in production Supabase
4. Test on mobile (responsive design)
```

---

## 🚨 Troubleshooting

### Problem: "SUPABASE_URL is undefined"

**Solution:** Check `.env.local` is loaded
```bash
# Verify file exists
ls -la .env.local

# Check variables are set
cat .env.local

# Ensure they start with VITE_
VITE_SUPABASE_URL=...  ✅
SUPABASE_URL=...       ❌
```

### Problem: "Cannot register - database connection error"

**Solution:** Verify Supabase setup
```bash
1. Check Supabase project is active
2. Verify API key is correct
3. Check `citizens` table exists
4. Verify RLS policies are enabled
```

### Problem: Page shows blank / 404

**Solution:** Check deployment
```bash
# Vercel
vercel logs --follow

# Netlify
netlify logs:functions

# Custom server
tail -f /var/log/nginx/error.log
```

### Problem: "Registration works locally but fails on production"

**Solution:** Environment variables not set
```bash
# For Vercel
vercel env list
vercel env add VITE_SUPABASE_URL
# Redeploy

# For custom server
sudo systemctl status cediapp
sudo systemctl restart cediapp
```

---

## 📊 Performance Optimization

### For Vercel/Netlify

1. **Enable compression**
   - Automatic (built-in)

2. **Minimize bundle**
   ```bash
   npm run build
   # Check output size
   ```

3. **Cache static files**
   - Automatic (CDN caching)

### For Custom Server

1. **Enable gzip in Nginx**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json;
   ```

2. **Cache headers**
   ```nginx
   expires 30d;
   add_header Cache-Control "public, immutable";
   ```

3. **Use CloudFlare**
   - Add nameservers to CloudFlare
   - Enable auto caching

---

## 🔐 Security Deployment Checklist

Before going live:

- [ ] `.env.local` is in `.gitignore`
- [ ] No API keys in code or git history
- [ ] HTTPS enabled (green lock)
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS set to your domain only
- [ ] RLS policies tested
- [ ] Error messages don't leak info
- [ ] Logging enabled
- [ ] Backups configured
- [ ] Incident plan documented
- [ ] Team trained

---

## 📈 Scaling as You Grow

### 1-100K Users

- ✅ Vercel free tier
- ✅ Single Supabase project
- ✅ No caching needed

### 100K-1M Users

- ⚙️ Vercel Pro ($20/month)
- ⚙️ Add Redis cache
- ⚙️ PostgreSQL performance optimization

### 1M+ Users

- 🔧 Dedicated servers
- 🔧 Database replication
- 🔧 Multi-region deployment
- 🔧 Custom backend API

---

## 📞 Support

**Deployment issues?**

1. Check logs: `vercel logs` or `netlify logs`
2. Verify environment variables
3. Test locally: `python3 -m http.server 8000`
4. Check Supabase status
5. Ask for help: security@cediapp.gh

---

**Your CediApp is ready to deploy! 🚀**
