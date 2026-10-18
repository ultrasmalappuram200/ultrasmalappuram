"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import SectionIntro from "@/components/SectionIntro";
import { useReveal } from "@/lib/useReveal";

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

const pad = (n: number) => String(n).padStart(2, "0");

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

const CONTROL =
  "flex size-11 items-center justify-center rounded-full border border-white/20 transition-colors duration-300 hover:border-white hover:bg-white hover:text-[#1a1f3c] disabled:pointer-events-none disabled:opacity-30";

const Instagram = () => {
  const sectionRef = useReveal<HTMLElement>();
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  /** Scrolls the mobile track to a slide. No-op on lg, where the track is a grid. */
  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;

    const clamped = Math.max(0, Math.min(index, track.children.length - 1));
    const slide = track.children[clamped] as HTMLElement | undefined;
    if (slide) track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }, []);

  // Keep the counter in sync when the user scrolls the track directly
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
  }, [hydrateEmbeds, sectionRef]);

  return (
    <section ref={sectionRef} aria-labelledby="instagram-heading" className="relative bg-[#1a1f3c] px-5 py-24 font-[Montserrat] text-white sm:px-10 sm:py-32 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          id="instagram-heading"
          label="Instagram"
          index="06"
          title={
            <>
              Voice of <span className="text-[#dd3913]">the ultras.</span>
            </>
          }
          intro={`Fresh posts from ${HANDLE} and the club.`}
        />

        {/* Horizontal snap-carousel below lg, static 3-up grid from lg */}
        <div
          ref={trackRef}
          data-reveal
          className="mt-14 flex snap-x snap-mandatory justify-items-center gap-5 overflow-x-auto scroll-smooth no-scrollbar sm:mt-20 lg:grid lg:snap-none lg:grid-cols-3 lg:overflow-visible"
        >
          {permalinks.map((permalink) => (
            <div key={permalink} className="flex w-full shrink-0 snap-center justify-center lg:w-auto">
              <div
                // Fixed height + `ig-embed-card` (see globals.css) keeps every card
                // identical regardless of how long each post's content is.
                className="ig-embed-card relative h-[560px] w-full max-w-[540px] overflow-hidden border border-white/10 bg-white sm:h-[620px]"
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
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-white via-white/85 to-transparent"
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
        <div className="mt-6 flex items-center justify-between lg:hidden">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50 tabular-nums">
            {pad(active + 1)} / {pad(permalinks.length)}
          </span>
          <div className="flex gap-3">
            <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous post" className={CONTROL}>
              <ArrowLeft className="size-5" aria-hidden />
            </button>
            <button type="button" onClick={() => goTo(active + 1)} disabled={active === permalinks.length - 1} aria-label="Next post" className={CONTROL}>
              <ArrowRight className="size-5" aria-hidden />
            </button>
          </div>
        </div>

        <a
          href={PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-reveal
          className="group relative mt-14 flex items-center justify-between gap-6 overflow-hidden border border-white/10 px-5 py-7 before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-[#dd3913] before:transition-transform before:duration-700 before:ease-[cubic-bezier(0.65,0,0.35,1)] hover:before:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dd3913] sm:mt-20 sm:px-8 sm:py-10"
        >
          <span className="relative min-w-0">
            <span className="block text-xs font-semibold tracking-widest text-white/50 transition-colors duration-500 group-hover:text-white/80 sm:text-sm">
              {HANDLE}
            </span>
            <span className="mt-3 block text-[clamp(1.75rem,5vw,3.75rem)] leading-none font-extrabold uppercase tracking-[-0.03em]">Follow the stand</span>
          </span>
          <span className="relative flex size-14 shrink-0 items-center justify-center rounded-full border border-white/25 transition-colors duration-500 group-hover:border-white group-hover:bg-white group-hover:text-[#dd3913] sm:size-20">
            <ArrowUpRight className="size-6 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:rotate-45 sm:size-8" aria-hidden />
          </span>
        </a>
      </div>
    </section>
  );
};

export default React.memo(Instagram);
