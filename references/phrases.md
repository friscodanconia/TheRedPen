# AI Writing Patterns — Phrase Reference

This file documents all AI-associated phrases detected by The Red Pen. Organized by category with model attribution, replacement suggestions, and explanations.

## Tier 1 — Universal Red Flags

These appear in virtually every AI detection database. Usage spiked dramatically after LLM adoption.

| Phrase | Models | Replace with |
|--------|--------|-------------|
| delve | ChatGPT | explore, examine, dig into |
| tapestry | ChatGPT | mix, combination, fabric |
| testament | ChatGPT | proof, evidence, sign |
| pivotal | ChatGPT | key, important, critical |
| underscore | ChatGPT, Claude | show, highlight, reveal |
| intricate / intricacies | ChatGPT | complex, detailed, involved |
| meticulous | ChatGPT | careful, thorough, precise |
| crucial | ChatGPT, Claude | important, key, essential |
| landscape (abstract) | ChatGPT | field, area, world |
| foster | ChatGPT | encourage, support, build |
| vibrant | ChatGPT | lively, active, rich |
| comprehensive | ChatGPT, Chinese LLM | complete, thorough, full |
| showcase | ChatGPT | show, display, demonstrate |
| robust | ChatGPT | strong, solid, reliable |
| seamless | ChatGPT | smooth, easy, simple |
| nuanced | ChatGPT, Claude | subtle, complex, layered |
| realm | ChatGPT, DeepSeek | area, field, domain |
| enhance | ChatGPT | improve, boost, strengthen |
| innovative | ChatGPT | new, creative, original |
| groundbreaking | ChatGPT | new, first, pioneering |
| multifaceted | ChatGPT | complex, varied, many-sided |
| leverage | ChatGPT | use, apply, take advantage of |
| holistic | ChatGPT | complete, whole, overall |
| transformative | ChatGPT | powerful, significant |
| embark | ChatGPT | start, begin, set out |

## Tier 2 — Strong Signals

Appear in 3+ databases with elevated frequency in AI text.

| Phrase | Models | Replace with |
|--------|--------|-------------|
| navigate | ChatGPT | handle, manage, deal with |
| bolster | ChatGPT | strengthen, support, boost |
| garner | ChatGPT | get, earn, attract |
| enduring | ChatGPT | lasting, permanent |
| interplay | ChatGPT | interaction, relationship |
| beacon | ChatGPT | example, guide, light |
| harness | ChatGPT | use, apply, channel |
| streamline | ChatGPT | simplify, speed up |
| commence | ChatGPT | start, begin |
| facilitate | ChatGPT | help, enable, make possible |
| utilize | ChatGPT | use |
| profound | ChatGPT, Chinese LLM | deep, significant, major |
| renowned | ChatGPT | famous, well-known |
| encompass | ChatGPT | include, cover, span |
| exemplify | ChatGPT | show, demonstrate |
| cultivate | ChatGPT | build, develop, grow |
| paramount | ChatGPT | most important, essential |
| noteworthy | ChatGPT | notable, interesting |
| versatile | ChatGPT | flexible, adaptable |
| commendable | ChatGPT | impressive, good |
| spearhead | ChatGPT | lead, drive, start |
| elucidate | ChatGPT | explain, clarify |
| burgeoning | ChatGPT | growing, expanding |
| propel | ChatGPT | drive, push, move forward |
| synergy | ChatGPT | cooperation, combined effect |
| myriad | ChatGPT | many, countless |
| plethora | ChatGPT | many, lots of |
| resonate | ChatGPT | connect, appeal, ring true |
| trajectory | ChatGPT | path, direction, trend |
| paradigm | ChatGPT | model, approach, way of thinking |
| proliferation | ChatGPT | spread, growth, increase |
| catalyze | ChatGPT | trigger, spark, start |
| imperative | ChatGPT | essential, necessary, urgent |
| albeit | ChatGPT | although, though |
| arguably | ChatGPT, Claude | (just argue it) |
| overarching | ChatGPT | main, overall, broad |
| unparalleled | ChatGPT | unique, exceptional |
| foundational | ChatGPT | basic, fundamental, core |
| undeniable | ChatGPT | clear, obvious, strong |

