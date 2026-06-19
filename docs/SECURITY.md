# Security & Privacy Guide

**Protecting user data and maintaining compliance**

---

## 🔐 Security Overview

CediApp handles sensitive personal and financial data for Ghanaians. Security is built into every layer.

```
┌─────────────────────────────────────────────────┐
│           SECURITY LAYERS                        │
├─────────────────────────────────────────────────┤
│ 1. TRANSPORT: HTTPS/TLS 1.3                     │
│    └─ All data encrypted in transit             │
│                                                  │
│ 2. AUTHENTICATION: JWT Tokens + Email/Password  │
│    └─ User identity verified                    │
│                                                  │
│ 3. AUTHORIZATION: Row Level Security (RLS)      │
│    └─ Users can only access own data            │
│                                                  │
│ 4. STORAGE: PostgreSQL + Encryption             │
│    └─ Data encrypted at rest (AES-256)         │
│                                                  │
│ 5. COMPLIANCE: GDPR + Ghana DPA                 │
│    └─ User rights enforced (delete, export)     │
└─────────────────────────────────────────────────┘
```

---

## 🔒 Transport Security (TLS/SSL)

### HTTPS Enforcement

**All communications MUST use HTTPS.**

```javascript
// ✅ CORRECT (Secure)
const URL = 'https://cediapp.gh/register';

// ❌ WRONG (Insecure)
const URL = 'http://cediapp.gh/register';
```

### Certificate Management

- Vercel: Automatic SSL (free, auto-renew)
- Netlify: Automatic SSL (free, auto-renew)
- Custom server: Let's Encrypt (free, auto-renew with certbot)

### Certificate Pinning (Future Enhancement)

Prevent man-in-the-middle attacks by pinning our certificate:

```javascript
// Add to all API calls
headers: {
  'Public-Key-Pins': 'pin-sha256="..."; max-age=31536000'
}
```

---

## 👤 Authentication

### Email & Password Auth

**Provided by Supabase Auth:**

```javascript
// Registration
const { data, error } = await sb.auth.signUp({
  email: 'kwame@example.com',
  password: 'SecurePassword123'  // Min 8 chars
});

// Login
const { data, error } = await sb.auth.signInWithPassword({
  email: 'kwame@example.com',
  password: 'SecurePassword123'
});

// Get current user
const { data: { user } } = await sb.auth.getUser();

// Logout
await sb.auth.signOut();
```

### JWT Tokens

**How they work:**

```
1. User logs in
   └─ Supabase generates JWT token
   
2. Token stored in localStorage
   └─ Expires in 1 week
   
3. Every API call includes JWT
   Header: Authorization: Bearer eyJhbGciOi...
   
4. Supabase verifies JWT signature
   └─ If valid: allow request
   └─ If expired: return 401 Unauthorized
   
5. Client catches 401 and prompts re-login
   await sb.auth.refreshSession()
```

### Password Requirements

