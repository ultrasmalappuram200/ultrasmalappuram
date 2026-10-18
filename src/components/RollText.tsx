import React from "react";

const EASE = "ease-[cubic-bezier(0.65,0,0.35,1)]";

// The label slides up and an orange copy rolls in from below.
// The parent link or button needs the `group` class.
export default function RollText({ children }: { children: string }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <span className={`transition-transform duration-500 ${EASE} group-hover:-translate-y-full group-focus-visible:-translate-y-full`}>
        {children}
      </span>
      <span
        aria-hidden
        className={`absolute inset-0 translate-y-full text-[#dd3913] transition-transform duration-500 ${EASE} group-hover:translate-y-0 group-focus-visible:translate-y-0`}
      >
        {children}
      </span>
    </span>
  );
}
