import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { FaClock } from "react-icons/fa";
import { BsCalendar2DateFill, BsFillPersonCheckFill } from "react-icons/bs";
import { SiGoogletasks } from "react-icons/si";
import { MdOutlineAutoGraph } from "react-icons/md";
import axios from "axios";
import useUserStore from "../store/userStore";
import useDepartmentStore from "../store/departmentStore";

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

const generateColor = () => {
  const colors = [ "#3B82F6", "#8B5CF6", "#22C55E", "#F59E0B", "#F87171", "#EF4444", 
  "#10B981", "#FBBF24", "#F472B6", "#6366F1", "#F97316", "#06B6D4", "#D946EF", 
  "#22D3EE", "#475569",];
  return colors[Math.floor(Math.random() * colors.length)];
};

const ManageSchedules = () => {
  const { user } = useUserStore();
  const { departments, courses, fetchDepartments, fetchCourses } = useDepartmentStore();

  useEffect(() => {
    if (user) fetchDepartments();
  }, [user, fetchDepartments]);

  const [selectedDept, setSelectedDept] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newClass, setNewClass] = useState({
    course: "",
    teacher: "",
    room: "",
    day: baseDays[0],
    time: times[0],
  });
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    if (selectedDept) fetchCourses(selectedDept);
  }, [selectedDept, fetchCourses]);

const fetchTeachers = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/teacher/my-teachers`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    setTeachers(res.data.teachers || []);
  } catch (err) {
    console.error("Error fetching teachers:", err.response?.data || err.message);
  }
};

useEffect(() => {
  fetchTeachers();
}, []);

  const [timetable, setTimetable] = useState([]);
  const fetchTimeTable = async () => {
    // setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/timetable/${encodeURIComponent(selectedDept)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      if (res.status !== 200) throw new Error("Failed to fetch timetable");
      setTimetable([...res.data.timetable]);
    } catch (err) {
      console.error("Error fetching timetable:", err);
    } finally {
      // setLoading(false);
    }
  };
  useEffect(() => {
    if (selectedDept) fetchTimeTable();
  }, [selectedDept]);

const addClassToBackend = async (department, classData) => {
  const API_BASE = import.meta.env.VITE_API_URL || "";
  const className = encodeURIComponent(department);
  const day = encodeURIComponent(classData.day || "");
  const url = `${API_BASE}/api/timetable/${className}/${day}/period`;

  console.debug("Posting timetable to:", url, { department, ...classData });

  try {
    const res = await axios.post(
      url,{
        time: classData.time,
        course: classData.course,
        room: classData.room,
        teacher: classData.teacher,
        color: classData.color,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    console.error(
      "Error posting timetable:",
      err.response?.data || err.message
    );
    throw new Error(
      err.response?.data?.message ||
        `Failed to post timetable: ${err.message}`
    );
  }
};

// Main function that uses it
const [Schedules, setSchedules] = useState([]);
const handleAddClass = async () => {
  const classData = { ...newClass, color: generateColor() };
  try {
    const saved = await addClassToBackend(selectedDept, classData);
    setSchedules((prev) => ({
      ...prev,
      [selectedDept]: [...(prev[selectedDept] || []), saved],
    }));

    setShowModal(false);
    setNewClass({
      course: "",
      teacher: "",
      room: "",
      day: baseDays[0],
      time: times[0],
    });

    // toast.success("Class added successfully!");
  } catch (err) {
    console.error("Failed to add class:", err);
    alert("Failed to add class. See console for details.");
  }
};

  return (
    <div className="p-4 sm:p-6 md:p-10 overflow-x-auto">
      <div className="flex flex-row justify-between mb-6 items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Schedules</h1>
          {/* <p className="text-sm text-gray-500">Department: {selectedDept}</p> */}
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
      {/* <p className="text-sm text-gray-500">Department: {selectedDept}</p> */}
    </div>

    <div className="flex gap-2 items-center">
      <select
        className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#2c3e86] outline-none"
        value={selectedDept}
        onChange={(e) => setSelectedDept(e.target.value)}
      >
        <option value="">Select Department</option>
        {departments.map((dept) => (
          <option key={dept._id} value={dept._id}>{dept.name}</option>
        ))}
      </select>
      <button
        className="px-4 py-2 bg-[#2c3e86] cursor-pointer text-white rounded hover:bg-[#1f2b5f]"
        onClick={() => setShowModal(true)}
      >
        Add Class
      </button>
    </div>
  </div>

  {/* Timetable grid here */}
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
                const dayObj = timetable.find(d => d.day === day);
                const item = dayObj?.periods.find(p => p.time === time);
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
            <h2 className="text-lg font-bold mb-4">Add Class </h2>
            <div className="flex flex-col gap-3">
              {/* <input
                type="text"
                placeholder="Subject"
                className="border border-gray-300 rounded px-3 py-2 outline-none cursor-pointer"
                value={newClass.subject}
                onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
              /> */}
              <select
                className="border border-gray-300 rounded px-3 py-2 outline-none cursor-pointer"
                value={newClass.course}
                onChange={(e) => setNewClass({ ...newClass, course: e.target.value })}
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                className="border border-gray-300 rounded px-3 py-2 outline-none cursor-pointer"
                value={newClass.teacher}
                onChange={(e) => setNewClass({ ...newClass, teacher: e.target.value })}
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t._id} value={`${t.userId.firstName} ${t.userId.lastName}`}>
                    {t.userId.firstName} {t.userId.lastName}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Room"
                className="border border-gray-300 rounded px-3 py-2 outline-none"
                value={newClass.room}
                onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
              />
              <select
                className="border border-gray-300 rounded px-3 py-2 outline-none cursor-pointer"
                value={newClass.day}
                onChange={(e) => setNewClass({ ...newClass, day: e.target.value })}
              >
                {baseDays.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <select
                className="border border-gray-300 rounded px-3 py-2 outline-none cursor-pointer"
                value={newClass.time}
                onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
              >
                {times.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>

              <div className="flex justify-end gap-2 mt-3">
                <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="px-4 py-2 bg-[#2c3e86] text-white rounded hover:bg-[#1f2b5f] cursor-pointer" onClick={handleAddClass}>Add</button>
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
