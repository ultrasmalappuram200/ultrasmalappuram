'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ["home", "about", "standings", "matches", "gallery", "contact"];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 120 && rect.bottom >= 120;
        }
        return false;
      });

      if (currentSection) setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Smooth scroll with offset fix
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);

    if (element) {
      const navHeight = document.querySelector("nav")?.offsetHeight || 0;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setTimeout(() => setIsMobileMenuOpen(false), 400);
    }
  };

  const navItems = [
    { name: "Home", href: "home" },
    { name: "About", href: "about" },
    { name: "Standings", href: "standings" },
    { name: "Matches", href: "matches" },
    { name: "Gallery", href: "gallery" },
    // { name: "Contact", href: "contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#1a1f3c]/95 backdrop-blur-xl border-b border-gray-700/50 shadow-xl"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
            <Link href="#home" onClick={() => scrollToSection("home")} className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shadow-lg">
                <img
                  src="/images/ultras-logo.png"
                  alt="Ultras Malappuram Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <div
                  className="text-white font-bold text-lg"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
                >
                  ULTRAS MALAPPURAM
                </div>
                <div
                  className="text-[#dd3913] text-xs uppercase tracking-wider"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
                >
                  Official Supporters
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`transition-colors duration-200 text-sm font-semibold uppercase tracking-wider ${
                  activeSection === item.href
                    ? "text-[#dd3913]"
                    : "text-gray-300 hover:text-[#dd3913]"
                }`}
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.name}
              </motion.button>
            ))}
          </div>

          {/* Join Us Button */}
          <div className="hidden sm:block">
            <Link href="https://chat.whatsapp.com/DzyEc6Bq9FfJNo6kqpsmAw?mode=wwt" target="_blank">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-[#dd3913] hover:bg-[#dd3913]/90 text-white font-semibold text-sm uppercase tracking-wider rounded-md transition-all duration-200 shadow-lg"
              >
                Join Us
              </motion.button>
            </Link>
          </div>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative w-10 h-10 flex flex-col items-center justify-center space-y-1 group focus:outline-none"
          >
            <motion.span
              animate={{
                rotate: isMobileMenuOpen ? 45 : 0,
                y: isMobileMenuOpen ? 6 : 0,
              }}
              className="block w-6 h-0.5 bg-white rounded-full transition-all duration-300 group-hover:bg-[#dd3913]"
            />
            <motion.span
              animate={{
                opacity: isMobileMenuOpen ? 0 : 1,
              }}
              className="block w-6 h-0.5 bg-white rounded-full transition-all duration-300 group-hover:bg-[#dd3913]"
            />
            <motion.span
              animate={{
                rotate: isMobileMenuOpen ? -45 : 0,
                y: isMobileMenuOpen ? -6 : 0,
              }}
              className="block w-6 h-0.5 bg-white rounded-full transition-all duration-300 group-hover:bg-[#dd3913]"
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:hidden bg-[#1a1f3c]/95 backdrop-blur-xl border-t border-gray-700/50 rounded-b-2xl"
            >
              <div className="py-4 space-y-4">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className={`block w-full text-left px-4 py-2 transition-colors duration-300 text-sm font-semibold uppercase tracking-wider ${
                      activeSection === item.href
                        ? "text-[#dd3913]"
                        : "text-gray-300 hover:text-[#dd3913]"
                    }`}
                    style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {item.name}
                  </motion.button>
                ))}

                <div className="px-4 pt-2">
                  <Link href="https://chat.whatsapp.com/BUrboLPViNw8VBLvI0AoBy?mode=wwt" target="_blank">
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full px-4 py-2 bg-[#dd3913] hover:bg-[#dd3913]/90 text-white font-semibold text-sm uppercase tracking-wider rounded-md transition-all duration-300 shadow-lg"
                    >
                      Join Us
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
