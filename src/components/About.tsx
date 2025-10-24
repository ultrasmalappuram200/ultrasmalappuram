'use client';

import React from "react";
import { motion } from "framer-motion";
import { FaFire, FaHandshake, FaHeart } from "react-icons/fa";

const About = () => {
  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden bg-gradient-to-br from-[#1a1f3c] via-[#1a1f3c]/95 to-[#0f132b]"
    >
      {/* Soft animated background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-[#dd3913]/30 blur-[160px]"
          animate={{ 
            x: [0, 100, -100, 0],
            y: [0, 50, -50, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT — Image / Logo */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative flex justify-center"
        >
          <div className="group relative flex flex-col items-center bg-gradient-to-b from-zinc-900/80 to-black/70 rounded-3xl border border-orange-500/40 p-8 shadow-[0_0_60px_rgba(255,115,0,0.25)] hover:shadow-[0_0_100px_rgba(255,115,0,0.4)] transition-all duration-700 ease-out backdrop-blur-md">
            <div className="relative w-full overflow-hidden rounded-2xl mb-6">
              <img
                src="/images/ultras-logo.png"
                alt="Ultras Malappuram"
                className="w-full h-auto object-contain rounded-2xl transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="relative bg-gradient-to-b from-zinc-900/80 to-black/70 border border-orange-500/40 rounded-3xl p-10 transition-all duration-700 ease-out backdrop-blur-md shadow-xl">
            {/* Header */}
            <motion.h2
              initial={{ opacity: 0, y: -40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-200 bg-clip-text text-transparent drop-shadow-[0_4px_10px_rgba(255,180,0,0.3)]"
            >
              Ultras Malappuram
            </motion.h2>

            {/* Story */}
            <div className="space-y-5 text-lg text-gray-300 leading-relaxed">
              <p>
                <span className="text-orange-400 font-semibold">Ultras Malappuram</span> 
                {" "}is the official supporters group of{" "}
                <span className="text-white font-semibold">Malappuram FC</span>,
                proudly representing our district in the{" "}
                <span className="text-orange-400 font-semibold">Super League Kerala</span>.
              </p>

              <p>
                Founded on the principles of{" "}
                <span className="text-orange-400 font-semibold">
                  passion, unity, and respect for the game
                </span>
                , we are the heartbeat of Kerala’s football culture.
              </p>

              <p>
                Through organized support, community events, and creative fan
                initiatives, we stand behind our team — both on and off the pitch.
              </p>

              <p>
                Together, we showcase what{" "}
                <span className="text-orange-400 font-bold">
                  true football loyalty
                </span>{" "}
                means.
              </p>
            </div>

            {/* Values Section */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
              {[
                { title: "Passion", icon: <FaFire className="text-3xl text-orange-400" />, desc: "Unwavering love for football" },
                { title: "Unity", icon: <FaHandshake className="text-3xl text-orange-400" />, desc: "Standing together as one" },
                { title: "Respect", icon: <FaHeart className="text-3xl text-orange-400" />, desc: "Honoring the game always" },
              ].map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * i }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center bg-black/30 border border-orange-400/30 rounded-2xl py-6 px-4 hover:bg-orange-500/10 transition-all duration-300"
                >
                  {v.icon}
                  <h4 className="text-lg font-bold text-white mt-3">{v.title}</h4>
                  <p className="text-gray-400 text-sm mt-1">{v.desc}</p>
                </motion.div>
              ))}
            </div> */}

            {/* CTA */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="mt-12 text-center lg:text-left"
            >
              <a
                href="https://chat.whatsapp.com/BUrboLPViNw8VBLvI0AoBy?mode=wwt"
                className="inline-block px-12 py-4 rounded-full text-lg font-extrabold tracking-wide 
                 bg-orange-400 text-[#1A1F3C] 
                 shadow-[0_0_25px_rgba(255,150,0,0.3)] transition-all duration-500 ease-out hover:shadow-[0_0_40px_rgba(255,150,0,0.6)]"
                style={{
                  fontFamily: "'Russo One', sans-serif",
                  letterSpacing: "1px",
                }}
              >
                #United We Stand
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
