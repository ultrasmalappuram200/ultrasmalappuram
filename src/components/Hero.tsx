'use client'

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const images = [
  "/images/bg1.jpeg",
  "/images/bg2.jpg", 
  "/images/bg3.jpg",
  "/images/bg4.jpg",
  "/images/bg5.jpeg",
  "/images/bg6.jpg",
  "/images/bg7.jpg",
];

const Hero = () => {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === images.length) setLoaded(true);
      };
    });
  }, []);

  // Cycle background images
  useEffect(() => {
    if (!loaded) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [loaded]);

  return (
    <section id="Hero" className="relative w-full h-screen overflow-hidden bg-[#1a1f3c]">
      
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        {images.map((image, i) => (
          <motion.div
            key={image}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: i === index ? 1 : 0,
              scale: i === index ? [1, 1.05, 1] : 1
            }}
            transition={{ 
              opacity: { duration: 1.5, ease: "easeInOut" },
              scale: { duration: 8, ease: "easeInOut", repeat: Infinity }
            }}
          >
            <img
              src={image}
              alt="Ultras Malappuram background"
              className="absolute inset-0 w-full h-full object-cover object-center"
              draggable="false"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f3c]/85 via-[#1a1f3c]/70 to-[#1a1f3c]/90"></div>
          </motion.div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Left Side - Text */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="lg:col-span-7 space-y-6 lg:space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="inline-block"
              >
                <div className="px-4 py-2 sm:px-6 sm:py-3 bg-[#dd3913] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider transform -skew-x-12 shadow-lg">
                  Official Supporters
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight"
                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
              >
                <span className="block">ULTRAS</span>
                <span className="block text-[#dd3913] transform -skew-x-6">MALAPPURAM</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-lg leading-relaxed"
                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}
              >
                The heartbeat of <span className="text-[#dd3913] font-semibold">Malappuram FC</span>. 
                Passion, unity, and unwavering support.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="https://chat.whatsapp.com/BUrboLPViNw8VBLvI0AoBy?mode=wwt">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-[#dd3913] hover:bg-[#dd3913]/90 text-white font-semibold text-base sm:text-lg transition-all duration-200 shadow-lg hover:-skew-x-1 min-w-[180px] border-2 border-[#dd3913]/50"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                  >
                    JOIN THE ARMY
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const element = document.getElementById('matches');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 border-2 border-white/50 text-white font-semibold text-base sm:text-lg transition-all duration-200 backdrop-blur-sm bg-white/10 hover:bg-white/20 hover:-skew-x-1 min-w-[180px]"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
                >
                  VIEW MATCHES
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Side - Only Ultras Logo */}
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
