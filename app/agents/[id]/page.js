"use client";

import { useParams, useRouter } from "next/navigation";
import { agents } from "@/data/agents";
import Navbar from "@/components/Navbar";
import ErrorBoundary from "@/components/ErrorBoundary";
import TextGPT from "@/components/agents/TextGPT";
import ImageCraft from "@/components/agents/ImageCraft";
import CodeWizard from "@/components/agents/CodeWizard";
import DataAnalyzer from "@/components/agents/DataAnalyzer";
import TranslatePro from "@/components/agents/TranslatePro";
import VoiceSynth from "@/components/agents/VoiceSynth";
import SummaryBot from "@/components/agents/SummaryBot";
import ChatMate from "@/components/agents/ChatMate";
import SEOptimizer from "@/components/agents/SEOptimizer";
import MathSolver from "@/components/agents/MathSolver";

const componentMap = {
  TextGPT,
  ImageCraft,
  CodeWizard,
  DataAnalyzer,
  TranslatePro,
  VoiceSynth,
  SummaryBot,
  ChatMate,
  SEOptimizer,
  MathSolver,
};

export default function AgentPage() {
  const params = useParams();
  const router = useRouter();
  const agent = agents.find((a) => a.id === Number(params.id));

  if (!agent) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🤖</p>
          <h2 className="text-2xl font-bold text-white mb-2">Agent Not Found</h2>
          <p className="text-gray-400 mb-6">
            The agent you are looking for does not exist.
          </p>
          <button
            onClick={() => router.push("/home")}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const AgentComponent = componentMap[agent.component];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push("/home")}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{agent.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
              <p className="text-sm text-gray-400">{agent.tagline}</p>
            </div>
          </div>
        </div>

        <div
          className={`rounded-2xl border ${agent.borderColor} ${agent.bgGradient} p-6 sm:p-8`}
        >
          <ErrorBoundary>
            <AgentComponent agent={agent} />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
