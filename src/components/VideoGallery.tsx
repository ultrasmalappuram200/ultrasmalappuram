'use client';

import React, { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Play } from "lucide-react";
import SectionIntro from "@/components/SectionIntro";
import { useReveal } from "@/lib/useReveal";

const CHANNEL_URL = "https://www.youtube.com/@ultrasmalappuram";

// Titles as they appear on the channel
const VIDEOS = [
  { id: "I74rJfajNHA", title: "Game Changer" },
  { id: "E_2Fjuy2nzE", title: "കൊച്ചി കത്തിക്കൽ · Matchday vlog" },
  { id: "zzv79QS9QpU", title: "ഇന്നാലും ഇന്റെ റഫറി · MFC vs Kombans" },
  { id: "yorkfkgp33A", title: "This Is Malappuram" },
  { id: "IawPbfvEf3A", title: "Matchday vlog · Malappuram FC vs Kannur Warriors" },
  { id: "gHHJh3WS89M", title: "MFC Team Launch" }
];

const pad = (n: number) => String(n).padStart(2, "0");

const VideoGallery = () => {
  const ref = useReveal<HTMLElement>();
  const [current, setCurrent] = useState(0);
  // The YouTube player only loads once someone presses play
  const [playing, setPlaying] = useState(false);
  const video = VIDEOS[current];

  return (
    <section ref={ref} aria-labelledby="videos-heading" className="relative bg-[#0f132b] px-5 py-24 font-[Montserrat] text-white sm:px-10 sm:py-32 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          id="videos-heading"
          label="Videos"
          index="05"
          title={
            <>
              Watch <span className="text-[#dd3913]">the noise.</span>
            </>
          }
          intro="Matchday vlogs, films and moments from the stands, straight from our YouTube channel."
        />

        <div className="mt-14 grid gap-8 sm:mt-20 lg:grid-cols-12 lg:gap-10">
          <div data-reveal className="lg:col-span-8">
            <div className="relative aspect-video overflow-hidden bg-black">
              {playing ? (
                <iframe
                  key={video.id}
                  src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 size-full"
                />
              ) : (
                <button type="button" onClick={() => setPlaying(true)} aria-label={`Play ${video.title}`} className="group absolute inset-0">
                  <Image
                    key={video.id}
                    src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex size-18 items-center justify-center rounded-full bg-[#dd3913] transition-transform duration-500 group-hover:scale-110 sm:size-24">
                      <Play className="ml-1 size-7 fill-white text-white sm:size-9" aria-hidden />
                    </span>
                  </span>
                </button>
              )}
            </div>

            <div className="mt-5 flex items-start justify-between gap-6">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#dd3913]">Now showing · {pad(current + 1)}</p>
                <h3 className="mt-2 text-xl leading-snug font-bold sm:text-2xl">{video.title}</h3>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group hidden shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/60 transition-colors duration-300 hover:text-white sm:flex"
              >
                YouTube
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" aria-hidden />
              </a>
            </div>
          </div>

          <ol data-reveal style={{ "--reveal-delay": 120 } as React.CSSProperties} className="border-t border-white/10 lg:col-span-4">
            {VIDEOS.map((item, i) => {
              const active = i === current;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrent(i);
                      setPlaying(true);
                    }}
                    aria-current={active}
                    className="group flex w-full items-center gap-4 border-b border-white/10 py-4 text-left transition-colors duration-300 hover:bg-white/3"
                  >
                    <span className="relative aspect-video w-28 shrink-0 overflow-hidden">
                      <Image src={`https://img.youtube.com/vi/${item.id}/mqdefault.jpg`} alt="" fill sizes="112px" className="object-cover" />
                      {active && <span className="absolute inset-0 border-2 border-[#dd3913]" />}
                    </span>
                    <span className="min-w-0">
                      <span className={`block text-[11px] font-semibold tabular-nums ${active ? "text-[#dd3913]" : "text-white/40"}`}>{pad(i + 1)}</span>
                      <span className={`mt-1 line-clamp-2 text-sm leading-snug font-semibold ${active ? "text-white" : "text-white/70 group-hover:text-white"}`}>
                        {item.title}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-reveal
          className="group relative mt-14 flex items-center justify-between gap-6 overflow-hidden border border-white/10 px-5 py-7 before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-[#dd3913] before:transition-transform before:duration-700 before:ease-[cubic-bezier(0.65,0,0.35,1)] hover:before:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dd3913] sm:mt-20 sm:px-8 sm:py-10"
        >
          <span className="relative min-w-0">
            <span className="block text-xs font-semibold tracking-widest text-white/50 transition-colors duration-500 group-hover:text-white/80 sm:text-sm">
              @ultrasmalappuram
            </span>
            <span className="mt-3 block text-[clamp(1.75rem,5vw,3.75rem)] leading-none font-extrabold uppercase tracking-[-0.03em]">More on YouTube</span>
          </span>
          <span className="relative flex size-14 shrink-0 items-center justify-center rounded-full border border-white/25 transition-colors duration-500 group-hover:border-white group-hover:bg-white group-hover:text-[#dd3913] sm:size-20">
            <ArrowUpRight className="size-6 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:rotate-45 sm:size-8" aria-hidden />
          </span>
        </a>
      </div>
    </section>
  );
};

export default React.memo(VideoGallery);
