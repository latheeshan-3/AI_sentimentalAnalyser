"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaSmile, FaMeh, FaFrown } from "react-icons/fa";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submitFeedback = async () => {
    if (!feedback.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/feedback", { text: feedback });
      setMessage(`🤖 ${res.data.response}`);
      setFeedback("");
    } catch (error) {
      setMessage("❌ Something went wrong. Try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-200 via-white to-orange-50 p-6">
      {/* Card Container */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 max-w-lg w-full border border-white/40 transition-all hover:shadow-2xl">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-orange-700 mb-4">
          Share Your Feedback
        </h1>

        {/* Subtitle */}
        <p className="text-center text-gray-700 mb-6">
          We’d love to hear your thoughts about our food, service, or ambiance.
        </p>

        {/* Feedback Input */}
        <textarea
          className="border border-orange-300 rounded-lg p-4 w-full h-32 
                     focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none mb-4
                     bg-white text-gray-800 placeholder-gray-400"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Type your feedback here..."
        />

        {/* Submit Button */}
        <button
          className={`w-full flex justify-center items-center gap-2 text-white px-4 py-3 rounded-lg text-lg font-medium shadow-md
            transition-all duration-300 ${
              loading
                ? "bg-orange-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 active:scale-95"
            }`}
          onClick={submitFeedback}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>

        {/* Feedback Message */}
        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.startsWith("🤖") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Fun Icons */}
        <div className="flex justify-center gap-8 mt-8 text-orange-400 text-3xl">
          <FaSmile className="hover:scale-110 transition-transform duration-200" />
          <FaMeh className="hover:scale-110 transition-transform duration-200" />
          <FaFrown className="hover:scale-110 transition-transform duration-200" />
        </div>

        {/* View Overall Feedback Button */}
        <button
          className="w-full mt-6 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white py-3 rounded-lg transition-all text-lg font-medium shadow-md"
          onClick={() => router.push("/feedback/visualization")}
        >
          View Overall Feedback
        </button>
      </div>
    </div>
  );
}
