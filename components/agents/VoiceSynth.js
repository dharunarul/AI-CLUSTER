"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const voiceStyles = [
  { id: "male", name: "Male Voice", emoji: "👨", pitch: 0.8, rate: 1.0 },
  { id: "female", name: "Female Voice", emoji: "👩", pitch: 1.3, rate: 1.0 },
  { id: "robotic", name: "Robotic", emoji: "🤖", pitch: 0.1, rate: 1.3 },
  { id: "british", name: "British Accent", emoji: "🎩", pitch: 1.0, rate: 0.9 },
  { id: "soothing", name: "Soothing", emoji: "🧘", pitch: 0.85, rate: 0.75 },
  { id: "dramatic", name: "Dramatic", emoji: "🎭", pitch: 1.4, rate: 0.8 },
];

export default function VoiceSynth({ agent }) {
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("male");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [progress, setProgress] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [voices, setVoices] = useState([]);
  const [error, setError] = useState("");

  const utteranceRef = useRef(null);
  const progressInterval = useRef(null);
  const startTimeRef = useRef(0);
  const pausedAtRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    if (!synth) return;

    function loadVoices() {
      const available = synth.getVoices();
      setVoices(available);
    }

    loadVoices();
    synth.onvoiceschanged = loadVoices;
    return () => {
      synth.cancel();
      synth.onvoiceschanged = null;
    };
  }, []);

  const getVoiceForStyle = useCallback(
    (styleId) => {
      const style = voiceStyles.find((v) => v.id === styleId);
      const englishVoices = voices.filter(
        (v) => v.lang.startsWith("en") && !v.localService
      );
      const localVoices = voices.filter(
        (v) => v.lang.startsWith("en") && v.localService
      );
      const allEnglish = [...englishVoices, ...localVoices];

      let targetVoice = null;

      if (styleId === "british") {
        targetVoice = allEnglish.find(
          (v) =>
            v.lang.includes("GB") ||
            v.name.toLowerCase().includes("british") ||
            v.name.toLowerCase().includes("uk")
        );
        if (!targetVoice) targetVoice = allEnglish[0];
      } else if (styleId === "female") {
        targetVoice = allEnglish.find(
          (v) =>
            v.name.toLowerCase().includes("female") ||
            v.name.toLowerCase().includes("samantha") ||
            v.name.toLowerCase().includes("zira") ||
            v.name.toLowerCase().includes("karen") ||
            v.name.toLowerCase().includes("moira")
        );
        if (!targetVoice) targetVoice = allEnglish[1] || allEnglish[0];
      } else if (styleId === "male") {
        targetVoice = allEnglish.find(
          (v) =>
            v.name.toLowerCase().includes("male") ||
            v.name.toLowerCase().includes("david") ||
            v.name.toLowerCase().includes("mark") ||
            v.name.toLowerCase().includes("daniel")
        );
        if (!targetVoice) targetVoice = allEnglish[0];
      } else {
        targetVoice = allEnglish[0];
      }

      if (!targetVoice && voices.length > 0) {
        targetVoice = voices.find((v) => v.lang.startsWith("en")) || voices[0];
      }

      return { voice: targetVoice, style };
    },
    [voices]
  );

  function startProgressTracking() {
    startTimeRef.current = Date.now();
    pausedAtRef.current = 0;
    setProgress(0);

    progressInterval.current = setInterval(() => {
      if (utteranceRef.current) {
        const elapsed = Date.now() - startTimeRef.current;
        const totalDuration = utteranceRef.current.text.length * 60 / (speed * 150);
        const pct = Math.min((elapsed / (totalDuration * 1000)) * 100, 99);
        setProgress(pct);
      }
    }, 100);
  }

  function stopProgressTracking() {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  }

  function handlePlay() {
    if (!text.trim()) return;
    if (typeof window === "undefined") return;

    const synth = window.speechSynthesis;
    if (!synth) {
      setError("Speech synthesis not supported in this browser.");
      return;
    }

    setError("");
    setLoading(true);
    synth.cancel();

    const { voice, style } = getVoiceForStyle(selectedVoice);
    const utterance = new SpeechSynthesisUtterance(text);

    if (voice) utterance.voice = voice;
    utterance.pitch = style.pitch;
    utterance.rate = speed * style.rate;
    utterance.volume = 1;

    utterance.onstart = () => {
      setLoading(false);
      setIsPlaying(true);
      setIsPaused(false);
      setCharIndex(0);
      startProgressTracking();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      setCharIndex(text.length);
      stopProgressTracking();
      setTimeout(() => setProgress(0), 1500);
    };

    utterance.onerror = (e) => {
      if (e.error !== "canceled") {
        setError("Speech failed. Try a different browser or shorter text.");
      }
      setIsPlaying(false);
      setIsPaused(false);
      setLoading(false);
      stopProgressTracking();
    };

    utterance.onboundary = (e) => {
      setCharIndex(e.charIndex);
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
  }

  function handlePause() {
    const synth = window.speechSynthesis;
    if (synth && isPlaying) {
      synth.pause();
      setIsPaused(true);
      pausedAtRef.current = Date.now();
      stopProgressTracking();
    }
  }

  function handleResume() {
    const synth = window.speechSynthesis;
    if (synth && isPaused) {
      synth.resume();
      setIsPaused(false);
      startTimeRef.current += Date.now() - pausedAtRef.current;
      startProgressTracking();
    }
  }

  function handleStop() {
    const synth = window.speechSynthesis;
    if (synth) {
      synth.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    setCharIndex(0);
    stopProgressTracking();
  }

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      stopProgressTracking();
    };
  }, []);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const estimatedDuration = charCount > 0
    ? Math.ceil((charCount / (speed * 150)) * 60)
    : 0;

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Text to Speak
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the text you want to convert to speech..."
          rows={4}
          className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
        />
        {text.trim() && (
          <div className="flex items-center gap-4 mt-1">
            <p className="text-xs text-gray-500">
              {wordCount} words | {charCount} chars
            </p>
            <p className="text-xs text-gray-500">
              ~{estimatedDuration}s estimated
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Voice Style
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {voiceStyles.map((voice) => (
            <button
              key={voice.id}
              onClick={() => setSelectedVoice(voice.id)}
              className={`px-3 py-3 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                selectedVoice === voice.id
                  ? "bg-indigo-600 text-white border border-indigo-500"
                  : "bg-black/30 text-gray-400 border border-white/10 hover:bg-white/10"
              }`}
            >
              <span className="text-lg">{voice.emoji}</span>
              <span className="text-xs">{voice.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-300">
            Speed
          </label>
          <span className="text-xs text-indigo-400 font-mono">{speed.toFixed(1)}x</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.5x Slow</span>
          <span>2.0x Fast</span>
        </div>
      </div>

      <div className="bg-black/30 border border-white/10 rounded-xl p-6">
        {/* Waveform visualization */}
        <div className="flex items-center justify-center gap-[3px] h-20 mb-4">
          {Array.from({ length: 50 }).map((_, i) => {
            const isActive = isPlaying && !isPaused;
            const isHighlighted =
              charIndex > 0 && Math.abs(i - (charIndex / charCount) * 50) < 3;
            return (
              <div
                key={i}
                className="w-[3px] rounded-full transition-all duration-150"
                style={{
                  height: isActive
                    ? `${Math.sin(i * 0.4 + (progress * 0.1)) * 18 + 22}px`
                    : isHighlighted
                    ? "28px"
                    : "6px",
                  backgroundColor: isActive
                    ? isHighlighted
                      ? "#818cf8"
                      : `hsl(${230 + i * 2}, 70%, ${50 + Math.sin(i * 0.3 + progress * 0.05) * 20}%)`
                    : "rgba(255,255,255,0.1)",
                  animation: isActive
                    ? `waveform-bar 0.4s ease-in-out ${i * 0.03}s infinite alternate`
                    : "none",
                }}
              />
            );
          })}
        </div>

        {/* Progress bar */}
        {progress > 0 && (
          <div className="w-full h-1.5 bg-white/10 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {!isPlaying && !isPaused ? (
            <button
              onClick={handlePlay}
              disabled={loading || !text.trim()}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-lg shadow-indigo-500/20"
            >
              {loading ? (
                <svg
                  className="animate-spin h-7 w-7 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-7 h-7 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={isPaused ? handleResume : handlePause}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all"
              >
                {isPaused ? (
                  <svg
                    className="w-5 h-5 text-white ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 6h4v12H6zm8 0h4v12h-4z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleStop}
                className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-all"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 6h12v12H6z" />
                </svg>
              </button>
            </>
          )}
        </div>

        {isPlaying && (
          <p className="text-center text-sm text-indigo-400 mt-4 animate-pulse">
            Speaking with {voiceStyles.find((v) => v.id === selectedVoice)?.name}
            {speed !== 1.0 && ` at ${speed}x speed`}...
          </p>
        )}
        {isPaused && (
          <p className="text-center text-sm text-yellow-400 mt-4">
            Paused
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes waveform-bar {
          0% { transform: scaleY(0.6); }
          100% { transform: scaleY(1.2); }
        }
      `}</style>
    </div>
  );
}
