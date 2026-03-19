// ============================================================
// THE RED PEN — AI Writing Pattern Detector
// Based on Stop Slop by Hardik Pandya
// Zero dependencies. Everything runs client-side.
// ============================================================

// ============================================================
// LAYER 1: MASTER PHRASE DATABASE (300+ entries)
// Each: { text, tier, category, models[], replacement, explanation }
// ============================================================

const PHRASE_DB = [
  // --- TIER 1: Universal red flags (appear in virtually every AI database) ---
  { text: "delve", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "explore, examine, dig into", explanation: "'Delve' is one of the most overused AI words. Usage in published text jumped 400% after ChatGPT launched." },
  { text: "tapestry", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "mix, combination, fabric", explanation: "AI loves calling complex things a 'tapestry.' Real writers almost never use this word outside textile contexts." },
  { text: "testament", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "proof, evidence, sign", explanation: "'A testament to' is AI's favorite way to say something proves something. Just say it proves it." },
  { text: "pivotal", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "key, important, critical", explanation: "AI overuses 'pivotal' to make ordinary things sound decisive. Most things described as pivotal aren't." },
  { text: "underscore", tier: 1, category: "vocabulary", models: ["chatgpt", "claude"], replacement: "show, highlight, reveal", explanation: "AI uses 'underscore' as a verb to inflate significance. Just say 'shows' or 'highlights.'" },
  { text: "intricate", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "complex, detailed, involved", explanation: "'Intricate' appears in AI text at 5-10x the human rate. It's the AI word for 'complex.'" },
  { text: "intricacies", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "details, complexities, nuances", explanation: "Plural form of AI's favorite complexity word. Almost always replaceable with 'details.'" },
  { text: "meticulous", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "careful, thorough, precise", explanation: "AI describes everything careful as 'meticulous.' Try 'careful' or 'thorough.'" },
  { text: "crucial", tier: 1, category: "vocabulary", models: ["chatgpt", "claude"], replacement: "important, key, essential", explanation: "AI escalates everything to 'crucial.' Most things are just 'important.'" },
  { text: "landscape", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "field, area, world", explanation: "When not describing actual land, 'landscape' is pure AI speak. 'The AI landscape' — just say 'the AI field.'" },
  { text: "foster", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "encourage, support, build", explanation: "AI 'fosters' everything. Humans 'encourage' or 'support' things." },
  { text: "vibrant", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "lively, active, rich", explanation: "AI's go-to adjective for anything positive and active. Traced to RLHF annotator preferences." },
  { text: "comprehensive", tier: 1, category: "vocabulary", models: ["chatgpt", "chinese_llm"], replacement: "complete, thorough, full", explanation: "AI calls everything 'comprehensive.' If it actually covers everything, say 'complete.'" },
  { text: "showcase", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "show, display, demonstrate", explanation: "'Showcase' sounds like a trade show brochure. Just say 'show.'" },
  { text: "robust", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "strong, solid, reliable", explanation: "AI's favorite adjective for anything that works well. 'Strong' or 'solid' work fine." },
  { text: "seamless", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "smooth, easy, simple", explanation: "Nothing in software is truly seamless. If it's good, say 'smooth' or 'easy.'" },
  { text: "nuanced", tier: 1, category: "vocabulary", models: ["chatgpt", "claude"], replacement: "subtle, complex, layered", explanation: "AI uses 'nuanced' to sound sophisticated. It often means nothing specific." },
  { text: "realm", tier: 1, category: "vocabulary", models: ["chatgpt", "deepseek"], replacement: "area, field, domain", explanation: "'In the realm of' is fantasy-novel language in what should be plain prose." },
  { text: "enhance", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "improve, boost, strengthen", explanation: "AI 'enhances' everything. Humans 'improve' things." },
  { text: "innovative", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "new, creative, original", explanation: "The most overused word in tech marketing. If something is truly new, describe what it does differently." },
  { text: "groundbreaking", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "new, first, pioneering", explanation: "AI calls routine improvements 'groundbreaking.' Save it for things that actually break ground." },
  { text: "multifaceted", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "complex, varied, many-sided", explanation: "'Multifaceted' is AI's way of saying 'has multiple parts.' Just describe the parts." },
  { text: "leverage", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "use, apply, take advantage of", explanation: "'Leverage' as a verb is corporate jargon. Just say 'use.'" },
  { text: "holistic", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "complete, whole, overall", explanation: "AI loves 'holistic approaches.' Just describe what the approach actually covers." },
  { text: "transformative", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "powerful, significant, game-changing", explanation: "AI calls everything transformative. Describe what actually changed." },
  { text: "embark", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "start, begin, set out", explanation: "'Embark on a journey' is AI's favorite opening metaphor. Just say 'start.'" },

  // --- TIER 2: Strong signals (appear in 3+ databases) ---
  { text: "navigate", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "handle, manage, deal with", explanation: "AI 'navigates' everything — challenges, landscapes, complexities. Humans just handle things." },
  { text: "bolster", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "strengthen, support, boost", explanation: "AI uses 'bolster' to sound authoritative. 'Strengthen' or 'support' are clearer." },
  { text: "garner", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "get, earn, attract", explanation: "'Garner attention' — just say 'get attention.' 'Garner' is AI formality." },
  { text: "enduring", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "lasting, permanent, continuing", explanation: "AI pairs 'enduring' with legacy, impact, commitment. Try 'lasting.'" },
  { text: "interplay", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "interaction, relationship, connection", explanation: "'The interplay between X and Y' — just say 'how X and Y interact.'" },
  { text: "beacon", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "example, guide, light", explanation: "AI calls inspiring things 'beacons.' Almost always replaceable with 'example.'" },
  { text: "harness", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "use, apply, channel", explanation: "'Harness the power of' — just say 'use.' You're not taming a horse." },
  { text: "streamline", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "simplify, speed up, improve", explanation: "AI 'streamlines' processes. Describe what actually got simpler or faster." },
  { text: "commence", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "start, begin", explanation: "'Commence' is just a fancier 'start.' There's no reason to use it." },
  { text: "facilitate", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "help, enable, make possible", explanation: "'Facilitate' is corporate speak. Just say 'help' or 'make possible.'" },
  { text: "utilize", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "use", explanation: "'Utilize' is never better than 'use.' Ever." },
  { text: "profound", tier: 2, category: "vocabulary", models: ["chatgpt", "chinese_llm"], replacement: "deep, significant, major", explanation: "AI calls routine insights 'profound.' Save it for things that genuinely change understanding." },
  { text: "renowned", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "famous, well-known, respected", explanation: "AI calls everyone 'renowned.' If they're famous, just say famous." },
  { text: "encompass", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "include, cover, span", explanation: "'Encompass' sounds like a compass ad. Just say 'includes.'" },
  { text: "exemplify", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "show, demonstrate, represent", explanation: "'Exemplify' is AI formality. 'Shows' works fine." },
  { text: "cultivate", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "build, develop, grow", explanation: "AI 'cultivates' relationships, skills, environments. Just say 'builds.'" },
  { text: "paramount", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "most important, essential, critical", explanation: "'Paramount importance' — just say 'very important' or 'essential.'" },
  { text: "noteworthy", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "notable, important, worth mentioning", explanation: "AI flags things as 'noteworthy' that may not be. If it's worth noting, just note it." },
  { text: "versatile", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "flexible, adaptable, useful", explanation: "AI calls every tool 'versatile.' Describe what it actually does well." },
  { text: "commendable", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "impressive, good, praiseworthy", explanation: "AI uses 'commendable' like a teacher grading papers. Just say it's good or impressive." },
  { text: "spearhead", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "lead, drive, start", explanation: "'Spearhead an initiative' — just say 'lead.' You're not in a medieval army." },
  { text: "elucidate", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "explain, clarify, spell out", explanation: "No one says 'elucidate' in conversation. Just say 'explain.'" },
  { text: "burgeoning", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "growing, expanding, emerging", explanation: "AI loves 'burgeoning fields.' Just say 'growing.'" },
  { text: "propel", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "drive, push, move forward", explanation: "AI 'propels' things forward. Humans just 'push' or 'drive' things." },
  { text: "synergy", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "cooperation, combined effect", explanation: "The ultimate corporate buzzword. Describe what the combination actually produces." },
  { text: "myriad", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "many, countless, numerous", explanation: "'A myriad of' — just say 'many.' It's simpler and clearer." },
  { text: "plethora", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "many, lots of, abundance", explanation: "'A plethora of options' — just say 'many options.'" },
  { text: "resonate", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "connect, appeal, ring true", explanation: "AI says everything 'resonates.' Describe the specific effect instead." },

  // --- TIER 3: Moderate signals ---
  { text: "gossamer", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "thin, delicate, light", explanation: "AI uses 'gossamer' for literary flair. Real writers use it rarely and precisely." },
  { text: "labyrinth", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "maze, tangle, complexity", explanation: "AI loves 'labyrinthine' complexity metaphors. Just describe what's complex." },
  { text: "enigma", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "mystery, puzzle, question", explanation: "AI calls unknowns 'enigmas' for dramatic effect. Just say 'mystery.'" },
  { text: "symphony", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "combination, blend, harmony", explanation: "'A symphony of flavors' — AI's go-to food/sensory metaphor. Just describe the combination." },
  { text: "tableau", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "scene, picture, display", explanation: "AI uses 'tableau' for visual descriptions. Just say 'scene.'" },
  { text: "confluence", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "meeting, combination, convergence", explanation: "'A confluence of factors' — just say 'several factors combined.'" },
  { text: "ephemeral", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "brief, temporary, fleeting", explanation: "AI uses 'ephemeral' for poetic effect. 'Brief' or 'fleeting' are fine." },
  { text: "luminous", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "bright, glowing, radiant", explanation: "AI's preferred adjective for anything light-related. Just say 'bright.'" },
  { text: "palpable", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "obvious, strong, felt", explanation: "'The tension was palpable' — AI loves this construction. Just say 'obvious' or 'strong.'" },
  { text: "aforementioned", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "this, the, that", explanation: "Legalistic filler. Just use 'this' or 'the' or name the thing again." },
  { text: "notwithstanding", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "despite, even though, regardless", explanation: "AI uses 'notwithstanding' to sound formal. 'Despite' works fine." },
  { text: "henceforth", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "from now on, going forward", explanation: "Medieval formality. Just say 'from now on.'" },

  // --- Model-specific: Claude hedging ---
  { text: "it's worth noting", tier: 2, category: "phrase", models: ["claude"], replacement: "(just state the point)", explanation: "Claude's signature hedge. If it's worth noting, just note it without announcing that you're noting it." },
  { text: "while this may vary", tier: 2, category: "phrase", models: ["claude"], replacement: "(cut or be specific about what varies)", explanation: "Claude adds this disclaimer reflexively. Either be specific about what varies, or cut it." },
  { text: "in many cases", tier: 2, category: "phrase", models: ["claude"], replacement: "(name the cases or cut)", explanation: "Claude hedge. Either name the cases or just make your point." },
  { text: "generally speaking", tier: 2, category: "phrase", models: ["claude"], replacement: "(cut — just speak)", explanation: "Claude preamble. If you're speaking generally, the reader can tell." },
  { text: "i should note", tier: 2, category: "phrase", models: ["claude"], replacement: "(just note it)", explanation: "Claude self-narration. Don't announce what you're about to do — just do it." },
  { text: "it's important to consider", tier: 2, category: "phrase", models: ["claude"], replacement: "(consider it — no announcement needed)", explanation: "Claude hedge. If it's important, the content will show that." },
  { text: "it's important to note", tier: 2, category: "phrase", models: ["claude"], replacement: "(just state it)", explanation: "Claude's favorite qualifying phrase. Cut the preamble." },

  // --- Model-specific: DeepSeek ---
  { text: "in the realm of", tier: 2, category: "phrase", models: ["deepseek"], replacement: "in", explanation: "DeepSeek's signature pompous opener. Just say 'in.'" },
  { text: "unlocking", tier: 2, category: "vocabulary", models: ["deepseek"], replacement: "enabling, finding, accessing", explanation: "DeepSeek loves 'unlocking potential/insights.' Just say what's being enabled." },
  { text: "unveiling", tier: 2, category: "vocabulary", models: ["deepseek"], replacement: "showing, revealing, introducing", explanation: "DeepSeek 'unveils' things dramatically. Just say 'showing' or 'revealing.'" },
  { text: "paving the way", tier: 2, category: "phrase", models: ["deepseek"], replacement: "enabling, making possible", explanation: "DeepSeek cliche. Describe what's actually being made possible." },

  // --- Model-specific: Chinese LLMs ---
  { text: "play an important role", tier: 2, category: "phrase", models: ["chinese_llm"], replacement: "matter, help with, influence", explanation: "Common Chinese LLM translation pattern. Be specific about the role." },
  { text: "make great efforts", tier: 2, category: "phrase", models: ["chinese_llm"], replacement: "work hard, try, push", explanation: "Chinese LLM formality. Just say 'work hard' or 'try.'" },
  { text: "at the same time", tier: 2, category: "phrase", models: ["chinese_llm"], replacement: "also, meanwhile, and", explanation: "Chinese LLM transition filler. 'Also' or 'and' usually work." },
  { text: "harmonious", tier: 3, category: "vocabulary", models: ["chinese_llm"], replacement: "balanced, smooth, cooperative", explanation: "Chinese LLM cultural marker. 'Balanced' or 'smooth' are more natural in English." },

  // --- Ghost citations ---
  { text: "studies show", tier: 1, category: "ghost_citation", models: ["chatgpt", "claude"], replacement: "(name the study or cut)", explanation: "'Studies show' without naming the study. If you can't name it, cut it. If you can, name it." },
  { text: "research suggests", tier: 1, category: "ghost_citation", models: ["chatgpt", "claude"], replacement: "(name the research or cut)", explanation: "Which research? By whom? If you can cite it, cite it. If you can't, delete the claim." },
  { text: "experts agree", tier: 1, category: "ghost_citation", models: ["chatgpt", "claude"], replacement: "(name the experts)", explanation: "Which experts? Name at least one, or drop the appeal to authority." },
  { text: "according to experts", tier: 1, category: "ghost_citation", models: ["chatgpt"], replacement: "(name them)", explanation: "AI loves anonymous expert sourcing. Name the expert or cut the claim." },
  { text: "it has been shown", tier: 2, category: "ghost_citation", models: ["chatgpt"], replacement: "(shown by whom? cite it)", explanation: "Passive voice hiding the absence of a real source." },
  { text: "industry reports", tier: 2, category: "ghost_citation", models: ["chatgpt"], replacement: "(which report?)", explanation: "Vague sourcing. Name the report, publisher, and date." },
  { text: "some critics argue", tier: 2, category: "ghost_citation", models: ["chatgpt"], replacement: "(name the critics)", explanation: "AI creates phantom critics. Name them or don't invoke them." },
  { text: "several publications", tier: 2, category: "ghost_citation", models: ["chatgpt"], replacement: "(which publications?)", explanation: "Vague sourcing. Name the publications." },
  { text: "observers have cited", tier: 2, category: "ghost_citation", models: ["chatgpt"], replacement: "(which observers?)", explanation: "Another phantom source. Be specific or cut." },

  // --- Throat-clearing openers ---
  { text: "here's the thing", tier: 1, category: "throat_clearing", models: ["chatgpt"], replacement: "(cut — start with the thing)", explanation: "AI's favorite warm-up phrase. Just start with the point." },
  { text: "the uncomfortable truth is", tier: 1, category: "throat_clearing", models: ["chatgpt"], replacement: "(state the truth)", explanation: "AI drama before stating something. Just state it." },
  { text: "it turns out", tier: 2, category: "throat_clearing", models: ["chatgpt"], replacement: "(cut — just state the finding)", explanation: "Throat-clearing before a reveal. The reader doesn't need a drumroll." },
  { text: "let me be clear", tier: 2, category: "throat_clearing", models: ["chatgpt"], replacement: "(just be clear)", explanation: "If you have to announce clarity, you're not being clear enough yet." },
  { text: "the truth is", tier: 2, category: "throat_clearing", models: ["chatgpt"], replacement: "(just state it)", explanation: "AI setup phrase. Everything you write should be true — no need to announce it." },
  { text: "can we talk about", tier: 2, category: "throat_clearing", models: ["chatgpt"], replacement: "(just talk about it)", explanation: "AI asking permission before making a point. Just make the point." },
  { text: "in today's fast-paced world", tier: 1, category: "throat_clearing", models: ["chatgpt"], replacement: "(cut entirely)", explanation: "The most cliched AI opener. Cut it. Your reader lives in the same world." },
  { text: "in the ever-evolving landscape of", tier: 1, category: "throat_clearing", models: ["chatgpt"], replacement: "(cut — two AI cliches in one)", explanation: "'Ever-evolving' + 'landscape' is a double AI tell. Just start with your point." },
  { text: "in an era where", tier: 1, category: "throat_clearing", models: ["chatgpt"], replacement: "(cut)", explanation: "AI opens with this to sound historically important. Just make your point." },
  { text: "in today's digital age", tier: 1, category: "throat_clearing", models: ["chatgpt"], replacement: "(cut)", explanation: "We know what era it is. Start with something specific." },

  // --- Emphasis crutches ---
  { text: "full stop.", tier: 1, category: "emphasis", models: ["chatgpt"], replacement: "(cut — your point should speak for itself)", explanation: "AI adds 'Full stop.' for fake finality. If the argument is strong, you don't need a mic drop." },
  { text: "period.", tier: 2, category: "emphasis", models: ["chatgpt"], replacement: "(cut)", explanation: "Same as 'Full stop.' — manufactured emphasis." },
  { text: "let that sink in", tier: 1, category: "emphasis", models: ["chatgpt"], replacement: "(cut — trust the reader)", explanation: "AI condescension. Trust your reader to grasp the weight without being told to pause." },
  { text: "this matters because", tier: 2, category: "emphasis", models: ["chatgpt"], replacement: "(show why it matters through evidence)", explanation: "AI announces significance. Show it through evidence, don't tell the reader to care." },
  { text: "make no mistake", tier: 2, category: "emphasis", models: ["chatgpt"], replacement: "(cut — just state the point firmly)", explanation: "Political speech filler. Cut it and state your point directly." },
  { text: "here's why that matters", tier: 2, category: "emphasis", models: ["chatgpt"], replacement: "(cut — the reasoning should be self-evident)", explanation: "AI sign-posting. If the next sentence is good, the reader will get why it matters." },

  // --- Meta-commentary ---
  { text: "hint:", tier: 2, category: "meta", models: ["chatgpt"], replacement: "(cut — just state the hint)", explanation: "AI narrating its own rhetorical moves. Just say what you're going to say." },
  { text: "plot twist:", tier: 2, category: "meta", models: ["chatgpt"], replacement: "(cut — let the twist speak for itself)", explanation: "AI calling its own shots. Real twists don't need labels." },
  { text: "spoiler:", tier: 2, category: "meta", models: ["chatgpt"], replacement: "(cut)", explanation: "AI meta-commentary. Just state the information." },
  { text: "but that's another post", tier: 2, category: "meta", models: ["chatgpt"], replacement: "(cut)", explanation: "AI's way of seeming like it has more to say. Either say it or don't." },
  { text: "story for another day", tier: 2, category: "meta", models: ["chatgpt"], replacement: "(cut — tell it now or don't mention it)", explanation: "Teasing future content you'll never write. Either explain it now or leave it out." },
  { text: "but i digress", tier: 2, category: "meta", models: ["chatgpt"], replacement: "(cut)", explanation: "AI performing casual self-awareness. If it's a digression, just cut it." },

  // --- Engagement bait (LinkedIn/AI content patterns) ---
  { text: "has anyone else noticed", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "(cut — make your point directly)", explanation: "Classic engagement bait. Instead of asking if others noticed, just state what you noticed and why it matters." },
  { text: "would love to hear", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "(cut)", explanation: "Engagement bait disguised as curiosity. If your point is strong, people will respond without being asked." },
  { text: "what do you think", tier: 2, category: "engagement_bait", models: ["chatgpt"], replacement: "(cut — or ask a specific question)", explanation: "Generic engagement prompt. If you want real responses, ask a specific question about a specific thing." },
  { text: "agree or disagree", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "(cut)", explanation: "Pure engagement farming. Forces a binary response instead of genuine conversation." },
  { text: "thoughts?", tier: 2, category: "engagement_bait", models: ["chatgpt"], replacement: "(cut — or ask something specific)", explanation: "One-word engagement bait. Ask a real question or let the post stand on its own." },
  { text: "drop a comment", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "(cut)", explanation: "Explicit engagement farming. People who have something to say will say it." },
  { text: "let me know in the comments", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "(cut)", explanation: "YouTube/LinkedIn engagement bait. Your writing shouldn't beg for interaction." },
  { text: "share your experience", tier: 2, category: "engagement_bait", models: ["chatgpt"], replacement: "(cut — or ask a specific question)", explanation: "Generic engagement prompt. Ask a specific question instead." },
  { text: "am i the only one", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "(cut — you're not, and you know it)", explanation: "Rhetorical engagement bait. You know you're not the only one. State your observation directly." },
  { text: "is it just me or", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "(cut — just state the observation)", explanation: "Fake humility engagement bait. Just state what you've observed." },
  { text: "who else", tier: 2, category: "engagement_bait", models: ["chatgpt"], replacement: "(cut)", explanation: "Engagement bait seeking validation. Make your point without polling the audience." },
  { text: "can we all agree", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "(cut — just state your position)", explanation: "Manufactured consensus. State your position and defend it." },
  { text: "unpopular opinion", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "(cut — just state the opinion)", explanation: "The opinion is almost never unpopular. It's a framing trick to generate engagement through false controversy." },
  { text: "hot take", tier: 2, category: "engagement_bait", models: ["chatgpt"], replacement: "(cut — just state it)", explanation: "Self-labeling your opinion as provocative. If it's actually hot, the reader will know." },
  { text: "here's what nobody is talking about", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "(cut — people probably are talking about it)", explanation: "Engagement bait claiming exclusive insight. Usually followed by something many people are already discussing." },
  { text: "this is going to be controversial", tier: 2, category: "engagement_bait", models: ["chatgpt"], replacement: "(cut — let the reader decide)", explanation: "Pre-framing your point as controversial to bait engagement. Just state it." },
  { text: "i'll say it louder for the people in the back", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "(cut)", explanation: "Performative repetition for engagement. Say it once, clearly." },
  { text: "repost if you agree", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "(cut)", explanation: "Explicit engagement farming. Your content should earn shares, not beg for them." },
  { text: "tag someone who needs to hear this", tier: 1, category: "engagement_bait", models: ["chatgpt"], replacement: "(cut)", explanation: "Engagement bait asking readers to do your distribution for you." },
  { text: "let me walk you through", tier: 2, category: "meta", models: ["chatgpt"], replacement: "(just walk through it)", explanation: "AI asking permission. Just start explaining." },
  { text: "as we'll see", tier: 2, category: "meta", models: ["chatgpt"], replacement: "(cut — the reader will see when they see)", explanation: "AI foreshadowing. Let the reader discover things as they read." },
  { text: "in this section", tier: 2, category: "meta", models: ["chatgpt"], replacement: "(cut)", explanation: "AI structural narration. The reader can see they're in a section." },
  { text: "i want to explore", tier: 2, category: "meta", models: ["chatgpt"], replacement: "(just explore it)", explanation: "Don't announce your intentions. Just do the thing." },

  // --- Treadmill markers ---
  { text: "in other words", tier: 2, category: "treadmill", models: ["chatgpt", "claude"], replacement: "(cut — or rewrite the original sentence to be clearer)", explanation: "If you need 'in other words,' your first sentence wasn't clear enough. Rewrite it." },
  { text: "to put it another way", tier: 2, category: "treadmill", models: ["chatgpt"], replacement: "(cut — rewrite the original)", explanation: "Same thing restated. Pick the better version and delete the other." },
  { text: "simply put", tier: 2, category: "treadmill", models: ["chatgpt"], replacement: "(cut — just put it simply)", explanation: "If you're simplifying, just use the simple version. Don't announce it." },
  { text: "as mentioned earlier", tier: 2, category: "treadmill", models: ["chatgpt"], replacement: "(cut)", explanation: "AI padding. If it was mentioned, the reader remembers. If they don't, re-reading won't help." },
  { text: "as noted above", tier: 2, category: "treadmill", models: ["chatgpt"], replacement: "(cut)", explanation: "AI self-referencing. Just make the new point." },
  { text: "to reiterate", tier: 2, category: "treadmill", models: ["chatgpt"], replacement: "(cut — don't reiterate)", explanation: "If you're reiterating, you're padding. Make the point once, well." },
  { text: "as previously discussed", tier: 2, category: "treadmill", models: ["chatgpt"], replacement: "(cut)", explanation: "AI cross-referencing within a single piece. The reader was there." },

  // --- Conclusion bloat ---
  { text: "in conclusion", tier: 2, category: "conclusion_bloat", models: ["chatgpt"], replacement: "(cut — just conclude)", explanation: "AI's most mechanical transition. If the reader got this far, they know it's the end." },
  { text: "in summary", tier: 2, category: "conclusion_bloat", models: ["chatgpt"], replacement: "(cut)", explanation: "AI feels compelled to summarize. Trust the reader to have read what you wrote." },
  { text: "to sum up", tier: 2, category: "conclusion_bloat", models: ["chatgpt"], replacement: "(cut)", explanation: "Another conclusion crutch. Just end strong." },
  { text: "as we've seen", tier: 2, category: "conclusion_bloat", models: ["chatgpt"], replacement: "(cut — the reader was there)", explanation: "AI recap phrase. The reader just read your piece." },
  { text: "the future looks bright", tier: 1, category: "conclusion_bloat", models: ["chatgpt"], replacement: "(cut — empty optimism)", explanation: "AI's favorite vacuous conclusion. Says nothing." },
  { text: "exciting times lie ahead", tier: 1, category: "conclusion_bloat", models: ["chatgpt"], replacement: "(cut)", explanation: "Empty AI optimism. What specifically is exciting? Say that instead." },
  { text: "a major step in the right direction", tier: 2, category: "conclusion_bloat", models: ["chatgpt"], replacement: "(describe the specific progress)", explanation: "AI vague praise. Describe what actually improved." },

  // --- Chatbot artifacts ---
  { text: "i hope this helps", tier: 1, category: "chatbot_artifact", models: ["chatgpt", "claude"], replacement: "(cut — chatbot leak)", explanation: "Chatbot sign-off accidentally left in published text. Delete immediately." },
  { text: "of course!", tier: 2, category: "chatbot_artifact", models: ["chatgpt"], replacement: "(cut)", explanation: "Chatbot enthusiasm leak. Real writing doesn't start sentences with 'Of course!'" },
  { text: "certainly!", tier: 2, category: "chatbot_artifact", models: ["chatgpt", "claude"], replacement: "(cut)", explanation: "Chatbot agreement phrase left in text." },
  { text: "great question!", tier: 1, category: "chatbot_artifact", models: ["chatgpt"], replacement: "(cut — dead giveaway)", explanation: "Pure chatbot language. A dead giveaway that text was copied from an AI conversation." },
  { text: "that's an excellent point", tier: 2, category: "chatbot_artifact", models: ["chatgpt", "claude"], replacement: "(cut)", explanation: "Chatbot flattery. Remove from any published text." },
  { text: "would you like me to", tier: 1, category: "chatbot_artifact", models: ["chatgpt", "claude"], replacement: "(cut — chatbot prompt)", explanation: "Chatbot question left in text. A dead giveaway." },
  { text: "let me know if", tier: 2, category: "chatbot_artifact", models: ["chatgpt", "claude"], replacement: "(cut)", explanation: "Chatbot sign-off. Shouldn't appear in published writing." },

  // --- Knowledge cutoff disclaimers ---
  { text: "as of my last", tier: 1, category: "chatbot_artifact", models: ["chatgpt"], replacement: "(cut — AI disclosure)", explanation: "AI revealing its training cutoff. Dead giveaway of AI-generated text." },
  { text: "up to my last training", tier: 1, category: "chatbot_artifact", models: ["chatgpt"], replacement: "(cut — AI self-reference)", explanation: "AI talking about its own training. Remove from published text." },
  { text: "based on available information", tier: 2, category: "chatbot_artifact", models: ["chatgpt", "claude"], replacement: "(cut or cite sources)", explanation: "AI hedging about its knowledge limits. Either cite specific sources or cut." },

  // --- Filler phrases ---
  { text: "in order to", tier: 2, category: "filler", models: ["chatgpt", "claude"], replacement: "to", explanation: "'In order to' is never better than 'to.' Three words wasted." },
  { text: "due to the fact that", tier: 2, category: "filler", models: ["chatgpt"], replacement: "because", explanation: "Five words where one works. Just say 'because.'" },
  { text: "at this point in time", tier: 2, category: "filler", models: ["chatgpt"], replacement: "now", explanation: "Five words for 'now.' Cut to 'now' or 'currently.'" },
  { text: "in the event that", tier: 2, category: "filler", models: ["chatgpt"], replacement: "if", explanation: "Four words for 'if.' Just say 'if.'" },
  { text: "has the ability to", tier: 2, category: "filler", models: ["chatgpt"], replacement: "can", explanation: "Four words for 'can.' Say 'can.'" },
  { text: "it is important to note that", tier: 2, category: "filler", models: ["chatgpt", "claude"], replacement: "(cut entirely)", explanation: "Seven words that add nothing. Just state the important thing." },
  { text: "it is worth mentioning that", tier: 2, category: "filler", models: ["chatgpt", "claude"], replacement: "(cut — just mention it)", explanation: "If it's worth mentioning, mention it. Don't announce the mention." },
  { text: "it goes without saying", tier: 2, category: "filler", models: ["chatgpt"], replacement: "(cut — if it goes without saying, don't say it)", explanation: "Self-contradicting filler. If it goes without saying, why are you saying it?" },

  // --- Performative depth ---
  { text: "the real achievement", tier: 2, category: "performative", models: ["chatgpt"], replacement: "(just describe the achievement)", explanation: "AI manufacturing depth. Just describe what was achieved." },
  { text: "here's where things get interesting", tier: 2, category: "performative", models: ["chatgpt"], replacement: "(cut — let the interesting thing speak for itself)", explanation: "AI drama. If it's interesting, the reader will notice." },
  { text: "the real question is", tier: 2, category: "performative", models: ["chatgpt"], replacement: "(just ask the question)", explanation: "AI escalation. Just ask the question." },

  // --- Significance inflation (from IsGPT with multipliers) ---
  { text: "provide valuable insights", tier: 1, category: "inflation", models: ["chatgpt"], replacement: "(describe the specific insights)", explanation: "AI's most inflated phrase (902x normal usage). Describe the actual insights." },
  { text: "play a significant role in shaping", tier: 1, category: "inflation", models: ["chatgpt"], replacement: "(describe the specific influence)", explanation: "207x multiplier vs human writing. Describe the actual role." },
  { text: "left an indelible mark", tier: 1, category: "inflation", models: ["chatgpt"], replacement: "(describe the specific impact)", explanation: "317x multiplier. Describe what actually changed." },
  { text: "unwavering commitment", tier: 1, category: "inflation", models: ["chatgpt"], replacement: "dedication, strong commitment", explanation: "202x multiplier vs human text. Just say 'dedication' or 'commitment.'" },

  // --- Transition overuse ---
  { text: "furthermore", tier: 2, category: "transition", models: ["chatgpt", "claude"], replacement: "also, and, (or just start the next sentence)", explanation: "AI uses formal transitions at 3-5x the human rate. 'Also' or just starting the next sentence works." },
  { text: "moreover", tier: 2, category: "transition", models: ["chatgpt", "claude"], replacement: "also, and", explanation: "Formal transition overused by AI. 'Also' is fine, or just start the sentence." },
  { text: "additionally", tier: 2, category: "transition", models: ["chatgpt", "claude"], replacement: "also, and", explanation: "AI transition filler. 'Also' or 'and' work." },
  { text: "nevertheless", tier: 2, category: "transition", models: ["chatgpt"], replacement: "but, still, yet", explanation: "Formal transition. 'But' or 'still' are more natural." },
  { text: "consequently", tier: 2, category: "transition", models: ["chatgpt"], replacement: "so", explanation: "'Consequently' is just a fancy 'so.' Use 'so.'" },
  { text: "in addition", tier: 2, category: "transition", models: ["chatgpt"], replacement: "also", explanation: "Two words for 'also.' Use 'also.'" },

  // --- Copula avoidance verbs ---
  { text: "serves as", tier: 2, category: "copula_avoidance", models: ["chatgpt"], replacement: "is", explanation: "AI avoids 'is' because of training incentives. Just say 'is.'" },
  { text: "stands as", tier: 2, category: "copula_avoidance", models: ["chatgpt"], replacement: "is", explanation: "'Stands as' is AI avoiding the word 'is.' Just say 'is.'" },
  { text: "represents", tier: 3, category: "copula_avoidance", models: ["chatgpt"], replacement: "is (when used as simple linking verb)", explanation: "Sometimes 'represents' is correct. But when AI uses it instead of 'is,' it's avoidance." },
  { text: "boasts", tier: 2, category: "copula_avoidance", models: ["chatgpt"], replacement: "has", explanation: "'Boasts 10 features' — just say 'has 10 features.' Things don't boast." },
  { text: "features", tier: 3, category: "copula_avoidance", models: ["chatgpt"], replacement: "has, includes", explanation: "When used as a verb ('the app features X'), it's often AI avoiding 'has.'" },

  // --- More vocabulary entries to reach 300+ ---
  { text: "underpinning", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "basis, foundation, support", explanation: "AI academic formality. 'Basis' or 'foundation' are clearer." },
  { text: "overarching", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "main, overall, broad", explanation: "AI escalation word. 'Main' or 'overall' work fine." },
  { text: "unparalleled", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "unique, exceptional, outstanding", explanation: "AI superlative. Almost nothing is truly 'unparalleled.'" },
  { text: "indispensable", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "essential, necessary, vital", explanation: "AI formality. 'Essential' or 'necessary' are simpler." },
  { text: "quintessential", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "typical, classic, perfect example of", explanation: "AI literary flourish. 'Classic' or 'typical' work." },
  { text: "interwoven", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "connected, linked, mixed", explanation: "AI tapestry-adjacent language. 'Connected' is clearer." },
  { text: "juxtaposition", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "contrast, comparison, side-by-side", explanation: "AI uses this to sound analytical. 'Contrast' is simpler." },
  { text: "dichotomy", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "split, divide, contrast", explanation: "AI academic vocabulary. 'Split' or 'contrast' are clearer." },
  { text: "paradigm", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "model, approach, way of thinking", explanation: "'Paradigm shift' was cliched before AI. Just describe what changed." },
  { text: "poignant", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "moving, touching, emotional", explanation: "AI's favorite emotion adjective. 'Moving' or 'touching' are more natural." },
  { text: "evocative", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "vivid, suggestive, powerful", explanation: "AI literary vocabulary. 'Vivid' is simpler." },
  { text: "seminal", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "influential, important, foundational", explanation: "AI academic formality. 'Influential' or 'foundational' work." },
  { text: "nascent", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "new, emerging, early", explanation: "AI uses 'nascent' for literary flair. 'New' or 'emerging' are fine." },
  { text: "ubiquitous", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "everywhere, common, widespread", explanation: "'Ubiquitous' is AI showing off vocabulary. 'Everywhere' or 'common' work." },
  { text: "exacerbate", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "worsen, make worse, increase", explanation: "AI formal vocabulary. 'Worsen' or 'make worse' are clearer." },
  { text: "proliferation", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "spread, growth, increase", explanation: "AI academic noun. 'Spread' or 'growth' are simpler." },
  { text: "ramifications", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "effects, consequences, results", explanation: "AI formality. 'Effects' or 'consequences' are clearer." },
  { text: "sentiment", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "feeling, opinion, mood", explanation: "AI uses 'sentiment' outside of data contexts. Just say 'feeling' or 'opinion.'" },
  { text: "precipice", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "edge, brink, verge", explanation: "AI drama word. 'Edge' or 'brink' are simpler." },
  { text: "trajectory", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "path, direction, trend", explanation: "AI uses 'trajectory' for anything moving forward. 'Path' or 'trend' work." },
  { text: "amalgamation", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "mix, blend, combination", explanation: "AI showing off vocabulary. 'Mix' or 'combination' are clearer." },
  { text: "catalyze", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "trigger, spark, start", explanation: "AI chemistry metaphor. Just say 'trigger' or 'start.'" },
  { text: "underscores", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "shows, highlights, proves", explanation: "AI's verb for 'makes a point.' Just say 'shows.'" },
  { text: "imperative", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "essential, necessary, urgent", explanation: "AI escalation. 'Essential' or 'necessary' are less dramatic." },
  { text: "delineate", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "describe, outline, define", explanation: "AI formal vocabulary. 'Describe' or 'outline' are simpler." },
  { text: "inextricably", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "closely, deeply, inseparably", explanation: "AI literary adverb. 'Closely' or 'deeply' work." },
  { text: "pivoting", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "shifting, changing, turning", explanation: "AI business-speak. 'Shifting' or 'changing' are clearer." },
  { text: "foundational", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "basic, fundamental, core", explanation: "AI inflation. 'Basic' or 'core' are simpler." },
  { text: "noteworthy", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "notable, interesting, worth mentioning", explanation: "AI filler adjective. If it's noteworthy, just note it." },
  { text: "albeit", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "although, though", explanation: "AI formal conjunction. 'Although' or 'though' are more natural." },
  { text: "undeniable", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "clear, obvious, strong", explanation: "AI superlative. Most things described as 'undeniable' are quite deniable." },
  { text: "underscore", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "emphasize, highlight, show", explanation: "AI's verb for drawing attention. Just say 'shows' or 'highlights.'" },
  { text: "whilst", tier: 3, category: "vocabulary", models: ["chatgpt", "kimi"], replacement: "while", explanation: "AI formality. 'While' is simpler and more natural in modern English." },
  { text: "arguably", tier: 2, category: "vocabulary", models: ["chatgpt", "claude"], replacement: "(cut — just argue it)", explanation: "AI hedge. If you want to argue something, argue it. Don't hedge." },

  // --- Additional vocabulary (EQBench, Pangram Labs, Anti-Slop, SLOP_Detector) ---
  { text: "delving", tier: 1, category: "vocabulary", models: ["chatgpt"], replacement: "exploring, examining, digging into", explanation: "'Delving' — the -ing form of AI's most overused word. Usage spiked 400% post-ChatGPT." },
  { text: "tapestries", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "combinations, mixtures", explanation: "Plural of AI's favorite metaphor word." },
  { text: "moreover", tier: 2, category: "vocabulary", models: ["chatgpt", "claude"], replacement: "also, and", explanation: "AI's formal connector used 3-5x more than human writers." },
  { text: "furthermore", tier: 2, category: "vocabulary", models: ["chatgpt", "claude"], replacement: "also, and", explanation: "Formal transition overused by AI at 3-5x the human rate." },
  { text: "nonetheless", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "still, but, yet", explanation: "AI formal transition. 'Still' or 'but' are more natural." },
  { text: "adept", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "skilled, good at", explanation: "AI formality. 'Skilled' or 'good at' are simpler." },
  { text: "akin", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "like, similar to", explanation: "AI literary vocabulary. Just say 'like' or 'similar to.'" },
  { text: "amidst", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "amid, among, during", explanation: "AI prefers archaic 'amidst' over simpler 'amid.'" },
  { text: "arduous", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "hard, difficult, tough", explanation: "AI escalation. 'Hard' or 'difficult' work fine." },
  { text: "artisanal", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "handmade, craft", explanation: "AI loves this word in food/culture contexts." },
  { text: "bespoke", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "custom, tailored", explanation: "AI British formality. 'Custom' works." },
  { text: "bustling", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "busy, lively, crowded", explanation: "AI's go-to adjective for cities and markets." },
  { text: "cacophony", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "noise, din, racket", explanation: "AI literary flair. 'Noise' is fine." },
  { text: "captivating", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "interesting, engaging, striking", explanation: "AI superlative. 'Interesting' or 'engaging' are less inflated." },
  { text: "celestial", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "heavenly, sky, space", explanation: "AI uses 'celestial' for unnecessary grandeur." },
  { text: "clandestine", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "secret, hidden", explanation: "AI spy-novel vocabulary. Just say 'secret.'" },
  { text: "commencing", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "starting, beginning", explanation: "AI formality. 'Starting' works." },
  { text: "conundrum", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "problem, puzzle, dilemma", explanation: "AI uses 'conundrum' to sound intellectual. 'Problem' is fine." },
  { text: "cornerstone", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "foundation, basis, key part", explanation: "AI metaphor for anything fundamental." },
  { text: "crafting", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "making, building, writing", explanation: "AI 'crafts' everything — narratives, solutions, experiences. Just say 'making.'" },
  { text: "cutting-edge", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "latest, newest, advanced", explanation: "AI marketing speak. Describe what's actually new." },
  { text: "daunting", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "difficult, scary, challenging", explanation: "AI's go-to word for hard tasks." },
  { text: "delineating", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "describing, outlining", explanation: "AI formal vocabulary. 'Describing' works." },
  { text: "demystify", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "explain, clarify", explanation: "AI loves to 'demystify' things. Just explain them." },
  { text: "dichotomy", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "split, divide, contrast", explanation: "AI academic vocabulary. 'Contrast' is clearer." },
  { text: "discerning", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "careful, selective, picky", explanation: "AI formality. 'Careful' or 'selective' work." },
  { text: "ecosystem", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "system, community, network", explanation: "AI applies 'ecosystem' to everything — tech, business, culture. Often just means 'system.'" },
  { text: "elicit", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "draw out, get, trigger", explanation: "AI formal vocabulary. 'Get' or 'draw out' are simpler." },
  { text: "embodies", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "shows, represents, is", explanation: "AI verb for 'represents.' Often just means 'is.'" },
  { text: "endeavor", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "effort, try, attempt, project", explanation: "AI formality. 'Effort' or 'project' work." },
  { text: "enigmatic", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "mysterious, puzzling", explanation: "AI literary adjective. 'Mysterious' is simpler." },
  { text: "epitome", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "perfect example, model", explanation: "AI uses 'epitome' for dramatic effect. 'Perfect example' is clearer." },
  { text: "erstwhile", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "former, previous, once", explanation: "AI archaic vocabulary. 'Former' works." },
  { text: "ethos", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "spirit, values, character", explanation: "AI uses 'ethos' to sound philosophical. 'Values' or 'spirit' work." },
  { text: "fervent", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "passionate, strong, intense", explanation: "AI literary intensity. 'Passionate' or 'strong' work." },
  { text: "foremost", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "top, leading, main", explanation: "AI formality. 'Top' or 'main' are simpler." },
  { text: "formidable", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "impressive, powerful, tough", explanation: "AI escalation word. 'Impressive' or 'tough' work." },
  { text: "galvanize", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "inspire, motivate, push", explanation: "AI dramatic verb. 'Inspire' or 'motivate' are clearer." },
  { text: "harbinger", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "sign, signal, warning", explanation: "AI literary vocabulary. 'Sign' or 'signal' work." },
  { text: "indelible", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "lasting, permanent, unforgettable", explanation: "'Left an indelible mark' — 317x multiplier. Just say 'lasting.'" },
  { text: "ineffable", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "indescribable, beyond words", explanation: "AI literary vocabulary for things it then proceeds to describe." },
  { text: "ingenious", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "clever, smart, creative", explanation: "AI superlative. 'Clever' or 'smart' are less inflated." },
  { text: "innate", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "natural, built-in, inborn", explanation: "AI uses 'innate' to sound scientific. 'Natural' works." },
  { text: "juncture", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "point, moment, time", explanation: "AI formality. 'At this juncture' — just say 'now.'" },
  { text: "kaleidoscope", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "variety, range, mix", explanation: "AI metaphor for variety. Just say 'variety' or 'mix.'" },
  { text: "laudable", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "good, praiseworthy", explanation: "AI teacher voice. 'Good' works." },
  { text: "linchpin", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "key part, crucial piece", explanation: "AI metaphor for importance." },
  { text: "lucrative", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "profitable, well-paying", explanation: "AI business vocabulary. 'Profitable' is simpler." },
  { text: "manifold", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "many, various, multiple", explanation: "AI formality. 'Many' works." },
  { text: "monumental", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "huge, massive, major", explanation: "AI scale inflation. 'Huge' or 'major' are less dramatic." },
  { text: "nascent", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "new, emerging, early", explanation: "AI uses 'nascent' for literary flair. 'New' or 'emerging' work." },
  { text: "nexus", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "connection, link, center", explanation: "AI uses 'nexus' to sound technical. 'Connection' works." },
  { text: "nuance", tier: 2, category: "vocabulary", models: ["chatgpt", "claude"], replacement: "detail, subtlety, fine point", explanation: "AI loves 'nuance' as a noun. Often used to avoid specifics." },
  { text: "omnipresent", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "everywhere, constant, widespread", explanation: "AI grandeur. 'Everywhere' works." },
  { text: "opulent", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "luxurious, rich, lavish", explanation: "AI literary adjective. 'Luxurious' is simpler." },
  { text: "ostensibly", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "supposedly, apparently, seemingly", explanation: "AI hedge word. 'Supposedly' or 'apparently' are clearer." },
  { text: "paradigm shift", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "big change, new approach", explanation: "Cliched before AI. Describe what actually changed." },
  { text: "painstaking", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "careful, thorough, detailed", explanation: "AI drama word. 'Careful' or 'thorough' work." },
  { text: "penchant", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "tendency, preference, habit", explanation: "AI literary vocabulary. 'Tendency' or 'habit' are simpler." },
  { text: "permeate", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "spread through, fill, influence", explanation: "AI verb for 'spread.' 'Spread through' is clearer." },
  { text: "pinnacle", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "peak, top, height", explanation: "AI escalation. 'Peak' or 'top' are simpler." },
  { text: "plethora", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "many, lots of, abundance", explanation: "'A plethora of' — just say 'many.'" },
  { text: "poignant", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "moving, touching, emotional", explanation: "AI's favorite emotion adjective. 'Moving' works." },
  { text: "precipitate", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "cause, trigger, lead to", explanation: "AI formal vocabulary. 'Cause' or 'trigger' are clearer." },
  { text: "prowess", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "skill, ability, talent", explanation: "AI formality. 'Skill' works." },
  { text: "quintessential", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "typical, classic, perfect example of", explanation: "AI literary flourish. 'Classic' or 'typical' work." },
  { text: "ramification", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "effect, consequence, result", explanation: "AI formality. 'Effect' or 'consequence' are clearer." },
  { text: "reinvigorate", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "refresh, revive, energize", explanation: "AI compound verb. 'Refresh' or 'revive' work." },
  { text: "remnants", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "remains, leftovers, traces", explanation: "AI literary vocabulary. 'Remains' or 'traces' work." },
  { text: "reverberate", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "echo, spread, ring", explanation: "AI literary verb. 'Echo' or 'spread' are simpler." },
  { text: "riveting", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "gripping, fascinating, compelling", explanation: "AI superlative for anything interesting." },
  { text: "salient", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "important, key, main", explanation: "AI formality. 'Important' or 'key' are simpler." },
  { text: "scrupulous", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "careful, thorough, honest", explanation: "AI formality. 'Careful' works." },
  { text: "seminal", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "influential, important, foundational", explanation: "AI academic formality. 'Influential' works." },
  { text: "serendipitous", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "lucky, fortunate, by chance", explanation: "AI literary vocabulary. 'Lucky' or 'by chance' are simpler." },
  { text: "stakeholders", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "people involved, participants", explanation: "AI business jargon. Name the actual people." },
  { text: "stark", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "sharp, clear, harsh", explanation: "AI's adjective for contrasts. 'Sharp' or 'clear' work." },
  { text: "steadfast", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "firm, loyal, unwavering", explanation: "AI literary vocabulary. 'Firm' or 'loyal' are simpler." },
  { text: "strive", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "try, work, aim", explanation: "AI formality. 'Try' or 'work toward' are simpler." },
  { text: "subsequently", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "then, later, after that", explanation: "AI formal transition. 'Then' or 'later' work." },
  { text: "substantive", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "real, meaningful, significant", explanation: "AI formality. 'Real' or 'meaningful' work." },
  { text: "superfluous", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "extra, unnecessary, unneeded", explanation: "AI showing vocabulary. 'Extra' or 'unnecessary' work." },
  { text: "symbiotic", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "mutual, cooperative, shared", explanation: "AI biology metaphor. 'Mutual' or 'shared' work." },
  { text: "tangible", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "real, concrete, clear", explanation: "AI often pairs with 'results' or 'impact.' 'Real' or 'concrete' work." },
  { text: "tenacious", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "persistent, determined, tough", explanation: "AI literary adjective. 'Persistent' works." },
  { text: "testament to", tier: 1, category: "phrase", models: ["chatgpt"], replacement: "proof of, evidence of, shows", explanation: "AI's favorite attribution phrase. 'Shows' or 'proves' are direct." },
  { text: "thriving", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "growing, successful, doing well", explanation: "AI's adjective for anything positive. 'Growing' or 'successful' work." },
  { text: "trailblazing", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "pioneering, leading, first", explanation: "AI heroic vocabulary. 'Pioneering' or 'first' work." },
  { text: "ubiquitous", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "everywhere, common, widespread", explanation: "AI showing off vocabulary. 'Everywhere' or 'common' work." },
  { text: "underpinning", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "basis, foundation, support", explanation: "AI academic formality. 'Basis' works." },
  { text: "unfathomable", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "hard to imagine, incredible, vast", explanation: "AI literary drama. 'Hard to imagine' is clearer." },
  { text: "unprecedented", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "new, never before, first", explanation: "AI calls everything unprecedented. Most things have precedent." },
  { text: "unwavering", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "steady, firm, constant", explanation: "AI intensity word. 'Steady' or 'firm' work." },
  { text: "venerable", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "old, respected, traditional", explanation: "AI formality. 'Respected' or 'traditional' work." },
  { text: "visceral", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "gut, instinctive, deep", explanation: "AI uses 'visceral' for emotional emphasis. 'Gut' or 'deep' work." },
  { text: "vying", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "competing, fighting for", explanation: "AI formal vocabulary. 'Competing' is simpler." },
  { text: "watershed", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "turning point, major moment", explanation: "AI metaphor for significance. 'Turning point' is clearer." },
  { text: "zealous", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "eager, passionate, enthusiastic", explanation: "AI literary adjective. 'Eager' or 'passionate' work." },
  { text: "wholeheartedly", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "fully, completely", explanation: "AI intensity adverb. 'Fully' is simpler." },
  { text: "juxtapose", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "contrast, compare, place side by side", explanation: "AI analytical vocabulary. 'Contrast' works." },
  { text: "culmination", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "end, peak, result", explanation: "AI formality. 'End' or 'peak' are simpler." },
  { text: "underpin", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "support, form the basis of", explanation: "AI academic verb. 'Support' works." },
  { text: "encapsulate", tier: 3, category: "vocabulary", models: ["chatgpt"], replacement: "capture, sum up, contain", explanation: "AI formal vocabulary. 'Capture' or 'sum up' are clearer." },
  { text: "reimagine", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "rethink, redesign, redo", explanation: "AI marketing verb. 'Rethink' or 'redesign' are more precise." },
  { text: "indispensable", tier: 2, category: "vocabulary", models: ["chatgpt"], replacement: "essential, necessary", explanation: "AI formality. 'Essential' works." },
];

