# Supabase Configuration Guide

**Database schema, authentication setup, and backend configuration**

---

## 📋 Prerequisites

1. Supabase account (free tier at https://supabase.com)
2. GitHub account (for OAuth later)
3. CediApp repository cloned locally

---

## 🔧 Initial Setup

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → Sign in/Create account
2. Click **"New Project"**
3. Fill in:
   - **Project name**: `cediapp` (or similar)
   - **Database password**: Generate strong password
   - **Region**: Choose closest to Ghana (e.g., Europe, then migrate)
4. Click **"Create new project"** (takes ~2 min)

### Step 2: Get Your API Keys

1. Go to **Settings** → **API**
2. Copy and save:
   - **Project URL**: `https://YOUR_PROJECT.supabase.co`
   - **Anon/Public Key**: (under "API keys")
3. Update `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_KEY=YOUR_ANON_KEY
   ```

### Step 3: Create the `citizens` Table

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **"New query"**
3. Paste the following SQL:

```sql
-- Create citizens table
CREATE TABLE citizens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unique_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Prefer not to say')),
  region TEXT,
  gps_address TEXT,
  phone TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('Basic', 'Standard', 'Gold')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_unique_id ON citizens(unique_id);
CREATE INDEX idx_email ON citizens(email);
CREATE INDEX idx_tier ON citizens(tier);
CREATE INDEX idx_created_at ON citizens(created_at DESC);
CREATE INDEX idx_region ON citizens(region);

-- Enable RLS (Row Level Security)
ALTER TABLE citizens ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for registration)
CREATE POLICY "Allow anyone to register" ON citizens
  FOR INSERT
  WITH CHECK (true);

-- Allow users to view only their own record
CREATE POLICY "Users can view own record" ON citizens
  FOR SELECT
  USING (auth.uid()::text = email); -- Matches auth user email to citizens email

-- Allow users to update only their own record
CREATE POLICY "Users can update own record" ON citizens
  FOR UPDATE
  USING (auth.uid()::text = email);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_citizens_updated_at
BEFORE UPDATE ON citizens
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

4. Click **"Run"** and confirm

### Step 4: Verify Setup

1. Go to **Table Editor**
2. You should see the `citizens` table with columns
3. Click on the table → **"Insert"** → Add a test record manually to verify

---

## 🔑 Authentication Setup

### Email/Password Auth (Default)

CediApp uses Supabase's built-in email/password authentication.

**Current Configuration:**
- Email verification: ❌ Disabled (MVP mode)
- Password requirements: ✅ Min 8 characters
- Session timeout: Default (1 week)

**To enable email verification:**

1. Go to **Authentication** → **Providers**
2. Click **"Email"**
3. Toggle **"Confirm email"** to ON
4. Check **"Require email confirmation to sign up"**
5. Save

### OAuth Providers (Future)

To add Google/GitHub login:

1. Go to **Authentication** → **Providers**
2. Click **"Google"** or **"GitHub"**
3. Follow the prompts (get client ID/secret from respective provider)
4. Enable and save

---

## 🗄️ Table Schemas Explained

### `citizens` Table Columns

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `id` | UUID | Auto-generated unique ID | `550e8400-e29b-41d4-a716-446655440000` |
| `unique_id` | TEXT | Ghana Unique ID | `GH·ACC·20250522·7432·A8K9P` |
| `first_name` | TEXT | User's first name | `Kwame` |
| `last_name` | TEXT | User's last name | `Mensah` |
| `date_of_birth` | DATE | DOB in YYYY-MM-DD | `1990-05-15` |
| `gender` | TEXT | Gender (enum) | `Male` |
| `region` | TEXT | Region name | `Greater Accra` |
| `gps_address` | TEXT | Ghana Post GPS code | `GA-123-4567` |
| `phone` | TEXT | Phone number | `+233 50 123 4567` |
| `email` | TEXT | Email address | `kwame@example.com` |
| `tier` | TEXT | Citizen tier (enum) | `Standard` |
| `created_at` | TIMESTAMP | Registration timestamp | `2025-05-22 10:30:00` |
| `updated_at` | TIMESTAMP | Last update timestamp | `2025-05-22 10:30:00` |

---

## 🔐 Row Level Security (RLS)

RLS controls who can access what data.

**Current policies:**

1. **Anyone can register** (INSERT)
   ```sql
   CREATE POLICY "Allow anyone to register" ON citizens
     FOR INSERT
     WITH CHECK (true);
   ```

2. **Users can only view/edit their own record** (SELECT, UPDATE)
   ```sql
   CREATE POLICY "Users can view own record" ON citizens
     FOR SELECT
     USING (auth.uid()::text = email);
   ```

**Testing RLS:**

```javascript
// In browser console
const { data, error } = await sb
  .from('citizens')
  .select('*')
  .eq('email', 'kwame@example.com');

console.log(data);  // Only visible if logged in as that user
```

---

## 📊 Useful Queries

### Get all citizens (admin only)

```sql
SELECT * FROM citizens ORDER BY created_at DESC;
```

### Count registrations by tier

```sql
SELECT tier, COUNT(*) as count
FROM citizens
GROUP BY tier
ORDER BY count DESC;
```

### Count registrations by region

```sql
SELECT region, COUNT(*) as count
FROM citizens
GROUP BY region
ORDER BY count DESC;
```

### Get registrations in last 7 days

```sql
SELECT *
FROM citizens
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

### Find duplicate emails (should be 0)

```sql
SELECT email, COUNT(*) as count
FROM citizens
GROUP BY email
HAVING COUNT(*) > 1;
```

---

## 🔌 API Integration in Code

### Current Implementation

The app uses Supabase JS SDK v2:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### Initialize Client

```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_KEY = 'YOUR_ANON_KEY';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
```

### Sign Up

```javascript
const { data, error } = await sb.auth.signUp({
  email: 'kwame@example.com',
  password: 'SecurePassword123'
});

if (error) console.error('Signup failed:', error.message);
else console.log('User created:', data.user.id);
```

### Insert Registration Record

```javascript
const { data, error } = await sb.from('citizens').insert([{
  unique_id: 'GH·ACC·20250522·7432·A8K9P',
  first_name: 'Kwame',
  last_name: 'Mensah',
  date_of_birth: '1990-05-15',
  gender: 'Male',
  region: 'Greater Accra',
  gps_address: 'GA-123-4567',
  phone: '+233 50 123 4567',
  email: 'kwame@example.com',
  tier: 'Standard'
}]);

if (error) console.error('Insert failed:', error.message);
else console.log('Registration saved:', data);
```

### Query Data

```javascript
// Get current user
const { data: user } = await sb.auth.getUser();

// Get citizen record
const { data, error } = await sb
  .from('citizens')
  .select('*')
  .eq('email', user.email)
  .single();

console.log(data); // { unique_id, first_name, ... }
```

---

## 🚨 Troubleshooting

### Problem: "SUPABASE_URL is undefined"

**Solution:** Check `.env.local` is loaded correctly:
```bash
# Verify in browser console
console.log(import.meta.env.VITE_SUPABASE_URL);

# If undefined, ensure .env.local is in root directory
# And variables start with VITE_
```

### Problem: "Column 'x' does not exist"

**Solution:** Run the SQL setup script again. Check table in **Table Editor**.

### Problem: "User already registered" error

**Solution:** Supabase requires unique emails. Either:
- Use a different email
- Delete the auth user (in **Authentication** → **Users**)
- Then register again

### Problem: Registration succeeds but no data appears in table

**Solution:**
1. Check RLS is configured correctly (verify INSERT policy exists)
2. Check the `insert` query runs without errors in browser console
3. Verify table name is exactly `citizens` (case-sensitive)

---

## 🔄 Database Backups

### Automatic Backups

Supabase provides:
- ✅ Daily backups (automatic)
- ✅ 7-day retention (free tier)
- ✅ Point-in-time recovery

**To restore:**

1. Go to **Settings** → **Backups**
2. Click **"Restore from backup"**
3. Select timestamp
4. Confirm

### Manual Export

```bash
# Export via CLI
supabase db pull  # Pulls schema

# Or export via Supabase Dashboard
# Settings → Backups → Download SQL
```

---

## 📈 Monitoring & Metrics

### Check Usage

1. Go to **Settings** → **Billing**
2. View:
   - Database size
   - Monthly active users (MAU)
   - Storage used

### View Logs

1. Go to **Logs** section
2. Filter by:
   - Query logs
   - Auth events
   - Error logs

### Example: Check failed registrations

```sql
-- See all error logs
SELECT * FROM pg_stat_statements
WHERE query LIKE '%INSERT%citizens%'
ORDER BY mean_time DESC;
```

---

## 🔐 Security Checklist

- [ ] API key is in `.env.local` (not committed)
- [ ] `.env.local` is in `.gitignore`
- [ ] RLS is enabled on all tables
- [ ] RLS policies are restrictive (not public)
- [ ] Email verification enabled in production
- [ ] HTTPS enforced (automatic with Supabase)
- [ ] Rate limiting configured (future)
- [ ] Audit logs enabled (future)

---

## 🚀 Next Steps

1. ✅ Create Supabase project
2. ✅ Set up API keys
3. ✅ Create `citizens` table
4. ✅ Test registration locally
5. 🔮 Add email verification
6. 🔮 Set up OAuth (Google, GitHub)
7. 🔮 Configure additional tables (transactions, loans, etc.)
8. 🔮 Set up webhooks for notifications
9. 🔮 Implement audit logging

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [JavaScript Client Library](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
