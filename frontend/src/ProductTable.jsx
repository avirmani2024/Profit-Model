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
      <div className="overflow-x-auto rounded-2xl shadow-lg bg-softSlate border border-deepMidnight">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full border-separate border-spacing-0 text-iceWhite font-inter">
            <thead className="sticky top-0 z-10">
              <tr className="bg-deepMidnight">
                <th className="px-6 py-4 text-left font-bold text-electricPurple uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-4 text-left font-bold text-electricPurple uppercase tracking-wider">ASIN</th>
                <th className="px-6 py-4 text-left font-bold text-electricPurple uppercase tracking-wider">Wholesale Price</th>
                <th className="px-6 py-4 text-left font-bold text-electricPurple uppercase tracking-wider">Amazon Price</th>
                <th className="px-6 py-4 text-left font-bold text-electricPurple uppercase tracking-wider">Profit Margin %</th>
                <th className="px-6 py-4 text-left font-bold text-electricPurple uppercase tracking-wider">Profit Verdict</th>
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
                      className={`transition hover:bg-electricPurple/10 ${!isProfitable ? 'bg-[#2a1830]' : ''}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <td className="px-6 py-4 border-b border-[#231c36]">{row.description || 'null'}</td>
                      <td className="px-6 py-4 border-b border-[#231c36]">{row.asin || 'null'}</td>
                      <td className="px-6 py-4 border-b border-[#231c36]">{row.wholesale_price !== null && row.wholesale_price !== undefined ? `$${row.wholesale_price.toFixed(2)}` : 'null'}</td>
                      <td className="px-6 py-4 border-b border-[#231c36]">{row.amazon_price !== null && row.amazon_price !== undefined ? `$${row.amazon_price.toFixed(2)}` : 'null'}</td>
                      <td className="px-6 py-4 border-b border-[#231c36]">
                        {row.profit_percentage !== null && row.profit_percentage !== undefined ? (
                          <span className={`px-3 py-1 rounded-full font-bold text-sm tracking-wide ${isProfitable ? 'bg-limeAccent text-deepMidnight' : 'bg-electricPurple text-iceWhite'}`}>
                            {row.profit_percentage.toFixed(2)}%
                          </span>
                        ) : 'null'}
                      </td>
                      <td className="px-6 py-4 border-b border-[#231c36] font-bold">
                        <span className={`flex items-center gap-2 text-lg ${isProfitable ? 'text-limeAccent' : 'text-electricPurple'}`}>
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
      </div>
    </motion.section>
  );
} 