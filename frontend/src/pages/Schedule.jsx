// import React, { useEffect, useState } from "react";

// const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
// const times = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];

// const Schedule = () => {
//   const [schedule, setSchedule] = useState([
//     {
//       day: "Monday",
//       time: "09:00 AM",
//       subject: "Mathematics",
//       room: "Room 101",
//       teacher: "Dr. Johnson",
//       color: "#3B82F6",
//     },
//     {
//       day: "Monday",
//       time: "11:00 AM",
//       subject: "Physics",
//       room: "Lab 201",
//       teacher: "Prof. Smith",
//       color: "#22C55E",
//     },
//     {
//       day: "Tuesday",
//       time: "10:00 AM",
//       subject: "Machine Learning",
//       room: "Lab 302",
//       teacher: "Dr. Davis",
//       color: "#EF4444",
//     },
//     {
//       day: "Wednesday",
//       time: "09:00 AM",
//       subject: "Computer Networks",
//       room: "Room 108",
//       teacher: "Prof. Anderson",
//       color: "#F472B6",
//     },
//     {
//       day: "Thursday",
//       time: "11:00 AM",
//       subject: "Algorithms",
//       room: "Room 205",
//       teacher: "Dr. Lee",
//       color: "#06B6D4",
//     },
//     {
//       day: "Friday",
//       time: "09:00 AM",
//       subject: "Project Work",
//       room: "Lab 301",
//       teacher: "Dr. Brown",
//       color: "#475569",
//     },
//   ]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/dashboard");
//         const data = await res.json();
//         setSchedule(data.schedule);
//       } catch (err) {
//         console.error("Error fetching schedule:", err);
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <div className="p-10 overflow-x-auto">
//       <h1 className="text-xl md:text-2xl font-bold mb-4">Class Schedule</h1>

//       <div className="grid grid-cols-6 md:gap-2 gap-1 text-sm md:text-base min-w-[600px]">
//         <div className="font-bold">Time</div>
//         {days.map((day) => (
//           <div key={day} className="font-bold text-center">
//             {day}
//           </div>
//         ))}

//         {times.map((time) => (
//           <React.Fragment key={time}>
//             <div className="font-semibold flex items-center">{time}</div>
//             {days.map((day) => {
//               const item = schedule.find(
//                 (s) => s.day === day && s.time === time
//               );
//               return (
//                 <div
//                   key={day + time}
//                   className="h-16 sm:h-20 md:h-24 border border-gray-300 rounded flex items-center justify-center"
//                 >
//                   {item ? (
//                     <div
//                       className="p-1 h-16 sm:h-20 md:h-24 sm:p-2  rounded text-white text-xs sm:text-sm w-full text-center"
//                       style={{ background: item.color }}
//                     >
//                       <p className="font-medium truncate m-1 md:m-2">{item.subject}</p>
//                       <p className="text-[10px] sm:text-xs">{item.room}</p>
//                       <p className="text-[10px] sm:text-xs">{item.teacher}</p>
//                     </div>
//                   ) : null}
//                 </div>
//               );
//             })}
//           </React.Fragment>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Schedule;

import React, { useEffect, useState } from "react";

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

