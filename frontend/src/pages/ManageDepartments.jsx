import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { FaBuilding, FaBook, FaPlus, FaTrash } from "react-icons/fa";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { SiGoogletasks } from "react-icons/si";
import useDepartmentStore from "../store/departmentStore";
import useUserStore from "../store/userStore";
import axios from "axios";

const ManageDepartments = () => {
  const { user, fetchUser, loading: userLoading } = useUserStore();
  const {
    departments,
    subjects,
    fetchDepartments,
    addDepartment,
    deleteDepartment,
    fetchSubjects,
    addSubject,
    deleteSubject,
    addCourse, // store addCourse (if used)
    deleteCourse,
    teachersForDept,
    loadingTeachers,
    courses, // <-- get courses from store
    fetchCourses, // <-- get fetchCourses from store (used when selecting a department)
  } = useDepartmentStore();

  // removed local courses state (use store.courses)
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptCode, setNewDeptCode] = useState("");
  const [selectedDept, setSelectedDept] = useState(null);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: "", code: "" });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [allSubjects, setAllSubjects] = useState([]);
  const [courseForm, setCourseForm] = useState({
    name: "",
    subjectId: "",
    teacherId: "",
    departmentId: "",
  });

  // Fetch user if not loaded
  useEffect(() => {
    if (!user) fetchUser();
  }, []);

  // Once user available, fetch departments
  useEffect(() => {
    if (user) fetchDepartments();
  }, [user, fetchDepartments]);

  const handleAddDepartment = async () => {
    if (!newDeptName || !newDeptCode) {
      alert("Please fill all fields");
      return;
    }
    if (!user?._id) {
      alert("User not loaded");
      return;
    }

    try {
      await addDepartment({ name: newDeptName, code: newDeptCode });
      setNewDeptName("");
      setNewDeptCode("");
      setShowAddDeptModal(false);
      alert("Department added successfully!");
      // refresh after add
      await fetchDepartments();
    } catch (err) {
      alert("Failed to add department.");
    }
  };

  const handleSelectDepartment = async (dept) => {
    setSelectedDept(dept);
    if (dept?._id) {
      await fetchSubjects(dept._id);
      if (typeof fetchCourses === "function") {
        await fetchCourses(dept._id);
      }
    } else {
      setAllSubjects([]);
    }
  };

  // keep local allSubjects in sync with store subjects (fix: previously add-course showed all subjects)
  useEffect(() => {
    setAllSubjects(Array.isArray(subjects) ? subjects : []);
  }, [subjects]);

  // ensure courseForm.departmentId updates when selectedDept changes
  useEffect(() => {
    setCourseForm((f) => ({ ...f, departmentId: selectedDept?._id || "" }));
  }, [selectedDept]);

  useEffect(() => {
    if (selectedDept) fetchSubjects(selectedDept?._id);
  }, [selectedDept, fetchSubjects]);

  const handleAddSubject = async () => {
    if (!selectedDept) {
      alert("Select a department first!");
      return;
    }
    if (!newSubject.name || !newSubject.code) {
      alert("Something is missing.");
      return;
    }

    try {
      await addSubject({
        name: newSubject.name,
        code: newSubject.code,
        departmentId: selectedDept._id,
      });
      setNewSubject({ name: "", code: "" });
      setShowAddSubjectModal(false);
      alert("Subject added successfully!");
      // refresh subjects
      await fetchSubjects(selectedDept._id);
    } catch (err) {
      alert("Failed to add subject.");
    }
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      await deleteSubject(id);
      alert("Subject deleted successfully!");
      // refresh subjects for selected dept
      if (selectedDept?._id) await fetchSubjects(selectedDept._id);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDepartment(deptToDelete._id);
      setShowConfirmDelete(false);
      if (selectedDept?._id === deptToDelete._id) setSelectedDept(null);
      alert("Department deleted successfully!");
      // refresh departments
      await fetchDepartments();
    } catch (err) {
      alert("Failed to delete department.", err);
    }
  };

  const [teachers, setTeachers] = useState([]);
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/teacher/my-teachers`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        setTeachers(res.data.teachers || []);
      } catch (err) {
        console.error("Error fetching teachers:", err.response?.data || err.message);
      }
    };

    fetchTeachers();
  }, []);
  const simplifiedTeachers = teachers.map(teacher => ({
    id: teacher.userId._id,
    name: teacher.userId ? `${teacher.userId.firstName} ${teacher.userId.lastName}` : "Unknown"
  }));

  if (userLoading) return <div>Loading user...</div>;
  if (!user) return <div>Please log in to manage departments.</div>;

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Departments</h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Departments" value={departments?.length} icon={<FaBuilding />} />
        <StatCard title="Teaching Staff" value="0" icon={<BsFillPersonCheckFill />} />
        <StatCard title="Total Subjects" value={subjects?.length} icon={<SiGoogletasks />} />
        <StatCard title="Total Courses" value={courses?.length || 0} icon={<FaBook />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Departments List */}
        <div className="md:col-span-2 bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Departments</h2>
            <button
              onClick={() => setShowAddDeptModal(true)}
              className="p-2 bg-[#3D57bb] text-white rounded-full"
            >
              <FaPlus />
            </button>
          </div>
          <ul>
            {departments?.map((dept) => (
              <li
                key={dept._id}
                className={`p-2 flex justify-between items-center rounded cursor-pointer ${
                  selectedDept?._id === dept._id ? "bg-blue-100" : ""
                }`}
              >
                <span onClick={() => handleSelectDepartment(dept)}>{dept.name}</span>
                <button
                  className="text-red-500"
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

        {/* Subjects List */}
        <div className="md:col-span-2 bg-white p-4 rounded-lg shadow">
          {selectedDept ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">Subjects - {selectedDept.code}</h2>
                <button
                  onClick={() => setShowAddSubjectModal(true)}
                  className="text-[#3D57bb]"
                >
                  Add Subject
                </button>
              </div>
              {subjects?.length > 0 ? (
                subjects?.map((subject) => (
                  <div
                    key={subject._id}
                    className="flex justify-between items-center p-2 border-b"
                  >
                    <span>
                      {subject.name} ({subject.code})
                    </span>
                    <button
                      className="text-red-500"
                      onClick={() => handleDeleteSubject(subject._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              ) : (
                <p>No subjects found for this department.</p>
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
              <button
                onClick={() => setShowAddDeptModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDepartment}
                className="px-4 py-2 bg-[#3D57bb] text-white rounded"
              >
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
            <p>
              Are you sure you want to delete{" "}
              <strong>{deptToDelete?.name}</strong>?
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
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
              onChange={(e) =>
                setNewSubject({ ...newSubject, name: e.target.value })
              }
              className="border p-2 w-full mb-4"
              placeholder="Subject Name"
            />
            <input
              type="text"
              value={newSubject.code}
              onChange={(e) =>
                setNewSubject({ ...newSubject, code: e.target.value })
              }
              className="border p-2 w-full mb-4"
              placeholder="Subject Code"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddSubjectModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubject}
                className="px-4 py-2 bg-[#3D57bb] text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courses table */}
      <div className="bg-white rounded p-4 shadow mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium">Courses {selectedDept ? `— ${selectedDept.name}` : ""}</h2>
          <button
            onClick={async () => {
              const deptId = selectedDept?._id || selectedDept?.id;
              if (deptId && typeof fetchSubjects === "function") {
                try {
                  await fetchSubjects(deptId);
                } catch (err) {
                  console.error("Failed to fetch subjects before opening modal:", err);
                }
              }
              setCourseForm((f) => ({ ...f, departmentId: selectedDept?._id || "" }));
              setIsCourseModalOpen(true);
            }}
            className="px-3 py-1 bg-[#3D57bb] text-white rounded"
          >
            Add Course
          </button>
        </div>
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
              {(Array.isArray(courses) ? courses : []).map((c) => (
                <tr key={c._id || c.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium">{c.name}</td>
                  <td>{c.subject?.name || "—"}</td>
                  <td>{c.teacher ? `${c.teacher.firstName} ${c.teacher.lastName}` : "—"}</td>
                  <td>{c.department?.name || selectedDept?.name || "—"}</td>
                  <td className="text-right">
                    <button
                      onClick={() => deleteCourse(c._id || c.id)}
                      className="px-3 py-1 text-red-500 cursor-pointer"
                    ><FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {(!Array.isArray(courses) || courses.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No courses for this department.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Course Modal */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 opacity-40"
            onClick={() => {
              setIsCourseModalOpen(false);
              setCourseForm({ name: "", subjectId: "", teacherId: "", departmentId: selectedDept?._id || "" });
            }}
          />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (typeof addCourse === "function") {
                addCourse(courseForm).then(() => {
                  if (typeof fetchCourses === "function" && selectedDept) fetchCourses(selectedDept);
                  setIsCourseModalOpen(false);
                  setCourseForm({ name: "", subjectId: "", teacherId: "", departmentId: selectedDept?._id || "" });
                }).catch((err) => {
                  console.error(err);
                  alert("Failed to add course.");
                });
              } else {
                alert("Add course function not available.");
              }
            }}
            className="relative bg-white rounded p-6 z-10 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold mb-3">Add Course</h3>

            <input
              placeholder="Course name *"
              value={courseForm.name}
              onChange={(e) => setCourseForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border p-2 rounded mb-2"
              required
            />

            <label className="block mb-2">
              <div className="text-sm text-gray-600">Department</div>
              <select
                value={courseForm.departmentId}
                onChange={async (e) => {
                  const deptId = e.target.value;
                  setCourseForm((f) => ({ ...f, departmentId: deptId }));
                  // fetch subjects for the newly selected department so subject select is populated
                  if (deptId && typeof fetchSubjects === "function") {
                    try {
                      await fetchSubjects(deptId);
                    } catch (err) {
                      console.error("Failed to fetch subjects on department change:", err);
                    }
                  }
                }}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select department</option>
                {departments?.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </label>

            <label className="block mb-2">
              <div className="text-sm text-gray-600">Subject</div>
              <select
                value={courseForm.subjectId}
                onChange={(e) => setCourseForm((f) => ({ ...f, subjectId: e.target.value }))} 
                className="w-full border p-2 rounded"
                required
              >
                <option value="">{selectedDept ? "Select subject" : "Select department first"}</option>
                {allSubjects?.map((s) => (
                  <option key={s._id || s.id} value={s._id || s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block mb-4">
              <div className="text-sm text-gray-600">Teacher</div>
              <select
                value={courseForm.teacherId}
                onChange={(e) => setCourseForm((f) => ({ ...f, teacherId: e.target.value }))}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select teacher</option>
                {simplifiedTeachers?.map((t) => (
                  <option key={t._id || t.id} value={t._id || t.id}>{t.name}</option>
                ))}
              </select>
            </label>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsCourseModalOpen(false);
                  setCourseForm({ name: "", subjectId: "", teacherId: "", departmentId: selectedDept?._id || "" });
                }}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button type="submit" className="px-3 py-1 bg-[#3D57bb] text-white rounded">
                Add Course
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageDepartments;