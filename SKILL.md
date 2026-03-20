---
name: the-red-pen
description: Detect and remove AI writing patterns from LinkedIn posts. Use when drafting, editing, or reviewing LinkedIn content to eliminate AI tells across vocabulary, structure, rhythm, and formatting.
metadata:
  trigger: Writing LinkedIn posts, editing LinkedIn drafts, reviewing content for AI patterns, checking for LinkedIn AI cliches
  author: Originally by Hardik Pandya (stop-slop), rebuilt as The Red Pen LinkedIn Edition
---

# The Red Pen — LinkedIn Edition

Detect and remove AI writing patterns from LinkedIn posts. 232 catalogued AI tells focused on what actually appears on LinkedIn.

## Core Rules

1. **Cut AI-favorite words.** Remove tier-1 red flags (delve, leverage, transformative, robust, seamless, etc.) and tier-2 signals. Replace with plain alternatives. See [references/phrases.md](references/phrases.md).

2. **Remove engagement bait.** Cut "agree?", "drop a comment", "follow me for more", "tag someone who", "save this for later" — anything that farms interaction instead of making a point.

3. **Kill humble brags.** Replace "I'm humbled to announce" with just the announcement. "Honored to share" → just share. "Still can't believe" → you can believe it, you posted about it.

4. **Avoid thought-leader framing.** No "we need to talk about", "read that again", "hard truth", "nobody tells you this." State your point directly.

5. **Skip journey narratives.** No "here's my story", "fast forward to today", "the lesson?" Tell the story without the template.

6. **Break formulaic structures.** No binary contrasts ("not X — it's Y"), negative listings, broetry (single-sentence paragraphs stacked vertically), or motivational arcs (struggle → transformation → lesson).

7. **Limit hashtags.** 3-5 maximum. More is spam.

8. **Be concrete.** No vague declaratives. Include proper nouns, numbers, dates, quotes.

9. **Vary rhythm.** Mix sentence lengths. Vary paragraph sizes. Watch em-dash overuse.

10. **Cut padding.** Remove treadmill markers, throat-clearing openers, and conclusion bloat. LinkedIn posts don't need summaries.

## Quick Checks

Before posting on LinkedIn, verify:

- Any words from the AI vocabulary list? Replace them.
- Any engagement bait ("thoughts?", "agree?")? Cut it.
- Any humble brags ("humbled to announce")? Just announce it.
- Any "not X — it's Y" contrasts? State Y directly.
- More than 5 hashtags? Pick your top 3.
- Mostly single-sentence paragraphs (broetry)? Write real paragraphs.
- Dramatic short opener ("I quit my job.")? Consider whether it's earned.
- Three+ formal transitions (furthermore, moreover)? Replace with "also" or just start the sentence.
- All paragraphs roughly the same length? Vary them.
- Any paragraph with zero concrete details? Add specifics.
- Conclusion that summarizes? Cut it, end on your strongest point.

## Detection Layers

| Layer | What it catches |
|-------|----------------|
| AI Buzzwords | 149 entries: vocabulary, filler, phrases, transitions, inflation |
| LinkedIn Cliches | 83 entries: engagement bait, humble brags, thought leader, journey narrative, throat-clearing, emphasis, meta, performative, treadmill, conclusion bloat |
| Formatting Tricks | Broetry, hook/payoff, hashtag spam, emoji formatting, numbered lists, fragments |
| Writing Quality | Sentence rhythm, paragraph shape, broetry score, em dashes, binary contrasts, negative listings, motivational arc, vagueness, paragraph overlap |

## AI Score

0-100 scale. 0 = sounds human, 100 = pure AI slop. Weighted: phrase density (40%), structural hits (20%), broetry (15%), engagement bait (15%), rhythm (10%).

## Frontend

Open `frontend/index.html` for the interactive detector. Zero dependencies, runs in the browser.

## Chrome Extension

Install from `extension/` directory for real-time scoring inside LinkedIn compose boxes.

## References

- [references/phrases.md](references/phrases.md) — Full phrase database with 13 sources
- [references/structures.md](references/structures.md) — Structural pattern reference
- [references/examples.md](references/examples.md) — Before/after examples

## License

MIT
