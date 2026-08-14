"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PROFILE_URL = "https://www.instagram.com/ultras.malappuram/";
const HANDLE = "@ultras.malappuram";
const EMBED_SCRIPT = "https://www.instagram.com/embed.js";

// Latest posts. To update, swap in the permalink of any post
// (https://www.instagram.com/p/XXXXXXXX/) — nothing else needs to change.
const permalinks = [
  "https://www.instagram.com/p/Db8lKN_SBgm/",
  "https://www.instagram.com/p/Db0wKe6P65N/",
  "https://www.instagram.com/p/DbVuYLLyy4T/",
];

const IG_GRADIENT =
  "linear-gradient(45deg, #feda75 0%, #fa7e1e 25%, #d62976 50%, #962fbf 75%, #4f5bd5 100%)";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

/** Loads Instagram's embed script once, reusing it across mounts. */
const loadEmbedScript = () =>
  new Promise<void>((resolve, reject) => {
    if (window.instgrm) return resolve();

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${EMBED_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = EMBED_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.body.appendChild(script);
  });

const Instagram = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  /** Scrolls the mobile track to a slide. No-op on lg, where the track is a grid. */
  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;

    const clamped = Math.max(0, Math.min(index, track.children.length - 1));
    const slide = track.children[clamped] as HTMLElement | undefined;
    if (slide) track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }, []);

  // Keep the dots in sync when the user scrolls the track directly
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame: number | null = null;
    const onScroll = () => {
      if (frame) return; // rAF-throttled — scroll fires far faster than we need
      frame = requestAnimationFrame(() => {
        frame = null;
        const slides = Array.from(track.children) as HTMLElement[];
        // Whichever slide starts closest to the current scroll position wins
        const nearest = slides.reduce(
          (best, slide, i) => {
            const distance = Math.abs(slide.offsetLeft - track.offsetLeft - track.scrollLeft);
            return distance < best.distance ? { index: i, distance } : best;
          },
          { index: 0, distance: Infinity }
        );
        setActive(nearest.index);
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const hydrateEmbeds = useCallback(async () => {
    try {
      await loadEmbedScript();
      // Replaces each blockquote with Instagram's iframe
      window.instgrm?.Embeds.process();
    } catch {
      // Script blocked (ad blocker, offline) — the fallback links stay usable
    }
  }, []);

  // ── Only fetch Instagram's ~100KB script once the section nears the viewport ──
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          hydrateEmbeds();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hydrateEmbeds]);

  return (
    <section
      ref={sectionRef}
      id="instagram"
      className="relative py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-[#1a1f3c] via-[#161a35] to-[#1a1f3c] overflow-hidden"
    >
      {/* CSS-only decorative lines — matches the sibling sections */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#dd3913]/20 to-transparent origin-left"
            style={{
              width: `${320 + i * 70}px`,
              top: `${12 + i * 22}%`,
              left: `${6 + i * 14}%`,
              transform: `rotate(${-14 + i * 9}deg) scaleX(0)`,
              animation: `decoSweep ${5 + i}s ease-in-out infinite`,
              animationDelay: `${i * 1.2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#dd3913] text-white text-sm font-bold uppercase tracking-wider transform -skew-x-12 shadow-lg mb-6">
            <FaInstagram className="skew-x-12 text-base" aria-hidden="true" />
            <span className="skew-x-12">Instagram</span>
          </div>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
          >
            Voice Of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dd3913] via-[#ff5a2f] to-[#dd3913]">
              The Ultras
            </span>
          </h2>
          <p className="mt-4 font-[Montserrat] text-sm sm:text-base text-gray-400">
            Fresh posts from {HANDLE} and the club
          </p>
        </motion.div>

        {/* Embeds */}
        {/* Horizontal snap-carousel below lg, static 3-up grid from lg */}
        <div
          ref={trackRef}
          className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none no-scrollbar scroll-smooth justify-items-center"
        >
          {permalinks.map((permalink) => (
            <div
              key={permalink}
              className="shrink-0 w-full lg:w-auto snap-center flex justify-center"
            >
              <div
                // Fixed height + `ig-embed-card` (see globals.css) keeps every card
                // identical regardless of how long each post's content is.
                className="ig-embed-card relative w-full max-w-[540px] h-[560px] sm:h-[620px] rounded-2xl overflow-hidden border border-white/10 bg-white shadow-[0_16px_44px_-16px_rgba(0,0,0,0.7)]"
              >
                {/* Captions omitted on purpose: they run to wildly different
                    lengths (hashtag/keyword blocks) and wreck the uniform grid. */}
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={permalink}
                  data-instgrm-version="14"
                  style={{ background: "#FFF", border: 0, padding: 0 }}
                >
                  {/* Fallback shown if embed.js is blocked or still loading */}
                  <div style={{ padding: 16 }}>
                    <a
                      href={permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#3897f0", fontSize: 14, fontWeight: 550, textDecoration: "none" }}
                    >
                      View this post on Instagram
                    </a>
                  </div>
                </blockquote>

                {/* Softens the bottom clip so it reads as a deliberate crop */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white via-white/85 to-transparent"
                  aria-hidden="true"
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Carousel controls (below lg only) ──
            Sit under the track rather than over it: the cards are iframes, so
            overlaid arrows would cover post content, and touch-swipe is
            swallowed by the iframe — these are the primary way to navigate. */}
        <div className="lg:hidden mt-6 flex items-center justify-center gap-5">
          <button
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label="Previous post"
            className="w-11 h-11 rounded-full flex items-center justify-center border border-white/15 bg-white/[0.06] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.12] hover:border-[#dd3913]/50 active:scale-95 transition-all duration-200"
          >
            <FaChevronLeft className="text-sm" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-2">
            {permalinks.map((permalink, i) => (
              <button
                key={permalink}
                onClick={() => goTo(i)}
                aria-label={`Go to post ${i + 1}`}
                aria-current={i === active}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active ? "w-6 bg-[#dd3913]" : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(active + 1)}
            disabled={active === permalinks.length - 1}
            aria-label="Next post"
            className="w-11 h-11 rounded-full flex items-center justify-center border border-white/15 bg-white/[0.06] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.12] hover:border-[#dd3913]/50 active:scale-95 transition-all duration-200"
          >
            <FaChevronRight className="text-sm" aria-hidden="true" />
          </button>
        </div>

        {/* Follow CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-10 sm:mt-12 flex justify-center"
        >
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-xl font-[Montserrat] font-bold text-xs sm:text-sm uppercase tracking-[0.16em] text-white border border-white/20 shadow-[0_12px_36px_-12px_rgba(214,41,118,0.9)] hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200 overflow-hidden"
            style={{ background: IG_GRADIENT }}
          >
            <FaInstagram className="text-lg shrink-0" aria-hidden="true" />
            <span className="relative z-10">Follow {HANDLE}</span>
            <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent group-hover:animate-[shimmer_1.1s_ease-in-out_infinite]" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(Instagram);
