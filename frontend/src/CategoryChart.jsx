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
      <div className="bg-softSlate rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-extrabold mb-4 font-inter text-electricPurple drop-shadow-lg">Average Profit Margin by Category</h2>
        <Bar data={chartData} options={{
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, ticks: { color: '#f5f6ff' }, title: { display: true, text: 'Avg. Profit Margin %', color: '#f5f6ff' }, grid: { color: 'rgba(245,246,255,0.08)' } },
            x: { ticks: { color: '#f5f6ff' }, title: { display: true, text: 'Category', color: '#f5f6ff' }, grid: { color: 'rgba(245,246,255,0.08)' } }
          }
        }} />
      </div>
    </motion.section>
  );
} 