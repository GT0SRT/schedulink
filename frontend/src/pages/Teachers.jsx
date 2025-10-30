import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

export default function ManageTeachersPage() {
  const PRIMARY = "#2C3E86";
  const DEPARTMENTS = ["Computer Science", "Electronics", "Civil"];
  const [teachers, setTeachers] = useState([]);

  const fetchMyTeachers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/my-teachers`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      // Normalize each teacher to always have `dept`
      const list = (res.data.teachers || []).map((t) => ({
        ...t,
        dept: t.dept || t.department || "Unknown",
        // ensure numeric fields exist
        rating: typeof t.rating === "number" ? t.rating : Number(t.rating) || 0,
        experience: typeof t.experience === "number" ? t.experience : Number(t.experience) || 0,
        classesCount: typeof t.classesCount === "number" ? t.classesCount : Number(t.classesCount) || 0,
        studentsCount: typeof t.studentsCount === "number" ? t.studentsCount : Number(t.studentsCount) || 0,
      }));

      setTeachers(list);
      console.log("Teachers fetched successfully");
      return list;
    } catch (err) {
      console.error("Error fetching teachers for admin:", err.response?.data || err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchMyTeachers();
  }, []);

  const [query, setQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const statuses = ["All Status", "active", "inactive"];

  // dynamic department options (includes default list + any departments from fetched data)
  const deptOptions = useMemo(() => {
    const fromData = Array.from(new Set(teachers.map((t) => t.dept).filter(Boolean)));
    const merged = Array.from(new Set(["All Departments", ...DEPARTMENTS, ...fromData]));
    return merged;
  }, [teachers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return teachers
      .filter((t) => {
        if (q) {
          return (
            (t.name || "").toLowerCase().includes(q) ||
            (t.email || "").toLowerCase().includes(q) ||
            (t.dept || "").toLowerCase().includes(q) ||
            (t.subdept || "").toLowerCase().includes(q)
          );
        }
        return true;
      })
      .filter((t) => (deptFilter === "All Departments" ? true : (t.dept || "") === deptFilter))
      .filter((t) => (statusFilter === "All Status" ? true : (t.status || "") === statusFilter));
  }, [teachers, query, deptFilter, statusFilter]);

  // Add teacher form state
  const [form, setForm] = useState({
    email: "",
    dept: "",
  });

  function resetForm() {
    setForm({ email: "", dept: "" });
  }

  const handleInviteTeacher = async ({ email, department }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/teacher/invite`,
        { email, department },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data;
    } catch (err) {
      console.error("Invite teacher error:", err.response?.data || err.message);
      throw err.response?.data || err;
    }
  };

  function handleDelete(id) {
    setTeachers((t) => t.filter((x) => x.id !== id));
    setConfirmDelete(null);
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

  // Add this submit handler
  const submitInvite = async (e) => {
    e.preventDefault();
    if (!form.email?.trim() || !form.dept?.trim()) {
      alert("Please provide email and department.");
      return;
    }

    try {
      const payload = { email: form.email.trim(), department: form.dept.trim() };
      const data = await handleInviteTeacher(payload);

      // Optionally add returned teacher to local list (if API returns created teacher)
      if (data && data.email) {
        setTeachers((prev) => [
          ...prev,
          {
            id: Date.now(), // temporary id; replace with server id if provided
            name: data.name || payload.email.split("@")[0],
            email: data.email,
            dept: data.department || payload.department,
            subdept: data.subdept || "",
            experience: data.experience || 0,
            rating: data.rating || 0,
            classesCount: data.classesCount || 0,
            studentsCount: data.studentsCount || 0,
            status: data.status || "active",
          },
        ]);
      }

      setIsAddOpen(false);
      resetForm();
      alert("Invite sent successfully.");
    } catch (err) {
      console.error("Invite failed:", err);
      alert("Failed to send invite. See console for details.");
    }
  };

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
            <button onClick={() => setIsAddOpen(true)} className="inline-flex cursor-pointer items-center gap-2 bg-[#2C3E86] text-white px-4 py-2 rounded-2xl shadow hover:opacity-95">
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
              {teachers.length ? (teachers.reduce((s, x) => s + (x.rating || 0), 0) / teachers.length).toFixed(1) : "-"}
            </div>
            <div className="text-xs text-gray-400 mt-1">Out of 5.0</div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="text-sm text-gray-500">Total Classes</div>
            <div className="text-3xl font-semibold mt-2">{teachers.reduce((s, x) => s + (x.classesCount || 0), 0)}</div>
            <div className="text-xs text-gray-400 mt-1">This semester</div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="text-sm text-gray-500">Total Students</div>
            <div className="text-3xl font-semibold mt-2">{teachers.reduce((s, x) => s + (x.studentsCount || 0), 0)}</div>
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
                {deptOptions.map((d) => (
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
                <th className="p-1">Experience</th>
                <th className="p-1">Rating</th>
                <th className="p-1">Classes</th>
                <th className="p-1">Students</th>
                <th className="p-1">Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                console.log(t) ||
                <tr key={t.id} className="border-b last:border-0">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
                        {t.userId.firstName.charAt(0).toUpperCase()+t.userId.lastName.charAt(0).toUpperCase()}</div>
                      <div>
                        <div className="font-semibold text-gray-800">{t.userId.firstName+" "+t.userId.lastName}</div>
                        <div className="text-sm text-gray-400">{t.userId.email}</div>
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
                      <span className="font-medium">{(t.rating ?? 0).toFixed(1)}</span>
                    </div>
                  </td>

                  <td className="text-center">{t.classesCount}</td>
                  <td className="text-center">{t.studentsCount}</td>

                  <td>
                    <span className={`px-3 py-1 rounded-full text-sm ${t.status === "active" ? "bg-[#e6f0ff] text-[#2C3E86]" : "bg-gray-100 text-gray-600"}`}>
                      {t.status}
                    </span>
                  </td>

                  <td>
                    <div className="flex items-center gap-3">
                      <button onClick={() => { setViewing(t); setIsViewOpen(true); }} className="p-2 rounded-full hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      <button onClick={() => setConfirmDelete(t)} className="p-2 rounded-full hover:bg-gray-100 text-red-500 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22" />
                        </svg>
                      </button>
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

          <form onSubmit={submitInvite} className="relative bg-white max-w-xl w-full rounded-2xl p-6 z-10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Add Teacher</h3>
              <button type="button" onClick={() => setIsAddOpen(false)} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Email</span>
                <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="border p-2 rounded" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Department</span>
                <select value={form.dept} onChange={(e) => setForm((f) => ({ ...f, dept: e.target.value }))} className="border p-2 rounded">
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
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
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700 text-lg">
                  {viewing.userId.firstName.charAt(0).toUpperCase()+viewing.userId.lastName.charAt(0).toUpperCase()}</div>
                <div>
                <h3 className="text-xl font-semibold mt-3">{viewing.userId.firstName + " " + viewing.userId.lastName}</h3>
                <div className="text-sm text-gray-500">{viewing.userId.email}</div>
                </div>
              </div>
              <button onClick={() => setIsViewOpen(false)} className="text-gray-500 cursor-pointer">Close</button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-700">
              <div>
                <div className="text-xs text-gray-400">Department</div>
                <div className="font-medium">{viewing.dept}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Experience</div>
                <div className="font-medium">{viewing.experience} years</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Rating</div>
                <div className="font-medium">{(viewing.rating ?? 0).toFixed(1)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Classes</div>
                <div className="font-medium">{viewing.classesCount}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Students</div>
                <div className="font-medium">{viewing.studentsCount}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Status</div>
                <div className="font-medium">{viewing.status}</div>
              </div>
            </div>
          </div>
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
