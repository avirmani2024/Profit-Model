import { useDropzone } from "react-dropzone";
import { FaFileCsv, FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import spreadsheetAnim from "./Animation - 1750309740676.json";

export default function UploadSection({ onDrop, fileName, loading }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]
    },
    multiple: false,
  });

  return (
    <motion.section
      className="flex justify-center py-8"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center w-full max-w-xl border border-gray-100">
        <div className="bg-white rounded-xl shadow-md p-6 mb-16 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">How to Format Your Product List</h2>
            <ul className="list-disc ml-6 text-gray-700 mb-3">
              <li>Include columns: <b>Description</b>, <b>Starting wholesale Price</b>, and (optional) <b>Category</b>.</li>
              <li>Save as <b>.csv</b> or <b>.xlsx</b>.</li>
              <li>Download our <a href="/template.xlsx" className="text-blue-600 underline">example template</a>.</li>
            </ul>
            <div className="overflow-x-auto border rounded-lg bg-gray-50 p-2 mb-2">
              <table className="min-w-max text-sm">
                <thead>
                  <tr>
                    <th className="px-2 py-1">Description</th>
                    <th className="px-2 py-1">Starting wholesale Price</th>
                    <th className="px-2 py-1">Category</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-2 py-1">Wireless Mouse</td>
                    <td className="px-2 py-1">12.99</td>
                    <td className="px-2 py-1">Electronics</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1">Yoga Mat</td>
                    <td className="px-2 py-1">8.50</td>
                    <td className="px-2 py-1">Sports</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-green-700 font-semibold mt-2">
              <span>We never store your data. All processing is secure and private.</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <Lottie animationData={spreadsheetAnim} loop={true} className="w-64 h-48 mb-2" />
            <span className="text-gray-500 text-xs">Visual example of a valid spreadsheet</span>
          </div>
        </div>
        <div
          {...getRootProps()}
          className={`w-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition ${
            isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-200"
          }`}
        >
          <input {...getInputProps()} />
          <button
            className="bg-[#1A3A61] text-white font-bold py-3 px-8 rounded-lg text-lg shadow-md hover:scale-105 transition-all flex items-center gap-2"
            type="button"
          >
            <FaFileCsv className="text-2xl animate-bounce" />
            Upload CSV
          </button>
          <p className="mt-3 text-gray-600 text-sm">
            CSV or Excel file must include columns: <b>Description</b>, <b>Starting wholesale Price</b>
          </p>
        </div>
        {/* Upload feedback */}
        {fileName && (
          <div className="mt-3 flex items-center gap-2 text-blue-700 font-semibold">
            <span className="truncate max-w-xs">{fileName}</span>
            {loading && <span className="animate-spin ml-2">⏳</span>}
            {!loading && <span className="text-green-500">✔️ Uploaded!</span>}
          </div>
        )}
        {/* Example File */}
        <a
          href="/Medical_Supplies_Catalog_Sample_10.xlsx"
          download
          className="flex items-center gap-2 mt-6 text-blue-600 hover:underline"
        >
          <FaDownload />
          Download Example File
        </a>
      </div>
    </motion.section>
  );
} 