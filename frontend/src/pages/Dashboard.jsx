import React, { useState, useEffect } from "react";
import Greetcard from "../components/Greetcard";
import CurrentClass from "../components/CurrentClass";
import StatCard from "../components/StatCard";
import ScheduleList from "../components/ScheduleList";
import MyCalendar from "../components/MyCalendar";

import {
  BsFileBarGraphFill,
  BsCalendar2DateFill,
  BsCalendar2WeekFill,
  BsFillPersonCheckFill,
} from "react-icons/bs";
import { SiGoogletasks } from "react-icons/si";
import { VscFeedback } from "react-icons/vsc";
import { MdOutlineAutoGraph } from "react-icons/md";
import { FaClock } from "react-icons/fa";
import useUserStore from "../store/userStore";

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [currentClass, setCurrentClass] = useState(null);
  const [username, setUsername] = useState("User");
  const [statsTeacher, setstatsTeacher] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const user = useUserStore((state) => state.user);
  const loading = useUserStore((state) => state.loading);
  const fetchUser = useUserStore((state) => state.fetchUser);
  console.log("Fetched user:", user);

  useEffect(() => {
    // Simulated API data
    const dummyData = {
      stats: [
        { title: "Attendance", value: "85%", subtext: "Updated today" },
        { title: "Tasks", value: "12", subtext: "Due this week" },
        { title: "Feedback", value: "5", subtext: "New responses" },
        { title: "Events", value: "3", subtext: "Upcoming" },
      ],
      statsTeacher: [
        { title: "Classes Taken", value: "120", subtext: "This semester" },
        { title: "Total Students", value: "240", subtext: "Across courses" },
        { title: "Feedback Received", value: "48", subtext: "This month" },
        { title: "Upcoming Lectures", value: "6", subtext: "Scheduled" },
      ],
      currentClass: {
        subject: "Mathematics",
        time: "10:00 - 11:00",
        location: "Room 101",
        teacher: "Mr. Ajeet",
        progress: 70,
        remaining: 30,
        present: 20,
        totalStudents: 30,
      },
      feedback: [
        { student: "Rahul", message: "Loved the class today!" },
        { student: "Priya", message: "Can you share notes?" },
        { student: "Amit", message: "Doubts in last topic." },
      ],
      username: "Arun Parmar",
    };

    setTimeout(() => {
      setStats(dummyData.stats);
      setCurrentClass(dummyData.currentClass);
      setUsername(dummyData.username);
      setFeedback(dummyData.feedback);
      setstatsTeacher(dummyData.statsTeacher);
      fetchUser();
      const f = JSON.parse(localStorage.getItem("class_feedbacks")) || [];
      setFeedback(f);
    }, 500);
  }, []);

  if (!user) return <div>Loading...</div>;
  if (loading) return <div>Loading...</div>;
  const recentFeedback = feedback.slice(0, 5);

  return (
    <div className="overflow-x-hidden overflow-y-hidden p-4 space-y-6 m-2">
      {/* Top Section: Greetcard + CurrentClass */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3 flex">
          <div className="flex-grow h-full">
            <Greetcard username={username} />
          </div>
        </div>
        <div className="w-full md:w-1/3 flex">
          <div className="flex-grow h-full">
            <CurrentClass
              subject={currentClass?.subject || "No subject"}
              time={currentClass?.time || "00:00 - 00:00"}
              location={currentClass?.location || "Not assigned"}
              teacher={currentClass?.teacher || "TBA"}
              progress={currentClass?.progress || 0}
              remaining={currentClass?.remaining || 0}
              present={currentClass?.present || 0}
              totalStudents={currentClass?.totalStudents || 0}
              user={user}
            />
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const icons = [
            <BsFileBarGraphFill />,
            <SiGoogletasks />,
            <VscFeedback />,
            <BsCalendar2DateFill />
          ];
          return (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              subtext={stat.subtext}
              icon={icons[index] || <BsFileBarGraphFill />}
            />
          );
        })}
      </div> */}

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {(user?.role === "t" ? statsTeacher : stats).map((stat, index) => {
          // Icons for teacher
          const teacherIcons = [
            <FaClock />,
            <BsCalendar2DateFill />,
            <SiGoogletasks />,
            <MdOutlineAutoGraph />,
          ];

          // Icons for student
          const studentIcons = [
            <BsFillPersonCheckFill />,
            <SiGoogletasks />,
            <VscFeedback />,
            <BsCalendar2WeekFill />,
          ];

          const icons = user?.role === "t" ? teacherIcons : studentIcons;

          return (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              subtext={stat.subtext}
              icon={icons[index] || <BsFileBarGraphFill />}
            />
          );
        })}
      </div>

      {/* Schedule List + Calendar
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-[760px]">
        <MyCalendar />
        </div>
        <div className="w-full md:w-[400px]">
          <ScheduleList />
        </div>
      </div> */}

      <div className="flex flex-col md:flex-row gap-4">
        {user?.role === "t" ? (
          <>
            {/* Feedback Section for Teacher */}
            <div className="w-full md:w-[760px] bg-[#2c3e86] text-white p-4 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Student Feedback</h2>
              {feedback.length > 0 ? (
                recentFeedback.map((f, id) => (
                  <div
                    key={f.id}
                    className="bg-white shadow-md rounded-xl p-4 border border-[#3D57bb]/20 hover:shadow-lg transition duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-[#2C3E86] text-lg">
                        {f.subject}
                      </div>
                      <div className="text-sm text-gray-400">
                        {f.className || "CSE 3rd Year"}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-1">
                      Instructor:{" "}
                      <span className="font-medium text-[#3D57bb]">
                        {f.instructor}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 mb-1">
                      Understanding:{" "}
                      <span className="font-medium">{f.understanding} / 5</span>
                    </div>

                    {f.comment && (
                      <div className="mt-2 text-gray-700 bg-[#3D57bb]/10 p-2 rounded-md border border-[#3D57bb]/20 text-sm">
                        <strong>Comment:</strong> {f.comment}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No feedback yet.</p>
              )}
            </div>

            {/* Teacher's Schedule */}
            <div className="w-full md:w-[600px]">
              <ScheduleList user={user} />
            </div>
          </>
        ) : (
          <>
            {/* Student Calendar + Schedule */}
            <div className="w-full md:w-[760px]">
              <MyCalendar />
            </div>
            <div className="w-full md:w-[400px]">
              <ScheduleList user={user} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
