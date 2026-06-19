# Testing Guide

Comprehensive testing strategies for CediApp.

---

## 🎯 Testing Philosophy

- **Test early, test often** - Catch bugs before production
- **Automate everything** - Manual testing doesn't scale
- **100% critical paths** - Core features need full coverage
- **Fix bugs in tests** - Test what users do
- **Performance matters** - Tests prove speed

---

## 🧪 Testing Types

### 1. Manual Testing (Smoke Tests)

**When:** Before deployment
**How long:** 15 minutes
**Who:** QA, developers

**Checklist:**
```
✅ Navigation
  [ ] Click all nav links
  [ ] Nav shows/hides on mobile
  [ ] Logo redirects to home

✅ Registration Flow
  [ ] Step 1: Fill all fields
  [ ] Step 2: Passwords match
  [ ] Step 3: Select tier
  [ ] Step 4: Review and submit
  [ ] Success message appears
  [ ] Data in Supabase

✅ Pitch Deck
  [ ] All 7 slides visible
  [ ] Dots navigation works
  [ ] Scrolling works
  [ ] Mobile responsive

✅ Mobile Testing
  [ ] No horizontal scroll
  [ ] Touch buttons work
  [ ] Forms accessible
  [ ] Text readable
```

### 2. Unit Tests (Functions)

**Test:** Individual functions in isolation
**Tool:** Jest
**Coverage:** 80%+ critical functions

**Example: Unique ID Generation**

```javascript
// test/uniqueID.test.js
import { generateUniqueID } from '../src/utils.js';

describe('generateUniqueID', () => {
  test('should generate valid ID format', () => {
    const id = generateUniqueID('Greater Accra', '1990-05-24');
    
    // GH·ACC·19900524·5678·AB9CD
    expect(id).toMatch(/^GH·[A-Z]{3}·[0-9]{8}·[0-9]{4}·[A-Z0-9]{5}$/);
  });
  
  test('should use correct region code', () => {
    const id = generateUniqueID('Greater Accra', '1990-05-24');
    expect(id).toContain('·ACC·');
  });
  
  test('should handle all regions', () => {
    const regions = [
      'Greater Accra',
      'Ashanti',
      'Western',
      'Eastern'
    ];
    
    regions.forEach(region => {
      expect(() => generateUniqueID(region, '1990-05-24')).not.toThrow();
    });
  });
  
  test('should throw on invalid input', () => {
    expect(() => generateUniqueID('Invalid', '1990-05-24')).toThrow();
    expect(() => generateUniqueID('Greater Accra', 'invalid-date')).toThrow();
  });
});
```

**Run tests:**
```bash
npm install --save-dev jest
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

### 3. Integration Tests (APIs)

**Test:** Multiple functions working together
**Tool:** Cypress or Playwright
**Coverage:** Happy path + error cases

**Example: Registration Flow**

```javascript
// test/registration.spec.js
describe('Registration Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000');
    cy.contains('Register Now').click();
  });
  
  it('should register a new citizen', () => {
    // Step 1: Personal Info
    cy.get('#rfname').type('Kwame');
    cy.get('#rlname').type('Mensah');
    cy.get('#rdob').type('05/24/1990');
    cy.get('#rgender').select('Male');
    cy.get('#rregion').select('Greater Accra');
    cy.get('#rgps').type('GA-123-4567');
    cy.contains('Continue →').click();
    
    // Step 2: Contact & Security
    cy.get('#rphone').type('+233 24 123 4567');
    cy.get('#remail').type('kwame@example.com');
    cy.get('#rpass').type('SecurePassword123!');
    cy.get('#rpass2').type('SecurePassword123!');
    cy.contains('Continue →').click();
    
    // Step 3: Citizen Tier
    cy.get('#rt2').click(); // Standard tier
    cy.get('#ridValue').should('not.contain', '—');
    cy.contains('Continue →').click();
    
    // Step 4: Confirm
    cy.get('#rconsent').check();
    cy.contains('Register My Unique ID').click();
    
    // Success
    cy.contains('Registration Successful!').should('be.visible');
    cy.get('#rfinalUID').should('not.be.empty');
  });
  
  it('should show error on invalid email', () => {
    cy.get('#rfname').type('Kwame');
    cy.get('#rlname').type('Mensah');
    cy.get('#rdob').type('05/24/1990');
    cy.get('#rgender').select('Male');
    cy.get('#rregion').select('Greater Accra');
    cy.get('#rgps').type('GA-123-4567');
    cy.contains('Continue →').click();
    
    cy.get('#rphone').type('+233 24 123 4567');
    cy.get('#remail').type('invalid-email');
    cy.get('#rpass').type('SecurePassword123!');
    cy.get('#rpass2').type('SecurePassword123!');
    cy.contains('Continue →').click();
    
    cy.get('.err').should('contain', 'Invalid email');
  });
});
```

**Run Cypress tests:**
```bash
npm install --save-dev cypress
npx cypress open  # Interactive
npm test:cypress  # Headless
```

### 4. E2E Tests (Complete User Flows)

**Test:** Full application from user perspective
**Tool:** Playwright or Cypress
**Scenarios:**
- Happy path (success)
- Error handling
- Edge cases
- Performance

**Example: Complete User Journey**

```javascript
// test/e2e.spec.js
describe('E2E: Complete User Journey', () => {
  it('should complete full registration and login flow', async () => {
    // Navigate to app
    await page.goto('http://localhost:8000');
    
    // Register
    await page.click('button:has-text("Register Now")');
    
    // Fill registration form
    const email = `user${Date.now()}@example.com`;
    await page.fill('#rfname', 'Test');
    await page.fill('#rlname', 'User');
    await page.fill('#rdob', '01/01/1990');
    await page.selectOption('#rgender', 'Male');
    await page.selectOption('#rregion', 'Greater Accra');
    await page.fill('#rgps', 'GA-123-4567');
    await page.click('button:has-text("Continue →")');
    
    // Continue through steps 2-4
    await page.fill('#rphone', '+233 24 123 4567');
    await page.fill('#remail', email);
    await page.fill('#rpass', 'TestPassword123!');
    await page.fill('#rpass2', 'TestPassword123!');
    await page.click('button:has-text("Continue →")');
    
    await page.click('#rt1'); // Gold tier
    await page.click('button:has-text("Continue →")');
    
    await page.check('#rconsent');
    await page.click('button:has-text("Register My Unique ID")');
    
    // Verify success
    await expect(page.locator('text=Registration Successful')).toBeVisible();
    
    // Get unique ID
    const uid = await page.textContent('#rfinalUID');
    expect(uid).toMatch(/^GH·[A-Z]{3}·[0-9]{8}·[0-9]{4}·[A-Z0-9]{5}$/);
  });
});
```

### 5. Performance Tests

**Test:** Load times, responsiveness
**Tool:** Lighthouse, WebPageTest

**Metrics to track:**
- First Contentful Paint (FCP) < 1s
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1
- Time to Interactive (TTI) < 3.5s

**Run Lighthouse:**
```bash
npm install -g @lhci/cli@latest lighthouse
lighthouse http://localhost:8000 --view
```

### 6. Security Tests

**Test:** Vulnerabilities, data protection

**Manual Security Checklist:**
```
✅ Authentication
  [ ] Can't access protected pages without login
  [ ] JWT tokens expire
  [ ] Password reset works
  [ ] Session cleared on logout