const Schedule = () => {
  const [schedule, setSchedule] = useState([
  // Monday
  { day: "Monday", time: "09:00 AM", subject: "Mathematics", room: "Room 101", teacher: "Dr. Johnson", color: "#3B82F6" },
  { day: "Monday", time: "04:00 PM", subject: "English", room: "Room 102", teacher: "Prof. Taylor", color: "#8B5CF6" },
  { day: "Monday", time: "11:00 AM", subject: "Physics", room: "Lab 201", teacher: "Prof. Smith", color: "#22C55E" },
  { day: "Monday", time: "01:00 PM", subject: "History", room: "Room 103", teacher: "Dr. Adams", color: "#F59E0B" },

  // Tuesday
  { day: "Tuesday", time: "09:00 AM", subject: "Chemistry", room: "Lab 202", teacher: "Dr. Wilson", color: "#F87171" },
  { day: "Tuesday", time: "10:00 AM", subject: "Machine Learning", room: "Lab 302", teacher: "Dr. Davis", color: "#EF4444" },
  { day: "Tuesday", time: "11:00 AM", subject: "Philosophy", room: "Room 104", teacher: "Prof. Clarke", color: "#10B981" },
  { day: "Tuesday", time: "02:00 PM", subject: "Physical Education", room: "Gym", teacher: "Coach Mike", color: "#FBBF24" },

  // Wednesday
  { day: "Wednesday", time: "09:00 AM", subject: "Computer Networks", room: "Room 108", teacher: "Prof. Anderson", color: "#F472B6" },
  { day: "Wednesday", time: "10:00 AM", subject: "Mathematics", room: "Room 101", teacher: "Dr. Johnson", color: "#3B82F6" },
  { day: "Wednesday", time: "01:00 PM", subject: "English", room: "Room 102", teacher: "Prof. Taylor", color: "#8B5CF6" },
  { day: "Wednesday", time: "03:00 PM", subject: "Biology", room: "Lab 203", teacher: "Dr. Moore", color: "#6366F1" },

  // Thursday
  { day: "Thursday", time: "09:00 AM", subject: "Economics", room: "Room 105", teacher: "Dr. Harris", color: "#F97316" },
  { day: "Thursday", time: "11:00 AM", subject: "Algorithms", room: "Room 205", teacher: "Dr. Lee", color: "#06B6D4" },
  { day: "Thursday", time: "01:00 PM", subject: "Art", room: "Room 106", teacher: "Prof. White", color: "#D946EF" },
  { day: "Thursday", time: "03:00 PM", subject: "Machine Learning", room: "Lab 302", teacher: "Dr. Davis", color: "#EF4444" },

  // Friday
  { day: "Friday", time: "09:00 AM", subject: "Project Work", room: "Lab 301", teacher: "Dr. Brown", color: "#475569" },
  { day: "Friday", time: "10:00 AM", subject: "Computer Science", room: "Room 107", teacher: "Prof. Allen", color: "#22D3EE" },
  { day: "Friday", time: "11:00 AM", subject: "Mathematics", room: "Room 101", teacher: "Dr. Johnson", color: "#3B82F6" },
  { day: "Friday", time: "05:00 PM", subject: "Physics", room: "Lab 201", teacher: "Prof. Smith", color: "#22C55E" },
]);


  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [days, setDays] = useState(getWeekDays(new Date()));
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");

  // ✅ function to get week days with date
  function getWeekDays(startDate) {
    const start = new Date(startDate);
    const monday = new Date(
      start.setDate(start.getDate() - start.getDay() + 1)
    );
    return baseDays.map((day, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return { label: day, date: d.toISOString().split("T")[0] };
    });
  }

  // ✅ week navigation
  const changeWeek = (dir) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + dir * 7);
    setCurrentWeekStart(newDate);
    setDays(getWeekDays(newDate));
  };

  // ✅ filter schedule
  const filteredSchedule = schedule.filter((s) => {
    const subjectMatch =
      selectedSubject === "All" || s.subject === selectedSubject;
    const dateMatch =
      !selectedDate ||
      days.some((d) => d.date === selectedDate && d.label === s.day);
    return subjectMatch && dateMatch;
  });

  const subjects = ["All", ...new Set(schedule.map((s) => s.subject))];

  return (
    <div className="p-4 sm:p-6 md:p-10 overflow-x-auto">
        <div className="flex flex-row justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Class Schedule</h1>
          <p className="text-sm text-gray-500">
            View your weekly class timetable
          </p>
        </div>

        <select
          className="mt-3 md:mt-0 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#2c3e86] outline-none w-[90px]"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          {subjects.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

        <div className="border border-gray-200 p-4 sm:p-6 md:p-10 rounded-2xl w-full min-w-[700px]">
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => changeWeek(-1)}
                className="px-3 py-1 bg-white rounded hover:bg-gray-100"
              >
                ◀ Prev Week
              </button>
              <button
                onClick={() => changeWeek(1)}
                className="px-3 py-1 bg-white rounded hover:bg-gray-100"
              >
                Next Week ▶
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[80px_repeat(5,1fr)] md:gap-2 gap-1 text-xs sm:text-sm md:text-base">
            <div className="font-bold">Time</div>
            {days.map((d) => (
              <div key={d.date} className="font-bold text-center">
                {d.label}
                <br />
                <span className="text-xs text-gray-500">{d.date}</span>
              </div>
            ))}

            {times.map((time) => (
              <React.Fragment key={time}>
                <div className="font-semibold flex items-center">{time}</div>
                {days.map((day) => {
                  const item = filteredSchedule.find(
                    (s) => s.day === day.label && s.time === time
                  );
                  return (
                    <div
                      key={day + time}
                      className="h-12 sm:h-14 md:h-16 border border-gray-300 rounded flex items-center justify-center"
                    >
                      {item ? (
                        <div
                          className="p-1 h-full w-full rounded text-white text-[10px] sm:text-xs md:text-sm flex flex-col justify-center"
                          style={{ background: item.color }}
                        >
                          <p className="font-medium truncate">{item.subject}</p>
                          <p className="text-[9px] sm:text-[10px]">
                            {item.room}
                          </p>
                          <p className="text-[9px] sm:text-[10px]">
                            {item.teacher}
                          </p>
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

  );
};

export default Schedule;
