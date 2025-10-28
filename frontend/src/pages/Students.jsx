import React, { useMemo, useState } from "react";

export default function Students() {
  const initialData = [
    {
      id: 1,
      name: "Aarav Sharma",
      roll: "002CD23121",
      email: "aarav.sharma@example.com",
      dept: "Computer Science",
      stream: "B.Tech",
      year: "3rd",
      semester: "6",
      attendance: 85,
    },
    {
      id: 2,
      name: "Priya Verma",
      roll: "002EC23122",
      email: "priya.verma@example.com",
      dept: "Electronics",
      stream: "MCA",
      year: "2nd",
      semester: "4",
      attendance: 92,
    },
    {
      id: 3,
      name: "Rahul Mehta",
      roll: "002ML23123",
      email: "rahul.mehta@example.com",
      dept: "Mechanical",
      stream: "BBA",
      year: "1st",
      semester: "2",
      attendance: 75,
    },
    {
      id: 4,
      name: "Neha Gupta",
      roll: "002CS23124",
      email: "neha.gupta@example.com",
      dept: "Civil",
      stream: "B.Tech",
      year: "4th",
      semester: "8",
      attendance: 88,
    },
    {
      id: 1,
      name: "Aarav Sharma",
      roll: "002CD23121",
      email: "aarav.sharma@example.com",
      dept: "Computer Science",
      stream: "B.Tech",
      year: "3rd",
      semester: "6",
      attendance: 85,
    },
    {
      id: 2,
      name: "Priya Verma",
      roll: "002EC23122",
      email: "priya.verma@example.com",
      dept: "Electronics",
      stream: "MCA",
      year: "2nd",
      semester: "4",
      attendance: 92,
    },
    {
      id: 3,
      name: "Rahul Mehta",
      roll: "002ML23123",
      email: "rahul.mehta@example.com",
      dept: "Mechanical",
      stream: "BBA",
      year: "1st",
      semester: "2",
      attendance: 75,
    },
    {
      id: 4,
      name: "Neha Gupta",
      roll: "002CS23124",
      email: "neha.gupta@example.com",
      dept: "Civil",
      stream: "B.Tech",
      year: "4th",
      semester: "8",
      attendance: 88,
    },
  ];

  const [students, setStudents] = useState(initialData);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ dept: "All", stream: "All", year: "All", semester: "All" });
  const [viewDetails, setViewDetails] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [filterPanel, setFilterPanel] = useState(false);

  const filtered = useMemo(() => {
    return students
      .filter(s => {
        const q = query.toLowerCase();
        if (q) return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
        return true;
      })
      .filter(s => filters.dept === "All" ? true : s.dept === filters.dept)
      .filter(s => filters.stream === "All" ? true : s.stream === filters.stream)
      .filter(s => filters.year === "All" ? true : s.year === filters.year)
      .filter(s => filters.semester === "All" ? true : s.semester === filters.semester);
  }, [students, query, filters]);

  const uniqueValues = key => ["All", ...Array.from(new Set(students.map(s => s[key])))];

  function initials(name) {
    return name.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();
  }

  function handleAddStudent(e) {
    e.preventDefault();
    const form = e.target;
    const newStudent = {
      id: Math.max(0, ...students.map(s => s.id)) + 1, // safe unique ID
      name: form.name.value,
      email: form.email.value,
      dept: form.dept.value,
      stream: form.stream.value,
      year: form.year.value,
      semester: form.semester.value,
      attendance: Number(form.attendance.value),
    };
    setStudents([newStudent, ...students]);
    form.reset(); // clear the form
    setAddModal(false); // close modal
  }

  function exportCSV() {
    const headers = ["Name", "Email", "Department", "Stream", "Year", "Semester", "Attendance"];
    const rows = students.map((t) => [t.name, t.email, t.dept, t.stream, t.year, t.semester, t.attendance]);
    const csv = [headers.join(","), ...rows.map((r) => r.map(String).map((c) => `"${c.replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
            <h1 className="text-4xl font-bold text-[#2C3E86]">Manage Students</h1>
            <p className="mt-1 text-gray-500">View and manage all students in your institution.</p>
          </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="inline-flex items-center gap-2 border px-3 py-2 rounded-xl bg-white shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 3v12" />
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M8 7h8" />
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M21 21H3" />
              </svg>
              Export
          </button>
          <button onClick={() => setAddModal(true)} className="px-3 py-2 bg-[#2C3E86] text-white rounded-lg">Add Student</button>
        </div>
      </div>

      {/* stats row for students */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
  <div className="p-6 bg-white rounded-xl shadow-sm">
    <div className="text-sm text-gray-500">Total Students</div>
    <div className="text-3xl font-semibold mt-2">{students.length}</div>
    <div className="text-xs text-gray-400 mt-1">{students.filter(s => s.attendance >= 75).length} with ≥75% attendance</div>
  </div>

  <div className="p-6 bg-white rounded-xl shadow-sm">
    <div className="text-sm text-gray-500">Average Attendance</div>
    <div className="text-3xl font-semibold mt-2">
      {students.length ? (students.reduce((sum, s) => sum + s.attendance, 0) / students.length).toFixed(1) : "-"}%
    </div>
    <div className="text-xs text-gray-400 mt-1">This semester</div>
  </div>

  <div className="p-6 bg-white rounded-xl shadow-sm">
    <div className="text-sm text-gray-500">Departments</div>
    <div className="text-3xl font-semibold mt-2">{new Set(students.map(s => s.dept)).size}</div>
    <div className="text-xs text-gray-400 mt-1">Unique departments</div>
  </div>

  <div className="p-6 bg-white rounded-xl shadow-sm">
    <div className="text-sm text-gray-500">Streams</div>
    <div className="text-3xl font-semibold mt-2">{new Set(students.map(s => s.stream)).size}</div>
    <div className="text-xs text-gray-400 mt-1">Unique streams</div>
  </div>
</div>

      {/* Search */}
      <div className="flex gap-2">
        <input
          className="w-full border rounded-xl p-2 mb-3"
          placeholder="Search students..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button onClick={() => setFilterPanel(true)} className="px-5 h-12 bg-gray-200 rounded-lg">Filter</button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full hidden sm:table">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Student</th>
              <th className="p-2 text-left">Enrollment No.</th>
              <th className="p-2 text-left">Department</th>
              <th className="p-2 text-left">Stream</th>
              <th>Year</th>
              <th>Sem</th>
              <th>Attendance %</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-b">
                <td className="p-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">{initials(s.name)}</div>
                  <span>{s.name}</span>
                </td>
                <td className="pl-5">{s.roll}</td>
                <td>{s.dept}</td>
                <td>{s.stream}</td>
                <td className="text-center">{s.year}</td>
                <td className="text-center">{s.semester}</td>
                <td className="text-center">{`${s.attendance}%`}</td>
                <td>
                  <button onClick={() => setViewDetails(s)} className="px-2 py-1 border rounded">View</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="p-4 text-center text-gray-400">No students found</td></tr>
            )}
          </tbody>
        </table>

        {/* Mobile View */}
        <div className="sm:hidden flex flex-col gap-2">
          {filtered.map(s => (
            <div key={s.id} className="p-3 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center" onClick={() => setViewDetails(s)}>
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-gray-500">{s.email}</p>
              </div>
              <div className="text-gray-400">&gt;</div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Student Modal */}
      {addModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4 overflow-auto">
          <div className="bg-white rounded-xl p-4 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#2C3E86] mb-3">Add Student</h2>
            <form className="flex flex-col gap-2" onSubmit={handleAddStudent}>
              {/* <input name="name" placeholder="Name" className="border p-2 rounded" required /> */}
              <input name="email" type="email" placeholder="Email" className="border p-2 rounded" required />
              {/* <input name="dept" placeholder="Department" className="border p-2 rounded" required /> */}
              {/* <input name="stream" placeholder="Stream" className="border p-2 rounded" required /> */}
              {/* <input name="year" placeholder="Year" className="border p-2 rounded" required /> */}
              {/* <input name="semester" placeholder="Semester" className="border p-2 rounded" required /> */}
              {/* <input name="attendance" type="number" placeholder="Attendance %" className="border p-2 rounded" required min={0} max={100} /> */}
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setAddModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#2C3E86] text-white rounded">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Panel */}
      {filterPanel && (
        <div className="fixed inset-0 bg-black/40 p-4 flex justify-end">
          <div className="bg-white rounded-xl p-4 w-full max-w-xs">
            <h2 className="text-lg font-bold mb-3">Filters</h2>
            {["dept","stream","year","semester"].map(f => (
              <div key={f} className="mb-2">
                <label className="font-semibold">{f.charAt(0).toUpperCase() + f.slice(1)}</label>
                <select
                  className="w-full border rounded p-2 mt-1"
                  value={filters[f]}
                  onChange={(e) => setFilters({...filters,[f]:e.target.value})}
                >
                  {uniqueValues(f).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            ))}
            <button onClick={() => setFilterPanel(false)} className="mt-2 w-full bg-[#2C3E86] text-white p-2 rounded">Close</button>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#2C3E86] mb-3">Student Details</h2>
            <p><strong>Name:</strong> {viewDetails.name}</p>
            <p><strong>Email:</strong> {viewDetails.email}</p>
            <p><strong>Department:</strong> {viewDetails.dept}</p>
            <p><strong>Stream:</strong> {viewDetails.stream}</p>
            <p><strong>Year:</strong> {viewDetails.year}</p>
            <p><strong>Semester:</strong> {viewDetails.semester}</p>
            <p><strong>Attendance:</strong> {viewDetails.attendance}%</p>
            <div className="flex justify-end mt-3">
              <button onClick={() => setViewDetails(null)} className="px-4 py-2 border rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
