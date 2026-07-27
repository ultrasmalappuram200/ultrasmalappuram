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
    <div className="relative min-h-screen bg-gradient-to-br from-[#1a1f3c] via-[#1a1f3c]/95 to-[#1a1f3c]">
      {/* Optimized Sharp Geometric Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        
        {/* Optimized CSS-only grid background (Replaces 300 DOM nodes!) */}
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

        {/* Lightweight Shape Animations (Reduced DOM count) */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#dd3913]/20 to-transparent"
            style={{
              width: `${400 + i * 200}px`,
              left: `${10 + i * 30}%`,
              top: `${20 + i * 30}%`,
              transform: `rotate(${-20 + i * 8}deg)`,
              animation: `linePulse ${6 + i * 2}s infinite`,
              animationDelay: `${i * 1.5}s`
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

      <style jsx>{`
        @keyframes linePulse {
          0%, 100% { opacity: 0; transform: scaleX(0); }
          50% { opacity: 0.6; transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
};

export default Home;