import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaAppleAlt, FaTshirt, FaLaptop, FaCouch, FaBicycle, FaBook } from "react-icons/fa";

const products = [
  {
    name: "Wireless Earbuds",
    icon: <FaAppleAlt className="text-limeAccent text-2xl" />,
    margin: 42,
    verdict: "🔥 Great",
  },
  {
    name: "Yoga Mat",
    icon: <FaTshirt className="text-limeAccent text-2xl" />,
    margin: 28,
    verdict: "🟡 Niche",
  },
  {
    name: "Standing Desk",
    icon: <FaLaptop className="text-limeAccent text-2xl" />,
    margin: 35,
    verdict: "🔥 Great",
  },
  {
    name: "Ergonomic Chair",
    icon: <FaCouch className="text-electricPurple text-2xl" />,
    margin: 18,
    verdict: "❌ Avoid",
  },
  {
    name: "Mountain Bike",
    icon: <FaBicycle className="text-limeAccent text-2xl" />,
    margin: 31,
    verdict: "🟡 Niche",
  },
  {
    name: "Cookbook",
    icon: <FaBook className="text-limeAccent text-2xl" />,
    margin: 24,
    verdict: "🟡 Niche",
  },
];

export default function SuggestedProducts() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % products.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const product = products[index];

  return (
    <div className="w-full max-w-xl mx-auto my-6">
      <h3 className="text-lg font-bold text-electricPurple mb-2">Suggested Products</h3>
      <div className="bg-softSlate rounded-xl shadow-lg p-4 flex items-center gap-4 border border-deepMidnight">
        <AnimatePresence mode="wait">
          <motion.div
            key={product.name}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 w-full"
          >
            <div>{product.icon}</div>
            <div className="flex-1">
              <div className="font-semibold text-iceWhite truncate">{product.name}</div>
              <div className="text-sm text-iceWhite/80">Est. Margin: <span className="font-bold text-limeAccent">{product.margin}%</span></div>
            </div>
            <div className="text-lg font-bold text-iceWhite">{product.verdict}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 