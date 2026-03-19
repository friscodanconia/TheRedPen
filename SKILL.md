---
name: the-red-pen
description: Detect and remove AI writing patterns from prose. Use when drafting, editing, or reviewing text to eliminate predictable AI tells across vocabulary, structure, rhythm, and formatting.
metadata:
  trigger: Writing prose, editing drafts, reviewing content for AI patterns, checking for AI tells
  author: Originally by Hardik Pandya (stop-slop), rebuilt as The Red Pen
---

# The Red Pen

Detect and remove AI writing patterns from prose. Based on 320+ catalogued AI tells across 10+ model families.

## Core Rules

1. **Cut AI-favorite words.** Remove tier-1 red flags (delve, tapestry, multifaceted, robust, seamless, etc.) and tier-2 signals. Replace with plain alternatives. See [references/phrases.md](references/phrases.md).

2. **Remove engagement bait.** Cut "has anyone else noticed", "would love to hear", "unpopular opinion", "agree or disagree" and similar prompts that farm interaction instead of making a point.

3. **Eliminate ghost citations.** "Studies show" and "experts agree" without naming the source. Name it or cut it.

4. **Break formulaic structures.** No binary contrasts ("not X — it's Y"), negative listings, dramatic fragments, rule-of-three abuse, copula avoidance ("serves as" → "is"), or conclusion bloat. See [references/structures.md](references/structures.md).

5. **Use active voice with human subjects.** No passive constructions. No inanimate objects performing human actions ("the complaint becomes a fix" → "the team fixed it").

6. **Be concrete.** No vague declaratives ("The implications are significant"). Name the specific thing. Include proper nouns, numbers, dates, quotes, and sensory details.

7. **Vary rhythm.** Mix sentence lengths (3 words to 40+). Vary paragraph lengths. Avoid uniform complexity. Watch em-dash overuse.

8. **Cut padding.** Remove treadmill markers ("in other words", "as mentioned earlier"). Don't restate what you already said.

9. **Remove chatbot artifacts.** Delete "I hope this helps", "great question!", knowledge-cutoff disclaimers, and other conversational AI leftovers.

10. **Skip meta-commentary.** No "plot twist:", "here's where it gets interesting", or "that's a story for another day." Let the content speak.

## Quick Checks

Before delivering prose, verify:

- Any words from the AI vocabulary list? Replace them.
- Any ghost citations ("studies show")? Name the source or cut.
- Any engagement bait ("thoughts?", "who else")? Cut it.
- Any "not X — it's Y" contrasts? State Y directly.
- Any emoji used as section headers? Remove.
- Numbered/bulleted list where prose would work? Convert to narrative.
- Three+ formal transitions (furthermore, moreover)? Replace with "also" or just start the sentence.
- Any chatbot leftovers ("I hope this helps")? Delete immediately.
- All paragraphs roughly the same length? Vary them.
- Any paragraph with zero concrete details? Add specifics.
- Conclusion that summarizes everything? Cut the summary, end on a strong point.

## Detection Layers

| Layer | What it catches |
|-------|----------------|
| AI Favorite Words | 320+ model-tagged phrases across 15 categories |
| Model Fingerprinting | ChatGPT, Claude, DeepSeek, Chinese LLM, Gemini attribution |
| Writing Rhythm | Sentence variance, vocabulary diversity, paragraph uniformity |
| Cliche Structures | 17 structural patterns (binary contrasts, fragments, etc.) |
| Repetition & Padding | Paragraph overlap, treadmill markers |
| Vague vs Specific | Concrete details vs. abstract filler per paragraph |

## Frontend

Open `frontend/index.html` for the interactive detector. Zero dependencies, runs entirely in the browser.

## References

- [references/phrases.md](references/phrases.md) — Full phrase database with model tags and sources
- [references/structures.md](references/structures.md) — Structural patterns and statistical tells

## License

MIT
