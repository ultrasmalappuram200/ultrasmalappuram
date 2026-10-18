"use client";

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Crown } from "lucide-react";
import tifo from "../../public/images/tifo.webp";
import stand from "../../public/images/img2.webp";
import banner from "../../public/images/bg1.jpeg";

const SLIDES = [
  { src: tifo, alt: "Ultras Malappuram tifo display in the stands" },
  { src: stand, alt: "A packed stand of Malappuram FC supporters" },
  { src: banner, alt: "Supporters gathered behind the Ultras Malappuram banner" }
];

const SLIDE_SECONDS = 6;
const LINES = [
  { word: "ULTRAS", color: "text-white" },
  { word: "MALAPPURAM", color: "text-[#dd3913]" }
];

const pad = (n: number) => String(n).padStart(2, "0");

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const subscribeToMotionPreference = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const scrollToMatches = (event: React.MouseEvent) => {
  const target = document.getElementById("matches");
  if (!target) return;
  event.preventDefault();
  const navHeight = document.querySelector("nav")?.offsetHeight ?? 0;
  window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navHeight, behavior: "smooth" });
};

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  // Bumped on every slide change so the progress bar animation restarts
  const [cycle, setCycle] = useState(0);
  // Later slides load only after the first one, so they never compete with it
  const [firstLoaded, setFirstLoaded] = useState(false);
  const [inView, setInView] = useState(true);
  // No automatic slideshow for people who prefer reduced motion
  const autoplay = !useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );

  // Pause the slideshow while the hero is off screen
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback((next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
    setCycle((c) => c + 1);
  }, []);

  return (
    <section ref={sectionRef} className="relative isolate flex min-h-svh flex-col overflow-hidden bg-[#0f132b] font-[Montserrat] text-white">
      {/* Slides: opacity-only cross-fade */}
      <div className="absolute inset-0 -z-10">
        {SLIDES.map((slide, i) =>
          i === 0 || firstLoaded ? (
            <Image
              key={i}
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              placeholder="blur"
              sizes="100vw"
              onLoad={i === 0 ? () => setFirstLoaded(true) : undefined}
              className={`object-cover transition-opacity duration-1400 ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
            />
          ) : null
        )}
        {/* Darken the bottom and left, where the type sits */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,#0f132b_8%,rgba(15,19,43,0.6)_45%,rgba(15,19,43,0.35))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,19,43,0.75),transparent_65%)]" />
      </div>

      {/* @container: the lockup is sized to this column's width (cqw), not the viewport */}
      <div className="@container mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 pt-24 pb-6 sm:px-10 sm:pt-32 sm:pb-8 lg:px-16">
        <div className="hero-fade flex items-center justify-between gap-4 border-b border-white/15 pb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/75 sm:text-xs">
          <span className="flex items-center gap-2.5">
            <span className="size-1.5 shrink-0 rounded-full bg-[#dd3913]" />
            Official supporters of Malappuram FC
          </span>
          <span className="hidden md:inline">Super League Kerala</span>
        </div>

        <div className="flex flex-1 flex-col justify-end gap-8 pt-16 sm:gap-10">
          <h1 aria-label="Ultras Malappuram" className="order-1 text-[13.3cqw] font-extrabold leading-[0.82] tracking-[-0.05em] lg:order-2">
            {LINES.map(({ word, color }, line) => (
              <span key={word} aria-hidden className={`flex overflow-hidden pb-[0.04em] ${color}`}>
                {word.split("").map((letter, i) => (
                  <span key={i} className="hero-rise inline-block" style={{ animationDelay: `${150 + (line * 6 + i) * 45}ms` }}>
                    {letter}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <div className="hero-fade order-2 flex flex-col gap-6 lg:order-1 lg:ml-auto lg:max-w-md" style={{ animationDelay: "600ms" }}>
            <p className="text-lg leading-relaxed text-white/80 sm:text-xl">
              The heartbeat of <span className="font-semibold text-white">Malappuram FC</span>. Passion, unity and unwavering support.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/join"
                className="flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#dd3913] px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-300 hover:bg-[#ff5a2f]"
              >
                <Crown className="size-4 shrink-0" aria-hidden />
                Become a member
              </Link>
              <a
                href="#matches"
                onClick={scrollToMatches}
                className="group flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/35 px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-300 hover:border-white hover:bg-white hover:text-[#0f132b]"
              >
                Match centre
                <ArrowDown className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden />
              </a>
            </div>
          </div>

          <div
            className="hero-fade order-3 flex items-center justify-between gap-6 border-t border-white/15 pt-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60"
            style={{ animationDelay: "800ms" }}
          >
            <span className="tabular-nums">
              {pad(index + 1)} / {pad(SLIDES.length)}
            </span>
            <div className="flex gap-2">
              {SLIDES.map((slide, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show photo ${i + 1}: ${slide.alt}`}
                  aria-current={i === index}
                  className="relative h-6 w-10 sm:w-16"
                >
                  <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-white/25" />
                  {i === index && (
                    <span
                      key={cycle}
                      // When the bar fills, move on; pausing the animation pauses the slideshow too
                      onAnimationEnd={autoplay ? () => goTo(index + 1) : undefined}
                      className={`absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 origin-left bg-white ${
                        autoplay ? "animate-[hero-progress_var(--slide)_linear_forwards]" : "scale-x-100"
                      } ${inView ? "" : "[animation-play-state:paused]"}`}
                      style={{ "--slide": `${SLIDE_SECONDS}s` } as React.CSSProperties}
                    />
                  )}
                </button>
              ))}
            </div>
            <span className="hidden items-center gap-3 sm:flex">
              Scroll
              <span className="h-px w-10 bg-white/60" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Hero);
