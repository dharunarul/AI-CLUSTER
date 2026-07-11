"use client";

import { useState } from "react";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "nl", name: "Dutch" },
  { code: "sv", name: "Swedish" },
  { code: "pl", name: "Polish" },
  { code: "tr", name: "Turkish" },
  { code: "vi", name: "Vietnamese" },
  { code: "th", name: "Thai" },
  { code: "el", name: "Greek" },
  { code: "cs", name: "Czech" },
];

async function translateText(text, from, to) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Translation API failed");
  const data = await res.json();
  if (data.responseStatus === 200 && data.responseData?.translatedText) {
    return data.responseData.translatedText;
  }
  throw new Error(data.responseDetails || "Translation failed");
}

export default function TranslatePro({ agent }) {
  const [sourceText, setSourceText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [translated, setTranslated] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  function swapLanguages() {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translated);
    setTranslated(sourceText);
  }

  async function handleTranslate() {
    if (!sourceText.trim()) return;
    setLoading(true);
    setTranslated("");
    setError("");

    try {
      const result = await translateText(sourceText, sourceLang, targetLang);
      setTranslated(result);
      setHistory((prev) => [
        {
          source: sourceText.slice(0, 60) + (sourceText.length > 60 ? "..." : ""),
          result: result.slice(0, 60) + (result.length > 60 ? "..." : ""),
          from: sourceLang,
          to: targetLang,
        },
        ...prev.slice(0, 9),
      ]);
    } catch (err) {
      setError(err.message || "Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function getLangName(code) {
    return languages.find((l) => l.code === code)?.name || code;
  }

  const wordCount = sourceText.trim()
    ? sourceText.trim().split(/\s+/).length
    : 0;
  const charCount = sourceText.length;

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">From</label>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={swapLanguages}
          className="mt-5 p-2.5 rounded-lg bg-black/30 border border-white/10 hover:bg-white/10 hover:border-rose-500/30 transition-all"
          title="Swap languages"
        >
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
        </button>

        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">To</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Source Text
          </label>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text to translate..."
            rows={5}
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
          />
          {sourceText.trim() && (
            <div className="flex items-center gap-3 mt-1">
              <p className="text-xs text-gray-500">
                {wordCount} words | {charCount} chars
              </p>
              <p className="text-xs text-gray-500">
                {getLangName(sourceLang)} → {getLangName(targetLang)}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Translation
          </label>
          <div className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl min-h-[140px] text-white relative">
            {loading ? (
              <div className="flex items-center gap-3 h-full">
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                <span className="text-sm text-gray-500 ml-2">Translating...</span>
              </div>
            ) : translated ? (
              <div>
                <p className="text-gray-200 leading-relaxed">{translated}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(translated)}
                  className="mt-3 text-xs text-gray-500 hover:text-rose-400 transition-colors flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy translation
                </button>
              </div>
            ) : (
              <p className="text-gray-500">Translation will appear here...</p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleTranslate}
        disabled={loading || !sourceText.trim()}
        className="px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Translating...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m0 4h6m-6 4h8m-8 4h4M5 3l-2 2m0 0l2 2M3 5h2m10 10l2 2m0 0l-2 2m2-2h-2" />
            </svg>
            Translate
          </>
        )}
      </button>

      {history.length > 0 && (
        <div className="bg-black/30 border border-white/10 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Recent Translations
          </h3>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5"
              >
                <span className="text-xs text-gray-500 font-mono uppercase w-8 shrink-0">
                  {h.from}
                </span>
                <span className="text-xs text-gray-400 truncate flex-1">
                  {h.source}
                </span>
                <svg className="w-4 h-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span className="text-xs text-gray-500 font-mono uppercase w-8 shrink-0">
                  {h.to}
                </span>
                <span className="text-xs text-rose-400 truncate flex-1">
                  {h.result}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
