import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CategoryChart({ chartData }) {
  // chartData: { labels: [...], datasets: [{ label, data, backgroundColor }] }
  return (
    <motion.section
      className="max-w-3xl mx-auto my-12"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-[#1A3A61] mb-4">Average Profit Margin by Category</h2>
        <Bar data={chartData} options={{
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { color: '#1A3A61' } }, x: { ticks: { color: '#1A3A61' } } }
        }} />
      </div>
    </motion.section>
  );
} 