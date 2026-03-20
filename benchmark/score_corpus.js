#!/usr/bin/env node
/**
 * Score the benchmark corpus using The Red Pen engine.
 * Reads corpus.json, runs analyze() on each entry, outputs scored_corpus.json + stats.
 */

const fs = require("fs");
const vm = require("vm");
const path = require("path");

// Load engine
const enginePath = path.join(__dirname, "..", "frontend", "app.js");
const code = fs.readFileSync(enginePath, "utf8");
const uiStart = code.indexOf("const editor = document");
const engineCode = code.slice(0, uiStart);
const ctx = vm.createContext({ fetch: () => Promise.resolve({ json: () => Promise.resolve(null) }) });
vm.runInContext(engineCode, ctx);

// Load corpus
const corpusPath = path.join(__dirname, "corpus.json");
if (!fs.existsSync(corpusPath)) {
  console.error("corpus.json not found. Run build_corpus.py first.");
  process.exit(1);
}
const corpus = JSON.parse(fs.readFileSync(corpusPath, "utf8"));

console.log(`Scoring ${corpus.length} entries...`);

// Score each entry
const scored = corpus.map((entry, i) => {
  if (i % 100 === 0 && i > 0) process.stdout.write(`  ${i}...`);
  try {
    const result = vm.runInContext(
      `analyze(${JSON.stringify(entry.text)})`,
      ctx
    );
    if (result.tooShort) {
      return { ...entry, aiScore: null, totalIssues: 0, skipped: true };
    }
    return {
      ...entry,
      aiScore: result.aiScore,
      totalIssues: result.totalIssues,
      phraseHits: result.phraseHits.length,
      structureHits: result.structureIssues,
      engagementBait: result.engagementBaitCount,
      broetryRatio: result.rhythm.broetryScore.value,
    };
  } catch (e) {
    return { ...entry, aiScore: null, error: e.message };
  }
});
console.log("\n");

// Save scored corpus
const scoredPath = path.join(__dirname, "scored_corpus.json");
fs.writeFileSync(scoredPath, JSON.stringify(scored, null, 2));

// ============================================================
// Statistics
// ============================================================
const valid = scored.filter((s) => s.aiScore !== null);
const humanScores = valid.filter((s) => s.label === "human").map((s) => s.aiScore);
const aiScores = valid.filter((s) => s.label === "ai").map((s) => s.aiScore);

function stats(arr, label) {
  if (arr.length === 0) return console.log(`  ${label}: no data`);
  const sorted = [...arr].sort((a, b) => a - b);
  const mean = arr.reduce((s, v) => s + v, 0) / arr.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const p10 = sorted[Math.floor(sorted.length * 0.1)];
  const p25 = sorted[Math.floor(sorted.length * 0.25)];
  const p75 = sorted[Math.floor(sorted.length * 0.75)];
  const p90 = sorted[Math.floor(sorted.length * 0.9)];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  console.log(
    `  ${label} (n=${arr.length}): mean=${mean.toFixed(1)}, median=${median}, min=${min}, max=${max}, p10=${p10}, p25=${p25}, p75=${p75}, p90=${p90}`
  );
}

console.log("=== Score Distribution ===");
stats(humanScores, "Human");
stats(aiScores, "AI");

// Separation analysis
if (humanScores.length > 0 && aiScores.length > 0) {
  const humanMean = humanScores.reduce((s, v) => s + v, 0) / humanScores.length;
  const aiMean = aiScores.reduce((s, v) => s + v, 0) / aiScores.length;
  console.log(`\n  Separation: AI mean (${aiMean.toFixed(1)}) - Human mean (${humanMean.toFixed(1)}) = ${(aiMean - humanMean).toFixed(1)} points`);

  // Try thresholds
  console.log("\n=== Threshold Analysis ===");
  for (const threshold of [15, 20, 25, 30, 35, 40]) {
    const truePos = aiScores.filter((s) => s >= threshold).length;
    const falsePos = humanScores.filter((s) => s >= threshold).length;
    const trueNeg = humanScores.filter((s) => s < threshold).length;
    const falseNeg = aiScores.filter((s) => s < threshold).length;
    const precision = truePos / (truePos + falsePos) || 0;
    const recall = truePos / (truePos + falseNeg) || 0;
    const fpr = falsePos / (falsePos + trueNeg) || 0;
    console.log(
      `  Threshold ${threshold}: precision=${(precision * 100).toFixed(1)}%, recall=${(recall * 100).toFixed(1)}%, false_positive_rate=${(fpr * 100).toFixed(1)}%`
    );
  }
}

// By domain
console.log("\n=== By Domain ===");
const domains = [...new Set(valid.map((s) => s.domain))];
domains.forEach((domain) => {
  const domainEntries = valid.filter((s) => s.domain === domain);
  const h = domainEntries.filter((s) => s.label === "human").map((s) => s.aiScore);
  const a = domainEntries.filter((s) => s.label === "ai").map((s) => s.aiScore);
  console.log(`\n  ${domain}:`);
  stats(h, "  Human");
  stats(a, "  AI");
});

// Build percentile distribution for frontend — human posts only
// The question is "does my post have more AI patterns than real human posts?"
const humanSorted = [...humanScores].sort((a, b) => a - b);
const percentiles = {};
for (let i = 0; i <= 100; i++) {
  const idx = Math.min(Math.floor((i / 100) * humanSorted.length), humanSorted.length - 1);
  percentiles[i] = humanSorted[idx];
}

const distPath = path.join(__dirname, "..", "frontend", "distribution.json");
fs.writeFileSync(distPath, JSON.stringify({
  totalPosts: humanScores.length,
  humanCount: humanScores.length,
  aiCount: aiScores.length,
  percentiles,
  humanMean: humanScores.length > 0 ? (humanScores.reduce((s, v) => s + v, 0) / humanScores.length) : 0,
  aiMean: aiScores.length > 0 ? (aiScores.reduce((s, v) => s + v, 0) / aiScores.length) : 0,
}, null, 2));

console.log(`\nSaved scored corpus to ${scoredPath}`);
console.log(`Saved distribution to ${distPath}`);
