// ============================================================
// THE RED PEN — LinkedIn AI Writing Detector
// Based on Stop Slop by Hardik Pandya
// Zero dependencies. Everything runs client-side.
// ============================================================

// ============================================================
// LAYER 1: MASTER PHRASE DATABASE
// Each: { text, tier, category, models[], replacement, explanation }
// Categories: vocabulary, phrase, filler, transition, inflation,
//   engagement_bait, humble_brag, thought_leader, journey_narrative,
//   meta, throat_clearing, emphasis, performative, treadmill,
//   conclusion_bloat
// ============================================================

const PHRASE_DB = [
  // --- TIER 1: Universal red flags ---
  { text: "delve", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "explore, examine, dig into", explanation: "'Delve' is one of the most overused AI words. Usage in published text jumped 400% after ChatGPT launched." },
  { text: "tapestry", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "mix, combination, fabric", explanation: "AI loves calling complex things a 'tapestry.' Real writers almost never use this word outside textile contexts." },
  { text: "testament", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "proof, evidence, sign", explanation: "'A testament to' is AI's favorite way to say something proves something. Just say it proves it." },
  { text: "pivotal", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "key, important, critical", explanation: "AI overuses 'pivotal' to make ordinary things sound decisive. Most things described as pivotal aren't." },
  { text: "underscore", tier: 1, category: "vocabulary", models: ["chatgpt", "claude"], replacement: "show, highlight, reveal", explanation: "AI uses 'underscore' as a verb to inflate significance. Just say 'shows' or 'highlights.'" },
  { text: "robust", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "strong, solid, thorough", explanation: "AI calls everything 'robust.' It's meaningless filler in most contexts." },
  { text: "landscape", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "field, area, situation, market", explanation: "'The landscape of X' — AI's favorite way to avoid being specific about what you mean." },
  { text: "groundbreaking", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "new, innovative, first", explanation: "AI calls everything groundbreaking. Most things aren't. Be specific about what's actually new." },
  { text: "multifaceted", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "complex, varied, many-sided", explanation: "AI's way of saying 'it has many parts.' Describe the actual parts instead." },
  { text: "leverage", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "use, apply, build on", explanation: "Corporate AI buzzword #1. 'Use' works 95% of the time." },
  { text: "foster", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "build, grow, support, create", explanation: "AI uses 'foster' to sound institutional. 'Build' or 'create' are clearer." },
  { text: "transformative", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "powerful, effective, game-changing", explanation: "AI calls everything transformative. Describe the actual transformation." },
  { text: "comprehensive", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "complete, full, thorough", explanation: "AI's favorite filler adjective. Often adds nothing." },
  { text: "crucial", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "important, key, necessary", explanation: "AI escalates everything to 'crucial.' If everything's crucial, nothing is." },
  { text: "innovative", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "new, creative, original", explanation: "AI's go-to adjective when it wants to sound impressive. What specifically is new?" },
  { text: "seamless", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "smooth, easy, simple", explanation: "AI's word for anything that works. Nothing is truly seamless." },
  { text: "intricate", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "complex, detailed, involved", explanation: "AI uses 'intricate' to sound sophisticated. 'Complex' or 'detailed' are simpler." },
  { text: "embark", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "start, begin, launch", explanation: "'Embark on a journey' — AI's favorite cliche. Just say 'start.'" },

  // --- TIER 2: Common AI vocabulary ---
  { text: "navigate", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "handle, manage, deal with", explanation: "AI loves 'navigate challenges.' Humans just deal with them." },
  { text: "interplay", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "relationship, interaction, connection", explanation: "AI uses 'interplay' to sound academic. 'Relationship' or 'connection' work." },
  { text: "nuance", tier: 2, category: "vocabulary", models: ["chatgpt", "claude"], replacement: "detail, subtlety, fine point", explanation: "AI loves 'nuance' as a noun. Often used to avoid specifics." },
  { text: "profound", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "deep, significant, major", explanation: "AI uses 'profound' to inflate ordinary observations. 'Deep' or 'significant' work." },
  { text: "catalyst", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "trigger, spark, cause", explanation: "AI's science metaphor for anything that causes change." },
  { text: "vibrant", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "lively, active, colorful", explanation: "AI calls every community 'vibrant.' Be specific about what makes it active." },
  { text: "paradigm", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "model, framework, approach", explanation: "'Paradigm shift' was cliched before AI. Describe what actually changed." },
  { text: "paradigm shift", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "big change, new approach", explanation: "Cliched before AI. Describe what actually changed." },
  { text: "harness", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "use, apply, channel", explanation: "AI loves 'harness the power of.' Just say 'use.'" },
  { text: "dynamic", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "changing, active, flexible", explanation: "AI filler adjective. Often adds nothing to the noun it modifies." },
  { text: "cornerstone", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "foundation, basis, key part", explanation: "AI metaphor for importance. 'Foundation' or 'key part' are clearer." },
  { text: "elevate", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "improve, raise, boost", explanation: "AI verb for 'make better.' 'Improve' is simpler." },
  { text: "resonate", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "connect, appeal, matter", explanation: "AI loves when things 'resonate with audiences.' 'Connect' is clearer." },
  { text: "empower", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "help, enable, give power to", explanation: "Corporate AI buzzword. Usually just means 'help' or 'let.'" },
  { text: "holistic", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "complete, whole, full", explanation: "AI uses 'holistic approach' to sound thorough. 'Complete' works." },
  { text: "curate", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "choose, select, pick", explanation: "AI uses 'curate' for everything. It means 'select' in a museum context." },
  { text: "synergy", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "collaboration, combined effect", explanation: "Corporate AI buzzword. Describe the actual combined effect." },
  { text: "spearhead", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "lead, drive, start", explanation: "AI military metaphor. 'Lead' is simpler." },
  { text: "meticulous", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "careful, thorough, precise", explanation: "AI formality. 'Careful' or 'thorough' work." },
  { text: "uncover", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "find, discover, reveal", explanation: "AI verb. 'Find' or 'discover' are simpler." },
  { text: "streamline", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "simplify, speed up, improve", explanation: "AI business verb. 'Simplify' or 'speed up' are more specific." },
  { text: "bolster", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "support, strengthen, boost", explanation: "AI formal verb. 'Strengthen' or 'boost' work." },
  { text: "cutting-edge", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "latest, newest, advanced", explanation: "AI hype adjective. What specifically is new about it?" },
  { text: "embodies", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "shows, represents, is", explanation: "AI verb for 'represents.' Often just means 'is.'" },
  { text: "endeavor", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "effort, try, attempt, project", explanation: "AI formality. 'Effort' or 'project' work." },
  { text: "ecosystem", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "system, community, network", explanation: "AI applies 'ecosystem' to everything. Often just means 'system.'" },
  { text: "foremost", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "top, leading, main", explanation: "AI formality. 'Top' or 'main' are simpler." },
  { text: "formidable", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "impressive, powerful, tough", explanation: "AI escalation word. 'Impressive' or 'tough' work." },
  { text: "indelible", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "lasting, permanent, unforgettable", explanation: "'Left an indelible mark' — just say 'lasting.'" },
  { text: "ingenious", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "clever, smart, creative", explanation: "AI superlative. 'Clever' or 'smart' are less inflated." },
  { text: "innate", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "natural, built-in, inborn", explanation: "AI uses 'innate' to sound scientific. 'Natural' works." },
  { text: "lucrative", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "profitable, well-paying", explanation: "AI business vocabulary. 'Profitable' is simpler." },
  { text: "monumental", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "huge, massive, major", explanation: "AI scale inflation. 'Huge' or 'major' are less dramatic." },
  { text: "pinnacle", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "peak, top, height", explanation: "AI escalation. 'Peak' or 'top' are simpler." },
  { text: "plethora", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "many, lots of, abundance", explanation: "'A plethora of' — just say 'many.'" },
  { text: "poignant", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "moving, touching, emotional", explanation: "AI's favorite emotion adjective. 'Moving' works." },
  { text: "prowess", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "skill, ability, talent", explanation: "AI formality. 'Skill' works." },
  { text: "quintessential", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "typical, classic, perfect example of", explanation: "AI literary flourish. 'Classic' or 'typical' work." },
  { text: "ramification", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "effect, consequence, result", explanation: "AI formality. 'Effect' or 'consequence' are clearer." },
  { text: "stakeholders", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "people involved, participants", explanation: "AI business jargon. Name the actual people." },
  { text: "stark", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "sharp, clear, harsh", explanation: "AI's adjective for contrasts. 'Sharp' or 'clear' work." },
  { text: "strive", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "try, work, aim", explanation: "AI formality. 'Try' or 'work toward' are simpler." },
  { text: "subsequently", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "then, later, after that", explanation: "AI formal transition. 'Then' or 'later' work." },
  { text: "tangible", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "real, concrete, clear", explanation: "AI often pairs with 'results' or 'impact.' 'Real' or 'concrete' work." },
  { text: "thriving", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "growing, successful, doing well", explanation: "AI's adjective for anything positive. 'Growing' or 'successful' work." },
  { text: "trailblazing", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "pioneering, leading, first", explanation: "AI heroic vocabulary. 'Pioneering' or 'first' work." },
  { text: "unprecedented", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "new, never before, first", explanation: "AI calls everything unprecedented. Most things have precedent." },
  { text: "unwavering", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "steady, firm, constant", explanation: "AI intensity word. 'Steady' or 'firm' work." },
  { text: "painstaking", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "careful, thorough, detailed", explanation: "AI drama word. 'Careful' or 'thorough' work." },
  { text: "underpinning", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "basis, foundation, support", explanation: "AI academic formality. 'Basis' works." },
  { text: "underpin", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "support, form the basis of", explanation: "AI academic verb. 'Support' works." },
  { text: "culmination", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "end, peak, result", explanation: "AI formality. 'End' or 'peak' are simpler." },
  { text: "reimagine", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "rethink, redesign, redo", explanation: "AI marketing verb. 'Rethink' or 'redesign' are more precise." },
  { text: "indispensable", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "essential, necessary", explanation: "AI formality. 'Essential' works." },
  { text: "wholeheartedly", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "fully, completely", explanation: "AI intensity adverb. 'Fully' is simpler." },
  { text: "discerning", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "careful, selective, picky", explanation: "AI formality. 'Careful' or 'selective' work." },

  // --- Phrase category ---
  { text: "testament to", tier: 1, category: "phrase", models: ["chatgpt"], replacement: "proof of, evidence of, shows", explanation: "AI's favorite attribution phrase. 'Shows' or 'proves' are direct." },
  { text: "it's important to note", tier: 1, category: "phrase", models: ["chatgpt", "claude"], replacement: "[just state the point]", explanation: "If it's important, readers will see that. Just say the thing." },
  { text: "in today's fast-paced world", tier: 1, category: "phrase", models: ["chatgpt"], replacement: "[just start with your point]", explanation: "The #1 AI opening cliche. Nobody needs to be told the world is fast-paced." },
  { text: "the bottom line is", tier: 1, category: "phrase", models: ["chatgpt"], replacement: "[just state the conclusion]", explanation: "Filler phrase that delays the point. Cut it and lead with the conclusion." },
  { text: "at the end of the day", tier: 2, category: "phrase", models: ["chatgpt"], replacement: "ultimately, in the end", explanation: "Cliche filler. Get to the point faster." },
  { text: "game changer", tier: 2, category: "phrase", models: ["chatgpt"], replacement: "[describe the specific impact]", explanation: "Everything is a 'game changer' in AI text. Describe what it actually changes." },
  { text: "deep dive", tier: 2, category: "phrase", models: ["chatgpt"], replacement: "detailed look, close examination", explanation: "AI loves promising a 'deep dive.' Usually it's shallow." },
  { text: "the key takeaway", tier: 2, category: "phrase", models: ["chatgpt"], replacement: "[just state the point]", explanation: "Filler phrase that delays the point." },

  // --- Filler ---
  { text: "it's worth noting that", tier: 1, category: "filler", models: ["chatgpt", "claude"], replacement: "[just state the point]", explanation: "AI hedge phrase. If it's worth noting, just note it — don't announce that you're noting it." },
  { text: "it's worth mentioning", tier: 1, category: "filler", models: ["chatgpt", "claude"], replacement: "[just state the point]", explanation: "AI hedge. Just mention it." },
  { text: "it goes without saying", tier: 2, category: "filler", models: ["chatgpt"], replacement: "[cut it entirely]", explanation: "If it goes without saying, don't say it. AI uses this for false emphasis." },
  { text: "needless to say", tier: 2, category: "filler", models: ["chatgpt"], replacement: "[cut it entirely]", explanation: "If needless to say, then don't say. AI filler." },
  { text: "as a matter of fact", tier: 2, category: "filler", models: ["chatgpt"], replacement: "in fact, actually", explanation: "AI formality. 'In fact' works." },
  { text: "in many cases", tier: 2, category: "filler", models: ["chatgpt"], replacement: "often, sometimes", explanation: "AI hedge. 'Often' or 'sometimes' are more direct." },
  { text: "given the fact that", tier: 2, category: "filler", models: ["chatgpt"], replacement: "since, because", explanation: "AI circumlocution. 'Since' or 'because' are direct." },
  { text: "plays a crucial role", tier: 2, category: "filler", models: ["chatgpt"], replacement: "matters, is important", explanation: "AI inflation. 'Matters' or 'is important' are simpler." },
  { text: "in a world where", tier: 2, category: "filler", models: ["chatgpt"], replacement: "[cut it, start with the point]", explanation: "AI opening cliche. Skip it and state what's actually happening." },

  // --- Transition overuse ---
  { text: "furthermore", tier: 1, category: "transition", models: ["chatgpt"], replacement: "also, and, plus", explanation: "AI uses 'furthermore' at 3-5x the human rate. 'Also' or 'and' work." },
  { text: "moreover", tier: 1, category: "transition", models: ["chatgpt"], replacement: "also, and, plus", explanation: "AI's favorite formal connector. 'Also' is simpler." },
  { text: "additionally", tier: 1, category: "transition", models: ["chatgpt"], replacement: "also, and", explanation: "AI formal connector. Just say 'also' or start a new sentence." },
  { text: "nevertheless", tier: 2, category: "transition", models: ["chatgpt"], replacement: "but, still, yet", explanation: "AI formality. 'But' or 'still' work." },
  { text: "consequently", tier: 2, category: "transition", models: ["chatgpt"], replacement: "so, as a result", explanation: "AI formal consequence marker. 'So' works." },
  { text: "in addition", tier: 2, category: "transition", models: ["chatgpt"], replacement: "also, and", explanation: "AI additive phrase. 'Also' is simpler." },
  { text: "on the other hand", tier: 2, category: "transition", models: ["chatgpt"], replacement: "but, however", explanation: "AI balance phrase. 'But' works." },

  // --- Inflation ---
  { text: "truly", tier: 2, category: "inflation", models: ["chatgpt"], replacement: "[cut it]", explanation: "AI emphasis filler. If the thing is true, you don't need to say 'truly.'" },
  { text: "incredibly", tier: 2, category: "inflation", models: ["chatgpt"], replacement: "very, extremely", explanation: "AI inflation. 'Very' or better yet, a stronger adjective." },
  { text: "remarkable", tier: 2, category: "inflation", models: ["chatgpt"], replacement: "notable, interesting, unusual", explanation: "AI's way of making ordinary things sound impressive." },
  { text: "extraordinary", tier: 2, category: "inflation", models: ["chatgpt"], replacement: "unusual, impressive, notable", explanation: "AI inflation. Most things described as extraordinary aren't." },
  { text: "exceptionally", tier: 2, category: "inflation", models: ["chatgpt"], replacement: "very, unusually", explanation: "AI emphasis filler. 'Very' or just a stronger adjective." },

  // --- Engagement bait ---
  { text: "agree?", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "[end with your point, not a plea]", explanation: "LinkedIn engagement bait. Ending with 'Agree?' begs for validation. Let your argument stand on its own." },
  { text: "thoughts?", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "[end with your point]", explanation: "Classic LinkedIn engagement hook. 'Thoughts?' is the 'like and subscribe' of LinkedIn." },
  { text: "what do you think?", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "[end with your point]", explanation: "Forced engagement. If your post is good, people will comment without being asked." },
  { text: "drop a", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "[cut it entirely]", explanation: "'Drop a comment/emoji' is pure engagement farming. LinkedIn's algorithm loves it. Humans hate it." },
  { text: "comment below", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "[cut it entirely]", explanation: "People know where the comment box is. This is engagement farming." },
  { text: "repost this if", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "[cut it entirely]", explanation: "Explicit engagement farming. If your content is good, people will share it." },
  { text: "share this with", tier: 2, category: "engagement_bait", models: ["chatgpt"], replacement: "[let the content speak]", explanation: "Engagement bait. If it's worth sharing, people will share it." },
  { text: "tag someone who", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "[cut it entirely]", explanation: "Pure engagement farming. This is how LinkedIn becomes Facebook." },
  { text: "save this for later", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "[cut it entirely]", explanation: "Engagement bait. Saves boost the algorithm, which is the only reason people say this." },
  { text: "bookmark this", tier: 2, category: "engagement_bait", models: ["chatgpt"], replacement: "[cut it entirely]", explanation: "Engagement bait. Same as 'save this for later.'" },
  { text: "follow me for more", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "[cut it entirely]", explanation: "The original engagement bait. Your content should make people want to follow, not a request." },
  { text: "follow for more", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "[cut it entirely]", explanation: "Engagement bait. Let your content earn the follow." },
  { text: "who else", tier: 2, category: "engagement_bait", models: ["chatgpt"], replacement: "[rephrase as a statement]", explanation: "'Who else feels this?' is fishing for agreement. State your point directly." },
  { text: "am i the only one", tier: 2, category: "engagement_bait", models: ["chatgpt"], replacement: "[rephrase as a statement]", explanation: "You're not the only one. This is a tactic to get validation comments." },
  { text: "hot take", tier: 2, category: "engagement_bait", models: ["chatgpt"], replacement: "[just state your opinion]", explanation: "Labeling your opinion a 'hot take' is engagement bait. If it's actually hot, people will tell you." },
  { text: "unpopular opinion", tier: 2, category: "engagement_bait", models: ["chatgpt"], replacement: "[just state your opinion]", explanation: "Usually followed by an extremely popular opinion. Just say what you think." },
  { text: "this might be controversial", tier: 2, category: "engagement_bait", models: ["chatgpt"], replacement: "[just say it]", explanation: "Pre-framing controversy is engagement bait. State your position and let people react." },
  { text: "i said what i said", tier: 2, category: "engagement_bait", models: ["chatgpt"], replacement: "[cut it entirely]", explanation: "Performative boldness. If you said it, we can see that. No need to announce your conviction." },
  { text: "if you disagree", tier: 2, category: "engagement_bait", models: ["chatgpt"], replacement: "[cut it — they will anyway]", explanation: "Engagement bait. People who disagree will comment regardless." },

  // --- Humble brag (NEW LinkedIn category) ---
  { text: "i'm humbled to announce", tier: 1, category: "humble_brag", models: ["chatgpt"], replacement: "[just announce it]", explanation: "You're not humbled — you're bragging. And that's fine. Just brag honestly instead of performing humility." },
  { text: "honored to share", tier: 1, category: "humble_brag", models: ["chatgpt"], replacement: "[just share it]", explanation: "The LinkedIn humble brag starter pack. You're not honored, you're proud. Own it." },
  { text: "humbled and grateful", tier: 1, category: "humble_brag", models: ["chatgpt"], replacement: "[just share your news]", explanation: "Double humble brag. Nobody is simultaneously humbled and announcing things on LinkedIn." },
  { text: "still can't believe", tier: 1, category: "humble_brag", models: ["chatgpt"], replacement: "[just share the news directly]", explanation: "You can believe it — you wrote a post about it. This is a humble brag disguised as disbelief." },
  { text: "pinch me moment", tier: 1, category: "humble_brag", models: ["chatgpt"], replacement: "[cut it and state the news]", explanation: "LinkedIn humble brag classic. Just share the accomplishment." },
  { text: "never in my wildest dreams", tier: 1, category: "humble_brag", models: ["chatgpt"], replacement: "[just share your achievement]", explanation: "Manufactured disbelief to make an achievement seem grander. Just state it." },
  { text: "blessed to", tier: 2, category: "humble_brag", models: ["chatgpt"], replacement: "[cut it]", explanation: "The original humble brag prefix. You earned it or got lucky — 'blessed' credits a higher power for your LinkedIn post." },
  { text: "grateful for the opportunity", tier: 2, category: "humble_brag", models: ["chatgpt"], replacement: "[state what happened]", explanation: "Humble brag with a gratitude wrapper. Just share the news." },
  { text: "thrilled to announce", tier: 2, category: "humble_brag", models: ["chatgpt"], replacement: "[just announce it]", explanation: "At least this one is honest about the emotion. But you can still just announce the thing." },
  { text: "excited to share", tier: 2, category: "humble_brag", models: ["chatgpt"], replacement: "[just share it]", explanation: "LinkedIn's most generic opener. We know you're excited — you posted about it." },

  // --- Journey narrative (NEW LinkedIn category) ---
  { text: "here's my story", tier: 1, category: "journey_narrative", models: ["chatgpt"], replacement: "[just tell the story]", explanation: "Don't announce that you're about to tell a story. Just tell it." },
  { text: "fast forward to today", tier: 1, category: "journey_narrative", models: ["chatgpt"], replacement: "[just describe the present]", explanation: "LinkedIn time-skip cliche. You don't need a movie transition in a LinkedIn post." },
  { text: "the lesson?", tier: 1, category: "journey_narrative", models: ["chatgpt"], replacement: "[weave the lesson into the story]", explanation: "LinkedIn posts that end with 'The lesson?' are treating readers like students. Show, don't tell." },
  { text: "if i can do it so can you", tier: 1, category: "journey_narrative", models: ["chatgpt"], replacement: "[cut it entirely]", explanation: "This ignores every structural advantage, privilege, and timing factor. It's not motivating, it's patronizing." },
  { text: "the secret? there is no secret", tier: 1, category: "journey_narrative", models: ["chatgpt"], replacement: "[just state what worked]", explanation: "The LinkedIn koan. If there's no secret, why did you frame it as one? Just say what worked." },
  { text: "years ago i", tier: 2, category: "journey_narrative", models: ["chatgpt"], replacement: "[start with the specific detail]", explanation: "LinkedIn journey opener. Start with the interesting detail, not the time marker." },
  { text: "looking back", tier: 2, category: "journey_narrative", models: ["chatgpt"], replacement: "[just share the reflection]", explanation: "LinkedIn reflection cliche. Just share the insight without announcing you're reflecting." },
  { text: "it all started when", tier: 2, category: "journey_narrative", models: ["chatgpt"], replacement: "[start with the specific moment]", explanation: "Fairy tale opener on LinkedIn. Start with the specific, interesting detail instead." },
  { text: "i remember when", tier: 2, category: "journey_narrative", models: ["chatgpt"], replacement: "[just describe the moment]", explanation: "We know it's a memory — you're writing about the past. Just describe it." },
  { text: "that was the moment", tier: 2, category: "journey_narrative", models: ["chatgpt"], replacement: "[describe what changed]", explanation: "LinkedIn epiphany marker. Describe the actual change instead of dramatizing the moment." },

  // --- Thought leader (NEW LinkedIn category) ---
  { text: "we need to talk about", tier: 1, category: "thought_leader", models: ["chatgpt"], replacement: "[just talk about it]", explanation: "LinkedIn's favorite urgency opener. You don't need to announce a conversation — just start it." },
  { text: "the conversation we're not having", tier: 1, category: "thought_leader", models: ["chatgpt"], replacement: "[just raise the point]", explanation: "We are having it — you're posting about it. This is a thought-leader framing device." },
  { text: "i'll probably get hate for this", tier: 1, category: "thought_leader", models: ["chatgpt"], replacement: "[just say it]", explanation: "Pre-victimization for engagement. Usually followed by something extremely uncontroversial." },
  { text: "read that again", tier: 1, category: "thought_leader", models: ["chatgpt"], replacement: "[cut it — trust your reader]", explanation: "LinkedIn thought-leader cliche. If the point is strong, people will re-read it without being told to." },
  { text: "let that sink in", tier: 1, category: "thought_leader", models: ["chatgpt"], replacement: "[cut it — trust your reader]", explanation: "The most overused LinkedIn closer. Trust your reader to process information without instructions." },
  { text: "hard truth", tier: 1, category: "thought_leader", models: ["chatgpt"], replacement: "[just state the truth]", explanation: "Labeling something a 'hard truth' is a credibility shortcut. Make the case instead of the label." },
  { text: "nobody tells you this", tier: 1, category: "thought_leader", models: ["chatgpt"], replacement: "[just say it]", explanation: "Usually followed by something everyone tells you. This is a scarcity frame for common knowledge." },
  { text: "here's what they don't teach you", tier: 1, category: "thought_leader", models: ["chatgpt"], replacement: "[just share the insight]", explanation: "LinkedIn 'insider knowledge' frame. Usually it's just common sense dressed up as a secret." },
  { text: "stop doing this", tier: 2, category: "thought_leader", models: ["chatgpt"], replacement: "[explain why it's a problem]", explanation: "LinkedIn command opener. Explain WHY instead of commanding strangers on the internet." },
  { text: "the truth is", tier: 2, category: "thought_leader", models: ["chatgpt"], replacement: "[just state the point]", explanation: "Implies everything before was a lie. Usually just introduces an opinion." },

  // --- Throat clearing ---
  { text: "in the realm of", tier: 1, category: "throat_clearing", models: ["chatgpt"], replacement: "in, within, for", explanation: "AI uses 'in the realm of' instead of just 'in.' Classic throat-clearing." },
  { text: "when it comes to", tier: 2, category: "throat_clearing", models: ["chatgpt"], replacement: "for, with, about", explanation: "AI hedge that delays the point. Just say 'for' or 'about.'" },
  { text: "in the context of", tier: 2, category: "throat_clearing", models: ["chatgpt"], replacement: "for, in, about", explanation: "AI formality. 'For' or 'about' are simpler." },
  { text: "it is essential to recognize", tier: 1, category: "throat_clearing", models: ["chatgpt"], replacement: "[just state the point]", explanation: "AI throat-clearing. Skip the wind-up and say the thing." },
  { text: "one of the most significant", tier: 2, category: "throat_clearing", models: ["chatgpt"], replacement: "a major, an important, a key", explanation: "AI hedge. Just say 'a key' or name the thing." },
  { text: "it's no secret that", tier: 2, category: "throat_clearing", models: ["chatgpt"], replacement: "[cut it — just state the fact]", explanation: "If it's no secret, skip the preamble and state the fact." },

  // --- Meta-commentary ---
  { text: "as we've seen", tier: 2, category: "meta", models: ["chatgpt"], replacement: "[cut it]", explanation: "AI meta-narrator. The reader knows what they've read. Don't summarize." },
  { text: "as mentioned earlier", tier: 2, category: "meta", models: ["chatgpt"], replacement: "[cut it]", explanation: "AI self-reference. The reader was there — they remember." },
  { text: "as discussed above", tier: 2, category: "meta", models: ["chatgpt"], replacement: "[cut it]", explanation: "AI meta-commentary. Trust the reader." },
  { text: "as i said", tier: 2, category: "meta", models: ["chatgpt"], replacement: "[cut it — just make the point]", explanation: "Self-referential filler. Say the new thing." },

  // --- Emphasis crutches ---
  { text: "it's not just about", tier: 2, category: "emphasis", models: ["chatgpt"], replacement: "[say what it IS about]", explanation: "AI uses 'not just about X' as a setup for the real point. Lead with the real point." },
  { text: "the real question is", tier: 2, category: "emphasis", models: ["chatgpt"], replacement: "[just ask the question]", explanation: "AI drama setup. Just ask the question." },

  // --- Performative depth ---
  { text: "this is bigger than", tier: 2, category: "performative", models: ["chatgpt"], replacement: "[explain why it matters]", explanation: "AI scale-up phrase. If it's big, explain why — don't just assert bigness." },
  { text: "here's why it matters", tier: 2, category: "performative", models: ["chatgpt"], replacement: "[just explain why]", explanation: "LinkedIn thought-leader cliche. Just explain." },
  { text: "here's the thing", tier: 2, category: "performative", models: ["chatgpt"], replacement: "[just state the thing]", explanation: "AI drama intro. Just say the thing." },

  // --- Treadmill markers ---
  { text: "as we move forward", tier: 2, category: "treadmill", models: ["chatgpt"], replacement: "going forward, next", explanation: "AI forward-looking filler. 'Next' or just describing what's next works." },
  { text: "in this regard", tier: 2, category: "treadmill", models: ["chatgpt"], replacement: "[cut it]", explanation: "AI connector that adds nothing. Just make the next point." },
  { text: "with this in mind", tier: 2, category: "treadmill", models: ["chatgpt"], replacement: "[cut it]", explanation: "AI connector. The reader already has it in mind — they just read it." },
  { text: "building on this", tier: 2, category: "treadmill", models: ["chatgpt"], replacement: "[cut it]", explanation: "AI connector. Just make the next point." },

  // --- Conclusion bloat ---
  { text: "in conclusion", tier: 1, category: "conclusion_bloat", models: ["chatgpt"], replacement: "[just make your final point]", explanation: "On LinkedIn, there's no essay conclusion. Just end strong." },
  { text: "to sum up", tier: 2, category: "conclusion_bloat", models: ["chatgpt"], replacement: "[cut it]", explanation: "Your LinkedIn post is 200 words. It doesn't need a summary." },
  { text: "the future looks bright", tier: 2, category: "conclusion_bloat", models: ["chatgpt"], replacement: "[cut it — say something specific or don't]", explanation: "AI's lazy optimistic closer. If you have a specific prediction, make it." },
  { text: "exciting times lie ahead", tier: 2, category: "conclusion_bloat", models: ["chatgpt"], replacement: "[cut it]", explanation: "AI generic optimism. Say something specific about the future or don't." },
  { text: "in summary", tier: 2, category: "conclusion_bloat", models: ["chatgpt"], replacement: "[cut it]", explanation: "LinkedIn posts don't need summaries. End with your strongest point." },

  // --- Tier 2 vocabulary restored from research (13 sources) ---
  { text: "garner", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "get, earn, attract", explanation: "AI formality. 'Get' or 'earn' work." },
  { text: "beacon", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "example, guide, light", explanation: "AI metaphor for leadership. 'Example' or 'guide' are clearer." },
  { text: "commence", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "start, begin", explanation: "AI formality. Just say 'start.'" },
  { text: "facilitate", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "help, enable, make possible", explanation: "AI corporate verb. 'Help' or 'enable' work." },
  { text: "utilize", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "use", explanation: "AI's way of making 'use' sound fancier. Just say 'use.'" },
  { text: "renowned", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "famous, well-known", explanation: "AI formality. 'Famous' or 'well-known' are simpler." },
  { text: "encompass", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "include, cover, span", explanation: "AI verb. 'Include' or 'cover' work." },
  { text: "exemplify", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "show, demonstrate", explanation: "AI formality. 'Show' is simpler." },
  { text: "cultivate", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "build, develop, grow", explanation: "AI gardening metaphor. 'Build' or 'develop' work." },
  { text: "paramount", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "most important, essential, top", explanation: "AI escalation. 'Most important' is clearer." },
  { text: "noteworthy", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "notable, interesting, worth mentioning", explanation: "AI formality. 'Notable' works." },
  { text: "commendable", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "impressive, good, praiseworthy", explanation: "AI teacher voice. 'Impressive' or 'good' work." },
  { text: "elucidate", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "explain, clarify, make clear", explanation: "AI showing off vocabulary. 'Explain' works." },
  { text: "burgeoning", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "growing, expanding, booming", explanation: "AI adjective for growth. 'Growing' is simpler." },
  { text: "propel", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "drive, push, move forward", explanation: "AI force verb. 'Drive' or 'push' work." },
  { text: "myriad", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "many, countless, numerous", explanation: "AI literary vocabulary. 'Many' works." },
  { text: "trajectory", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "path, direction, trend", explanation: "AI science metaphor. 'Path' or 'direction' are clearer." },
  { text: "proliferation", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "spread, growth, increase", explanation: "AI academic noun. 'Growth' or 'spread' work." },
  { text: "catalyze", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "trigger, spark, start", explanation: "AI chemistry verb. 'Trigger' or 'spark' are clearer." },
  { text: "imperative", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "essential, necessary, urgent", explanation: "AI urgency word. 'Essential' or 'necessary' work." },
  { text: "albeit", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "although, though, even if", explanation: "AI formal connector. 'Although' or 'though' are simpler." },
  { text: "arguably", tier: 2, category: "vocabulary", models: ["chatgpt", "claude"], replacement: "[just argue it — make the case]", explanation: "AI hedge. If it's arguable, argue it. Don't hedge with 'arguably.'" },
  { text: "overarching", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "main, overall, broad", explanation: "AI scope adjective. 'Main' or 'overall' work." },
  { text: "unparalleled", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "unique, exceptional, unmatched", explanation: "AI superlative. 'Unique' or 'exceptional' are less inflated." },
  { text: "foundational", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "basic, fundamental, core", explanation: "AI academic adjective. 'Core' or 'fundamental' work." },
  { text: "undeniable", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "clear, obvious, strong", explanation: "AI certainty word. 'Clear' or 'obvious' work." },
  { text: "showcase", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "show, display, demonstrate", explanation: "AI's way of saying 'show.' Just say 'show.'" },
  { text: "nuanced", tier: 1, category: "vocabulary", models: ["chatgpt", "claude"], replacement: "subtle, complex, layered", explanation: "AI's favorite adjective for seeming thoughtful. Be specific about what's subtle." },
  { text: "enhance", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "improve, boost, strengthen", explanation: "AI upgrade verb. 'Improve' is simpler." },
  { text: "realm", tier: 1, category: "vocabulary", models: ["chatgpt", "deepseek"], replacement: "area, field, domain", explanation: "AI literary vocabulary. 'Area' or 'field' work. DeepSeek especially loves this." },

  // --- Filler phrases from research ---
  { text: "in order to", tier: 2, category: "filler", models: ["chatgpt"], replacement: "to", explanation: "'In order to' is always replaceable by 'to.' Three words doing the job of one." },
  { text: "due to the fact that", tier: 2, category: "filler", models: ["chatgpt"], replacement: "because", explanation: "Five words doing the job of one. 'Because' works." },
  { text: "at this point in time", tier: 2, category: "filler", models: ["chatgpt"], replacement: "now", explanation: "Five words for 'now.' AI circumlocution at its finest." },
  { text: "in the event that", tier: 2, category: "filler", models: ["chatgpt"], replacement: "if", explanation: "Four words for 'if.' Classic AI bloat." },
  { text: "has the ability to", tier: 2, category: "filler", models: ["chatgpt"], replacement: "can", explanation: "Four words for 'can.' AI avoids simple verbs." },

  // --- Throat-clearing from research ---
  { text: "the uncomfortable truth is", tier: 2, category: "throat_clearing", models: ["chatgpt"], replacement: "[just state the truth]", explanation: "LinkedIn thought-leader opener. If it's uncomfortable, the reader will feel that. Don't announce it." },
  { text: "in the ever-evolving landscape of", tier: 1, category: "throat_clearing", models: ["chatgpt"], replacement: "[cut it — start with the point]", explanation: "Peak AI throat-clearing. Everything is 'ever-evolving' to AI. Start with what matters." },
  { text: "in an era where", tier: 2, category: "throat_clearing", models: ["chatgpt"], replacement: "[cut it]", explanation: "AI dramatic time-framing. Just state the current situation." },
  { text: "in today's digital age", tier: 2, category: "throat_clearing", models: ["chatgpt"], replacement: "[cut it]", explanation: "AI's second favorite throat-clear after 'in today's fast-paced world.' We know it's digital." },
  { text: "let me be clear", tier: 2, category: "throat_clearing", models: ["chatgpt"], replacement: "[just be clear — state the point]", explanation: "Announcing clarity instead of being clear. Cut it." },
  { text: "can we talk about", tier: 2, category: "throat_clearing", models: ["chatgpt"], replacement: "[just talk about it]", explanation: "LinkedIn opener. You don't need permission to start a conversation in your own post." },

  // --- Emphasis crutches from research ---
  { text: "full stop", tier: 2, category: "emphasis", models: ["chatgpt"], replacement: "[cut it — end with a period like everyone else]", explanation: "AI emphasis. Writing 'full stop' or 'period' after a sentence is performative conviction." },
  { text: "make no mistake", tier: 2, category: "emphasis", models: ["chatgpt"], replacement: "[cut it — just state the point]", explanation: "AI authority phrase. State your point with enough conviction that the reader doesn't need to be warned." },
  { text: "this matters because", tier: 2, category: "emphasis", models: ["chatgpt"], replacement: "[weave the 'why' into the point itself]", explanation: "AI signposting. If you need to tell the reader why it matters, the writing isn't doing its job." },
  { text: "here's why that matters", tier: 2, category: "emphasis", models: ["chatgpt"], replacement: "[just explain why]", explanation: "LinkedIn explainer structure. Just explain." },

  // --- IsGPT high-multiplier phrases (902x, 317x, 207x, 202x vs human rate) ---
  { text: "provide valuable insights", tier: 1, category: "inflation", models: ["chatgpt"], replacement: "[name the specific insight]", explanation: "AI filler phrase. 902x the human usage rate (IsGPT research). Name the actual insight instead." },
  { text: "left an indelible mark", tier: 1, category: "inflation", models: ["chatgpt"], replacement: "had a lasting impact, changed", explanation: "317x the human usage rate. 'Had a lasting impact' or describe what actually changed." },
  { text: "play a significant role in shaping", tier: 1, category: "inflation", models: ["chatgpt"], replacement: "helped shape, influenced", explanation: "207x the human usage rate. 'Helped shape' or 'influenced' are direct." },
  { text: "unwavering commitment", tier: 1, category: "inflation", models: ["chatgpt"], replacement: "dedication, commitment", explanation: "202x the human usage rate. 'Commitment' doesn't need 'unwavering' — it's implied." },

  // --- Claude-specific hedging ---
  { text: "while this may vary", tier: 2, category: "filler", models: ["claude"], replacement: "[cut it or be specific about what varies]", explanation: "Claude's signature hedge. Either be specific about the variation or cut it." },
  { text: "generally speaking", tier: 2, category: "filler", models: ["claude"], replacement: "[cut it — just speak]", explanation: "Claude hedge. If you're generalizing, the reader will see that." },
  { text: "i should note", tier: 2, category: "filler", models: ["claude"], replacement: "[just note it]", explanation: "Claude self-reference. Don't announce that you're noting something — just note it." },
  { text: "it's important to consider", tier: 2, category: "filler", models: ["claude"], replacement: "[just present the consideration]", explanation: "Claude throat-clearing. If it's important, present it. Don't announce importance." },

  // --- DeepSeek patterns ---
  { text: "unlocking", tier: 2, category: "vocabulary", models: ["deepseek"], replacement: "enabling, finding, opening up", explanation: "DeepSeek's favorite metaphor. 'Enabling' or 'finding' are more direct." },
  { text: "unveiling", tier: 2, category: "vocabulary", models: ["deepseek"], replacement: "showing, revealing, announcing", explanation: "DeepSeek drama verb. 'Showing' or 'revealing' work." },
  { text: "paving the way", tier: 2, category: "vocabulary", models: ["deepseek"], replacement: "enabling, making possible, leading to", explanation: "DeepSeek cliche. 'Enabling' or 'making possible' are more direct." },

  // --- 2026-era AI tells (from differential analysis of 300 real LLM outputs vs 269 human posts) ---
  // These are conversational/structural patterns, not fancy vocabulary

  // Soft engagement closers (AI-only, 0 human occurrences)
  { text: "i'd love to hear", tier: 1, category: "engagement_bait", models: ["chatgpt", "claude", "gemini"], replacement: "[cut it — if your post is good, people will respond]", explanation: "2026 AI tell. Appeared 24x in AI posts, 0x in human posts. AI always ends with a soft invitation to engage." },
  { text: "share your thoughts", tier: 1, category: "engagement_bait", models: ["chatgpt", "claude", "gemini"], replacement: "[cut it]", explanation: "2026 AI tell. 14x AI, 0x human. The polite version of 'thoughts?' — still engagement bait." },
  { text: "love to hear your", tier: 1, category: "engagement_bait", models: ["chatgpt", "claude", "gemini"], replacement: "[cut it]", explanation: "2026 AI tell. 22x AI, 0x human. AI is trained to be helpful, so it always asks for your input." },
  { text: "what are your thoughts", tier: 1, category: "engagement_bait", models: ["chatgpt", "claude", "gemini"], replacement: "[cut it]", explanation: "2026 AI tell. 18x AI, 0x human. More formal version of 'thoughts?' — still AI engagement bait." },
  { text: "in the comments", tier: 1, category: "engagement_bait", models: ["chatgpt", "gemini", "llama"], replacement: "[cut it]", explanation: "2026 AI tell. 42x AI, 0x human. AI always directs to comments. Real humans don't need to explain where the comment box is." },
  { text: "feel free to", tier: 1, category: "engagement_bait", models: ["chatgpt", "claude", "gemini"], replacement: "[cut it — they already feel free]", explanation: "2026 AI tell. 21x AI, 0x human. AI's trained politeness. Nobody needs permission to comment on LinkedIn." },
  { text: "share your experiences", tier: 2, category: "engagement_bait", models: ["chatgpt", "claude"], replacement: "[cut it]", explanation: "2026 AI tell. 6x AI, 0x human. AI engagement invitation." },
  { text: "share your insights", tier: 2, category: "engagement_bait", models: ["chatgpt", "claude"], replacement: "[cut it]", explanation: "2026 AI tell. 8x AI, 0x human." },

  // Soft hedging / inclusive language (AI-only)
  { text: "you're not alone", tier: 1, category: "thought_leader", models: ["chatgpt", "claude", "gemini"], replacement: "[cut it — state the problem directly]", explanation: "2026 AI tell. 8x AI, 0x human. AI's trained empathy. Real LinkedIn writers state the problem, not reassure strangers." },
  { text: "don't be afraid to", tier: 2, category: "thought_leader", models: ["chatgpt", "llama"], replacement: "[cut it — just recommend the action]", explanation: "2026 AI tell. 13x AI, 0x human. Patronizing encouragement. Just say 'do X.'" },
  { text: "it's okay to", tier: 2, category: "thought_leader", models: ["chatgpt", "claude"], replacement: "[cut it — just state the point]", explanation: "2026 AI tell. AI gives permission nobody asked for. Just make your point." },

  // Structural fillers (AI-only)
  { text: "here are a few", tier: 1, category: "filler", models: ["chatgpt", "claude", "gemini"], replacement: "[cut it — just start the list]", explanation: "2026 AI tell. 22x AI, 0x human. AI always introduces lists. Humans just start listing." },
  { text: "here are some", tier: 2, category: "filler", models: ["chatgpt", "gemini"], replacement: "[cut it — just list them]", explanation: "2026 AI tell. 6x AI, 0x human." },
  { text: "here's what i've learned", tier: 1, category: "journey_narrative", models: ["chatgpt", "claude"], replacement: "[just share the lessons]", explanation: "2026 AI tell. 6x AI, 1x human. AI announces lessons. Humans just share them." },
  { text: "along the way", tier: 2, category: "filler", models: ["chatgpt", "claude", "gemini"], replacement: "[cut it]", explanation: "2026 AI tell. 16x AI, 2x human (8x ratio). AI journey filler." },
  { text: "i want to share", tier: 2, category: "filler", models: ["chatgpt", "claude"], replacement: "[just share it]", explanation: "2026 AI tell. 30x AI, 0x human for 'i want to'. Don't announce sharing — just share." },

  // Binary contrast patterns (2026 version)
  { text: "it's about", tier: 1, category: "emphasis", models: ["chatgpt", "claude", "gemini", "llama"], replacement: "[just state what it is]", explanation: "2026 AI tell. 84x AI, 0x human. The new 'not X — it's Y.' AI uses 'it's about' to pivot to its real point." },
  { text: "not just about", tier: 1, category: "emphasis", models: ["chatgpt", "claude", "gemini"], replacement: "[say what it IS about]", explanation: "2026 AI tell. 24x AI, 0x human. The negation setup before the pivot. Just state the positive." },
  { text: "isn't just about", tier: 1, category: "emphasis", models: ["chatgpt", "claude"], replacement: "[say what it IS about]", explanation: "2026 AI tell. 15x AI, 0x human. Variant of the same pattern." },
  { text: "it's about building", tier: 2, category: "emphasis", models: ["chatgpt", "claude"], replacement: "[describe what you're building]", explanation: "2026 AI tell. 15x AI, 0x human. AI's favorite pivot target." },

  // 2026 AI vocabulary (not in 2024 databases)
  { text: "invaluable", tier: 2, category: "vocabulary", models: ["chatgpt", "claude", "gemini"], replacement: "very useful, essential, important", explanation: "2026 AI tell. 21x AI, 0x human. AI's polite superlative. 'Very useful' is more honest." },
  { text: "incredible", tier: 2, category: "vocabulary", models: ["chatgpt", "claude", "gemini"], replacement: "impressive, surprising, strong", explanation: "2026 AI tell. 28x AI, 0x human. AI's enthusiasm word. What specifically was impressive?" },
  { text: "genuine", tier: 2, category: "vocabulary", models: ["chatgpt", "claude"], replacement: "real, honest, actual", explanation: "2026 AI tell. 35x AI, 0x human. Ironic — AI's favorite word for authenticity." },
  { text: "resilience", tier: 2, category: "vocabulary", models: ["chatgpt", "claude", "gemini"], replacement: "persistence, toughness, grit", explanation: "2026 AI tell. 18x AI, 0x human. AI's go-to character trait word." },
  { text: "networking", tier: 2, category: "vocabulary", models: ["chatgpt", "llama"], replacement: "meeting people, building relationships", explanation: "2026 AI tell. 41x AI, 0x human. AI uses the abstract noun. Humans describe the action." },
  { text: "boundaries", tier: 2, category: "vocabulary", models: ["chatgpt", "claude"], replacement: "limits, rules, lines", explanation: "2026 AI tell. 19x AI, 0x human. AI workplace therapy vocabulary." },
  { text: "align", tier: 2, category: "vocabulary", models: ["chatgpt", "claude", "gemini"], replacement: "match, fit, agree", explanation: "2026 AI tell. 27x AI, 0x human. Corporate AI verb. 'Match' or 'fit' are clearer." },
  { text: "celebrate", tier: 2, category: "vocabulary", models: ["chatgpt", "claude"], replacement: "[describe the achievement instead]", explanation: "2026 AI tell. 26x AI, 0x human. AI celebrates everything. Describe what happened." },
  { text: "connections", tier: 2, category: "vocabulary", models: ["chatgpt", "claude", "gemini"], replacement: "people, contacts, relationships", explanation: "2026 AI tell. 26x AI, 0x human. LinkedIn's own jargon that AI parrots back." },
  { text: "perspectives", tier: 2, category: "vocabulary", models: ["chatgpt", "claude", "gemini"], replacement: "views, opinions, takes", explanation: "2026 AI tell. 15x AI, 0x human. AI pluralizes to sound inclusive." },
  { text: "essential", tier: 2, category: "vocabulary", models: ["chatgpt", "claude", "gemini"], replacement: "important, necessary, key", explanation: "2026 AI tell. 23x AI, 0x human. AI escalation word." },

  // 2026 sentence starters (AI-only)
  { text: "but here's the thing", tier: 1, category: "throat_clearing", models: ["chatgpt", "claude", "gemini"], replacement: "[cut it — just state the thing]", explanation: "2026 AI tell. 24x AI, 0x human. AI's favorite pivot phrase. The reader doesn't need a drumroll." },
  { text: "i'm excited to", tier: 2, category: "humble_brag", models: ["chatgpt", "claude", "gemini"], replacement: "[just do the thing]", explanation: "2026 AI tell. 17x AI, 0x human. AI's default enthusiasm opener." },
  { text: "thrilled to share", tier: 2, category: "humble_brag", models: ["chatgpt", "claude"], replacement: "[just share it]", explanation: "2026 AI tell. 10x AI, 0x human." },

  // Claude-specific 2026 patterns
  { text: "actually", tier: 2, category: "filler", models: ["claude"], replacement: "[cut it — if it's actual, just state it]", explanation: "Claude 2026 tell. 4.4x more frequent in Claude than other models. Claude hedges with 'actually' to sound conversational." },
  { text: "biggest", tier: 2, category: "inflation", models: ["claude"], replacement: "main, top, most important", explanation: "Claude 2026 tell. 5.1x more frequent in Claude. Claude dramatizes with superlatives." },

  // GPT-4o-specific 2026 patterns
  { text: "embrace", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "accept, try, adopt", explanation: "GPT-4o 2026 tell. 4.4x more frequent in GPT-4o. AI's motivational verb. 'Try' or 'adopt' are more honest." },
  { text: "journey", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "experience, path, process", explanation: "GPT-4o 2026 tell. 3.2x more frequent in GPT-4o. LinkedIn's most overused metaphor." },
];

