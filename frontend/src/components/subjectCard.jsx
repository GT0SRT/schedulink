import React from "react";
import { FaBook } from "react-icons/fa";

export default function SubjectCard({ subject, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-[#2c3e86] hover:bg-[#3249a1] text-white transition p-4 rounded-xl shadow-md cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <FaBook className="text-xl" />
        <h2 className="text-lg font-semibold">{subject}</h2>
      </div>
      <p className="text-sm text-gray-200 mt-1">Tap to view attendance</p>
    </div>
  );
}