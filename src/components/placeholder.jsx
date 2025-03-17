import { motion } from "framer-motion";
import React from "react";

const Placeholder = () => {
  return (
    <motion.div
      className="flex flex-col gap-6 p-4 max-w-6xl mx-auto"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="border border-gray-300 rounded-lg flex flex-col md:flex-row items-center gap-4 p-4 bg-gray-100 shadow-sm"
        >
          {/* Placeholder Image */}
          <div className="w-full md:w-[300px] h-[180px] bg-gray-300 rounded-lg"></div>

          {/* Placeholder Text */}
          <div className="flex flex-col gap-3 flex-1 w-full">
            <div className="w-3/4 h-5 bg-gray-300 rounded-lg"></div>
            <div className="w-2/3 h-4 bg-gray-300 rounded-lg"></div>
            <div className="w-1/3 h-4 bg-gray-300 rounded-lg"></div>
          </div>

          {/* Placeholder Icon (Heart) */}
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        </div>
      ))}
    </motion.div>
  );
};

export default Placeholder;