// Build lookup for quick searching
const PHRASE_LOOKUP = new Map();
PHRASE_DB.forEach((entry, idx) => {
  PHRASE_LOOKUP.set(entry.text.toLowerCase(), idx);
});

// ============================================================
// SAMPLE TEXT — LinkedIn humble-brag/journey post
// ============================================================
const SAMPLE_TEXT = `I'm humbled to announce that after 10 years in the corporate world, I finally took the leap.

I quit my job.

Nobody told me this would be easy. But here's the thing — the real question isn't whether you can afford to take the risk. It's whether you can afford not to.

Years ago, I was just another cog in the machine. Fast forward to today, and I'm building something truly transformative. A comprehensive platform that leverages cutting-edge AI to foster innovation in the ecosystem.

The lesson? There is no secret. It's about showing up every day. It's about having unwavering commitment. It's about being pivotal in your own journey.

Here's what they don't teach you in business school:

1. Your network is your net worth
2. Fail fast, learn faster
3. The best time to start was yesterday

Not a product. Not a company. A movement.

Let that sink in.

If I can do it, so can you. The future looks bright for those who dare to embark on this journey.

Hard truth: most people won't read this far. But the ones who do? They're the real game changers.

Agree? Drop a comment below. Follow me for more insights on leadership, innovation, and the future of work.

#Leadership #Innovation #Entrepreneurship #StartupLife #AI #FutureOfWork #MondayMotivation #GrowthMindset`;

