import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "/images/Gallery/Gal2.jpeg",
  "/images/Gallery/Gal8.jpeg",
  "/images/Gallery/Gal3.jpeg",
  "/images/Gallery/Gal7.jpeg",
  "/images/Gallery/Gal5.jpeg",
  "/images/Gallery/Gal6.jpeg",
];

const Gallery = () => {
  const [selected, setSelected] = useState(null);

  return (
    <section className="relative py-10 min-h-screen w-full px-4" id="Gallery">
      {/* Background overlay */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br z-0" />
      {/* from-[#0d1117] via-[#121C26]/90 to-[#0d1117] backdrop-blur-xl background if need to apply on top of this element */}
      {/* Title */}
      <div className="relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center p-2 text-2xl md:text-4xl font-extrabold text-orange-400 mb-10 drop-shadow-lg tracking-widest uppercase"
        >
          The Roar Behind the Glory
        </motion.h1>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              className="relative group overflow-hidden rounded-3xl shadow-xl border border-orange-400/10 bg-white/10 backdrop-blur-lg transition-all duration-400"
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              viewport={{ once: false }}
              whileHover={{ scale: 1.04 }}
              onClick={() => setSelected(img)}
              style={{ cursor: "pointer" }}
            >
              {/* Image */}
              <img
                src={img}
                alt="fan pic"
                className="w-full h-72 object-cover rounded-3xl transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              {/* Overlay */}
              <motion.div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-75 transition-opacity duration-300 flex items-end">
                <div className="p-4 w-full text-center text-orange-400 font-bold text-lg drop-shadow-md">
                  {/* Click to zoom */}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox / Modal for enlarged image */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{ cursor: "zoom-out" }}
          >
            <motion.img
              src={selected}
              alt="full gallery"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="
                max-w-full
                sm:max-w-xl
                md:max-w-3xl
                max-h-[60vh]
                sm:max-h-[75vh]
                md:max-h-[80vh]
                mx-auto
                my-auto
                object-contain
                shadow-2xl
                rounded-2xl
                border-4 border-orange-400/30
              "
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
