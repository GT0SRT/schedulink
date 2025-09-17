import { create } from 'zustand'

const useProfileStore = create((set) => ({
  profile: {
    name: "Grace Stanley",
    email: "student@university.edu",
    avatar: "https://img.freepik.com/premium-vector/back-school-cartoon-boy-student-showing-fingers-up_46527-623.jpg",
    college: "Tech University",
    year: "3rd Year",
    branch: "Computer Science",
    stream: "B.Tech",
    interests: ["Machine Learning", "Web Development", "Data Science"],
    goals: [
      "Complete graduation with honors",
      "Land a software engineering role at a tech company",
    ],
    bio: "Passionate computer science student with keen interest in AI.",
    semesterProgress: 75,
    currentSemester: "6/8",
    cgpa: "8.7/10",
    credits: "145/192",
    achievements: [
      {
        title: "Perfect Attendance",
        desc: "100% attendance for 2 consecutive months",
        date: "1/10/2024",
        color: "text-yellow-500"
      },
      {
        title: "Top Performer",
        desc: "Highest grade in Machine Learning course",
        date: "1/5/2024",
        color: "text-orange-500"
      },
    ],
    skills: [
      { name: "JavaScript", value: 85 },
      { name: "React", value: 80 },
    ],
  },

  // Update profile
  updateProfile: (newData) =>
    set((state) => ({
      profile: { ...state.profile, ...newData },
    })),

  // Calculate completeness
  getCompleteness: () => {
    const state = useProfileStore.getState();
    const fieldsToCheck = [
      'name', 'email', 'avatar', 'college', 'year', 'branch', 'stream',
      'interests', 'goals', 'bio', 'skills'
    ];
    const filled = fieldsToCheck.filter(key => {
      const val = state.profile[key];
      return Array.isArray(val) ? val.length > 0 : !!val;
    });
    const completeness = Math.round((filled.length / fieldsToCheck.length) * 100);
    return completeness;
  }
}));

export default useProfileStore;