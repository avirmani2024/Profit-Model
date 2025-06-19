import { motion } from "framer-motion";
import Lottie from "lottie-react";
// Placeholder animation, replace with your own Lottie JSON
import chartAnim from "./Animation - 1750318980326 (1).json";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[340px] flex items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-gradient-x">
      {/* Animated background placeholder (replace with particles if desired) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        {/* Optionally add tsparticles or animated SVG here */}
      </div>
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between py-16 px-8 relative z-10">
        <div className="flex-1">
          <motion.h1
            className="text-white text-5xl md:text-6xl font-bold tracking-tight mb-4 font-poppins drop-shadow-lg"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            Amazon FBA Profit Checker
          </motion.h1>
          <motion.p
            className="text-gray-200 text-lg md:text-xl mb-2 max-w-xl font-inter"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Upload your product list and find out which items are profitable (25%+ margin).
          </motion.p>
          <motion.p
            className="text-indigo-100 text-base md:text-lg mb-6 font-semibold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Built by sellers, for sellers. No logins, just profits.
          </motion.p>
          <motion.button
            className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-full shadow-lg hover:bg-indigo-50 transition mb-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              const el = document.getElementById('upload-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Get Started
          </motion.button>
        </div>
        {/* Animated chart/walkthrough illustration */}
        <motion.div
          className="w-72 h-72 flex items-center justify-center hidden md:flex"
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
    </section>
  );
} 