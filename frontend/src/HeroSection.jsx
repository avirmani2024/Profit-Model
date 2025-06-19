import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-gradient-x min-h-[340px] flex items-center justify-center">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between py-20 px-8 relative z-10">
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
            className="text-gray-200 text-lg md:text-xl mb-6 max-w-xl font-inter"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Upload your product list and find out which items are profitable (25%+ margin).
          </motion.p>
        </div>
        {/* Hero Illustration */}
        <motion.img
          src="/undraw_warehouse.svg"
          alt="Warehouse Illustration"
          className="w-72 h-72 object-contain drop-shadow-2xl hidden md:block"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
        />
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