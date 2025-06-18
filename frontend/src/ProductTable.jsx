import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ProductTable({ data }) {
  return (
    <motion.section
      className="max-w-6xl mx-auto my-12"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="overflow-x-auto rounded-2xl shadow-lg bg-white">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left font-bold text-[#1A3A61]">Product Name</th>
              <th className="px-6 py-4 text-left font-bold text-[#1A3A61]">ASIN</th>
              <th className="px-6 py-4 text-left font-bold text-[#1A3A61]">Wholesale Price</th>
              <th className="px-6 py-4 text-left font-bold text-[#1A3A61]">Amazon Price</th>
              <th className="px-6 py-4 text-left font-bold text-[#1A3A61]">Profit Margin %</th>
              <th className="px-6 py-4 text-left font-bold text-[#1A3A61]">Profit Verdict</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-400 text-lg">No results found</td>
              </tr>
            ) : (
              data.map((row, idx) => {
                const isProfitable = row.profit_percentage >= 25;
                return (
                  <motion.tr
                    key={idx}
                    className={`transition hover:bg-blue-50 ${!isProfitable ? 'bg-red-50' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <td className="px-6 py-4 border-b border-gray-200">{row.description || 'null'}</td>
                    <td className="px-6 py-4 border-b border-gray-200">{row.asin || 'null'}</td>
                    <td className="px-6 py-4 border-b border-gray-200">{row.wholesale_price !== null && row.wholesale_price !== undefined ? `$${row.wholesale_price.toFixed(2)}` : 'null'}</td>
                    <td className="px-6 py-4 border-b border-gray-200">{row.amazon_price !== null && row.amazon_price !== undefined ? `$${row.amazon_price.toFixed(2)}` : 'null'}</td>
                    <td className="px-6 py-4 border-b border-gray-200">{row.profit_percentage !== null && row.profit_percentage !== undefined ? `${row.profit_percentage.toFixed(2)}%` : 'null'}</td>
                    <td className="px-6 py-4 border-b border-gray-200 font-bold">
                      <span className={`flex items-center gap-2 text-lg ${isProfitable ? 'text-green-500' : 'text-red-500'} animate-pulse`}>
                        {isProfitable ? <FaCheckCircle /> : <FaTimesCircle />}
                        {isProfitable ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
} 