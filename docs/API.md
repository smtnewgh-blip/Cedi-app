# CediApp API Reference

Complete API documentation for CediApp.

---

## 🔑 Authentication

All API calls require authentication using JWT tokens from Supabase.

### Get Auth Token

**Sign Up:**
```bash
curl -X POST https://YOUR_PROJECT.supabase.co/auth/v1/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "user-uuid-here",
    "email": "user@example.com",
    "email_confirmed_at": "2025-05-24T10:00:00Z",
    "phone": "",
    "confirmation_sent_at": "2025-05-24T10:00:00Z",
    "app_metadata": {},
    "user_metadata": {},
    "identities": []
  },
  "session": {
    "provider_token": null,
    "provider_refresh_token": null,
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "sbr_xxx...",
    "expires_in": 3600,
    "expires_at": 1685000460,
    "token_type": "bearer",
    "user": { ... }
  }
}
```

**Sign In:**
```bash
curl -X POST https://YOUR_PROJECT.supabase.co/auth/v1/token?grant_type=password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

### Use Token in Requests

All subsequent API calls must include:

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  https://YOUR_PROJECT.supabase.co/rest/v1/...
```

---

## 📊 Endpoints

### Citizens CRUD

#### Create Citizen (Register)

**POST** `/rest/v1/citizens`

**Request:**
```bash
curl -X POST https://YOUR_PROJECT.supabase.co/rest/v1/citizens \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "unique_id": "GH·ACC·19900524·5678·AB9CD",
    "first_name": "Kwame",
    "last_name": "Mensah",
    "date_of_birth": "1990-05-24",
    "gender": "Male",
    "region": "Greater Accra",
    "gps_address": "GA-123-4567",
    "phone": "+233 24 123 4567",
    "email": "kwame@example.com",
    "tier": "Standard"
  }'
```

**Response (201 Created):**
```json
{
  "id": "citizen-uuid",
  "unique_id": "GH·ACC·19900524·5678·AB9CD",
  "first_name": "Kwame",
  "last_name": "Mensah",
  "date_of_birth": "1990-05-24",
  "gender": "Male",
  "region": "Greater Accra",
  "gps_address": "GA-123-4567",
  "phone": "+233 24 123 4567",
  "email": "kwame@example.com",
  "tier": "Standard",
  "created_at": "2025-05-24T10:00:00Z",
  "updated_at": "2025-05-24T10:00:00Z"
}
```

**JavaScript Example:**
```javascript
const { data, error } = await supabase
  .from('citizens')
  .insert([{
    unique_id: 'GH·ACC·19900524·5678·AB9CD',
    first_name: 'Kwame',
    last_name: 'Mensah',
    date_of_birth: '1990-05-24',
    gender: 'Male',
    region: 'Greater Accra',
    gps_address: 'GA-123-4567',
    phone: '+233 24 123 4567',
    email: 'kwame@example.com',
    tier: 'Standard'
  }])
  .select();
```

**Python Example:**
```python
from supabase import create_client, Client

url = "https://YOUR_PROJECT.supabase.co"
key = "YOUR_ANON_KEY"
supabase: Client = create_client(url, key)

data = supabase.table("citizens").insert({
    "unique_id": "GH·ACC·19900524·5678·AB9CD",
    "first_name": "Kwame",
    "last_name": "Mensah",
    "date_of_birth": "1990-05-24",
    "gender": "Male",
    "region": "Greater Accra",
    "gps_address": "GA-123-4567",
    "phone": "+233 24 123 4567",
    "email": "kwame@example.com",
    "tier": "Standard"
}).execute()
```

#### Get Citizen by ID

**GET** `/rest/v1/citizens?id=eq.CITIZEN_ID`

```bash
curl -X GET "https://YOUR_PROJECT.supabase.co/rest/v1/citizens?id=eq.citizen-uuid" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**JavaScript:**
```javascript
const { data, error } = await supabase
  .from('citizens')
  .select('*')
  .eq('id', 'citizen-uuid')
  .single();
```

#### List All Citizens

**GET** `/rest/v1/citizens`

```bash
curl -X GET https://YOUR_PROJECT.supabase.co/rest/v1/citizens \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**With Filters:**
```bash
# Filter by tier
curl -X GET "https://YOUR_PROJECT.supabase.co/rest/v1/citizens?tier=eq.Gold" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Filter by region
curl -X GET "https://YOUR_PROJECT.supabase.co/rest/v1/citizens?region=eq.Greater%20Accra" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Pagination
curl -X GET "https://YOUR_PROJECT.supabase.co/rest/v1/citizens?offset=0&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**JavaScript:**
```javascript
// All citizens
const { data, error } = await supabase
  .from('citizens')
  .select('*');

