'use client'

import React from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

// Dynamically import heavy components below the fold
const About = dynamic(() => import("@/components/About"), { ssr: false });
const Gallery = dynamic(() => import("@/components/Gallery"), { ssr: false });
const VideoGallery = dynamic(() => import("@/components/VideoGallery"), { ssr: false });
const Instagram = dynamic(() => import("@/components/Instagram"), { ssr: false });
const Standings = dynamic(() => import("@/components/Standings"), { ssr: false });
const LastMalappuramMatch = dynamic(() => import("@/components/LastMalappuramMatch"), { ssr: false });
const Sponsors = dynamic(() => import("@/components/Sponsors"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const BackToTop = dynamic(() => import("@/components/BackToTop"), { ssr: false });

const Home = () => {
  return (
    <div className="min-h-screen bg-[#1a1f3c]">
      <Navbar />
      <main>
        <div id="home">
          <Hero />
        </div>
        <div id="about">
          <About />
        </div>
        <div id="standings">
          <Standings />
        </div>
        <div id="matches">
          <LastMalappuramMatch />
        </div>
        <div id="gallery">
          <Gallery />
        </div>
        <div id="videos">
          <VideoGallery />
        </div>
        <div id="instagram">
          <Instagram />
        </div>
        <div id="partners">
          <Sponsors />
        </div>
      </main>
      <div id="contact">
        <Footer />
      </div>
      <BackToTop />
    </div>
  );
};

export default Home;