// ============================================================
// LAYER 2: STRUCTURAL DETECTORS (13 total: 9 kept + 4 new)
// ============================================================

function detectBinaryContrasts(text) {
  const patterns = [
    /(?:it's\s+)?not\s+(?:just\s+)?(?:about\s+)?[^.!?]{3,60}\s*[-—–]\s*it's\s+[^.!?]{3,80}/gi,
    /not\s+because\s+[^.!?]{3,60}[.]\s*because\s+[^.!?]{3,80}/gi,
    /isn't\s+(?:the\s+)?[^.!?]{3,60}[.,]\s*(?:it's|it\s+is)\s+[^.!?]{3,80}/gi,
    /the\s+(?:answer|problem|question|real\s+\w+)\s+isn't\s+[^.!?]{3,60}/gi,
    /stops?\s+being\s+\w+\s+and\s+starts?\s+being\s+\w+/gi,
  ];
  const matches = collectRegexMatches(text, patterns);

  // Cross-paragraph contrast: "don't/doesn't [verb] with X.\n\nThey [verb] with Y."
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  for (let i = 0; i < paragraphs.length - 1; i++) {
    const a = paragraphs[i].trim();
    const b = paragraphs[i + 1].trim();
    // Match: "don't/doesn't/won't [verb]" in first, same verb reused in second
    const negMatch = a.match(/\b(?:don't|doesn't|won't|didn't|isn't|aren't|can't|never)\s+(\w+)\b/i);
    if (negMatch) {
      const verb = negMatch[1].toLowerCase();
      const affirmPattern = new RegExp(`\\b(?:they|it|we|you|i|he|she)\\s+${verb}\\b`, "i");
      if (affirmPattern.test(b)) {
        const startOffset = text.indexOf(a);
        const endOffset = text.indexOf(b) + b.length;
        matches.push({
          snippet: highlightRange(text, startOffset, endOffset - startOffset),
          start: startOffset,
          length: endOffset - startOffset,
          explanation: `"Don't ${verb} X" / "They ${verb} Y" across paragraphs. This is the LinkedIn remix of "it's not X — it's Y." The dramatic line break makes it even more formulaic. Just state what matters.`
        });
      }
    }
  }

  return matches;
}

function detectNegativeListings(text) {
  const sentences = extractSentences(text);
  const matches = [];
  for (let i = 0; i < sentences.length - 1; i++) {
    const first = sentences[i].text.trim();
    const second = sentences[i + 1].text.trim();
    if (/^not\s+a\s/i.test(first) && /^not\s+a\s/i.test(second)) {
      const start = sentences[i].start;
      const end = (sentences[i + 2] || sentences[i + 1]);
      const endPos = end.start + end.length;
      matches.push({
        snippet: highlightRange(text, start, endPos - start),
        start, length: endPos - start,
        explanation: "Multiple 'Not a...' sentences before the reveal. This striptease pattern is the most recognized AI structure on LinkedIn."
      });
    }
  }
  return matches;
}

function detectFragments(text) {
  const sentences = extractSentences(text);
  const matches = [];
  let consecutiveFrags = 0;
  for (let i = 0; i < sentences.length; i++) {
    const words = sentences[i].text.split(/\s+/).filter(Boolean);
    if (words.length <= 3 && words.length > 0) {
      consecutiveFrags++;
      if (consecutiveFrags >= 2) {
        matches.push({
          snippet: highlightRange(text, sentences[i - 1].start, sentences[i].start + sentences[i].length - sentences[i - 1].start),
          start: sentences[i - 1].start,
          length: sentences[i].start + sentences[i].length - sentences[i - 1].start,
          explanation: "Short staccato fragments in sequence. AI uses these for manufactured drama. 'Speed. Quality. Cost.' reads like a brochure."
        });
      }
    } else {
      consecutiveFrags = 0;
    }
  }
  return matches;
}

function detectRuleOfThree(text) {
  const matches = [];

  const tricolon = /\b(\w+(?:\s+\w+)?),\s+(\w+(?:\s+\w+)?),\s+and\s+(\w+(?:\s+\w+)?)\b/gi;
  let triCount = 0;
  let m;
  while ((m = tricolon.exec(text)) !== null) triCount++;
  if (triCount >= 3) {
    matches.push({
      snippet: `Found ${triCount} three-item comma lists ("X, Y, and Z") in your text.`,
      start: 0, length: 0,
      explanation: `You used ${triCount} tricolons (three-item lists). Occasional use is fine; compulsive use is AI. Vary your list lengths.`
    });
  }

  const emojiNumbers = text.match(/[\u0031-\u0039]\uFE0F?\u20E3/g) || [];
  const numberedLines = text.match(/(?:^|\n)\s*\d+[.)]\s/g) || [];
  const bulletLines = text.match(/(?:^|\n)\s*[-•*]\s/g) || [];
  const listItemCount = Math.max(emojiNumbers.length, numberedLines.length, bulletLines.length);

  if (listItemCount >= 3) {
    const firstEmoji = text.search(/[\u0031-\u0039]\uFE0F?\u20E3/);
    const firstNumbered = text.search(/(?:^|\n)\s*\d+[.)]\s/);
    const firstBullet = text.search(/(?:^|\n)\s*[-•*]\s/);
    const starts = [firstEmoji, firstNumbered, firstBullet].filter(i => i >= 0);
    const firstStart = starts.length > 0 ? Math.min(...starts) : 0;

    const listType = emojiNumbers.length >= 3 ? "emoji-numbered" : numberedLines.length >= 3 ? "numbered" : "bulleted";
    matches.push({
      snippet: highlightRange(text, Math.max(0, firstStart), Math.min(80, text.length - firstStart)),
      start: firstStart, length: 80,
      explanation: `${listItemCount}-item ${listType} list detected. LinkedIn AI loves structured lists. Consider whether narrative flow would be stronger.`
    });
  }

  return matches;
}

