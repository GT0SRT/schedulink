// export default function ScheduleList() {
//   const testData = {
//     studentSchedule:[
//     { startTime: "10:00 AM", endTime: "11:00 AM", subject: "Math Lecture", teacher: "Dr. Sharma" },
//     { startTime: "12:00 PM", endTime: "1:00 AM", subject: "Physics Lab", teacher: "Prof. Mehta" },
//     { startTime: "1:00 PM", endTime:  "2:00 AM", subject: "Chemistry Lecture", teacher: "Prof. Mehta" },
//     { startTime: "1:00 PM", endTime:  "2:00 AM", subject: "Chemistry Lecture", teacher: "Prof. Mehta" },
//   ],
//   teacherSchedule:[
        
//   ]
// };

//   return (
//     <div className="bg-white shadow-lg rounded-2xl p-4 border border-gray-300">
//       <h3 className="font-semibold mb-3">Today’s Schedule</h3>
//       <ul className="space-y-2">
//         {events.map((e, i) => (
//           <li key={i} className="flex justify-between text-sm p-4 bg-gray-50 rounded">
//             <span>{e.startTime}</span> - <span>{e.endTime}</span>
            
//             <span>{e.subject}</span>
//             <span className="text-gray-500">{e.teacher}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }









export default function ScheduleList({ user }) {
  const testData = {
    studentSchedule: [
      { startTime: "10:00 AM", endTime: "11:00 AM", subject: "Data Structures", teacher: "Prof. Mehta" },
      { startTime: "12:00 PM", endTime: "1:00 PM", subject: "Analysis & Design of Algorithms", teacher: "Prof. Mehta" },
      { startTime: "1:00 PM", endTime: "2:00 PM", subject: "Math Lecture", teacher: "Dr. Sharma" },
    ],
    teacherSchedule: [
      
      { startTime: "10:00 AM", endTime: "11:00 AM", subject: "Data Structures", class: "CSE 3rd Year", location: "Room 301" },
      { startTime: "12:00 PM", endTime: "1:00 PM", subject: "Analysis & Design of Algorithms", class: "CSE 3rd Year", location: "Room 301" },
      { startTime: "10:00 AM", endTime: "11:00 AM", subject: "Data Structures", class: "CSE 3rd Year", location: "Room 301" },
      { startTime: "12:00 PM", endTime: "1:00 PM", subject: "Analysis & Design of Algorithms", class: "CSE 3rd Year", location: "Room 301" },
    ]
  };

  const events = user?.role === "t" ? testData.teacherSchedule : testData.studentSchedule;

  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 border border-gray-300">
      <h3 className="font-semibold mb-3">Today’s Schedule</h3>
      <ul className="space-y-2">
        {events.map((e, i) => (
          <li key={i} className="flex justify-between text-sm p-4 bg-gray-50 rounded">
            <span>{e.startTime}</span> - <span>{e.endTime}</span>
            <span>{e.subject}</span>
            {user?.role === "t" ? (
              <>
                <span className="text-gray-500">{e.class}</span>
                <span className="text-gray-500">{e.location}</span>
              </>
            ) : (
              <span className="text-gray-500">{e.teacher}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}