## Tier 3 — Moderate Signals

Appear in 1-2 databases, still elevated in AI text.

| Phrase | Models | Replace with |
|--------|--------|-------------|
| gossamer | ChatGPT | thin, delicate, light |
| labyrinth | ChatGPT | maze, tangle, complexity |
| enigma | ChatGPT | mystery, puzzle |
| symphony | ChatGPT | combination, blend |
| tableau | ChatGPT | scene, picture |
| confluence | ChatGPT | meeting, combination |
| ephemeral | ChatGPT | brief, temporary, fleeting |
| luminous | ChatGPT | bright, glowing |
| palpable | ChatGPT | obvious, strong, felt |
| aforementioned | ChatGPT | this, the, that |
| notwithstanding | ChatGPT | despite, regardless |
| henceforth | ChatGPT | from now on |
| whilst | ChatGPT, Kimi | while |

## Model-Specific Patterns

### Claude Hedging
| Phrase | Replace with |
|--------|-------------|
| it's worth noting | (just state the point) |
| while this may vary | (cut or be specific) |
| in many cases | (name the cases or cut) |
| generally speaking | (cut — just speak) |
| i should note | (just note it) |
| it's important to consider | (consider it directly) |
| it's important to note | (just state it) |

### DeepSeek
| Phrase | Replace with |
|--------|-------------|
| in the realm of | in |
| unlocking | enabling, finding |
| unveiling | showing, revealing |
| paving the way | enabling, making possible |

### Chinese LLMs (shared patterns)
| Phrase | Replace with |
|--------|-------------|
| play an important role | matter, help with |
| make great efforts | work hard, try |
| at the same time | also, meanwhile |
| harmonious | balanced, smooth |

## Ghost Citations

Unnamed sources that should be cited or cut.

- "studies show" / "research suggests"
- "experts agree" / "according to experts"
- "it has been shown" / "industry reports"
- "some critics argue" / "several publications"
- "observers have cited"

## Throat-Clearing Openers

Cut entirely. Start with the point.

- "here's the thing"
- "the uncomfortable truth is"
- "in today's fast-paced world"
- "in the ever-evolving landscape of"
- "in an era where"
- "in today's digital age"
- "let me be clear"
- "the truth is"
- "can we talk about"

## Emphasis Crutches

Delete. Let content speak for itself.

- "full stop." / "period."
- "let that sink in"
- "this matters because"
- "make no mistake"
- "here's why that matters"

## Chatbot Artifacts

Dead giveaways of AI-generated text. Remove immediately.

- "i hope this helps"
- "of course!" / "certainly!"
- "great question!"
- "that's an excellent point"
- "would you like me to"
- "let me know if"
- "as of my last [training]"

## Filler Phrases

Replace with shorter alternatives.

| Avoid | Use |
|-------|-----|
| in order to | to |
| due to the fact that | because |
| at this point in time | now |
| in the event that | if |
| has the ability to | can |
| it is important to note that | (cut) |

## Significance Inflation (IsGPT multipliers)

| Phrase | Multiplier vs human text |
|--------|-------------------------|
| provide valuable insights | 902x |
| left an indelible mark | 317x |
| play a significant role in shaping | 207x |
| unwavering commitment | 202x |

## Sources

- Original stop-slop (Hardik Pandya) — 49 phrases, 7 structures
- Humanizer skill (GitHub/blader) — 24 pattern categories
- Becky Tuch / Lit Mag News — 15 creative writing tells
- tropes.fyi — 32 named AI writing tropes
- Anti-Slop-Writing (GitHub) — 500+ vocabulary items
- GPTZero AI Vocabulary — 50+ phrases
- IsGPT.org — 56 phrases with multipliers
- EQBench Slop Score — 1,650 word list
- Pangram Labs guide — 100+ nouns, 70+ verbs
- FSU "delve" paper — 21 focal words
- SLOP_Detector (GitHub) — 209 fiction patterns
- Wikipedia: Signs of AI Writing