function detectEmojiFormatting(text) {
  const emojiHeaders = text.match(/[\u0031-\u0039]\uFE0F?\u20E3|[\u{1F4C8}\u{1F4CA}\u{1F4CB}\u{1F4CC}\u{1F4DD}\u{1F525}\u{2705}\u{274C}\u{26A0}\u{1F449}\u{1F447}\u{1F446}\u{1F3AF}\u{1F4A1}\u{1F914}\u{1F926}]/gu) || [];
  if (emojiHeaders.length >= 3) {
    return [{
      snippet: `Found ${emojiHeaders.length} emoji markers used as formatting devices.`,
      start: 0, length: 0,
      explanation: `${emojiHeaders.length} emoji used as structural markers. Heavy emoji formatting is the hallmark of LinkedIn AI content. Use sparingly or not at all.`
    }];
  }
  return [];
}

function detectNotOnlyButAlso(text) {
  const pattern = /not\s+only\b[^.!?]{3,80}\bbut\s+also\b/gi;
  return collectRegexMatches(text, [pattern]).map(m => ({
    ...m,
    explanation: "'Not only... but also' is a mechanical additive structure AI uses 2-5x more than human writers. Just list both things."
  }));
}

function detectConclusionBloat(text) {
  const lastPara = text.trim().split(/\n\s*\n/).pop() || "";
  const markers = ["in conclusion", "in summary", "to sum up", "as we've seen", "the future looks", "exciting times", "embark on"];
  const found = markers.filter(m => lastPara.toLowerCase().includes(m));
  if (found.length >= 2) {
    const offset = text.lastIndexOf(lastPara);
    return [{
      snippet: highlightRange(text, offset, lastPara.length),
      start: offset, length: lastPara.length,
      explanation: `Your conclusion has ${found.length} AI conclusion markers: ${found.join(", ")}. On LinkedIn, end with your strongest point. No summaries needed.`
    }];
  }
  return [];
}

