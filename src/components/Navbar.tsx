'use client';

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useScroll, type Variants } from "framer-motion";
import Link from "next/link";
import { Crown } from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { emitMenuState } from "@/lib/uiEvents";

const socials = [
  { icon: <FaInstagram />, label: "Instagram", link: "https://www.instagram.com/ultras.malappuram/" },
  { icon: <FaYoutube />, label: "YouTube", link: "https://www.youtube.com/@ultrasmalappuram" },
];

// ── Variants defined OUTSIDE component — never re-created on render ──
const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.28, ease: "easeOut", staggerChildren: 0.055, delayChildren: 0.12 },
  },
  exit: { opacity: 0, transition: { duration: 0.22, ease: "easeIn" } },
};

const menuItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  exit: { opacity: 0, y: 12, transition: { duration: 0.15 } },
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Zero-rerender scroll progress bar
  const { scrollYProgress } = useScroll();

  const navItems = useMemo(() => [
    { name: "Home", href: "home" },
    { name: "About", href: "about" },
    { name: "Standings", href: "standings" },
    { name: "Matches", href: "matches" },
    { name: "Gallery", href: "gallery" },
  ], []);

  const handleScroll = useCallback(() => {
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
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const throttledScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = undefined as any;
      }, 50); // 50ms throttle
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  // ✅ Tell the rest of the page (BackToTop) to get out of the overlay's way
  useEffect(() => {
    emitMenuState(isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  // ✅ Lock body scroll + close on Escape while the full-screen menu is open
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const { overflow, paddingRight } = document.body.style;
    // Compensate for the scrollbar so the page doesn't shift under the overlay
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobileMenuOpen]);

  // ✅ Smooth scroll with offset fix
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    setIsMobileMenuOpen(false);

    // Wait a frame so the scroll lock is released before scrolling
    requestAnimationFrame(() => {
      const navHeight = document.querySelector("nav")?.offsetHeight || 0;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - navHeight, behavior: "smooth" });
    });
  }, []);

  const barIsSolid = isScrolled && !isMobileMenuOpen;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
          barIsSolid
            ? "bg-[#12162f]/85 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Logo */}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="flex-shrink-0">
              <Link href="#home" onClick={() => scrollToSection("home")} className="flex items-center gap-3 group">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-1 ring-white/20 group-hover:ring-[#dd3913]/70 shadow-lg transition-[box-shadow,--tw-ring-color] duration-300">
                  <img
                    src="/images/ultras-logo.png"
                    alt="Ultras Malappuram Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden sm:block leading-tight">
                  <div
                    className="text-white font-bold text-base lg:text-lg tracking-[0.02em]"
                    style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
                  >
                    ULTRAS MALAPPURAM
                  </div>
                  <div
                    className="text-[#ff6b4a] text-[10px] lg:text-xs uppercase tracking-[0.24em]"
                    style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
                  >
                    Official Supporters
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Nav — shared animated indicator */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.href;
                return (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className={`relative px-4 py-2 text-sm uppercase tracking-[0.12em] transition-colors duration-200 ${
                      isActive ? "text-white" : "text-gray-400 hover:text-white"
                    }`}
                    style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-lg bg-white/[0.07] border border-white/10"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-underline"
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-[#dd3913] shadow-[0_0_12px_rgba(221,57,19,0.9)]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <Link href="/join">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#a11f0a] via-[#dd3913] to-[#ff5a2f] text-white font-semibold text-xs lg:text-sm uppercase tracking-[0.1em] border border-white/20 shadow-[0_8px_24px_-8px_rgba(221,57,19,0.8)] overflow-hidden"
                    style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
                  >
                    <Crown className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span className="relative z-10 whitespace-nowrap">Privilege Member</span>
                    <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent group-hover:animate-[shimmer_1.1s_ease-in-out_infinite]" />
                  </motion.button>
                </Link>
              </div>

              {/* Hamburger — morphs to X, stays above the overlay */}
              <button
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                className="lg:hidden relative w-11 h-11 rounded-xl flex flex-col items-center justify-center gap-[5px] border border-white/15 bg-white/[0.06] backdrop-blur-sm active:scale-95 transition-transform duration-200"
              >
                <motion.span
                  animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 7 : 0 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="block w-5 h-[2px] bg-white rounded-full"
                />
                <motion.span
                  animate={{ opacity: isMobileMenuOpen ? 0 : 1, x: isMobileMenuOpen ? -12 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="block w-5 h-[2px] bg-white rounded-full"
                />
                <motion.span
                  animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -7 : 0 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="block w-5 h-[2px] bg-white rounded-full"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Reading progress — appears once the bar goes solid */}
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className={`absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-[#a11f0a] via-[#dd3913] to-[#ff8a63] transition-opacity duration-300 ${
            barIsSolid ? "opacity-100" : "opacity-0"
          }`}
        />
      </motion.nav>

      {/* ── Full-screen mobile menu ── */}
      {/* Rendered outside <nav> on purpose: nav has translateZ(0), which would */}
      {/* otherwise become the containing block for this fixed overlay. */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="lg:hidden fixed inset-0 z-40 bg-[#0d1128] overflow-y-auto overscroll-contain"
          >
            {/* Ambience */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(221,57,19,1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(221,57,19,1) 1px, transparent 1px)
                  `,
                  backgroundSize: "44px 44px",
                }}
              />
              <div
                className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full opacity-25"
                style={{ background: "radial-gradient(circle, #dd3913 0%, transparent 70%)" }}
              />
              <div
                className="absolute -bottom-32 -left-24 w-[380px] h-[380px] rounded-full opacity-15"
                style={{ background: "radial-gradient(circle, #dd3913 0%, transparent 70%)" }}
              />
              {/* Crest watermark */}
              <img
                src="/images/ultras-logo.png"
                alt=""
                className="absolute -right-16 bottom-12 w-72 h-72 object-contain opacity-[0.05]"
                decoding="async"
              />
            </div>

            <div className="relative min-h-full flex flex-col px-6 sm:px-10 pt-24 sm:pt-28 pb-10">

              {/* Nav items */}
              {/* Plain div, not <nav>: globals.css promotes every <nav> onto its own layer */}
              <div className="flex-1 flex flex-col justify-center">
                <motion.span
                  variants={menuItemVariants}
                  className="block text-[10px] font-[Montserrat] font-bold uppercase tracking-[0.3em] text-[#ff6b4a] mb-6"
                >
                  Menu
                </motion.span>

                <ul className="space-y-1">
                  {navItems.map((item, index) => {
                    const isActive = activeSection === item.href;
                    return (
                      <motion.li key={item.name} variants={menuItemVariants}>
                        <button
                          onClick={() => scrollToSection(item.href)}
                          className="group w-full flex items-baseline gap-4 py-3 text-left"
                        >
                          <span
                            className={`font-[Montserrat] font-bold text-xs tabular-nums transition-colors duration-200 ${
                              isActive ? "text-[#dd3913]" : "text-white/25 group-hover:text-white/50"
                            }`}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={`font-[Montserrat] font-extrabold uppercase text-3xl sm:text-4xl tracking-tight transition-colors duration-200 ${
                              isActive ? "text-[#dd3913]" : "text-white group-hover:text-[#ff8a63]"
                            }`}
                          >
                            {item.name}
                          </span>
                          {isActive && (
                            <motion.span
                              layoutId="mobile-active-dot"
                              className="w-1.5 h-1.5 rounded-full bg-[#dd3913] shadow-[0_0_10px_rgba(221,57,19,1)]"
                            />
                          )}
                        </button>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>

              {/* Footer block — CTA + socials */}
              <motion.div variants={menuItemVariants} className="pt-8 mt-8 border-t border-white/10 space-y-6">
                <Link href="/join" className="block w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  <button
                    className="group relative flex w-full items-center justify-center gap-2 px-4 py-4 rounded-xl bg-gradient-to-r from-[#a11f0a] via-[#dd3913] to-[#ff5a2f] text-white font-bold text-sm uppercase tracking-[0.14em] border border-white/25 shadow-[0_12px_36px_-10px_rgba(221,57,19,0.9)] active:scale-[0.98] transition-transform duration-200 overflow-hidden"
                    style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
                  >
                    <Crown className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span className="relative z-10">Become a Privilege Member</span>
                    <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2.6s_ease-in-out_infinite]" />
                  </button>
                </Link>

                <div className="flex items-center justify-between gap-4">
                  <span className="font-[Montserrat] font-semibold text-[10px] uppercase tracking-[0.24em] text-white/40">
                    United We Stand
                  </span>
                  <div className="flex gap-3">
                    {socials.map((social) => (
                      <a
                        key={social.label}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white/70 text-lg bg-white/[0.06] border border-white/10 hover:text-white hover:border-[#dd3913]/60 hover:bg-[#dd3913]/15 active:scale-95 transition-all duration-200"
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
