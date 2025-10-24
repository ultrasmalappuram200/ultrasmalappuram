'use client'

import React from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaYoutube, FaTwitter, FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-[#1a1f3c] text-white overflow-hidden">
      {/* Sharp Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Sharp Diagonal Lines */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#dd3913]/30 to-transparent"
            style={{
              width: `${300 + i * 50}px`,
              left: `${(i * 15 + 10) % 100}%`,
              top: `${(i * 18 + 20) % 100}%`,
              transform: `rotate(${i * 7 - 21}deg)`,
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ 
              opacity: [0, 0.4, 0], 
              scaleX: [0, 1, 0] 
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Sharp Geometric Shapes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${(i * 12 + 5) % 100}%`,
              top: `${(i * 11 + 15) % 100}%`,
            }}
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ 
              opacity: [0, 0.2, 0],
              rotate: 180 
            }}
            transition={{
              duration: 20 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div 
              className={`bg-[#dd3913]/15 ${i % 2 === 0 ? 'w-4 h-4' : 'w-3 h-8'}`}
              style={{
                clipPath: i % 2 === 0 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'polygon(0% 0%, 100% 0%, 50% 100%)'
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        
        {/* Top Section - Sharp Layout */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          
          {/* Left - Logo & Brand */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Sharp Logo Container */}
            <div className="relative">
              <div className="w-20 h-20 bg-[#dd3913] transform -skew-x-12 shadow-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl transform skew-x-12" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800 }}>
                  <img src="/images/ultras-logo.png" alt="" />
                </span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-white/20 transform rotate-45"></div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
                ULTRAS MALAPPURAM
              </h3>
              <p className="text-gray-400 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
                The official supporters group of Malappuram FC. 
                United in passion, united in purpose.
              </p>
            </div>
          </motion.div>

          {/* Center - Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h4 className="text-lg font-semibold text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Home", href: "#home" },
                { name: "About", href: "#about" },
                { name: "Standings", href: "#standings" },
                { name: "Gallery", href: "#gallery" },
                { name: "Matches", href: "#matches" },
                { name: "Contact", href: "#contact" }
              ].map((link, i) => (
                <motion.a
                  key={i}
                  href={link.href}
                  className="text-gray-400 hover:text-[#dd3913] transition-colors duration-300 text-sm uppercase tracking-wider transform hover:-skew-x-2"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right - Social & Contact */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h4 className="text-lg font-semibold text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
              Follow Us
            </h4>
            
            {/* Sharp Social Icons */}
            <div className="flex gap-4">
              {[
                {
                  icon: <FaInstagram />,
                  color: "bg-gradient-to-br from-pink-500 to-purple-600",
                  link: "https://www.instagram.com/ultras.malappuram/",
                },
                {
                  icon: <FaYoutube />,
                  color: "bg-gradient-to-br from-red-500 to-red-600",
                  link: "https://www.youtube.com/@ultrasmalappuram",
                },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 ${social.color} flex items-center justify-center text-white text-lg shadow-lg transform hover:-skew-x-2 transition-all duration-300`}
                  whileHover={{ scale: 1.1, boxShadow: "0 0 0 3px rgba(221,57,19,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            {/* Sharp Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#dd3913] transform rotate-45"></div>
                <span className="text-gray-400 text-sm" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
                  Malappuram, Kerala, India
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#dd3913] transform rotate-45"></div>
                <span className="text-gray-400 text-sm" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
                  Super League Kerala
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sharp Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="h-px bg-gradient-to-r from-transparent via-[#dd3913] to-transparent mb-8 transform -skew-x-12"
        />

        {/* Bottom Section - Sharp Layout */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Left - Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-gray-500 text-sm"
            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}
          >
            © {new Date().getFullYear()} Ultras Malappuram. All rights reserved.
          </motion.div>

          {/* Center - Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="px-6 py-2 bg-[#dd3913]/20 border border-[#dd3913]/30 transform -skew-x-12">
              <span className="text-[#dd3913] font-semibold text-sm uppercase tracking-wider transform skew-x-12" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                United We Stand
              </span>
            </div>
          </motion.div>

          {/* Right - Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-gray-500 text-sm"
            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}
          >
            Made with passion for football
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;