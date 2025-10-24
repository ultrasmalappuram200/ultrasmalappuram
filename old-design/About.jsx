import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden"
    >
      {/* Soft background glow */}

      <div className="relative z-10 max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT CARD — Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative flex justify-center"
        >
          <div className="group relative flex flex-col items-center bg-gradient-to-b from-zinc-900/80 to-black/70 rounded-3xl border border-orange-500/40 p-8 shadow-[0_0_60px_rgba(255,115,0,0.25)] hover:shadow-[0_0_100px_rgba(255,115,0,0.4)] transition-all duration-700 ease-out backdrop-blur-md">
            <div className="relative w-full overflow-hidden rounded-2xl mb-6">
              <img
                src="/ultras.jpeg"
                alt="Ultras Malappuram"
                className="w-full h-auto object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT CARD — Text Section */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="relative bg-gradient-to-b from-zinc-900/80 to-black/70 border border-orange-500/40 rounded-3xl p-10  transition-all duration-700 ease-out backdrop-blur-md">
            <motion.h2
              initial={{ opacity: 0, y: -40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-200 bg-clip-text text-transparent drop-shadow-[0_4px_10px_rgba(255,180,0,0.3)]"
            >
              Ultras Malappuram
            </motion.h2>

            <p className="text-lg text-gray-300 mb-5 leading-relaxed">
              <span className="text-orange-400 font-semibold">
                Ultras Malappuram
              </span>{" "}
              is the official supporters group of{" "}
              <span className="text-white font-semibold">Malappuram FC</span>,
              representing our district in the{" "}
              <span className="text-orange-400 font-semibold">
                Super League Kerala
              </span>
              .
            </p>

            <p className="text-lg text-gray-300 mb-5 leading-relaxed">
              Founded on the principles of{" "}
              <span className="text-orange-400 font-semibold">
                passion, unity, and respect for the game
              </span>
              , we aim to create a powerful football culture rooted in the
              spirit of{" "}
              <span className="text-orange-400 font-semibold">Malappuram</span>.
            </p>

            <p className="text-lg text-gray-300 mb-5 leading-relaxed">
              Through organized support, community events, and creative fan
              initiatives, we stand behind our team — both on and off the pitch.
            </p>

            <p className="text-lg text-gray-300 mb-5 leading-relaxed">
              Together, we showcase what{" "}
              <span className="text-orange-400 font-bold">
                true football loyalty
              </span>{" "}
              means.
            </p>

            {/* CTA Button */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="mt-10 text-center lg:text-left"
            >
              <a
                href="#contact"
                className="inline-block px-12 py-4 rounded-full text-lg font-extrabold tracking-wide 
             bg-orange-400 text-[#1A1F3C] 
             shadow-[0_0_25px_rgba(255,150,0,0.3)] transition-all duration-500 ease-out"
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
