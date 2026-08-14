"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Gate on real readiness instead of a fixed wait: MIN keeps the intro from
// flashing past on a warm cache, MAX guarantees we never trap the user behind
// a slow asset.
const MIN_VISIBLE_MS = 600;
const MAX_VISIBLE_MS = 2200;

const Preloader = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const start = performance.now();
    let minTimer: NodeJS.Timeout;

    const hide = () => {
      setShow(false);
      document.body.style.overflow = "";
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
      window.removeEventListener("load", onReady);
      document.body.style.overflow = "";
    };
  }, []);

  // For stagger text animation
  const titleText = "ULTRAS MALAPPURAM";
  const titleChars = titleText.split("");

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Ambient Background matching the primary site blue (#1a1f3c) */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f3c] via-[#1a1f3c]/95 to-[#0f132b] opacity-100" />
          
          {/* Subtle Accent Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(221,57,19,0.05)_0%,transparent_60%)] pointer-events-none" />
          
          {/* Animated Background Grid */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #dd3913 1px, transparent 1px), linear-gradient(to bottom, #dd3913 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10 flex flex-col items-center">
            
            {/* Highly Animated Centerpiece */}
            <div className="relative flex items-center justify-center w-40 h-40 sm:w-48 sm:h-48 mb-8">
              
              {/* Outer HUD Ring (Dashed, Slow Spin) */}
              <svg className="absolute inset-0 w-full h-full animate-[spin_8s_linear_infinite]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(221,57,19,0.2)" strokeWidth="1" strokeDasharray="4 8" />
              </svg>

              {/* Middle HUD Ring (Thick, Fast Spin Reverse) */}
              <svg className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] animate-[spin_4s_ease-in-out_infinite_reverse] drop-shadow-[0_0_8px_rgba(221,57,19,0.6)]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#dd3913" strokeWidth="1.5" strokeDasharray="60 180" strokeLinecap="round" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#dd3913" strokeWidth="1.5" strokeDasharray="20 220" strokeLinecap="round" strokeDashoffset="120" />
              </svg>

              {/* Inner HUD Ring (Pulsing) */}
              <svg className="absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)] animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="10 10" />
              </svg>

              {/* Central Logo with Heartbeat Animation */}
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 1, type: "spring", bounce: 0.5 }}
                className="relative z-10 w-20 h-20 sm:w-24 sm:h-24"
              >
                <motion.img
                  src="/images/ultras-logo.png"
                  alt="Ultras Malappuram"
                  className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }} // Heartbeat pulse
                />
              </motion.div>
            </div>

            {/* Dynamic Staggered Text Reveal */}
            <div className="flex overflow-hidden mb-2">
              {titleChars.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.022, ease: "easeOut" }}
                  className={`font-[Montserrat] text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase drop-shadow-[0_0_15px_rgba(221,57,19,0.5)] ${
                    char === " " ? "w-3 sm:w-4" : ""
                  } ${index >= 7 ? "text-[#dd3913]" : "text-white"}`}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Loading Indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="mt-6 flex flex-col items-center gap-3"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Left Line */}
                <div className="w-12 sm:w-20 h-[2px] bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#dd3913]" 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                
                {/* Glowing Text */}
                <motion.span 
                  className="text-gray-300 text-[10px] sm:text-xs tracking-[0.4em] font-semibold uppercase"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  Loading Atmosphere
                </motion.span>
                
                {/* Right Line */}
                <div className="w-12 sm:w-20 h-[2px] bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#dd3913]" 
                    initial={{ x: "100%" }}
                    animate={{ x: "-100%" }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </div>
            </motion.div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(Preloader);
