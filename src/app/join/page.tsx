"use client";

import React from "react";
import PrivilegeMemberCard, { MEMBERSHIP_FORM_URL } from "@/components/PrivilegeMemberCard";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { Ticket, Users, Shirt, Percent, Plane, Crown, Clock } from "lucide-react";

// ── Variants defined OUTSIDE component — never re-created on render ──
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
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
    icon: Ticket,
    title: "Free Entry",
    text: "For the first home match of the season",
  },
  {
    icon: Percent,
    title: "50% Off",
    text: "On all remaining home match tickets",
  },
  {
    icon: Users,
    title: "Bring 1 Friend",
    text: "To remaining home matches at the same 50% discounted rate",
  },
  {
    icon: Shirt,
    title: "Official MFC Fan Jersey",
    text: "Matchday colours, yours to keep",
  },
];

const openForm = () => window.open(MEMBERSHIP_FORM_URL, "_blank");

export default function JoinPage() {
  return (
    <div className="relative min-h-screen bg-[#1a1f3c] overflow-hidden">

      {/* ── Lightweight CSS-only background — ZERO JS animation cost ── */}
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

        {/* Radial glow accents (no blur filter — uses gradient instead) */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.09]"
          style={{ background: "radial-gradient(circle, #dd3913 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #dd3913 0%, transparent 70%)" }}
        />
      </div>

      <main className="relative z-10 pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" as const }}
          className="mb-8 sm:mb-10"
        >
          <Link href="/">
            <button className="flex items-center text-gray-400 hover:text-white transition-colors duration-300 group">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-3 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </div>
              <span className="font-[Montserrat] font-medium text-xs sm:text-sm tracking-widest uppercase">Back to Home</span>
            </button>
          </Link>
        </motion.div>

        {/* ── Poster-style header ── */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#dd3913]/10 border border-[#dd3913]/30 backdrop-blur-sm">
              <Crown className="w-3.5 h-3.5 text-[#dd3913]" aria-hidden="true" />
              <span className="text-[#ff8a63] font-[Montserrat] font-bold text-[10px] sm:text-xs tracking-[0.22em] uppercase">
                Members Only Access
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mt-5 sm:mt-6 font-[Montserrat] font-extrabold text-white leading-[0.95] tracking-tight uppercase text-[2rem] sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            <span className="block">Be an Ultras</span>
            <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-[#dd3913] via-[#ff5a2f] to-[#ff8a63] italic -skew-x-6">
              Privilege Member
            </span>
          </motion.h1>

          {/* Price slab — mirrors the poster's ₹350 ONLY block */}
          <motion.div variants={itemVariants} className="mt-6 sm:mt-8 flex justify-center">
            <div className="inline-flex items-baseline gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 -skew-x-6 bg-gradient-to-r from-[#a11f0a] via-[#dd3913] to-[#ff5a2f] border border-white/25 rounded-lg shadow-[0_14px_44px_-12px_rgba(221,57,19,0.9)]">
              <span className="skew-x-6 font-[Montserrat] font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                ₹350
              </span>
              <span className="skew-x-6 font-[Montserrat] font-bold text-white/85 text-sm sm:text-base uppercase tracking-[0.2em]">
                Only
              </span>
            </div>
          </motion.div>

        </motion.header>

        {/* ── Benefits + Card ── */}
        <div className="mt-12 sm:mt-16 grid lg:grid-cols-12 gap-10 lg:gap-12 items-start w-full">

          {/* Left — Benefits */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="lg:col-span-7 space-y-5 sm:space-y-6"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <h2 className="font-[Montserrat] font-extrabold text-white uppercase tracking-[0.16em] text-sm sm:text-base whitespace-nowrap">
                Membership Benefits
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-[#dd3913]/60 to-transparent" />
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    variants={itemVariants}
                    className="group relative flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 overflow-hidden transition-colors duration-200 hover:bg-white/[0.07] hover:border-[#dd3913]/40"
                  >
                    {/* Corner glow on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: "radial-gradient(100% 90% at 100% 0%, rgba(221,57,19,0.18) 0%, transparent 65%)" }}
                    />
                    <div className="relative flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#dd3913]/25 to-[#dd3913]/5 border border-[#dd3913]/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff6b4a]" aria-hidden="true" />
                    </div>
                    <div className="relative min-w-0">
                      <h3 className="font-[Montserrat] font-extrabold text-white uppercase tracking-wide text-sm sm:text-base leading-tight">
                        {benefit.title}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-gray-400 font-[Montserrat] leading-snug">
                        {benefit.text}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Away-match ribbon — the poster's banner line */}
            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden rounded-2xl border border-[#dd3913]/35 bg-gradient-to-r from-[#dd3913]/20 via-[#dd3913]/10 to-transparent p-4 sm:p-5"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#dd3913] flex items-center justify-center shadow-[0_8px_24px_-8px_rgba(221,57,19,0.9)]">
                  <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-white" aria-hidden="true" />
                </div>
                <p className="font-[Montserrat] font-extrabold text-white uppercase tracking-[0.08em] text-xs sm:text-sm lg:text-base leading-tight">
                  Members Only Exclusive Offers on Away Matches
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Card + CTA */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 flex flex-col items-center justify-center gap-6 sm:gap-8 lg:sticky lg:top-24"
          >
            <div className="relative w-full flex justify-center">
              {/* Glow — radial-gradient instead of blur filter */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-full pointer-events-none opacity-35"
                style={{ background: "radial-gradient(circle, #dd3913 0%, transparent 65%)" }}
              />
              <PrivilegeMemberCard />
            </div>

            {/* Early bird countdown strip */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10">
              <Clock className="w-3.5 h-3.5 text-[#ff6b4a] shrink-0" aria-hidden="true" />
              <span className="font-[Montserrat] font-semibold text-[10px] sm:text-xs text-gray-300 uppercase tracking-[0.14em] text-center">
                Early bird offer closes 30 Sep 2026
              </span>
            </div>

            <button
              onClick={openForm}
              className="group relative w-full max-w-sm px-6 sm:px-10 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-[#a11f0a] via-[#dd3913] to-[#ff5a2f] text-white font-[Montserrat] font-extrabold text-base sm:text-lg tracking-[0.16em] uppercase border border-white/25 shadow-[0_14px_44px_-12px_rgba(221,57,19,0.9)] hover:shadow-[0_18px_54px_-12px_rgba(221,57,19,1)] hover:scale-[1.03] active:scale-[0.97] transition-[transform,box-shadow] duration-200 transform-gpu overflow-hidden"
            >
              <span className="relative z-10">Join Now</span>
              <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent group-hover:animate-[shimmer_1.1s_ease-in-out_infinite]" />
            </button>

            <p className="text-[10px] sm:text-xs text-gray-500 font-[Montserrat] text-center max-w-sm leading-relaxed uppercase tracking-[0.1em]">
              This offer is not valid for knockout matches. T&amp;C apply.
            </p>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
