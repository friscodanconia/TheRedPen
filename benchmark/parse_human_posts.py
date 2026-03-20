#!/usr/bin/env python3
"""
Parse manually collected LinkedIn posts from markdown file.
Uses topic-shift heuristics to split author sections into individual posts.
"""

import json
import os
import re

INPUT = os.path.expanduser("~/Desktop/Human LinkedIn posts.md")
CORPUS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "corpus.json")

KNOWN_AUTHORS = [
    "Ethan Mollick", "Codie Sanchez", "Sahil Bloom", "Lenny Rachitsky",
    "Julie Zhuo", "Wes Kao", "Chris Walker", "Amanda Natividad",
    "Justin Welsh", "Alex Hormozi", "Katelyn Bourgoin", "Dave Gerhardt",
    "April Dunford", "Shreyas Doshi", "Trung Phan", "Packy McCormick",
    "Jasmine Star", "Kieran Flanagan", "Jay Acunzo",
]

with open(INPUT, "r", encoding="utf-8") as f:
    content = f.read()

# Split into author sections
sections = []
current_author = None
current_lines = []

for line in content.split("\n"):
    stripped = line.strip()
    if stripped in KNOWN_AUTHORS:
        if current_author and current_lines:
            sections.append((current_author, "\n".join(current_lines)))
        current_author = stripped
        current_lines = []
    elif stripped in ["Human LinkedIn posts", "LinkedIn eval sets"]:
        continue
    else:
        current_lines.append(line)

if current_author and current_lines:
    sections.append((current_author, "\n".join(current_lines)))


def split_into_posts(text, author):
    """Split an author's section into individual posts using heuristics."""
    paragraphs = re.split(r'\n\s*\n', text)
    paragraphs = [p.strip() for p in paragraphs if p.strip()]

    posts = []
    current_post = []
    current_word_count = 0

    for i, para in enumerate(paragraphs):
        words = para.split()
        is_arrow = bool(re.match(r'^[↓↑→←\s]+$', para))
        is_cta = any(k in para.lower() for k in ["follow me", "hope to see you", "link in", "↓ ↓", "fyi...i'm hosting"])

        if is_arrow:
            continue

        # Detect topic shift: a new post likely starts when...
        is_new_topic = False

        if current_word_count > 0:
            # Strong signals of a new post starting:
            # 1. Previous post ended with CTA/engagement bait
            if current_post and any(k in current_post[-1].lower() for k in
                ["hope to see you", "follow me", "thoughts?", "agree?",
                 "comment below", "share this", "tag someone",
                 "check it out", "sign up", "link in bio"]):
                is_new_topic = True

            # 2. Current paragraph starts a clearly new topic
            #    (short declarative opener unlike continuation)
            if (len(words) < 15 and
                not para.startswith(("- ", "• ", "→ ")) and
                not re.match(r'^\d+[.)]', para) and
                not para.startswith(("Level ", "Step ")) and
                current_word_count > 80 and
                not any(k in para.lower() for k in ["this ", "that ", "these ", "those ", "it ", "but ", "and ", "so ", "the key", "the real", "here's why"])):
                is_new_topic = True

            # 3. Substantial word count accumulated and shift in style
            if current_word_count > 300 and len(words) < 20:
                # Short paragraph after a long post = likely new post opener
                prev_text = " ".join(current_post)
                # Check vocabulary overlap
                prev_words = set(w.lower() for w in prev_text.split() if len(w) > 4)
                curr_words = set(w.lower() for w in words if len(w) > 4)
                overlap = len(prev_words & curr_words) / max(len(curr_words), 1)
                if overlap < 0.15:
                    is_new_topic = True

        if is_new_topic and current_post:
            post_text = "\n\n".join(current_post)
            post_text = re.sub(r'https?://\S+', '', post_text).strip()
            if len(post_text.split()) >= 20:
                posts.append(post_text)
            current_post = [para]
            current_word_count = len(words)
        else:
            current_post.append(para)
            current_word_count += len(words)

    # Flush last post
    if current_post:
        post_text = "\n\n".join(current_post)
        post_text = re.sub(r'https?://\S+', '', post_text).strip()
        if len(post_text.split()) >= 20:
            posts.append(post_text)

    return posts


all_posts = []
for author, text in sections:
    author_posts = split_into_posts(text, author)
    for post_text in author_posts:
        all_posts.append({
            "text": post_text,
            "label": "human",
            "source": f"curated-{author.lower().replace(' ', '-')}",
            "domain": "linkedin",
            "word_count": len(post_text.split()),
            "author": author,
        })

# Merge with existing corpus
if os.path.exists(CORPUS):
    with open(CORPUS, "r") as f:
        corpus = json.load(f)
    corpus = [c for c in corpus if not c.get("source", "").startswith("curated-")]
else:
    corpus = []

corpus.extend(all_posts)

authors = {}
for p in all_posts:
    a = p.get("author", "unknown")
    authors[a] = authors.get(a, 0) + 1

print(f"Parsed {len(all_posts)} posts from {len(authors)} authors:")
for author, count in sorted(authors.items(), key=lambda x: -x[1]):
    avg_words = sum(p['word_count'] for p in all_posts if p['author'] == author) // count
    print(f"  {author}: {count} posts (avg {avg_words} words)")

human = sum(1 for c in corpus if c["label"] == "human")
ai = sum(1 for c in corpus if c["label"] == "ai")
print(f"\nCorpus total: {len(corpus)} (human: {human}, ai: {ai})")

with open(CORPUS, "w") as f:
    json.dump(corpus, f, indent=2)
print(f"Saved to {CORPUS}")
