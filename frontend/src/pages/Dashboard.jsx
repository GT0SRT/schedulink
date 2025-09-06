import React, { useState, useEffect } from 'react';
import Greetcard from '../components/Greetcard';
import CurrentClass from '../components/CurrentClass';
import StatCard from '../components/StatCard';
import ScheduleList from '../components/ScheduleList';
import MyCalendar from '../components/MyCalendar';

import { BsFileBarGraphFill, BsCalendar2DateFill } from "react-icons/bs";
import { SiGoogletasks } from "react-icons/si";
import { VscFeedback } from "react-icons/vsc";

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [currentClass, setCurrentClass] = useState(null);
  const [username, setUsername] = useState("User");

  useEffect(() => {
    // Simulated API data
    const dummyData = {
      stats: [
        { title: "Attendance", value: "85%", subtext: "Updated today" },
        { title: "Tasks", value: "12", subtext: "Due this week" },
        { title: "Feedback", value: "5", subtext: "New responses" },
        { title: "Events", value: "3", subtext: "Upcoming" },
      ],
      currentClass: {
        subject: "Mathematics",
        time: "10:00 - 11:00",
        location: "Room 101",
        teacher: "Mr. Smith",
        progress: 70,
        remaining: 30,
      },
      username: "Jane Doe",
    };

    setTimeout(() => {
      setStats(dummyData.stats);
      setCurrentClass(dummyData.currentClass);
      setUsername(dummyData.username);
    }, 500);
  }, []);

  return (
    <div className="overflow-x-hidden p-4 space-y-6 m-2">

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
            />
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
      </div>

      {/* Schedule List + Calendar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-[760px]">
        <MyCalendar />  
        </div>
        <div className="w-full md:w-[400px]">
          <ScheduleList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