// Build lookup for quick searching
const PHRASE_LOOKUP = new Map();
PHRASE_DB.forEach((entry, idx) => {
  PHRASE_LOOKUP.set(entry.text.toLowerCase(), idx);
});

// ============================================================
// SAMPLE TEXT
// ============================================================
const SAMPLE_TEXT = `In today's fast-paced world, the landscape of artificial intelligence continues to evolve at a pivotal pace. Delving into the intricacies of modern AI reveals a tapestry of innovative solutions that are truly groundbreaking.

Studies show that the multifaceted nature of these systems serves as a testament to human ingenuity. Moreover, the seamless integration of robust frameworks has fostered a vibrant ecosystem. Furthermore, experts agree that leveraging these comprehensive tools is crucial for navigating the challenges ahead.

It's worth noting that, in many cases, the transformative potential of AI is not just about technology — it's about people. The real achievement here isn't the algorithm. It's the human connection it enables. Let that sink in.

Not a replacement for human creativity. Not a shortcut to success. A catalyst for genuine innovation.

In conclusion, as we've seen, the future looks bright for those who embark on this journey. The interplay between humans and machines will continue to shape our world in profound ways. Exciting times lie ahead.`;

// ============================================================
// LAYER 2: STRUCTURAL DETECTORS (15+ patterns)
// ============================================================

