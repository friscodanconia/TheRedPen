#!/usr/bin/env python3
"""
Generate diverse AI LinkedIn posts using real LLMs.
Uses Anthropic (Claude), Gemini, and OpenRouter (GPT-4o/Llama) APIs.
Varies prompts across topics, tones, lengths, and editing levels.
"""

import json
import os
import time
import random
import httpx

random.seed(42)

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "ai_generated_posts.json")

ANTHROPIC_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "")
OPENROUTER_KEY = os.environ.get("OPENROUTER_API_KEY", "")

# Diverse prompt templates — varying style, topic, length, editing level
PROMPTS = [
    # --- Raw "write me a post" (most common real usage) ---
    "Write a LinkedIn post about {topic}. Keep it professional.",
    "Write a short LinkedIn post (under 150 words) sharing my thoughts on {topic}.",
    "Write a LinkedIn post about {topic}. Make it engaging and thoughtful.",
    "Write a LinkedIn post announcing that I just {achievement}. Keep it humble but proud.",

    # --- Specific formats ---
    "Write a LinkedIn post about {topic} using a numbered list of 5 key points.",
    "Write a LinkedIn post that starts with a bold statement about {topic}, then explains why.",
    "Write a LinkedIn post about a lesson I learned about {topic}. Tell it as a personal story.",
    "Write a LinkedIn post about {topic}. Start with a hook that grabs attention.",

    # --- Tone variations ---
    "Write a LinkedIn post about {topic}. Be contrarian — challenge the conventional wisdom.",
    "Write a LinkedIn post about {topic}. Be inspirational and motivational.",
    "Write a LinkedIn post about {topic}. Be data-driven and specific.",
    "Write a LinkedIn post about {topic}. Be casual and conversational, like talking to a friend.",

    # --- Role-based ---
    "Write a LinkedIn post from the perspective of a {role} sharing insights about {topic}.",
    "Write a LinkedIn post as a {role} who just learned something surprising about {topic}.",

    # --- Polished/edited (harder to detect) ---
    "Write a LinkedIn post about {topic}. Write like a real person, not like AI. Avoid cliches. Be specific and use concrete examples.",
    "Write a LinkedIn post about {topic}. No buzzwords. No hashtags. Just a clear, honest observation.",
    "Write a short, punchy LinkedIn post about {topic}. Under 100 words. No filler.",

    # --- Engagement-optimized (easy to detect) ---
    "Write a viral LinkedIn post about {topic}. Optimize for engagement. Use line breaks for readability.",
    "Write a LinkedIn post about {topic} that will get lots of comments. End with a question.",
    "Write a LinkedIn post about {topic}. Use the format: bold opening, story, lesson, call to action.",
]

TOPICS = [
    "leadership in remote teams", "the future of AI in marketing",
    "hiring mistakes I've made", "why most startups fail",
    "building a personal brand", "the importance of mentorship",
    "career transitions in your 30s", "product-market fit",
    "my first year as a founder", "work-life balance myths",
    "customer feedback loops", "the power of saying no",
    "building trust in teams", "how I grew my newsletter",
    "the state of B2B SaaS", "lessons from scaling a startup",
    "why I left big tech", "networking without being sleazy",
    "failure and resilience", "the value of deep work",
    "AI replacing jobs debate", "starting a side project",
    "company culture vs perks", "public speaking anxiety",
    "investing in yourself", "managing up effectively",
    "the myth of overnight success", "diversity in tech hiring",
    "burnout recovery", "content marketing that works",
]

ACHIEVEMENTS = [
    "got promoted to VP", "raised a $5M seed round",
    "published my first book", "hit 100K newsletter subscribers",
    "left my corporate job to go solo", "joined an amazing new team",
    "completed my MBA", "shipped a product with 10K users",
    "spoke at a major conference", "got my first board seat",
]

ROLES = [
    "startup CEO", "VP of Marketing", "product manager",
    "engineering leader", "solopreneur", "venture capitalist",
    "career coach", "sales leader", "content strategist",
    "head of people operations",
]

generated = []


