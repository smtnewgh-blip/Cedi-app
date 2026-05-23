# System Architecture

**CediApp's technical design, data models, and scalability roadmap**

---

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                            │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Browser (Chrome, Firefox, Safari, Edge)              │  │
│  │  • Single-page application (SPA)                       │  │
│  │  • Vanilla HTML/CSS/JavaScript                         │  │
│  │  • Responsive design (mobile-first)                    │  │
│  └────────────────────────────────────────────────────────┘  │
└───��─────────────────────────────────────────────────────────┘
                           ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE LAYER                             │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Auth Service                                          │  │
│  │  • Email/password authentication                       │  │
│  │  • JWT tokens (1 week expiry)                         │  │
│  │  • Row-level security (RLS)                           │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  PostgREST API (Auto-generated REST API)              │  │
│  │  • RESTful endpoints from database schema             │  │
│  │  • Real-time subscriptions (WebSocket)                │  │
│  │  • Automatic query optimization                       │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                   │  │
│  │  • citizens table (RLS + indexes)                     │  │
│  │  • Future: transactions, susu_groups, loans, etc      │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Models

### Current: `citizens` Table

```sql
CREATE TABLE citizens (
  id UUID PRIMARY KEY,                    -- Auto-generated UUID
  unique_id TEXT UNIQUE NOT NULL,         -- Ghana ID (GH·ACC·20250522·7432·A8K9P)
  first_name TEXT NOT NULL,               -- Kwame
  last_name TEXT NOT NULL,                -- Mensah
  date_of_birth DATE,                     -- 1990-05-15
  gender TEXT,                            -- Male | Female | Prefer not to say
  region TEXT,                            -- Greater Accra | Ashanti | etc
  gps_address TEXT,                       -- GA-123-4567
  phone TEXT NOT NULL,                    -- +233 50 123 4567
  email TEXT UNIQUE NOT NULL,             -- kwame@example.com
  tier TEXT NOT NULL,                     -- Basic | Standard | Gold
  created_at TIMESTAMP DEFAULT NOW(),     -- 2025-05-22 10:30:00
  updated_at TIMESTAMP DEFAULT NOW()      -- Auto-updated on change
);
```

**Indexes:**
```sql
CREATE INDEX idx_unique_id ON citizens(unique_id);     -- Fast ID lookup
CREATE INDEX idx_email ON citizens(email);              -- Auth lookups
CREATE INDEX idx_tier ON citizens(tier);                -- Segment queries
CREATE INDEX idx_created_at ON citizens(created_at);    -- Time-range queries
CREATE INDEX idx_region ON citizens(region);            -- Regional analytics
```

### Future Tables

**transactions** (SusuBank+)
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  from_id UUID REFERENCES citizens(id),
  to_id UUID REFERENCES citizens(id),
  amount DECIMAL(15, 2),
  currency TEXT,                          -- GHC | USD | CediCoin
  type TEXT,                              -- transfer | loan | savings
  status TEXT,                            -- pending | completed | failed
  created_at TIMESTAMP
);
```

**susu_groups** (Digital Savings)
```sql
CREATE TABLE susu_groups (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  organizer_id UUID REFERENCES citizens(id),
  member_count INT,
  total_savings DECIMAL(15, 2),
  next_payout DATE,
  created_at TIMESTAMP
);
```

**education_certificates**
```sql
CREATE TABLE education_certificates (
  id UUID PRIMARY KEY,
  citizen_id UUID REFERENCES citizens(id),
  module_name TEXT,
  completion_date DATE,
  cedi_coin_earned DECIMAL(10, 2),
  certificate_url TEXT,
  created_at TIMESTAMP
);
```

---

## 🔐 Authentication Flow

### Registration Process

```
User fills form
     ↓
✓ Validate input
     ↓
Create Auth user (Supabase Auth)
     ↓
Generate Unique ID (algorithm)
     ↓
Insert into citizens table
     ↓
Success → Display UID
```

### Login Process

```
User enters email + password
     ↓
Supabase Auth validates credentials
     ↓
JWT token issued (1 week expiry)
     ↓
Store in localStorage
     ↓
All future requests include JWT
     ↓