- ✅ Minimum 8 characters
- ✅ Combination of uppercase & lowercase
- ✅ At least one number
- ✅ At least one special character (!@#$%^&*)

**Enforce on frontend:**
```javascript
function validatePassword(pwd) {
  const has8 = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNum = /[0-9]/.test(pwd);
  const hasSpecial = /[!@#$%^&*]/.test(pwd);
  
  return has8 && hasUpper && hasLower && hasNum && hasSpecial;
}
```

### Two-Factor Authentication (2FA) - Future

Enable email/SMS verification:

```javascript
// Step 1: User enters email
await sb.auth.signInWithOtp({
  email: 'kwame@example.com',
  options: { emailRedirectTo: 'https://cediapp.gh/verify' }
});

// Step 2: User receives OTP email
// Step 3: User enters OTP
const { data, error } = await sb.auth.verifyOtp({
  email: 'kwame@example.com',
  token: '123456',
  type: 'email'
});
```

---

## 🛡️ Authorization - Row Level Security (RLS)

### How RLS Works

```sql
-- Policy: Only user can see their own record
CREATE POLICY "Users view own record" ON citizens
  FOR SELECT
  USING (auth.uid()::text = email);
  
-- Example:
-- User A (kwame@example.com) tries to query:
SELECT * FROM citizens WHERE email = 'ama@example.com';

-- Database checks: auth.uid() = 'kwame@example.com' != 'ama@example.com'
-- Result: 0 rows returned (access denied)
```

### Current RLS Policies

```sql
-- 1. Anyone can register (INSERT)
CREATE POLICY "Allow registration" ON citizens
  FOR INSERT
  WITH CHECK (true);

-- 2. Users see only their own record (SELECT)
CREATE POLICY "Users view own record" ON citizens
  FOR SELECT
  USING (auth.uid()::text = email);

-- 3. Users update only their own record (UPDATE)
CREATE POLICY "Users update own record" ON citizens
  FOR UPDATE
  USING (auth.uid()::text = email);

-- 4. Admins can do anything (future)
CREATE POLICY "Admins manage all" ON citizens
  USING (auth.jwt()->'app_metadata'->>'role' = 'admin');
```

### Testing RLS

```javascript
// User A logs in
await sb.auth.signInWithPassword({
  email: 'kwame@example.com',
  password: 'pwd'
});

// Try to fetch User B's data
const { data, error } = await sb
  .from('citizens')
  .select('*')
  .eq('email', 'ama@example.com');

// Result: error = "Rows do not exist" (RLS denied access)
```

---

## 🔐 Data Encryption

### In Transit (TLS/SSL)

```
User Browser  ──HTTPS──  Supabase Server
(encrypted)
```

### At Rest (Database)

```sql
-- PostgreSQL native encryption
CREATE EXTENSION pgcrypto;

-- Encrypt sensitive columns
ALTER TABLE citizens ADD COLUMN gps_encrypted BYTEA;

-- Store encrypted:
INSERT INTO citizens (gps_encrypted) VALUES 
  (pgp_sym_encrypt('GA-123-4567', 'secret_key'));

-- Decrypt on retrieve:
SELECT pgp_sym_decrypt(gps_encrypted, 'secret_key') FROM citizens;
```

### Passwords

```
User enters password
     ↓
Client hashes (bcrypt) → "2b$12$abcdef..."
     ↓
Sent to server (over HTTPS)
     ↓
Server verifies hash
     ↓ Match?
Allow login
```

---

## 🎯 OWASP Top 10 Mitigations

### 1. Broken Access Control

**Risk:** Users access data they shouldn't

**Mitigation:**
- ✅ Row Level Security (RLS) enforced
- ✅ JWT validation on every request
- ✅ API key rate limiting

**Test:**
```javascript
// Try to access another user's data
const { data } = await sb
  .from('citizens')
  .select('*')
  .eq('email', 'attacker@test.com');
// Result: Blocked by RLS
```

### 2. Cryptographic Failures

**Risk:** Sensitive data exposed

**Mitigation:**
- ✅ HTTPS/TLS 1.3 for all traffic
- ✅ Passwords hashed with bcrypt
- ✅ API keys stored in .env (not in code)
- ✅ Database encryption enabled

### 3. Injection (SQL/XSS)

**Risk:** Attacker injects malicious code

**Mitigation:**
- ✅ Parameterized queries (Supabase SDK)
- ✅ HTML escaping (Supabase handles)
- ✅ Input validation (client-side)
- ✅ Content Security Policy (CSP) header

**Safe query:**
```javascript
// ✅ SAFE: Parameterized
const { data } = await sb
  .from('citizens')
  .select('*')
  .eq('email', userInput);

// ❌ UNSAFE: String concatenation (don't do this!)
const query = `SELECT * FROM citizens WHERE email = '${userInput}'`;
```

### 4. Insecure Design

**Risk:** No security in architecture

**Mitigation:**
- ✅ Security designed from start
- ✅ Threat modeling (above)
- ✅ Secure defaults (RLS on by default)
- ✅ Authentication required

### 5. Security Misconfiguration

**Risk:** Wrong settings allow attacks

**Mitigation:**
- ✅ Security headers enabled
- ✅ CORS configured strictly
- ✅ RLS policies enforced
- ✅ API keys rotated monthly

**Verify security headers:**
```bash
curl -I https://cediapp.gh

# Should include:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# Strict-Transport-Security: max-age=...
```

### 6. Vulnerable Components

**Risk:** Outdated libraries with known bugs

**Mitigation:**
- ✅ Dependencies kept current
- ✅ Monthly security audits
- ✅ Automated dependency scanning

```bash
# Check for vulnerabilities
npm audit
npm audit fix

# Update all packages
npm update
```

### 7. Authentication Failures

**Risk:** Weak password reset, session hijacking

**Mitigation:**
- ✅ Password requirements enforced
- ✅ JWT tokens stored securely
- ✅ Automatic logout after 1 week
- ✅ Session invalidation on logout

### 8. Software & Data Integrity Failures

**Risk:** Malicious updates deployed

**Mitigation:**
- ✅ Code review (pull requests)
- ✅ Signed commits (GPG)
- ✅ CI/CD pipeline (automated tests)
- ✅ Deployment verification

### 9. Logging & Monitoring Failures

**Risk:** Attacks not detected

**Mitigation:**
- ✅ All errors logged to Sentry
- ✅ Database access logged
- ✅ Failed login attempts tracked
- ✅ Alerts on suspicious activity

### 10. Server-Side Request Forgery (SSRF)

**Risk:** Server makes requests to internal systems

**Mitigation:**
- ✅ No external API calls (yet)
- ✅ Request validation (future)
- ✅ Network segmentation (future)

---

## 📋 Privacy & Compliance

### GDPR Compliance (EU Users)

**Required:**
- ✅ Privacy policy (link on site)
- ✅ Cookie consent (if using cookies)
- ✅ Data processing agreement (DPA)
- ✅ Right to access (export data)
- ✅ Right to delete (erase data)
- ✅ Right to portability (export format)

**Implement in code:**

```javascript
// 1. Privacy policy link
<a href="https://cediapp.gh/privacy">Privacy Policy</a>

// 2. Export user data (implement)
async function exportUserData() {
  const { data } = await sb
    .from('citizens')
    .select('*')
    .eq('email', user.email);
  
  downloadAsJSON(data, 'my-data.json');
}

// 3. Delete user data (implement)
async function deleteUserData() {
  if (confirm('This cannot be undone!')) {
    await sb.from('citizens').delete().eq('email', user.email);
    await sb.auth.signOut();
  }
}
```

### Ghana Data Protection Act

**Similar to GDPR for Ghana:**
- ✅ Inform users what data is collected
- ✅ Get explicit consent for processing
- ✅ Allow data access/deletion requests
- ✅ Report data breaches within 72 hours
- ✅ Store data in Ghana (server in West Africa)

### Data Retention Policy

```javascript
// Delete data after 5 years of inactivity
// Run monthly as background job

async function purgeInactiveUsers() {
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
  
  const { data } = await sb
    .from('citizens')
    .select('id')
    .lt('updated_at', fiveYearsAgo.toISOString());
  
  // Delete these users
  // Notify them first!
}
```

---

## 🔑 API Key Management

### Types of Keys

```
┌──────────────────────────────────────────┐
│ ANON KEY (Public - Safe to expose)       │
│ • Used in frontend JavaScript            │
│ • Limited to RLS policies                │
│ • Example: public_key_123abc             │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ SERVICE ROLE KEY (Secret - Must protect) │
│ • Used only on backend/server            │
│ • Bypasses RLS (unrestricted access)     │
│ • NEVER expose to frontend               │
│ • Example: service_key_456def            │
└──────────────────────────────────────────┘
```

### Safe Usage

```javascript
// ✅ CORRECT: Anon key in frontend
const sb = supabase.createClient(
  'https://project.supabase.co',
  'pk_eyJ...'  // ANON KEY - safe to expose
);

// ❌ WRONG: Service role key in frontend
const sb = supabase.createClient(
  'https://project.supabase.co',
  'sbprivate_...'  // SERVICE KEY - NEVER expose!
);

// ✅ CORRECT: Service role key on backend
if (Deno.env.get('ENVIRONMENT') === 'SERVER') {
  const adminClient = createClient(
    url,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')  // In .env
  );
}
```

### Key Rotation

Do monthly:

1. Go to Supabase Dashboard → **Settings → API**
2. Click **"Regenerate"** next to anon key
3. Update `.env` and redeploy
4. Old key stops working immediately
5. Monitor for errors (means someone still using old key)

---

## 🚨 Incident Response

### Suspected Breach?

**Immediate (within 1 hour):**
1. ✅ Notify security team
2. ✅ Take affected system offline (if needed)
3. ✅ Document what happened
4. ✅ Check logs for access patterns

**Short term (within 24 hours):**
1. ✅ Investigate root cause
2. ✅ Rotate all API keys
3. ✅ Notify affected users (email)
4. ✅ File incident report

**Example breach email:**
```
Subject: Security Alert - We Experienced a Data Breach

Dear Valued User,

On [DATE], we discovered unauthorized access to our system.
We immediately:
  • Secured the system
  • Rotated all security keys
  • Investigated the breach

What happened:
  [Detailed explanation]

Your data at risk:
  • Email
  • Name
  • DOB
  • GPS address

What to do:
  • Change your password immediately
  • Contact [phone] if suspicious activity
  • Monitor accounts for fraud

We apologize and are committed to preventing this again.
```

---

## ✅ Security Checklist

### Before Launch

- [ ] All environment variables in .env.local (not hardcoded)
- [ ] HTTPS enabled (SSL certificate valid)
- [ ] RLS policies tested and enabled
- [ ] API key permissions limited to minimum
- [ ] Service role key not exposed anywhere
- [ ] Security headers configured
- [ ] Password requirements enforced
- [ ] Email validation implemented
- [ ] Rate limiting enabled
- [ ] CORS restricted to your domain
- [ ] Error messages don't leak information
- [ ] Logging enabled (Sentry or similar)
- [ ] Backup system tested
- [ ] Disaster recovery plan documented
- [ ] Team trained on security practices

### Monthly

- [ ] API keys rotated
- [ ] Dependencies updated
- [ ] Security audit run
- [ ] Logs reviewed for suspicious activity
- [ ] Backup restoration tested
- [ ] Incidents reviewed and lessons learned

### Quarterly

- [ ] Penetration testing
- [ ] Security training refresher
- [ ] Compliance checklist review
- [ ] Disaster recovery drill

---

## 📞 Security Contact

For reporting security vulnerabilities:

**Email:** security@cediapp.gh

**Do NOT:**
- ❌ Post publicly on social media
- ❌ Create GitHub issue
- ❌ Discuss on public forums

We will:
1. Acknowledge within 24 hours
2. Investigate within 48 hours
3. Fix within 30 days (critical)
4. Credit you publicly (if you allow)

---

## 🔗 Resources

- [OWASP Top 10](https://owasp.org/Top10/)
- [Supabase Security](https://supabase.com/docs/guides/auth)
- [GDPR Compliance](https://gdpr-info.eu/)
- [Ghana DPA](https://www.dpab.gov.gh/)
- [Secure Coding](https://cheatsheetseries.owasp.org/)

---

**Your users' data is our top priority. Security is everyone's responsibility.** 🔒
