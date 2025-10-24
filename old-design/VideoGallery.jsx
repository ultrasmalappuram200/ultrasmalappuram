import React, { useState } from "react";
import { motion } from "framer-motion";

const videoIds = [
  "CF3stVeql0I",
  "fpcLLksnkbM",
  "F0Br6mcFwTg",
  "VBa17Lhu-4E",
  "RNvBzmK5ImU",
  "oeqv85YP7wU",
];

// Helper component for each video
const VideoItem = ({ id, index }) => {
  const [loaded, setLoaded] = useState(false);
  const thumbnail = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.13 }}
      whileHover={{ scale: 1.06, rotate: 0.5 }}
      className="rounded-3xl overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 shadow-[0_0_30px_rgba(255,150,50,0.4)] hover:shadow-[0_0_40px_rgba(255,180,80,0.7)] transition-all duration-500 cursor-pointer aspect-[16/9] flex items-center justify-center"
      style={{ minHeight: 0, minWidth: 0 }}
    >
      {!loaded ? (
        <motion.img
          src={thumbnail}
          alt="video thumbnail"
          className="w-full h-full object-cover rounded-3xl"
          loading="lazy"
          onClick={() => setLoaded(true)}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.4 }}
        />
      ) : (
        <motion.iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full aspect-[16/9] rounded-3xl"
        />
      )}
      {
        // Overlay play button when showing thumbnail
        !loaded && (
          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg width={60} height={60} viewBox="0 0 100 100" fill="none">
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="rgba(0,0,0,0.6)"
                stroke="#FFA500"
                strokeWidth="6"
              />
              <polygon points="40,32 72,50 40,68" fill="#fff" />
            </svg>
          </span>
        )
      }
    </motion.div>
  );
};

const VideoGallery = () => (
  <div className="relative min-h-screen py-16 px-6 text-white overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0 -z-10">
      <div className="w-full h-full bg-gradient-to-br  opacity-95" />
      {/* from-black via-gray-900 to-black  if need add*/}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay"></div>
    </div>

    {/* Title */}
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center text-5xl md:text-7xl font-extrabold mb-20 tracking-wide uppercase bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,150,50,0.9)]"
    >
      🎥 Video Gallery
    </motion.h1>

    {/* Video Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
      {videoIds.map((id, idx) => (
        <VideoItem id={id} index={idx} key={id} />
      ))}
    </div>
  </div>
);

export default VideoGallery;
