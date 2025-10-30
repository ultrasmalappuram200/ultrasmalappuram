"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const images = ["/images/img2.webp", "/images/tifo.webp", "/images/bg1.jpeg"];

const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="Hero"
      className="
        relative w-full min-h-screen overflow-hidden bg-[#1a1f3c]
        pt-[6rem] sm:pt-[7rem] md:pt-[8rem] lg:pt-[9rem]
        flex items-center
      "
    >
      {/* 🔸 Smooth background slideshow with AnimatePresence */}
      <div className="absolute inset-0">
        <AnimatePresence>
          <motion.img
            key={images[index]}
            src={images[index]}
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover object-center"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </AnimatePresence>

        {/* Soft overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f3c]/85 via-[#1a1f3c]/75 to-[#1a1f3c]/90 pointer-events-none"></div>
      </div>

      {/* 🔸 Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left — Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="lg:col-span-7 space-y-6 lg:space-y-8 text-center lg:text-left"
          >
            <div className="px-4 py-2 sm:px-6 sm:py-3 bg-[#dd3913] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider transform -skew-x-12 shadow-lg inline-block">
              Official Supporters of Malappuram FC
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-[Montserrat] font-extrabold text-white leading-tight">
              <span className="block">ULTRAS</span>
              <span className="block text-[#dd3913] transform -skew-x-6">
                MALAPPURAM
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed font-[Montserrat]">
              The heartbeat of{" "}
              <span className="text-[#dd3913] font-semibold">
                Malappuram FC
              </span>
              . Passion, unity, and unwavering support.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link href="https://chat.whatsapp.com/BUrboLPViNw8VBLvI0AoBy?mode=wwt">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-[#dd3913] hover:bg-[#dd3913]/90 text-white font-semibold text-base sm:text-lg transition-all duration-200 shadow-lg w-full sm:w-auto border-2 border-[#dd3913]/50 rounded-md"
                >
                  JOIN THE ARMY
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const element = document.getElementById("matches");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 border-2 border-white/50 text-white font-semibold text-base sm:text-lg transition-all duration-200 backdrop-blur-sm bg-white/10 hover:bg-white/20 w-full sm:w-auto rounded-md"
              >
                VIEW MATCHES
              </motion.button>
            </div>
          </motion.div>

          {/* Right — Logo */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="lg:col-span-5 flex justify-center items-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl border border-white/20 rounded-full p-6 sm:p-8 shadow-2xl"
            >
              <img
                src="/images/ultras-logo.png"
                alt="Ultras Malappuram Logo"
                className="w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 object-contain rounded-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
