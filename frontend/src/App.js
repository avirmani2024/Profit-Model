import React from "react";
import HeroSection from "./HeroSection";
import UploadSection from "./UploadSection";
import SuggestedProducts from "./SuggestedProducts";
import WhyTrustUs from "./WhyTrustUs";
import axios from "axios";
import Lottie from "lottie-react";
import spreadsheetAnim from "./Animation - 1750309740676.json";

// If you have any API calls, update them to use the deployed backend:
// Example:
// axios.post("https://profit-model.onrender.com/process", ...)

export default function App() {
  return (
    <div>
      <HeroSection />
      <UploadSection />
      <SuggestedProducts />
      <WhyTrustUs />
    </div>
  );
}
