"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaHandshake } from "react-icons/fa";

const sponsors = [
  { name: "Chicking", logo: "/images/sponsors/chicking.png" },
  { name: "Roadmate", logo: "/images/sponsors/Roadmate.png" },
  { name: "Ajmi", logo: "/images/sponsors/Ajmi.png" },
  { name: "Kalliyath", logo: "/images/sponsors/Kalliyath.png" },
  { name: "EdRoot", logo: "/images/sponsors/edRoot.png" },
];

// Pre-computed positions — no Math.random() at render time
const PARTICLES = [
  { top: "12%", left: "8%",  size: 6,  dur: 5.2 },
  { top: "35%", left: "22%", size: 4,  dur: 6.1 },
  { top: "58%", left: "45%", size: 7,  dur: 4.8 },
  { top: "78%", left: "68%", size: 5,  dur: 5.7 },
  { top: "22%", left: "85%", size: 6,  dur: 6.4 },
];

const Sponsors = () => {
  return (
    <section className="relative py-28 px-6 sm:px-10 lg:px-16 bg-[#1a1f3c] overflow-hidden">
      {/* CSS-only ambient background — zero JS animation cost */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[#dd3913]/25 blur-[2px]"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              animation: `particleFloat ${p.dur}s ease-in-out infinite`,
              animationDelay: `${i * 0.6}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <FaHandshake className="text-[#dd3913] text-3xl drop-shadow-[0_0_15px_rgba(221,57,19,0.8)]" />
            <span className="text-[#dd3913] text-base font-semibold uppercase tracking-[0.25em] font-[Montserrat]">
              Our Partners
            </span>
            <FaHandshake className="text-[#dd3913] text-3xl drop-shadow-[0_0_15px_rgba(221,57,19,0.8)]" />
          </motion.div>

          <h2
            className="text-5xl sm:text-6xl font-extrabold text-white mb-6 font-[Montserrat]"
            style={{ letterSpacing: "-0.03em" }}
          >
            Proudly{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dd3913] via-[#ff6530] to-[#dd3913]">
              Supported By
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-[Montserrat]">
            Together, we build innovation, passion, and excellence — our partners
            amplify every milestone of success.
          </p>
        </motion.div>

        {/* Sponsor Grid */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-14"
        >
          {sponsors.map((sponsor, i) => (
            <motion.div
              key={sponsor.name}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              className="relative group"
            >
              {/* Neon Frame */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#dd3913]/50 via-[#ff6530]/30 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />

              {/* Card */}
              <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.4)] h-[220px] transition-all duration-500 group-hover:border-[#dd3913]/40 group-hover:shadow-[0_0_40px_rgba(221,57,19,0.3)]">
                <div className="w-28 h-28 flex items-center justify-center overflow-hidden rounded-2xl bg-white/10 group-hover:bg-white/20 transition-all duration-500">
                  <img
                    src={sponsor.logo}
                    alt={`${sponsor.name} logo`}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <h3 className="text-lg mt-6 font-semibold text-white font-[Montserrat] text-center">
                  {sponsor.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(Sponsors);