function detectIngOpeners(text) {
  const sentences = extractSentences(text);
  const matches = [];
  let ingCount = 0;
  sentences.forEach(s => {
    if (/^[A-Z]\w+ing\s/i.test(s.text.trim())) {
      ingCount++;
      if (ingCount > 2) {
        matches.push({
          snippet: highlightRange(text, s.start, s.length),
          start: s.start, length: s.length,
          explanation: "Present participle opener (-ing). AI uses these at 2-5x the human rate. Vary your sentence beginnings."
        });
      }
    }
  });
  if (ingCount > 2 && matches.length === 0) {
    matches.push({
      snippet: `Found ${ingCount} sentences starting with -ing words.`,
      start: 0, length: 0,
      explanation: `${ingCount} sentences open with -ing participles. This is 2-5x the typical human rate. Vary your sentence beginnings.`
    });
  }
  return matches;
}

function detectTransitionDensity(text) {
  const transitions = /\b(?:furthermore|moreover|additionally|nevertheless|consequently|in addition|on the other hand|however|therefore|thus|hence|accordingly|subsequently|meanwhile)\b/gi;
  const words = text.split(/\s+/).length;
  const count = (text.match(transitions) || []).length;
  const per100 = (count / words) * 100;
  if (per100 > 1.5) {
    return [{
      snippet: `${count} formal transitions in ${words} words (${per100.toFixed(1)} per 100 words).`,
      start: 0, length: 0,
      explanation: `You have ${count} formal transition words. AI uses 'Furthermore/Moreover/Additionally' at 3-5x the human rate. Replace with simpler connectors or just start the next sentence.`
    }];
  }
  return [];
}

// --- 4 NEW LinkedIn-specific detectors ---

function detectBroetry(text) {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  if (paragraphs.length < 3) return [];

  const singleSentenceParas = paragraphs.filter(p => {
    const trimmed = p.trim();
    const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.length <= 1 && trimmed.split(/\s+/).length <= 15;
  });

  const ratio = singleSentenceParas.length / paragraphs.length;

  // Look for sequences of 3+ single-sentence paragraphs
  const matches = [];
  let streak = 0;
  let streakStart = -1;

  for (let i = 0; i < paragraphs.length; i++) {
    const trimmed = paragraphs[i].trim();
    const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const isSingleSentence = sentences.length <= 1 && trimmed.split(/\s+/).length <= 15;

    if (isSingleSentence) {
      if (streak === 0) streakStart = i;
      streak++;
    } else {
      if (streak >= 3) {
        const startOffset = text.indexOf(paragraphs[streakStart]);
        const endPara = paragraphs[streakStart + streak - 1];
        const endOffset = text.indexOf(endPara) + endPara.length;
        matches.push({
          snippet: highlightRange(text, startOffset, endOffset - startOffset),
          start: startOffset,
          length: endOffset - startOffset,
          explanation: `${streak} single-sentence paragraphs in a row. This is "broetry" — the LinkedIn scroll-bait format designed to game the "see more" button. Write in actual paragraphs.`
        });
      }
      streak = 0;
    }
  }

  // Check final streak
  if (streak >= 3) {
    const startOffset = text.indexOf(paragraphs[streakStart]);
    const endPara = paragraphs[streakStart + streak - 1];
    const endOffset = text.indexOf(endPara) + endPara.length;
    matches.push({
      snippet: highlightRange(text, startOffset, endOffset - startOffset),
      start: startOffset,
      length: endOffset - startOffset,
      explanation: `${streak} single-sentence paragraphs in a row. This is "broetry" — the LinkedIn scroll-bait format. Write in actual paragraphs.`
    });
  }

  return { matches, ratio, singleCount: singleSentenceParas.length, totalParas: paragraphs.length };
}

