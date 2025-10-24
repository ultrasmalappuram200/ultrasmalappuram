'use client'

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaImages, FaHeart, FaEye, FaCamera, FaVideo, FaUsers, FaTrophy } from "react-icons/fa";

const images = [
  { src: "/images/Gallery/Gal2.jpeg", title: "Ultras Action", category: "Support" },
  { src: "/images/Gallery/Gal8.jpeg", title: "Match Day", category: "Stadium" },
  { src: "/images/Gallery/Gal3.jpeg", title: "Fan Moments", category: "Community" },
  { src: "/images/Gallery/Gal7.jpeg", title: "Celebration", category: "Victory" },
  { src: "/images/Gallery/Gal5.jpeg", title: "Unity", category: "Together" },
  { src: "/images/Gallery/Gal6.jpeg", title: "Passion", category: "Heart" },
];

const Gallery = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="relative py-16 sm:py-24 min-h-screen w-full px-4 sm:px-6 bg-gradient-to-br from-[#1a1f3c] via-[#1a1f3c]/95 to-[#1a1f3c]" id="Gallery">
      {/* Enhanced Sharp Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Sharp Diagonal Lines - Deterministic */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#dd3913]/25 to-transparent"
            style={{
              width: `${300 + i * 50}px`,
              left: `${20 + i * 15}%`,
              top: `${15 + i * 20}%`,
              transform: `rotate(${-25 + i * 10}deg)`,
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ 
              opacity: [0, 0.5, 0], 
              scaleX: [0, 1, 0] 
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i,
            }}
          />
        ))}

        {/* Sharp Geometric Shapes - Deterministic */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${15 + i * 12}%`,
              top: `${25 + i * 10}%`,
            }}
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ 
              opacity: [0, 0.3, 0],
              rotate: 180 
            }}
            transition={{
              duration: 20 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i,
            }}
          >
            <div 
              className={`bg-[#dd3913]/20 ${i % 4 === 0 ? 'w-4 h-4' : i % 4 === 1 ? 'w-3 h-8' : i % 4 === 2 ? 'w-8 h-3' : 'w-2 h-2'}`}
              style={{
                clipPath: i % 3 === 0 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : i % 3 === 1 ? 'polygon(0% 0%, 100% 0%, 50% 100%)' : 'polygon(0% 0%, 100% 50%, 0% 100%)'
              }}
            />
          </motion.div>
        ))}

        {/* Sharp Grid Pattern - Deterministic */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-16 grid-rows-12 h-full w-full">
            {Array.from({ length: 192 }).map((_, i) => (
              <motion.div
                key={i}
                className="border border-[#dd3913]/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.15, 0] }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  delay: (i % 3),
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          {/* Sharp Section Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6"
          >
            <div className="px-6 py-3 bg-[#dd3913] text-white text-sm font-bold uppercase tracking-wider transform -skew-x-12 shadow-lg">
              Gallery
            </div>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
            The Roar Behind{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dd3913] via-[#dd3913]/90 to-[#dd3913]/70">
              the Glory
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
            Capturing the passion, energy, and unforgettable moments of our supporters
          </p>
        </motion.div>

        {/* Proper Bento Box Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Large Featured Image - Spans 2 columns */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:col-span-2 lg:col-span-2 group cursor-pointer"
            onClick={() => setSelected(images[0].src)}
          >
            <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-gray-800/40 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-200 ease-out hover:-skew-x-1">
              <img
                src={images[0].src}
                alt={images[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-white font-bold text-xl mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
                    {images[0].title}
                  </div>
                  <div className="text-gray-300 text-sm" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
                    {images[0].category}
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 bg-[#dd3913] rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Medium Image - Single column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="group cursor-pointer"
            onClick={() => setSelected(images[1].src)}
          >
            <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-gray-800/40 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-200 ease-out hover:-skew-x-1">
              <img
                src={images[1].src}
                alt={images[1].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-white font-bold text-lg mb-1" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
                    {images[1].title}
                  </div>
                  <div className="text-gray-300 text-xs" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
                    {images[1].category}
                  </div>
                </div>
              </div>
              <div className="absolute top-3 right-3 w-6 h-6 bg-[#dd3913] rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Small Images Grid - Bottom Row */}
          {images.slice(2).map((image, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
              onClick={() => setSelected(image.src)}
            >
              <div className="relative h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-gray-800/40 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-200 ease-out hover:-skew-x-1">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="text-white font-bold text-sm mb-1" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
                      {image.title}
                    </div>
                    <div className="text-gray-300 text-xs" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
                      {image.category}
                    </div>
                  </div>
                </div>
                <div className="absolute top-2 right-2 w-5 h-5 bg-[#dd3913] rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {[
            { label: 'Gallery Images', value: images.length, icon: <FaImages className="text-xl" /> },
            { label: 'Memories Captured', value: '1000+', icon: <FaCamera className="text-xl" /> },
            { label: 'Fan Moments', value: '500+', icon: <FaUsers className="text-xl" /> },
            { label: 'Match Days', value: '50+', icon: <FaTrophy className="text-xl" /> }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-800/40 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 text-center shadow-lg transition-transform duration-200 ease-out hover:-skew-x-1"
            >
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-white mb-4">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div> */}
      </div>

      {/* Enhanced Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{ cursor: "zoom-out" }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative max-w-6xl max-h-[90vh] mx-auto"
            >
              <img
                src={selected}
                alt="Ultras Malappuram Gallery Full Size"
                className="max-w-full max-h-full object-contain shadow-2xl rounded-2xl border-4 border-[#dd3913]/30"
              />
              
              {/* Sharp Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-12 h-12 bg-[#dd3913] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Image Info */}
              <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-black/80 to-transparent rounded-2xl p-6">
                <div className="text-white font-bold text-xl mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
                  Ultras Malappuram Gallery
                </div>
                <div className="text-gray-300 text-sm" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
                  Capturing the passion and energy of our supporters
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;