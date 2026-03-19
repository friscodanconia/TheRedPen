# The Red Pen

See the AI patterns in your writing. Fix them before anyone else notices.

## What this is

A free, client-side writing tool that detects AI tells across 10+ model families. Paste your text, get instant feedback — no backend, no API, no cost. Open `frontend/index.html` and it works.

Not a cheating detector. A self-editing tool for writers who want their prose to sound human.

**Forked from [stop-slop](https://github.com/hardikpandya/stop-slop) by Hardik Pandya** and rebuilt as a comprehensive detection frontend.

## What it catches

### 6 Detection Layers

**1. AI Favorite Words** — 320+ model-tagged entries across 3 tiers. Each word/phrase includes which AI model uses it most, a plain-language explanation, and a suggested replacement.

**2. Model Fingerprinting** — Aggregates model-specific markers (ChatGPT, Claude, DeepSeek, Chinese LLMs, Gemini, Kimi) and attributes when 3+ patterns match a single model. Shows evidence, not verdicts.

**3. Writing Rhythm** — Statistical analysis of sentence length variance, vocabulary diversity (Type-Token Ratio), paragraph shape uniformity, and complexity range. Shown as visual bars with "human range" shaded in green.

**4. Cliche Structures** — 17 structural detectors including binary contrasts ("not X — it's Y"), negative listings, dramatic fragments, rule-of-three abuse, copula avoidance, elegant variation, false ranges, conclusion bloat, ghost citations, emoji formatting, numbered list detection, engagement bait, and more.

**5. Repetition & Padding** — Paragraph-level overlap detection finds paragraphs that restate earlier content. Treadmill marker phrases ("in other words", "as mentioned earlier") flagged separately.

**6. Vague vs Specific** — Counts proper nouns, numbers, dates vs. vague abstractions per paragraph. Flags high-abstraction paragraphs with zero concrete details.

### Phrase Categories

| Category | Examples |
|----------|----------|
| AI Vocabulary | delve, tapestry, multifaceted, robust, seamless |
| Ghost Citations | "studies show", "experts agree" (no named source) |
| Throat-clearing | "in today's fast-paced world", "here's the thing" |
| Engagement Bait | "has anyone else noticed", "would love to hear", "unpopular opinion" |
| Chatbot Artifacts | "I hope this helps", "great question!", "as of my last training" |
| Conclusion Bloat | "in conclusion", "the future looks bright", "exciting times lie ahead" |
| Filler Phrases | "in order to" (→ to), "due to the fact that" (→ because) |
| Meta-commentary | "plot twist:", "but that's another post", "story for another day" |
| Significance Inflation | "provide valuable insights" (902x human rate), "indelible mark" (317x) |

## How results are shown

No jargon. No scores. Every finding includes:
- **What we found** — the specific word, phrase, or pattern
- **Why it matters** — plain-language explanation with data where available
- **What to do instead** — concrete replacement suggestion

Summary bar uses plain labels: "38 AI patterns found", "Strongest match: ChatGPT (29 patterns)", "Word variety: Low", "Sentence rhythm: Flat".

## Project structure

```
TheRedPen/
├── frontend/
│   ├── index.html          # Single-page app
│   ├── styles.css          # Warm cream theme, mobile-first
│   └── app.js              # All detection logic (zero dependencies)
├── references/
│   ├── phrases.md           # Full phrase reference with sources
│   └── structures.md        # Structural pattern reference
├── SKILL.md                 # Claude Code skill (from original stop-slop)
├── CHANGELOG.md
├── README.md
└── LICENSE
```

## Quick start

```bash
# Just open the file — no build step, no install
open frontend/index.html

# Or serve locally
cd frontend && python3 -m http.server 8000
```

Paste text, click **Analyze** (or just paste — it auto-analyzes). Results appear instantly across 5 tabs.

## Design

- **Warm cream theme** (`#FDFBF7`) — no dark mode
- **Source Serif 4** (headlines) + **Inter** (body)
- **Mobile-first** — tested at 390px
- **Inline highlights** — Grammarly-style underlines on detected patterns, hover for details
- **Tabbed findings** — AI Favorite Words, Cliche Structures, Writing Rhythm, Repetition & Padding, Vague vs Specific

## Constraints

- Everything runs client-side. Your text never leaves your browser.
- Zero dependencies. No build step. No API calls.
- No composite scores — just counts and plain descriptions.
- No adversarial detection claims. This is a self-editing tool, not a plagiarism detector.

## Sources

The phrase database consolidates research from 15+ sources including the original stop-slop, Anti-Slop-Writing (GitHub), GPTZero, IsGPT.org, EQBench, Pangram Labs, the FSU "delve" paper, SLOP_Detector, tropes.fyi, and academic papers from Nature and Science. Full source list in `references/phrases.md`.

## Credits

Originally forked from [stop-slop](https://github.com/hardikpandya/stop-slop) by [Hardik Pandya](https://hvpandya.com). Rebuilt as The Red Pen with expanded detection, new frontend, and model fingerprinting.

## License

MIT. Use freely, share widely.
