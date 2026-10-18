import { useEffect, useRef } from "react";

// Marks every [data-reveal] element inside the returned ref with data-revealed once it scrolls
// into view. One observer per section and no React re-renders; the animation itself is CSS
// (see globals.css), so reduced-motion users simply get the content without movement.
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.15 }
    );

    root.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return ref;
}
