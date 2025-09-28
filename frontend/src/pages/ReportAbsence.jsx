import React, { useState } from "react";

export default function ReportAbsencePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [absences, setAbsences] = useState([
    {
      id: 1,
      title: "Medical Emergency",
      reason: "Medical Emergency",
      date: "2024-01-10",
      submitted: "2024-01-09",
      affected: ["Machine Learning", "Data Structures"],
      status: "Approved",
      halfDay: false,
      description: "Family medical emergency requiring immediate attention",
    },
    {
      id: 2,
      title: "Conference Attendance",
      reason: "Conference",
      date: "2024-01-05",
      submitted: "2024-01-01",
      affected: ["Algorithms"],
      status: "Approved",
      halfDay: false,
      description: "Attending IEEE Computer Science Conference",
    },
  ]);

  const [form, setForm] = useState({
    date: "",
    reason: "",
    affected: [],
    halfDay: "full",
    description: "",
  });

  const classesList = [
    "Machine Learning",
    "Data Structures",
    "Algorithms",
    "Operating Systems",
    "Database Systems",
  ];

  function toggleAffected(cls) {
    setForm((f) => {
      const has = f.affected.includes(cls);
      return {
        ...f,
        affected: has ? f.affected.filter((c) => c !== cls) : [...f.affected, cls],
      };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // minimal validation
    if (!form.date || !form.reason || form.affected.length === 0) {
      alert("Please fill date, reason and choose at least one affected class.");
      return;
    }
    const next = {
      id: Date.now(),
      title: form.reason,
      reason: form.reason,
      date: form.date,
      submitted: new Date().toLocaleDateString("en-CA"),
      affected: form.affected,
      status: "Pending",
      halfDay: form.halfDay === "half",
      description: form.description,
    };
    setAbsences((a) => [next, ...a]);
    setIsOpen(false);
    setForm({ date: "", reason: "", affected: [], halfDay: "full", description: "" });
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#2C3E86]">Report Absence</h1>
            <p className="mt-1 text-gray-500">Manage your leave requests and substitute arrangements</p>
          </div>
          <div>
            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 bg-[#2C3E86] cursor-pointer text-white px-4 py-2 rounded-2xl shadow hover:opacity-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Report New Absence
            </button>
          </div>
        </div>

        {/* stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="text-sm text-gray-500">Total Absences</div>
            <div className="text-3xl font-semibold mt-2">{absences.length}</div>
            <div className="text-xs text-gray-400 mt-1">This academic year</div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="text-sm text-gray-500">Pending Requests</div>
            <div className="text-3xl font-semibold mt-2">{absences.filter((a) => a.status === "Pending").length}</div>
            <div className="text-xs text-gray-400 mt-1">Awaiting approval</div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="text-sm text-gray-500">Approved</div>
            <div className="text-3xl font-semibold mt-2">{absences.filter((a) => a.status === "Approved").length}</div>
            <div className="text-xs text-gray-400 mt-1">This year</div>
          </div>
        </div>

        {/* Absence history */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-4">Absence History</h2>

          <div className="space-y-4">
            {absences.map((ab) => (
              <div key={ab.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{ab.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{ab.description}</p>

                    <div className="mt-3 text-sm text-gray-600">
                      <div>
                        <strong>Date:</strong> {new Date(ab.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                      </div>
                      <div>
                        <strong>Submitted:</strong> {ab.submitted}
                      </div>
                      <div className="mt-2">
                        <strong>Affected Classes:</strong>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {ab.affected.map((c) => (
                            <span key={c} className="text-xs px-3 py-1 bg-gray-100 rounded-full">{c}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${ab.status === "Approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {ab.status}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">Substitute Arranged</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setIsOpen(false)} />

          <form onSubmit={handleSubmit} className="relative bg-white max-w-2xl w-full rounded-2xl p-6 z-10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Report New Absence</h3>
              {/* <button type="button" onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">Close</button> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="text-sm text-gray-600 mb-1">Date of Absence</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="border p-2 rounded"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-600 mb-1">Reason</span>
                <select value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="border p-2 rounded">
                  <option value="">Select reason</option>
                  <option>Medical Emergency</option>
                  <option>Conference</option>
                  <option>Personal</option>
                  <option>Official Duty</option>
                </select>
              </label>

              <div className="md:col-span-2">
                <span className="text-sm text-gray-600 mb-2 inline-block">Affected Classes</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {classesList.map((cls) => {
                    const selected = form.affected.includes(cls);
                    return (
                      <button
                        type="button"
                        key={cls}
                        onClick={() => toggleAffected(cls)}
                        className={`px-3 py-1 rounded-full border ${selected ? "bg-gray-900 text-white" : "bg-white text-gray-700"}`}
                      >
                        {cls}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-sm text-gray-600 mb-1 block">Half day or Full day</span>
                <div className="flex gap-4 mt-2">
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="half" value="full" checked={form.halfDay === "full"} onChange={(e) => setForm({ ...form, halfDay: e.target.value })} />
                    <span className="text-sm">Full Day</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="half" value="half" checked={form.halfDay === "half"} onChange={(e) => setForm({ ...form, halfDay: e.target.value })} />
                    <span className="text-sm">Half Day</span>
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="flex flex-col">
                  <span className="text-sm text-gray-600 mb-1">Description</span>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border p-2 rounded h-28" />
                </label>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 cursor-pointer rounded-lg border">Cancel</button>
              <button type="submit" className="px-4 cursor-pointer py-2 rounded-lg bg-[#2C3E86] text-white">Submit</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
