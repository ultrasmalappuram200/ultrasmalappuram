"use client";

import React, { useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

const ProMemberCard = () => {
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
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSfDl1VjhTXZNgD5Sb4uZ0PFhiQ8qs1j0qwXw3RYkASEoX2IaQ/viewform?usp=header",
      "_blank"
    );
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
      >
        {/* Card base */}
        <div className="absolute inset-0 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden bg-gradient-to-br from-[#a11f0a] via-[#dd3913] to-[#801404] border border-white/10">

          {/* Wave pattern — static, no animation cost */}
          <div
            className="absolute inset-0 opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(circle at 100% 0%, transparent 40%, rgba(255,255,255,0.4) 41%, rgba(255,255,255,0.4) 43%, transparent 44%), radial-gradient(circle at 100% 0%, transparent 46%, rgba(255,255,255,0.3) 47%, rgba(255,255,255,0.3) 49%, transparent 50%), radial-gradient(circle at 100% 0%, transparent 52%, rgba(255,255,255,0.2) 53%, rgba(255,255,255,0.2) 55%, transparent 56%)",
              backgroundSize: "200% 200%",
              backgroundPosition: "top right",
            }}
          />
          <div
            className="absolute inset-0 opacity-20 mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(circle at 0% 100%, transparent 30%, rgba(0,0,0,0.4) 31%, rgba(0,0,0,0.4) 35%, transparent 36%)",
              backgroundSize: "150% 150%",
              backgroundPosition: "bottom left",
            }}
          />

          {/* Content layer */}
          <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">

            {/* Top — Logo */}
            <div className="flex justify-start items-start" style={{ transform: "translateZ(30px)" }}>
              <img
                src="/images/ultras-logo.png"
                alt="Ultras Malappuram Logo"
                className="w-16 h-16 object-contain drop-shadow-lg"
                decoding="async"
              />
            </div>

            {/* Bottom — Text */}
            <div className="flex flex-col justify-end items-start" style={{ transform: "translateZ(40px)" }}>
              <span className="text-white/90 font-[Montserrat] text-sm md:text-base font-medium mb-1">
                Pro Member
              </span>
              <span className="text-white font-[Montserrat] text-lg md:text-xl font-bold tracking-wider uppercase drop-shadow-md">
                YOUR NAME HERE
              </span>
            </div>

            {/* Hover Overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-3xl"
              style={{ transform: "translateZ(50px)" }}
            >
              <div className="px-6 py-3 bg-white text-[#dd3913] rounded-full font-bold tracking-wider shadow-xl pointer-events-auto">
                CLICK TO FILL FORM
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(ProMemberCard);
