import React from "react";

const CurrentClass = ({ subject, time, location, teacher, progress, remaining }) => {
  return (
    <div className="bg-[#2c3e86] text-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-lg font-medium mb-2">Current Class</h2>
      <h3 className="text-2xl font-bold">{subject}</h3>
      <p className="text-sm mb-2">{time}</p>

      <div className="flex items-center gap-4 text-sm mb-4">
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

      <p className="text-sm mb-4">{remaining} minutes remaining</p>

      <button className="bg-white text-black rounded-lg py-2 px-4 font-semibold w-full">
        Mark Attendance
      </button>
    </div>
  );
};

export default CurrentClass;
