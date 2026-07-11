"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function generateParticles(count) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 100 + 20;
    items.push({
      id: i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 0.4,
      burstAngle: Math.random() * Math.PI * 2,
      burstDist: Math.random() * 500 + 250,
    });
  }
  return items;
}

export default function SplashPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [phase, setPhase] = useState("init");
  const [redirecting, setRedirecting] = useState(false);
  const [alreadySeen, setAlreadySeen] = useState(false);
  const mounted = useRef(false);
  const particles = useMemo(() => generateParticles(60), []);

  useEffect(() => {
    mounted.current = true;

    const seen = sessionStorage.getItem("aiClusterIntro");
    if (seen) {
      setAlreadySeen(true);
      if (!loading) {
        router.replace(user ? "/home" : "/signin");
      }
      return;
    }

    if (loading) return;

    const sequence = async () => {
      await sleep(100);
      if (!mounted.current) return;
      setPhase("particles");

      await sleep(800);
      if (!mounted.current) return;
      setPhase("logo");

      await sleep(1600);
      if (!mounted.current) return;
      setPhase("burst");

      await sleep(1400);
      if (!mounted.current) return;
      setPhase("done");
      sessionStorage.setItem("aiClusterIntro", "true");
      setRedirecting(true);

      await sleep(600);
      if (!mounted.current) return;
      router.replace(user ? "/home" : "/signin");
    };

    sequence();

    return () => {
      mounted.current = false;
    };
  }, [loading, user, router]);

  if (alreadySeen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden">
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
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/30 via-transparent to-black/30" />

      <div className="absolute inset-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-purple-400/60"
            style={{
              left: "50%",
              top: "50%",
              width: `${p.size}px`,
              height: `${p.size}px`,
              transform: phase === "burst"
                ? `translate(${Math.cos(p.burstAngle) * p.burstDist}px, ${Math.sin(p.burstAngle) * p.burstDist}px)`
                : `translate(${p.x}px, ${p.y}px)`,
              opacity:
                phase === "init" ? 0 :
                phase === "burst" ? 0 :
                0.7,
              transition:
                phase === "burst"
                  ? `all 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${p.delay}s`
                  : `opacity 0.6s ease ${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div
        className="relative z-10 text-center px-4 transition-all duration-1000 w-full max-w-3xl mx-auto"
        style={{
          opacity: phase === "init" ? 0 : 1,
          transform: phase === "init" ? "scale(0.5)" : "scale(1)",
        }}
      >
        <div
          className="text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-5 transition-all duration-1000"
          style={{
            transform: phase === "logo" ? "scale(1)" : "scale(1.3)",
            opacity: phase === "init" ? 0 : 1,
          }}
        >
          ⚡
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-3 sm:mb-4 tracking-tight transition-all duration-1000 leading-tight"
          style={{
            textShadow:
              phase === "burst" || phase === "done"
                ? "0 0 30px rgba(168,85,247,0.9), 0 0 80px rgba(168,85,247,0.5), 0 0 150px rgba(168,85,247,0.3)"
                : "0 0 15px rgba(168,85,247,0.4)",
          }}
        >
          AI CLUSTER
        </h1>

        <p
          className="text-gray-300 text-base sm:text-lg md:text-xl transition-all duration-700 px-2"
          style={{
            opacity: phase === "init" ? 0 : 1,
            transform: phase === "init" ? "translateY(20px)" : "translateY(0)",
          }}
        >
          AI Agent Marketplace
        </p>

        {redirecting && (
          <p className="text-purple-400 text-xs sm:text-sm mt-6 sm:mt-8 animate-pulse">
            Entering the cluster...
          </p>
        )}
      </div>
    </div>
  );
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
