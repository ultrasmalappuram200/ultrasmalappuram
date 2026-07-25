"use client";

import React from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

interface ProMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProMemberModal: React.FC<ProMemberModalProps> = ({ isOpen, onClose }) => {
  // 3D Hover effect values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = () => {
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSfDl1VjhTXZNgD5Sb4uZ0PFhiQ8qs1j0qwXw3RYkASEoX2IaQ/viewform?usp=header", "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8"
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white hover:text-[#dd3913] transition-colors z-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative w-full max-w-4xl min-h-[500px] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            style={{ perspective: 1000 }}
          >
            <motion.div
              key="card"
              initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-[480px] aspect-[1.586] cursor-pointer group"
              style={{
                rotateX: rotateX,
                rotateY: rotateY,
                transformStyle: "preserve-3d",
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
            >
              {/* Card Container based on the reference image */}
              <div className="absolute inset-0 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden bg-gradient-to-br from-[#a11f0a] via-[#dd3913] to-[#801404] border border-white/10">
                
                {/* Halftone / Wave pattern approximation */}
                <div 
                  className="absolute inset-0 opacity-40 mix-blend-overlay"
                  style={{ 
                    backgroundImage: "radial-gradient(circle at 100% 0%, transparent 40%, rgba(255,255,255,0.4) 41%, rgba(255,255,255,0.4) 43%, transparent 44%), radial-gradient(circle at 100% 0%, transparent 46%, rgba(255,255,255,0.3) 47%, rgba(255,255,255,0.3) 49%, transparent 50%), radial-gradient(circle at 100% 0%, transparent 52%, rgba(255,255,255,0.2) 53%, rgba(255,255,255,0.2) 55%, transparent 56%)",
                    backgroundSize: "200% 200%",
                    backgroundPosition: "top right"
                  }}
                />
                <div 
                  className="absolute inset-0 opacity-20 mix-blend-overlay"
                  style={{ 
                    backgroundImage: "radial-gradient(circle at 0% 100%, transparent 30%, rgba(0,0,0,0.4) 31%, rgba(0,0,0,0.4) 35%, transparent 36%)",
                    backgroundSize: "150% 150%",
                    backgroundPosition: "bottom left"
                  }}
                />
                
                {/* Minimalist content layer */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  
                  {/* Top Row: Logo only */}
                  <div className="flex justify-start items-start" style={{ transform: "translateZ(30px)" }}>
                    <img 
                      src="/images/ultras-logo.png" 
                      alt="Ultras Malappuram Logo" 
                      className="w-16 h-16 object-contain drop-shadow-lg" 
                    />
                  </div>

                  {/* Bottom Row: Minimal Text */}
                  <div className="flex flex-col justify-end items-start" style={{ transform: "translateZ(40px)" }}>
                    <span className="text-white/90 font-[Montserrat] text-sm md:text-base font-medium mb-1">
                      Pro Member
                    </span>
                    <span className="text-white font-[Montserrat] text-lg md:text-xl font-bold tracking-wider uppercase drop-shadow-md">
                      YOUR NAME HERE
                    </span>
                  </div>

                  {/* Hover Overlay indicating click action */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 rounded-3xl backdrop-blur-[1px]" style={{ transform: "translateZ(50px)" }}>
                    <div className="px-6 py-3 bg-white text-[#dd3913] rounded-full font-bold tracking-wider hover:bg-gray-100 transition-colors shadow-xl">
                      CLICK TO FILL FORM
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProMemberModal;
