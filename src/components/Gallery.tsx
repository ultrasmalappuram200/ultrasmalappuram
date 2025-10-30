"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  { src: "/images/Gallery/Gal2.jpeg" },
  { src: "/images/Gallery/Gal8.jpeg" },
  { src: "/images/Gallery/Gal3.jpeg" },
  { src: "/images/Gallery/Gal7.jpeg" },
  { src: "/images/Gallery/Gal5.jpeg" },
  { src: "/images/Gallery/Gal6.jpeg" },
  { src: "/images/Gallery/Gal1.jpeg" },
  { src: "/images/Gallery/Gal4.jpeg" },
];

const Gallery = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section
      id="Gallery"
      className="relative py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-br from-[#1a1f3c] via-[#1a1f3c]/95 to-[#1a1f3c] overflow-hidden"
    >
      {/* Background lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#dd3913]/20 to-transparent"
            style={{
              width: `${300 + i * 50}px`,
              top: `${10 + i * 15}%`,
              left: `${5 + i * 10}%`,
              transform: `rotate(${-15 + i * 8}deg)`,
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: [0, 0.4, 0], scaleX: [0, 1, 0] }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-16"
        >
          <div className="inline-block px-6 py-3 bg-[#dd3913] text-white text-sm font-bold uppercase tracking-wider transform -skew-x-12 shadow-lg mb-6">
            Gallery
          </div>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
          >
            The Roar Behind{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dd3913] via-[#ff5a2f] to-[#dd3913]">
              The Glory
            </span>
          </h2>
        </motion.div>

        {/* Responsive Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Large Feature Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            onClick={() => setSelected(images[0].src)}
            className="group md:col-span-2 lg:col-span-2 relative rounded-2xl overflow-hidden cursor-pointer border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <img
              src={images[0].src}
              alt=""
              className="w-full h-64 sm:h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
          </motion.div>

          {/* Medium Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            onClick={() => setSelected(images[1].src)}
            className="group relative rounded-2xl overflow-hidden cursor-pointer border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <img
              src={images[1].src}
              alt=""
              className="w-full h-64 sm:h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
          </motion.div>

          {/* Small Images */}
          {images.slice(2).map((image, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setSelected(image.src)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={image.src}
                alt=""
                className="w-full h-48 sm:h-64 md:h-72 lg:h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.img
              src={selected}
              alt=""
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl border-4 border-[#dd3913]/40 shadow-2xl"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelected(null)}
              className="absolute top-6 right-6 w-12 h-12 bg-[#dd3913] rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
