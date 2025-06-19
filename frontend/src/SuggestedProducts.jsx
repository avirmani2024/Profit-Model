import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaAppleAlt, FaTshirt, FaLaptop, FaCouch, FaBicycle, FaBook } from "react-icons/fa";

const products = [
  {
    name: "Wireless Earbuds",
    icon: <FaAppleAlt className="text-pink-500 text-2xl" />,
    margin: 42,
    verdict: "🔥 Great",
  },
  {
    name: "Yoga Mat",
    icon: <FaTshirt className="text-green-500 text-2xl" />,
    margin: 28,
    verdict: "🟡 Niche",
  },
  {
    name: "Standing Desk",
    icon: <FaLaptop className="text-blue-500 text-2xl" />,
    margin: 35,
    verdict: "🔥 Great",
  },
  {
    name: "Ergonomic Chair",
    icon: <FaCouch className="text-purple-500 text-2xl" />,
    margin: 18,
    verdict: "❌ Avoid",
  },
  {
    name: "Mountain Bike",
    icon: <FaBicycle className="text-yellow-500 text-2xl" />,
    margin: 31,
    verdict: "🟡 Niche",
  },
  {
    name: "Cookbook",
    icon: <FaBook className="text-orange-500 text-2xl" />,
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
      <h3 className="text-lg font-bold text-indigo-700 mb-2">Suggested Products</h3>
      <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4">
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
              <div className="font-semibold text-gray-800 truncate">{product.name}</div>
              <div className="text-sm text-gray-500">Est. Margin: <span className="font-bold text-green-600">{product.margin}%</span></div>
            </div>
            <div className="text-lg font-bold">{product.verdict}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 