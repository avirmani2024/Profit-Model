import React, { useState } from "react";
import HeroSection from "./HeroSection";
import UploadSection from "./UploadSection";
import SuggestedProducts from "./SuggestedProducts";
import WhyTrustUs from "./WhyTrustUs";
import ProductTable from "./ProductTable";
import TopProductsChart from "./TopProductsChart";
import ProfitMarginHistogram from "./ProfitMarginHistogram";
import CategoryChart from "./CategoryChart";
import CatalogSummaryChart from "./CatalogSummaryChart";

export default function App() {
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const pollProgressAndResults = async (uploadId) => {
    setProgress({ rows_processed: 0, total_rows: 1, eta_seconds: null, done: false });
    setResults(null);
    setError(null);
    let done = false;
    while (!done) {
      try {
        const progRes = await fetch(`https://profit-model.onrender.com/progress/${uploadId}`);
        const progData = await progRes.json();
        setProgress(progData);
        done = progData.done;
        if (!done) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      } catch (err) {
        setError("Error fetching progress");
        break;
      }
    }
    // Fetch results
    try {
      const resRes = await fetch(`https://profit-model.onrender.com/results/${uploadId}`);
      const resData = await resRes.json();
      setResults(resData);
    } catch (err) {
      setError("Error fetching results");
    }
  };

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    setFileName(file.name);
    setLoading(true);
    setProgress(null);
    setResults(null);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://profit-model.onrender.com/process", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.upload_id) {
        pollProgressAndResults(data.upload_id);
      } else {
        setError("No upload_id returned from backend");
      }
    } catch (error) {
      setError("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Progress bar style
  const progressPercent = progress && progress.total_rows > 0 ? Math.round((progress.rows_processed / progress.total_rows) * 100) : 0;

  return (
    <div>
      <HeroSection />
      <UploadSection onDrop={onDrop} fileName={fileName} loading={loading} />
      {/* Progress Bar and Spinner */}
      {progress && !progress.done && (
        <div className="flex flex-col items-center my-8">
          <div className="w-full max-w-md bg-gray-200 rounded-full h-4 mb-2">
            <div
              className="bg-indigo-600 h-4 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-700 mb-1">
            {progress.rows_processed} / {progress.total_rows} rows processed
            {progress.eta_seconds !== null && (
              <> (ETA: {progress.eta_seconds} seconds)</>
            )}
          </div>
          <div className="text-indigo-600 animate-spin text-2xl">⏳</div>
        </div>
      )}
      {/* Results Section */}
      {results && results.results && results.results.length > 0 && (
        <>
          <ProductTable data={results.results} />
          {results.top5 && <TopProductsChart data={results.top5} />}
          {results.histogram && <ProfitMarginHistogram data={results.histogram} />}
          {results.category_averages && <CategoryChart chartData={{
            labels: Object.keys(results.category_averages),
            datasets: [{
              label: 'Avg. Profit Margin %',
              data: Object.values(results.category_averages),
              backgroundColor: '#818cf8',
            }],
          }} />}
          {results.summary && <CatalogSummaryChart data={results.summary} />}
        </>
      )}
      {error && (
        <div style={{ color: "red", textAlign: "center", margin: "20px 0" }}>{error}</div>
      )}
      <SuggestedProducts />
      <WhyTrustUs />
    </div>
  );
}
