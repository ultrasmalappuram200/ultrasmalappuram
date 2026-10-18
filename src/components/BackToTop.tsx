'use client'

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { onMenuState } from "@/lib/uiEvents";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // The full-screen menu covers the page — don't float this button over it
  useEffect(() => onMenuState(setIsMenuOpen), []);

  const shown = isVisible && !isMenuOpen;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
      className={`group fixed right-5 bottom-5 z-50 flex size-12 items-center justify-center rounded-full bg-[#dd3913] text-white shadow-[0_12px_32px_-10px_rgba(221,57,19,0.9)] transition-[opacity,scale,background-color] duration-300 hover:bg-[#ff5a2f] sm:right-8 sm:bottom-8 ${
        shown ? "scale-100 opacity-100" : "pointer-events-none scale-50 opacity-0"
      }`}
    >
      <ArrowUp className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden />
    </button>
  );
};

export default React.memo(BackToTop);