API validates JWT → Queries RLS
```

### Row Level Security (RLS)

**Policy 1: Anyone can register**
```sql
CREATE POLICY "Allow registration" ON citizens
  FOR INSERT
  WITH CHECK (true);
```

**Policy 2: Users see only their own data**
```sql
CREATE POLICY "Users view own record" ON citizens
  FOR SELECT
  USING (auth.uid()::text = email);
```

**Policy 3: Users update only their own record**
```sql
CREATE POLICY "Users update own record" ON citizens
  FOR UPDATE
  USING (auth.uid()::text = email);
```

---

## 📡 API Endpoints (Current)

### Auto-generated by PostgREST from `citizens` table:

```
POST /rest/v1/citizens
├─ Headers: Authorization: Bearer JWT_TOKEN
└─ Body: { first_name, last_name, email, ... }

GET /rest/v1/citizens?email=eq.kwame@example.com
├─ Query only your own record (RLS enforces)
└─ Response: [{ id, unique_id, email, ... }]

PATCH /rest/v1/citizens?email=eq.kwame@example.com
├─ Update your own record
└─ Body: { phone, gps_address, ... }

DELETE /rest/v1/citizens?email=eq.kwame@example.com
├─ Delete your own record (careful!)
└─ RLS prevents deleting others' records
```

### JavaScript Client Examples

**Sign up:**
```javascript
const { data, error } = await sb.auth.signUp({
  email: 'kwame@example.com',
  password: 'SecurePass123'
});
```

**Insert record:**
```javascript
const { data, error } = await sb
  .from('citizens')
  .insert([{
    unique_id: 'GH·ACC·20250522·7432·A8K9P',
    first_name: 'Kwame',
    email: 'kwame@example.com',
    tier: 'Standard'
  }]);
```

**Query data:**
```javascript
const { data, error } = await sb
  .from('citizens')
  .select('*')
  .eq('email', 'kwame@example.com')
  .single();
```

---

## 🔄 Data Flows

### Registration Data Flow

```
┌─ User fills form ─────────────┐
│   • Personal info             │
│   • Contact details           │
│   • Citizen tier              │
└──────────────────────────────┘
           ↓ Validation (client-side)
┌─ Check requirements ──────────┐
│   • All fields filled         │
│   • Email format valid        │
│   • Password 8+ chars         │
│   • Age check                 │
└──────────────────────────────┘
           ↓ Network request (HTTPS)
┌─ Supabase Auth ───────────────┐
│   • Create user account       │
│   • Store password (hashed)   │
│   • Issue JWT token           │
└──────────────────────────────┘
           ↓
┌─ Generate Unique ID ──────────┐
│   • Region code (3 chars)     │
│   • DOB (8 digits)            │
│   • Random sequence (4 digits)│
│   • Checksum (5 chars)        │
│   • Format: GH·ACC·...        │
└──────────────────────────────┘
           ↓ RLS allows INSERT
┌─ Insert into DB ──────────────┐
│   • citizens table            │
│   • Automatic timestamps      │
│   • Unique constraints check  │
└──────────────────────────────┘
           ↓
┌─ Success response ────────────┐
│   • Display Unique ID         │
│   • Show confirmation page    │
│   • Store JWT locally         │
└──────────────────────────────┘
```

### Query Flow

```
User logs in
     ↓
JWT token stored in localStorage
     ↓
User requests their data
     ↓
Browser sends: GET /citizens?email=eq.kwame@example.com
               Header: Authorization: Bearer JWT
     ↓
PostgREST receives request
     ↓
Validate JWT → Extract user ID
     ↓
Check RLS policy: auth.uid() = email?
     ↓ YES
Query database
     ↓
Return user's record
     ↓ NO
