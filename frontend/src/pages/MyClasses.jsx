import React, { useState } from "react";
import StatCard from "../components/StatCard";
import ClassManage from "../components/ClassManage";
import RecentPlan from "../components/RecentPlan";
import { IoBookOutline } from "react-icons/io5";
import { RiGroupLine } from "react-icons/ri";
import { MdOutlineTaskAlt } from "react-icons/md";
import { RiTimeLine } from "react-icons/ri";
import { X } from "lucide-react";


const MyClasses = () => {
  const [plans, setPlans] = useState([
    { id: 1, title: "Intro to React", description: "Hooks & Components", duration: "2 hrs", date: "10 Sep 2025" },
    { id: 2, title: "JavaScript Review", description: "ES6 + Async Await", duration: "1.5 hrs", date: "12 Sep 2025" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [planTitle, setPlanTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");

  const statsClass = [
    { id: 1, title: "Active Classes", value: 4, subtitle: "This semester" },
    { id: 2, title: "Total Students", value: 160, subtitle: "Across all classes" },
    { id: 3, title: "Avg Attendance", value: "91%", subtitle: "Overall average" },
    { id: 4, title: "Hours Taught", value: 92, subtitle: "This semester" },
  ];

  const teacherIcons = [
    <IoBookOutline />,
    <RiGroupLine />,
    <MdOutlineTaskAlt />,
    <RiTimeLine />,
  ];

  const classData = [
    {
      subject: "Web Development",
      code: "CS301",
      schedule: "Mon & Wed, 10:00 AM",
      location: "Lab 204",
      students: 45,
      attendance: 92,
      progress: 75,
      hours: "20/40",
    },
    {
      subject: "Data Structures",
      code: "CS201",
      schedule: "Tue & Thu, 12:00 PM",
      location: "Room 110",
      students: 55,
      attendance: 89,
      progress: 60,
      hours: "30/35",
    },
  ];

  const handleAddPlan = (e) => {
    e.preventDefault();
    if (!planTitle || !description || !duration || !date) return;

    const newPlan = {
      id: Date.now(),
      title: planTitle,
      description,
      duration,
      date,
    };

    setPlans([newPlan, ...plans]);
    setPlanTitle("");
    setDescription("");
    setDuration("");
    setDate("");
    setShowForm(false);
  };

  return (
    <div className="overflow-x-hidden overflow-y-hidden p-4 space-y-6 m-2">
      {/* Header */}
      <div>
        <h1 className="font-bold text-[29px] md:text-[32px]">My Classes</h1>
        <p className="text-gray-500 text-sm md:text-base">
          Manage your classes, track progress, and create teaching plans.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {statsClass.map((stat, index) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            subtext={stat.subtitle}
            icon={teacherIcons[index]}
          />
        ))}
      </div>

      {/* Class Manage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classData.map((cls, idx) => (
          <ClassManage
            key={idx}
            {...cls}
            onAddPlan={() => setShowForm(true)}
          />
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 h-screen flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[90%] md:w-[450px] shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Plan</h3>
              <button onClick={() => setShowForm(false)}>
                <X size={22} />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleAddPlan}>
              <input
                type="text"
                placeholder="Plan Title"
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2c3e86] outline-none"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2c3e86] outline-none"
              />
              <input
                type="text"
                placeholder="Duration (e.g. 2 hrs)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2c3e86] outline-none"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2c3e86] outline-none"
              />
              <button
                type="submit"
                className="w-full bg-[#2c3e86] text-white py-2 rounded-lg hover:bg-[#1f2b60] transition"
              >
                Save Plan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Recent Plans */}
      <RecentPlan plans={plans} />
    </div>
  );
};

export default MyClasses;
