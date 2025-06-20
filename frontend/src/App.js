import React, { useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import UploadSection from "./UploadSection";
import ProductTable from "./ProductTable";
import CategoryChart from "./CategoryChart";
import CalloutSection from "./CalloutSection";
import Footer from "./Footer";
import axios from "axios";
import TopProductsChart from "./TopProductsChart";
import ProfitMarginHistogram from "./ProfitMarginHistogram";
import CategoryAveragesChart from "./CategoryAveragesChart";
import CatalogSummaryChart from "./CatalogSummaryChart";
import SuggestedProducts from "./SuggestedProducts";
import WhyTrustUs from "./WhyTrustUs";

export default function App() {
  const [results, setResults] = useState([]);
  const [top5, setTop5] = useState([]);
  const [histogram, setHistogram] = useState({});
  const [categoryAverages, setCategoryAverages] = useState({});
  const [summary, setSummary] = useState({});
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [uploadId, setUploadId] = useState(null);

  // Poll progress if loading and uploadId is set
  useEffect(() => {
    let interval;
    if (loading && uploadId) {
      interval = setInterval(async () => {
        try {
          const res = await axios.get(`http://localhost:8000/progress/${uploadId}`);
          setProgress(res.data);
          if (res.data.done) {
            clearInterval(interval);
            // Fetch results when done
            const resultsRes = await axios.get(`http://localhost:8000/results/${uploadId}`);
            setResults(resultsRes.data.results || []);
            setTop5(resultsRes.data.top5 || []);
            setHistogram(resultsRes.data.histogram || {});
            setCategoryAverages(resultsRes.data.category_averages || {});
            setSummary(resultsRes.data.summary || {});
            setProgress(null);
            setUploadId(null);
            setLoading(false);
          }
        } catch (e) {
          // ignore
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [loading, uploadId]);

  // Backend integration: handle file upload and set results/chart
  const handleDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    setProgress({ rows_processed: 0, total_rows: 1, eta_seconds: null, done: false });
    setUploadId(null);
    setResults([]);
    setTop5([]);
    setHistogram({});
    setCategoryAverages({});
    setSummary({});
    const formData = new FormData();
    formData.append("file", file);
    // Get upload_id from backend
    const res = await axios.post("http://localhost:8000/process", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setUploadId(res.data.upload_id || null);
    // Do not set loading to false here; wait for polling to finish
  };

  return (
    <div className="bg-white min-h-screen font-inter">
      <HeroSection />
      <UploadSection onDrop={handleDrop} fileName={fileName} loading={loading} />
      <SuggestedProducts />
      {/* Progress bar and ETA */}
      {loading && progress && (
        <div className="max-w-xl mx-auto my-8 bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <div className="w-full mb-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Processing row {progress.rows_processed} of {progress.total_rows}</span>
              <span>ETA: {progress.eta_seconds !== null ? `${progress.eta_seconds}s` : 'Calculating...'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress.total_rows ? (progress.rows_processed / progress.total_rows) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <span className="text-xs text-gray-400">Please wait while we process your file...</span>
        </div>
      )}
      {results.length > 0 && (
        <>
          <ProductTable data={results} />
          {/* Dashboard grid of 4 charts */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <TopProductsChart data={top5} />
            <ProfitMarginHistogram data={histogram} />
            <CategoryAveragesChart data={categoryAverages} />
            <CatalogSummaryChart data={summary} />
          </div>
        </>
      )}
      <WhyTrustUs />
      <CalloutSection />
      <Footer />
    </div>
  );
} 