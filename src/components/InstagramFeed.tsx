"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaCheckCircle, FaExternalLinkAlt, FaPlay } from "react-icons/fa";

declare global {
  interface Window {
    instgrm?: {
      Embeds: { process: () => void };
    };
  }
}

type Post = {
  permalink: string;
  type: "post" | "reel";
  credit: string;
};

const POSTS: Post[] = [
  { permalink: "https://www.instagram.com/p/DbTHzl_vHBE/", type: "post", credit: "@ultras.malappuram" },
  { permalink: "https://www.instagram.com/reel/DbTOqlcsifQ/", type: "reel", credit: "@faizal_babu.e" },
  { permalink: "https://www.instagram.com/reel/DbSpbrcv2Dk/", type: "reel", credit: "@super.league.kerala" },
];

const EMBED_TIMEOUT_MS = 8000;

let scriptLoadingPromise: Promise<void> | null = null;

function loadInstagramEmbedScript(): Promise<void> {
  if (window.instgrm) return Promise.resolve();
  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve) => {
    const existing = document.getElementById(
      "instagram-embed-script"
    ) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.id = "instagram-embed-script";
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });

  return scriptLoadingPromise;
}

type CardStatus = "loading" | "loaded" | "failed";

const InstagramCard = React.memo(
  ({ post, index, shouldLoad }: { post: Post; index: number; shouldLoad: boolean }) => {
    const frameRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<CardStatus>("loading");

    useEffect(() => {
      if (!shouldLoad || !frameRef.current) return;

      const node = frameRef.current;
      const observer = new MutationObserver(() => {
        if (node.querySelector("iframe")) {
          setStatus("loaded");
          observer.disconnect();
        }
      });
      observer.observe(node, { childList: true, subtree: true });

      const timeout = setTimeout(() => {
        if (!node.querySelector("iframe")) setStatus("failed");
        observer.disconnect();
      }, EMBED_TIMEOUT_MS);

      return () => {
        observer.disconnect();
        clearTimeout(timeout);
      };
    }, [shouldLoad]);

    const isReel = post.type === "reel";

    return (
      <motion.article
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: index * 0.1 }}
        viewport={{ once: true, margin: "-60px" }}
        className="group relative shrink-0 w-[82vw] max-w-[350px] sm:w-full sm:max-w-none snap-center"
      >
        {/* Hover glow ring */}
        <div className="absolute -inset-px rounded-[1.3rem] bg-gradient-to-br from-[#dd3913] via-[#ff5a2f] to-transparent opacity-0 group-hover:opacity-70 blur-md transition-opacity duration-500 -z-10" />

        {/* Fixed-height shell keeps every card pixel-identical */}
        <div className="relative flex h-[540px] sm:h-[560px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg transition-all duration-500 group-hover:-translate-y-1.5 group-hover:border-[#dd3913]/50 group-hover:shadow-2xl">
          {/* Type badge */}
          <span
            className={`pointer-events-none absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md ${
              isReel
                ? "bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]"
                : "bg-[#dd3913]"
            }`}
          >
            {isReel ? <FaPlay className="text-[9px]" /> : <FaInstagram className="text-[10px]" />}
            {isReel ? "Reel" : "Post"}
          </span>

          {/* Embed viewport — flexes to fill, clips the taller reel frames */}
          <div className="relative flex-1 overflow-hidden">
            {shouldLoad && status !== "failed" && (
              <div ref={frameRef} className="ig-frame absolute inset-0 overflow-hidden">
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={`${post.permalink}?utm_source=ig_embed&utm_campaign=loading`}
                  data-instgrm-version="14"
                />
              </div>
            )}

            {/* Skeleton stays mounted underneath until the iframe paints */}
            {status === "loading" && (
              <div className="absolute inset-0 overflow-hidden bg-white/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaInstagram className="text-4xl text-white/25" />
                </div>
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
            )}

            {status === "failed" && (
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/5 text-gray-300 transition-colors duration-300 hover:bg-white/10 hover:text-white"
              >
                <FaInstagram className="text-4xl text-[#dd3913]" />
                <span className="px-6 text-center text-sm font-semibold">
                  Open this {post.type} on Instagram
                </span>
                <FaExternalLinkAlt className="text-xs opacity-60" />
              </a>
            )}

            {/* Soft fade so the clipped frame edge reads as intentional */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#1a1f3c] to-transparent"
              aria-hidden="true"
            />
          </div>

          {/* Footer pinned to the bottom of every card */}
          <div className="flex h-12 shrink-0 items-center justify-between border-t border-white/10 bg-white/[0.03] px-4">
            <span className="truncate text-xs font-medium text-gray-400">{post.credit}</span>
            <a
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#dd3913] hover:underline"
            >
              View <FaExternalLinkAlt className="text-[10px]" />
            </a>
          </div>
        </div>
      </motion.article>
    );
  }
);
InstagramCard.displayName = "InstagramCard";