function detectBinaryContrasts(text) {
  const patterns = [
    /(?:it's\s+)?not\s+(?:just\s+)?(?:about\s+)?[^.!?]{3,60}\s*[-—–]\s*it's\s+[^.!?]{3,80}/gi,
    /not\s+because\s+[^.!?]{3,60}[.]\s*because\s+[^.!?]{3,80}/gi,
    /isn't\s+(?:the\s+)?[^.!?]{3,60}[.,]\s*(?:it's|it\s+is)\s+[^.!?]{3,80}/gi,
    /the\s+(?:answer|problem|question|real\s+\w+)\s+isn't\s+[^.!?]{3,60}/gi,
    /stops?\s+being\s+\w+\s+and\s+starts?\s+being\s+\w+/gi,
  ];
  return collectRegexMatches(text, patterns);
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
        explanation: "Multiple 'Not a...' sentences before the reveal. This striptease pattern is the most recognized AI structure."
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

  // 1. Comma-separated tricolons: "X, Y, and Z"
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

  // 2. Numbered lists: emoji numbers (1️⃣ 2️⃣ etc.), or "1." "2." "3." at line starts
  const emojiNumbers = text.match(/[\u0031-\u0039]\uFE0F?\u20E3/g) || [];
  const numberedLines = text.match(/(?:^|\n)\s*\d+[.)]\s/g) || [];
  const bulletLines = text.match(/(?:^|\n)\s*[-•*]\s/g) || [];
  const listItemCount = Math.max(emojiNumbers.length, numberedLines.length, bulletLines.length);

  if (listItemCount >= 3) {
    // Find where the first list item starts for the snippet
    const firstEmoji = text.search(/[\u0031-\u0039]\uFE0F?\u20E3/);
    const firstNumbered = text.search(/(?:^|\n)\s*\d+[.)]\s/);
    const firstBullet = text.search(/(?:^|\n)\s*[-•*]\s/);
    const starts = [firstEmoji, firstNumbered, firstBullet].filter(i => i >= 0);
    const firstStart = starts.length > 0 ? Math.min(...starts) : 0;

    const listType = emojiNumbers.length >= 3 ? "emoji-numbered" : numberedLines.length >= 3 ? "numbered" : "bulleted";
    matches.push({
      snippet: highlightRange(text, Math.max(0, firstStart), Math.min(80, text.length - firstStart)),
      start: firstStart, length: 80,
      explanation: `${listItemCount}-item ${listType} list detected. AI defaults to structured lists where flowing prose would be more natural. Consider whether a list is truly the best format here, or if narrative would be stronger.`
    });
  }

  return matches;
}

