"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBrain, FaLightbulb, FaChartLine, FaRobot, FaImage } from "react-icons/fa";

const features = [
  {
    title: "AI-Powered Insights",
    description: "Get actionable predictions powered by cutting-edge AI technology.",
    icon: <FaBrain className="text-white text-4xl" />,
  },
  {
    title: "Innovative Solutions",
    description: "Transform your ideas into results with our AI-driven platform.",
    icon: <FaLightbulb className="text-white text-4xl" />,
  },
  {
    title: "Real-Time Analysis",
    description: "Experience fast and accurate predictions for your data.",
    icon: <FaChartLine className="text-white text-4xl" />,
  },
  {
    title: "User-Friendly AI",
    description: "Easily integrate AI predictions into your workflow.",
    icon: <FaRobot className="text-white text-4xl" />,
  },
];

export default function Home() {
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [messages, setMessages] = useState([]);

  const handlePredict = () => {
    if (!input.trim() && !image) return;

    const mockPrediction = image
      ? `Predicted output for uploaded image: "${image.name}"`
      : `Predicted output for "${input}"`;

    setMessages([
      ...messages,
      { type: "input", text: input || `Image: ${image.name}` },
      { type: "prediction", text: mockPrediction },
    ]);

    setInput("");
    setImage(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handlePredict();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div className="font-poppins h-screen flex flex-col">
      {/* Hero Section */}
      <header className="text-center py-16 bg-purple-50">
        <motion.h1
          className="text-5xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Unlock the Power of <span className="text-green-600">AI Predictions</span>
        </motion.h1>
        <motion.p
          className="max-w-3xl mx-auto text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          Input your data or upload an image, and let our advanced AI model generate
          predictions that can transform your workflow.
        </motion.p>
      </header>

      {/* Features Section */}
      <section className="py-8 px-4 md:px-12 bg-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-500">
            Why Choose <span className="text-green-600">Our AI Platform</span>?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white shadow-md rounded-lg transform transition-transform hover:scale-105 flex flex-col items-center"
              >
                <span className="flex items-center justify-center mb-4 p-4 rounded-full bg-purple-500">
                  {feature.icon}
                </span>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Interface */}
      <div className="flex-grow px-4 py-8 bg-white overflow-auto">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.type === "input" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-sm p-3 rounded-lg ${
                    msg.type === "input"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-900"
                  } shadow`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Input Section */}
      <div className="fixed bottom-0 left-0 right-0 md:w-[60%] w-full mx-auto bg-white shadow-lg px-4 py-3 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your input..."
          className="flex-grow px-4 py-2 border-2 md:w-1/2 w-2/3 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
        <label className="cursor-pointer px-4 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-md flex items-center gap-2">
          <FaImage />
          <span>Upload Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
        <button
          onClick={handlePredict}
          className="px-4 py-2 text-white bg-purple-600 rounded-full hover:bg-purple-700 shadow-md"
        >
          Predict
        </button>
      </div>
    </div>
  );
}
