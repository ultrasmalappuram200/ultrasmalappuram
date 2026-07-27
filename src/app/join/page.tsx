"use client";

import React from "react";
import ProMemberCard from "@/components/ProMemberCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { Ticket, Users, Shirt, Star } from "lucide-react";

export default function JoinPage() {
  const benefits = [
    {
      icon: <Star className="w-5 h-5 sm:w-6 sm:h-6 text-[#dd3913]" />,
      text: "FREE Entry to the First Home Match",
    },
    {
      icon: <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-[#dd3913]" />,
      text: "50% OFF on all remaining Home Match tickets",
    },
    {
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#dd3913]" />,
      text: "Bring 1 Friend to every remaining home match at the same 50% discounted ticket price",
    },
    {
      icon: <Shirt className="w-5 h-5 sm:w-6 sm:h-6 text-[#dd3913]" />,
      text: "Official MFC Fan Jersey",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1a1f3c] via-[#1a1f3c]/95 to-[#1a1f3c] overflow-hidden">
      
      {/* Background Elements (copied from home for consistency) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Optimized Sharp Diagonal Lines */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`line-${i}`}
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
            key={`shape-${i}`}
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
                key={`grid-${i}`}
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

      <main className="relative z-10 pt-12 lg:pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">
        
        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 lg:mb-12"
        >
          <Link href="/">
            <button className="flex items-center text-gray-400 hover:text-white transition-colors duration-300 group">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-3 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </div>
              <span className="font-[Montserrat] font-medium text-sm tracking-widest uppercase">Back to Home</span>
            </button>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Text Content */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 }
              }
            }}
            className="lg:col-span-7 space-y-6 sm:space-y-8"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}>
              <div className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#dd3913]/10 border border-[#dd3913]/20 mb-4 sm:mb-6">
                <span className="text-[#dd3913] font-semibold text-[10px] sm:text-xs tracking-widest uppercase">Premium Access</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-[Montserrat] font-extrabold text-white leading-tight tracking-tight">
                Ultras Membership <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dd3913] to-[#ff6b4a]">
                  ₹349
                </span>
              </h1>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }} className="space-y-4 pt-2">
              <h2 className="text-base sm:text-lg font-[Montserrat] font-semibold text-gray-400 uppercase tracking-widest mb-4 sm:mb-6">Exclusive Benefits</h2>
              
              <div className="grid gap-3 sm:gap-4">
                {benefits.map((benefit, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#dd3913]/20 to-transparent border border-[#dd3913]/20 flex items-center justify-center shadow-[inset_0_0_20px_rgba(221,57,19,0.1)]">
                      {benefit.icon}
                    </div>
                    <p className="text-sm sm:text-base text-gray-200 font-[Montserrat] font-medium leading-snug">
                      {benefit.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Card Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 100 }}
            className="lg:col-span-5 flex flex-col items-center justify-center space-y-6 sm:space-y-10 mt-12 lg:mt-0 perspective-1000"
          >
            <div className="relative w-full flex justify-center px-2 sm:px-0">
              {/* Glow behind the card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#dd3913]/30 blur-[60px] sm:blur-[80px] rounded-full pointer-events-none" />
              <ProMemberCard />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(221,57,19,0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSfDl1VjhTXZNgD5Sb4uZ0PFhiQ8qs1j0qwXw3RYkASEoX2IaQ/viewform?usp=header", "_blank")}
              className="px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-[#a11f0a] to-[#dd3913] text-white font-[Montserrat] font-bold text-base sm:text-lg transition-all duration-300 rounded-xl sm:rounded-2xl tracking-widest uppercase w-full max-w-[90%] sm:max-w-sm text-center border border-white/20 shadow-[0_10px_40px_rgba(221,57,19,0.3)] overflow-hidden relative group"
            >
              <span className="relative z-10">Apply to Join Now</span>
              {/* Button shine effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite] skew-x-12" />
            </motion.button>
          </motion.div>

        </div>
      </main>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
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
}
