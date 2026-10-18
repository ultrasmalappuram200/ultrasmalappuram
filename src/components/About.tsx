'use client';

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import SectionIntro from "@/components/SectionIntro";
import { useReveal } from "@/lib/useReveal";
import chant from "../../public/images/Gallery/Gal3.jpeg";
import scarf from "../../public/images/Gallery/Gal7.jpeg";

const WHATSAPP_URL = "https://chat.whatsapp.com/BUrboLPViNw8VBLvI0AoBy?mode=wwt";

const VALUES = [
  { title: "Passion", text: "Ninety minutes of noise, every single matchday." },
  { title: "Unity", text: "One district, one club, one voice." },
  { title: "Respect", text: "For the badge, the players and every rival stand." }
];

const pad = (n: number) => String(n).padStart(2, "0");

const About = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} aria-labelledby="about-heading" className="relative bg-[#1a1f3c] px-5 py-24 font-[Montserrat] text-white sm:px-10 sm:py-32 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          id="about-heading"
          label="About"
          index="01"
          title={
            <>
              Born in the stands. <span className="text-[#dd3913]">Loyal for life.</span>
            </>
          }
          intro="Ultras Malappuram is the official supporters' group of Malappuram FC, proudly representing our district in the Super League Kerala."
        />

        <div className="mt-16 grid gap-16 sm:mt-24 lg:grid-cols-12 lg:gap-16">
          {/* Photo collage */}
          <div data-reveal className="relative mr-6 sm:mr-12 lg:col-span-5 lg:mr-0">
            <div className="relative aspect-4/5 overflow-hidden">
              <Image src={chant} alt="A Malappuram FC supporter leading a chant" fill placeholder="blur" sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
            </div>
            <div className="absolute -right-6 -bottom-10 aspect-3/2 w-[55%] overflow-hidden border-4 border-[#1a1f3c] sm:-right-12 lg:-right-10">
              <Image src={scarf} alt="Supporters raising an Ultras Malappuram scarf" fill placeholder="blur" sizes="(min-width: 1024px) 22vw, 50vw" className="object-cover" />
            </div>
          </div>

          {/* Manifesto */}
          <div className="lg:col-span-7 lg:pt-4 lg:pl-8">
            <p data-reveal className="text-2xl leading-snug font-semibold tracking-[-0.02em] sm:text-3xl lg:text-4xl">
              Built on <span className="text-[#dd3913]">passion, unity and respect</span>, we are the heartbeat of Kerala&apos;s football culture.
            </p>
            <div
              data-reveal
              style={{ "--reveal-delay": 100 } as React.CSSProperties}
              className="mt-8 grid gap-6 text-base leading-relaxed text-white/60 sm:grid-cols-2 sm:text-lg"
            >
              <p>Through creativity, chants and community spirit, we back our team on and off the pitch.</p>
              <p>
                Together, we define what <span className="text-white">true football loyalty</span> means.
              </p>
            </div>

            <ul className="mt-12 border-t border-white/10">
              {VALUES.map((value, i) => (
                <li
                  key={value.title}
                  data-reveal
                  style={{ "--reveal-delay": i * 90 } as React.CSSProperties}
                  className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-1 border-b border-white/10 py-5 sm:grid-cols-[3rem_11rem_1fr]"
                >
                  <span className="text-xs font-semibold tabular-nums text-white/40">{pad(i + 1)}</span>
                  <span className="text-2xl font-extrabold uppercase tracking-[-0.02em] transition-colors duration-300 group-hover:text-[#dd3913] sm:text-3xl">
                    {value.title}
                  </span>
                  <span className="col-start-2 text-sm text-white/60 sm:col-start-auto sm:text-base">{value.text}</span>
                </li>
              ))}
            </ul>

            <a
              data-reveal
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 inline-flex items-center gap-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dd3913]"
            >
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#dd3913] transition-colors duration-300 group-hover:bg-white group-hover:text-[#dd3913] sm:size-16">
                <ArrowUpRight className="size-6 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:rotate-45" aria-hidden />
              </span>
              <span>
                <span className="block text-2xl font-extrabold uppercase tracking-[-0.02em] sm:text-3xl">#UnitedWeStand</span>
                <span className="text-sm text-white/50">Join the supporters&apos; WhatsApp community</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(About);
