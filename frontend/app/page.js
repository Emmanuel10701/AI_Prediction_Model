"use client"; // Ensure this works in Next.js 13+ with client-side rendering

import { useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";  // Material UI Spinner
import { AiOutlineCloudUpload, AiOutlineCamera, AiOutlineCheckCircle } from "react-icons/ai"; // React Colored Icons
import { MdFileUpload } from "react-icons/md"; // React Colored Icon for upload

export default function UploadImage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResults, setPredictionResults] = useState(null);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedImage) return alert("Please select an image!");

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      // Send image to Django backend for processing
      const response = await axios.post("http://localhost:8000/api/predict/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setPredictionResults(response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white shadow-xl rounded-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Upload a Photo for AI Prediction
        </h1>

        {/* File input for image */}
        <div className="flex justify-center items-center mb-4">
          <label className="cursor-pointer w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600">
            <AiOutlineCamera className="text-blue-500 text-3xl mx-auto" />
            <span className="block text-center mt-2">Select Image</span>
            <input
              type="file"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Upload button */}
        <button
          onClick={handleUpload}
          className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} className="mx-auto" />
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <AiOutlineCloudUpload className="text-white text-xl" />
              <span>Upload & Predict</span>
            </div>
          )}
        </button>

        {/* Display prediction results */}
        {predictionResults && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800">Prediction Results</h2>
            <div className="mt-2">
              <p className="text-gray-700">
                <strong>Age: </strong>
                {predictionResults.age || "Not Available"}
              </p>
              <p className="text-gray-700">
                <strong>Ethnicity: </strong>
                {predictionResults.ethnicity || "Not Available"}
              </p>
              <p className="text-gray-700">
                <strong>Gender: </strong>
                {predictionResults.gender || "Not Available"}
              </p>
              <div className="flex justify-center mt-4">
                <AiOutlineCheckCircle className="text-green-500 text-3xl" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
