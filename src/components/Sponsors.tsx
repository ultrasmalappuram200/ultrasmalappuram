"use client";

import React from "react";
import Image, { type StaticImageData } from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useReveal } from "@/lib/useReveal";
import chicking from "../../public/images/sponsors/chicking.png";
import bismiHypermarket from "../../public/images/sponsors/BismiHyperMarket.webp";
import bismiConnect from "../../public/images/sponsors/BismiConnect.webp";
import noSecrets from "../../public/images/sponsors/NoSecrets.webp";

const INSTAGRAM_URL = "https://www.instagram.com/ultras.malappuram/";

interface Sponsor {
  name: string;
  logo: StaticImageData;
  // "transparent": the mark sits on a transparent background; "light": it's baked onto a white box
  background: "transparent" | "light";
  // Evens out optical size between the marks
  scale: number;
  // Crops a file's built-in padding: the aspect ratio of the band around the mark (object-fit: cover)
  crop?: string;
}

const sponsors: Sponsor[] = [
  { name: "Chicking", logo: chicking, background: "transparent", scale: 1.05 },
  { name: "Bismi Hypermarket", logo: bismiHypermarket, background: "light", scale: 1.11, crop: "404 / 145" },
  { name: "Bismi Connect", logo: bismiConnect, background: "light", scale: 0.92 },
  { name: "NoSecrets", logo: noSecrets, background: "transparent", scale: 1 }
];

// Every logo is shown as a white mark so the wall reads as one system. Transparent logos are
// flattened to white; boxed logos are inverted and screen-blended so the white box disappears.
const LOGO_FILTER: Record<Sponsor["background"], string> = {
  transparent: "brightness-0 invert",
  light: "mix-blend-screen [filter:grayscale(1)_contrast(1.2)_invert(1)_brightness(1.6)]"
};

const pad = (n: number) => String(n).padStart(2, "0");

const Sponsors = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-labelledby="partners-heading"
      className="relative bg-[#1a1f3c] px-5 py-24 font-[Montserrat] text-white sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <div
          data-reveal
          className="flex items-center justify-between border-b border-white/10 pb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50 sm:text-xs"
        >
          <span className="flex items-center gap-2.5">
            <span className="size-1.5 rounded-full bg-[#dd3913]" />
            Our partners
          </span>
          <span className="tabular-nums">({pad(sponsors.length)})</span>
        </div>

        <div className="mt-10 grid gap-6 sm:mt-14 lg:grid-cols-12 lg:items-end lg:gap-10">
          <h2
            id="partners-heading"
            data-reveal
            className="text-[clamp(2.25rem,8vw,6.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em] text-balance lg:col-span-8"
          >
            Backed by the ones who <span className="text-[#dd3913]">believe.</span>
          </h2>
          <p
            data-reveal
            style={{ "--reveal-delay": 120 } as React.CSSProperties}
            className="max-w-sm text-base leading-relaxed text-white/60 sm:text-lg lg:col-span-4 lg:justify-self-end"
          >
            Local businesses that stand with Ultras Malappuram, from the first chant to the final whistle.
          </p>
        </div>

        {/* Logo wall: the 1px gaps over a lighter background draw the hairline grid */}
        <ul className="mt-14 grid grid-cols-2 gap-px border border-white/10 bg-white/10 [--logo-w:6.5rem] sm:mt-20 sm:[--logo-w:8.5rem] lg:grid-cols-4 lg:[--logo-w:9.5rem]">
          {sponsors.map((sponsor, index) => (
            <li
              key={sponsor.name}
              data-reveal
              style={{ "--reveal-delay": index * 90 } as React.CSSProperties}
              className="group relative flex aspect-square flex-col justify-between overflow-hidden bg-[#1a1f3c] p-4 sm:aspect-4/3 before:absolute before:inset-0 before:origin-bottom before:scale-y-0 before:bg-[#dd3913] before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.65,0,0.35,1)] hover:before:scale-y-100 sm:p-6"
            >
              <span className="relative text-[11px] font-semibold tabular-nums text-white/40 transition-colors duration-500 group-hover:text-white/80">
                {pad(index + 1)}
              </span>
              <span className="relative flex flex-1 items-center justify-center py-3">
                <Image
                  src={sponsor.logo}
                  alt=""
                  sizes="(min-width: 1024px) 200px, (min-width: 640px) 175px, 135px"
                  style={{ width: `calc(var(--logo-w) * ${sponsor.scale})`, aspectRatio: sponsor.crop }}
                  className={`h-auto max-w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-110 ${LOGO_FILTER[sponsor.background]}`}
                />
              </span>
              <span className="relative text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors duration-500 group-hover:text-white sm:text-xs sm:tracking-[0.18em]">
                {sponsor.name}
              </span>
            </li>
          ))}
        </ul>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-reveal
          className="group relative -mt-px flex items-center justify-between gap-6 overflow-hidden border border-white/10 px-5 py-7 before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-[#dd3913] before:transition-transform before:duration-700 before:ease-[cubic-bezier(0.65,0,0.35,1)] hover:before:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dd3913] sm:px-8 sm:py-10"
        >
          <span className="relative min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50 transition-colors duration-500 group-hover:text-white/80 sm:text-xs">
              Your brand on the terraces?
            </span>
            <span className="mt-3 block text-[clamp(1.75rem,5vw,3.75rem)] font-extrabold uppercase leading-none tracking-[-0.03em]">
              Become a partner
            </span>
            <span className="mt-3 block text-sm text-white/50 transition-colors duration-500 group-hover:text-white/85">
              Message us on Instagram
            </span>
          </span>
          <span className="relative flex size-14 shrink-0 items-center justify-center rounded-full border border-white/25 transition-colors duration-500 group-hover:border-white group-hover:bg-white group-hover:text-[#dd3913] sm:size-20">
            <ArrowUpRight className="size-6 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:rotate-45 sm:size-8" aria-hidden />
          </span>
        </a>
      </div>
    </section>
  );
};

export default React.memo(Sponsors);
