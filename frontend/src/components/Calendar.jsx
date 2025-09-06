import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Calender() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([
    // { date: new Date(2025, 8, 6), title: "Orientation" },
  ]);

  const addEvent = () => {
    const title = window.prompt("Enter event title:");
    if (title) {
      setEvents([...events, { date, title }]);
    }
  };

  return (
    <div className="flex flex-col items-center bg-white shadow-lg rounded-xl p-4 w-fit mx-auto border border-gray-200">
      <h2 className="text-base font-semibold mb-2">My Calendar</h2>

      <DatePicker
        selected={date}
        onChange={(d) => setDate(d)}
        inline
      />

      <button
        onClick={addEvent}
        className="mt-2 px-3 py-1.5 bg-[#2c3e86] text-white text-sm rounded-lg"
      >
        Add Event
      </button>


      <div className="mt-3 w-full text-center ">
        <h3 className="text-sm font-semibold mb-1">Events</h3>
        <ul className="space-y-1 text-sm">
          {events
            .filter((e) => e.date.toDateString() === date.toDateString())
            .map((e, i) => (
              <li key={i} className="p-1 bg-gray-100 rounded text-gray-700">
                {e.title}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
