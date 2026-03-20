#!/usr/bin/env python3
"""
Round 2: Generate 200 more AI LinkedIn posts with different prompts
to test whether the 2026-era tells hold up on unseen AI output.
Uses different topics and prompt styles from round 1.
"""

import json
import os
import time
import random
import httpx

random.seed(99)  # Different seed from round 1

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "ai_generated_round2.json")

ANTHROPIC_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "")
OPENROUTER_KEY = os.environ.get("OPENROUTER_API_KEY", "")

# New prompts — different from round 1
PROMPTS = [
    "Write a LinkedIn post about {topic}.",
    "I want to post on LinkedIn about {topic}. Write it for me.",
    "Help me write a LinkedIn post. Topic: {topic}. Tone: {tone}.",
    "Draft a LinkedIn post reflecting on {topic}. About 150 words.",
    "Write a LinkedIn post where I share a lesson about {topic}.",
    "Write a professional LinkedIn post about {topic}. No hashtags.",
    "Create a LinkedIn post about {topic} that feels authentic and personal.",
    "Write a LinkedIn post about {topic}. Make it short and impactful.",
    "I need a LinkedIn post about {topic}. Something that will resonate with my network.",
    "Write a LinkedIn post about {topic}. Include a call to action at the end.",
]

# Different topics from round 1
TOPICS = [
    "returning to office after remote work",
    "the problem with 'best practices'",
    "what I learned from getting laid off",
    "why we stopped doing performance reviews",
    "the hidden cost of meetings",
    "hiring for attitude vs skills",
    "why junior employees outperform seniors sometimes",
    "my worst management mistake",
    "the difference between busy and productive",
    "why customer support is a growth channel",
    "dealing with imposter syndrome as a leader",
    "the myth of work-life balance",
    "what nobody tells you about fundraising",
    "why most company values are meaningless",
    "building a team from scratch",
    "transitioning from IC to manager",
    "the real cost of technical debt",
    "why transparency matters more than perks",
    "lessons from shutting down a product",
    "the underrated skill of writing well at work",
]

TONES = ["reflective", "direct", "conversational", "thoughtful", "energetic"]


def call_anthropic(prompt):
    if not ANTHROPIC_KEY:
        return None
    try:
        r = httpx.post(
            "https://api.anthropic.com/v1/messages",
            headers={"x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json"},
            json={"model": "claude-sonnet-4-20250514", "max_tokens": 400, "messages": [{"role": "user", "content": prompt}]},
            timeout=30,
        )
        if r.status_code == 200:
            return r.json()["content"][0]["text"]
    except Exception as e:
        print(f"    Anthropic error: {e}")
    return None


def call_gemini(prompt):
    if not GEMINI_KEY:
        return None
    try:
        r = httpx.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_KEY}",
            headers={"content-type": "application/json"},
            json={"contents": [{"parts": [{"text": prompt}]}], "generationConfig": {"maxOutputTokens": 400}},
            timeout=30,
        )
        if r.status_code == 200:
            return r.json()["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        print(f"    Gemini error: {e}")
    return None


def call_openrouter(prompt, model="openai/gpt-4o"):
    if not OPENROUTER_KEY:
        return None
    try:
        r = httpx.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {OPENROUTER_KEY}", "content-type": "application/json"},
            json={"model": model, "max_tokens": 400, "messages": [{"role": "user", "content": prompt}]},
            timeout=30,
        )
        if r.status_code == 200:
            return r.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"    OpenRouter error: {e}")
    return None


MODELS = []
if ANTHROPIC_KEY:
    MODELS.append(("Claude", call_anthropic, "claude"))
if GEMINI_KEY:
    MODELS.append(("Gemini", call_gemini, "gemini"))
if OPENROUTER_KEY:
    MODELS.append(("GPT-4o", lambda p: call_openrouter(p, "openai/gpt-4o"), "chatgpt"))
    MODELS.append(("Llama", lambda p: call_openrouter(p, "meta-llama/llama-3.1-70b-instruct"), "llama"))

print(f"Models: {[m[0] for m in MODELS]}")

generated = []
target_per_model = 50  # 200 total

for model_name, model_fn, model_tag in MODELS:
    print(f"\n--- {model_name} ---")
    count = 0
    for i in range(target_per_model):
        prompt = random.choice(PROMPTS)
        topic = random.choice(TOPICS)
        tone = random.choice(TONES)
        prompt = prompt.replace("{topic}", topic).replace("{tone}", tone)

        text = model_fn(prompt)
        if text and len(text.split()) >= 20:
            generated.append({
                "text": text.strip(),
                "label": "ai",
                "source": f"llm-r2-{model_tag}",
                "domain": "linkedin",
                "word_count": len(text.split()),
                "model": model_tag,
            })
            count += 1
        if count % 10 == 0 and count > 0:
            print(f"  {count}...")
        time.sleep(0.5)
    print(f"  Total: {count}")

print(f"\nGenerated {len(generated)} posts")

with open(OUTPUT_FILE, "w") as f:
    json.dump(generated, f, indent=2)

# Update corpus
CORPUS_FILE = os.path.join(OUTPUT_DIR, "corpus.json")
with open(CORPUS_FILE, "r") as f:
    corpus = json.load(f)

corpus.extend(generated)
human = sum(1 for c in corpus if c["label"] == "human")
ai = sum(1 for c in corpus if c["label"] == "ai")
print(f"Corpus: {len(corpus)} total (human: {human}, ai: {ai})")

with open(CORPUS_FILE, "w") as f:
    json.dump(corpus, f, indent=2)
print(f"Saved to {CORPUS_FILE}")
