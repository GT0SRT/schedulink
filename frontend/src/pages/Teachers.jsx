import React, { useEffect, useMemo, useState } from "react";

// ManageTeachersPage.jsx
// Single-file React component using Tailwind CSS.
// Theme primary color: #2C3E86 (used across buttons and accents)
// Features:
// - List of teachers with avatars, departments, experience, rating, classes, students, status
// - Search, department filter, status filter
// - Add Teacher modal
// - Edit, View and Delete actions
// - Toggle Active/Inactive
// - Export CSV
// - LocalStorage persistence (so changes survive reload during development)

export default function ManageTeachersPage() {
  const PRIMARY = "#2C3E86";

  const initial = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@university.edu",
      dept: "Computer Science",
      subdept: "Machine Learning",
      experience: 8,
      rating: 4.8,
      classesCount: 45,
      studentsCount: 320,
      status: "active",
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      email: "michael.chen@university.edu",
      dept: "Electronics",
      subdept: "Digital Signal Processing",
      experience: 12,
      rating: 4.6,
      classesCount: 38,
      studentsCount: 280,
      status: "active",
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      email: "emily.rodriguez@university.edu",
      dept: "Mechanical",
      subdept: "Thermodynamics",
      experience: 6,
      rating: 4.4,
      classesCount: 32,
      studentsCount: 240,
      status: "active",
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      email: "james.wilson@university.edu",
      dept: "Civil",
      subdept: "Structural Engineering",
      experience: 10,
      rating: 4.7,
      classesCount: 28,
      studentsCount: 180,
      status: "inactive",
    },
  ];

  const [teachers, setTeachers] = useState(() => {
    try {
      const raw = localStorage.getItem("teachers-data");
      return raw ? JSON.parse(raw) : initial;
    } catch (e) {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem("teachers-data", JSON.stringify(teachers));
  }, [teachers]);

  const [query, setQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const departments = useMemo(() => {
    const ds = new Set(teachers.map((t) => t.dept));
    return ["All Departments", ...Array.from(ds)];
  }, [teachers]);

  const statuses = ["All Status", "active", "inactive"];

  const filtered = useMemo(() => {
    return teachers
      .filter((t) => {
        const q = query.trim().toLowerCase();
        if (q) {
          return (
            t.name.toLowerCase().includes(q) ||
            t.email.toLowerCase().includes(q) ||
            t.dept.toLowerCase().includes(q) ||
            t.subdept.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .filter((t) => (deptFilter === "All Departments" ? true : t.dept === deptFilter))
      .filter((t) => (statusFilter === "All Status" ? true : t.status === statusFilter));
  }, [teachers, query, deptFilter, statusFilter]);

  // Add teacher form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    dept: "",
    subdept: "",
    experience: "",
    rating: "4.5",
    classesCount: "0",
    studentsCount: "0",
    status: "active",
  });

  function resetForm() {
    setForm({ name: "", email: "", dept: "", subdept: "", experience: "", rating: "4.5", classesCount: "0", studentsCount: "0", status: "active" });
  }

  function handleAdd(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.dept) {
      alert("Please fill name, email and department.");
      return;
    }
    const next = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      dept: form.dept,
      subdept: form.subdept,
      experience: Number(form.experience || 0),
      rating: Number(form.rating || 0),
      classesCount: Number(form.classesCount || 0),
      studentsCount: Number(form.studentsCount || 0),
      status: form.status,
    };
    setTeachers((t) => [next, ...t]);
    resetForm();
    setIsAddOpen(false);
  }

  function handleDelete(id) {
    setTeachers((t) => t.filter((x) => x.id !== id));
    setConfirmDelete(null);
  }

  function handleToggleStatus(id) {
    setTeachers((t) => t.map((x) => (x.id === id ? { ...x, status: x.status === "active" ? "inactive" : "active" } : x)));
  }

  function openEdit(tchr) {
    setEditing(tchr);
    setForm({
      name: tchr.name,
      email: tchr.email,
      dept: tchr.dept,
      subdept: tchr.subdept,
      experience: String(tchr.experience),
      rating: String(tchr.rating),
      classesCount: String(tchr.classesCount),
      studentsCount: String(tchr.studentsCount),
      status: tchr.status,
    });
    setIsEditOpen(true);
  }

  function handleEdit(e) {
    e.preventDefault();
    if (!editing) return;
    setTeachers((t) => t.map((x) => (x.id === editing.id ? { ...x, ...{
      name: form.name,
      email: form.email,
      dept: form.dept,
      subdept: form.subdept,
      experience: Number(form.experience || 0),
      rating: Number(form.rating || 0),
      classesCount: Number(form.classesCount || 0),
      studentsCount: Number(form.studentsCount || 0),
      status: form.status,
    } } : x)));
    setIsEditOpen(false);
    setEditing(null);
    resetForm();
  }

  function exportCSV() {
    const headers = ["Name", "Email", "Department", "Subdept", "Experience", "Rating", "Classes", "Students", "Status"];
    const rows = teachers.map((t) => [t.name, t.email, t.dept, t.subdept, t.experience, t.rating, t.classesCount, t.studentsCount, t.status]);
    const csv = [headers.join(","), ...rows.map((r) => r.map(String).map((c) => `"${c.replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "teachers_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function initials(name) {
    return name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#2C3E86]">Manage Teachers</h1>
            <p className="mt-1 text-gray-500">View and manage all teaching staff in your institution.</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={exportCSV} className="inline-flex items-center gap-2 border px-3 py-2 rounded-xl bg-white shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 3v12" />
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M8 7h8" />
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M21 21H3" />
              </svg>
              Export
            </button>
            <button onClick={() => setIsAddOpen(true)} className="inline-flex items-center gap-2 bg-[#2C3E86] text-white px-4 py-2 rounded-2xl shadow hover:opacity-95">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Teacher
            </button>
          </div>
        </div>

        {/* stats row (mirrors screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="text-sm text-gray-500">Total Teachers</div>
            <div className="text-3xl font-semibold mt-2">{teachers.length}</div>
            <div className="text-xs text-gray-400 mt-1">{teachers.filter((t) => t.status === "active").length} active</div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="text-sm text-gray-500">Average Rating</div>
            <div className="text-3xl font-semibold mt-2">
              {teachers.length ? (teachers.reduce((s, x) => s + x.rating, 0) / teachers.length).toFixed(1) : "-"}
            </div>
            <div className="text-xs text-gray-400 mt-1">Out of 5.0</div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="text-sm text-gray-500">Total Classes</div>
            <div className="text-3xl font-semibold mt-2">{teachers.reduce((s, x) => s + x.classesCount, 0)}</div>
            <div className="text-xs text-gray-400 mt-1">This semester</div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="text-sm text-gray-500">Total Students</div>
            <div className="text-3xl font-semibold mt-2">{teachers.reduce((s, x) => s + x.studentsCount, 0)}</div>
            <div className="text-xs text-gray-400 mt-1">Across all teachers</div>
          </div>
        </div>

        {/* List container */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search teachers..." className="w-full border rounded-xl p-3 pl-10" />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
              </svg>
            </div>

            <div>
              <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="border rounded-xl px-4 py-2">
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded-xl px-4 py-2">
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <table className="w-full table-auto text-left">
            <thead>
              <tr className="text-sm text-gray-500 border-b">
                <th className="py-3">Teacher</th>
                <th>Department</th>
                <th>Experience</th>
                <th>Rating</th>
                <th>Classes</th>
                <th>Students</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b last:border-0">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">{initials(t.name)}</div>
                      <div>
                        <div className="font-semibold text-gray-800">{t.name}</div>
                        <div className="text-sm text-gray-400">{t.email}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="font-medium">{t.dept}</div>
                    <div className="text-sm text-gray-400">{t.subdept}</div>
                  </td>

                  <td>{t.experience} years</td>

                  <td>
                    <div className="inline-flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927C9.349 2.055 10.651 2.055 10.951 2.927l.948 2.794a1 1 0 00.95.69h2.94c.969 0 1.371 1.24.588 1.81l-2.378 1.73a1 1 0 00-.364 1.118l.907 2.94c.3.972-.755 1.77-1.54 1.18L10 14.347l-2.592 1.84c-.785.59-1.84-.208-1.54-1.18l.907-2.94a1 1 0 00-.364-1.118L4.04 8.22c-.783-.57-.381-1.81.588-1.81h2.94a1 1 0 00.95-.69l.948-2.794z" />
                      </svg>
                      <span className="font-medium">{t.rating.toFixed(1)}</span>
                    </div>
                  </td>

                  <td>{t.classesCount}</td>
                  <td>{t.studentsCount}</td>

                  <td>
                    <span className={`px-3 py-1 rounded-full text-sm ${t.status === "active" ? "bg-[#e6f0ff] text-[#2C3E86]" : "bg-gray-100 text-gray-600"}`}>
                      {t.status}
                    </span>
                  </td>

                  <td>
                    <div className="flex items-center gap-3">
                      <button onClick={() => { setViewing(t); setIsViewOpen(true); }} className="p-2 rounded-full hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      <button onClick={() => openEdit(t)} className="p-2 rounded-full hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M11 5h6M4 7v12a2 2 0 002 2h12" />
                          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>

                      <button onClick={() => setConfirmDelete(t)} className="p-2 rounded-full hover:bg-gray-100 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22" />
                        </svg>
                      </button>

                      <button onClick={() => handleToggleStatus(t.id)} className="px-2 py-1 rounded-lg border text-sm">Toggle</button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">No teachers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setIsAddOpen(false)} />

          <form onSubmit={handleAdd} className="relative bg-white max-w-2xl w-full rounded-2xl p-6 z-10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Add Teacher</h3>
              <button type="button" onClick={() => setIsAddOpen(false)} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Full Name</span>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="border p-2 rounded" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Email</span>
                <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="border p-2 rounded" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Department</span>
                <input value={form.dept} onChange={(e) => setForm((f) => ({ ...f, dept: e.target.value }))} className="border p-2 rounded" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Sub-department</span>
                <input value={form.subdept} onChange={(e) => setForm((f) => ({ ...f, subdept: e.target.value }))} className="border p-2 rounded" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Experience (years)</span>
                <input type="number" value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))} className="border p-2 rounded" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Rating</span>
                <input type="number" step="0.1" value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))} className="border p-2 rounded" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Classes Count</span>
                <input type="number" value={form.classesCount} onChange={(e) => setForm((f) => ({ ...f, classesCount: e.target.value }))} className="border p-2 rounded" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Students Count</span>
                <input type="number" value={form.studentsCount} onChange={(e) => setForm((f) => ({ ...f, studentsCount: e.target.value }))} className="border p-2 rounded" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Status</span>
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="border p-2 rounded">
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
              <button type="submit" className="px-4 cursor-pointer py-2 rounded-lg" style={{ background: PRIMARY, color: "white" }}>Add</button>
            </div>
          </form>
        </div>
      )}

      {/* View Modal */}
      {isViewOpen && viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setIsViewOpen(false)} />
          <div className="relative bg-white max-w-md w-full rounded-2xl p-6 z-10 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700 text-lg">{initials(viewing.name)}</div>
                <h3 className="text-xl font-semibold mt-3">{viewing.name}</h3>
                <div className="text-sm text-gray-500">{viewing.email}</div>
              </div>
              <button onClick={() => setIsViewOpen(false)} className="text-gray-500">Close</button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-700">
              <div>
                <div className="text-xs text-gray-400">Department</div>
                <div className="font-medium">{viewing.dept}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Subdept</div>
                <div className="font-medium">{viewing.subdept}</div>
              </div>

              <div>
                <div className="text-xs text-gray-400">Experience</div>
                <div className="font-medium">{viewing.experience} years</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Rating</div>
                <div className="font-medium">{viewing.rating.toFixed(1)}</div>
              </div>

              <div>
                <div className="text-xs text-gray-400">Classes</div>
                <div className="font-medium">{viewing.classesCount}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Students</div>
                <div className="font-medium">{viewing.studentsCount}</div>
              </div>

              <div className="col-span-2">
                <div className="text-xs text-gray-400">Status</div>
                <div className="font-medium">{viewing.status}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setIsEditOpen(false)} />

          <form onSubmit={handleEdit} className="relative bg-white max-w-2xl w-full rounded-2xl p-6 z-10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Edit Teacher</h3>
              <button type="button" onClick={() => setIsEditOpen(false)} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Full Name</span>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="border p-2 rounded" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Email</span>
                <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="border p-2 rounded" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Department</span>
                <input value={form.dept} onChange={(e) => setForm((f) => ({ ...f, dept: e.target.value }))} className="border p-2 rounded" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Sub-department</span>
                <input value={form.subdept} onChange={(e) => setForm((f) => ({ ...f, subdept: e.target.value }))} className="border p-2 rounded" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Experience (years)</span>
                <input type="number" value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))} className="border p-2 rounded" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Rating</span>
                <input type="number" step="0.1" value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))} className="border p-2 rounded" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Classes Count</span>
                <input type="number" value={form.classesCount} onChange={(e) => setForm((f) => ({ ...f, classesCount: e.target.value }))} className="border p-2 rounded" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Students Count</span>
                <input type="number" value={form.studentsCount} onChange={(e) => setForm((f) => ({ ...f, studentsCount: e.target.value }))} className="border p-2 rounded" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Status</span>
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="border p-2 rounded">
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button type="button" onClick={() => { setIsEditOpen(false); setEditing(null); resetForm(); }} className="px-4 py-2 rounded-lg border">Cancel</button>
              <button type="submit" className="px-4 cursor-pointer py-2 rounded-lg" style={{ background: PRIMARY, color: "white" }}>Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white max-w-md w-full rounded-2xl p-6 z-10 shadow-lg">
            <h3 className="text-lg font-semibold">Delete Teacher</h3>
            <p className="mt-2 text-sm text-gray-600">Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This action cannot be undone.</p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-lg border">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete.id)} className="px-4 py-2 rounded-lg bg-red-500 text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