Deny access (403 Forbidden)
```

---

## 🎯 Unique ID Generation Algorithm

```javascript
function generateUniqueID() {
  const regionCodes = {
    'Greater Accra': 'ACC',
    'Ashanti': 'ASH',
    'Western': 'WES',
    // ... 16 regions
  };

  // Get region code (3 chars)
  const regionCode = regionCodes[userRegion] || 'GHA';

  // Get DOB (YYYYMMDD)
  const dob = userDOB.replace(/-/g, '');

  // Random sequence (4 digits: 1000-9999)
  const sequence = Math.floor(1000 + Math.random() * 9000);

  // Checksum (5 random alphanumeric, no ambiguous chars)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const checksum = Array.from({length: 5}, () => 
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');

  // Format: GH·REGION·DATE·SEQUENCE·CHECKSUM
  return `GH·${regionCode}·${dob}·${sequence}·${checksum}`;
  // Example: GH·ACC·19900515·7432·A8K9P
}
```

**Entropy Analysis:**
- Region: 16 options
- DOB: ~30K combinations (age 18-65)
- Sequence: 9,000 combinations
- Checksum: 33^5 = ~39.3M combinations
- **Total combinations: ~1.7 Trillion** (virtually collision-proof)

---

## 📈 Scalability Roadmap

### Phase 1: MVP (0-100K users)

**Architecture:**
- Single Supabase project
- PostgreSQL on standard tier
- No caching layer
- Simple REST API

**Estimated costs:**
- Database: $25/month
- Storage: $5/month
- Total: ~$30/month

### Phase 2: Growth (100K-1M users)

**Improvements:**
- Redis cache (frequently accessed data)
- Connection pooling (Supabase PgBouncer)
- Database replication for backup
- CDN for static assets

**Estimated costs:**
- Database: $200/month
- Cache: $50/month
- CDN: $30/month
- Total: ~$280/month

### Phase 3: Scale (1M-10M users)

**Changes:**
- Read replicas in multiple regions
- Sharding by region (Greater Accra, Ashanti, etc.)
- GraphQL API layer (Apollo)
- Background job queue (Bullmq)

**Estimated costs:**
- Database: $2K/month
- Replicas: $1K/month
- Caching: $200/month
- API layer: $500/month
- Total: ~$3.7K/month

### Phase 4: Enterprise (10M+ users)

**Architecture:**
- Custom-built backend (move off Supabase)
- Kubernetes deployment
- Multi-region failover
- Blockchain integration
- Analytics warehouse (BigQuery)

**Estimated costs:**
- Infrastructure: $50K+/month
- Team: 20+ engineers
- Operations: 24/7 support

---

## 🧪 Performance & Optimization

### Database Query Optimization

**Problem:** Slow queries with 10M users

**Solutions:**
1. **Indexes**: Create on frequently queried columns
   ```sql
   CREATE INDEX idx_region_tier ON citizens(region, tier);
   -- Fast: SELECT * FROM citizens WHERE region = 'Greater Accra' AND tier = 'Gold'
   ```

2. **Materialized Views**: Pre-compute aggregations
   ```sql
   CREATE MATERIALIZED VIEW citizen_stats AS
   SELECT region, tier, COUNT(*) as count
   FROM citizens
   GROUP BY region, tier;
   ```

3. **Partitioning**: Split table by date/region
   ```sql
   CREATE TABLE citizens_2025_q1 PARTITION OF citizens
   FOR VALUES FROM (2025-01-01) TO (2025-04-01);
   ```

### Client-Side Optimization

1. **Lazy Loading**: Load features as needed
   ```javascript
   const features = await import('./features.js');
   ```

2. **Caching**: Store user data locally
   ```javascript
   localStorage.setItem('userData', JSON.stringify(data));
   ```

3. **Compression**: Gzip responses (automatic with HTTPS)

---

## 🔒 Security Architecture

### Encryption

**In Transit:**
- ✅ HTTPS/TLS 1.3 (all communications)
- ✅ Supabase handles certificates automatically

**At Rest:**
- ✅ PostgreSQL encryption (AES-256)
- ✅ Passwords hashed with bcrypt (Supabase Auth)
- ✅ PII encrypted with `pgcrypto`

### Access Control

**Authentication:**
- Email/password (Supabase Auth)
- JWT tokens (1 week expiry)
- Refresh tokens (secure httpOnly cookie)

**Authorization:**
- Row Level Security (RLS) policies
- Fine-grained access control per table
- Automatic enforcement at database level

### Audit & Monitoring

```sql
-- Enable PostgreSQL audit logging
CREATE EXTENSION IF NOT EXISTS pgaudit;
ALTER DATABASE cediapp SET pgaudit.log = 'ALL';

