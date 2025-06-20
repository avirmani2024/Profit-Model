import React, { useState } from "react";
import HeroSection from "./HeroSection";
import UploadSection from "./UploadSection";
import SuggestedProducts from "./SuggestedProducts";
import WhyTrustUs from "./WhyTrustUs";

export default function App() {
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    setFileName(file.name);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetch("https://profit-model.onrender.com/process", {
        method: "POST",
        body: formData,
      });
      // Optionally handle response here
    } catch (error) {
      // Optionally handle error here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <HeroSection />
      <UploadSection onDrop={onDrop} fileName={fileName} loading={loading} />
      <SuggestedProducts />
      <WhyTrustUs />
    </div>
  );
}
