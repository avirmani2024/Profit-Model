import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
Chart.register(ArcElement, Tooltip, Legend);

export default function CatalogSummaryChart({ data }) {
  const chartData = {
    labels: ['Profitable (≥25%)', 'Not Profitable (<25%)'],
    datasets: [
      {
        data: [data.profitable || 0, data.not_profitable || 0],
        backgroundColor: ['#34d399', '#f87171'],
      },
    ],
  };
  return (
    <motion.div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <h3 className="text-lg font-bold text-[#1A3A61] mb-2">Catalog Profitability Summary</h3>
      <div className="w-48 h-48">
        <Pie data={chartData} options={{
          responsive: true,
          plugins: { legend: { display: true, position: 'bottom' } },
        }} />
      </div>
    </motion.div>
  );
} 