# The Red Pen — LinkedIn Edition

Your LinkedIn post sounds like AI wrote it. Let's fix that.

A free, client-side tool that detects AI writing patterns in LinkedIn posts. Paste your post, get an AI score from 0-100, fix the issues with one click. Also available as a Chrome extension that scores your posts in real-time as you type.

No backend. No API. No data leaves your browser.

**Built on [stop-slop](https://github.com/hardikpandya/stop-slop) by [Hardik Pandya](https://hvpandya.com)**, rebuilt and focused on LinkedIn.

## What it catches

### 232 Phrase Patterns (from 13 research sources)

| Category | Count | Examples |
|----------|-------|----------|
| AI Vocabulary | 107 | delve, leverage, transformative, robust, seamless |
| Engagement Bait | 19 | "agree?", "drop a comment", "follow me for more" |
| Humble Brags | 10 | "i'm humbled to announce", "honored to share", "pinch me moment" |
| Thought Leader Cliches | 10 | "we need to talk about", "read that again", "hard truth" |
| Journey Narratives | 10 | "here's my story", "fast forward to today", "the lesson?" |
| Filler Phrases | 18 | "in order to" (→ to), "due to the fact that" (→ because) |
| Throat-clearing | 12 | "in today's fast-paced world", "in the ever-evolving landscape" |
| Transitions | 7 | furthermore, moreover, additionally |
| Inflation | 9 | "provide valuable insights" (902x human rate), "unwavering commitment" (202x) |
| Emphasis Crutches | 6 | "let that sink in", "full stop", "make no mistake" |
| + 5 more categories | 24 | meta-commentary, performative depth, treadmill markers, conclusion bloat |

### 13 Structural Detectors

- **Broetry** — sequences of single-sentence paragraphs (LinkedIn scroll-bait)
- **Hook/Payoff** — dramatic short opener designed as a scroll-stopper
- **Hashtag Spam** — more than 5 hashtags
- **Motivational Arc** — struggle → transformation → lesson template
- **Binary Contrasts** — "not X — it's Y" (including cross-paragraph)
- **Negative Listings** — "Not a product. Not a company. A movement."
- **Dramatic Fragments** — short staccato sentences for manufactured drama
- **Numbered Lists** — structured lists where prose would be stronger
- **Emoji Formatting** — emoji used as section markers
- **Conclusion Bloat** — "in conclusion", "the future looks bright"
- **-ing Openers** — present participle sentence starts at 2-5x human rate
- **Transition Density** — formal transitions at 3-5x human rate
- **Not Only But Also** — mechanical additive structure

### Writing Quality Analysis

- **Sentence rhythm** — variance in sentence length
- **Paragraph shape** — uniformity of paragraph sizes
- **Broetry score** — ratio of single-sentence paragraphs
- **Em dash usage** — AI uses em dashes at 4-8x human rate
- **Vagueness detection** — flags paragraphs with zero concrete details
- **Paragraph overlap** — catches restated content

### AI Score (0-100)

Single number summarizing how AI your post sounds. Weighted composite of phrase density (40%), structural hits (20%), broetry ratio (15%), engagement bait (15%), and rhythm issues (10%).

| Score | Verdict |
|-------|---------|
| 0-10 | Sounds human |
| 11-25 | Minor AI traces |
| 26-45 | Noticeable AI patterns |
| 46-65 | Reads like AI wrote it |
| 66-85 | Heavy AI fingerprint |
| 86-100 | Pure LinkedIn slop |

### Click-to-Fix

Phrases with clear substitutions (e.g. "leverage" → "use") have a **Fix** button that applies the replacement directly in the editor and re-scores instantly. No generative AI — just deterministic string replacement. Phrases that need rewriting rather than swapping show suggestions instead.

## Quick start

```bash
# No build step — just open it
open frontend/index.html

# Or serve locally
cd frontend && python3 -m http.server 8000
```

Paste a LinkedIn post, click **Analyze** (or just paste — it auto-analyzes). Results appear across 4 tabs: AI Buzzwords, LinkedIn Cliches, Formatting Tricks, Writing Quality.

## Chrome Extension

Real-time AI scoring inside LinkedIn's compose box.

```bash
# Install locally
# 1. Open chrome://extensions
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select the extension/ directory
```

A score badge appears in LinkedIn editors. Click it for a findings panel with top patterns and suggestions. Same 232-entry engine, all client-side.

## Project structure

```
TheRedPen/
├── frontend/
│   ├── index.html            # Web app
│   ├── styles.css            # DM Sans + Source Serif 4, warm cream theme
│   └── app.js                # Detection engine + UI (zero dependencies)
├── extension/
│   ├── manifest.json          # Chrome Manifest V3
│   ├── engine.js              # Detection engine (extracted from app.js)
│   ├── content.js             # LinkedIn compose box integration
│   ├── content.css            # Badge + panel styles
│   ├── popup.html             # Extension popup
│   ├── privacy.html           # Privacy policy
│   └── icon16/48/128.png      # Extension icons
├── references/
│   ├── phrases.md             # Full phrase database with 13 sources
│   ├── structures.md          # Structural pattern reference
│   └── examples.md            # Before/after examples
├── SKILL.md                   # Claude Code skill
├── CHANGELOG.md
├── README.md
└── LICENSE
```

## Design

- **Warm cream palette** (`#FAF7F2`) with `#C13628` red accent
- **Source Serif 4** (headings) + **DM Sans** (body)
- **Mobile-first** — tested at 390px
- **Dark score block** with horizontal thermometer
- **Red left-border** on finding cards (the "red pen mark")
- **Staggered entrance animations** on results

## Data sources

The phrase database consolidates research from 13 sources:

1. stop-slop (Hardik Pandya) — 49 phrases, 7 structures
2. Anti-Slop-Writing (GitHub) — 500+ vocabulary items
3. IsGPT.org — 56 phrases with frequency multipliers
4. EQBench Slop Score — 1,650 word list
5. Pangram Labs — 100+ nouns, 70+ verbs
6. FSU "delve" paper — 21 focal words
7. GPTZero AI Vocabulary — 50+ phrases
8. SLOP_Detector (GitHub) — 209 fiction patterns
9. Humanizer skill (GitHub/blader) — 24 pattern categories
10. Becky Tuch / Lit Mag News — 15 creative writing tells
11. tropes.fyi — 32 named AI writing tropes
12. Wikipedia: Signs of AI Writing
13. Academic papers (Nature, Science journals)

## Privacy

Everything runs client-side. Your text never leaves your browser. No analytics, no cookies, no tracking, no accounts. See [extension/privacy.html](extension/privacy.html) for the full privacy policy.

## Credits

Originally forked from [stop-slop](https://github.com/hardikpandya/stop-slop) by [Hardik Pandya](https://hvpandya.com). Rebuilt as The Red Pen LinkedIn Edition with expanded detection, AI scoring, click-to-fix editing, and Chrome extension.

## License

MIT
