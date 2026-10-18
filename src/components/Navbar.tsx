'use client';

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Crown } from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import RollText from "@/components/RollText";
import { emitMenuState } from "@/lib/uiEvents";
import crest from "../../public/images/ultras-logo.png";

const NAV_ITEMS = [
  { name: "Home", id: "home" },
  { name: "About", id: "about" },
  { name: "Standings", id: "standings" },
  { name: "Matches", id: "matches" },
  { name: "Gallery", id: "gallery" }
];

// Sections watched for the active link ("contact" is the footer, so no link lights up there)
const TRACKED_SECTIONS = [...NAV_ITEMS.map((item) => item.id), "contact"];

const SOCIALS = [
  { Icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/ultras.malappuram/" },
  { Icon: FaYoutube, label: "YouTube", href: "https://www.youtube.com/@ultrasmalappuram" }
];

const EASE = "ease-[cubic-bezier(0.65,0,0.35,1)]";
const pad = (n: number) => String(n).padStart(2, "0");

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active link: whichever section crosses a thin band across the middle of the screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActiveSection(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    TRACKED_SECTIONS.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  // Tell the rest of the page (BackToTop) to get out of the overlay's way
  useEffect(() => {
    emitMenuState(menuOpen);
  }, [menuOpen]);

  // Lock body scroll and close on Escape while the full-screen menu is open
  useEffect(() => {
    if (!menuOpen) return;

    const { overflow, paddingRight } = document.body.style;
    // Compensate for the scrollbar so the page doesn't shift under the overlay
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // Smooth scroll that leaves room for the fixed bar
  const scrollToSection = useCallback((event: React.MouseEvent, sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    event.preventDefault();
    setMenuOpen(false);

    // Wait a frame so the scroll lock is released before scrolling
    requestAnimationFrame(() => {
      const navHeight = document.querySelector("nav")?.offsetHeight || 0;
      const top = element.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: "smooth" });
    });
  }, []);

  const solid = isScrolled && !menuOpen;

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 border-b font-[Montserrat] transition-colors duration-300 ${
          solid ? "border-white/10 bg-[#0f132b]/95" : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:h-20 sm:px-10 lg:px-16">
          <a href="#home" onClick={(e) => scrollToSection(e, "home")} className="group flex items-center gap-3">
            <Image
              src={crest}
              alt="Ultras Malappuram"
              sizes="44px"
              className="size-10 rounded-full ring-1 ring-white/20 transition-shadow duration-300 group-hover:ring-[#dd3913]/70 sm:size-11"
            />
            <span className="hidden leading-tight sm:block">
              <span className="block text-sm font-extrabold tracking-[0.02em] text-white lg:text-base">ULTRAS MALAPPURAM</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-[#ff6b4a]">Official supporters</span>
            </span>
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = activeSection === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => scrollToSection(e, item.id)}
                    aria-current={active ? "true" : undefined}
                    className={`group flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-300 focus-visible:outline-none ${
                      active ? "text-white" : "text-white/60 hover:text-white"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full bg-[#dd3913] transition-[opacity,scale] duration-300 ${active ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
                    />
                    <RollText>{item.name}</RollText>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href="/join"
              className="hidden items-center gap-2 rounded-full bg-[#dd3913] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:bg-[#ff5a2f] sm:flex"
            >
              <Crown className="size-4 shrink-0" aria-hidden />
              Privilege member
            </Link>

            {/* Two bars that cross into an X */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="relative flex size-11 items-center justify-center rounded-full border border-white/20 transition-colors duration-300 hover:border-white/50 lg:hidden"
            >
              <span className={`absolute h-0.5 w-5 rounded-full bg-white transition-transform duration-300 ${menuOpen ? "rotate-45" : "-translate-y-[3px]"}`} />
              <span className={`absolute h-0.5 w-5 rounded-full bg-white transition-transform duration-300 ${menuOpen ? "-rotate-45" : "translate-y-[3px]"}`} />
            </button>
          </div>
        </div>

        {/* Reading progress, driven by a CSS scroll timeline */}
        <div
          aria-hidden
          className={`scroll-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[#dd3913] transition-opacity duration-300 ${solid ? "opacity-100" : "opacity-0"}`}
        />
      </nav>

      {/* Full-screen menu. Rendered outside <nav> on purpose: globals.css gives nav a transform,
          which would otherwise become the containing block for this fixed overlay. */}
      <div
        id="mobile-menu"
        inert={!menuOpen}
        className={`fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-[#0f132b] px-5 pt-24 pb-10 font-[Montserrat] text-white transition-[clip-path,visibility] duration-700 ${EASE} sm:px-10 sm:pt-28 lg:hidden ${
          menuOpen ? "visible [clip-path:inset(0_0_0_0)]" : "invisible [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">Menu</p>

        <ul className="mt-6 flex-1">
          {NAV_ITEMS.map((item, index) => {
            const active = activeSection === item.id;
            return (
              <li
                key={item.id}
                style={{ transitionDelay: menuOpen ? `${180 + index * 60}ms` : "0ms" }}
                className={`border-b border-white/10 transition-[opacity,translate] duration-500 ${EASE} ${
                  menuOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
              >
                <a href={`#${item.id}`} onClick={(e) => scrollToSection(e, item.id)} className="group flex items-baseline gap-4 py-4">
                  <span className={`text-xs font-bold tabular-nums ${active ? "text-[#dd3913]" : "text-white/30"}`}>{pad(index + 1)}</span>
                  <span
                    className={`text-[clamp(2.25rem,11vw,3.5rem)] font-extrabold uppercase leading-none tracking-[-0.03em] transition-colors duration-300 ${
                      active ? "text-[#dd3913]" : "group-hover:text-[#ff8a63]"
                    }`}
                  >
                    {item.name}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <div
          style={{ transitionDelay: menuOpen ? "520ms" : "0ms" }}
          className={`mt-10 space-y-6 transition-opacity duration-500 ${menuOpen ? "opacity-100" : "opacity-0"}`}
        >
          <Link
            href="/join"
            onClick={() => setMenuOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#dd3913] px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:bg-[#ff5a2f]"
          >
            <Crown className="size-4 shrink-0" aria-hidden />
            Become a privilege member
          </Link>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">United we stand</span>
            <div className="flex gap-3">
              {SOCIALS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors duration-300 hover:border-[#dd3913] hover:bg-[#dd3913] hover:text-white"
                >
                  <Icon aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
