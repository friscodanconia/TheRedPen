#!/usr/bin/env python3
"""
Build a benchmark corpus for The Red Pen scoring calibration.

Sources:
- NeuML LinkedIn posts (HuggingFace) — real human LinkedIn posts
- User's LinkedIn export — real human LinkedIn posts
- AI Text Detection Pile (HuggingFace) — human essays + AI-generated text
- Synthetically generated AI LinkedIn posts

Output: benchmark/corpus.json with labeled entries
"""

import json
import csv
import os
import subprocess
import sys

CORPUS_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT = os.path.join(CORPUS_DIR, "corpus.json")

corpus = []

# ============================================================
# Source 1: NeuML LinkedIn posts (real human posts)
# ============================================================
print("Fetching NeuML LinkedIn dataset...")
try:
    from datasets import load_dataset
    ds = load_dataset("NeuML/neuml-linkedin-202501", split="train")
    for row in ds:
        text = row.get("Post title", "").strip()
        if text and len(text.split()) >= 20:
            corpus.append({
                "text": text,
                "label": "human",
                "source": "neuml-linkedin",
                "domain": "linkedin",
                "word_count": len(text.split()),
            })
    print(f"  Added {sum(1 for c in corpus if c['source'] == 'neuml-linkedin')} NeuML posts")
except Exception as e:
    print(f"  Skipped NeuML (install: pip3 install datasets): {e}")

