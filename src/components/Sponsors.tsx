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
    <section className="relative py-28 px-6 sm:px-10 lg:px-16 bg-gradient-to-b from-[#1a1f3c] via-[#1a1f3c]/95 to-[#0f1329] overflow-hidden">
      {/* ✨ Animated Background Grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#dd3913]/10 blur-[2px]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
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

        {/* Sponsor Cards */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14"
        >
          {sponsors.map((sponsor, i) => (
            <motion.div
              key={sponsor.name}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative group"
            >
              {/* Glowing Border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#dd3913]/30 via-transparent to-[#dd3913]/10 opacity-0 group-hover:opacity-100 blur-md transition-all duration-500"></div>

              {/* Card */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/15 rounded-3xl p-10 shadow-[0_0_30px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center h-[260px] overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(221,57,19,0.3)]">
                <motion.div
                  className="w-32 h-32 mb-8 rounded-2xl overflow-hidden bg-white/10 p-4 group-hover:bg-white/20 transition-all duration-500 flex items-center justify-center"
                  whileHover={{ rotate: [0, 1, -1, 0], transition: { duration: 0.4 } }}
                >
                  <img
                    src={sponsor.logo}
                    alt={`${sponsor.name} logo`}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                </motion.div>

                <h3 className="text-xl font-semibold text-white font-[Montserrat] text-center tracking-tight">
                  {sponsor.name}
                </h3>

                <motion.div
                  className="mt-3 w-14 h-1 bg-gradient-to-r from-[#dd3913] via-[#ff5a2f] to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Sponsors;
