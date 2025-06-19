import { motion } from "framer-motion";

const badges = [
  {
    icon: "🔒",
    title: "No data stored",
    desc: "Your files are processed instantly and never saved. Privacy is our top priority.",
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: "⚡",
    title: "Live Amazon scraping",
    desc: "We fetch real-time prices and data directly from Amazon for the most accurate results.",
    color: "bg-yellow-50 text-yellow-700",
  },
  {
    icon: "💬",
    title: "Trusted by 2,000+ sellers",
    desc: "Join a growing community of Amazon entrepreneurs using our tool every day.",
    color: "bg-green-50 text-green-700",
  },
];

export default function WhyTrustUs() {
  return (
    <div className="max-w-5xl mx-auto my-12">
      <h3 className="text-2xl font-bold text-center text-indigo-700 mb-6">Why Trust Us?</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {badges.map((b, i) => (
          <motion.div
            key={b.title}
            className={`rounded-xl shadow-md p-6 flex flex-col items-center ${b.color} transition-transform`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, delay: i * 0.15, type: "spring" }}
            viewport={{ once: true }}
          >
            <span className="text-4xl mb-2">{b.icon}</span>
            <div className="font-bold text-lg mb-1">{b.title}</div>
            <div className="text-sm text-gray-600 text-center">{b.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 