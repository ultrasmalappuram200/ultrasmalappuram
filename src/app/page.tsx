'use client'

import React from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

// Dynamically import heavy components below the fold
const About = dynamic(() => import("@/components/About"), { ssr: false });
const Gallery = dynamic(() => import("@/components/Gallery"), { ssr: false });
const VideoGallery = dynamic(() => import("@/components/VideoGallery"), { ssr: false });
const Standings = dynamic(() => import("@/components/Standings"), { ssr: false });
const LastMalappuramMatch = dynamic(() => import("@/components/LastMalappuramMatch"), { ssr: false });
const Sponsors = dynamic(() => import("@/components/Sponsors"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const BackToTop = dynamic(() => import("@/components/BackToTop"), { ssr: false });

const Home = () => {
  return (
    <div className="relative min-h-screen bg-[#1a1f3c]">
      {/* Optimized CSS-only background — zero JS animation cost */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        {/* CSS grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(221, 57, 19, 1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(221, 57, 19, 1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* 2 lightweight CSS-animated decorative lines */}
        {[0, 1].map((i) => (
          <div
            key={`line-${i}`}
            className="deco-line absolute h-px bg-gradient-to-r from-transparent via-[#dd3913]/20 to-transparent will-change-transform"
            style={{
              width: `${500 + i * 200}px`,
              left: `${15 + i * 35}%`,
              top: `${25 + i * 30}%`,
              transform: `rotate(${-18 + i * 10}deg)`,
              animation: `linePulse ${7 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Navbar />
        <div id="home">
          <Hero />
        </div>
        <div id="about">
          <About />
        </div>
        <div id="standings">
          <Standings/>
        </div>
        <div id="matches">
          <LastMalappuramMatch/>
        </div>
        <div id="gallery">
          <Gallery />
        </div>
        <VideoGallery/>
        <Sponsors/>
        <div id="contact">
          <Footer/>
        </div>
        <BackToTop />
      </div>
    </div>
  );
};

export default Home;