-- Logs all: SELECT, INSERT, UPDATE, DELETE
-- Viewable in Supabase Dashboard → Logs
```

---

## 🌍 Multi-Region Deployment (Future)

```
┌─────────────────────────────────────────────────┐
│            Global Load Balancer                 │
│         (CloudFlare or Akamai)                 │
└─────────────────────────────────────────────────┘
          ↙              ↓              ↖
   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
   │ EU Region   │ │ Africa Region│ │ Asia Region  │
   │ (Frankfurt) │ │ (Lagos)      │ │ (Singapore)  │
   │  Primary DB │ │  Read Replica│ │  Read Replica│
   └──────────────┘ └──────────────┘ └──────────────┘
```

**Strategy:**
1. Write to primary (Frankfurt for now)
2. Replicate to regional read-only copies
3. Route reads to nearest region
4. Automatic failover if primary fails

---

## 🚀 Monitoring & Observability

### Key Metrics

```
┌─────────────────────────────────────────┐
│ Application Health Dashboard            │
├─────────────────────────────────────────┤
│ Uptime: 99.95%                          │
│ Response Time: 145ms (avg)              │
│ Error Rate: 0.05%                       │
│ Active Users: 45,230                    │
│ Database Size: 2.3 GB                   │
│ Cache Hit Rate: 92%                     │
└─────────────────────────────────────────┘
```

### Logging

**Levels:**
- ERROR: Registration failed, database down
- WARN: Slow query detected, low disk space
- INFO: User registered, payment received
- DEBUG: Full request/response cycle

**Tools:**
- Supabase Logs (included)
- Sentry (error tracking)
- DataDog (APM)

---

## 🔄 CI/CD Pipeline (Future)

```
Developer pushes code
     ↓
GitHub Actions triggered
     ↓
Run tests (Jest)
     ↓
Run linter (ESLint)
     ↓
Build application
     ↓
Deploy to staging
     ↓
Run E2E tests (Cypress)
     ↓ ✅ All pass
Deploy to production (Vercel)
     ↓
Monitor metrics
```

---

## 📚 Technology Stack Summary

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Vanilla JS | No dependencies, fast, secure |
| Backend | Supabase | Rapid development, built-in auth |
| Database | PostgreSQL | ACID compliance, RLS, JSON support |
| Auth | Supabase Auth | Secure by default, JWT tokens |
| API | PostgREST | Auto-generated REST API |
| Hosting | Vercel/Netlify | Easy deployment, CDN included |
| Analytics | Mixpanel | User behavior tracking |

---

## 🎓 Development Guidelines

### Code Structure

```javascript
// ✅ GOOD: Clear, modular
function generateUniqueID() { /* ... */ }

async function registerCitizen(formData) {
  const uid = generateUniqueID();
  const { data, error } = await sb
    .from('citizens')
    .insert([{ unique_id: uid, ...formData }]);
  return { data, error };
}

// ❌ BAD: Monolithic, hard to test
async function handleSubmit(e) {
  e.preventDefault();
  // 200 lines of mixed logic
}
```

### Error Handling

```javascript
// ✅ GOOD: Explicit error handling
try {
  const { data, error } = await sb.auth.signUp({...});
  if (error) throw error;
  return data;
} catch (err) {
  console.error('Signup failed:', err.message);
  showErrorMessage(err.message);
}

// ❌ BAD: Silent failures
const { data } = await sb.auth.signUp({...});
// If error occurs, user sees nothing
```

---

## 🔮 Future Enhancements

1. **Blockchain integration**: CediCoin on Ethereum
2. **Mobile app**: React Native for iOS/Android
3. **SMS fallback**: For low-bandwidth users
4. **Offline sync**: Work without internet, sync later
5. **AI/ML**: Fraud detection, credit scoring
6. **Voice interface**: For illiterate users
7. **AR/VR**: Virtual banks, immersive education
8. **Quantum-ready encryption**: Post-quantum cryptography

---

**This architecture is designed for growth from MVP to 50M+ users while maintaining security, performance, and cost-efficiency.**
