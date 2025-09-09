import React, {useState} from "react";

const CurrentClass = ({ subject, time, location, teacher, progress, remaining, present, totalStudents, user }) => {

  const [showForm, setShowForm] = useState(false);
  const [planTitle, setPlanTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [keyTopic, setKeyTopic] = useState("");

  const submitPlan = (e) => {
    e.preventDefault();
    const newPlan = { planTitle, description, duration, keyTopic };
    console.log("Plan submitted:", newPlan);
    // TODO: Save to backend or localStorage
    setShowForm(false);
    setPlanTitle("");
    setDescription("");
    setDuration("");
    setKeyTopic("");
  };

  return (
    <div className="bg-[#2c3e86] text-white rounded-2xl md:mt-5 p-6 md:p-4 shadow-lg">
      <h2 className="text-sm mb-1">Current Class</h2>
      <h3 className="text-xl font-bold">{subject}</h3>
      <p className="text-xs mb-1">{time}</p>
        {user?.role === "t" && (
        <div className="flex items-center gap-4 text-xs mb-2">
        <span> 👥{present} /{totalStudents} Present </span>
        <span>👨‍🏫 {teacher}</span>
      </div>
        )}

        {user?.role === "s" && (
          <div className="flex items-center gap-4 text-xs mb-2">
        <span>📍 {location}</span>
        <span>👨‍🏫 {teacher}</span>
          </div>
        )}
      

      {/* Progress bar */}
      <div className="w-full bg-white/30 h-2 rounded-lg overflow-hidden mb-2">
        <div
          className="bg-blue-300 h-2"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

       {user?.role === "t" && (
        <p className="text-xs mb-2">Attendance Rate: {totalStudents ? Math.floor((present * 100) / totalStudents) : 0}%</p>
       )}

       {user?.role === "s" && (
        <p className="text-xs mb-2">{remaining} minutes remaining</p>
       )}
      
      {user?.role === "t" && (
        <div className="flex gap-2">
          <button className="bg-white text-black rounded-lg py-2 md:py-1 px-4 font-semibold w-2/3 ">
         Start Class
        </button>
        <button className="bg-white text-black rounded-lg py-1 md:py-1 px-2 font-semibold w-1/3 " onClick={() => setShowForm(true)}>
         Add Plan
        </button>
        </div>
      )}
      {user?.role === "s" && (
        <button className="bg-white text-black rounded-lg py-2 md:py-1 px-4 font-semibold w-full">
        Mark Attendance
        </button>
      )}
      

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowForm(false)}
          ></div>

          <form
            onSubmit={submitPlan}
            className="relative z-50 bg-white rounded-xl p-6 w-full max-w-md shadow-lg flex flex-col gap-3 text-black"
          >
            <h3 className="text-xl font-bold text-[#2C3E86] mb-2">Add Class Plan</h3>

            <input
              type="text"
              placeholder="Plan Title"
              value={planTitle}
              onChange={(e) => setPlanTitle(e.target.value)}
              className="border px-3 py-2 rounded-lg w-full"
              required
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border px-3 py-2 rounded-lg w-full"
              rows={3}
              
            />

            <input
              type="text"
              placeholder="Duration (e.g., 60 min)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="border px-3 py-2 rounded-lg w-full"
            
            />

            <input
              type="text"
              placeholder="Key Topic"
              value={keyTopic}
              onChange={(e) => setKeyTopic(e.target.value)}
              className="border px-3 py-2 rounded-lg w-full"
              
            />

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-white font-semibold"
                style={{ backgroundColor: "#3D57bb" }}
              >
                Save Plan
              </button>
            </div>
          </form>
        </div>
      )} 

    </div>
  );
};

export default CurrentClass;
