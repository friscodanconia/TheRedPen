# AI Writing Patterns — Structure Reference

This file documents all structural patterns detected by The Red Pen. These are patterns in how AI organizes sentences and paragraphs, not individual word choices.

## Binary Contrast ("Not X — It's Y")

The #1 confirmed AI writing tell. AI creates false drama through negation before the real point.

**Patterns detected:**
- "Not because X. Because Y."
- "isn't the problem. Y is."
- "The answer isn't X. It's Y."
- "It's not just a tool — it's a revolution."
- "stops being X and starts being Y"
- "not just about X — it's about Y"

**Fix:** State Y directly. "The problem is Y." Drop the negation entirely.

## Negative Listing (Striptease Reveal)

Multiple negations before the actual point. A rhetorical striptease.

**Pattern:** "Not a X... Not a Y... A Z."

**Fix:** State Z. The reader doesn't need the runway.

## Dramatic Fragmentation

Sentence fragments stacked for manufactured profundity.

**Patterns detected:**
- "Speed. Quality. Cost." — 2+ consecutive fragments of ≤3 words
- "And that's it. That's the thing."

**Fix:** Complete sentences. Trust content over formatting.

## Rule of Three Abuse

Tricolons (three-item lists) everywhere. Occasional use is fine; compulsive use (3+ per piece) is AI.

**Pattern:** "X, Y, and Z" appearing 3+ times in a text.

**Fix:** Vary list lengths. Use two items or four. Break the three-beat pattern.

## Copula Avoidance

AI avoids simple "is"/"are" because of training incentives. Instead uses:

| AI writes | Human writes |
|-----------|-------------|
| serves as | is |
| stands as | is |
| functions as | is |
| acts as | is |
| operates as | is |
| boasts | has |
| features | has, includes |
| represents | is |

**Fix:** Just say "is" or "has."

## Elegant Variation (Forced Synonym Cycling)

AI's repetition penalty forces it to cycle synonyms for the same referent within a single paragraph.

**Example:** "the platform" → "the service" → "the tool" → "the solution" — all in one paragraph.

**Synonym groups detected:**
- platform / service / tool / solution / product / system / application
- method / approach / technique / strategy / framework / methodology
- company / firm / organization / enterprise / corporation / business
- person / individual / human / people / humans / individuals

**Fix:** Pick one name and stick with it.

## False Ranges

"From X to Y" where X and Y aren't on a meaningful scale.

**Examples:**
- "From beginners to experts"
- "From small startups to large enterprises"
- "From simple tasks to complex challenges"

**Fix:** Pick your audience and commit. Don't try to include everyone.

## "Not Only... But Also"

Mechanical additive structure used 2-5x more by AI than human writers.

**Fix:** Just list both things. "X and Y" or "X. Also, Y."

## Patronizing Analogies

AI assumes readers need metaphors for everything.

**Patterns:**
- "Think of it as..."
- "It's like a..."
- "Imagine a..."

**Fix:** Use analogies sparingly. Only when they add genuine clarity.

## False Balance / Both-Sides Hedge

AI never commits to a position.

**Patterns:**
- "While X is true, Y is also important"
- "Whether you're a beginner or an expert"

**Fix:** Commit to a position. Say who this is for.

## Conclusion Bloat

AI never trusts the reader to remember what they just read. Multiple conclusion markers in the final paragraph.

**Markers detected:**
- "In conclusion" / "In summary" / "To sum up"
- "As we've seen"
- "The future looks bright"
- "Exciting times lie ahead"
- "embark on"

**Fix:** End with one strong final point. Don't summarize.

## Ghost Citations

Unnamed sources that sound authoritative but cite nothing.

**Patterns:**
- "Studies show" / "Research suggests"
- "Experts agree" / "According to experts"
- "It has been shown" / "It has been proven"

**Fix:** Name the study, expert, or report. If you can't, cut the claim.

## -ing Sentence Openers

Present participle openers at 2-5x the human rate.

**Examples:**
- "Highlighting the importance of..."
- "Ensuring that..."
- "Reflecting broader trends..."

**Fix:** Vary sentence beginnings. Start with subjects, not participles.

## Transition Word Overuse

AI uses formal transitions at 3-5x the human rate.

**Words flagged when density exceeds 1.5 per 100 words:**
furthermore, moreover, additionally, nevertheless, consequently, in addition, on the other hand, however, therefore, thus, hence, accordingly, subsequently, meanwhile

**Fix:** Replace with "also," "and," "but," "so" — or just start the next sentence.

## Statistical Tells (Writing Rhythm)

These aren't structural patterns but measurable properties:

| Metric | AI typical | Human typical |
|--------|-----------|--------------|
| Sentence length stddev | < 3 words | 6-12 words |
| Type-Token Ratio (100-word window) | < 0.5 | 0.6-0.8 |
| Paragraph length stddev | < 5 words | 15-30 words |
| Complexity variance | < 0.2 | 0.5-1.0 |
| Em dashes per 400 words | 4-8 | 0-2 |

## Absence Tells (What AI Never Does)

Things human writers do that AI doesn't:
- Sentence fragments for emphasis ("Not a chance.")
- Profanity or raw language
- Self-contradiction mid-piece
- Inside jokes, obscure references
- Made-up words, neologisms
- Abrupt endings without wrap-up
- Genuine uncertainty ("I don't know")
- Tangents and digressions
- Personal cost ("I wasted $2,000 learning this")
- Sensory specificity ("the coffee was cold")
