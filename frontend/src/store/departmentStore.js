import { create } from "zustand";
import axios from "axios";

const useDepartmentStore = create((set, get) => ({
  departments: [],
  subjects: [],
  courses: [],

  fetchDepartments: async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/department`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      set({ departments: res.data });
    } catch (err) {
      console.error("Fetch departments error:", err);
    }
  },

  addDepartment: async ({ name, code }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/department/add`,
        { name, code },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
       set(prev => ({
        ...prev,
        departments: [...(prev.departments || []), res.data]
      }));
      // set((state) => ({ departments: [...state.departments, res.data.department] }));
    } catch (err) {
      console.error("Add department error:", err.response?.data || err.message);
      throw err;
    }
  },

  deleteDepartment: async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/department/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      set((state) => ({
        departments: state.departments.filter((d) => d._id !== id),
      }));
    } catch (err) {
      console.error("Delete department error:", err);
    }
  },

  fetchSubjects: async (departmentId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/department/${departmentId}/subjects`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        }
      );
      set({ subjects: res.data });
    } catch (err) {
      console.error("Fetch subjects error:", err);
      set({ subjects: [] });
    }
  },

  addSubject: async (subjectData) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/department/subject/add`,
        subjectData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      set(prev => ({
        ...prev,
        subjects: [...(prev.subjects || []), res.data]
      }));
    } catch (err) {
      console.error("Add subject error:", err.response?.data || err.message);
      throw err;
    }
  },

  deleteSubject: async (subjectId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/department/subject/${subjectId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        }
      );
      set((state) => ({
        subjects: state.subjects.filter((subj) => subj._id !== subjectId),
      }));
    } catch (err) {
      console.error("Delete subject error:", err);
    }
  },
  
  fetchCourses: async (departmentId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses/${departmentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      set({ courses: res.data });
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  },

  addCourse: async (course) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/courses`, course, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      set((state) => ({ courses: [...state.courses, res.data] }));
    } catch (err) {
      console.error("Error adding course:", err);
    }
  },

  deleteCourse: async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      set((state) => ({
        courses: state.courses.filter((c) => c._id !== id),
      }));
    } catch (err) {
      console.error("Error deleting course:", err);
    }
  },
  
  fetchAllCourses: async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      set({ allCourses: res.data });
    } catch (err) {
      console.error("Error fetching all courses:", err);
    }
  },

  fetchAllSubjects: async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/subjects`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      set({ allSubjects: res.data });
    } catch (err) {
      console.error("Error fetching all subjects:", err);
    }
  },

  selectDepartment: (department) => {
    set({ selectedDepartment: department });
    if (department) {
      get().fetchSubjects(department._id);
      get().fetchCourses(department._id);
    } else {
      set({ subjects: [], courses: [] });
    }
  },
}));

export default useDepartmentStore;