✅ Authorization
  [ ] Users see only their data
  [ ] RLS policies enforced
  [ ] Admin endpoints protected

✅ Input Validation
  [ ] XSS protection (no script injection)
  [ ] SQL injection prevention
  [ ] Rate limiting works
  [ ] File uploads restricted

✅ Data Protection
  [ ] HTTPS always used
  [ ] Passwords hashed
  [ ] Sensitive data encrypted
  [ ] Error messages don't leak info
```

---

## 📊 Test Coverage

**Target by component:**

| Component | Target | Priority |
|-----------|--------|----------|
| Auth | 95% | Critical |
| Citizen CRUD | 90% | Critical |
| Unique ID Gen | 95% | Critical |
| Form Validation | 85% | High |
| Error Handling | 80% | Medium |
| UI/UX | 50% | Low |

**Check coverage:**
```bash
npm test -- --coverage
```

---

## 🔄 Testing Workflow

### Before Each Commit
```bash
# Run all tests
npm test

# Check coverage
npm test -- --coverage

# Lint code
npm run lint
```

### Before PR
```bash
# Run full test suite
npm test -- --full

# Test on multiple browsers
npm test:chrome
npm test:firefox
npm test:safari

# Performance test
lighthouse http://localhost:8000
```

### Before Deployment
```bash
# Smoke test on staging
SITE=staging npm test:e2e

# Load test
ab -n 1000 -c 10 https://staging.cediapp.gh

# Security scan
npm run security-audit
```

---

## 🧪 Setting Up Tests

### Install Test Dependencies

```bash
# Unit testing
npm install --save-dev jest @testing-library/jest-dom

# E2E testing
npm install --save-dev playwright
# or
npm install --save-dev cypress

# Performance
npm install --save-dev @lhci/cli
```

### Create jest.config.js

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

---

## 📝 Testing Best Practices

1. **Test behavior, not implementation**
   - ✅ "User can register" (what)
   - ❌ "Click button updates state" (how)

2. **Use descriptive test names**
   - ✅ `should validate email format and show error`
   - ❌ `test validation`

3. **Keep tests isolated**
   - Each test independent
   - No shared state
   - Clean up after each test

4. **Mock external dependencies**
   - Mock Supabase API
   - Mock external APIs
   - Isolate tests from network

5. **Test edge cases**
   - Empty inputs
   - Long inputs
   - Special characters
   - Boundary values

---

## ✅ Pre-Launch Checklist

- [ ] All tests passing (100%)
- [ ] Coverage > 80%
- [ ] No console errors
- [ ] No broken links
- [ ] Mobile responsive
- [ ] Lighthouse score > 90
- [ ] Security audit passed
- [ ] Performance benchmarks met
- [ ] Browser compatibility tested
- [ ] Accessibility tested (WCAG 2.1 AA)

---

**Ready to test? Let's build quality software! 🚀**
