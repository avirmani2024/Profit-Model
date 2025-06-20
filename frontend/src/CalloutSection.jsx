import { motion } from "framer-motion";
import { FaBolt, FaSearch, FaBriefcase } from "react-icons/fa";

const features = [
  { icon: <FaBolt className="text-electricPurple text-3xl" />, title: "Fast", desc: "Instant profit checks for your catalog." },
  { icon: <FaSearch className="text-limeAccent text-3xl" />, title: "Accurate", desc: "Live Amazon data, not guesses." },
  { icon: <FaBriefcase className="text-electricPurple text-3xl" />, title: "Seller-Friendly", desc: "No login, no hassle, just results." },
];

export default function CalloutSection() {
  return (
    <section className="max-w-6xl mx-auto my-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="bg-softSlate rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border border-deepMidnight"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
          >
            {f.icon}
            <h3 className="mt-4 text-lg font-bold text-iceWhite">{f.title}</h3>
            <p className="mt-2 text-iceWhite/80">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
} 