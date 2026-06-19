# Contributing to CediApp

Thank you for your interest in contributing to CediApp! We welcome contributions from developers, designers, and community members.

---

## 🎯 Code of Conduct

Please be respectful and inclusive. We're building a platform for millions of Ghanaians.

- Be kind and supportive
- Welcome diverse perspectives
- Report issues constructively
- Give credit to others

---

## 🚀 How to Contribute

### 1. Fork the Repository

```bash
# Visit https://github.com/smtnewgh-blip/Cedi-app
# Click "Fork" in top right
```

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/Cedi-app.git
cd Cedi-app
```

### 3. Create a Branch

```bash
# Update main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Or bugfix branch
git checkout -b fix/your-bug-name
```

**Branch naming:**
- Feature: `feature/add-two-factor-auth`
- Bugfix: `fix/registration-error`
- Docs: `docs/api-reference`
- Test: `test/citizen-registration`

### 4. Make Changes

**File Structure:**
```
Cedi-app/
├── index.html           # Main application
├── docs/                # Documentation
│   ├── ARCHITECTURE.md
│   ├── SECURITY.md
│   ├── SETUP.md
│   ├── API.md
│   └── TESTING.md
├── tests/               # Tests (coming)
├── assets/              # Images, fonts (coming)
└── README.md
```

### 5. Coding Standards

**HTML:**
```html
<!-- ✅ Good: Clear, semantic -->
<form id="registration-form">
  <label for="first_name">First Name</label>
  <input id="first_name" type="text" required/>
</form>

<!-- ❌ Avoid: Unclear, not semantic -->
<form>
  <label>Name</label>
  <input type="text"/>
</form>
```

**CSS:**
```css
/* ✅ Good: Organized, uses variables */
.btn-primary {
  background: var(--gold);
  padding: 0.85rem 2rem;
  border-radius: 6px;
  transition: all 0.2s;
}

/* ❌ Avoid: Magic numbers, hard to maintain */
.btn-primary {
  background: #D4A017;
  padding: 13.6px 32px;
  border-radius: 6px;
  transition: background-color 0.2s ease-in-out;
}
```

**JavaScript:**
```javascript
// ✅ Good: Clear naming, error handling
async function registerCitizen(formData) {
  try {
    const { data, error } = await supabase
      .from('citizens')
      .insert([formData])
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (err) {
    console.error('Registration failed:', err);
    throw new Error('Failed to register citizen');
  }
}

// ❌ Avoid: Unclear naming, no error handling
async function reg(x) {
  const r = await supabase.from('citizens').insert([x]);
  return r.data[0];
}
```

### 6. Commit Changes

```bash
# Stage files
git add .

# Commit with clear message
git commit -m "feature: add two-factor authentication"

# Format: type: description
# Types: feature, fix, docs, test, style, refactor, chore
```

**Good commit messages:**
- `feature: add email verification`
- `fix: resolve registration form validation bug`
- `docs: update API reference`
- `test: add unit tests for Unique ID generation`

**Bad commit messages:**
- `update`
- `fix stuff`
- `made changes`

### 7. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 8. Create Pull Request

1. Go to https://github.com/smtnewgh-blip/Cedi-app
2. Click "Pull requests" tab
3. Click "New pull request"
4. Select your branch
5. Fill in the template below

**PR Template:**
```markdown
## Description
Briefly describe what you changed and why.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Performance improvement

## How to Test
Steps to verify the changes work:
1. Go to registration form
2. Fill in data
3. Submit
4. Verify citizen created in Supabase

## Screenshots (if applicable)
[Add images here]

## Checklist
- [ ] Code follows style guide
- [ ] Self-reviewed my changes
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No new warnings generated
```

### 9. Code Review

Maintainers will review your PR:
- ✅ Accept - merged to main
- 📝 Request changes - address feedback
- ❌ Reject - explain why

**Be prepared to:**
- Explain your approach
- Make requested changes
- Update tests/docs
- Answer questions

---

## 🐛 Report a Bug

### Use the Bug Report Template

```markdown
## Description
Clear description of the bug.

## Steps to Reproduce
1. Go to...
2. Click...
3. Fill...
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happened

## Error Message
(Paste full error if available)

## Environment
- Browser: Chrome 120
- OS: Ubuntu 22.04
- Supabase Project: xyz

## Screenshots
[Add images]
```

### Open Issue on GitHub

1. Go to [Issues](https://github.com/smtnewgh-blip/Cedi-app/issues)
2. Click "New issue"
3. Fill in the template
4. Submit

---

## 💡 Request a Feature

```markdown
## Feature Request

### Problem
What problem does this solve?

### Solution
How should it work?

### Example
Why would this be useful?

### Additional Context
Any other info
```

---

## 📚 Documentation Updates

Help improve documentation!

### Types of Docs
- README improvements
- API documentation
- Setup guides
- Architecture diagrams
- Troubleshooting tips

### Edit Docs

```bash
# Find file in docs/
git checkout -b docs/improve-security-guide

# Make changes
nano docs/SECURITY.md

# Commit and push
git add docs/SECURITY.md
git commit -m "docs: improve security guide"
git push origin docs/improve-security-guide
```

---

## 🧪 Add Tests

Help improve test coverage!

### Test Types
- Unit tests (functions)
- Integration tests (APIs)
- E2E tests (user flows)
- Security tests

See [docs/TESTING.md](docs/TESTING.md) for details.

---

## 💬 Communication

### Get Help
- **Questions**: Open GitHub Discussions
- **Bugs**: Open GitHub Issues
- **Urgent**: Email dev@cediapp.gh

### Discussion Topics
- Architecture decisions
- Design suggestions
- Performance ideas
- Security concerns

---

## 📋 Contribution Levels

### Level 1: Beginner
- ✏️ Fix typos
- 📝 Improve docs
- 🐛 Report bugs
- 💡 Suggest features

### Level 2: Intermediate
- 🎨 UI/UX improvements
- ✨ Small features
- 🧪 Add tests
- 📚 Write guides

### Level 3: Advanced
- 🏗️ Architecture changes
- 📡 API enhancements
- 🔐 Security improvements
- 📊 Performance optimization

### Level 4: Expert
- 🚀 Major features
- 🌐 Multi-region support
- 🤖 AI integration
- 💼 Enterprise features

---

## 🏆 Recognition

Contributors are recognized:
- In README.md (Contributor section)
- In releases (CHANGELOG.md)
- On website (coming)
- In email shoutouts

---

## ✅ Contribution Checklist

- [ ] Fork repository
- [ ] Create feature branch
- [ ] Follow coding standards
- [ ] Add/update tests
- [ ] Update documentation
- [ ] Clear commit messages
- [ ] Push to fork
- [ ] Create pull request
- [ ] Respond to feedback
- [ ] Celebrate! 🎉

---

## 🚫 What We Can't Accept

- ❌ Duplicate of existing feature
- ❌ Changes violating code of conduct
- ❌ No tests for new features
- ❌ Breaks existing functionality
- ❌ Large PRs (split into smaller ones)
- ❌ No documentation
- ❌ Sensitive data in code

---

## 📞 Questions?

- **GitHub Discussions**: Ask here first
- **Issues**: Report bugs/features
- **Email**: dev@cediapp.gh
- **Slack**: Join dev community

---

**Thank you for contributing to CediApp! 🇬🇭**
