import React from "react";

const RecentPlans = ({ plans }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4 border border-gray-200 mt-6">
      <h2 className="font-semibold text-lg">Recent Teaching Plans</h2>

      {plans.length === 0 ? (
        <p className="text-gray-400 text-sm">No plans added yet.</p>
      ) : (
        plans.map((plan) => (
          <div key={plan.id} className="border border-gray-300 rounded-lg p-4 space-y-2 hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{plan.title}</h3>
              <span className="text-xs px-2 py-1 rounded bg-[#2c3e86] text-white">
                Upcoming
              </span>
            </div>
            <p className="text-sm text-gray-600">{plan.description}</p>
            <p className="text-xs text-gray-500">
              Duration: {plan.duration} | Scheduled: {plan.date}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default RecentPlans;