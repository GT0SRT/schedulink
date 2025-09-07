// import React, { useState } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// export default function Calender() {
//   const [date, setDate] = useState(new Date());
//   const [events, setEvents] = useState([
//     // { date: new Date(2025, 8, 6), title: "Orientation" },
//   ]);

//   const addEvent = () => {
//     const title = window.prompt("Enter event title:");
//     if (title) {
//       setEvents([...events, { date, title }]);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center bg-white shadow-lg rounded-xl p-4 w-fit mx-auto border border-gray-200">
//       <h2 className="text-base font-semibold mb-2">My Calendar</h2>

//       <DatePicker
//         selected={date}
//         onChange={(d) => setDate(d)}
//         inline
//       />

//       <button
//         onClick={addEvent}
//         className="mt-2 px-3 py-1.5 bg-[#2c3e86] text-white text-sm rounded-lg"
//       >
//         Add Event
//       </button>


//       <div className="mt-3 w-full text-center ">
//         <h3 className="text-sm font-semibold mb-1">Events</h3>
//         <ul className="space-y-1 text-sm">
//           {events
//             .filter((e) => e.date.toDateString() === date.toDateString())
//             .map((e, i) => (
//               <li key={i} className="p-1 bg-gray-100 rounded text-gray-700">
//                 {e.title}
//               </li>
//             ))}
//         </ul>
//       </div>
//     </div>
//   );
// }










import React, { useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import enUS from "date-fns/locale/en-US";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const MyCalendar = () => {
  const [events, setEvents] = useState([]);

  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt("Enter event title:");
    if (title) {
      setEvents([...events, { start, end, title, boxSize: "small" }]);
    }
  };

  return (
    <div
      className=" rounded-xl p-2 border border-gray-200 shadow-xl"      
    >
      <h2 className="text-base font-semibold text-center p-2">My Calendar</h2>
      <div className="w-full h-[75vh] sm:h-[60vh] md:h-[350px] lg:h-[350px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          style={{ height: "95%", borderRadius: "20px", padding: "10px" }}
          toolbar={true}
          defaultView={Views.MONTH}
          views={{ month: true }}
          eventPropGetter={(event) => {
            return {
              style: {
                color: "white",
                padding: "1px 3px",
                fontSize: event.boxSize === "small" ? "0.75rem" : "0.9rem",
                borderRadius: "3px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              },
            };
          }}
        />
      </div>
    </div>
  );
};

export default MyCalendar;


