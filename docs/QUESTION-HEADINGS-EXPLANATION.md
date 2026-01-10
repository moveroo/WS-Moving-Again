# Question Headings - What We're Actually Doing

**Created:** 2026-01-10  
**Purpose:** Clarify what the question headings analysis and conversion actually does

---

## 🎯 What We're NOT Doing

❌ **We are NOT adding new headings**  
❌ **We are NOT injecting spam content**  
❌ **We are NOT changing page structure**  
❌ **We are NOT adding duplicate content**

---

## ✅ What We ARE Doing

We're analyzing **existing headings** on your pages and suggesting **better formatting** for AI/LLM discoverability.

### The Process:

1. **Analysis Phase** (Current)
   - Scans existing `<h2>` and `<h3>` headings
   - Identifies which are already questions (15%)
   - Identifies which are statements (85%)
   - Suggests converting statements to question format

2. **Conversion Phase** (If you choose to do it)
   - Takes existing headings like "Popular Backloading Routes"
   - Changes them to "What Are the Popular Backloading Routes?"
   - **Same content, same structure, just better formatted**

---

## 📊 What We Found

**Total Headings Across All Pages:** 463 headings

- **Already Questions:** 71 (15%)
  - Examples: "Why Choose Us?", "How Does It Work?"
- **Statements (Could Be Questions):** 392 (85%)
  - Examples: "Popular Backloading Routes", "Routes from Adelaide"

---

## 🔍 Real Examples from Your Pages

### Example 1: Backloading Page

**Current Heading (Statement):**

```html
<h2>Popular Backloading Routes</h2>
```

**Suggested (Question):**

```html
<h2>What Are the Popular Backloading Routes?</h2>
```

**What Changes:**

- ✅ Same heading, same content below it
- ✅ Just adds "What Are" and "?"
- ✅ Better for AI/LLM to understand it's answering a question

---

### Example 2: Adelaide Page

**Current Heading (Statement):**

```html
<h2>Routes from Adelaide</h2>
```

**Suggested (Question):**

```html
<h2>What Routes Are Available from Adelaide?</h2>
```

**What Changes:**

- ✅ Same heading, same content below it
- ✅ Reformatted as a question
- ✅ More natural for voice search and AI queries

---

### Example 3: Backloading Page

**Current Heading (Statement):**

```html
<h2>Backloading vs. Dedicated Truck</h2>
```

**Suggested (Question):**

```html
<h2>What Is the Difference Between Backloading and Dedicated Truck?</h2>
```

**What Changes:**

- ✅ Same heading, same comparison content below
- ✅ Reformatted as a question
- ✅ Better matches how people actually search

---

## 🤔 Why This Matters

### For SEO & AI Discoverability:

1. **Voice Search:** People ask "What routes are available from Adelaide?" not "Routes from Adelaide"
2. **AI/LLM:** Search engines and AI tools better understand question-format headings
3. **Featured Snippets:** Google often pulls from question-format headings for "People Also Ask"
4. **Natural Language:** Matches how users actually search

### It's NOT Spam Because:

- ✅ We're not adding duplicate content
- ✅ We're not keyword stuffing
- ✅ We're reformatting existing headings only
- ✅ Content below headings stays exactly the same
- ✅ Page structure stays the same
- ✅ We're just making headings more natural

---

## 📈 Impact Per Page

### Backloading Page (Example):

- **Total Headings:** 47
- **Already Questions:** 7 (15%)
- **Could Convert:** 40 (85%)
- **What This Means:** 40 existing headings could be reformatted to questions

**NOT:** Adding 40 new headings  
**IS:** Reformatting 40 existing headings

---

## 🎯 What Happens If We Convert

### Before:

```html
<h2>Popular Backloading Routes</h2>
<p>Here are the most popular routes...</p>
```

### After:

```html
<h2>What Are the Popular Backloading Routes?</h2>
<p>Here are the most popular routes...</p>
```

**Same content, same structure, just better formatted heading.**

---

## ⚠️ What We WON'T Convert

The script is smart enough to skip:

- ✅ Headings that are already questions
- ✅ Template variables (like `{route.data.origin}`)
- ✅ Generic descriptions that don't make sense as questions
- ✅ Headings that would be awkward as questions

---

## 💡 Recommendation

**Conservative Approach:**

1. Focus on high-value pages first (backloading, service pages)
2. Convert only the most natural-sounding questions
3. Skip headings that feel forced or awkward
4. Review each suggestion before applying

**Example of Good Conversion:**

- "Popular Backloading Routes" → "What Are the Popular Backloading Routes?" ✅

**Example of Skip:**

- "Adelaide → {route.data.destination}" → Skip (has template variable) ✅

---

## 📝 Summary

**What We're Doing:**

- Analyzing existing headings (not adding new ones)
- Suggesting question format for better AI discoverability
- Reformatting existing content (not duplicating)

**What We're NOT Doing:**

- Adding spam or duplicate content
- Changing page structure
- Injecting new headings
- Keyword stuffing

**The Goal:**

- Make existing headings more natural and search-friendly
- Improve AI/LLM discoverability
- Better match how users actually search

---

**Bottom Line:** We're making your existing headings work better for modern search, not adding spam.