function detectEmojiFormatting(text) {
  // Detect emoji used as section headers/markers (a formatting tell)
  const emojiHeaders = text.match(/[\u0031-\u0039]\uFE0F?\u20E3|[\u{1F4C8}\u{1F4CA}\u{1F4CB}\u{1F4CC}\u{1F4DD}\u{1F525}\u{2705}\u{274C}\u{26A0}\u{1F449}\u{1F447}\u{1F446}\u{1F3AF}\u{1F4A1}\u{1F914}\u{1F926}]/gu) || [];
  if (emojiHeaders.length >= 3) {
    return [{
      snippet: `Found ${emojiHeaders.length} emoji markers used as formatting devices.`,
      start: 0, length: 0,
      explanation: `${emojiHeaders.length} emoji used as structural markers (section headers, bullet points, emphasis). Heavy emoji formatting is a LinkedIn/AI content pattern. Use sparingly or not at all in serious writing.`
    }];
  }
  return [];
}

function detectCopulaAvoidance(text) {
  const patterns = [
    /\b(?:serves|stands|functions|acts|operates)\s+as\s+(?:a|an|the)\b/gi,
  ];
  return collectRegexMatches(text, patterns).map(m => ({
    ...m,
    explanation: "AI avoids the word 'is' because of its training. 'Serves as a tool' — just say 'is a tool.'"
  }));
}