// Filter by tier
const { data, error } = await supabase
  .from('citizens')
  .select('*')
  .eq('tier', 'Gold');

// With pagination
const { data, error } = await supabase
  .from('citizens')
  .select('*')
  .range(0, 9);
```

#### Update Citizen

**PATCH** `/rest/v1/citizens?id=eq.CITIZEN_ID`

```bash
curl -X PATCH "https://YOUR_PROJECT.supabase.co/rest/v1/citizens?id=eq.citizen-uuid" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+233 24 999 8888",
    "region": "Ashanti"
  }'
```

**JavaScript:**
```javascript
const { data, error } = await supabase
  .from('citizens')
  .update({
    phone: '+233 24 999 8888',
    region: 'Ashanti'
  })
  .eq('id', 'citizen-uuid')
  .select();
```

#### Delete Citizen

**DELETE** `/rest/v1/citizens?id=eq.CITIZEN_ID`

```bash
curl -X DELETE "https://YOUR_PROJECT.supabase.co/rest/v1/citizens?id=eq.citizen-uuid" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**JavaScript:**
```javascript
const { error } = await supabase
  .from('citizens')
  .delete()
  .eq('id', 'citizen-uuid');
```

---

## 🔍 Query Filters

### Operators

| Operator | Example |
|----------|----------|
| `eq` | `eq.Gold` |
| `neq` | `neq.Basic` |
| `gt` | `created_at=gt.2025-01-01` |
| `gte` | `created_at=gte.2025-01-01` |
| `lt` | `created_at=lt.2025-12-31` |
| `lte` | `created_at=lte.2025-12-31` |
| `like` | `first_name=like.%Kw%` |
| `ilike` | `first_name=ilike.%kw%` (case-insensitive) |
| `in` | `tier=in.(Gold,Standard)` |
| `is` | `phone=is.null` |

### Examples

**Get Standard or Gold tier citizens:**
```bash
curl -X GET "https://YOUR_PROJECT.supabase.co/rest/v1/citizens?tier=in.(Standard,Gold)" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Get citizens registered in last 7 days:**
```bash
curl -X GET "https://YOUR_PROJECT.supabase.co/rest/v1/citizens?created_at=gte.2025-05-17" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Get citizens by name:**
```bash
curl -X GET "https://YOUR_PROJECT.supabase.co/rest/v1/citizens?first_name=like.Kw%" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## ⚠️ Error Responses

### 400 Bad Request

```json
{
  "code": "PGRST102",
  "message": "The result of the filter exceeds the maximum length"
}
```

### 401 Unauthorized

```json
{
  "code": "PGRST301",
  "message": "JWT expired"
}
```

### 403 Forbidden

```json
{
  "code": "PGRST302",
  "message": "Insufficient privileges to update record"
}
```

### 404 Not Found

```json
{
  "code": "PGRST116",
  "message": "The record requested could not be found"
}
```

### 409 Conflict

```json
{
  "code": "23505",
  "message": "Unique violation"
}
```

---

## 📡 Real-time Subscriptions

Listen for changes in real-time:

**JavaScript:**
```javascript
const subscription = supabase
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'citizens'
    },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();

// Unsubscribe when done
supabase.removeSubscription(subscription);
```

---

## 🔐 Rate Limiting

- **Free Plan**: 100 requests/hour per IP
- **Pro Plan**: 1,000 requests/hour per IP
- **Enterprise**: Custom limits

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1621900860
```

---

## 📊 Pagination

**Offset Pagination:**
```bash
# Get page 1 (10 items)
curl -X GET "https://YOUR_PROJECT.supabase.co/rest/v1/citizens?offset=0&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get page 2 (items 10-20)
curl -X GET "https://YOUR_PROJECT.supabase.co/rest/v1/citizens?offset=10&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**JavaScript:**
```javascript
const pageSize = 10;
const page = 1;

const { data, error } = await supabase
  .from('citizens')
  .select('*')
  .range((page - 1) * pageSize, page * pageSize - 1);
```

---

## 🚀 Best Practices

1. **Always use HTTPS** - Never send tokens over HTTP
2. **Rotate tokens** - Refresh tokens regularly
3. **Validate input** - Never trust client input
4. **Handle errors** - Always check for error responses
5. **Use pagination** - Don't fetch all records at once
6. **Cache results** - Store data locally when possible
7. **Rate limit handling** - Implement exponential backoff
8. **Monitor usage** - Track API calls and costs

---

## 📞 Support

For API issues:
- Check [Supabase docs](https://supabase.com/docs)
- Open GitHub issue
- Email: api-support@cediapp.gh
