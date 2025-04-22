import React, { useEffect, useState } from "react";
import Placeholder from "../components/placeholder";
import axios from "axios";
import { toast } from "react-toastify";
import { FaHeart } from "react-icons/fa";

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  const getAnalytics = async () => {
    const userId = localStorage.getItem("userID");
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/analytics/${userId}`
      );
      setAnalytics(response.data.analysis);
    } catch (error) {
      toast.error("Error loading analytics");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAnalytics();
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h1 className="space-grotesk font-bold text-2xl md:text-3xl text-emerald-600">
        Analytics
      </h1>

      <div className="shadow-xl mt-6 md:mt-8 bg-white p-4 md:p-6 rounded-3xl">
        <h2 className="source-code-pro text-base md:text-lg mb-4">
          Your most <span className="text-emerald-600">liked</span> recipes
        </h2>

        {isLoading ? (
          <Placeholder />
        ) : (
          <div className="flex flex-col gap-6">
            {analytics?.map((item, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg flex flex-col md:flex-row items-center p-4 gap-4 bg-gray-50 shadow-sm"
              >
                <img
                  src={`https://recipify-backend.onrender.com${item.imagePath}`}
                  alt={item.name}
                  className="w-full md:w-[300px] h-[200px] object-cover rounded-lg bg-gray-300"
                />

                <div className="flex flex-col flex-1 gap-2 text-center md:text-left">
                  <h3 className="font-semibold text-xl md:text-2xl">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-700">{item.desc}</p>
                </div>

                <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-300 rounded-full flex justify-center items-center mt-2 md:mt-0">
                  <p className="text-xs md:text-sm flex flex-col items-center text-white">
                    <FaHeart className="text-red-500" /> {item.likes.length}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