function detectElegantVariation(text) {
  const paragraphs = text.split(/\n\s*\n/);
  const matches = [];
  const synGroups = [
    ["platform", "service", "tool", "solution", "product", "system", "application"],
    ["method", "approach", "technique", "strategy", "framework", "methodology"],
    ["company", "firm", "organization", "enterprise", "corporation", "business"],
    ["person", "individual", "human", "people", "humans", "individuals"],
  ];

  paragraphs.forEach((para, pIdx) => {
    const lower = para.toLowerCase();
    synGroups.forEach(group => {
      const found = group.filter(w => new RegExp(`\\b${w}s?\\b`, "i").test(lower));
      if (found.length >= 3) {
        const offset = text.indexOf(para);
        matches.push({
          snippet: `Paragraph ${pIdx + 1} refers to the same thing as: ${found.map(w => `'${w}'`).join(", ")}`,
          start: offset, length: para.length,
          explanation: `You use ${found.length} different words for the same thing in one paragraph. Pick one name and stick with it. AI's repetition penalty causes this forced synonym cycling.`
        });
      }
    });
  });
  return matches;
}

function detectFalseRanges(text) {
  const pattern = /from\s+(\w+(?:\s+\w+)?)\s+to\s+(\w+(?:\s+\w+)?)/gi;
  const matches = [];
  let m;
  while ((m = pattern.exec(text)) !== null) {
    const a = m[1].toLowerCase();
    const b = m[2].toLowerCase();
    const vague = ["beginners", "experts", "small", "large", "simple", "complex", "young", "old"];
    if (vague.some(v => a.includes(v) || b.includes(v))) {
      matches.push({
        snippet: highlightRange(text, m.index, m[0].length),
        start: m.index, length: m[0].length,
        explanation: "'From X to Y' where the range is vague and obvious. These false ranges try to sound inclusive but say nothing."
      });
    }
  }
  return matches;
}

