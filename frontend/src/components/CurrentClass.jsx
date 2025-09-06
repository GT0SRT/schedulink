import React from "react";

const CurrentClass = ({ subject, time, location, teacher, progress, remaining }) => {
  return (
    <div className="bg-[#2c3e86] text-white rounded-2xl md:mt-5 p-6 md:p-4 shadow-lg">
      <h2 className="text-sm mb-1">Current Class</h2>
      <h3 className="text-xl font-bold">{subject}</h3>
      <p className="text-xs mb-1">{time}</p>

      <div className="flex items-center gap-4 text-xs mb-2">
        <span>📍 {location}</span>
        <span>👨‍🏫 {teacher}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/30 h-2 rounded-lg overflow-hidden mb-2">
        <div
          className="bg-blue-300 h-2"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p className="text-xs mb-2">{remaining} minutes remaining</p>

      <button className="bg-white text-black rounded-lg py-2 md:py-1 px-4 font-semibold w-full">
        Mark Attendance
      </button>
    </div>
  );
};

export default CurrentClass;
