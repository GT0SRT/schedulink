// components/AttendanceCalendar.jsx
import React, { useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "react-icons/hi2";
import { FaCheck, FaTimes, FaRegCalendarAlt } from "react-icons/fa";

export default function AttendanceCalendar({ subject, onClose }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({}); // dummy data

  const today = new Date();
  const year = currentMonth.getFullYear();
  const monthName = currentMonth.toLocaleString("default", { month: "long" });

  useEffect(() => {
    // Dummy attendance for demo
    const dummy = {
      "2025-09-05": "present",
      "2025-09-06": "absent",
      "2025-09-07": "holiday",
    };
    setAttendanceData(dummy);
  }, [subject]);

  const formatKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;

  const daysInMonth = new Date(year, currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(year, currentMonth.getMonth(), 1).getDay();

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, currentMonth.getMonth(), d));
  }

  const statusColors = {
    present: "bg-green-600/40 border-green-400/30",
    absent: "bg-red-600/40 border-red-400/30",
    holiday: "bg-blue-600/40 border-blue-400/30",
  };

  return (
    <div className="relative p-6 text-white">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute text-2xl top-0 right-2 text-white px-3 py-1 rounded-md font-semibold hover:bg-red-500 hover:text-white"
      >
        x
      </button>

      <div className="flex items-center gap-2 mb-4">
        <FaRegCalendarAlt />
        <h2 className="text-xl font-bold">Attendance for {subject}</h2>
      </div>

      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentMonth(new Date(year, currentMonth.getMonth() - 1, 1))}>
          {/* <ChevronLeft className="text-white text-xl" /> */}
        </button>
        <span className="text-lg font-semibold">
          {monthName} {year}
        </span>
        <button
          onClick={() => {
            const nextMonth = new Date(year, currentMonth.getMonth() + 1, 1);
            if (nextMonth <= today) setCurrentMonth(nextMonth);
          }}
        >
          {/* <ChevronRight className="text-white text-xl" /> */}
        </button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 text-center text-sm text-gray-300 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((date, idx) => {
          if (!date) return <div key={idx}></div>;

          const key = formatKey(date);
          const status = attendanceData[key];

          let classes =
            "flex items-center justify-center h-10 w-10 rounded-lg text-sm transition-all ";

          if (status) {
            classes += `${statusColors[status]} backdrop-blur-md border text-white`;
          } else if (formatKey(today) === key) {
            classes += "bg-pink-600/40 border border-pink-400/30 backdrop-blur-md text-white";
          } else if (date > today) {
            classes += "bg-gray-700/40 text-gray-400 opacity-50";
          } else {
            classes += "hover:bg-white/10 text-white border border-gray-600/20";
          }

          return (
            <div
              key={idx}
              className={classes}
              onClick={() => date <= today && setSelectedDate(date)}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 text-sm text-gray-300">
        <div className="flex gap-4 flex-wrap">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-green-600/40 border border-green-400/30"></span>
            Present
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-red-600/40 border border-red-400/30"></span>
            Absent
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-blue-600/40 border border-blue-400/30"></span>
            Holiday
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-pink-600/40 border border-pink-400/30"></span>
            Today
          </span>
        </div>
      </div>
    </div>
  );
}