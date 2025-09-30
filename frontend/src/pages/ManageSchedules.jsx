import React, { useState } from "react";
import StatCard from "../components/StatCard";
import { FaClock } from "react-icons/fa";
import { BsCalendar2DateFill, BsFillPersonCheckFill } from "react-icons/bs";
import { SiGoogletasks } from "react-icons/si";
import { MdOutlineAutoGraph } from "react-icons/md";

const baseDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

const departments = ["Computer Science", "Electronics", "Civil"];

const generateColor = () => {
  const colors = [
    "#3B82F6",
    "#8B5CF6",
    "#22C55E",
    "#F59E0B",
    "#F87171",
    "#EF4444",
    "#10B981",
    "#FBBF24",
    "#F472B6",
    "#6366F1",
    "#F97316",
    "#06B6D4",
    "#D946EF",
    "#22D3EE",
    "#475569",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Predefined demo data for each department
const demoSchedules = {
  "Computer Science": [
    { day: "Monday", time: "09:00 AM", subject: "Math", room: "101", teacher: "Dr. Johnson", color: "#3B82F6" },
    { day: "Monday", time: "11:00 AM", subject: "Physics", room: "Lab 201", teacher: "Prof. Smith", color: "#22C55E" },
    { day: "Tuesday", time: "10:00 AM", subject: "Machine Learning", room: "Lab 302", teacher: "Dr. Davis", color: "#EF4444" },
    { day: "Wednesday", time: "01:00 PM", subject: "English", room: "102", teacher: "Prof. Taylor", color: "#8B5CF6" },
  ],
  Electronics: [
    { day: "Monday", time: "09:00 AM", subject: "Circuits", room: "201", teacher: "Dr. Clark", color: "#F59E0B" },
    { day: "Tuesday", time: "11:00 AM", subject: "Electronics Lab", room: "Lab 203", teacher: "Dr. White", color: "#F472B6" },
  ],
  Civil: [
    { day: "Monday", time: "10:00 AM", subject: "Structural Analysis", room: "301", teacher: "Dr. Brown", color: "#10B981" },
    { day: "Thursday", time: "01:00 PM", subject: "Concrete Technology", room: "302", teacher: "Prof. Green", color: "#FBBF24" },
  ],
};

const ManageSchedules = () => {
  const [selectedDept, setSelectedDept] = useState(departments[0]);
  const [schedules, setSchedules] = useState(demoSchedules);
  const [showModal, setShowModal] = useState(false);
  const [newClass, setNewClass] = useState({
    subject: "",
    teacher: "",
    room: "",
    day: baseDays[0],
    time: times[0],
  });

  const handleAddClass = () => {
    const classData = { ...newClass, color: generateColor() };
    setSchedules((prev) => ({
      ...prev,
      [selectedDept]: [...prev[selectedDept], classData],
    }));
    setShowModal(false);
    setNewClass({ subject: "", teacher: "", room: "", day: baseDays[0], time: times[0] });
  };

  const filteredSchedule = schedules[selectedDept];

  return (
    <div className="p-4 sm:p-6 md:p-10 overflow-x-auto">
      <div className="flex flex-row justify-between mb-6 items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Schedules</h1>
          <p className="text-sm text-gray-500">Department: {selectedDept}</p>
        </div>

        <div className="flex gap-2 items-center">
         
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-10 overflow-x-auto">

  {/* Top Cards */}

    <div className=" overflow-x-auto">
      
      {/* Top 4 Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Students"
          value="1,250"
          subtext="↑ 8.5% vs last week"
          icon={<BsFillPersonCheckFill />}
        />
        <StatCard
          title="Teaching Staff"
          value="45"
          subtext="Active faculty members"
          icon={<SiGoogletasks />}
        />
        <StatCard
          title="Avg Attendance"
          value="88%"
          subtext="↓ 2.3% vs last week"
          icon={<MdOutlineAutoGraph />}
        />
        <StatCard
          title="Teaching Hours"
          value="2,400"
          subtext="↑ 12.1% vs last week"
          icon={<FaClock />}
        />
      </div>


  {/* Department Dropdown + Add Class button */}
  <div className="flex flex-row justify-between mb-6 items-center">
    <div>
      <h1 className="text-xl font-bold text-gray-800">Class Schedule</h1>
      <p className="text-sm text-gray-500">Department: {selectedDept}</p>
    </div>

    <div className="flex gap-2 items-center">
      <select
        className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#2c3e86] outline-none"
        value={selectedDept}
        onChange={(e) => setSelectedDept(e.target.value)}
      >
        {departments.map((dept) => (
          <option key={dept} value={dept}>{dept}</option>
        ))}
      </select>

      <button
        className="px-4 py-2 bg-[#2c3e86] text-white rounded hover:bg-[#1f2b5f]"
        onClick={() => setShowModal(true)}
      >
        Add Class
      </button>
    </div>
  </div>

  {/* Timetable grid here (same as previous code) */}


      {/* Timetable Grid */}
      <div className="border border-gray-200 p-4 rounded-2xl w-full min-w-[700px]">
        <div className="grid grid-cols-[80px_repeat(5,1fr)] md:gap-2 gap-1 text-xs sm:text-sm md:text-base">
          <div className="font-bold">Time</div>
          {baseDays.map((day) => (
            <div key={day} className="font-bold text-center">{day}</div>
          ))}

          {times.map((time) => (
            <React.Fragment key={time}>
              <div className="font-semibold flex items-center">{time}</div>
              {baseDays.map((day) => {
                const item = filteredSchedule.find((s) => s.day === day && s.time === time);
                return (
                  <div key={day + time} className="h-12 sm:h-14 md:h-16 border border-gray-300 rounded flex items-center justify-center">
                    {item ? (
                      <div
                        className="p-1 h-full w-full rounded text-white text-[10px] sm:text-xs md:text-sm flex flex-col justify-center"
                        style={{ background: item.color }}
                      >
                        <p className="font-medium truncate">{item.subject}</p>
                        <p className="text-[9px] sm:text-[10px]">{item.room}</p>
                        <p className="text-[9px] sm:text-[10px]">{item.teacher}</p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      </div>

      {/* Add Class Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[350px]">
            <h2 className="text-lg font-bold mb-4">Add Class - {selectedDept}</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Subject"
                className="border border-gray-300 rounded px-3 py-2 outline-none"
                value={newClass.subject}
                onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
              />
              <input
                type="text"
                placeholder="Teacher"
                className="border border-gray-300 rounded px-3 py-2 outline-none"
                value={newClass.teacher}
                onChange={(e) => setNewClass({ ...newClass, teacher: e.target.value })}
              />
              <input
                type="text"
                placeholder="Room"
                className="border border-gray-300 rounded px-3 py-2 outline-none"
                value={newClass.room}
                onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
              />
              <select
                className="border border-gray-300 rounded px-3 py-2 outline-none"
                value={newClass.day}
                onChange={(e) => setNewClass({ ...newClass, day: e.target.value })}
              >
                {baseDays.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <select
                className="border border-gray-300 rounded px-3 py-2 outline-none"
                value={newClass.time}
                onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
              >
                {times.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>

              <div className="flex justify-end gap-2 mt-3">
                <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="px-4 py-2 bg-[#2c3e86] text-white rounded hover:bg-[#1f2b5f]" onClick={handleAddClass}>Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default ManageSchedules;
