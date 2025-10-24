import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const images = [
  "/images/img1.jpg",
  "/images/img2.jpg",
  "/images/img3.jpg",
  "/images/tifo.jpg",
];

const Hero = () => {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Preload images for smoother transitions
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
    }, 7000);
    return () => clearInterval(interval);
  }, [loaded]);

  return (
    <section id="Hero" className="relative w-full h-screen overflow-hidden">
      {/* Cinematic Background Slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0 will-change-transform will-change-opacity"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={images[index]}
            alt="Ultras Malappuram background"
            className="absolute inset-0 w-full h-full object-cover object-center"
            draggable="false"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/80" /> */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Subtle Light Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-orange-500/15 blur-3xl"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              width: `${Math.random() * 300 + 120}px`,
              height: `${Math.random() * 300 + 120}px`,
              opacity: 0,
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: [0, 0.35, 0],
            }}
            transition={{
              duration: Math.random() * 18 + 12,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          {/* Animated Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-tight mb-6"
          >
            <span className="block text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]">
              ULTRAS
            </span>
            <motion.span
              className="block  text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              MALAPPURAM
            </motion.span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-lg sm:text-2xl  text-white/90 italic font-bold   mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            The Heartbeat of <span className="text-orange-400">Malappuram FC</span>
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <Link to="https://chat.whatsapp.com/BUrboLPViNw8VBLvI0AoBy?mode=wwt">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 0 3px rgba(245,158,11,0.5)",
                }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition-all text-lg"
              >
                JOIN THE ARMY
              </motion.button>
            </Link>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 0 3px rgba(255,255,255,0.4)",
              }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-full transition-all text-lg"
            >
              UPCOMING MATCHES
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center"
          >
            <span className="text-white text-sm mb-2 tracking-wide">
              SCROLL DOWN
            </span>
            <div className="w-px h-10 bg-gradient-to-b from-orange-400 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
