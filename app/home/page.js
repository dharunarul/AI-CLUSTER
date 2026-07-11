"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { agents } from "@/data/agents";
import AgentCard from "@/components/AgentCard";
import Navbar from "@/components/Navbar";

function useCountUp(target, duration, startCounting) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startCounting) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, startCounting]);
  return count;
}

function StatCounter({ value, suffix, label, started }) {
  const count = useCountUp(value, 1800, started);
  return (
    <div className="text-center">
      <p className="text-3xl sm:text-4xl font-bold text-white">
        {count}
        <span className="text-purple-400">{suffix}</span>
      </p>
      <p className="text-xs sm:text-sm text-gray-400 mt-1">{label}</p>
    </div>
  );
}

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  const filtered = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.tagline.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatsIntersection = useCallback((entries) => {
    if (entries[0].isIntersecting) {
      setStatsVisible(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleStatsIntersection, {
      threshold: 0.5,
    });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [handleStatsIntersection]);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/land.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 z-[1] bg-black/75" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-transparent via-transparent to-[#0a0a0f]" />

        <div className="relative z-10 flex-1 flex flex-col pt-16">
          {/* Hero Content */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 pb-8">
            <div className="text-6xl sm:text-7xl md:text-8xl mb-6 animate-fadeInUp">
              &#9889;
            </div>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight tracking-tight animate-fadeInUp"
              style={{ animationDelay: "0.1s", animationFillMode: "both" }}
            >
              AI Agent{" "}
              <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                Marketplace
              </span>
            </h1>
            <p
              className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 px-4 leading-relaxed animate-fadeInUp"
              style={{ animationDelay: "0.2s", animationFillMode: "both" }}
            >
              Choose from our curated collection of AI agents. Each agent is
              designed to excel at specific tasks, from writing code to creating
              art and analyzing data.
            </p>
            <div
              className="flex items-center gap-4 flex-wrap justify-center animate-fadeInUp"
              style={{ animationDelay: "0.3s", animationFillMode: "both" }}
            >
              <a
                href="#agents"
                className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold rounded-xl transition-all text-sm sm:text-base shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              >
                Explore Agents
              </a>
              <a
                href="#"
                className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-medium rounded-xl transition-all text-sm sm:text-base"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Stats Row */}
          <div
            ref={statsRef}
            className="relative z-10 w-full max-w-3xl mx-auto px-4 pb-16 sm:pb-20"
          >
            <div className="flex items-center justify-center gap-12 sm:gap-20 animate-fadeInUp" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
              <StatCounter value={10} suffix="+" label="AI Agents" started={statsVisible} />
              <div className="w-px h-10 bg-white/10" />
              <StatCounter value={50} suffix="K+" label="Users Served" started={statsVisible} />
              <div className="w-px h-10 bg-white/10" />
              <StatCounter value={99} suffix="%" label="Uptime" started={statsVisible} />
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="relative z-10 flex justify-center pb-8 animate-bounce">
            <a href="#agents" className="text-gray-500 hover:text-purple-400 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── Agents Section ── */}
      <section
        id="agents"
        className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16 sm:pt-24 pb-20 sm:pb-28"
      >
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Available Agents
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto">
            Click any agent to start using it. Each agent is specialized for a unique task.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10 sm:mb-12">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agents..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm sm:text-base"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {search && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              {filtered.length} agent{filtered.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filtered.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 sm:py-20">
            <div className="text-5xl mb-4">&#128269;</div>
            <p className="text-gray-400 text-base sm:text-lg mb-1">
              No agents found matching &quot;{search}&quot;
            </p>
            <p className="text-gray-600 text-sm">
              Try a different search term or{" "}
              <button
                onClick={() => setSearch("")}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                clear the search
              </button>
            </p>
          </div>
        )}
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">&#9889;</span>
              <span className="text-sm font-bold text-white">AI CLUSTER</span>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm text-center">
              Built with <span className="text-purple-400">&#9889;</span> &mdash; AI Agent Marketplace
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
