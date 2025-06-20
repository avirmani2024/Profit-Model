import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ProfitMarginHistogram({ data }) {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Number of Products',
        data: Object.values(data),
        backgroundColor: '#60a5fa',
      },
    ],
  };
  return (
    <motion.div className="bg-softSlate rounded-2xl shadow-lg p-6" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <h3 className="text-2xl font-extrabold mb-2 font-inter text-electricPurple drop-shadow-lg">Profit Margin Distribution</h3>
      <Bar data={chartData} options={{
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Number of Products', color: '#f5f6ff' },
            ticks: { color: '#f5f6ff' },
            grid: { color: 'rgba(245,246,255,0.08)' }
          },
          x: {
            title: { display: true, text: 'Profit Margin %', color: '#f5f6ff' },
            ticks: { color: '#f5f6ff' },
            grid: { color: 'rgba(245,246,255,0.08)' }
          }
        }
      }} />
    </motion.div>
  );
} 