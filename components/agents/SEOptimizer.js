"use client";

import { useState } from "react";

function analyzeSEO(content) {
  const text = content.trim();
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;

  const syllableCount = (word) => {
    word = word.toLowerCase().replace(/[^a-z]/g, "");
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
    word = word.replace(/^y/, "");
    const m = word.match(/[aeiouy]{1,2}/g);
    return m ? m.length : 1;
  };

  const totalSyllables = words.reduce((s, w) => s + syllableCount(w), 0);
  const avgSyllablesPerWord = totalSyllables / (words.length || 1);
  const avgWordsPerSentence = words.length / (sentences.length || 1);

  const fleschReading =
    206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
  const fleschKincaid =
    0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;

  const readingGrade = Math.max(1, Math.round(fleschKincaid));
  const readingScore = Math.max(0, Math.min(100, Math.round(fleschReading)));

  let readingLevel;
  if (readingScore >= 80) readingLevel = "Easy (5th-6th grade)";
  else if (readingScore >= 60) readingLevel = "Standard (7th-8th grade)";
  else if (readingScore >= 40) readingLevel = "Difficult (9th-12th grade)";
  else if (readingScore >= 20) readingLevel = "Very Difficult (College level)";
  else readingLevel = "Extremely Difficult (Graduate level)";

  const h1 = (text.match(/^#\s+.+$/gm) || []).length;
  const h2 = (text.match(/^##\s+.+$/gm) || []).length;
  const h3 = (text.match(/^###\s+.+$/gm) || []).length;
  const htmlHeadings = (text.match(/<h[1-6][^>]*>/gi) || []).length;
  const totalHeadings = h1 + h2 + h3 + htmlHeadings;

  const links = (text.match(/https?:\/\/[^\s]+/g) || []).length;
  const internalLinks = (text.match(/\]\(\//g) || []).length;
  const boldText = (text.match(/\*\*[^*]+\*\*/g) || []).length;
  const italicText = (text.match(/\*[^*]+\*/g) || []).length;
  const images = (text.match(/!\[.*?\]\(.*?\)/g) || []).length;
  const htmlImages = (text.match(/<img\s+/gi) || []).length;
  const totalImages = images + htmlImages;

  const wordFreq = {};
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "was", "are", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "shall", "can", "this", "that",
    "these", "those", "it", "its", "not", "no", "so", "if", "then",
    "than", "too", "very", "just", "about", "also", "as", "up", "out",
    "all", "each", "every", "both", "few", "more", "most", "other",
    "some", "such", "only", "own", "same", "they", "he", "she", "we",
    "you", "i", "me", "my", "your", "his", "her", "our", "their",
  ]);

  words.forEach((w) => {
    const clean = w.toLowerCase().replace(/[^a-z]/g, "");
    if (clean.length > 2 && !stopWords.has(clean)) {
      wordFreq[clean] = (wordFreq[clean] || 0) + 1;
    }
  });

  const topKeywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({
      word,
      count,
      density: ((count / words.length) * 100).toFixed(2),
    }));

  const avgSentenceLength = words.length / (sentences.length || 1);
  const longSentences = sentences.filter(
    (s) => s.trim().split(/\s+/).length > 25
  ).length;
  const shortSentences = sentences.filter(
    (s) => s.trim().split(/\s+/).length < 5
  ).length;

  const shortParagraphs = paragraphs.filter(
    (p) => p.trim().split(/\s+/).length < 30
  ).length;
  const longParagraphs = paragraphs.filter(
    (p) => p.trim().split(/\s+/).length > 150
  ).length;

  const suggestions = [];
  let score = 50;

  if (chars < 300) {
    suggestions.push({
      text: "Content is too short. Aim for at least 300+ words for better SEO.",
      severity: "high",
      impact: 15,
    });
  } else if (chars < 1000) {
    suggestions.push({
      text: "Content could be longer. 1000+ words typically rank better.",
      severity: "medium",
      impact: 8,
    });
  } else {
    score += 10;
  }

  if (totalHeadings === 0) {
    suggestions.push({
      text: "No headings found. Add H1, H2, H3 headings to structure your content.",
      severity: "high",
      impact: 12,
    });
  } else if (totalHeadings < 2) {
    suggestions.push({
      text: "Add more headings to improve content structure. Aim for 3+ subheadings.",
      severity: "medium",
      impact: 6,
    });
  } else {
    score += 10;
  }

  if (topKeywords.length === 0) {
    suggestions.push({
      text: "No significant keywords detected. Use relevant keywords naturally in your text.",
      severity: "high",
      impact: 12,
    });
  } else {
    const maxDensity = parseFloat(topKeywords[0].density);
    if (maxDensity > 3) {
      suggestions.push({
        text: `Keyword "${topKeywords[0].word}" may be overused (${maxDensity}% density). Reduce to 1-2%.`,
        severity: "medium",
        impact: 5,
      });
    } else if (maxDensity < 0.5) {
      suggestions.push({
        text: `Top keyword "${topKeywords[0].word}" has low density (${maxDensity}%). Use it more frequently.`,
        severity: "medium",
        impact: 5,
      });
    } else {
      score += 10;
    }
  }

  if (avgSentenceLength > 25) {
    suggestions.push({
      text: `Average sentence length is ${avgSentenceLength.toFixed(0)} words. Keep sentences under 20 words for readability.`,
      severity: "medium",
      impact: 8,
    });
  } else {
    score += 5;
  }

  if (longSentences > 0) {
    suggestions.push({
      text: `${longSentences} sentence(s) exceed 25 words. Break them into shorter sentences.`,
      severity: "medium",
      impact: 5,
    });
  }

  if (links === 0) {
    suggestions.push({
      text: "No links found. Add internal and external links to improve SEO.",
      severity: "high",
      impact: 10,
    });
  } else if (links < 2) {
    suggestions.push({
      text: "Only 1 link found. Add more internal/external links (aim for 3+).",
      severity: "medium",
      impact: 4,
    });
  } else {
    score += 8;
  }

  if (totalImages === 0) {
    suggestions.push({
      text: "No images found. Add relevant images with descriptive alt text.",
      severity: "medium",
      impact: 6,
    });
  } else {
    score += 5;
  }

  if (boldText === 0) {
    suggestions.push({
      text: "No bold text found. Use bold to highlight key phrases.",
      severity: "low",
      impact: 3,
    });
  } else {
    score += 2;
  }

  if (longParagraphs > 0) {
    suggestions.push({
      text: `${longParagraphs} paragraph(s) are very long (150+ words). Break them into smaller chunks.`,
      severity: "medium",
      impact: 5,
    });
  }

  if (readingScore < 30) {
    suggestions.push({
      text: `Reading level is very difficult (grade ${readingGrade}). Simplify your language for broader audience.`,
      severity: "high",
      impact: 8,
    });
  } else if (readingScore < 50) {
    suggestions.push({
      text: `Reading level is moderately difficult (grade ${readingGrade}). Try shorter sentences and simpler words.`,
      severity: "medium",
      impact: 5,
    });
  } else {
    score += 8;
  }

  score = Math.max(5, Math.min(98, score + (chars > 500 ? 5 : 0) + (topKeywords.length >= 3 ? 5 : 0)));

  return {
    score,
    stats: {
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      characters: chars,
      charactersNoSpaces,
      avgWordsPerSentence: avgWordsPerSentence.toFixed(1),
      avgSentenceLength: avgSentenceLength.toFixed(1),
      readingScore,
      readingGrade,
      readingLevel,
      headings: totalHeadings,
      links,
      images: totalImages,
    },
    keywords: topKeywords,
    suggestions,
  };
}

export default function SEOptimizer({ agent }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleAnalyze() {
    if (!content.trim()) return;
    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 600));

    const analysis = analyzeSEO(content);
    setResult(analysis);
    setLoading(false);
  }

  function getScoreColor(s) {
    if (s >= 80) return "text-green-400";
    if (s >= 60) return "text-yellow-400";
    if (s >= 40) return "text-orange-400";
    return "text-red-400";
  }

  function getScoreRing(s) {
    if (s >= 80) return "stroke-green-500";
    if (s >= 60) return "stroke-yellow-500";
    if (s >= 40) return "stroke-orange-500";
    return "stroke-red-500";
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Content to Analyze
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your website content, article, or page text here for SEO analysis..."
          rows={6}
          className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500/50 resize-none"
        />
        {content.trim() && (
          <p className="text-xs text-gray-500 mt-1">
            {content.split(/\s+/).filter((w) => w).length} words | {content.length} characters
          </p>
        )}
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading || !content.trim()}
        className="px-6 py-3 bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-500 hover:to-green-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Analyzing...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Analyze SEO
          </>
        )}
      </button>

      {result && (
        <div className="animate-fadeInUp space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/30 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center">
              <h3 className="text-sm font-semibold text-lime-400 uppercase tracking-wider mb-4">
                SEO Score
              </h3>
              <div className="relative w-36 h-36 mb-3">
                <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/10" />
                  <circle
                    cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3"
                    className={getScoreRing(result.score)}
                    strokeDasharray={`${result.score * 0.97} 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-400 text-center">
                {result.score >= 80
                  ? "Excellent! Your content is well optimized."
                  : result.score >= 60
                  ? "Good, but there is room for improvement."
                  : result.score >= 40
                  ? "Fair. Several areas need attention."
                  : "Needs significant optimization."}
              </p>
            </div>

            <div className="bg-black/30 border border-white/10 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-lime-400 uppercase tracking-wider mb-4">
                Content Statistics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Words", result.stats.words],
                  ["Sentences", result.stats.sentences],
                  ["Paragraphs", result.stats.paragraphs],
                  ["Characters", result.stats.characters],
                  ["Avg Words/Sentence", result.stats.avgWordsPerSentence],
                  ["Readability", `${result.stats.readingScore}/100`],
                  ["Reading Level", result.stats.readingLevel],
                  ["Grade Level", `Grade ${result.stats.readingGrade}`],
                  ["Headings", result.stats.headings],
                  ["Links", result.stats.links],
                  ["Images", result.stats.images],
                ].map(([label, val]) => (
                  <div key={label} className="bg-white/5 rounded-lg p-2.5">
                    <p className="text-[10px] text-gray-500 uppercase">{label}</p>
                    <p className="text-sm font-semibold text-white truncate">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {result.keywords.length > 0 && (
            <div className="bg-black/30 border border-white/10 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-lime-400 uppercase tracking-wider mb-4">
                Top Keywords
              </h3>
              <div className="space-y-2">
                {result.keywords.map((kw) => (
                  <div key={kw.word} className="flex items-center gap-3">
                    <span className="text-sm text-white font-mono w-32 truncate">{kw.word}</span>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-lime-500 to-green-500 rounded-full"
                        style={{ width: `${Math.min(kw.count * 8, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-16 text-right">
                      {kw.count} ({kw.density}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-black/30 border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-lime-400 uppercase tracking-wider mb-4">
              Suggestions ({result.suggestions.length})
            </h3>
            <ul className="space-y-3">
              {result.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span
                    className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                      s.severity === "high"
                        ? "bg-red-400"
                        : s.severity === "medium"
                        ? "bg-yellow-400"
                        : "bg-blue-400"
                    }`}
                  />
                  <div className="flex-1">
                    <span className="text-gray-300">{s.text}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded shrink-0 ${
                      s.severity === "high"
                        ? "bg-red-500/20 text-red-400"
                        : s.severity === "medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {s.severity}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
