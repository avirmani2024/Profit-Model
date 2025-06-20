import { motion } from "framer-motion";
import Lottie from "lottie-react";
// Placeholder animation, replace with your own Lottie JSON
import chartAnim from "./Animation - 1750318980326 (1).json";
import logo from "./assets/favicon.png";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[340px] flex items-center justify-center bg-gradient-to-br from-electricPurple via-deepMidnight to-softSlate animate-gradient-x">
      {/* Animated background placeholder (replace with particles if desired) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        {/* Optionally add tsparticles or animated SVG here */}
      </div>
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between py-16 px-8 relative z-10">
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-4 mb-6">
            <img src={logo} alt="Profitize Logo" className="w-16 h-16 drop-shadow-lg" />
            <span className="text-4xl font-bold text-iceWhite drop-shadow-lg">Profitize</span>
          </div>

          <motion.h1
            className="text-5xl md:text-6xl font-extrabold tracking-wide mb-4 font-inter text-iceWhite drop-shadow-lg"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            Find Your Next Winning Product
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 font-inter text-iceWhite/90 max-w-xl"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            The ultimate tool for Amazon FBA/FBM sellers. We analyze real-time data to uncover high-margin opportunities.
          </motion.p>
          <motion.button
            className="bg-electricPurple bg-gradient-to-r from-electricPurple to-purple-500 text-iceWhite font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-150 text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              const el = document.getElementById('upload-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Start Analyzing
          </motion.button>
        </div>
        {/* Animated chart/walkthrough illustration */}
        <motion.div
          className="w-72 h-72 flex items-center justify-center hidden md:flex mt-12 md:mt-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
        >
          <Lottie animationData={chartAnim} loop={true} className="w-full h-full" />
        </motion.div>
      </div>
      {/* Decorative SVG shape behind illustration */}
      <div className="absolute right-0 top-0 w-1/2 h-full z-0 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="200" cy="200" rx="200" ry="120" fill="#fff" fillOpacity="0.07" />
        </svg>
      </div>
      {/* Subtle gradient background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60 bg-gradient-to-br from-electricPurple via-deepMidnight to-softSlate" />
    </section>
  );
} 