"use client";

import Link from "next/link";

export default function AgentCard({ agent, index = 0 }) {
  return (
    <Link href={`/agents/${agent.id}`}>
      <div
        className={`group relative overflow-hidden rounded-2xl border ${agent.borderColor} ${agent.bgGradient} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer animate-fadeInUp`}
        style={{ animationDelay: `${index * 0.05}s`, animationFillMode: "both" }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full" />

        <div className="relative z-10">
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
            {agent.icon}
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {agent.name}
          </h3>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            {agent.tagline}
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            {agent.description}
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs text-purple-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Launch Agent</span>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