const InstagramFeed = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Only fetch the Instagram embed script once the section nears the viewport
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    loadInstagramEmbedScript().then(() => {
      window.instgrm?.Embeds.process();
    });
  }, [shouldLoad]);

  // rAF-throttled so the dot indicator never thrashes during a flick-scroll
  const rafRef = useRef<number | null>(null);
  const handleScroll = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = scrollRef.current;
      if (!el) return;
      const card = el.firstElementChild as HTMLElement | null;
      if (!card) return;
      const stride = card.clientWidth + 20; // card + gap-5
      setActiveIndex(Math.min(Math.round(el.scrollLeft / stride), POSTS.length - 1));
    });
  }, []);

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  const scrollToIndex = useCallback((i: number) => {
    const card = scrollRef.current?.children[i] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="instagram"
      className="relative overflow-hidden bg-gradient-to-br from-[#1a1f3c] via-[#1a1f3c]/95 to-[#1a1f3c] px-4 py-16 sm:px-6 sm:py-24"
    >
      {/* CSS-only decorative lines — zero JS runtime cost */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute h-px origin-left bg-gradient-to-r from-transparent via-[#dd3913]/20 to-transparent"
            style={{
              width: `${300 + i * 60}px`,
              top: `${15 + i * 20}%`,
              left: `${10 + i * 15}%`,
              transform: `rotate(${-12 + i * 6}deg) scaleX(0)`,
              animation: `decoSweep ${6 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="mb-6 inline-flex -skew-x-12 items-center gap-3 bg-[#dd3913] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg">
            <FaInstagram className="text-lg" />
            <span>Instagram</span>
          </div>
          <h2
            className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
          >
            Straight From{" "}
            <span className="bg-gradient-to-r from-[#dd3913] via-[#ff5a2f] to-[#dd3913] bg-clip-text text-transparent">
              The Terraces
            </span>
          </h2>
        </motion.div>

        {/* Profile preview strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-14 inline-flex max-w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md sm:gap-5 sm:px-6"
        >
          <div className="relative shrink-0">
            <div className="absolute -inset-0.5 animate-[spin_6s_linear_infinite] rounded-full bg-gradient-to-tr from-[#dd3913] via-[#ff5a2f] to-[#fcb045]" />
            <img
              src="/images/ultras-logo.png"
              alt="Ultras Malappuram"
              width={64}
              height={64}
              loading="lazy"
              decoding="async"
              className="relative h-14 w-14 rounded-full border-2 border-[#1a1f3c] object-cover sm:h-16 sm:w-16"
            />
          </div>
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-1.5">
              <span
                className="truncate text-base font-bold text-white sm:text-lg"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                ultras.malappuram
              </span>
              <FaCheckCircle className="shrink-0 text-sm text-[#dd3913]" />
            </div>
            <p className="max-w-[220px] truncate text-xs text-gray-400 sm:max-w-xs sm:text-sm">
              Official Supporters Group · Malappuram
            </p>
          </div>
          <a
            href="https://www.instagram.com/ultras.malappuram"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 shrink-0 rounded-full bg-gradient-to-r from-[#dd3913] to-[#ff5a2f] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(221,57,19,0.5)] active:scale-95 sm:ml-3 sm:px-5 sm:text-sm"
          >
            Follow
          </a>
        </motion.div>

        {/* Uniform cards — snap carousel on mobile, equal-width grid from sm up */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 sm:gap-6"
        >
          {POSTS.map((post, i) => (
            <InstagramCard key={post.permalink} post={post} index={i} shouldLoad={shouldLoad} />
          ))}
        </div>

        {/* Scroll dots — carousel breakpoint only */}
        <div className="mt-5 flex justify-center gap-2 sm:hidden">
          {POSTS.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to post ${i + 1}`}
              onClick={() => scrollToIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === i ? "w-6 bg-[#dd3913]" : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>

        <motion.a
          href="https://www.instagram.com/ultras.malappuram"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-14 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#dd3913] to-[#ff5a2f] px-8 py-4 font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:shadow-2xl"
        >
          <FaInstagram className="text-xl" />
          Follow @ultras.malappuram
        </motion.a>
      </div>
    </section>
  );
};

export default React.memo(InstagramFeed);
