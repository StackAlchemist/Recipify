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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="space-grotesk font-bold text-3xl text-emerald-600">
        Analytics
      </h1>

      <div className="shadow-xl mt-8 bg-white p-6 rounded-3xl">
        <h2 className="source-code-pro text-lg mb-4">
          Your most <span className="text-emerald-600">liked</span> recipes
        </h2>

        {isLoading ? (
          <Placeholder />
        ) : (
          <div className="flex flex-col gap-6">
            {analytics?.map((item, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg flex items-center p-4 gap-4 bg-gray-50 shadow-sm"
              >
                <img
                  src={`../../server${item.imagePath}`}
                  alt={item.name}
                  className="w-[300px] h-[180px] object-cover rounded-lg bg-gray-300"
                />

                <div className="flex flex-col flex-1 gap-3">
                  <h3 className="font-semibold text-2xl">{item.name}</h3>
                  <p className="text-sm text-gray-700">{item.desc}</p>
                  <p className="text-sm flex items-center gap-2 text-gray-800">
                    <FaHeart className="text-red-500" /> {item.likes.length}
                  </p>
                </div>

                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