def call_anthropic(prompt, model="claude-sonnet-4-20250514"):
    """Generate using Anthropic Claude."""
    if not ANTHROPIC_KEY:
        return None
    try:
        r = httpx.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": ANTHROPIC_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": model,
                "max_tokens": 500,
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=30,
        )
        if r.status_code == 200:
            data = r.json()
            return data["content"][0]["text"]
    except Exception as e:
        print(f"    Anthropic error: {e}")
    return None


def call_gemini(prompt):
    """Generate using Google Gemini."""
    if not GEMINI_KEY:
        return None
    try:
        r = httpx.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_KEY}",
            headers={"content-type": "application/json"},
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"maxOutputTokens": 500},
            },
            timeout=30,
        )
        if r.status_code == 200:
            data = r.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        print(f"    Gemini error: {e}")
    return None


def call_openrouter(prompt, model="openai/gpt-4o"):
    """Generate using OpenRouter (GPT-4o, Llama, etc.)."""
    if not OPENROUTER_KEY:
        return None
    try:
        r = httpx.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_KEY}",
                "content-type": "application/json",
            },
            json={
                "model": model,
                "max_tokens": 500,
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=30,
        )
        if r.status_code == 200:
            data = r.json()
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"    OpenRouter error: {e}")
    return None


# Model configurations: (name, function, model_tag)
MODELS = []
if ANTHROPIC_KEY:
    MODELS.append(("Claude Sonnet", call_anthropic, "claude"))
if GEMINI_KEY:
    MODELS.append(("Gemini Flash", call_gemini, "gemini"))
if OPENROUTER_KEY:
    MODELS.append(("GPT-4o", lambda p: call_openrouter(p, "openai/gpt-4o"), "chatgpt"))
    MODELS.append(("Llama 3.1", lambda p: call_openrouter(p, "meta-llama/llama-3.1-70b-instruct"), "llama"))

print(f"Available models: {[m[0] for m in MODELS]}")
print(f"Generating ~{len(PROMPTS) * len(TOPICS) // len(PROMPTS)} posts per model...")

# Generate posts: cycle through models, rotate prompts and topics
target_per_model = 75  # ~300 total across 4 models
count = 0

for model_name, model_fn, model_tag in MODELS:
    print(f"\n--- {model_name} ---")
    model_count = 0

    for i in range(target_per_model):
        prompt_template = PROMPTS[i % len(PROMPTS)]
        topic = random.choice(TOPICS)

        # Fill in template
        prompt = prompt_template.replace("{topic}", topic)
        prompt = prompt.replace("{achievement}", random.choice(ACHIEVEMENTS))
        prompt = prompt.replace("{role}", random.choice(ROLES))

        text = model_fn(prompt)
        if text and len(text.split()) >= 20:
            generated.append({
                "text": text.strip(),
                "label": "ai",
                "source": f"llm-{model_tag}",
                "domain": "linkedin",
                "word_count": len(text.split()),
                "model": model_tag,
                "prompt_style": prompt_template.split(".")[0][:60],
            })
            model_count += 1
            count += 1

        if model_count % 10 == 0 and model_count > 0:
            print(f"  Generated {model_count}...")

        # Rate limiting
        time.sleep(0.5)

    print(f"  Total from {model_name}: {model_count}")

print(f"\n=== Generated {len(generated)} AI posts across {len(MODELS)} models ===")

# Save
with open(OUTPUT_FILE, "w") as f:
    json.dump(generated, f, indent=2)
print(f"Saved to {OUTPUT_FILE}")

# Update corpus: replace synthetic posts with real LLM posts
CORPUS_FILE = os.path.join(OUTPUT_DIR, "corpus.json")
if os.path.exists(CORPUS_FILE):
    with open(CORPUS_FILE, "r") as f:
        corpus = json.load(f)
    # Remove old synthetic posts
    corpus = [c for c in corpus if c.get("source") != "synthetic-linkedin-ai"]
    # Add real LLM posts
    corpus.extend(generated)

    human = sum(1 for c in corpus if c["label"] == "human")
    ai = sum(1 for c in corpus if c["label"] == "ai")
    print(f"\nUpdated corpus: {len(corpus)} total (human: {human}, ai: {ai})")

    with open(CORPUS_FILE, "w") as f:
        json.dump(corpus, f, indent=2)
