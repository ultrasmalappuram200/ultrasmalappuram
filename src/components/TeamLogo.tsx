import React from "react";
import Image from "next/image";

const SIZES = { 28: "size-7", 32: "size-8", 40: "size-10", 56: "size-14", 80: "size-20" } as const;

// Logos uploaded through the admin live in Supabase storage as full-size PNGs;
// next/image serves them resized. Anything else (mock data) is shown as-is.
const isStorageUrl = (src: string) => /^https:\/\/[^/]+\.supabase\.co\/storage\//.test(src);

export default function TeamLogo({ src, name, size }: { src?: string | null; name: string; size: keyof typeof SIZES }) {
  if (!src) {
    return (
      <span
        aria-hidden
        className={`${SIZES[size]} flex shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white/70`}
      >
        {name.charAt(0)}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      unoptimized={!isStorageUrl(src)}
      className={`${SIZES[size]} shrink-0 rounded-full object-contain`}
    />
  );
}