function detectNotOnlyButAlso(text) {
  const pattern = /not\s+only\b[^.!?]{3,80}\bbut\s+also\b/gi;
  return collectRegexMatches(text, [pattern]).map(m => ({
    ...m,
    explanation: "'Not only... but also' is a mechanical additive structure AI uses 2-5x more than human writers. Just list both things."
  }));
}

function detectPatronizingAnalogy(text) {
  const pattern = /\b(?:think\s+of\s+it\s+as|it's\s+like\s+a|imagine\s+(?:a|it\s+as))\b/gi;
  return collectRegexMatches(text, [pattern]).map(m => ({
    ...m,
    explanation: "AI assumes the reader needs a metaphor for everything. Use analogies sparingly and only when they add genuine clarity."
  }));
}

function detectFalseBalance(text) {
  const pattern = /\bwhether\s+you(?:'re| are)\s+a\s+\w+\s+or\s+(?:a\s+)?\w+/gi;
  return collectRegexMatches(text, [pattern]).map(m => ({
    ...m,
    explanation: "'Whether you're a beginner or an expert' — AI tries to include everyone. Pick your audience and commit."
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
      explanation: `Your conclusion has ${found.length} AI conclusion markers: ${found.join(", ")}. AI never trusts the reader to remember what they just read. End with a strong final point instead of summarizing.`
    }];
  }
  return [];
}

function detectGhostCitations(text) {
  const patterns = [
    /\bstudies\s+(?:show|suggest|indicate|have\s+shown)\b/gi,
    /\bresearch\s+(?:shows|suggests|indicates|has\s+shown)\b/gi,
    /\bexperts\s+(?:agree|say|believe|suggest)\b/gi,
    /\baccording\s+to\s+(?:experts|researchers|studies|reports)\b/gi,
    /\bit\s+has\s+been\s+(?:shown|proven|demonstrated)\b/gi,
  ];
  return collectRegexMatches(text, patterns).map(m => ({
    ...m,
    explanation: "Unnamed source. If you can name the study, expert, or report — name it. If you can't, cut the claim."
  }));
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

// ============================================================
// LAYER 3: WRITING RHYTHM (Statistical Analysis)
// ============================================================

function analyzeRhythm(text) {
  const sentences = extractSentences(text);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);

  // Sentence length variance
  const sentLengths = sentences.map(s => s.text.split(/\s+/).filter(Boolean).length);
  const sentStdDev = stddev(sentLengths);
  const sentMean = mean(sentLengths);

  // Type-Token Ratio (moving window of 100 words)
  const ttr = computeTTR(words);

  // Paragraph length uniformity
  const paraLengths = paragraphs.map(p => p.split(/\s+/).filter(Boolean).length);
  const paraStdDev = stddev(paraLengths);

  // Readability variance (simple proxy: avg word length per paragraph)
  const paraComplexity = paragraphs.map(p => {
    const pWords = p.split(/\s+/).filter(Boolean);
    return pWords.length > 0 ? pWords.reduce((sum, w) => sum + w.length, 0) / pWords.length : 0;
  });
  const readabilityVariance = stddev(paraComplexity);

  return {
    sentenceVariety: {
      value: sentStdDev,
      mean: sentMean,
      rating: sentStdDev > 6 ? "good" : sentStdDev > 3 ? "warn" : "bad",
      label: "Sentence rhythm",
      description: sentStdDev > 6
        ? `Varied — your sentences range widely in length (avg ${sentMean.toFixed(0)} words, spread ${sentStdDev.toFixed(1)}).`
        : sentStdDev > 3
          ? `Somewhat flat — sentences are fairly similar in length (avg ${sentMean.toFixed(0)} words, spread ${sentStdDev.toFixed(1)}). Mix short punchy lines with longer ones.`
          : `Flat — your sentences are all about the same length (avg ${sentMean.toFixed(0)} words, spread ${sentStdDev.toFixed(1)}). Human writing swings between 3 and 40+ word sentences.`,
    },
    wordVariety: {
      value: ttr,
      rating: ttr > 0.7 ? "good" : ttr > 0.5 ? "warn" : "bad",
      label: "Word variety",
      description: ttr > 0.7
        ? `Rich — you use a wide variety of words (TTR: ${(ttr * 100).toFixed(0)}%).`
        : ttr > 0.5
          ? `Moderate — you repeat some words often (TTR: ${(ttr * 100).toFixed(0)}%). Try varying your vocabulary.`
          : `Low — you repeat the same words frequently (TTR: ${(ttr * 100).toFixed(0)}%). This is typical of AI text.`,
    },
    paragraphShape: {
      value: paraStdDev,
      rating: paraStdDev > 15 ? "good" : paraStdDev > 5 ? "warn" : "bad",
      label: "Paragraph shape",
      description: paraStdDev > 15
        ? `Varied — your paragraphs range from short to long.`
        : paraStdDev > 5
          ? `Somewhat uniform — paragraphs are similar sizes. Mix 1-sentence and multi-sentence paragraphs.`
          : `Uniform — all paragraphs are about the same size. This is a common AI pattern.`,
    },
    complexityRange: {
      value: readabilityVariance,
      rating: readabilityVariance > 0.5 ? "good" : readabilityVariance > 0.2 ? "warn" : "bad",
      label: "Complexity range",
      description: readabilityVariance > 0.5
        ? `Varied — your paragraphs range in complexity, which feels natural.`
        : readabilityVariance > 0.2
          ? `Narrow — paragraphs are similar in complexity. Vary between simple and complex paragraphs.`
          : `Flat — every paragraph reads at the same level. AI text rarely varies in complexity.`,
    },
  };
}

// ============================================================
// LAYER 4: MODEL FINGERPRINTING
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

  let result = `Strongest match: ${name} (${primary[1]} patterns: ${evidence})`;

  // Secondary models
  const secondary = sorted.filter(([, count]) => count >= 3).slice(1);
  if (secondary.length > 0) {
    const extras = secondary.map(([m, c]) => `${modelNames[m] || m} (${c} patterns)`).join(", ");
    result += `. Also found: ${extras}`;
  }

  return { hasPrimary: true, model: primary[0], name, count: primary[1], text: result };
}

// ============================================================
// LAYER 5: TREADMILL DETECTOR (Repetition & Padding)
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
// LAYER 6: CONCRETENESS SCORER (Vague vs Specific)
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
        explanation: `This paragraph is all abstractions — no proper nouns, numbers, dates, or quotes. Add something concrete the reader can picture or verify.`,
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

function computeTTR(words) {
  if (words.length === 0) return 1;
  const windowSize = Math.min(100, words.length);
  const lower = words.map(w => w.toLowerCase().replace(/[^a-z']/g, "")).filter(Boolean);
  if (lower.length <= windowSize) {
    return new Set(lower).size / lower.length;
  }
  // Moving window average
  let totalTTR = 0;
  let windows = 0;
  for (let i = 0; i <= lower.length - windowSize; i += Math.max(1, Math.floor(windowSize / 2))) {
    const window = lower.slice(i, i + windowSize);
    totalTTR += new Set(window).size / window.length;
    windows++;
  }
  return totalTTR / windows;
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
  const phraseHits = [];
  const lower = text.toLowerCase();
  PHRASE_DB.forEach(entry => {
    const target = entry.text.toLowerCase();
    let count = 0;
    let pos = 0;
    const occurrences = [];
    while (pos < lower.length) {
      const idx = lower.indexOf(target, pos);
      if (idx === -1) break;
      // Word boundary check
      const before = idx > 0 ? lower[idx - 1] : " ";
      const after = idx + target.length < lower.length ? lower[idx + target.length] : " ";
      if (/\w/.test(before) || /\w/.test(after)) {
        // Not a word boundary match for single words, be more lenient for phrases
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

  // Layer 2: Structural patterns
  const structures = {
    binaryContrasts: { label: "Binary contrast ('not X — it's Y')", matches: detectBinaryContrasts(text), explanation: "The most commonly identified AI writing pattern. Just state Y directly instead of the dramatic contrast." },
    negativeListings: { label: "Negative listings", matches: detectNegativeListings(text), explanation: "Multiple 'Not a...' sentences before the reveal. This striptease pattern is a dead giveaway." },
    fragments: { label: "Dramatic fragments", matches: detectFragments(text), explanation: "Short fragments in sequence for manufactured drama. Real emphasis comes from content, not formatting." },
    ruleOfThree: { label: "Numbered/bulleted lists & rule of three", matches: detectRuleOfThree(text), explanation: "AI defaults to structured lists where flowing prose would be stronger." },
    emojiFormatting: { label: "Emoji as formatting", matches: detectEmojiFormatting(text), explanation: "Heavy emoji markers are a LinkedIn/AI content pattern." },
    copulaAvoidance: { label: "Copula avoidance ('serves as' instead of 'is')", matches: detectCopulaAvoidance(text), explanation: "AI's training incentivizes avoiding simple 'is/are.' Humans don't." },
    elegantVariation: { label: "Elegant variation (forced synonym cycling)", matches: detectElegantVariation(text), explanation: "AI's repetition penalty forces it to cycle synonyms for the same thing." },
    falseRanges: { label: "False ranges ('from X to Y')", matches: detectFalseRanges(text), explanation: "Vague ranges that try to sound inclusive but say nothing." },
    notOnlyButAlso: { label: "'Not only... but also'", matches: detectNotOnlyButAlso(text), explanation: "AI overuses this additive structure at 2-5x the human rate." },
    patronizingAnalogy: { label: "Patronizing analogies", matches: detectPatronizingAnalogy(text), explanation: "AI assumes readers need metaphors for everything." },
    falseBalance: { label: "False balance / both-sides hedge", matches: detectFalseBalance(text), explanation: "AI never commits to a position." },
    conclusionBloat: { label: "Conclusion bloat", matches: detectConclusionBloat(text), explanation: "AI never trusts the reader to remember what they just read." },
    ghostCitations: { label: "Ghost citations", matches: detectGhostCitations(text), explanation: "Unnamed sources. Name them or cut them." },
    ingOpeners: { label: "-ing sentence openers", matches: detectIngOpeners(text), explanation: "AI starts sentences with present participles at 2-5x the human rate." },
    transitionDensity: { label: "Transition word overuse", matches: detectTransitionDensity(text), explanation: "Formal transitions at 3-5x the human rate." },
  };

  // Layer 3: Writing rhythm
  const rhythm = analyzeRhythm(text);

  // Layer 4: Model fingerprint
  const fp = fingerprint(phraseHits);

  // Layer 5: Treadmill
  const treadmill = detectTreadmill(text);

  // Layer 6: Concreteness
  const concreteness = analyzeConcreteness(text);

  // Count total issues
  const phraseIssues = phraseHits.reduce((s, h) => s + h.count, 0);
  const structureIssues = Object.values(structures).reduce((s, v) => s + v.matches.length, 0);
  const rhythmIssues = Object.values(rhythm).filter(m => m.rating === "bad").length;
  const treadmillIssues = treadmill.length;
  const concreteIssues = concreteness.length;
  const totalIssues = phraseIssues + structureIssues + rhythmIssues + treadmillIssues + concreteIssues;

  return {
    wordCount,
    tooShort: false,
    shortWarning: wordCount < 250,
    phraseHits,
    structures,
    rhythm,
    fingerprint: fp,
    treadmill,
    concreteness,
    totalIssues,
    phraseIssues,
    structureIssues,
  };
}

// ============================================================
// UI RENDERING
// ============================================================

const editor = document.getElementById("editor");
const overlay = document.getElementById("editor-overlay");
const analyzeBtn = document.getElementById("analyze-btn");
const sampleBtn = document.getElementById("sample-btn");
const clearBtn = document.getElementById("clear-btn");
const wordCountEl = document.getElementById("word-count");
const textWarning = document.getElementById("text-warning");
const summaryBar = document.getElementById("summary-bar");
const findingsSection = document.getElementById("findings-section");
const tabBar = document.getElementById("tab-bar");
const copyReportBtn = document.getElementById("copy-report-btn");

let lastResult = null;

// Tab switching
tabBar.addEventListener("click", e => {
  const tab = e.target.closest(".tab");
  if (!tab) return;
  tabBar.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  tab.classList.add("active");
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
  document.getElementById(`panel-${tab.dataset.tab}`).classList.add("active");
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
sampleBtn.addEventListener("click", () => {
  editor.value = SAMPLE_TEXT;
  editor.dispatchEvent(new Event("input"));
  runAnalysis();
});
clearBtn.addEventListener("click", () => {
  editor.value = "";
  editor.dispatchEvent(new Event("input"));
  overlay.innerHTML = "";
  summaryBar.classList.add("hidden");
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
    textWarning.textContent = words === 0 ? "" : "Paste at least 100 words for a meaningful analysis.";
    summaryBar.classList.add("hidden");
    findingsSection.classList.add("hidden");
    overlay.innerHTML = "";
    return;
  }

  const result = analyze(text);
  lastResult = result;

  if (result.shortWarning) {
    textWarning.textContent = "Short text — analysis works better with 250+ words.";
  } else {
    textWarning.textContent = "";
  }

  // Show sections
  summaryBar.classList.remove("hidden");
  findingsSection.classList.remove("hidden");

  // Summary bar
  document.getElementById("total-issues").textContent = result.totalIssues;
  document.querySelector("#total-issues + .summary-label").textContent = `AI pattern${result.totalIssues === 1 ? "" : "s"} found`;

  const modelEl = document.getElementById("model-match");
  if (result.fingerprint.hasPrimary) {
    modelEl.querySelector(".summary-number").textContent = result.fingerprint.name;
    modelEl.querySelector(".summary-label").textContent = `${result.fingerprint.count} patterns`;
  } else {
    modelEl.querySelector(".summary-number").textContent = "—";
    modelEl.querySelector(".summary-label").textContent = "No clear model match";
  }

  const wv = result.rhythm.wordVariety;
  document.querySelector("#word-variety .summary-number").textContent = wv.rating === "good" ? "Rich" : wv.rating === "warn" ? "Moderate" : "Low";
  document.querySelector("#word-variety .summary-label").textContent = "Word variety";

  const sr = result.rhythm.sentenceVariety;
  document.querySelector("#sentence-rhythm .summary-number").textContent = sr.rating === "good" ? "Varied" : sr.rating === "warn" ? "Moderate" : "Flat";
  document.querySelector("#sentence-rhythm .summary-label").textContent = "Sentence rhythm";

  const ps = result.rhythm.paragraphShape;
  document.querySelector("#paragraph-shape .summary-number").textContent = ps.rating === "good" ? "Varied" : ps.rating === "warn" ? "Similar" : "Uniform";
  document.querySelector("#paragraph-shape .summary-label").textContent = "Paragraph shape";

  // Render tab panels
  renderWordsPanel(result);
  renderStructuresPanel(result);
  renderRhythmPanel(result);
  renderPaddingPanel(result);
  renderVaguePanel(result);

  // Render overlay highlights
  renderOverlay(text, result);
}

function renderWordsPanel(result) {
  const panel = document.getElementById("panel-words");
  if (result.phraseHits.length === 0) {
    panel.innerHTML = `<div class="empty-state">No AI-favorite words detected. Nice work.</div>`;
    return;
  }

  // Group by category
  const categories = {};
  result.phraseHits.forEach(hit => {
    const cat = hit.category;
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(hit);
  });

  const catLabels = {
    vocabulary: "AI Vocabulary",
    phrase: "AI Phrases",
    ghost_citation: "Ghost Citations",
    throat_clearing: "Throat-clearing Openers",
    emphasis: "Emphasis Crutches",
    meta: "Meta-commentary",
    treadmill: "Treadmill Markers",
    conclusion_bloat: "Conclusion Bloat",
    chatbot_artifact: "Chatbot Artifacts",
    filler: "Filler Phrases",
    performative: "Performative Depth",
    inflation: "Significance Inflation",
    transition: "Transition Overuse",
    copula_avoidance: "Copula Avoidance",
    engagement_bait: "Engagement Bait",
  };

  let html = "";
  // Model attribution at top if applicable
  if (result.fingerprint.hasPrimary) {
    html += `<div class="finding-card" style="border-left: 3px solid var(--issue);">
      <p class="finding-explanation" style="margin:0;">${escapeHtml(result.fingerprint.text)}</p>
    </div>`;
  }

  Object.entries(categories).forEach(([cat, hits]) => {
    const totalCount = hits.reduce((s, h) => s + h.count, 0);
    html += `<div class="finding-card">
      <div class="finding-header">
        <h3 class="finding-title">${catLabels[cat] || cat}</h3>
        <span class="finding-count">${totalCount}</span>
      </div>`;

    hits.sort((a, b) => b.tier - a.tier || b.count - a.count).slice(0, 15).forEach(hit => {
      const modelTags = (hit.models || []).map(m => {
        const cls = m === "chatgpt" ? "model-chatgpt" : m === "claude" ? "model-claude" : m === "gemini" ? "model-gemini" : m === "deepseek" ? "model-deepseek" : "model-generic";
        const names = { chatgpt: "ChatGPT", claude: "Claude", gemini: "Gemini", deepseek: "DeepSeek", chinese_llm: "Chinese LLM", kimi: "Kimi", grok: "Grok" };
        return `<span class="model-tag ${cls}">${names[m] || m}</span>`;
      }).join("");

      html += `<div style="margin-top: 0.6rem; padding-top: 0.6rem; border-top: 1px solid var(--border-light);">
        <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <strong style="color:var(--issue);">'${escapeHtml(hit.text)}'</strong>
          <span style="color:var(--text-light); font-size:0.85rem;">${hit.count}x</span>
          ${modelTags}
        </div>
        <p class="finding-explanation">${escapeHtml(hit.explanation)}</p>
        ${hit.replacement ? `<p class="finding-suggestion">Try: ${escapeHtml(hit.replacement)}</p>` : ""}
      </div>`;
    });
    html += `</div>`;
  });

  panel.innerHTML = html;
}

function renderStructuresPanel(result) {
  const panel = document.getElementById("panel-structures");
  const active = Object.entries(result.structures).filter(([, v]) => v.matches.length > 0);

  if (active.length === 0) {
    panel.innerHTML = `<div class="empty-state">No cliche structures detected.</div>`;
    return;
  }

  let html = "";
  active.forEach(([, struct]) => {
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
      html += `<p style="color:var(--text-light); font-size:0.85rem; margin-top:0.5rem;">+${struct.matches.length - 3} more</p>`;
    }
    html += `</div>`;
  });

  panel.innerHTML = html;
}

function renderRhythmPanel(result) {
  const panel = document.getElementById("panel-rhythm");
  const metrics = result.rhythm;
  let html = "";

  Object.values(metrics).forEach(metric => {
    const barWidth = metric.label === "Word variety"
      ? Math.min(100, metric.value * 100)
      : metric.label === "Sentence rhythm"
        ? Math.min(100, metric.value * 5)
        : metric.label === "Paragraph shape"
          ? Math.min(100, metric.value * 3)
          : Math.min(100, metric.value * 50);

    html += `<div class="rhythm-metric">
      <div class="rhythm-label">${escapeHtml(metric.label)}</div>
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
      <div class="rhythm-verdict ${rating}">${emDashes} em dash${emDashes === 1 ? "" : "es"} in ${wordCount} words (${per400} per 400 words). ${emDashes > 4 ? "AI loves em dashes. Humans use them sparingly. Try commas or periods." : emDashes > 2 ? "Getting high. Watch the em dash count." : "Within normal range."}</div>
    </div>`;
  }

  panel.innerHTML = html;
}

function renderPaddingPanel(result) {
  const panel = document.getElementById("panel-padding");
  const { treadmill, phraseHits } = result;

  // Get treadmill marker phrases
  const treadmillPhrases = phraseHits.filter(h => h.category === "treadmill");
  const conclusionPhrases = phraseHits.filter(h => h.category === "conclusion_bloat");

  if (treadmill.length === 0 && treadmillPhrases.length === 0 && conclusionPhrases.length === 0) {
    panel.innerHTML = `<div class="empty-state">No repetition or padding detected. Your text is lean.</div>`;
    return;
  }

  let html = "";

  if (treadmill.length > 0) {
    html += `<div class="finding-card">
      <div class="finding-header">
        <h3 class="finding-title">Paragraph overlap</h3>
        <span class="finding-count">${treadmill.length}</span>
      </div>
      <p class="finding-explanation">These paragraphs restate earlier content without adding new information.</p>`;
    treadmill.forEach(m => {
      html += `<div class="finding-snippet">${escapeHtml(m.snippet)}</div>
        <p class="finding-suggestion">${escapeHtml(m.explanation)}</p>`;
    });
    html += `</div>`;
  }

  if (treadmillPhrases.length > 0) {
    html += `<div class="finding-card">
      <div class="finding-header">
        <h3 class="finding-title">Treadmill marker phrases</h3>
        <span class="finding-count">${treadmillPhrases.reduce((s, h) => s + h.count, 0)}</span>
      </div>
      <p class="finding-explanation">Phrases that signal restating without new information.</p>`;
    treadmillPhrases.forEach(h => {
      html += `<div style="margin-top:0.5rem;">
        <strong style="color:var(--issue);">'${escapeHtml(h.text)}'</strong> <span style="color:var(--text-light)">${h.count}x</span>
        <p class="finding-explanation">${escapeHtml(h.explanation)}</p>
      </div>`;
    });
    html += `</div>`;
  }

  panel.innerHTML = html;
}

function renderVaguePanel(result) {
  const panel = document.getElementById("panel-vague");
  const { concreteness } = result;

  if (concreteness.length === 0) {
    panel.innerHTML = `<div class="empty-state">Your text has good specificity. No overly abstract paragraphs detected.</div>`;
    return;
  }

  let html = `<div class="finding-card">
    <div class="finding-header">
      <h3 class="finding-title">Abstract paragraphs</h3>
      <span class="finding-count">${concreteness.length}</span>
    </div>
    <p class="finding-explanation">These paragraphs have zero specific names, numbers, or details — all abstractions.</p>`;

  concreteness.forEach(m => {
    html += `<div class="finding-snippet">${escapeHtml(m.snippet)}</div>
      <p class="finding-suggestion">${escapeHtml(m.explanation)}</p>`;
  });

  html += `</div>`;
  panel.innerHTML = html;
}

// ============================================================
// INLINE OVERLAY HIGHLIGHTING
// ============================================================

function renderOverlay(text, result) {
  // Collect all highlight ranges
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

  // Sort and deduplicate (simple: just sort by start)
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
  let report = "THE RED PEN — Analysis Report\n";
  report += "=".repeat(40) + "\n\n";
  report += `Total AI patterns found: ${result.totalIssues}\n`;
  report += `Word count: ${result.wordCount}\n`;

  if (result.fingerprint.hasPrimary) {
    report += `Model match: ${result.fingerprint.text}\n`;
  }

  report += `\nWord variety: ${result.rhythm.wordVariety.description}\n`;
  report += `Sentence rhythm: ${result.rhythm.sentenceVariety.description}\n`;
  report += `Paragraph shape: ${result.rhythm.paragraphShape.description}\n`;
  report += `Complexity range: ${result.rhythm.complexityRange.description}\n`;

  if (result.phraseHits.length > 0) {
    report += `\n--- AI Favorite Words (${result.phraseIssues} total) ---\n`;
    result.phraseHits.forEach(h => {
      report += `  '${h.text}' (${h.count}x) — ${h.explanation}\n`;
    });
  }

  const activeStructures = Object.values(result.structures).filter(s => s.matches.length > 0);
  if (activeStructures.length > 0) {
    report += `\n--- Cliche Structures (${result.structureIssues} total) ---\n`;
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

  report += `\n---\nGenerated by The Red Pen (based on Stop Slop by Hardik Pandya)\nAll analysis ran locally — your text never left your machine.\n`;
  return report;
}
