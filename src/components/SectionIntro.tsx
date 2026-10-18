import React, { type ReactNode } from "react";

interface SectionIntroProps {
  // id of the heading, for the section's aria-labelledby
  id: string;
  label: string;
  // Section number shown in the meta row, e.g. "01"
  index: string;
  title: ReactNode;
  intro?: ReactNode;
}

// Shared section header: a meta row (label + section number) over a large headline and a short intro.
// Its elements carry data-reveal, so the parent section should use useReveal().
export default function SectionIntro({ id, label, index, title, intro }: SectionIntroProps) {
  return (
    <>
      <div
        data-reveal
        className="flex items-center justify-between border-b border-white/10 pb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50 sm:text-xs"
      >
        <span className="flex items-center gap-2.5">
          <span className="size-1.5 rounded-full bg-[#dd3913]" />
          {label}
        </span>
        <span className="tabular-nums">({index})</span>
      </div>

      <div className="mt-10 grid gap-6 sm:mt-14 lg:grid-cols-12 lg:items-end lg:gap-10">
        <h2
          id={id}
          data-reveal
          className="text-[clamp(2.25rem,8vw,6.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em] text-balance lg:col-span-8"
        >
          {title}
        </h2>
        {intro && (
          <p
            data-reveal
            style={{ "--reveal-delay": 120 } as React.CSSProperties}
            className="max-w-sm text-base leading-relaxed text-white/60 sm:text-lg lg:col-span-4 lg:justify-self-end"
          >
            {intro}
          </p>
        )}
      </div>
    </>
  );
}
