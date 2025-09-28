import React, { useState, useMemo } from "react";
import SubjectCard from "../components/subjectCard";
import AttendanceCalendar from "../components/AttendanceCalendar";

const THEME_DARK = "#2C3E86";
const THEME_LIGHT = "#3D57bb";

// Dummy subjects
const subjectsData = [
  { id: 1, name: "Mathematics", instructor: "Dr. Sharma", totalSessions: 20, present: 15 },
  { id: 2, name: "Physics", instructor: "Prof. Verma", totalSessions: 18, present: 12 },
  { id: 3, name: "Chemistry", instructor: "Dr. Singh", totalSessions: 22, present: 19 },
  { id: 4, name: "Biology", instructor: "Dr. Rao", totalSessions: 16, present: 10 },
  { id: 5, name: "English", instructor: "Prof. Wilson", totalSessions: 15, present: 14 },
];

export default function TrackAttendance() {
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Derived overview stats (demo version)
  const metrics = useMemo(() => {
    const totalSessions = subjectsData.reduce((s, sub) => s + sub.totalSessions, 0);
    const totalPresent = subjectsData.reduce((s, sub) => s + sub.present, 0);
    const overallPct = Math.round((totalPresent / totalSessions) * 100);
    return {
      overallPct,
      thisMonthCount: 18, // static demo
      thisWeekCount: 5, // static demo
      target: 85,
    };
  }, []);

  return (
    <div className="p-8 text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold" style={{ color: THEME_DARK }}>
          Attendance Tracking
        </h1>
        <p className="text-sm text-gray-400">
          Monitor your class attendance and maintain your academic record
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow border" style={{ borderColor: `${THEME_DARK}22` }}>
          <div className="text-sm text-gray-500">Overall Attendance</div>
          <div className="text-2xl font-bold mt-2" style={{ color: "#16a34a" }}>
            {metrics.overallPct}%
          </div>
          <div className="text-xs text-gray-400 mt-1">Above target ({metrics.target}%)</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border" style={{ borderColor: `${THEME_LIGHT}22` }}>
          <div className="text-sm text-gray-500">This Month</div>
          <div className="text-2xl font-bold mt-2" style={{ color: THEME_LIGHT }}>
            {metrics.thisMonthCount} present
          </div>
          <div className="text-xs text-gray-400 mt-1">This month</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border" style={{ borderColor: `${THEME_DARK}22` }}>
          <div className="text-sm text-gray-500">This Week</div>
          <div className="text-2xl font-bold mt-2" style={{ color: "#8b5cf6" }}>
            {metrics.thisWeekCount} present
          </div>
          <div className="text-xs text-gray-400 mt-1">This week</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border" style={{ borderColor: `${THEME_LIGHT}22` }}>
          <div className="text-sm text-gray-500">Target</div>
          <div className="text-2xl font-bold mt-2">{metrics.target}%</div>
          <div className="text-xs text-gray-400 mt-1">Minimum required</div>
        </div>
      </div>

      {/* Subject-wise attendance */}
      <div className="bg-white rounded-xl p-6 shadow border mb-8" style={{ borderColor: `${THEME_DARK}22` }}>
        <h3 className="font-semibold text-lg mb-4 text-gray-800">Subject-wise Attendance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectsData.map((sub) => {
            const percent = Math.round((sub.present / sub.totalSessions) * 100);
            return (
              <div key={sub.id} className="p-5 rounded-lg bg-[#f9fafb] border border-[#e9eefb] shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-lg text-gray-800">{sub.name}</div>
                    <div className="text-xs text-gray-500">{sub.instructor}</div>
                  </div>
                  <div className="text-right">
                    <div
                      className="font-bold"
                      style={{
                        color: percent >= 90 ? "#16a34a" : percent >= 75 ? "#f59e0b" : "#ef4444",
                      }}
                    >
                      {percent}%
                    </div>
                    <div className="text-xs text-gray-400">{sub.present}/{sub.totalSessions}</div>
                  </div>
                </div>

                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${percent}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${THEME_LIGHT}, ${THEME_DARK})`,
                    }}
                  />
                </div>

                <button
                  onClick={() => setSelectedSubject(sub)}
                  className="mt-4 w-full py-2 text-sm bg-[#2C3E86] text-white rounded-lg shadow hover:opacity-90"
                >
                  Track Attendance
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for Calendar */}
      {selectedSubject && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-70 z-50 flex justify-center items-center px-4">
          <div className="bg-[#2C3E86] rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-xl relative">
            <AttendanceCalendar subject={selectedSubject.name} onClose={() => setSelectedSubject(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
