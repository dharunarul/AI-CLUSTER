"use client";

import { useState } from "react";

const styles = [
  { id: "realistic", label: "Realistic", prefix: "photorealistic, highly detailed, 8k" },
  { id: "artistic", label: "Artistic", prefix: "artistic painting, beautiful brush strokes, gallery quality" },
  { id: "cartoon", label: "Cartoon", prefix: "cartoon style, vibrant colors, clean lines, animated" },
  { id: "cyberpunk", label: "Cyberpunk", prefix: "cyberpunk aesthetic, neon lights, futuristic, dark atmosphere" },
  { id: "fantasy", label: "Fantasy", prefix: "fantasy art, magical, ethereal glow, epic" },
  { id: "oil", label: "Oil Painting", prefix: "oil painting, classical art, textured canvas, masterwork" },
];

export default function ImageCraft({ agent }) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [history, setHistory] = useState([]);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setImageUrl(null);

    const stylePrefix = styles.find((s) => s.id === style)?.prefix || "";
    const fullPrompt = `${stylePrefix}, ${prompt.trim()}`;
    setCurrentPrompt(fullPrompt);

    const seed = Math.floor(Math.random() * 999999);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=512&height=512&seed=${seed}&nologo=true`;

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
        setTimeout(() => reject(new Error("Image generation timed out")), 30000);
      });

      setImageUrl(url);
      setHistory((prev) => [
        { url, prompt: prompt.trim(), style, seed },
        ...prev.slice(0, 5),
      ]);
    } catch (err) {
      setError("Image generation failed. Please try again with a different prompt.");
    } finally {
      setLoading(false);
    }
  }

  function loadFromHistory(item) {
    setImageUrl(item.url);
    setPrompt(item.prompt);
    setStyle(item.style);
    setCurrentPrompt(`${styles.find((s) => s.id === item.style)?.prefix || ""}, ${item.prompt}`);
  }

  function handleDownload() {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `imagecraft-${Date.now()}.png`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Image Description
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to create..."
            rows={3}
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
          />
          {prompt.trim() && (
            <p className="text-xs text-gray-500 mt-1">{prompt.length} characters</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Art Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {styles.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  style === s.id
                    ? "bg-blue-600 text-white border border-blue-500"
                    : "bg-black/30 text-gray-400 border border-white/10 hover:bg-white/10"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating Image...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Generate Image
          </>
        )}
      </button>

      {loading && (
        <div className="bg-black/30 border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 mb-4">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-blue-600/20 animate-pulse" />
            <div className="absolute inset-2 rounded-lg border-2 border-dashed border-blue-500/30 animate-spin" style={{ animationDuration: "3s" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-blue-400 animate-pulse">
            AI is creating your image...
          </p>
          <p className="text-xs text-gray-500 mt-1">This may take 10-20 seconds</p>
        </div>
      )}

      {imageUrl && !loading && (
        <div className="animate-fadeInUp">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
              Generated Image
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Style: {styles.find((s) => s.id === style)?.label}</span>
              <button
                onClick={handleDownload}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                title="Download image"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-white/10 bg-black/30">
            <img
              src={imageUrl}
              alt={currentPrompt}
              className="w-full h-auto max-h-[512px] object-contain"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center italic">
            {currentPrompt}
          </p>
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-black/30 border border-white/10 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Recent Generations
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {history.map((item, i) => (
              <button
                key={i}
                onClick={() => loadFromHistory(item)}
                className="aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-blue-500/50 transition-colors bg-black/30"
              >
                <img
                  src={item.url}
                  alt={item.prompt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