function detectHashtagSpam(text) {
  const hashtags = text.match(/#[A-Za-z]\w*/g) || [];
  if (hashtags.length > 5) {
    const firstHashtag = text.indexOf("#");
    return [{
      snippet: highlightRange(text, firstHashtag, text.length - firstHashtag),
      start: firstHashtag,
      length: text.length - firstHashtag,
      explanation: `${hashtags.length} hashtags. More than 3-5 is spam. LinkedIn's algorithm doesn't reward hashtag quantity — it rewards engagement. Pick your top 3.`
    }];
  }
  return [];
}

function detectHookPayoff(text) {
  const lines = text.split(/\n/).filter(l => l.trim().length > 0);
  if (lines.length < 2) return [];

  const matches = [];
  const hookPatterns = [
    /^i\s+quit\b/i,
    /^i\s+got\s+fired\b/i,
    /^i\s+was\s+wrong\b/i,
    /^nobody\s+(?:told|tells)\s+(?:me|you)\b/i,
    /^here's?\s+(?:what|why|the\s+thing)\b/i,
    /^stop\s+doing\b/i,
    /^the\s+(?:truth|reality|problem)\s+(?:is|about)\b/i,
    /^i\s+(?:lost|failed|almost)\b/i,
    /^(?:this|that)\s+(?:changed|broke|destroyed)\b/i,
    /^(?:unpopular\s+opinion|hot\s+take|controversial)\b/i,
  ];

  const firstLine = lines[0].trim();
  const isHook = hookPatterns.some(p => p.test(firstLine));
  const isShort = firstLine.split(/\s+/).length <= 10;

  if (isHook && isShort) {
    matches.push({
      snippet: highlightRange(text, 0, firstLine.length),
      start: 0,
      length: firstLine.length,
      explanation: `"${firstLine}" — this is a scroll-stopper hook. A dramatic short opening line designed to get people to click "see more." The format is formulaic and instantly recognizable as LinkedIn AI content.`
    });
  }

  return matches;
}

function detectMotivationalArc(text) {
  const lower = text.toLowerCase();
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  if (paragraphs.length < 3) return [];

  // Look for struggle → transformation → lesson template
  const strugglePatterns = /\b(?:struggled|failed|lost|rock bottom|hit a wall|gave up|fired|rejected|broke|crisis)\b/gi;
  const transformPatterns = /\b(?:then|but then|everything changed|fast forward|today|now i|turning point|breakthrough)\b/gi;
  const lessonPatterns = /\b(?:the lesson|here's what i learned|the takeaway|moral of the story|what i realized|if i can|so can you|never give up)\b/gi;

  const struggles = (lower.match(strugglePatterns) || []).length;
  const transforms = (lower.match(transformPatterns) || []).length;
  const lessons = (lower.match(lessonPatterns) || []).length;

  if (struggles >= 1 && transforms >= 1 && lessons >= 1) {
    return [{
      snippet: `Struggle (${struggles}) → Transformation (${transforms}) → Lesson (${lessons})`,
      start: 0,
      length: 0,
      explanation: "Your post follows the classic LinkedIn motivational arc: struggle, then transformation, then lesson. This template is so common it's become a parody of itself. Consider a less formulaic structure."
    }];
  }
  return [];
}

// ============================================================
// LAYER 3: WRITING RHYTHM (simplified for LinkedIn)
// ============================================================

function analyzeRhythm(text) {
  const sentences = extractSentences(text);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

  // Sentence length variance
  const sentLengths = sentences.map(s => s.text.split(/\s+/).filter(Boolean).length);
  const sentStdDev = stddev(sentLengths);
  const sentMean = mean(sentLengths);

  // Paragraph length uniformity
  const paraLengths = paragraphs.map(p => p.split(/\s+/).filter(Boolean).length);
  const paraStdDev = stddev(paraLengths);

  // Broetry score
  const singleSentenceParas = paragraphs.filter(p => {
    const trimmed = p.trim();
    const sents = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sents.length <= 1 && trimmed.split(/\s+/).length <= 15;
  });
  const broetryRatio = paragraphs.length > 0 ? singleSentenceParas.length / paragraphs.length : 0;

  return {
    sentenceVariety: {
      value: sentStdDev,
      mean: sentMean,
      rating: sentStdDev > 6 ? "good" : sentStdDev > 3 ? "warn" : "bad",
      label: "Sentence rhythm",
      hint: "Do your sentences vary in length, or are they all the same size? Human writing swings wildly; AI stays flat.",
      description: sentStdDev > 6
        ? `Varied — your sentences range widely in length (avg ${sentMean.toFixed(0)} words, spread ${sentStdDev.toFixed(1)}).`
        : sentStdDev > 3
          ? `Somewhat flat — sentences are fairly similar in length (avg ${sentMean.toFixed(0)} words, spread ${sentStdDev.toFixed(1)}). Mix short punchy lines with longer ones.`
          : `Flat — your sentences are all about the same length (avg ${sentMean.toFixed(0)} words, spread ${sentStdDev.toFixed(1)}). Human writing swings between 3 and 40+ word sentences.`,
    },
    paragraphShape: {
      value: paraStdDev,
      rating: paraStdDev > 15 ? "good" : paraStdDev > 5 ? "warn" : "bad",
      label: "Paragraph shape",
      hint: "Are your paragraphs different sizes, or do they all look the same? AI produces eerily uniform blocks.",
      description: paraStdDev > 15
        ? `Varied — your paragraphs range from short to long.`
        : paraStdDev > 5
          ? `Somewhat uniform — paragraphs are similar sizes. Mix 1-sentence and multi-sentence paragraphs.`
          : `Uniform — all paragraphs are about the same size. This is a common AI pattern.`,
    },
    broetryScore: {
      value: broetryRatio,
      rating: broetryRatio < 0.3 ? "good" : broetryRatio < 0.6 ? "warn" : "bad",
      label: "Broetry score",
      hint: "What percentage of your paragraphs are single sentences? High = the LinkedIn scroll-bait format.",
      description: broetryRatio < 0.3
        ? `Low (${(broetryRatio * 100).toFixed(0)}% single-sentence paragraphs) — your post has real paragraphs, not just one-liners.`
        : broetryRatio < 0.6
          ? `Medium (${(broetryRatio * 100).toFixed(0)}% single-sentence paragraphs) — getting into broetry territory. Some one-liners are fine, but this many suggest scroll-bait formatting.`
          : `High (${(broetryRatio * 100).toFixed(0)}% single-sentence paragraphs) — classic broetry. Your post is mostly one-liners stacked vertically. This is the #1 LinkedIn AI formatting tell.`,
    },
  };
}

// ============================================================
// LAYER 4: MODEL FINGERPRINTING (kept internally, de-emphasized in UI)
// ============================================================

function fingerprint(phraseHits) {
  const modelCounts = {};
  const modelEvidence = {};

  phraseHits.forEach(hit => {
    (hit.models || []).forEach(model => {
      modelCounts[model] = (modelCounts[model] || 0) + hit.count;
      if (!modelEvidence[model]) modelEvidence[model] = [];
      modelEvidence[model].push({ text: hit.text, count: hit.count });
    });
  });

  const sorted = Object.entries(modelCounts).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0];

  if (!primary || primary[1] < 3) {
    return { hasPrimary: false, text: "Some AI-associated patterns found, but not enough to suggest a specific model." };
  }

  const modelNames = { chatgpt: "ChatGPT", claude: "Claude", gemini: "Gemini", deepseek: "DeepSeek", chinese_llm: "Chinese LLM", kimi: "Kimi", grok: "Grok" };
  const name = modelNames[primary[0]] || primary[0];
  const evidence = modelEvidence[primary[0]].slice(0, 5).map(e => `'${e.text}' (${e.count}x)`).join(", ");

  let result = `Most patterns associated with ${name} (${primary[1]} matches: ${evidence}). This is a heuristic signal, not a definitive attribution.`;

  const secondary = sorted.filter(([, count]) => count >= 3).slice(1);
  if (secondary.length > 0) {
    const extras = secondary.map(([m, c]) => `${modelNames[m] || m} (${c})`).join(", ");
    result += ` Also seen in: ${extras}`;
  }

  return { hasPrimary: true, model: primary[0], name, count: primary[1], text: result };
}

// ============================================================
// LAYER 5: TREADMILL DETECTOR
// ============================================================

function detectTreadmill(text) {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  if (paragraphs.length < 2) return [];

  const matches = [];
  const getNounPhrases = (para) => {
    const words = para.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    return new Set(words);
  };

  for (let i = 1; i < paragraphs.length; i++) {
    const current = getNounPhrases(paragraphs[i]);
    let maxOverlap = 0;
    let maxJ = 0;

    for (let j = 0; j < i; j++) {
      const prev = getNounPhrases(paragraphs[j]);
      const overlap = [...current].filter(w => prev.has(w)).length;
      const ratio = current.size > 0 ? overlap / current.size : 0;
      if (ratio > maxOverlap) {
        maxOverlap = ratio;
        maxJ = j;
      }
    }

    if (maxOverlap > 0.5 && current.size > 5) {
      const offset = text.indexOf(paragraphs[i]);
      matches.push({
        snippet: `Paragraph ${i + 1} shares ${(maxOverlap * 100).toFixed(0)}% of its vocabulary with paragraph ${maxJ + 1}.`,
        start: offset,
        length: paragraphs[i].length,
        explanation: `Paragraph ${i + 1} mostly restates what you already said in paragraph ${maxJ + 1}. Cut, combine, or add genuinely new information.`,
        paragraphIndex: i,
        overlapPercent: maxOverlap,
      });
    }
  }

  return matches;
}

// ============================================================
// LAYER 6: CONCRETENESS SCORER
// ============================================================

function analyzeConcreteness(text) {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const matches = [];

  const concretePatterns = /\b(?:\d+(?:,\d{3})*(?:\.\d+)?%?|\$\d|#\d|[A-Z][a-z]+\s+[A-Z][a-z]+)\b/g;
  const vagueWords = /\b(?:significant|various|numerous|many|several|certain|particular|specific|important|interesting|relevant|appropriate|considerable|substantial|remarkable|notable)\b/gi;

  paragraphs.forEach((para, idx) => {
    const words = para.split(/\s+/).filter(Boolean);
    if (words.length < 10) return;

    const concretes = (para.match(concretePatterns) || []).length;
    const vagues = (para.match(vagueWords) || []).length;

    if (concretes === 0 && vagues >= 2) {
      const offset = text.indexOf(para);
      matches.push({
        snippet: `Paragraph ${idx + 1}: ${vagues} vague words, 0 specific names/numbers/dates.`,
        start: offset,
        length: para.length,
        explanation: `This paragraph is all abstractions — no proper nouns, numbers, dates, or quotes. Add something concrete your LinkedIn audience can picture or verify.`,
        paragraphIndex: idx,
        vagueCount: vagues,
        concreteCount: concretes,
      });
    }
  });

  return matches;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function extractSentences(text) {
  const sentences = [];
  const regex = /[^.!?\n]+[.!?]*/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    const trimmed = m[0].trim();
    if (trimmed.length < 2) continue;
    const leadWS = m[0].indexOf(trimmed);
    sentences.push({
      text: trimmed,
      start: m.index + leadWS,
      length: trimmed.length,
    });
  }
  return sentences;
}

function collectRegexMatches(text, patterns) {
  const matches = [];
  patterns.forEach(pattern => {
    const flags = pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g";
    const re = new RegExp(pattern.source, flags);
    let m;
    while ((m = re.exec(text)) !== null) {
      matches.push({
        snippet: highlightRange(text, m.index, m[0].length),
        start: m.index,
        length: m[0].length,
      });
    }
  });
  return matches;
}

function highlightRange(text, start, length) {
  const buf = 50;
  const s = Math.max(0, start - buf);
  const e = Math.min(text.length, start + length + buf);
  const before = escapeHtml(text.slice(s, start));
  const target = escapeHtml(text.slice(start, start + length));
  const after = escapeHtml(text.slice(start + length, e));
  const prefix = s > 0 ? "..." : "";
  const suffix = e < text.length ? "..." : "";
  return `${prefix}${before}<mark>${target}</mark>${after}${suffix}`;
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function mean(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function stddev(arr) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  const variance = arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

// ============================================================
// MAIN ANALYSIS ENGINE
// ============================================================

function analyze(text) {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount < 20) {
    return { wordCount, tooShort: true };
  }

  // Layer 1: Phrase matching
  // Normalize smart quotes — LinkedIn/mobile copy-paste uses curly quotes
  const normalized = text
    .replace(/[\u2018\u2019\u201A\uFF07]/g, "'")   // smart single quotes → straight
    .replace(/[\u201C\u201D\u201E\uFF02]/g, '"');   // smart double quotes → straight
  const phraseHits = [];
  const lower = normalized.toLowerCase();
  PHRASE_DB.forEach(entry => {
    const target = entry.text.toLowerCase();
    let count = 0;
    let pos = 0;
    const occurrences = [];
    while (pos < lower.length) {
      const idx = lower.indexOf(target, pos);
      if (idx === -1) break;
      const before = idx > 0 ? lower[idx - 1] : " ";
      const after = idx + target.length < lower.length ? lower[idx + target.length] : " ";
      if (/\w/.test(before) || /\w/.test(after)) {
        if (!target.includes(" ") && (/[a-z]/.test(before) || /[a-z]/.test(after))) {
          pos = idx + 1;
          continue;
        }
      }
      count++;
      occurrences.push({ start: idx, length: target.length });
      pos = idx + target.length;
    }
    if (count > 0) {
      phraseHits.push({ ...entry, count, occurrences });
    }
  });

  // Deduplicate: when a shorter phrase overlaps with a longer one at the same
  // position, remove the shorter match to avoid double-counting
  // (e.g. "paradigm" + "paradigm shift", "testament" + "testament to")
  for (let i = phraseHits.length - 1; i >= 0; i--) {
    const hit = phraseHits[i];
    const dominated = hit.occurrences.every(occ => {
      return phraseHits.some((other, j) => {
        if (j === i || other.text.length <= hit.text.length) return false;
        return other.occurrences.some(oo =>
          oo.start <= occ.start && (oo.start + oo.length) >= (occ.start + occ.length)
        );
      });
    });
    if (dominated) {
      phraseHits.splice(i, 1);
    }
  }

  // Layer 2: Structural patterns (9 kept + 4 new = 13)
  // Use normalized text so contractions with smart quotes ("don\u2019t") match
  const broetryResult = detectBroetry(normalized);
  const structures = {
    binaryContrasts: { label: "Binary contrast ('not X — it's Y')", matches: detectBinaryContrasts(normalized), explanation: "The most commonly identified AI writing pattern. Just state Y directly." },
    negativeListings: { label: "Negative listings", matches: detectNegativeListings(normalized), explanation: "Multiple 'Not a...' sentences before the reveal. A dead giveaway on LinkedIn." },
    fragments: { label: "Dramatic fragments", matches: detectFragments(normalized), explanation: "Short fragments in sequence for manufactured drama." },
    ruleOfThree: { label: "Numbered/bulleted lists", matches: detectRuleOfThree(normalized), explanation: "AI defaults to structured lists where flowing prose would be stronger." },
    emojiFormatting: { label: "Emoji as formatting", matches: detectEmojiFormatting(normalized), explanation: "Heavy emoji markers are a LinkedIn AI content hallmark." },
    notOnlyButAlso: { label: "'Not only... but also'", matches: detectNotOnlyButAlso(normalized), explanation: "AI overuses this additive structure at 2-5x the human rate." },
    conclusionBloat: { label: "Conclusion bloat", matches: detectConclusionBloat(normalized), explanation: "AI never trusts the reader to remember what they just read." },
    ingOpeners: { label: "-ing sentence openers", matches: detectIngOpeners(normalized), explanation: "AI starts sentences with present participles at 2-5x the human rate." },
    transitionDensity: { label: "Transition word overuse", matches: detectTransitionDensity(normalized), explanation: "Formal transitions at 3-5x the human rate." },
    // 4 new LinkedIn-specific
    broetry: { label: "Broetry (scroll-bait paragraphs)", matches: broetryResult.matches || [], explanation: "Sequences of single-sentence paragraphs designed to game LinkedIn's 'see more' button." },
    hashtagSpam: { label: "Hashtag spam", matches: detectHashtagSpam(normalized), explanation: "More than 5 hashtags is spam. Pick your top 3." },
    hookPayoff: { label: "Hook/payoff opener", matches: detectHookPayoff(normalized), explanation: "Dramatic short opening line designed as a scroll-stopper." },
    motivationalArc: { label: "Motivational arc", matches: detectMotivationalArc(normalized), explanation: "The struggle \u2192 transformation \u2192 lesson template." },
  };

  // Layer 3: Writing rhythm
  const rhythm = analyzeRhythm(normalized);

  // Layer 4: Model fingerprint (kept internally)
  const fp = fingerprint(phraseHits);

  // Layer 5: Treadmill
  const treadmill = detectTreadmill(normalized);

  // Layer 6: Concreteness
  const concreteness = analyzeConcreteness(normalized);

  // Count total issues
  const phraseIssues = phraseHits.reduce((s, h) => s + h.count, 0);
  const structureIssues = Object.values(structures).reduce((s, v) => s + v.matches.length, 0);
  const rhythmIssues = Object.values(rhythm).filter(m => m.rating === "bad").length;
  const treadmillIssues = treadmill.length;
  const concreteIssues = concreteness.length;
  const totalIssues = phraseIssues + structureIssues + rhythmIssues + treadmillIssues + concreteIssues;

  // Compute worst category for summary bar
  const categoryCounts = {};
  phraseHits.forEach(h => {
    const cat = h.category;
    categoryCounts[cat] = (categoryCounts[cat] || 0) + h.count;
  });
  Object.entries(structures).forEach(([key, s]) => {
    if (s.matches.length > 0) {
      categoryCounts[key] = (categoryCounts[key] || 0) + s.matches.length;
    }
  });
  const worstCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];

  // Engagement bait count
  const engagementBaitCount = phraseHits
    .filter(h => h.category === "engagement_bait")
    .reduce((s, h) => s + h.count, 0);

  // AI Score: 0 (human) to 100 (pure slop)
  const phraseDensity = Math.min(1, (phraseIssues / wordCount) * 8);
  const structureDensity = Math.min(1, structureIssues / 6);
  const broetryPenalty = rhythm.broetryScore.value;
  const baitPenalty = Math.min(1, engagementBaitCount / 4);
  const rhythmPenalty = Object.values(rhythm).filter(m => m.rating === "bad").length / 3;
  const rawScore = (phraseDensity * 40) + (structureDensity * 20) + (broetryPenalty * 15) + (baitPenalty * 15) + (rhythmPenalty * 10);
  const aiScore = Math.min(100, Math.round(rawScore));

  return {
    wordCount,
    tooShort: false,
    shortWarning: wordCount < 100,
    phraseHits,
    structures,
    rhythm,
    fingerprint: fp,
    treadmill,
    concreteness,
    totalIssues,
    phraseIssues,
    structureIssues,
    worstCategory: worstCategory ? { name: worstCategory[0], count: worstCategory[1] } : null,
    engagementBaitCount,
    broetryResult: broetryResult,
    aiScore,
  };
}

// ============================================================
// UI RENDERING
// ============================================================

// Load benchmark distribution for percentile comparison
let benchmarkDist = null;
fetch("distribution.json")
  .then(r => r.json())
  .then(d => { benchmarkDist = d; })
  .catch(() => { /* distribution not available, percentile won't show */ });

const editor = document.getElementById("editor");
const overlay = document.getElementById("editor-overlay");
const analyzeBtn = document.getElementById("analyze-btn");
const clearBtn = document.getElementById("clear-btn");
const wordCountEl = document.getElementById("word-count");
const textWarning = document.getElementById("text-warning");
const summarySection = document.getElementById("summary-section");
const summaryBar = document.getElementById("summary-bar");
const findingsSection = document.getElementById("findings-section");
const tabBar = document.getElementById("tab-bar");
const copyReportBtn = document.getElementById("copy-report-btn");

let lastResult = null;

// Category display names
const CATEGORY_LABELS = {
  vocabulary: "AI Vocabulary",
  phrase: "AI Phrases",
  filler: "Filler Phrases",
  transition: "Transition Overuse",
  inflation: "Significance Inflation",
  engagement_bait: "Engagement Bait",
  humble_brag: "Humble Brags",
  thought_leader: "Thought Leader Cliches",
  journey_narrative: "Journey Narrative",
  meta: "Meta-commentary",
  throat_clearing: "Throat-clearing",
  emphasis: "Emphasis Crutches",
  performative: "Performative Depth",
  treadmill: "Treadmill Markers",
  conclusion_bloat: "Conclusion Bloat",
  // Structural
  binaryContrasts: "Binary Contrasts",
  negativeListings: "Negative Listings",
  fragments: "Dramatic Fragments",
  ruleOfThree: "Numbered Lists",
  emojiFormatting: "Emoji Formatting",
  notOnlyButAlso: "Not Only But Also",
  conclusionBloat: "Conclusion Bloat",
  ingOpeners: "-ing Openers",
  transitionDensity: "Transition Density",
  broetry: "Broetry",
  hashtagSpam: "Hashtag Spam",
  hookPayoff: "Hook/Payoff",
  motivationalArc: "Motivational Arc",
};

// Tab switching
function switchToTab(tabName) {
  tabBar.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  const target = tabBar.querySelector(`.tab[data-tab="${tabName}"]`);
  if (target) target.classList.add("active");
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
  const panel = document.getElementById(`panel-${tabName}`);
  if (panel) panel.classList.add("active");
  // Scroll findings into view
  findingsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

tabBar.addEventListener("click", e => {
  const tab = e.target.closest(".tab");
  if (!tab) return;
  switchToTab(tab.dataset.tab);
});

// Stat cards click — jump to relevant tab
document.getElementById("summary-bar").addEventListener("click", e => {
  const card = e.target.closest(".stat-card");
  if (!card || !card.dataset.goto) return;
  switchToTab(card.dataset.goto);
});

// Sync overlay scroll with textarea
editor.addEventListener("scroll", () => {
  overlay.scrollTop = editor.scrollTop;
  overlay.scrollLeft = editor.scrollLeft;
});

// Word count on input
editor.addEventListener("input", () => {
  const words = editor.value.trim().split(/\s+/).filter(Boolean).length;
  wordCountEl.textContent = `${words} word${words === 1 ? "" : "s"}`;
});

// Auto-analyze on paste
editor.addEventListener("paste", () => {
  setTimeout(runAnalysis, 50);
});

// Buttons
analyzeBtn.addEventListener("click", runAnalysis);
clearBtn.addEventListener("click", () => {
  editor.value = "";
  editor.dispatchEvent(new Event("input"));
  overlay.innerHTML = "";
  summarySection.classList.add("hidden");
  findingsSection.classList.add("hidden");
  textWarning.textContent = "";
  lastResult = null;
});

copyReportBtn.addEventListener("click", async () => {
  if (!lastResult || lastResult.tooShort) return;
  const report = buildPlainReport(lastResult);
  try {
    await navigator.clipboard.writeText(report);
    copyReportBtn.textContent = "Copied!";
    setTimeout(() => { copyReportBtn.textContent = "Copy report"; }, 2000);
  } catch {
    copyReportBtn.textContent = "Failed";
    setTimeout(() => { copyReportBtn.textContent = "Copy report"; }, 2000);
  }
});

function runAnalysis() {
  const text = editor.value;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  wordCountEl.textContent = `${words} word${words === 1 ? "" : "s"}`;

  if (words < 20) {
    textWarning.textContent = words === 0 ? "" : "Paste at least 50 words for a meaningful analysis.";
    summarySection.classList.add("hidden");
    findingsSection.classList.add("hidden");
      overlay.innerHTML = "";
    return;
  }

  const result = analyze(text);
  lastResult = result;

  if (result.shortWarning) {
    textWarning.textContent = "Short text — analysis works better with 100+ words.";
  } else {
    textWarning.textContent = "";
  }

  // Show sections
  summarySection.classList.remove("hidden");
  findingsSection.classList.remove("hidden");

  // Score hero
  renderScore(result.aiScore);

  // Summary bar — 4 items
  document.getElementById("total-issues").textContent = result.totalIssues;
  document.querySelector("#total-issues + .stat-label").textContent = `Pattern${result.totalIssues === 1 ? "" : "s"} found`;

  const worstEl = document.getElementById("worst-category");
  if (result.worstCategory) {
    worstEl.querySelector(".stat-number").textContent = CATEGORY_LABELS[result.worstCategory.name] || result.worstCategory.name;
    worstEl.querySelector(".stat-number").style.fontSize = "1rem";
    worstEl.querySelector(".stat-label").textContent = `${result.worstCategory.count} hit${result.worstCategory.count === 1 ? "" : "s"}`;
    // Point to the right tab based on category type
    const buzzwordCats = ["vocabulary", "filler", "phrase", "transition", "inflation"];
    const clicheCats = ["engagement_bait", "humble_brag", "thought_leader", "journey_narrative", "meta", "throat_clearing", "emphasis", "performative", "conclusion_bloat", "treadmill"];
    const formattingKeys = ["broetry", "emojiFormatting", "ruleOfThree", "hashtagSpam", "fragments", "hookPayoff"];
    const cat = result.worstCategory.name;
    if (buzzwordCats.includes(cat)) worstEl.dataset.goto = "buzzwords";
    else if (clicheCats.includes(cat)) worstEl.dataset.goto = "cliches";
    else if (formattingKeys.includes(cat)) worstEl.dataset.goto = "formatting";
    else worstEl.dataset.goto = "quality";
  } else {
    worstEl.querySelector(".stat-number").textContent = "\u2014";
    worstEl.querySelector(".stat-number").style.fontSize = "";
    worstEl.querySelector(".stat-label").textContent = "Worst category";
  }

  const broetryEl = document.getElementById("broetry-score");
  const broetryRating = result.rhythm.broetryScore;
  broetryEl.querySelector(".stat-number").textContent = broetryRating.rating === "good" ? "Low" : broetryRating.rating === "warn" ? "Medium" : "High";
  broetryEl.querySelector(".stat-label").textContent = "Broetry score";

  const engBaitEl = document.getElementById("engagement-bait-count");
  engBaitEl.querySelector(".stat-number").textContent = result.engagementBaitCount;
  engBaitEl.querySelector(".stat-label").textContent = "Bait phrases";

  // Render 4 tab panels
  renderBuzzwordsPanel(result);
  renderClichesPanel(result);
  renderFormattingPanel(result);
  renderQualityPanel(result);

  // Render overlay highlights
  renderOverlay(text, result);
}

// ============================================================
// CLICK-TO-FIX
// ============================================================

function applyFix(phraseText, replacement) {
  const text = editor.value;
  // Normalize smart quotes for matching
  const normalized = text
    .replace(/[\u2018\u2019\u201A\uFF07]/g, "'")
    .replace(/[\u201C\u201D\u201E\uFF02]/g, '"');
  const lower = normalized.toLowerCase();
  const target = phraseText.toLowerCase();
  const idx = lower.indexOf(target);
  if (idx === -1) return;

  // Use first suggested replacement (before comma)
  const firstReplacement = replacement.replace(/^\[/, "").replace(/\]$/, "").split(",")[0].trim();
  if (!firstReplacement || firstReplacement.startsWith("cut") || firstReplacement.startsWith("just") || firstReplacement.startsWith("end") || firstReplacement.startsWith("let") || firstReplacement.startsWith("say") || firstReplacement.startsWith("weave") || firstReplacement.startsWith("name") || firstReplacement.startsWith("rephrase") || firstReplacement.startsWith("explain") || firstReplacement.startsWith("describe")) {
    // Deletion fix — remove the phrase
    const before = text.slice(0, idx);
    const after = text.slice(idx + target.length);
    // Clean up extra spaces
    editor.value = (before + after).replace(/  +/g, " ").replace(/^ /gm, "");
  } else {
    // Substitution fix — match original casing
    const original = text.slice(idx, idx + target.length);
    let fixed = firstReplacement;
    if (original[0] === original[0].toUpperCase()) {
      fixed = fixed[0].toUpperCase() + fixed.slice(1);
    }
    editor.value = text.slice(0, idx) + fixed + text.slice(idx + target.length);
  }

  editor.dispatchEvent(new Event("input"));
  runAnalysis();
}

// Render a fix button for a phrase hit
function renderFixButton(hit) {
  if (!hit.replacement) return "";
  const clean = hit.replacement.replace(/^\[/, "").replace(/\]$/, "");
  const isDelete = clean.startsWith("cut") || clean.startsWith("just") || clean.startsWith("end") || clean.startsWith("let") || clean.startsWith("say") || clean.startsWith("weave") || clean.startsWith("name") || clean.startsWith("rephrase") || clean.startsWith("explain") || clean.startsWith("describe");
  const label = isDelete ? "Remove" : "Fix";
  return ` <button class="btn-fix" onclick="applyFix('${hit.text.replace(/'/g, "\\'")}', '${hit.replacement.replace(/'/g, "\\'")}')">${label}</button>`;
}

// ============================================================
// SCORE RING
// ============================================================

function renderScore(score) {
  const fill = document.getElementById("score-fill");
  const value = document.getElementById("score-value");
  const verdict = document.getElementById("score-verdict");

  // Color: green < 25, amber 25-55, red > 55
  fill.classList.remove("warn", "bad");
  if (score > 55) fill.classList.add("bad");
  else if (score > 25) fill.classList.add("warn");

  // Minimum 3% width so low scores are visible
  const displayPercent = score > 0 ? Math.max(3, score) : 0;

  // Animate thermometer
  requestAnimationFrame(() => {
    fill.style.width = displayPercent + "%";
  });

  value.textContent = score;

  // Verdict text
  let verdictText;
  if (score <= 10) verdictText = "Sounds human";
  else if (score <= 25) verdictText = "A few AI-associated patterns";
  else if (score <= 45) verdictText = "Noticeable AI patterns";
  else if (score <= 65) verdictText = "Many AI-associated patterns";
  else if (score <= 85) verdictText = "Heavy pattern density";
  else verdictText = "Very high pattern density";

  // Add percentile from benchmark if available
  if (benchmarkDist && benchmarkDist.percentiles) {
    const pcts = benchmarkDist.percentiles;
    let percentile = 0;
    for (let p = 100; p >= 0; p--) {
      if (score >= pcts[p]) { percentile = p; break; }
    }
    verdictText += ` — higher than ${percentile}% of ${benchmarkDist.totalPosts} benchmarked posts`;
  }

  verdict.textContent = verdictText;
}

// ============================================================
// TAB 1: AI Buzzwords
// Categories: vocabulary, filler, phrase, transition, inflation
// ============================================================
function renderBuzzwordsPanel(result) {
  const panel = document.getElementById("panel-buzzwords");
  const buzzwordCats = ["vocabulary", "filler", "phrase", "transition", "inflation"];
  const hits = result.phraseHits.filter(h => buzzwordCats.includes(h.category));

  if (hits.length === 0) {
    panel.innerHTML = `<div class="empty-state">No AI buzzwords detected<span>Your vocabulary sounds human.</span></div>`;
    return;
  }

  const categories = {};
  hits.forEach(hit => {
    const cat = hit.category;
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(hit);
  });

  let html = "";
  Object.entries(categories).forEach(([cat, catHits]) => {
    const totalCount = catHits.reduce((s, h) => s + h.count, 0);
    html += `<div class="finding-card">
      <div class="finding-header">
        <h3 class="finding-title">${CATEGORY_LABELS[cat] || cat}</h3>
        <span class="finding-count">${totalCount}</span>
      </div>`;

    catHits.sort((a, b) => b.tier - a.tier || b.count - a.count).slice(0, 15).forEach(hit => {
      html += `<div style="margin-top: 0.6rem; padding-top: 0.6rem; border-top: 1px solid var(--border-light);">
        <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <strong style="color:var(--red);">'${escapeHtml(hit.text)}'</strong>
          <span style="color:var(--text-light); font-size:0.95rem;">${hit.count}x</span>
          ${renderFixButton(hit)}
        </div>
        <p class="finding-explanation">${escapeHtml(hit.explanation)}</p>
        ${hit.replacement ? `<p class="finding-suggestion">Try: ${escapeHtml(hit.replacement)}</p>` : ""}
      </div>`;
    });
    html += `</div>`;
  });

  panel.innerHTML = html;
}

// ============================================================
// TAB 2: LinkedIn Cliches
// Categories: engagement_bait, humble_brag, thought_leader,
//   journey_narrative, meta, throat_clearing, emphasis,
//   performative, conclusion_bloat, treadmill
// ============================================================
function renderClichesPanel(result) {
  const panel = document.getElementById("panel-cliches");
  const clicheCats = ["engagement_bait", "humble_brag", "thought_leader", "journey_narrative", "meta", "throat_clearing", "emphasis", "performative", "conclusion_bloat", "treadmill"];
  const hits = result.phraseHits.filter(h => clicheCats.includes(h.category));

  if (hits.length === 0) {
    panel.innerHTML = `<div class="empty-state">No LinkedIn cliches detected<span>Your post sounds original.</span></div>`;
    return;
  }

  const categories = {};
  hits.forEach(hit => {
    const cat = hit.category;
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(hit);
  });

  let html = "";
  Object.entries(categories).forEach(([cat, catHits]) => {
    const totalCount = catHits.reduce((s, h) => s + h.count, 0);
    html += `<div class="finding-card">
      <div class="finding-header">
        <h3 class="finding-title">${CATEGORY_LABELS[cat] || cat}</h3>
        <span class="finding-count">${totalCount}</span>
      </div>`;

    catHits.sort((a, b) => b.tier - a.tier || b.count - a.count).slice(0, 15).forEach(hit => {
      html += `<div style="margin-top: 0.6rem; padding-top: 0.6rem; border-top: 1px solid var(--border-light);">
        <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <strong style="color:var(--red);">'${escapeHtml(hit.text)}'</strong>
          <span style="color:var(--text-light); font-size:0.95rem;">${hit.count}x</span>
          ${renderFixButton(hit)}
        </div>
        <p class="finding-explanation">${escapeHtml(hit.explanation)}</p>
        ${hit.replacement ? `<p class="finding-suggestion">Try: ${escapeHtml(hit.replacement)}</p>` : ""}
      </div>`;
    });
    html += `</div>`;
  });

  panel.innerHTML = html;
}

// ============================================================
// TAB 3: Formatting Tricks
// Structural: broetry, emojiFormatting, ruleOfThree, hashtagSpam,
//   fragments, hookPayoff
// ============================================================
function renderFormattingPanel(result) {
  const panel = document.getElementById("panel-formatting");
  const formattingKeys = ["broetry", "emojiFormatting", "ruleOfThree", "hashtagSpam", "fragments", "hookPayoff"];
  const active = formattingKeys
    .filter(k => result.structures[k] && result.structures[k].matches.length > 0)
    .map(k => ({ key: k, ...result.structures[k] }));

  if (active.length === 0) {
    panel.innerHTML = `<div class="empty-state">No formatting tricks detected<span>Your post is formatted naturally.</span></div>`;
    return;
  }

  let html = "";
  active.forEach(struct => {
    html += `<div class="finding-card">
      <div class="finding-header">
        <h3 class="finding-title">${escapeHtml(struct.label)}</h3>
        <span class="finding-count">${struct.matches.length}</span>
      </div>
      <p class="finding-explanation">${escapeHtml(struct.explanation)}</p>`;

    struct.matches.slice(0, 3).forEach(m => {
      html += `<div class="finding-snippet">${m.snippet}</div>`;
      if (m.explanation) {
        html += `<p class="finding-suggestion">${escapeHtml(m.explanation)}</p>`;
      }
    });

    if (struct.matches.length > 3) {
      html += `<p style="color:var(--text-light); font-size:0.95rem; margin-top:0.5rem;">+${struct.matches.length - 3} more</p>`;
    }
    html += `</div>`;
  });

  panel.innerHTML = html;
}

// ============================================================
// TAB 4: Writing Quality
// Rhythm metrics, em dashes, binary contrasts, negative listings,
// not-only-but-also, -ing openers, transition density,
// motivational arc, treadmill (paragraph overlap), vagueness
// ============================================================
function renderQualityPanel(result) {
  const panel = document.getElementById("panel-quality");
  let html = "";

  // Rhythm metrics
  const metrics = result.rhythm;
  Object.values(metrics).forEach(metric => {
    let barWidth;
    if (metric.label === "Sentence rhythm") {
      barWidth = Math.min(100, metric.value * 5);
    } else if (metric.label === "Paragraph shape") {
      barWidth = Math.min(100, metric.value * 3);
    } else if (metric.label === "Broetry score") {
      barWidth = Math.min(100, metric.value * 100);
    } else {
      barWidth = Math.min(100, metric.value * 50);
    }

    html += `<div class="rhythm-metric">
      <div class="rhythm-label">${escapeHtml(metric.label)}</div>
      ${metric.hint ? `<div class="rhythm-description">${escapeHtml(metric.hint)}</div>` : ""}
      <div class="rhythm-bar-wrap">
        <div class="rhythm-bar-human" style="left:40%;width:40%;"></div>
        <div class="rhythm-bar-value ${metric.rating}" style="width:${barWidth}%;"></div>
      </div>
      <div class="rhythm-verdict ${metric.rating}">${escapeHtml(metric.description)}</div>
    </div>`;
  });

  // Em dash count
  const emDashes = (editor.value.match(/—|–/g) || []).length;
  const wordCount = result.wordCount;
  if (emDashes > 0) {
    const per400 = ((emDashes / wordCount) * 400).toFixed(1);
    const rating = emDashes > 4 ? "bad" : emDashes > 2 ? "warn" : "good";
    html += `<div class="rhythm-metric">
      <div class="rhythm-label">Em dash usage</div>
      <div class="rhythm-bar-wrap">
        <div class="rhythm-bar-human" style="left:5%;width:15%;"></div>
        <div class="rhythm-bar-value ${rating}" style="width:${Math.min(100, emDashes * 12)}%;"></div>
      </div>
      <div class="rhythm-verdict ${rating}">${emDashes} em dash${emDashes === 1 ? "" : "es"} in ${wordCount} words (${per400} per 400 words). ${emDashes > 4 ? "AI loves em dashes. Try commas or periods." : emDashes > 2 ? "Getting high. Watch the em dash count." : "Within normal range."}</div>
    </div>`;
  }

  // Structural findings for quality tab
  const qualityKeys = ["binaryContrasts", "negativeListings", "notOnlyButAlso", "ingOpeners", "transitionDensity", "motivationalArc"];
  const activeStructures = qualityKeys
    .filter(k => result.structures[k] && result.structures[k].matches.length > 0)
    .map(k => ({ key: k, ...result.structures[k] }));

  activeStructures.forEach(struct => {
    html += `<div class="finding-card">
      <div class="finding-header">
        <h3 class="finding-title">${escapeHtml(struct.label)}</h3>
        <span class="finding-count">${struct.matches.length}</span>
      </div>
      <p class="finding-explanation">${escapeHtml(struct.explanation)}</p>`;

    struct.matches.slice(0, 3).forEach(m => {
      html += `<div class="finding-snippet">${m.snippet}</div>`;
      if (m.explanation) {
        html += `<p class="finding-suggestion">${escapeHtml(m.explanation)}</p>`;
      }
    });

    if (struct.matches.length > 3) {
      html += `<p style="color:var(--text-light); font-size:0.95rem; margin-top:0.5rem;">+${struct.matches.length - 3} more</p>`;
    }
    html += `</div>`;
  });

  // Treadmill (paragraph overlap)
  if (result.treadmill.length > 0) {
    html += `<div class="finding-card">
      <div class="finding-header">
        <h3 class="finding-title">Paragraph overlap</h3>
        <span class="finding-count">${result.treadmill.length}</span>
      </div>
      <p class="finding-explanation">These paragraphs restate earlier content without adding new information.</p>`;
    result.treadmill.forEach(m => {
      html += `<div class="finding-snippet">${escapeHtml(m.snippet)}</div>
        <p class="finding-suggestion">${escapeHtml(m.explanation)}</p>`;
    });
    html += `</div>`;
  }

  // Vagueness
  if (result.concreteness.length > 0) {
    html += `<div class="finding-card">
      <div class="finding-header">
        <h3 class="finding-title">Abstract paragraphs</h3>
        <span class="finding-count">${result.concreteness.length}</span>
      </div>
      <p class="finding-explanation">These paragraphs have zero specific names, numbers, or details — all abstractions.</p>`;
    result.concreteness.forEach(m => {
      html += `<div class="finding-snippet">${escapeHtml(m.snippet)}</div>
        <p class="finding-suggestion">${escapeHtml(m.explanation)}</p>`;
    });
    html += `</div>`;
  }

  if (html === "") {
    html = `<div class="empty-state">Writing quality looks solid<span>No major structural or rhythm issues detected.</span></div>`;
  }

  panel.innerHTML = html;
}

// ============================================================
// INLINE OVERLAY HIGHLIGHTING
// ============================================================

function renderOverlay(text, result) {
  const ranges = [];

  // From phrase hits
  result.phraseHits.forEach(hit => {
    hit.occurrences.forEach(occ => {
      ranges.push({ start: occ.start, end: occ.start + occ.length, tip: hit.explanation });
    });
  });

  // From structures
  Object.values(result.structures).forEach(struct => {
    struct.matches.forEach(m => {
      if (m.start > 0 && m.length > 0) {
        ranges.push({ start: m.start, end: m.start + m.length, tip: m.explanation || struct.explanation });
      }
    });
  });

  // Sort and deduplicate
  ranges.sort((a, b) => a.start - b.start);

  // Merge overlapping
  const merged = [];
  ranges.forEach(r => {
    if (merged.length > 0 && r.start < merged[merged.length - 1].end) {
      merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, r.end);
    } else {
      merged.push({ ...r });
    }
  });

  // Build overlay HTML
  let html = "";
  let pos = 0;
  merged.forEach(r => {
    if (r.start > pos) {
      html += escapeHtml(text.slice(pos, r.start));
    }
    html += `<mark data-tip="${escapeHtml(r.tip || "")}">${escapeHtml(text.slice(r.start, r.end))}</mark>`;
    pos = r.end;
  });
  if (pos < text.length) {
    html += escapeHtml(text.slice(pos));
  }

  overlay.innerHTML = html;
}

// Tooltip on hover
let tooltip = null;
document.addEventListener("mouseover", e => {
  if (e.target.tagName === "MARK" && e.target.closest("#editor-overlay")) {
    const tip = e.target.getAttribute("data-tip");
    if (!tip) return;
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.className = "mark-tooltip";
      document.body.appendChild(tooltip);
    }
    tooltip.innerHTML = `<strong>AI pattern:</strong> ${tip}`;
    tooltip.style.display = "block";
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = `${Math.min(rect.left, window.innerWidth - 340)}px`;
    tooltip.style.top = `${rect.bottom + 8}px`;
  }
});

document.addEventListener("mouseout", e => {
  if (e.target.tagName === "MARK" && tooltip) {
    tooltip.style.display = "none";
  }
});

// ============================================================
// PLAIN TEXT REPORT
// ============================================================

function buildPlainReport(result) {
  let report = "THE RED PEN — LinkedIn Edition\n";
  report += "=".repeat(40) + "\n\n";
  report += `AI Score: ${result.aiScore}/100`;
  if (benchmarkDist && benchmarkDist.percentiles) {
    const pcts = benchmarkDist.percentiles;
    let percentile = 0;
    for (let p = 100; p >= 0; p--) {
      if (result.aiScore >= pcts[p]) { percentile = p; break; }
    }
    report += ` (higher than ${percentile}% of ${benchmarkDist.totalPosts} benchmarked posts)`;
  }
  report += `\n`;
  report += `Total AI patterns found: ${result.totalIssues}\n`;
  report += `Word count: ${result.wordCount}\n`;

  if (result.worstCategory) {
    report += `Worst category: ${CATEGORY_LABELS[result.worstCategory.name] || result.worstCategory.name} (${result.worstCategory.count} hits)\n`;
  }
  report += `Engagement bait: ${result.engagementBaitCount}\n`;
  report += `Broetry score: ${result.rhythm.broetryScore.rating === "good" ? "Low" : result.rhythm.broetryScore.rating === "warn" ? "Medium" : "High"}\n`;

  report += `\nSentence rhythm: ${result.rhythm.sentenceVariety.description}\n`;
  report += `Paragraph shape: ${result.rhythm.paragraphShape.description}\n`;

  if (result.phraseHits.length > 0) {
    report += `\n--- AI Patterns (${result.phraseIssues} total) ---\n`;
    result.phraseHits.forEach(h => {
      report += `  '${h.text}' (${h.count}x) — ${h.explanation}\n`;
    });
  }

  const activeStructures = Object.values(result.structures).filter(s => s.matches.length > 0);
  if (activeStructures.length > 0) {
    report += `\n--- Structural Patterns (${result.structureIssues} total) ---\n`;
    activeStructures.forEach(s => {
      report += `  ${s.label}: ${s.matches.length} found — ${s.explanation}\n`;
    });
  }

  if (result.treadmill.length > 0) {
    report += `\n--- Repetition & Padding ---\n`;
    result.treadmill.forEach(m => {
      report += `  ${m.explanation}\n`;
    });
  }

  if (result.concreteness.length > 0) {
    report += `\n--- Vague vs Specific ---\n`;
    result.concreteness.forEach(m => {
      report += `  ${m.explanation}\n`;
    });
  }

  report += `\n---\nGenerated by The Red Pen — LinkedIn Edition\nBased on Stop Slop by Hardik Pandya\nAll analysis ran locally — your text never left your machine.\n`;
  return report;
}
