'use client'

import React from "react";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import VideoGallery from "@/components/VideoGallery";
import Footer from "@/components/Footer";
import Standings from "@/components/Standings";
import LastMalappuramMatch from "@/components/LastMalappuramMatch";
import Sponsors from "@/components/Sponsors";
import Navbar from "@/components/Navbar";
import BackToTop from "@/components/BackToTop";

const Home = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1a1f3c] via-[#1a1f3c]/95 to-[#1a1f3c]">
      {/* Optimized Sharp Geometric Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Optimized Sharp Diagonal Lines */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#dd3913]/20 to-transparent"
            style={{
              width: `${400 + i * 100}px`,
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
              transform: `rotate(${-20 + i * 8}deg)`,
              animation: `linePulse ${6 + i}s infinite`,
              animationDelay: `${i}s`
            }}
          />
        ))}

        {/* Optimized Sharp Geometric Shapes */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-[#dd3913]/15"
            style={{
              left: `${15 + i * 12}%`,
              top: `${20 + i * 10}%`,
              width: `${4 + i}px`,
              height: `${4 + i}px`,
              clipPath: i % 3 === 0 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : i % 3 === 1 ? 'polygon(0% 0%, 100% 0%, 50% 100%)' : 'polygon(0% 0%, 100% 50%, 0% 100%)',
              animation: `shapeRotate ${20 + i * 2}s infinite linear`,
              animationDelay: `${i}s`
            }}
          />
        ))}

        {/* Optimized Sharp Grid Pattern */}
        <div className="absolute inset-0 opacity-6">
          <div className="grid grid-cols-20 grid-rows-15 h-full w-full">
            {Array.from({ length: 300 }).map((_, i) => (
              <div
                key={i}
                className="border border-[#dd3913]/10"
                style={{
                  animation: `gridPulse ${4 + (i % 3)}s infinite`,
                  animationDelay: `${(i % 3)}s`
                }}
              />
            ))}
          </div>
        </div>
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
        @keyframes shapeRotate {
          0% { transform: rotate(0deg); opacity: 0; }
          50% { transform: rotate(180deg); opacity: 0.4; }
          100% { transform: rotate(360deg); opacity: 0; }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

export default Home;