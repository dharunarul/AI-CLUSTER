"use client";

import { useState } from "react";

const lengths = [
  { value: "short", label: "Short", desc: "1-2 sentences", emoji: "🔸", maxSentences: 2 },
  { value: "medium", label: "Medium", desc: "2-4 sentences", emoji: "🔹", maxSentences: 4 },
  { value: "long", label: "Detailed", desc: "5-7 sentences", emoji: "🔷", maxSentences: 7 },
];

const stopWords = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "was", "are", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "shall", "can", "this", "that",
  "these", "those", "it", "its", "not", "no", "so", "if", "then",
  "than", "too", "very", "just", "about", "also", "as", "up", "out",
  "all", "each", "every", "both", "few", "more", "most", "other",
  "some", "such", "only", "own", "same", "they", "he", "she", "we",
  "you", "me", "my", "your", "his", "her", "our", "their", "what",
  "which", "who", "whom", "when", "where", "why", "how", "there",
  "here", "then", "than", "before", "after", "above", "below", "between",
]);

function splitSentences(text) {
  const raw = text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);
  return raw;
}

function extractiveSummary(text, maxSentences) {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return { summary: "", stats: {} };
  if (sentences.length <= maxSentences) {
    return {
      summary: sentences.join(" "),
      stats: {
        totalSentences: sentences.length,
        selectedSentences: sentences.length,
        originalWords: text.split(/\s+/).length,
        summaryWords: sentences.join(" ").split(/\s+/).length,
      },
    };
  }

  const wordFreq = {};
  const words = text.toLowerCase().split(/[^a-z]+/);
  words.forEach((w) => {
    if (w.length > 2 && !stopWords.has(w)) {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
    }
  });

  const maxFreq = Math.max(...Object.values(wordFreq), 1);

  Object.keys(wordFreq).forEach((w) => {
    wordFreq[w] = wordFreq[w] / maxFreq;
  });

  const scores = sentences.map((sentence, idx) => {
    const sWords = sentence.toLowerCase().split(/[^a-z]+/);
    let score = 0;

    sWords.forEach((w) => {
      if (wordFreq[w]) score += wordFreq[w];
    });

    const normalizedLen = sWords.length / 30;
    score *= Math.min(normalizedLen, 1.2);

    if (idx === 0) score *= 1.3;
    if (idx === 1) score *= 1.15;
    if (idx === sentences.length - 1) score *= 1.2;
    if (idx === sentences.length - 2) score *= 1.1;

    const hasNumbers = /\d/.test(sentence);
    if (hasNumbers) score *= 1.1;

    const hasKeyPhrases = /\b(in conclusion|therefore|however|importantly|significant|key|main|primary|crucial|essential)\b/i.test(sentence);
    if (hasKeyPhrases) score *= 1.25;

    return { sentence, idx, score };
  });

  scores.sort((a, b) => b.score - a.score);
  const selected = scores.slice(0, maxSentences);
  selected.sort((a, b) => a.idx - b.idx);

  const summary = selected.map((s) => s.sentence).join(" ");

  return {
    summary,
    stats: {
      totalSentences: sentences.length,
      selectedSentences: selected.length,
      originalWords: text.split(/\s+/).filter((w) => w).length,
      summaryWords: summary.split(/\s+/).filter((w) => w).length,
    },
  };
}

export default function SummaryBot({ agent }) {
  const [text, setText] = useState("");
  const [length, setLength] = useState("medium");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSummarize() {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 600));

    const maxSent = lengths.find((l) => l.value === length)?.maxSentences || 4;
    const output = extractiveSummary(text, maxSent);
    setResult(output);
    setLoading(false);
  }

  const originalWords = text.trim()
    ? text.trim().split(/\s+/).filter((w) => w).length
    : 0;
  const summaryWords = result?.summary
    ? result.summary.split(/\s+/).filter((w) => w).length
    : 0;
  const reduction =
    originalWords > 0 && summaryWords > 0
      ? Math.round((1 - summaryWords / originalWords) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Document / Article Text
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your article, paper, or document here..."
          rows={6}
          className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none"
        />
        {originalWords > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            {originalWords} words | {text.length} characters
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Summary Length
        </label>
        <div className="grid grid-cols-3 gap-3">
          {lengths.map((l) => (
            <button
              key={l.value}
              onClick={() => setLength(l.value)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                length === l.value
                  ? "bg-teal-600 text-white border border-teal-500"
                  : "bg-black/30 text-gray-400 border border-white/10 hover:bg-white/10"
              }`}
            >
              <div className="text-lg mb-1">{l.emoji}</div>
              <div className="font-medium">{l.label}</div>
              <div className="text-xs opacity-70">{l.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSummarize}
        disabled={loading || !text.trim()}
        className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Summarizing...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Summarize
          </>
        )}
      </button>

      {result && (
        <div className="animate-fadeInUp bg-black/30 border border-teal-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-teal-400 uppercase tracking-wider">
              Summary ({length})
            </h3>
            {reduction > 0 && (
              <span className="text-xs text-teal-400 bg-teal-500/10 px-2 py-1 rounded-full">
                {reduction}% reduction
              </span>
            )}
          </div>
          <div className="text-gray-200 leading-relaxed">
            {result.summary}
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase">Original</p>
              <p className="text-sm font-semibold text-white">
                {result.stats.originalWords} words
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase">Summary</p>
              <p className="text-sm font-semibold text-teal-400">
                {result.stats.summaryWords} words
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase">Sentences</p>
              <p className="text-sm font-semibold text-white">
                {result.stats.selectedSentences}/{result.stats.totalSentences}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
