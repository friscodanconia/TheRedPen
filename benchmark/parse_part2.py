#!/usr/bin/env python3
"""
Parse Part 2 of human LinkedIn posts. Posts are marked with "Post N:" headers
under each author name.
"""

import json
import os
import re

INPUT = os.path.expanduser("~/Desktop/Human LinkedIn Posts Part 2.md")
CORPUS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "corpus.json")

with open(INPUT, "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split("\n")
posts = []
current_author = None
current_post_lines = []
current_post_num = None

def flush_post():
    global current_post_lines, current_author, current_post_num
    if not current_author or not current_post_lines:
        current_post_lines = []
        return
    text = "\n".join(current_post_lines).strip()
    # Remove URLs
    text = re.sub(r'https?://\S+', '', text).strip()
    # Remove "Post N:" prefix if it got included
    text = re.sub(r'^Post\s*\d+\s*:\s*', '', text).strip()
    words = text.split()
    if len(words) >= 20:
        posts.append({
            "text": text,
            "label": "human",
            "source": f"curated-{current_author.lower().replace(' ', '-')}",
            "domain": "linkedin",
            "word_count": len(words),
            "author": current_author,
        })
    current_post_lines = []

# Known authors — detect by matching lines that are just a name
# (capitalized words, no punctuation, short)
def is_author_line(line):
    stripped = line.strip()
    if not stripped or len(stripped) > 40:
        return False
    # Must be 2-3 capitalized words with no punctuation
    words = stripped.split()
    if len(words) < 2 or len(words) > 4:
        return False
    if any(c in stripped for c in ".:;!?()[]{}#@0123456789"):
        return False
    if all(w[0].isupper() for w in words):
        return True
    return False

for line in lines:
    stripped = line.strip()

    # Skip file header
    if stripped == "Human LinkedIn Posts Part 2":
        continue

    # Check for author name
    if is_author_line(stripped) and not stripped.startswith("Post"):
        flush_post()
        current_author = stripped
        current_post_num = None
        continue

    # Check for post marker
    post_match = re.match(r'^Post\s*(\d+)\s*:', stripped)
    if post_match:
        flush_post()
        current_post_num = int(post_match.group(1))
        # The rest of the line after "Post N:" is content
        remainder = re.sub(r'^Post\s*\d+\s*:\s*', '', stripped).strip()
        if remainder:
            current_post_lines.append(remainder)
        continue

    # Regular content line
    if current_author and current_post_num is not None:
        current_post_lines.append(line)

# Flush last post
flush_post()

# Merge with existing corpus
if os.path.exists(CORPUS):
    with open(CORPUS, "r") as f:
        corpus = json.load(f)
else:
    corpus = []

# Remove any previous part2 entries to avoid duplicates
existing_part2_authors = set(p["author"] for p in posts)
corpus = [c for c in corpus if c.get("author") not in existing_part2_authors or not c.get("source", "").startswith("curated-")]

corpus.extend(posts)

# Stats
authors = {}
for p in posts:
    a = p.get("author", "unknown")
    authors[a] = authors.get(a, 0) + 1

print(f"Parsed {len(posts)} posts from {len(authors)} authors:")
for author, count in sorted(authors.items(), key=lambda x: -x[1]):
    avg = sum(p["word_count"] for p in posts if p["author"] == author) // count
    print(f"  {author}: {count} posts (avg {avg} words)")

human = sum(1 for c in corpus if c["label"] == "human")
ai = sum(1 for c in corpus if c["label"] == "ai")
print(f"\nCorpus total: {len(corpus)} (human: {human}, ai: {ai})")

with open(CORPUS, "w") as f:
    json.dump(corpus, f, indent=2)
print(f"Saved to {CORPUS}")
