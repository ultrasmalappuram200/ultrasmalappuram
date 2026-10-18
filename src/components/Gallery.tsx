"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";
import SectionIntro from "@/components/SectionIntro";
import { useReveal } from "@/lib/useReveal";
import gal1 from "../../public/images/Gallery/Gal1.jpeg";
import gal2 from "../../public/images/Gallery/Gal2.jpeg";
import gal3 from "../../public/images/Gallery/Gal3.jpeg";
import gal4 from "../../public/images/Gallery/Gal4.jpeg";
import gal5 from "../../public/images/Gallery/Gal5.jpeg";
import gal6 from "../../public/images/Gallery/Gal6.jpeg";
import gal7 from "../../public/images/Gallery/Gal7.jpeg";
import gal8 from "../../public/images/Gallery/Gal8.jpeg";
import stand from "../../public/images/Gallery/img2.webp";

const PHOTOS: { src: StaticImageData; alt: string }[] = [
  { src: gal3, alt: "A supporter leading a chant" },
  { src: gal2, alt: "The Malappuram FC end in full voice" },
  { src: gal4, alt: "Supporters with the Ultras Malappuram banner" },
  { src: gal7, alt: "Fans raising an Ultras Malappuram scarf" },
  { src: gal5, alt: "A young fan cheering in the stands" },
  { src: gal8, alt: "Flags and banners along the fence" },
  { src: gal1, alt: "A family of supporters in matchday shirts" },
  { src: gal6, alt: "Fans and flags on matchday" },
  { src: stand, alt: "A packed stand under the United We Stand banner" }
];

const pad = (n: number) => String(n).padStart(2, "0");
const ICON_BUTTON =
  "flex size-11 shrink-0 items-center justify-center rounded-full border border-white/20 transition-colors duration-300 hover:border-white hover:bg-white hover:text-[#0f132b] sm:size-12";

function Lightbox({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (delta: number) => void }) {
  const photo = PHOTOS[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, onStep]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-60 flex flex-col bg-[#0b0e22]/95 font-[Montserrat] text-white transition-opacity duration-300 starting:opacity-0"
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60 sm:px-10">
        <span className="tabular-nums">
          {pad(index + 1)} / {pad(PHOTOS.length)}
        </span>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className={ICON_BUTTON}>
          <X className="size-5" aria-hidden />
        </button>
      </div>

      <div className="relative flex-1">
        <Image
          key={index}
          src={photo.src}
          alt={photo.alt}
          fill
          placeholder="blur"
          sizes="100vw"
          className="object-contain px-4 transition-opacity duration-300 starting:opacity-0 sm:px-24"
        />
      </div>

      <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-10">
        <button type="button" onClick={() => onStep(-1)} aria-label="Previous photo" className={ICON_BUTTON}>
          <ArrowLeft className="size-5" aria-hidden />
        </button>
        <p className="text-center text-sm text-white/60">{photo.alt}</p>
        <button type="button" onClick={() => onStep(1)} aria-label="Next photo" className={ICON_BUTTON}>
          <ArrowRight className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}

const Gallery = () => {
  const ref = useReveal<HTMLElement>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // The thumbnail that opened the viewer gets focus back when it closes
  const openerRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpenIndex(null);
    openerRef.current?.focus();
  }, []);

  const step = useCallback((delta: number) => {
    setOpenIndex((i) => (i === null ? i : (i + delta + PHOTOS.length) % PHOTOS.length));
  }, []);

  return (
    <section ref={ref} aria-labelledby="gallery-heading" className="relative bg-[#1a1f3c] px-5 py-24 font-[Montserrat] text-white sm:px-10 sm:py-32 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          id="gallery-heading"
          label="Gallery"
          index="04"
          title={
            <>
              Scenes from <span className="text-[#dd3913]">the stands.</span>
            </>
          }
          intro="Matchdays, tifos and the faces behind the noise. Tap any photo to see it full screen."
        />

        <div className="mt-14 columns-2 gap-3 sm:mt-20 sm:gap-4 lg:columns-3 lg:gap-5">
          {PHOTOS.map((photo, i) => (
            <button
              key={i}
              type="button"
              data-reveal
              style={{ "--reveal-delay": (i % 3) * 80 } as React.CSSProperties}
              onClick={(e) => {
                openerRef.current = e.currentTarget;
                setOpenIndex(i);
              }}
              className="group relative mb-3 block w-full break-inside-avoid overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dd3913] sm:mb-4 lg:mb-5"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                placeholder="blur"
                sizes="(min-width: 1024px) 30vw, 50vw"
                className="h-auto w-full transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-[#0f132b]/0 transition-colors duration-500 group-hover:bg-[#0f132b]/35" />
              <span className="absolute top-3 left-3 text-[11px] font-semibold tabular-nums opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                ({pad(i + 1)})
              </span>
              <span className="absolute right-3 bottom-3 flex size-10 scale-50 items-center justify-center rounded-full bg-white text-[#0f132b] opacity-0 transition-[opacity,scale] duration-500 group-hover:scale-100 group-hover:opacity-100">
                <Plus className="size-5" aria-hidden />
              </span>
            </button>
          ))}
        </div>
      </div>

      {openIndex !== null && <Lightbox index={openIndex} onClose={close} onStep={step} />}
    </section>
  );
};

export default React.memo(Gallery);
