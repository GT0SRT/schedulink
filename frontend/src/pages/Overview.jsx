
import React from "react";

const Overview= () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <select className="border rounded-lg px-3 py-1 bg-white shadow-sm">
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            🔔
          </button>
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            🌙
          </button>
        </div>
      </header>

      {/* System Alerts */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6 shadow-sm">
        <p className="font-semibold text-yellow-800">⚠ Low Attendance Alert</p>
        <p className="text-sm text-gray-600">
          Mechanical Engineering showing 15% drop in attendance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-gray-500 text-sm">Total Students</h3>
          <p className="text-2xl font-bold">1,250</p>
          <p className="text-green-500 text-xs">↑ 8.5% vs last week</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-gray-500 text-sm">Teaching Staff</h3>
          <p className="text-2xl font-bold">45</p>
          <p className="text-gray-500 text-xs">Active faculty members</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-gray-500 text-sm">Avg Attendance</h3>
          <p className="text-2xl font-bold">88%</p>
          <p className="text-red-500 text-xs">↓ 2.3% vs last week</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-gray-500 text-sm">Teaching Hours</h3>
          <p className="text-2xl font-bold">2,400</p>
          <p className="text-green-500 text-xs">↑ 12.1% vs last week</p>
        </div>
      </div>

      
{/* Main Grid */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Department Performance */}
  <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
    <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
      📊 Department Performance
    </h2>
    <div className="space-y-6">
      {[
        {
          name: "Computer Science",
          teachers: 18,
          attendance: "92%",
          rating: "4.5/5",
          performance: "91%",
          students: 450,
        },
        {
          name: "Electronics",
          teachers: 12,
          attendance: "89%",
          rating: "4.2/5",
          performance: "87%",
          students: 320,
        },
        {
          name: "Mechanical",
          teachers: 10,
          attendance: "85%",
          rating: "4.1/5",
          performance: "84%",
          students: 280,
        },
        {
          name: "Civil",
          teachers: 5,
          attendance: "87%",
          rating: "4.3/5",
          performance: "87%",
          students: 200,
        },
      ].map((dept) => (
        <div
          key={dept.name}
          className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-sm transition"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-800">{dept.name}</h3>
            <span className="text-sm text-gray-500">
              {dept.students} students
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            👨‍🏫 {dept.teachers} Teachers | 📋 Attendance: {dept.attendance} | ⭐ {dept.rating}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-500 h-2 rounded-full"
              style={{ width: dept.performance }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Overall Performance: {dept.performance}
          </p>
        </div>
      ))}
    </div>
  </div>


{/* Right Column (Profile + Activities in separate cards) */}
<div className="flex flex-col gap-6">
  {/* Admin Profile */}
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
    <div className="flex items-center gap-4 mb-5">
      <div className="w-14 h-14 rounded-full bg-indigo-500 text-white flex items-center justify-center text-lg font-bold shadow-md">
        DSW
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">Dr. Sarah Wilson</h3>
        <p className="text-sm text-gray-600">admin@university.edu</p>
        <p className="text-xs text-gray-500">System Administrator</p>
      </div>
    </div>

    {/* Extra Details */}
    <div className="space-y-2 text-sm text-gray-700 ">
      <p>
        <span className="font-semibold text-gray-800">Role: </span>
        System Administrator
      </p>
      <p>
        <span className="font-semibold text-gray-800">Institution: </span>
        Tech University
      </p>
      <p>
        <span className="font-semibold text-gray-800">Last Login: </span>
        Today 9:15 AM
      </p>
    </div>
  </div>

  {/* Recent Activities */}
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
    <h4 className="font-semibold mb-4 text-gray-800">📌 Recent Activities</h4>
    <ul className="space-y-4 text-sm">
      {[
        {
          icon: "✅",
          text: "New student registered: Alice Johnson",
          time: "2h ago",
        },
        {
          icon: "📩",
          text: "Dr. Smith submitted absence request",
          time: "4h ago",
        },
        {
          icon: "📅",
          text: "Schedule updated for CS Dept",
          time: "6h ago",
        },
        {
          icon: "⚠",
          text: "Low feedback rating alert for Algorithms",
          time: "1d ago",
        },
        {
          icon: "🔧",
          text: "System maintenance completed",
          time: "2d ago",
        },
      ].map((activity, i) => (
        <li
          key={i}
          className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 transition"
        >
          <span className="text-lg">{activity.icon}</span>
          <div>
            <p className="text-gray-700">{activity.text}</p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
</div>


  
</div>




      {/* Bottom Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-gray-500 text-sm">Student Satisfaction</h3>
          <p className="text-2xl font-bold">91%</p>
          <p className="text-green-500 text-xs">↑ 4.2% improvement</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-gray-500 text-sm">Class Rating</h3>
          <p className="text-2xl font-bold">4.3/5</p>
          <p className="text-gray-500 text-xs">Average across classes</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-gray-500 text-sm">Active Classes</h3>
          <p className="text-2xl font-bold">180</p>
          <p className="text-gray-500 text-xs">This semester</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-gray-500 text-sm">Absenteeism Rate</h3>
          <p className="text-2xl font-bold">12%</p>
          <p className="text-red-500 text-xs">Needs attention</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;

