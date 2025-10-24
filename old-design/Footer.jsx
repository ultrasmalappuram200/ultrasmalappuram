import React from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaYoutube, FaTwitter, FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-[#0A0F1C] to-black text-white overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-orange-600 opacity-20 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-red-600 opacity-20 blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.35, 0.2] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-6 py-16 z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-12">
        {/* Logo Section (on the side) */}
        <motion.div
          className="flex-shrink-0"
          initial={{ x: -80, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/ultras2.png"
            alt="Ultras Malappuram"
            className="h-40 w-40 object-contain drop-shadow-lg"
          />
        </motion.div>

        {/* Middle Content */}
        <div className="text-center md:text-left flex-1">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500"
          >
            ULTRAS MALAPPURAM
          </motion.h1>

          {/* Tagline */}
          <p className="mt-3 text-gray-400 text-lg italic">
            United We Stand – The Heartbeat of Kerala Football
          </p>

          {/* Links */}
          <div className="flex justify-center md:justify-start flex-wrap gap-6 mt-8">
            {["Home", "Matches", "Gallery"].map(
              (link) => (
                <motion.a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-gray-300 hover:text-orange-500 text-sm uppercase tracking-wider"
                  whileHover={{ scale: 1.1 }}
                >
                  {link}
                </motion.a>
              )
            )}
          </div>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-start gap-6 mt-8">
            {[
              {
                icon: <FaInstagram />,
                color: "text-pink-500",
                link: "https://www.instagram.com/ultras.malappuram/",
              },
              {
                icon: <FaYoutube />,
                color: "text-red-500",
                link: "https://www.youtube.com/@ultrasmalappuram",
              },
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.link}
                target="_blank" // opens in new tab
                rel="noopener noreferrer" // security best practice
                className={`text-2xl ${social.color}`}
                whileHover={{ scale: 1.3, rotate: 10 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Accent Bar */}
      <motion.div
        className="h-1 w-full bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Copyright */}
      <div className="py-4 text-center text-gray-500 text-xs">
        © {new Date().getFullYear()} Malappuram FC Ultras. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