# ============================================================
# Source 2: User's LinkedIn export
# ============================================================
print("Reading LinkedIn export...")
export_path = os.path.expanduser(
    "~/Desktop/Basic_LinkedInDataExport_01-16-2026_extracted/Rich_Media.csv"
)
if os.path.exists(export_path):
    with open(export_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            text = row.get("Media Description", "").strip()
            if text and text != "-" and len(text.split()) >= 20:
                corpus.append({
                    "text": text,
                    "label": "human",
                    "source": "user-linkedin-export",
                    "domain": "linkedin",
                    "word_count": len(text.split()),
                })
    count = sum(1 for c in corpus if c["source"] == "user-linkedin-export")
    print(f"  Added {count} posts from LinkedIn export")
else:
    print(f"  Export not found at {export_path}")

# ============================================================
# Source 3: AI Text Detection Pile — human subset (essays)
# ============================================================
print("Fetching human essays from AI Text Detection Pile...")
try:
    from datasets import load_dataset
    ds = load_dataset("artem9k/ai-text-detection-pile", split="train", streaming=True)
    human_count = 0
    ai_count = 0
    for row in ds:
        source = row.get("source", "")
        text = row.get("text", "").strip()
        if not text or len(text.split()) < 30 or len(text.split()) > 500:
            continue

        if "human" in source.lower() or source in ["reddit_eli5", "wikihow", "HC3_English_human"]:
            if human_count < 200:
                corpus.append({
                    "text": text[:2000],  # cap length
                    "label": "human",
                    "source": "ai-detection-pile-human",
                    "domain": "essay",
                    "word_count": len(text.split()),
                })
                human_count += 1

        elif "gpt" in source.lower() or "chatgpt" in source.lower() or source in ["HC3_English_chatgpt"]:
            if ai_count < 200:
                corpus.append({
                    "text": text[:2000],
                    "label": "ai",
                    "source": "ai-detection-pile-ai",
                    "domain": "essay",
                    "word_count": len(text.split()),
                })
                ai_count += 1

        if human_count >= 200 and ai_count >= 200:
            break

    print(f"  Added {human_count} human essays, {ai_count} AI essays")
except Exception as e:
    print(f"  Skipped AI Detection Pile: {e}")

# ============================================================
# Source 4: Synthetic AI LinkedIn posts
# Generate stereotypical AI LinkedIn posts using templates
# ============================================================
print("Generating synthetic AI LinkedIn posts...")

AI_LINKEDIN_TEMPLATES = [
    """I'm humbled to announce that I've joined {company} as {role}. After {years} years of navigating the ever-evolving landscape of {industry}, this feels like a pivotal moment in my journey. The team here is truly transformative, and I can't wait to leverage my experience to foster innovation in this vibrant ecosystem. Excited for what lies ahead! #Leadership #Innovation #{industry}""",

    """Here's the thing about {topic}: most people get it wrong. They think it's about {wrong_thing}. It's not. It's about {right_thing}. Let that sink in. I've spent {years} years in {industry} and this is the hard truth nobody tells you. The secret? There is no secret. It's about showing up every day with unwavering commitment. Agree? Drop a comment below. #GrowthMindset #Leadership""",

    """I quit my job. Nobody told me this would be easy. But here's what they don't teach you in business school: your network is your net worth. Fast forward to today — I'm building something groundbreaking. Not a product. Not a company. A movement. If I can do it, so can you. The future looks bright for those who dare to embark on this journey. Follow me for more. #Entrepreneurship #StartupLife""",

    """We need to talk about {topic}. The conversation we're not having is crucial. In today's fast-paced world, the landscape of {industry} continues to evolve at an unprecedented pace. It's not just about {thing1} — it's about {thing2}. This is bigger than any one company. This matters because the implications are profound. Read that again. #FutureOfWork #Innovation""",

    """{years} years ago, I was struggling. I didn't know what I wanted. I was lost. Then everything changed. I discovered {thing}. Looking back, that was the moment that defined my career. The lesson? Hard work beats talent when talent doesn't work hard. Here's my story. Years ago I was just another {role} in a {company}. Today I lead a team of {number}. The takeaway: never give up. #MondayMotivation #Leadership""",

    """Thrilled to announce that our team at {company} has achieved something truly remarkable. We've leveraged cutting-edge {tech} to streamline our {process}, resulting in a transformative impact on our ecosystem. This comprehensive approach has been pivotal in fostering innovation. A testament to the unwavering commitment of our talented team. Grateful for this incredible journey! #Innovation #AI #Leadership""",

    """Hot take: {opinion}. I'll probably get hate for this, but someone needs to say it. The uncomfortable truth is that most {role}s are doing it wrong. Stop doing {wrong_thing}. Start doing {right_thing}. Not because it's easy. Because it's necessary. Hard truth: if you're not {doing_thing}, you're already behind. Save this for later. Tag someone who needs to hear this. #HardTruths #Leadership""",

    """Honored to share that I've been recognized as a {award} by {org}. Still can't believe it. Never in my wildest dreams did I think this was possible. Blessed to have an amazing support system. This isn't just my achievement — it's a testament to everyone who believed in me. Pinch me moment. What a journey it has been. Humbled and grateful. #Blessed #Achievement""",

    """1. Embrace failure\n2. Stay curious\n3. Build genuine relationships\n4. Invest in yourself\n5. Show up consistently\n\nThese 5 principles transformed my career. I went from {old_state} to {new_state} in {time}. The game changer? Number 3. Your network is your net worth. Most people won't read this far. But the ones who do? They're the real leaders. Bookmark this. #CareerAdvice #Leadership""",

    """I keep seeing the same mistake. {Role}s who think {wrong_thing}. Here's why that matters: in the realm of {industry}, the interplay between {thing1} and {thing2} is paramount. It's imperative to cultivate a holistic approach. Moreover, the synergy between cross-functional teams is indispensable. Furthermore, leveraging robust frameworks is crucial for navigating the challenges ahead. Thoughts? #Strategy #Leadership""",
]

import random
random.seed(42)

fills = {
    "company": ["Google", "Meta", "a Series B startup", "an AI company", "TechCorp", "InnovateLabs"],
    "role": ["VP of Product", "Head of Strategy", "Chief Innovation Officer", "Director of Growth", "Senior Leader"],
    "years": ["5", "8", "10", "12", "15", "20"],
    "industry": ["technology", "AI", "digital transformation", "SaaS", "fintech", "marketing"],
    "topic": ["leadership", "remote work", "AI adoption", "mental health at work", "hiring", "burnout"],
    "wrong_thing": ["the technology", "the strategy", "the product", "the process", "individual performance"],
    "right_thing": ["the people", "the culture", "the relationships", "the mindset", "team alignment"],
    "thing1": ["innovation", "strategy", "technology", "data", "culture"],
    "thing2": ["execution", "people", "empathy", "adaptability", "trust"],
    "thing": ["design thinking", "servant leadership", "deep work", "authentic connection", "radical candor"],
    "number": ["25", "50", "100", "200"],
    "tech": ["AI", "machine learning", "automation", "cloud infrastructure", "data analytics"],
    "process": ["operations", "customer journey", "go-to-market strategy", "product development"],
    "opinion": ["MBAs are overrated", "hustle culture is dead", "remote work is better", "most meetings are waste"],
    "doing_thing": ["adapting to AI", "investing in people", "building in public", "thinking long-term"],
    "award": ["Top 40 Under 40", "Industry Leader", "Innovation Champion", "Rising Star"],
    "org": ["Forbes", "Inc Magazine", "our industry body", "LinkedIn"],
    "old_state": ["an individual contributor", "a burned-out manager", "unemployed", "stuck in a dead-end role"],
    "new_state": ["leading a global team", "running my own company", "advising Fortune 500s", "doing work I love"],
    "time": ["18 months", "2 years", "3 years", "5 years"],
}

for i in range(300):
    template = random.choice(AI_LINKEDIN_TEMPLATES)
    text = template
    for key, values in fills.items():
        text = text.replace("{" + key + "}", random.choice(values), 1)
    # Clean up any remaining placeholders
    import re
    text = re.sub(r'\{[^}]+\}', 'this', text)

    if len(text.split()) >= 20:
        corpus.append({
            "text": text.strip(),
            "label": "ai",
            "source": "synthetic-linkedin-ai",
            "domain": "linkedin",
            "word_count": len(text.split()),
        })

print(f"  Added 300 synthetic AI LinkedIn posts")

# ============================================================
# Summary and save
# ============================================================
human = sum(1 for c in corpus if c["label"] == "human")
ai = sum(1 for c in corpus if c["label"] == "ai")
linkedin = sum(1 for c in corpus if c["domain"] == "linkedin")
essay = sum(1 for c in corpus if c["domain"] == "essay")

print(f"\n=== Corpus Summary ===")
print(f"Total: {len(corpus)} entries")
print(f"Human: {human}, AI: {ai}")
print(f"LinkedIn domain: {linkedin}, Essay domain: {essay}")
print(f"Sources: {set(c['source'] for c in corpus)}")

with open(OUTPUT, "w") as f:
    json.dump(corpus, f, indent=2)
print(f"\nSaved to {OUTPUT}")
