'use client';

import React from "react";
import { motion } from "framer-motion";
import { FaFire, FaHandshake, FaHeart } from "react-icons/fa";

const About = () => {
  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center px-6 py-24 bg-gradient-to-br from-[#1a1f3c] via-[#1a1f3c]/95 to-[#0f132b] overflow-hidden"
    >
      {/* 🌌 Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[400px] h-[400px] bg-[#dd3913]/20 blur-[160px] rounded-full top-1/3 left-10"
          animate={{ x: [0, 50, -50, 0], y: [0, 40, -40, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] bg-[#dd3913]/10 blur-[200px] rounded-full bottom-10 right-10"
          animate={{ x: [0, -50, 50, 0], y: [0, -30, 30, 0], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* 🌟 Content Wrapper */}
      <div className="relative z-10 max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
        
        {/* 🔸 Left — Image */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="relative group bg-gradient-to-b from-[#ffffff0d] to-[#ffffff05] backdrop-blur-xl border border-[#dd3913]/40 rounded-3xl p-6 shadow-[0_0_40px_rgba(221,57,19,0.15)] hover:shadow-[0_0_70px_rgba(221,57,19,0.35)] transition-all duration-700">
            <div className="overflow-hidden rounded-2xl">
              <motion.img
                src="/images/ultras-logo.png"
                alt="Ultras Malappuram"
                className="w-full h-auto object-contain rounded-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>
        </motion.div>

        {/* 🔸 Right — Text */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-b from-[#ffffff0d] to-[#ffffff05] backdrop-blur-xl border border-[#dd3913]/30 rounded-3xl p-10 shadow-[0_0_50px_rgba(221,57,19,0.1)]">
            
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold mb-6 text-white font-[Montserrat]"
            >
              <span className="text-[#dd3913]">Ultras</span> Malappuram
            </motion.h2>

            {/* Description */}
            <div className="space-y-5 text-gray-300 text-lg leading-relaxed font-[Montserrat]">
              <p>
                <span className="text-[#dd3913] font-semibold">Ultras Malappuram</span> is the official supporters’ group of{" "}
                <span className="text-white font-semibold">Malappuram FC</span>, proudly representing our district in the{" "}
                <span className="text-[#dd3913] font-semibold">Super League Kerala</span>.
              </p>
              <p>
                Built on <span className="text-[#dd3913] font-semibold">passion, unity, and respect</span>, we are the heartbeat of Kerala’s football culture.
              </p>
              <p>
                Through creativity, chants, and community spirit, we back our team — both on and off the pitch.
              </p>
              <p>
                Together, we define what <span className="text-[#dd3913] font-semibold">true football loyalty</span> means.
              </p>
            </div>

            {/* 🔸 Values Icons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10">
              {[
                { icon: <FaFire className="text-3xl text-[#dd3913]" />, title: "Passion" },
                { icon: <FaHandshake className="text-3xl text-[#dd3913]" />, title: "Unity" },
                { icon: <FaHeart className="text-3xl text-[#dd3913]" />, title: "Respect" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center text-center bg-white/5 border border-[#dd3913]/30 rounded-2xl py-5 px-4 backdrop-blur-md transition-all duration-300 hover:bg-[#dd3913]/10"
                >
                  {item.icon}
                  <h4 className="mt-2 text-lg font-bold text-white font-[Montserrat]">
                    {item.title}
                  </h4>
                </motion.div>
              ))}
            </div>

            {/* 🔸 CTA */}
            <motion.div whileHover={{ scale: 1.08 }} className="mt-12 text-center lg:text-left">
              <a
                href="https://chat.whatsapp.com/BUrboLPViNw8VBLvI0AoBy?mode=wwt"
                className="inline-block px-12 py-4 rounded-full text-lg font-extrabold tracking-wide bg-[#dd3913] text-white shadow-[0_0_30px_rgba(221,57,19,0.4)] hover:shadow-[0_0_50px_rgba(221,57,19,0.7)] transition-all duration-500 font-[Montserrat]"
              >
                #UnitedWeStand
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
