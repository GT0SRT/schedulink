import React from "react";

const StatCard = ({ title, value, subtext, icon }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 flex flex-col items-center justify-center text-center h-full">
       <div className="flex items-center gap-2 text-lg mb-2">
        <h2 className="text-xl font-semibold text-black">{title}</h2>
        <span className="text-2xl text-[#2c3e86]">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-[#2c3e86]">{value}</p>
      <span className="text-gray-500 text-sm mt-1">{subtext}</span>
    </div>
  );
};

export default StatCard;



