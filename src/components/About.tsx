'use client';

import React from "react";
import { motion, type Variants } from "framer-motion";
import { FaFire, FaHandshake, FaHeart } from "react-icons/fa";

// Pre-defined animation variants — defined OUTSIDE component to avoid re-creation
const fadeLeft: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};
const fadeRight: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const, delay: 0.15 } },
};
const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const, delay } },
});

const values = [
  { icon: <FaFire className="text-3xl text-[#dd3913]" />, title: "Passion" },
  { icon: <FaHandshake className="text-3xl text-[#dd3913]" />, title: "Unity" },
  { icon: <FaHeart className="text-3xl text-[#dd3913]" />, title: "Respect" },
];

const About = () => {
  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center px-6 py-24 bg-[#1a1f3c] overflow-hidden"
    >
      {/* ── Lightweight background accent (NO blur filter — that causes full-page repaints) ── */}
      {/* Using radial-gradient on a static div instead of animated blur orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/3 left-10 w-[400px] h-[400px] rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, #dd3913 0%, transparent 70%)",
            animation: "orbFloat1 10s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        <div
          className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, #dd3913 0%, transparent 70%)",
            animation: "orbFloat2 12s ease-in-out infinite",
            willChange: "transform",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">

        {/* Left — Logo */}
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex justify-center"
        >
          <div className="relative group bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-[#dd3913]/40 rounded-3xl p-6 shadow-[0_0_40px_rgba(221,57,19,0.12)] hover:shadow-[0_0_60px_rgba(221,57,19,0.25)] transition-shadow duration-500">
            <div className="overflow-hidden rounded-2xl">
              <img
                src="/images/ultras-logo.png"
                alt="Ultras Malappuram"
                className="w-full h-auto object-contain rounded-2xl transition-transform duration-500 group-hover:scale-[1.04]"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </motion.div>

        {/* Right — Text */}
        <motion.div
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-[#dd3913]/30 rounded-3xl p-10 shadow-[0_0_50px_rgba(221,57,19,0.07)]">

            {/* Title */}
            <motion.h2
              variants={fadeUp()}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold mb-6 text-white font-[Montserrat]"
            >
              <span className="text-[#dd3913]">Ultras</span> Malappuram
            </motion.h2>

            {/* Description */}
            <div className="space-y-5 text-gray-300 text-lg leading-relaxed font-[Montserrat]">
              <p>
                <span className="text-[#dd3913] font-semibold">Ultras Malappuram</span> is the official supporters' group of{" "}
                <span className="text-white font-semibold">Malappuram FC</span>, proudly representing our district in the{" "}
                <span className="text-[#dd3913] font-semibold">Super League Kerala</span>.
              </p>
              <p>
                Built on <span className="text-[#dd3913] font-semibold">passion, unity, and respect</span>, we are the heartbeat of Kerala's football culture.
              </p>
              <p>
                Through creativity, chants, and community spirit, we back our team — both on and off the pitch.
              </p>
              <p>
                Together, we define what <span className="text-[#dd3913] font-semibold">true football loyalty</span> means.
              </p>
            </div>

            {/* Values Icons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10">
              {values.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp(i * 0.15)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center bg-white/5 border border-[#dd3913]/30 rounded-2xl py-5 px-4 transition-colors duration-300 hover:bg-[#dd3913]/10 hover:scale-[1.04] transform-gpu"
                >
                  {item.icon}
                  <h4 className="mt-2 text-lg font-bold text-white font-[Montserrat]">
                    {item.title}
                  </h4>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 text-center lg:text-left">
              <a
                href="https://chat.whatsapp.com/BUrboLPViNw8VBLvI0AoBy?mode=wwt"
                className="inline-block px-12 py-4 rounded-full text-lg font-extrabold tracking-wide bg-[#dd3913] text-white shadow-[0_0_30px_rgba(221,57,19,0.35)] hover:shadow-[0_0_50px_rgba(221,57,19,0.6)] hover:scale-[1.05] transition-all duration-300 font-[Montserrat] transform-gpu"
              >
                #UnitedWeStand
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(About);
