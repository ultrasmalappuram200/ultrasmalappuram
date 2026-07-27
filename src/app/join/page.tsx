"use client";

import React from "react";
import ProMemberCard from "@/components/ProMemberCard";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { Ticket, Users, Shirt, Star } from "lucide-react";

// ── Variants defined OUTSIDE component — never re-created on render ──
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.3, ease: "easeOut" as const },
  },
};

const benefits = [
  {
    icon: <Star className="w-5 h-5 sm:w-6 sm:h-6 text-[#dd3913]" />,
    text: "FREE Entry to the First Home Match",
  },
  {
    icon: <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-[#dd3913]" />,
    text: "50% OFF on all remaining Home Match tickets",
  },
  {
    icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#dd3913]" />,
    text: "Bring 1 Friend to every remaining home match at the same 50% discounted ticket price",
  },
  {
    icon: <Shirt className="w-5 h-5 sm:w-6 sm:h-6 text-[#dd3913]" />,
    text: "Official MFC Fan Jersey",
  },
];

export default function JoinPage() {
  return (
    <div className="relative min-h-screen bg-[#1a1f3c] overflow-hidden">

      {/* ── Lightweight CSS-only background — ZERO JS animation cost ── */}
      {/* Replaced: 300 grid cells + 8 rotating shapes + 6 pulse lines (all JS-animated) */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        {/* CSS grid pattern — single div, no DOM bloat */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(221,57,19,1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(221,57,19,1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* 3 subtle CSS diagonal lines — replaces 6 JS-looping lines */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#dd3913]/20 to-transparent origin-left"
            style={{
              width: `${500 + i * 150}px`,
              left: `${10 + i * 25}%`,
              top: `${15 + i * 28}%`,
              transform: `rotate(${-18 + i * 9}deg) scaleX(0)`,
              animation: `decoSweep ${6 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}

        {/* Radial glow accent (no blur filter — uses gradient instead) */}
        <div
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #dd3913 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #dd3913 0%, transparent 70%)" }}
        />
      </div>

      <main className="relative z-10 pt-12 lg:pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" as const }}
          className="mb-8 lg:mb-12"
        >
          <Link href="/">
            <button className="flex items-center text-gray-400 hover:text-white transition-colors duration-300 group">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-3 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </div>
              <span className="font-[Montserrat] font-medium text-sm tracking-widest uppercase">Back to Home</span>
            </button>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">

          {/* Left — Text Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="lg:col-span-7 space-y-6 sm:space-y-8"
          >
            {/* Heading block */}
            <motion.div variants={itemVariants}>
              <div className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#dd3913]/10 border border-[#dd3913]/20 mb-4 sm:mb-6">
                <span className="text-[#dd3913] font-semibold text-[10px] sm:text-xs tracking-widest uppercase">Premium Access</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-[Montserrat] font-extrabold text-white leading-tight tracking-tight">
                Ultras Membership <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dd3913] to-[#ff6b4a]">
                  ₹349
                </span>
              </h1>
            </motion.div>

            {/* Benefits */}
            <motion.div variants={itemVariants} className="space-y-4 pt-2">
              <h2 className="text-base sm:text-lg font-[Montserrat] font-semibold text-gray-400 uppercase tracking-widest mb-4 sm:mb-6">
                Exclusive Benefits
              </h2>
              <div className="grid gap-3 sm:gap-4">
                {benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/5 transition-colors duration-200 hover:bg-white/[0.06] hover:border-white/10"
                  >
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#dd3913]/10 border border-[#dd3913]/20 flex items-center justify-center">
                      {benefit.icon}
                    </div>
                    <p className="text-sm sm:text-base text-gray-200 font-[Montserrat] font-medium leading-snug">
                      {benefit.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 flex flex-col items-center justify-center space-y-6 sm:space-y-10 mt-12 lg:mt-0"
          >
            <div className="relative w-full flex justify-center px-2 sm:px-0">
              {/* Glow — radial-gradient instead of blur filter */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full pointer-events-none opacity-30"
                style={{ background: "radial-gradient(circle, #dd3913 0%, transparent 65%)" }}
              />
              <ProMemberCard />
            </div>

            <button
              onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSfDl1VjhTXZNgD5Sb4uZ0PFhiQ8qs1j0qwXw3RYkASEoX2IaQ/viewform?usp=header", "_blank")}
              className="px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-[#a11f0a] to-[#dd3913] text-white font-[Montserrat] font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl tracking-widest uppercase w-full max-w-[90%] sm:max-w-sm text-center border border-white/20 shadow-[0_10px_40px_rgba(221,57,19,0.3)] hover:shadow-[0_10px_50px_rgba(221,57,19,0.5)] hover:scale-[1.04] active:scale-[0.97] transition-all duration-200 transform-gpu relative overflow-hidden group"
            >
              <span className="relative z-10">Apply to Join Now</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.2s_ease-in-out_infinite] skew-x-12" />
            </button>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
