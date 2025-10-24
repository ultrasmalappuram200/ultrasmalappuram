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
    <section className="relative py-28 px-6 sm:px-10 lg:px-16 bg-gradient-to-br from-[#1a1f3c] via-[#1a1f3c]/95 to-[#1a1f3c] overflow-hidden">
      {/* ✨ Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
            {Array.from({ length: 96 }).map((_, i) => (
              <motion.div
                key={i}
                className="border border-[#dd3913]/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  delay: (i % 3) * 0.5,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 💎 Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <FaHandshake className="text-[#dd3913] text-3xl" />
            <span className="text-[#dd3913] text-base font-semibold uppercase tracking-widest font-[Montserrat]">
              Our Partners
            </span>
            <FaHandshake className="text-[#dd3913] text-3xl" />
          </motion.div>

          <h2 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 font-[Montserrat]">
            Proudly <span className="text-[#dd3913]">Supported By</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-[Montserrat]">
            Empowering our vision together — our partners drive our success and
            community strength.
          </p>
        </motion.div>

        {/* Sponsor Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14"
        >
          {sponsors.map((sponsor, i) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 * i }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.06, y: -10 }}
              className="group"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-lg hover:shadow-[0_0_40px_rgba(221,57,19,0.3)] transition-all duration-300 flex flex-col items-center justify-center h-[260px]">
                <div className="relative mb-8">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg bg-white/10 p-4 group-hover:bg-white/20 transition-all duration-300">
                    <img
                      src={sponsor.logo}
                      alt={`${sponsor.name} logo`}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#dd3913] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <h3 className="text-xl font-bold text-white text-center mb-2 font-[Montserrat]">
                  {sponsor.name}
                </h3>

                <div className="w-14 h-1 bg-gradient-to-r from-[#dd3913] to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Sponsors;
