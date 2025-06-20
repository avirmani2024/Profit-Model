import { useDropzone } from "react-dropzone";
import { FaFileCsv, FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";
import React, { useState } from "react";

export default function UploadSection({ onDrop, fileName, loading }) {
  const [showFormat, setShowFormat] = useState(false);
  const [miniRows, setMiniRows] = useState([
    { description: "", price: "", category: "" },
    { description: "", price: "", category: "" },
    { description: "", price: "", category: "" },
  ]);

  const handleMiniRowChange = (idx, field, value) => {
    setMiniRows((rows) =>
      rows.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };

  const handleMiniDownload = () => {
    const header = ["Description", "Starting wholesale Price", "Category"];
    const csv = [
      header.join(","),
      ...miniRows
        .filter((r) => r.description && r.price)
        .map((r) =>
          [r.description, r.price, r.category].map((v) => `"${v}"`).join(",")
        ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my_products.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

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
      <div id="upload-section" className="bg-softSlate rounded-2xl shadow-xl p-8 flex flex-col items-center w-full max-w-xl border border-deepMidnight">
        {/* Collapsible CSV Formatting Box */}
        <div className="mb-8">
          <button
            className="flex items-center gap-2 text-electricPurple font-semibold px-4 py-2 rounded-t-lg bg-softSlate hover:bg-electricPurple/10 transition shadow-sm"
            onClick={() => setShowFormat((v) => !v)}
          >
            <span>{showFormat ? "Hide" : "Show"} CSV Formatting Guide</span>
            <span className="text-lg">{showFormat ? "▲" : "▼"}</span>
          </button>
          {showFormat && (
            <div className="bg-softSlate rounded-b-xl shadow-md p-6 border-t border-deepMidnight text-iceWhite">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-limeAccent">
                    <span className="text-limeAccent">✔</span> Required Columns
                  </h2>
                  <ul className="list-disc ml-6 text-iceWhite mb-3">
                    <li><span className="text-limeAccent">✔</span> <b>Description</b></li>
                    <li><span className="text-limeAccent">✔</span> <b>Starting wholesale Price</b></li>
                    <li><span className="text-limeAccent">(Optional)</span> <b>Category</b></li>
                  </ul>
                  <button
                    className="bg-limeAccent text-deepMidnight font-semibold px-4 py-2 rounded-full shadow hover:bg-limeAccent/80 transition mb-4"
                    onClick={() => window.open("/Fake_Product_List_Wholesale_Prices.csv", "_blank")}
                  >
                    ⬇ Download Example Template
                  </button>
                  <div className="overflow-x-auto border rounded-lg bg-deepMidnight p-2 mb-2">
                    <table className="min-w-max text-sm text-iceWhite">
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
                  <div className="text-limeAccent font-semibold mt-2">
                    <span>We never store your data. All processing is secure and private.</span>
                  </div>
                </div>
                {/* Mini-form to generate CSV */}
                <div className="flex-1 bg-deepMidnight rounded-lg p-4 shadow-inner border border-deepMidnight">
                  <h3 className="font-semibold mb-2 text-iceWhite">Quick CSV Builder</h3>
                  <form
                    onSubmit={e => { e.preventDefault(); handleMiniDownload(); }}
                    className="flex flex-col gap-2"
                  >
                    {miniRows.map((row, idx) => (
                      <div key={idx} className="flex gap-2 mb-1">
                        <input
                          type="text"
                          placeholder="Description"
                          className="border border-softSlate rounded px-2 py-1 flex-1 bg-softSlate text-iceWhite placeholder-iceWhite/60"
                          value={row.description}
                          onChange={e => handleMiniRowChange(idx, "description", e.target.value)}
                          required={idx === 0}
                        />
                        <input
                          type="number"
                          placeholder="Wholesale Price"
                          className="border border-softSlate rounded px-2 py-1 w-32 bg-softSlate text-iceWhite placeholder-iceWhite/60"
                          value={row.price}
                          onChange={e => handleMiniRowChange(idx, "price", e.target.value)}
                          required={idx === 0}
                        />
                        <input
                          type="text"
                          placeholder="Category (optional)"
                          className="border border-softSlate rounded px-2 py-1 w-32 bg-softSlate text-iceWhite placeholder-iceWhite/60"
                          value={row.category}
                          onChange={e => handleMiniRowChange(idx, "category", e.target.value)}
                        />
                      </div>
                    ))}
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-electricPurple to-purple-500 text-iceWhite font-semibold px-4 py-2 rounded-full shadow hover:scale-105 transition-transform duration-150 mt-2"
                    >
                      Download My CSV
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          {...getRootProps()}
          className={`w-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition ${
            isDragActive ? "border-electricPurple bg-electricPurple/10" : "border-[#31224a]"
          }`}
        >
          <input {...getInputProps()} />
          <motion.button
            className="bg-gradient-to-r from-electricPurple to-purple-500 text-iceWhite font-bold py-3 px-8 rounded-full text-lg shadow-md flex items-center gap-2 hover:scale-105 transition-transform duration-150"
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <FaFileCsv className="text-2xl animate-bounce" />
            Upload CSV
          </motion.button>
          <p className="mt-3 text-iceWhite/80 text-sm">
            CSV or Excel file must include columns: <b>Description</b>, <b>Starting wholesale Price</b>
          </p>
        </div>
        {/* Upload feedback */}
        {fileName && (
          <div className="mt-3 flex items-center gap-2 text-limeAccent font-semibold">
            <span className="truncate max-w-xs">{fileName}</span>
            {loading && <span className="animate-spin ml-2">⏳</span>}
            {!loading && <span className="text-limeAccent">✔️ Uploaded!</span>}
          </div>
        )}
        {/* Example File */}
        <a
          href="/Fake_Product_List_Wholesale_Prices.csv"
          download
          className="flex items-center gap-2 mt-6 text-electricPurple hover:underline"
        >
          <FaDownload />
          Download Example File
        </a>
      </div>
    </motion.section>
  );
} 