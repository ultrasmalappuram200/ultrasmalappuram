"use client";

import React, { useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

export const MEMBERSHIP_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfDl1VjhTXZNgD5Sb4uZ0PFhiQ8qs1j0qwXw3RYkASEoX2IaQ/viewform?usp=header";

const PrivilegeMemberCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Raw motion values
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring-smoothed values — damp rapid mousemove, prevents jank
  const x = useSpring(rawX, { stiffness: 150, damping: 20, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 150, damping: 20, mass: 0.5 });

  const rotateX = useTransform(y, [-100, 100], [12, -12]);
  const rotateY = useTransform(x, [-100, 100], [-12, 12]);

  // requestAnimationFrame throttle — prevents layout thrash on rapid mousemove
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (rafRef.current) return; // skip if frame already queued
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      rawX.set(e.clientX - rect.left - rect.width / 2);
      rawY.set(e.clientY - rect.top - rect.height / 2);
    });
  }, [rawX, rawY]);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  const handleClick = useCallback(() => {
    window.open(MEMBERSHIP_FORM_URL, "_blank");
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative w-full max-w-4xl flex flex-col items-center justify-center"
      style={{ perspective: 900 }}
    >
      <motion.div
        className="w-full max-w-[480px] aspect-[1.586] cursor-pointer group relative z-10"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Apply for Ultras Privilege Membership"
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } }}
      >
        {/* Card base — deep navy metal with a molten orange edge */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl shadow-[0_24px_60px_-12px_rgba(0,0,0,0.75)] overflow-hidden bg-gradient-to-br from-[#20264d] via-[#141833] to-[#0b0e20] border border-white/15 ring-1 ring-[#dd3913]/25">

          {/* Molten sheen from the top-right corner */}
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(120% 90% at 100% 0%, rgba(221,57,19,0.55) 0%, rgba(221,57,19,0.18) 34%, transparent 62%)",
            }}
          />
          {/* Concentric arc engraving — static, no animation cost */}
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(circle at 100% 0%, transparent 40%, rgba(255,255,255,0.45) 41%, rgba(255,255,255,0.45) 42.5%, transparent 43.5%), radial-gradient(circle at 100% 0%, transparent 46%, rgba(255,255,255,0.32) 47%, rgba(255,255,255,0.32) 48.5%, transparent 49.5%), radial-gradient(circle at 100% 0%, transparent 52%, rgba(255,255,255,0.22) 53%, rgba(255,255,255,0.22) 54.5%, transparent 55.5%)",
              backgroundSize: "200% 200%",
              backgroundPosition: "top right",
            }}
          />
          {/* Bottom-left depth shadow */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(90% 80% at 0% 100%, rgba(0,0,0,0.6) 0%, transparent 60%)",
            }}
          />

          {/* Holographic foil sweep — runs on hover only */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-y-[-40%] left-0 w-1/4 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-[140%] group-hover:animate-[foilSweep_1.8s_ease-in-out_infinite]" />
          </div>

          {/* Content layer */}
          <div className="absolute inset-0 p-4 sm:p-6 md:p-7 flex flex-col justify-between pointer-events-none">

            {/* Top row — logo + tier badge */}
            <div className="flex justify-between items-start gap-3" style={{ transform: "translateZ(30px)" }}>
              <img
                src="/images/ultras-logo.png"
                alt="Ultras Malappuram Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain drop-shadow-lg"
                decoding="async"
              />
              <div className="flex flex-col items-end gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-[#dd3913] text-white text-[8px] sm:text-[9px] md:text-[10px] font-[Montserrat] font-extrabold uppercase tracking-[0.18em] shadow-[0_4px_14px_-4px_rgba(221,57,19,0.9)]">
                  Privilege
                </span>
                <span className="text-white/50 text-[7px] sm:text-[8px] md:text-[9px] font-[Montserrat] font-semibold uppercase tracking-[0.22em]">
                  Members Only
                </span>
              </div>
            </div>

            {/* Middle — chip */}
            <div className="flex items-center gap-2.5" style={{ transform: "translateZ(35px)" }}>
              <div className="w-8 h-6 sm:w-9 sm:h-7 md:w-10 md:h-8 rounded-md bg-gradient-to-br from-[#f7d68a] via-[#d8a952] to-[#a8762b] border border-white/25 shadow-inner relative overflow-hidden">
                <div className="absolute inset-x-0 top-1/2 h-px bg-black/25" />
                <div className="absolute inset-y-0 left-1/2 w-px bg-black/25" />
              </div>
              <span className="text-white/35 text-[8px] sm:text-[9px] font-[Montserrat] font-semibold uppercase tracking-[0.3em]">
                Season 2026
              </span>
            </div>

            {/* Bottom — holder */}
            <div className="flex items-end justify-between gap-3" style={{ transform: "translateZ(40px)" }}>
              <div className="flex flex-col justify-end items-start min-w-0">
                <span className="text-[#ff8a63] font-[Montserrat] text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.22em] mb-1">
                  Privilege Member
                </span>
                <span className="text-white font-[Montserrat] text-base sm:text-lg md:text-xl font-extrabold tracking-wider uppercase drop-shadow-md truncate">
                  Your Name Here
                </span>
              </div>
              <span className="text-white/40 font-[Montserrat] text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.18em] whitespace-nowrap shrink-0">
                Ultras MFC
              </span>
            </div>

            {/* Hover overlay — pointer devices only */}
            <div
              className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-3xl bg-[#0b0e20]/45"
              style={{ transform: "translateZ(50px)" }}
            >
              <div className="px-6 py-3 bg-white text-[#dd3913] rounded-full font-[Montserrat] font-bold text-sm tracking-[0.12em] uppercase shadow-xl pointer-events-auto">
                Click to Apply
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(PrivilegeMemberCard);
