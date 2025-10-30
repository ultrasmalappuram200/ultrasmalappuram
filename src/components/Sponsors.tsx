"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaHandshake } from "react-icons/fa";

const sponsors = [
  { name: "Ajmi", logo: "/images/sponsors/Ajmi.png" },
  { name: "EdRoot", logo: "/images/sponsors/edRoot.png" },
  { name: "Kalliyath", logo: "/images/sponsors/Kalliyath.png" },
  { name: "Roadmate", logo: "/images/sponsors/Roadmate.png" },
];

const Sponsors = () => {
  return (
    <section className="relative py-28 px-6 sm:px-10 lg:px-16 bg-[] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#1a1f3c]"></div>
        {[...Array(25)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute bg-[#dd3913]/20 rounded-full blur-[2px]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 4}px`,
              height: `${Math.random() * 6 + 4}px`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
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
              Our Partnersa
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
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 lg:gap-14"
        >
          {sponsors.map((sponsor, i) => (
            <motion.div
              key={sponsor.name}
              whileHover={{ scale: 1.08, rotate: [0, 1, -1, 0] }}
              transition={{ duration: 0.4 }}
              className="relative group"
            >
              {/* Neon Frame */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#dd3913]/50 via-[#ff6530]/30 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>

              {/* Card */}
              <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.4)] h-[220px] transition-all duration-500 group-hover:border-[#dd3913]/40 group-hover:shadow-[0_0_40px_rgba(221,57,19,0.3)]">
                <div className="w-28 h-28 flex items-center justify-center overflow-hidden rounded-2xl bg-white/10 group-hover:bg-white/20 transition-all duration-500">
                  <img
                    src={sponsor.logo}
                    alt={`${sponsor.name} logo`}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
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

export default Sponsors;
