"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const images = ["/images/img2.webp", "/images/tifo.webp", "/images/bg1.jpeg"];

const Hero = () => {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const advance = useCallback(() => {
    setIndex((prev) => {
      setPrevIndex(prev);
      return (prev + 1) % images.length;
    });
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(advance, 6000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [advance]);

  return (
    <section
      id="Hero"
      className="relative w-full min-h-screen overflow-hidden bg-[#1a1f3c] pt-[6rem] sm:pt-[7rem] md:pt-[8rem] lg:pt-[9rem] flex items-center"
    >
      {/* ── Slideshow: opacity-only cross-fade, NO scale ── */}
      {/* Scale on a full-screen image triggers huge GPU re-rasterization every frame */}
      <div className="absolute inset-0" style={{ contain: "strict" }}>

        {/* Previous image — fades out via CSS */}
        {prevIndex !== null && (
          <img
            key={`prev-${images[prevIndex]}`}
            src={images[prevIndex]}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center hero-slide-out"
            style={{ willChange: "opacity" }}
            fetchPriority="low"
            decoding="async"
          />
        )}

        {/* Current image — fades in via CSS */}
        <img
          key={`cur-${images[index]}`}
          src={images[index]}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover object-center hero-slide-in"
          style={{ willChange: "opacity" }}
          fetchPriority={index === 0 ? "high" : "auto"}
          decoding="async"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f3c]/85 via-[#1a1f3c]/75 to-[#1a1f3c]/90 pointer-events-none" />
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => { setPrevIndex(index); setIndex(i); }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === index ? "bg-[#dd3913] w-6" : "bg-white/40"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">

          {/* Left — Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 lg:space-y-8 text-center lg:text-left"
          >
            <div className="px-4 py-2 sm:px-6 sm:py-3 bg-[#dd3913] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider transform -skew-x-12 shadow-lg inline-block">
              Official Supporters of Malappuram FC
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-[Montserrat] font-extrabold text-white leading-tight">
              <span className="block">ULTRAS</span>
              <span className="block text-[#dd3913] transform -skew-x-6">
                MALAPPURAM
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed font-[Montserrat]">
              The heartbeat of{" "}
              <span className="text-[#dd3913] font-semibold">Malappuram FC</span>
              . Passion, unity, and unwavering support.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 w-full sm:w-auto items-stretch">
              <Link href="/join" className="flex-1">
                <button className="flex items-center justify-center px-2 sm:px-4 py-4 bg-[#dd3913] hover:bg-[#dd3913]/80 text-white font-semibold text-xs sm:text-sm lg:text-base transition-colors duration-200 shadow-lg w-full h-full border-2 border-[#dd3913]/50 rounded-md whitespace-nowrap hover:scale-[1.03] active:scale-[0.98] transform-gpu">
                  BECOME PRO MEMBER - ULTRAS MALAPPURAM
                </button>
              </Link>

              <button
                onClick={() => document.getElementById("matches")?.scrollIntoView({ behavior: "smooth" })}
                className="flex-1 flex items-center justify-center px-4 py-4 border-2 border-white/50 text-white font-semibold text-xs sm:text-sm lg:text-base transition-colors duration-200 bg-white/10 hover:bg-white/20 w-full h-full rounded-md whitespace-nowrap hover:scale-[1.03] active:scale-[0.98] transform-gpu"
              >
                VIEW MATCHES
              </button>
            </div>
          </motion.div>

          {/* Right — Logo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 flex justify-center items-center"
          >
            <div className="bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-full p-6 sm:p-8 shadow-2xl">
              <img
                src="/images/ultras-logo.png"
                alt="Ultras Malappuram Logo"
                className="w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 object-contain rounded-full"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* CSS-only cross-fade keyframes */}
      <style>{`
        .hero-slide-in  { animation: heroFadeIn  1.4s ease-in-out forwards; }
        .hero-slide-out { animation: heroFadeOut 1.4s ease-in-out forwards; }
        @keyframes heroFadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes heroFadeOut { from { opacity: 1; } to { opacity: 0; } }
      `}</style>
    </section>
  );
};

export default React.memo(Hero);
