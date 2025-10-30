import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { FaBuilding, FaBook, FaPlus, FaTrash } from "react-icons/fa";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { SiGoogletasks } from "react-icons/si";
import axios from "axios";

const ManageDepartments = () => {
  const API_BASE = import.meta.env.VITE_API_URL || "";
  const [departments, setDepartments] = useState([]);
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptCode, setNewDeptCode] = useState("");
  const [selectedDept, setSelectedDept] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: "", code: "" });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState(null);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", code: "" });
  // course management states
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [coursesError, setCoursesError] = useState("");
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseForm, setCourseForm] = useState({ name: "", subject: "", teacherId: "", departmentId: "" });
  const [teachersForDept, setTeachersForDept] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [allSubjects, setAllSubjects] = useState([]);

  // try to extract admin id from localStorage (common keys)
  const adminId = (() => {
    try {
      const raw = localStorage.getItem("user") || localStorage.getItem("profile") || null;
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed?._id || parsed?.id || parsed?.userId || null;
      }
    } catch (e) {}
    return localStorage.getItem("adminId") || localStorage.getItem("userId") || null;
  })();

  // ✅ Fetch Departments (only those created by current admin if adminId available)
  const fetchDepartments = async () => {
    try {
      const url = adminId ? `${API_BASE}/api/department?createdBy=${encodeURIComponent(adminId)}` : `${API_BASE}/api/department`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      setDepartments([...res.data.departments]);
    } catch (err) {
      console.error("Error fetching departments:", err.response?.data || err.message);
    }
  };

  // ✅ Fetch Subjects by Department (and update allSubjects for course modal)
  const fetchSubjects = async (deptId) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/department/${deptId}/subjects`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        }
      );
      const subs = res.data.subjects || [];
      setSubjects(subs);
      // ensure course modal subject list is subjects for selected dept
      setAllSubjects(subs);
    } catch (err) {
      console.error("Error fetching subjects:", err.response?.data || err.message);
      setSubjects([]);
      setAllSubjects([]);
    }
  };

  // fetch courses for selected department (admin-specific view)
  const fetchCourses = async (dept) => {
    setLoadingCourses(true);
    setCoursesError("");
    try {
      let url = `${API_BASE}/api/courses`;
      if (dept) {
        // prefer department name filter
        const deptName = dept.name || dept.title || dept.code || dept;
        url = `${API_BASE}/api/courses?department=${encodeURIComponent(deptName)}`;
      }
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      const list = Array.isArray(res.data) ? res.data : res.data.courses || res.data?.data || [];
      const normalized = list.map((c) => ({
        id: c._id || c.id || c.courseId || Date.now() + Math.random(),
        name: c.name || c.title || c.courseName || "Untitled",
        subject: c.subject || c.subjectName || (c.subjectObj && (c.subjectObj.name || c.subjectObj.title)) || "",
        teacherId: c.teacherId || c.teacher?._id || c.teacher?.id || null,
        teacherName: c.teacher?.name || c.teacherName || c.instructor || "",
        department: c.department || c.dept || (dept && (dept.name || dept.title)) || "",
      }));
      setCourses(normalized);
    } catch (err) {
      console.error("Error fetching courses:", err.response?.data || err.message);
      setCourses([]);
      setCoursesError(err.response?.data?.message || err.message || "Failed to load courses");
    } finally {
      setLoadingCourses(false);
    }
  };

  // fetch teachers for selected department (for course add)
  const fetchTeachersForDept = async (dept) => {
    if (!dept) return setTeachersForDept([]);
    setLoadingTeachers(true);
    try {
      const deptName = dept.name || dept.title || dept.code || dept;
      const res = await axios.get(`${API_BASE}/api/teacher?department=${encodeURIComponent(deptName)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      const list = Array.isArray(res.data) ? res.data : res.data.teachers || res.data || [];
      const normalized = list.map((t) => ({
        id: t._id || t.id || t.teacherId || t.user?._id,
        name: t.name || t.fullName || (t.user && (t.user.name || `${t.user.firstName || ""} ${t.user.lastName || ""}`)) || (t.email || "").split("@")[0],
      }));
      setTeachersForDept(normalized);
    } catch (err) {
      console.error("Error fetching teachers for dept:", err.response?.data || err.message);
      setTeachersForDept([]);
    } finally {
      setLoadingTeachers(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // when selecting dept, load its subjects, courses and teachers
  const handleSelectDepartment = (dept) => {
    setSelectedDept(dept);
    if (dept?._id) {
      fetchSubjects(dept._id);
    } else {
      setSubjects([]);
      setAllSubjects([]);
    }
    fetchCourses(dept);
    fetchTeachersForDept(dept);
  };

  // ✅ Add Department (include createdBy admin id when available)
  const addDepartment = async ({ name, code }) => {
    try {
      const payload = { name, code };
      if (adminId) payload.createdBy = adminId;
      const res = await axios.post(
        `${API_BASE}/api/department/add`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      return res.data;
    } catch (err) {
      console.error("Add department error:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || "Failed to add department");
    }
  };

  // ✅ Handle Add Department (keeps createdBy)
  const handleAddDepartment = async () => {
    if (!newDeptName || !newDeptCode) {
      alert("Please fill out both name and code.");
      return;
    }

    try {
      await addDepartment({ name: newDeptName, code: newDeptCode });
      await fetchDepartments();
      setNewDeptName("");
      setNewDeptCode("");
      setShowAddDeptModal(false);
      alert("Department added successfully!");
    } catch (err) {
      alert("Failed to add department: " + err.message);
    }
  };

  // ✅ Delete Department
  const handleDeleteDepartment = async () => {
    try {
      await axios.delete(`${API_BASE}/api/department/${deptToDelete._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });

      setDepartments((prev) => prev.filter((d) => d._id !== deptToDelete._id));
      setShowConfirmDelete(false);
      if (selectedDept?._id === deptToDelete._id) setSelectedDept(null);
      alert("Department deleted successfully!");
    } catch (err) {
      console.error("Delete department error:", err);
      alert("Failed to delete department.");
    }
  };

  // ✅ Add Subject
  const handleAddSubject = async () => {
    if (!newSubject.name || !newSubject.code) {
      alert("Please fill in both subject name and code.");
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE}/api/department/subject/add`,
        {
          name: newSubject.name,
          code: newSubject.code,
          departmentId: selectedDept._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      // refresh subjects for selected dept
      await fetchSubjects(selectedDept._id);
      setNewSubject({ name: "", code: "" });
      setShowAddSubjectModal(false);
      alert("Subject added successfully!");
    } catch (err) {
      console.error("Add subject error:", err);
      alert(err.response?.data?.message || "Failed to add subject.");
    }
  };

  // Add Course (uses API_BASE)
   const addCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.name || !courseForm.subject || !courseForm.teacherId || !courseForm.departmentId) {
      alert("Provide course name, subject, teacher and department");
      return;
    }
    try {
      const department = departments.find((d) => (d._id || d.id) === courseForm.departmentId) || departments.find((d) => d.name === courseForm.departmentId);
      const payload = {
        name: courseForm.name,
        subject: courseForm.subject,
        teacherId: courseForm.teacherId,
        department: department?.name || courseForm.departmentId,
      };
      const res = await axios.post(`${API_BASE}/api/courses`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      const c = res.data.course || res.data || payload;
      const normalized = {
        id: c._id || c.id || Date.now() + Math.random(),
        name: c.name || payload.name,
        subject: c.subject || payload.subject,
        teacherId: c.teacherId || payload.teacherId,
        teacherName: c.teacherName || (teachersForDept.find((t) => t.id === payload.teacherId)?.name) || "",
        department: c.department || payload.department,
      };
      setCourses((prev) => [...prev, normalized]);
      setIsCourseModalOpen(false);
      setCourseForm({ name: "", subject: "", teacherId: "", departmentId: "" });
    } catch (err) {
      console.error("Add course failed:", err.response?.data || err.message);
      alert("Failed to add course. See console.");
    }
  };

  const deleteCourse = async (courseId) => {
    if (!courseId) return;
    if (!confirm("Delete this course?")) return;
    const prev = [...courses];
    setCourses((c) => c.filter((x) => x.id !== courseId));
    try {
      await axios.delete(`${API_BASE}/api/courses/${encodeURIComponent(courseId)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
    } catch (err) {
      console.error("Delete course failed, rolling back:", err.response?.data || err.message);
      setCourses(prev);
      alert("Failed to delete course. See console.");
    }
  };

  // when selectedDept changes, ensure fetchSubjects, fetchCourses, fetchTeachersForDept are called
  useEffect(() => {
    if (selectedDept) {
      fetchSubjects(selectedDept._id);
      fetchCourses(selectedDept);
      fetchTeachersForDept(selectedDept);
    } else {
      setSubjects([]);
      setAllSubjects([]);
      setCourses([]);
      setTeachersForDept([]);
    }
  }, [selectedDept]);

  // initial load
  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Departments</h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Departments" value={departments.length} icon={<FaBuilding />} />
        <StatCard title="Teaching Staff" value="0" icon={<BsFillPersonCheckFill />} />
        <StatCard title="Total Subjects" value={subjects.length} icon={<SiGoogletasks />} />
        <StatCard title="Total Courses" value={courses.length} icon={<SiGoogletasks />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Departments List */}
        <div className="md:col-span-2 bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Departments</h2>
            <button
              onClick={() => setShowAddDeptModal(true)}
              className="p-2 bg-[#3D57bb] cursor-pointer text-white rounded-full"
            >
              <FaPlus />
            </button>
          </div>
          <ul>
            {departments.map((dept) => (
              <li
                key={dept._id}
                className={`p-2 flex justify-between items-center rounded cursor-pointer ${
                  selectedDept?._id === dept._id ? "bg-blue-100" : ""
                }`}
              >
                <span onClick={() => handleSelectDepartment(dept)}>{dept.name}</span>
                <button
                  className="text-red-500 cursor-pointer"
                  onClick={() => {
                    setDeptToDelete(dept);
                    setShowConfirmDelete(true);
                  }}
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Department Detail */}
        <div className="md:col-span-2 bg-white p-4 rounded-lg shadow">
          {selectedDept ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">Subjects - {selectedDept.code}</h2>
                <button onClick={() => setShowAddSubjectModal(true)} className="text-[#3D57bb] cursor-pointer">
                  Add Subject
                </button>
              </div>
              {subjects.length > 0 ? (
                subjects.map((subject) => (
                  <div
                    key={subject._id}
                    className="flex justify-between items-center p-2 border-b"
                  >
                    <span>{subject.name} ({subject.code})</span>
                    <button
                      className="text-red-500 cursor-pointer"
                      onClick={() => {
                        // reuse deleteSubject by calling departmentController endpoint if available
                        if (!confirm("Delete this subject?")) return;
                        axios.delete(`${API_BASE}/api/department/subject/${(subject._id || subject.id)}`, {
                          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                          withCredentials: true,
                        }).then(() => fetchSubjects(selectedDept._id))
                          .catch((err) => { console.error(err); alert("Failed to delete subject."); });
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              ) : (
                <p>No subjects found.</p>
              )}
            </div>
          ) : (
            <p>Select a department to view subjects.</p>
          )}
        </div>
      </div>

      {/* Add Department Modal */}
      {showAddDeptModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Add Department</h2>
            <input
              type="text"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              className="border p-2 w-full mb-4"
              placeholder="Department Name"
            />
            <input
              type="text"
              value={newDeptCode}
              onChange={(e) => setNewDeptCode(e.target.value)}
              className="border p-2 w-full mb-4"
              placeholder="Department Code"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAddDeptModal(false)} className="px-4 py-2 bg-gray-300 cursor-pointer rounded">
                Cancel
              </button>
              <button onClick={handleAddDepartment} className="px-4 py-2 bg-[#3D57bb] cursor-pointer text-white rounded">
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete <strong>{deptToDelete?.name}</strong>?</p>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowConfirmDelete(false)} className="px-4 py-2 cursor-pointer bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={handleDeleteDepartment} className="px-4 py-2 bg-red-500 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Add Subject</h2>
            <input
              type="text"
              value={newSubject.name}
              onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
              className="border p-2 w-full mb-4"
              placeholder="Subject Name"
            />
            <input
              type="text"
              value={newSubject.code}
              onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
              className="border p-2 w-full mb-4"
              placeholder="Subject Code"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAddSubjectModal(false)} className="px-4 py-2 cursor-pointer bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={handleAddSubject} className="px-4 py-2 cursor-pointer bg-[#3D57bb] text-white rounded">
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courses table */}
        <div className="bg-white rounded p-4 shadow col-span-1 md:col-span-1 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium">Courses {selectedDept ? `— ${selectedDept.name}` : ""}</h2>
            <div className="flex gap-2 items-center">
              <button onClick={() => { setIsCourseModalOpen(true); setCourseForm((f) => ({ ...f, departmentId: selectedDept?._id || "" })); }} className="px-3 py-1 bg-[#3D57bb] cursor-pointer text-white rounded disabled:opacity-60">
                Add Course
              </button>
            </div>
          </div>
          {loadingCourses && <div className="text-sm text-gray-500 mb-2">Loading courses...</div>}
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="text-sm text-gray-500 border-b">
                  <th className="py-2">Course</th>
                  <th>Subject</th>
                  <th>Teacher</th>
                  <th>Department</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                    <tr key={c.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium">{c.name}</td>
                      <td>{c.subject}</td>
                      <td>{c.teacherName}</td>
                      <td>{c.department}</td>
                      <td className="text-right">
                        <button onClick={() => deleteCourse(c.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                      </td>
                    </tr>
                  ))}
                {!loadingCourses && (courses.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">No courses for this department.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => { setIsCourseModalOpen(false); setCourseForm({ name: "", subject: "", teacherId: "", departmentId: "" }); }} />
          <form onSubmit={addCourse} className="relative bg-white rounded p-6 z-10 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Add Course</h3>

            <input placeholder="Course name" value={courseForm.name} onChange={(e) => setCourseForm((f) => ({ ...f, name: e.target.value }))} className="w-full border p-2 rounded mb-2" />
            <label className="block mb-2">
              <div className="text-sm text-gray-600">Department</div>
              <select value={courseForm.departmentId} onChange={(e) => setCourseForm((f) => ({ ...f, departmentId: e.target.value }))} className="w-full border p-2 rounded">
                <option value="">Select department</option>
                {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </label>
            <label className="block mb-2">
              <div className="text-sm text-gray-600">Subject</div>
              <select value={courseForm.subject} onChange={(e) => setCourseForm((f) => ({ ...f, subject: e.target.value }))} className="w-full border p-2 rounded">
                <option value="">Select subject</option>
                {allSubjects.map((s) => <option key={s._id || s.id} value={s.name || s.title}>{s.name || s.title}</option>)}
              </select>
            </label>

            <label className="block mb-4">
              <div className="text-sm text-gray-600">Teacher</div>
              <select value={courseForm.teacherId} onChange={(e) => setCourseForm((f) => ({ ...f, teacherId: e.target.value }))} className="w-full border p-2 rounded">
                <option value="">Select teacher</option>
                {loadingTeachers ? <option>Loading...</option> : teachersForDept.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </label>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setIsCourseModalOpen(false); setCourseForm({ name: "", subject: "", teacherId: "", departmentId: "" }); }} className="px-3 py-1 border rounded">Cancel</button>
              <button type="submit" className="px-3 py-1 bg-[#3D57bb] text-white rounded">Add Course</button>
            </div>
          </form>
        </div>
      )}
      
    </div>
  );
};

export default ManageDepartments;