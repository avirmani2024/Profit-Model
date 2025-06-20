import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
import React from 'react';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function truncate(str, n) {
  return str && str.length > n ? str.substr(0, n - 1) + '…' : str;
}

export default function TopProductsChart({ data }) {
  // Sort and take top 10
  const sorted = [...data].sort((a, b) => (b.profit_percentage || 0) - (a.profit_percentage || 0)).slice(0, 10);
  const chartData = {
    labels: sorted.map(r => truncate(r.description || 'Unknown', 30)),
    datasets: [
      {
        label: 'Profit Margin %',
        data: sorted.map(r => r.profit_percentage),
        backgroundColor: '#34d399',
        borderRadius: 6,
        hoverBackgroundColor: '#059669',
      },
    ],
  };
  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => `Profit: ${ctx.parsed.x.toFixed(2)}%`,
          title: ctx => data[ctx[0].dataIndex]?.description || 'Unknown',
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#f5f6ff',
          callback: function(val, idx) {
            return chartData.labels[idx];
          },
        },
        title: {
          display: true,
          text: 'Product',
          color: '#f5f6ff',
        },
        grid: {
          color: 'rgba(245,246,255,0.08)'
        }
      },
      x: {
        beginAtZero: true,
        title: { display: true, text: 'Profit Margin %', color: '#f5f6ff' },
        ticks: { color: '#f5f6ff' },
        grid: {
          color: 'rgba(245,246,255,0.08)'
        }
      },
    },
    animation: {
      duration: 800,
      easing: 'easeOutQuart',
    },
  };
  return (
    <motion.div className="bg-softSlate rounded-2xl shadow-md p-6 overflow-x-auto min-h-[400px]" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <h3 className="text-2xl font-extrabold mb-2 font-inter text-electricPurple drop-shadow-lg">Top 10 Products by Profit Margin</h3>
      <div className="w-full min-w-[350px]" style={{height: Math.max(400, 40 * sorted.length)}}>
        <Bar data={chartData} options={options} />
      </div>
      <div className="text-xs text-gray-400 mt-2">Hover bars to see full product names.</div>
    </motion.div>
  );
} 