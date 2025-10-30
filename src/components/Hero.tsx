"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const images = ["/images/img2.webp", "/images/tifo.webp", "/images/bg1.jpeg"];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % images.length);
        setNext((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 1000);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="Hero"
      className="relative w-full h-[calc(120vh-0px)] lg:h-[calc(100vh-0px)] overflow-hidden bg-[#1a1f3c] pt-20 sm:pt-24 md:pt-28"
    >
      <div className="absolute inset-0">
        <motion.img
          key={images[current]}
          src={images[current]}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover object-center"
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            opacity: fade ? 1 : 0,
            scale: fade ? 1.05 : 1.08,
          }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
          }}
          style={{
            willChange: "opacity, transform",
            transform: "translateZ(0)",
          }}
        />

        <motion.img
          key={images[next]}
          src={images[next]}
          alt="Background next"
          className="absolute inset-0 w-full h-full object-cover object-center"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{
            opacity: fade ? 0 : 1,
            scale: fade ? 1.08 : 1.05,
          }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
          }}
          style={{
            willChange: "opacity, transform",
            transform: "translateZ(0)",
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f3c]/85 via-[#1a1f3c]/70 to-[#1a1f3c]/90 pointer-events-none"></div>
      </div>

      <div className="relative z-10 h-full flex items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left - Text */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="lg:col-span-7 space-y-6 lg:space-y-8"
            >
              <div className="px-4 py-2 sm:px-6 sm:py-3 bg-[#dd3913] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider transform -skew-x-12 shadow-lg inline-block">
                Official Supporters of Malappuram FC
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight">
                <span className="block">ULTRAS</span>
                <span className="block text-[#dd3913] transform -skew-x-6">
                  MALAPPURAM
                </span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-lg leading-relaxed">
                The heartbeat of{" "}
                <span className="text-[#dd3913] font-semibold">
                  Malappuram FC
                </span>
                . Passion, unity, and unwavering support.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="https://chat.whatsapp.com/BUrboLPViNw8VBLvI0AoBy?mode=wwt">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-[#dd3913] hover:bg-[#dd3913]/90 text-white font-semibold text-base sm:text-lg transition-all duration-200 shadow-lg hover:-skew-x-1 w-full border-2 border-[#dd3913]/50"
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
                  className="px-8 py-4 border-2 border-white/50 text-white font-semibold text-base sm:text-lg transition-all duration-200 backdrop-blur-sm bg-white/10 hover:bg-white/20 hover:-skew-x-1 min-w-[180px]"
                >
                  VIEW MATCHES
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="lg:col-span-5 flex justify-center items-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl border border-white/20 rounded-full p-8 shadow-2xl"
              >
                <img
                  src="/images/ultras-logo.png"
                  alt="Ultras Malappuram Logo"
                  className="w-90 h-90 object-contain rounded-full"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
