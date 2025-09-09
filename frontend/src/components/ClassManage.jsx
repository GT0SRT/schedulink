import React from "react";

const ProgressBar = ({ percentage, color = "#2c3e86" }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden my-2">
      <div
        className="h-2 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      ></div>
    </div>
  );
};

const ClassManage = ({
  subject,
  code,
  schedule,
  location,
  students,
  attendance,
  progress,
  hours,
  onAddPlan,
}) => {
  const [done, total] = hours.split("/").map(Number);
  const hourPercentage = Math.round((done / total) * 100);

  return (
    <div className="bg-white rounded-xl shadow p-5 space-y-3 border border-gray-200 hover:shadow-lg transition">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold">{subject}</h2>
          <p className="text-gray-500 text-sm">{code}</p>
        </div>
        <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
          Active
        </span>
      </div>

      <div className="text-sm space-y-2">
        <div className="flex justify-between">
          <p>
            <strong>Schedule:</strong> {schedule}
          </p>
          <p>
            <strong>Location:</strong> {location}
          </p>
        </div>
        <div className="flex grid-cols-2 justify-between">
          <div className="space-y-1">
            <p>
              <strong>Students:</strong> {students}
            </p>
            <p>
              <strong>Attendance:</strong>{" "}
              <span className="text-[#2c3e86]">{attendance}%</span>
            </p>
          </div>
          <div className="w-1/2">
            <p>
              <strong>Progress:</strong> {progress}%
            </p>
            <ProgressBar percentage={progress} color="#2c3e86" />
          </div>
        </div>

        <div className="">
          <p>
            <strong>Hours Completed: </strong> {hours}
          </p>
          <ProgressBar percentage={hourPercentage} color="#2c3e86" />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button className="bg-[#2c3e86] text-white px-4 py-2 rounded-lg hover:bg-[#212949] transition w-2/3">
          Start Class
        </button>
        <button
          onClick={onAddPlan}
          className="px-4 py-2 rounded-lg hover:bg-[#212949] transition bg-[#2c3e86] text-white w-1/3"
        >
          + Add Plan
        </button>
      </div>
    </div>
  );
};

export default ClassManage;