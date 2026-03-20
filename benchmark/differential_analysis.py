#!/usr/bin/env python3
"""
Differential analysis: find patterns in 2026 AI LinkedIn posts
that don't appear (or appear less) in human LinkedIn posts.

Compares n-grams, sentence starters, structural patterns,
and word distributions between the two sets.
"""

import json
import os
import re
from collections import Counter

CORPUS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "corpus.json")

with open(CORPUS) as f:
    corpus = json.load(f)

# Split into AI LinkedIn posts and human LinkedIn posts
ai_posts = [c for c in corpus if c["label"] == "ai" and c["domain"] == "linkedin"]
human_posts = [c for c in corpus if c["label"] == "human" and c["domain"] == "linkedin"]

print(f"AI LinkedIn posts: {len(ai_posts)}")
print(f"Human LinkedIn posts: {len(human_posts)}")

ai_text = " ".join(c["text"] for c in ai_posts).lower()
human_text = " ".join(c["text"] for c in human_posts).lower()

ai_words = ai_text.split()
human_words = human_text.split()

print(f"AI word count: {len(ai_words)}")
print(f"Human word count: {len(human_words)}")


def get_ngrams(words, n):
    return [" ".join(words[i:i+n]) for i in range(len(words)-n+1)]


def analyze_ngrams(ai_words, human_words, n, label, min_ai_count=5):
    """Find n-grams overrepresented in AI vs human text."""
    ai_ngrams = Counter(get_ngrams(ai_words, n))
    human_ngrams = Counter(get_ngrams(human_words, n))

    # Normalize to per-10K words
    ai_total = len(ai_words)
    human_total = len(human_words)

    results = []
    for ngram, count in ai_ngrams.items():
        if count < min_ai_count:
            continue
        ai_rate = (count / ai_total) * 10000
        human_count = human_ngrams.get(ngram, 0)
        human_rate = (human_count / human_total) * 10000 if human_total > 0 else 0

        if human_rate == 0:
            ratio = float('inf')
        else:
            ratio = ai_rate / human_rate

        if ratio >= 2.0:  # At least 2x overrepresented
            results.append({
                "ngram": ngram,
                "ai_count": count,
                "human_count": human_count,
                "ai_rate_per_10k": round(ai_rate, 2),
                "human_rate_per_10k": round(human_rate, 2),
                "ratio": round(ratio, 1) if ratio != float('inf') else "inf",
            })

    results.sort(key=lambda x: x["ai_count"], reverse=True)
    return results


# ============================================================
# 1. BIGRAMS (2-word phrases)
# ============================================================
print("\n" + "="*60)
print("BIGRAMS (2-word) — AI-overrepresented")
print("="*60)
bigrams = analyze_ngrams(ai_words, human_words, 2, "bigram", min_ai_count=8)
for b in bigrams[:40]:
    print(f"  '{b['ngram']}' — AI: {b['ai_count']}x ({b['ai_rate_per_10k']}/10K), Human: {b['human_count']}x ({b['human_rate_per_10k']}/10K), Ratio: {b['ratio']}x")

# ============================================================
# 2. TRIGRAMS (3-word phrases)
# ============================================================
print("\n" + "="*60)
print("TRIGRAMS (3-word) — AI-overrepresented")
print("="*60)
trigrams = analyze_ngrams(ai_words, human_words, 3, "trigram", min_ai_count=5)
for t in trigrams[:40]:
    print(f"  '{t['ngram']}' — AI: {t['ai_count']}x ({t['ai_rate_per_10k']}/10K), Human: {t['human_count']}x ({t['human_rate_per_10k']}/10K), Ratio: {t['ratio']}x")

# ============================================================
# 3. QUADGRAMS (4-word phrases)
# ============================================================
print("\n" + "="*60)
print("QUADGRAMS (4-word) — AI-overrepresented")
print("="*60)
quadgrams = analyze_ngrams(ai_words, human_words, 4, "quadgram", min_ai_count=4)
for q in quadgrams[:30]:
    print(f"  '{q['ngram']}' — AI: {q['ai_count']}x, Human: {q['human_count']}x, Ratio: {q['ratio']}x")

# ============================================================
# 4. SENTENCE STARTERS
# ============================================================
print("\n" + "="*60)
print("SENTENCE STARTERS — AI-overrepresented")
print("="*60)

def get_sentence_starters(text, n_words=3):
    sentences = re.split(r'[.!?]\s+', text)
    starters = []
    for s in sentences:
        s = s.strip()
        if s:
            words = s.split()[:n_words]
            if len(words) == n_words:
                starters.append(" ".join(words).lower())
    return starters

ai_starters = Counter(get_sentence_starters(ai_text))
human_starters = Counter(get_sentence_starters(human_text))

ai_sent_count = len(re.split(r'[.!?]\s+', ai_text))
human_sent_count = len(re.split(r'[.!?]\s+', human_text))

starter_results = []
for starter, count in ai_starters.items():
    if count < 5:
        continue
    ai_rate = count / ai_sent_count
    human_count = human_starters.get(starter, 0)
    human_rate = human_count / human_sent_count if human_sent_count > 0 else 0
    ratio = ai_rate / human_rate if human_rate > 0 else float('inf')
    if ratio >= 2.0:
        starter_results.append({
            "starter": starter,
            "ai_count": count,
            "human_count": human_count,
            "ratio": round(ratio, 1) if ratio != float('inf') else "inf",
        })

starter_results.sort(key=lambda x: x["ai_count"], reverse=True)
for s in starter_results[:25]:
    print(f"  '{s['starter']}...' — AI: {s['ai_count']}x, Human: {s['human_count']}x, Ratio: {s['ratio']}x")

