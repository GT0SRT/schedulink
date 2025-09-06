import React, { useEffect, useState } from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];

const Schedule = () => {
  const [schedule, setSchedule] = useState([
    {
      day: "Monday",
      time: "09:00 AM",
      subject: "Mathematics",
      room: "Room 101",
      teacher: "Dr. Johnson",
      color: "#3B82F6",
    },
    {
      day: "Monday",
      time: "11:00 AM",
      subject: "Physics",
      room: "Lab 201",
      teacher: "Prof. Smith",
      color: "#22C55E",
    },
    {
      day: "Tuesday",
      time: "10:00 AM",
      subject: "Machine Learning",
      room: "Lab 302",
      teacher: "Dr. Davis",
      color: "#EF4444",
    },
    {
      day: "Wednesday",
      time: "09:00 AM",
      subject: "Computer Networks",
      room: "Room 108",
      teacher: "Prof. Anderson",
      color: "#F472B6",
    },
    {
      day: "Thursday",
      time: "11:00 AM",
      subject: "Algorithms",
      room: "Room 205",
      teacher: "Dr. Lee",
      color: "#06B6D4",
    },
    {
      day: "Friday",
      time: "09:00 AM",
      subject: "Project Work",
      room: "Lab 301",
      teacher: "Dr. Brown",
      color: "#475569",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard");
        const data = await res.json();
        setSchedule(data.schedule);
      } catch (err) {
        console.error("Error fetching schedule:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-10 overflow-x-auto">
      <h1 className="text-xl md:text-2xl font-bold mb-4">Class Schedule</h1>

      <div className="grid grid-cols-6 md:gap-2 gap-1 text-sm md:text-base min-w-[600px]">
        <div className="font-bold">Time</div>
        {days.map((day) => (
          <div key={day} className="font-bold text-center">
            {day}
          </div>
        ))}

        {times.map((time) => (
          <React.Fragment key={time}>
            <div className="font-semibold flex items-center">{time}</div>
            {days.map((day) => {
              const item = schedule.find(
                (s) => s.day === day && s.time === time
              );
              return (
                <div
                  key={day + time}
                  className="h-16 sm:h-20 md:h-24 border border-gray-300 rounded flex items-center justify-center"
                >
                  {item ? (
                    <div
                      className="p-1 h-16 sm:h-20 md:h-24 sm:p-2  rounded text-white text-xs sm:text-sm w-full text-center"
                      style={{ background: item.color }}
                    >
                      <p className="font-medium truncate m-1 md:m-2">{item.subject}</p>
                      <p className="text-[10px] sm:text-xs">{item.room}</p>
                      <p className="text-[10px] sm:text-xs">{item.teacher}</p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
