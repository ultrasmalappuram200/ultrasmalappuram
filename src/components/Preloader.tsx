"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import crest from "../../public/images/ultras-logo.png";

// Gate on real readiness instead of a fixed wait: MIN keeps the intro from
// flashing past on a warm cache, MAX guarantees we never trap the user behind
// a slow asset.
const MIN_VISIBLE_MS = 600;
const MAX_VISIBLE_MS = 2200;
const FADE_MS = 800;

const TITLE = "ULTRAS MALAPPURAM";

// Lets the hero start its entrance as the intro fades out (see globals.css)
const markReady = () => document.documentElement.setAttribute("data-ready", "");

const PreloaderIntro = () => {
  const [phase, setPhase] = useState<"visible" | "leaving" | "gone">("visible");

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const start = performance.now();
    let done = false;
    let minTimer: ReturnType<typeof setTimeout> | undefined;
    let fadeTimer: ReturnType<typeof setTimeout> | undefined;

    const hide = () => {
      if (done) return;
      done = true;
      setPhase("leaving");
      markReady();
      document.body.style.overflow = "";
      fadeTimer = setTimeout(() => setPhase("gone"), FADE_MS);
    };

    // Page is ready — hide once the minimum display time has elapsed
    const onReady = () => {
      minTimer = setTimeout(hide, Math.max(0, MIN_VISIBLE_MS - (performance.now() - start)));
    };

    if (document.readyState === "complete") onReady();
    else window.addEventListener("load", onReady, { once: true });

    const maxTimer = setTimeout(hide, MAX_VISIBLE_MS);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      clearTimeout(fadeTimer);
      window.removeEventListener("load", onReady);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden
      data-preloader
      className={`fixed inset-0 z-99999 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-800 ease-in-out ${
        phase === "leaving" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Ambient background matching the primary site blue (#1a1f3c) */}
      <div className="absolute inset-0 bg-linear-to-br from-[#1a1f3c] via-[#1a1f3c]/95 to-[#0f132b]" />

      {/* Subtle accent glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(221,57,19,0.05)_0%,transparent_60%)]" />

      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(to right, #dd3913 1px, transparent 1px), linear-gradient(to bottom, #dd3913 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-8 flex size-40 items-center justify-center sm:size-48">
          {/* Outer ring (dashed, slow spin) */}
          <svg className="absolute inset-0 size-full animate-[spin_8s_linear_infinite]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(221,57,19,0.2)" strokeWidth="1" strokeDasharray="4 8" />
          </svg>

          {/* Middle ring (thick, fast spin in reverse) */}
          <svg
            className="absolute inset-2 h-[calc(100%-16px)] w-[calc(100%-16px)] animate-[spin_4s_ease-in-out_infinite_reverse] drop-shadow-[0_0_8px_rgba(221,57,19,0.6)]"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="45" fill="none" stroke="#dd3913" strokeWidth="1.5" strokeDasharray="60 180" strokeLinecap="round" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="#dd3913" strokeWidth="1.5" strokeDasharray="20 220" strokeLinecap="round" strokeDashoffset="120" />
          </svg>

          {/* Inner ring */}
          <svg className="absolute inset-4 h-[calc(100%-32px)] w-[calc(100%-32px)] animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="10 10" />
          </svg>

          {/* Crest: springs in, then beats */}
          <div className="relative z-10 size-20 animate-[intro-logo_1s_cubic-bezier(0.34,1.56,0.64,1)_both] sm:size-24">
            <Image
              src={crest}
              alt=""
              priority
              sizes="96px"
              className="size-full animate-[intro-heartbeat_0.8s_ease-in-out_infinite] object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            />
          </div>
        </div>

        {/* Staggered title */}
        <div className="mb-2 flex overflow-hidden">
          {TITLE.split("").map((char, index) => (
            <span
              key={index}
              style={{ animationDelay: `${index * 22}ms` }}
              className={`animate-[intro-letter_0.35s_ease-out_both] font-[Montserrat] text-2xl font-extrabold uppercase drop-shadow-[0_0_15px_rgba(221,57,19,0.5)] sm:text-4xl md:text-5xl ${
                char === " " ? "w-3 sm:w-4" : ""
              } ${index >= 7 ? "text-[#dd3913]" : "text-white"}`}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Loading indicator */}
        <div className="mt-6 flex animate-[hero-fade_0.4s_0.35s_ease-out_both] flex-col items-center gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-0.5 w-12 overflow-hidden rounded-full bg-white/10 sm:w-20">
              <div className="h-full animate-[intro-sweep_1.2s_linear_infinite] bg-[#dd3913]" />
            </div>
            <span className="animate-[intro-breathe_1.5s_ease-in-out_infinite] font-[Montserrat] text-[10px] font-semibold uppercase tracking-[0.4em] text-gray-300 sm:text-xs">
              Loading Atmosphere
            </span>
            <div className="h-0.5 w-12 overflow-hidden rounded-full bg-white/10 sm:w-20">
              <div className="h-full animate-[intro-sweep_1.2s_linear_infinite_reverse] bg-[#dd3913]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin pages skip the fan intro; decided once, on the first page load
const Preloader = () => {
  const pathname = usePathname();
  const [skipIntro] = useState(() => pathname.startsWith("/admin"));

  useEffect(() => {
    if (skipIntro) markReady();
  }, [skipIntro]);

  return skipIntro ? null : <PreloaderIntro />;
};

export default React.memo(Preloader);
