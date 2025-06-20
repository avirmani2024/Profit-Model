import React, { useState } from "react";
import HeroSection from "./HeroSection";
import UploadSection from "./UploadSection";
import SuggestedProducts from "./SuggestedProducts";
import WhyTrustUs from "./WhyTrustUs";

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

  return (
    <div>
      <HeroSection />
      <UploadSection onDrop={onDrop} fileName={fileName} loading={loading} />
      {/* Progress and Results UI */}
      {progress && (
        <div style={{ margin: "20px 0", textAlign: "center" }}>
          <h3>Processing Progress</h3>
          <p>
            {progress.rows_processed} / {progress.total_rows} rows processed
            {progress.eta_seconds !== null && !progress.done && (
              <> (ETA: {progress.eta_seconds} seconds)</>
            )}
          </p>
          {!progress.done && <span>⏳ Processing...</span>}
          {progress.done && <span>✅ Done!</span>}
        </div>
      )}
      {results && (
        <div style={{ margin: "20px 0", textAlign: "center" }}>
          <h3>Results</h3>
          <pre style={{ textAlign: "left", maxWidth: 600, margin: "0 auto", background: "#f4f4f4", padding: 10, borderRadius: 8 }}>
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
      {error && (
        <div style={{ color: "red", textAlign: "center", margin: "20px 0" }}>{error}</div>
      )}
      <SuggestedProducts />
      <WhyTrustUs />
    </div>
  );
}
