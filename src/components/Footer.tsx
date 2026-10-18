'use client'

import React, { useEffect, useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import RollText from "@/components/RollText";
import { useReveal } from "@/lib/useReveal";
import crest from "../../public/images/ultras-logo.png";

const NAV_LINKS = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Standings", id: "standings" },
  { label: "Matches", id: "matches" },
  { label: "Gallery", id: "gallery" }
];

const SOCIAL_LINKS = [
  { label: "Instagram", handle: "@ultras.malappuram", href: "https://www.instagram.com/ultras.malappuram/" },
  { label: "YouTube", handle: "@ultrasmalappuram", href: "https://www.youtube.com/@ultrasmalappuram" }
];

const TICKER = ["United we stand", "Ultras Malappuram", "Malappuram FC", "Super League Kerala"];
// Repeated so each half of the track is wider than any screen
const TICKER_HALF = [...TICKER, ...TICKER, ...TICKER];

const EASE = "ease-[cubic-bezier(0.65,0,0.35,1)]";

const clock = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false });

// Same offset as the navbar, so the section doesn't end up underneath it
const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  const navHeight = document.querySelector("nav")?.offsetHeight ?? 0;
  window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navHeight, behavior: "smooth" });
};

function LocalTime() {
  const [time, setTime] = useState(() => clock.format(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(clock.format(new Date())), 10_000);
    return () => clearInterval(id);
  }, []);

  const [hours, minutes] = time.split(":");
  return (
    <p className="text-5xl font-extrabold tracking-[-0.04em] tabular-nums sm:text-6xl">
      {hours}
      <span className="animate-[blink_1.2s_steps(1)_infinite]">:</span>
      {minutes}
    </p>
  );
}

// Circular call to action with a slowly rotating ring of text
function JoinButton() {
  const ringId = useId();
  return (
    <Link
      href="/join"
      aria-label="Join the Ultras: become a privilege member"
      className={`group relative flex size-36 shrink-0 items-center justify-center rounded-full bg-[#dd3913] text-white shadow-[0_20px_60px_-15px_rgba(221,57,19,0.7)] transition-transform duration-500 ${EASE} hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:size-44`}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-[spin_18s_linear_infinite] motion-reduce:animate-none" aria-hidden>
        <path id={ringId} d="M50,50 m-39,0 a39,39 0 1,1 78,0 a39,39 0 1,1 -78,0" fill="none" />
        <text className="fill-white text-[7.5px] font-bold uppercase">
          <textPath href={`#${ringId}`} textLength="244" lengthAdjust="spacing">
            Join the Ultras ✦ Become a member ✦
          </textPath>
        </text>
      </svg>
      <ArrowUpRight className={`size-9 transition-transform duration-500 ${EASE} group-hover:rotate-45 sm:size-11`} aria-hidden />
    </Link>
  );
}

const Footer = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <footer ref={ref} className="relative overflow-hidden bg-[#0f132b] font-[Montserrat] text-white">
      {/* Ticker */}
      <div className="overflow-hidden bg-[#dd3913] py-3 sm:py-4" aria-hidden>
        <div className="flex w-max animate-[marquee_60s_linear_infinite] motion-reduce:animate-none">
          {[0, 1].map((half) => (
            <div key={half} className="flex shrink-0 items-center">
              {TICKER_HALF.map((item, i) => (
                <span key={i} className="flex items-center gap-6 pr-6 text-sm font-extrabold uppercase tracking-[0.2em] sm:text-base">
                  {item}
                  <span className="text-[#0f132b]">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 pt-20 sm:px-10 sm:pt-28 lg:px-16">
        {/* Call to action */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p data-reveal className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50 sm:text-xs">
              <span className="size-1.5 rounded-full bg-[#dd3913]" />
              Matchday is calling
            </p>
            <h2
              data-reveal
              style={{ "--reveal-delay": 80 } as React.CSSProperties}
              className="mt-6 text-[clamp(3rem,11vw,9.5rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.05em]"
            >
              Be part of
              <br />
              {/* Fill in the background colour painted over the stroke hides the font's overlapping inner contours */}
              <span className="text-[#0f132b] [-webkit-text-stroke:3px_#dd3913] [paint-order:stroke_fill] sm:[-webkit-text-stroke:4px_#dd3913]">the roar.</span>
            </h2>
            <p
              data-reveal
              style={{ "--reveal-delay": 160 } as React.CSSProperties}
              className="mt-8 max-w-md text-base leading-relaxed text-white/60 sm:text-lg"
            >
              Become a privilege member and unlock matchday perks with the loudest stand in Malappuram.
            </p>
          </div>
          <div data-reveal style={{ "--reveal-delay": 240 } as React.CSSProperties}>
            <JoinButton />
          </div>
        </div>

        {/* Link columns */}
        <div className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-white/10 pt-10 sm:mt-28 lg:grid-cols-12">
          <nav aria-label="Footer" data-reveal className="lg:col-span-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">Navigate</h3>
            <ul className="mt-5 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => scrollToSection(e, link.id)}
                    className="group inline-flex text-lg font-semibold focus-visible:outline-none sm:text-xl"
                  >
                    <RollText>{link.label}</RollText>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div data-reveal style={{ "--reveal-delay": 80 } as React.CSSProperties} className="lg:col-span-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">Follow</h3>
            <ul className="mt-5 space-y-4">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" className="group inline-flex flex-col focus-visible:outline-none">
                    <span className="flex items-center gap-1.5 text-lg font-semibold sm:text-xl">
                      <RollText>{social.label}</RollText>
                      <ArrowUpRight
                        className={`size-4 text-white/40 transition-transform duration-500 ${EASE} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#dd3913]`}
                        aria-hidden
                      />
                    </span>
                    <span className="text-xs text-white/40">{social.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal style={{ "--reveal-delay": 160 } as React.CSSProperties} className="col-span-2 sm:col-span-1 lg:col-span-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">The stand</h3>
            <p className="mt-5 max-w-xs leading-relaxed text-white/70">
              The official supporters group of Malappuram FC. United in passion, united in purpose.
            </p>
            <p className="mt-4 text-sm text-white/40">Malappuram, Kerala, India</p>
          </div>

          <div data-reveal style={{ "--reveal-delay": 240 } as React.CSSProperties} className="col-span-2 sm:col-span-1 lg:col-span-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">Local time</h3>
            <div className="mt-4">
              <LocalTime />
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/40">IST · Malappuram</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-5 border-t border-white/10 py-7 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 sm:mt-24 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Image src={crest} alt="Ultras Malappuram crest" sizes="36px" className="size-9" />
            <span>© {new Date().getFullYear()} Ultras Malappuram</span>
          </div>
          <span>
            United we stand <span className="text-[#dd3913]">✦</span>
          </span>
          <span>Made with passion for football</span>
        </div>
      </div>

      {/* Giant wordmark, letters rise out of a clipped line */}
      <div data-reveal="rise" className="flex select-none justify-center overflow-hidden px-2 pt-[3vw] leading-[0.76]" aria-hidden>
        {"ULTRAS".split("").map((letter, i) => (
          <span key={i} style={{ "--reveal-delay": i * 70 } as React.CSSProperties} className="inline-block">
            <span className={`inline-block text-[25vw] font-extrabold tracking-[-0.06em] text-[#dd3913] transition-transform duration-500 ${EASE} hover:-translate-y-[8%]`}>
              {letter}
            </span>
          </span>
        ))}
      </div>
    </footer>
  );
};

export default React.memo(Footer);
