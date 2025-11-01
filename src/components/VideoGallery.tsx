'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";

const videoIds = [
  "4Uagd_dclYo",
  "zzv79QS9QpU",
  "yorkfkgp33A",
  "IawPbfvEf3A",
  "gHHJh3WS89M",
  "VBa17Lhu-4E",
  // "oeqv85YP7wU",
];

const VideoItem = ({ id, index }: { id: string; index: number }) => {
  const [loaded, setLoaded] = useState(false);
  const thumbnail = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="group cursor-pointer bg-gradient-to-br from-gray-800/40 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-200 ease-out hover:-skew-x-1"
      style={{ minHeight: 0, minWidth: 0 }}
      onClick={() => setLoaded(true)}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {!loaded ? (
          <>
            <motion.img
              src={thumbnail}
              alt="Video thumbnail"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 bg-[#dd3913] rounded-full flex items-center justify-center shadow-2xl"
              >
                <FaPlay className="w-6 h-6 text-white ml-1" />
              </motion.div>
            </div>
          </>
        ) : (
          <motion.iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1`}
            title="Ultras video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        )}
      </div>
    </motion.div>
  );
};

const VideoGallery = () => (
  <section
    id="VideoGallery"
    className="relative py-16 sm:py-24 min-h-screen w-full px-4 sm:px-6 bg-gradient-to-br from-[#1a1f3c] via-[#1a1f3c]/95 to-[#0f132b]"
  >
    {/* Decorative geometric lines and shapes */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-[#dd3913]/20 to-transparent"
          style={{
            width: `${250 + i * 50}px`,
            left: `${25 + i * 20}%`,
            top: `${20 + i * 25}%`,
            transform: `rotate(${-20 + i * 15}deg)`,
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: [0, 0.4, 0], scaleX: [0, 1, 0] }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i,
          }}
        />
      ))}
    </div>

    <div className="relative z-10 max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-12 sm:mb-16"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-6"
        >
          <div className="px-6 py-3 bg-[#dd3913] text-white text-sm font-bold uppercase tracking-wider transform -skew-x-12 shadow-lg">
            Video Gallery
          </div>
        </motion.div>

        <h2
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
        >
          Watch Our{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dd3913] via-[#dd3913]/90 to-[#dd3913]/70">
            Story Unfold
          </span>
        </h2>
        <p
          className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400 }}
        >
          Experience the passion, energy, and unforgettable moments through our video collection.
        </p>
      </motion.div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoIds.map((id, index) => (
          <VideoItem key={id} id={id} index={index} />
        ))}
      </div>
    </div>
  </section>
);

export default VideoGallery;
