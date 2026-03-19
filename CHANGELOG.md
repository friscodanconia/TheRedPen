# Changelog

## 2026-03-20 — The Red Pen v1.0

### Rebuilt from stop-slop

Complete rewrite as **The Red Pen** — a comprehensive, free, client-side AI writing pattern detector.

**Frontend (new)**
- Single-column warm cream layout (Source Serif 4 + Inter, `#FDFBF7` background)
- 5-tab findings panel: AI Favorite Words, Cliche Structures, Writing Rhythm, Repetition & Padding, Vague vs Specific
- Inline Grammarly-style highlight overlay with hover tooltips
- Summary bar with plain-language labels (no jargon, no scores)
- Model fingerprinting attribution (ChatGPT, Claude, DeepSeek, Chinese LLMs)
- Mobile-first design tested at 390px
- Auto-analyze on paste, copy report button
- Zero dependencies — open index.html and it works

**Phrase database (320+ entries)**
- Expanded from 49 → 320+ model-tagged entries across 15 categories
- Model attribution: ChatGPT, Claude, DeepSeek, Chinese LLMs, Gemini, Kimi
- 3 tiers: universal red flags, strong signals, moderate signals
- New categories: engagement bait, ghost citations, chatbot artifacts, significance inflation, copula avoidance, filler phrases, conclusion bloat
- Every entry includes: plain-language explanation + suggested replacement

**Detection engine (6 layers)**
- Layer 1: Phrase matching (320+ entries with word boundary checking)
- Layer 2: Model fingerprinting (aggregates model-specific markers, shows when 3+)
- Layer 3: Writing rhythm (sentence length variance, TTR, paragraph uniformity, complexity range, em dash count)
- Layer 4: Structural detectors expanded from 7 → 17 (added copula avoidance, elegant variation, false ranges, not-only-but-also, patronizing analogies, false balance, conclusion bloat, ghost citations, -ing openers, transition density, numbered list detection, emoji formatting)
- Layer 5: Treadmill detector (paragraph overlap analysis + marker phrases)
- Layer 6: Concreteness scorer (proper nouns/numbers vs. vague abstractions per paragraph)

**Reference docs**
- phrases.md: expanded with full database, model tags, and source list
- structures.md: expanded with all 17 structural patterns + statistical tells

## 2026-01-13

### Added (original stop-slop)

**Phrases**
- Throat-clearing, performative emphasis, telling instead of showing

**Structures**
- Binary contrasts, rhythm patterns, word patterns

## 2026-01-12

- Restructured skill following Claude Code best practices
- Split into SKILL.md and references/ folder

## 2025-01-12

- Initial release by Hardik Pandya