# ============================================================
# 5. SINGLE WORDS (unigrams)
# ============================================================
print("\n" + "="*60)
print("SINGLE WORDS — AI-overrepresented (min 15 occurrences)")
print("="*60)

# Filter out common stop words
STOP_WORDS = set("the a an is are was were be been being have has had do does did will would shall should may might can could to of in for on with at by from as into through during before after above below between under about against without within along across behind beyond near upon toward towards".split())

ai_word_counts = Counter(w for w in ai_words if w.isalpha() and len(w) > 2 and w not in STOP_WORDS)
human_word_counts = Counter(w for w in human_words if w.isalpha() and len(w) > 2 and w not in STOP_WORDS)

word_results = []
for word, count in ai_word_counts.items():
    if count < 15:
        continue
    ai_rate = (count / len(ai_words)) * 10000
    human_count = human_word_counts.get(word, 0)
    human_rate = (human_count / len(human_words)) * 10000 if len(human_words) > 0 else 0
    ratio = ai_rate / human_rate if human_rate > 0 else float('inf')
    if ratio >= 2.0:
        word_results.append({
            "word": word,
            "ai_count": count,
            "human_count": human_count,
            "ai_rate": round(ai_rate, 2),
            "human_rate": round(human_rate, 2),
            "ratio": round(ratio, 1) if ratio != float('inf') else "inf",
        })

word_results.sort(key=lambda x: float(x["ratio"]) if x["ratio"] != "inf" else 9999, reverse=True)
for w in word_results[:40]:
    print(f"  '{w['word']}' — AI: {w['ai_count']}x ({w['ai_rate']}/10K), Human: {w['human_count']}x ({w['human_rate']}/10K), Ratio: {w['ratio']}x")

# ============================================================
# 6. STRUCTURAL PATTERNS
# ============================================================
print("\n" + "="*60)
print("STRUCTURAL PATTERNS")
print("="*60)

def structural_stats(posts, label):
    para_counts = []
    question_endings = 0
    colon_usage = 0
    dash_usage = 0
    numbered_lists = 0
    bullet_lists = 0
    hashtag_posts = 0
    avg_sent_len = []

    for p in posts:
        text = p["text"]
        paras = [pp.strip() for pp in text.split("\n") if pp.strip()]
        para_counts.append(len(paras))
        question_endings += 1 if text.strip().endswith("?") else 0
        colon_usage += len(re.findall(r':', text))
        dash_usage += len(re.findall(r'[—–-]', text))
        numbered_lists += 1 if re.search(r'(?:^|\n)\s*\d+[.)]', text) else 0
        bullet_lists += 1 if re.search(r'(?:^|\n)\s*[-•*]', text) else 0
        hashtag_posts += 1 if '#' in text else 0

        sents = re.split(r'[.!?]+', text)
        for s in sents:
            words = s.split()
            if len(words) > 2:
                avg_sent_len.append(len(words))

    n = len(posts)
    print(f"\n  {label} ({n} posts):")
    print(f"    Avg paragraphs/post: {sum(para_counts)/n:.1f}")
    print(f"    Posts ending with '?': {question_endings} ({question_endings/n*100:.0f}%)")
    print(f"    Posts with numbered lists: {numbered_lists} ({numbered_lists/n*100:.0f}%)")
    print(f"    Posts with bullet lists: {bullet_lists} ({bullet_lists/n*100:.0f}%)")
    print(f"    Posts with hashtags: {hashtag_posts} ({hashtag_posts/n*100:.0f}%)")
    print(f"    Avg colons/post: {colon_usage/n:.1f}")
    print(f"    Avg dashes/post: {dash_usage/n:.1f}")
    print(f"    Avg sentence length: {sum(avg_sent_len)/len(avg_sent_len):.1f} words")

structural_stats(ai_posts, "AI")
structural_stats(human_posts, "Human")

# ============================================================
# 7. BY MODEL breakdown
# ============================================================
print("\n" + "="*60)
print("BY MODEL — word patterns unique to each")
print("="*60)

for model in ["claude", "chatgpt", "gemini", "llama"]:
    model_posts = [c for c in ai_posts if c.get("model") == model]
    if not model_posts:
        continue
    model_text = " ".join(c["text"] for c in model_posts).lower()
    model_words = model_text.split()
    model_counts = Counter(w for w in model_words if w.isalpha() and len(w) > 3 and w not in STOP_WORDS)

    # Find words this model uses much more than others
    other_posts = [c for c in ai_posts if c.get("model") != model]
    other_text = " ".join(c["text"] for c in other_posts).lower()
    other_words = other_text.split()
    other_counts = Counter(w for w in other_words if w.isalpha() and len(w) > 3 and w not in STOP_WORDS)

    model_specific = []
    for word, count in model_counts.items():
        if count < 5:
            continue
        model_rate = count / len(model_words) * 10000
        other_count = other_counts.get(word, 0)
        other_rate = other_count / len(other_words) * 10000 if other_words else 0
        ratio = model_rate / other_rate if other_rate > 0 else float('inf')
        if ratio >= 2.5:
            model_specific.append((word, count, other_count, round(ratio, 1) if ratio != float('inf') else "inf"))

    model_specific.sort(key=lambda x: x[1], reverse=True)
    print(f"\n  {model.upper()} distinctive words:")
    for word, mc, oc, ratio in model_specific[:10]:
        print(f"    '{word}' — this model: {mc}x, others: {oc}x, ratio: {ratio}x")
