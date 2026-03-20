# Changelog

## 2026-03-20 — LinkedIn Edition v2.0

### LinkedIn focus
- Repositioned from generic AI detector to LinkedIn-specific tool
- Tagline: "Your LinkedIn post sounds like AI wrote it. Let's fix that."
- All copy, explanations, and suggestions reference LinkedIn specifically

### AI Score (0-100)
- Horizontal thermometer with color-coded fill (green/amber/red)
- Weighted composite: phrase density (40%), structural hits (20%), broetry (15%), engagement bait (15%), rhythm (10%)
- Six verdict labels from "Sounds human" to "Pure LinkedIn slop"

### Click-to-Fix
- Fix/Remove buttons on every phrase finding
- Deterministic replacements (no AI rewriting)
- Auto re-scores after each fix

### 4 new LinkedIn categories (30 entries)
- **Humble brags** — "i'm humbled to announce", "honored to share", "pinch me moment"
- **Journey narratives** — "here's my story", "fast forward to today", "the lesson?"
- **Thought leader cliches** — "we need to talk about", "read that again", "hard truth"
- Moved "let that sink in" and "read that again" from generic emphasis to thought_leader

### 4 new LinkedIn structural detectors
- **Broetry** — sequences of 3+ single-sentence paragraphs
- **Hashtag spam** — flags >5 hashtags
- **Hook/payoff** — dramatic short opener ("I quit my job.")
- **Motivational arc** — struggle → transformation → lesson template

### Cross-paragraph contrast detection
- Binary contrast detector now catches "don't [verb] X / They [verb] Y" split across paragraphs

### Expanded phrase database (176 → 232 entries)
- Restored 30 tier-2 vocabulary entries from research
- Added 5 filler phrases, 6 throat-clearing, 4 emphasis crutches
- Added 4 IsGPT high-multiplier phrases (902x, 317x, 207x, 202x)
- Added Claude hedging patterns (4) and DeepSeek patterns (3)
- Sources: 13 documented research sources

### Smart quote normalization
- Fixed: text copied from LinkedIn uses curly quotes (U+2019) not straight apostrophes
- All matching now normalizes smart quotes before comparison

### Simplified rhythm analysis
- Removed: complexityRange, wordVariety (TTR) — too academic
- Added: broetryScore — ratio of single-sentence paragraphs

### UI restructure
- 5 tabs → 4: AI Buzzwords, LinkedIn Cliches, Formatting Tricks, Writing Quality
- 5-item summary bar → 4: total patterns, worst category, broetry score, engagement bait
- Model fingerprinting de-emphasized (kept internally, removed from summary bar)
- New sample text: classic LinkedIn humble-brag/journey post

### Removed (not relevant to LinkedIn)
- ~70 tier-3 literary vocabulary entries (gossamer, labyrinth, ephemeral, etc.)
- ghost_citation category (9 entries)
- chatbot_artifact category (10 entries)
- copula_avoidance category (5 entries)
- 6 structural detectors: ghostCitations, copulaAvoidance, elegantVariation, falseRanges, patronizingAnalogy, falseBalance

### Design overhaul
- DM Sans body font (replaced Inter)
- Dark score block with horizontal thermometer
- Red left-border on finding cards
- Staggered entrance animations
- Warm cream palette (#FAF7F2)

### Chrome Extension
- Manifest V3, targets linkedin.com
- Real-time score badge in LinkedIn compose boxes
- Click-to-expand findings panel
- Same 232-entry engine, all client-side
- Privacy policy included

## 2026-03-20 — The Red Pen v1.0

### Rebuilt from stop-slop
- Complete rewrite as The Red Pen
- 320+ phrase entries, 17 structural detectors, 6 detection layers
- Source Serif 4 + Inter, warm cream theme
- 5-tab findings panel, inline highlights, model fingerprinting

## 2026-01-13 — Original stop-slop
- Initial phrases and structures by Hardik Pandya
