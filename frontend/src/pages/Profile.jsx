// import React from 'react'

// const Profile = () => {
//   return (
//     <div className='overflow-x-hidden'>
//       profile
//     </div>
//   )
// }
import React from 'react'
import { Mail, GraduationCap, Target, Award, Calendar } from 'lucide-react'

const Profile = () => {
  // Profile Data (variables for backend integration)
  const student = {
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
    bio: "Passionate computer science student with keen interest in artificial intelligence and software development.",
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
      {
        title: "Active Participant",
        desc: "Most feedback submissions in semester",
        date: "12/20/2023",
        color: "text-purple-500"
      },
      {
        title: "Consistent Learner",
        desc: "Completed all assignments on time",
        date: "12/15/2023",
        color: "text-green-500"
      },
    ],
    skills: [
      { name: "JavaScript", value: 85 },
      { name: "React", value: 80 },
      { name: "Data Structures", value: 88 },
      { name: "Python", value: 90 },
      { name: "Machine Learning", value: 75 },
      { name: "Database Systems", value: 82 },
    ],
  }

  return (
    <div className="overflow-x-hidden p-6">
      {/* Header */}
      <div className="flex justify-between items-center p-1">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <button className="bg-[#3D57bb] text-white px-4 py-2 rounded-lg">Edit Profile</button>
      </div>
      <p className="text-gray-500 mb-6 mt-2 p-1">Manage your academic profile and track your progress</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white shadow border-1 border-gray-300 p-6 rounded-2xl">
            <div className="flex items-center space-x-4">
              <img src={student.avatar} alt="Profile" className="w-20 h-20 rounded-full" />
              <div>
                <h2 className="text-xl font-semibold">{student.name}</h2>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {student.email}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 mt-6 gap-6">
              {/* Academic Details */}
              <div className='space-y-2'>
                <h3 className="font-semibold flex items-center">
                  <GraduationCap className="w-4 h-4 mr-2" /> Academic Details
                </h3>
                <div className="flex justify-between mt-3">
                  <span className='text-sm'>College:</span>
                  <span className='text-sm text-gray-500'>{student.college}</span>
                </div>
                <div className="flex justify-between">
                  <span className='text-sm'>Year:</span>
                  <span className='text-sm text-gray-500'>{student.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className='text-sm'>Branch:</span>
                  <span className='text-sm text-gray-500'>{student.branch}</span>
                </div>
                <div className="flex justify-between">
                  <span className='text-sm'>Stream:</span>
                  <span className='text-sm text-gray-500'>{student.stream}</span>
                </div>
              
              </div>

              {/* Interests & Goals */}
              <div>
                <h3 className="font-semibold flex items-center">
                  <Target className="w-4 h-4 mr-2" /> Interests & Goals
                </h3>
                <p className='text-sm text-gray-500 mt-3'><div className="font-medium text-black">Interests:</div> {student.interests.join(", ")}</p>
                <p className='text-sm text-gray-500'><div className="font-medium text-black">Goals:</div> {student.goals.join(", ")}</p>
                <p className='text-sm text-gray-500'><div className="font-medium text-black">Bio:</div> {student.bio}</p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white shadow p-6 rounded-2xl border-1 border-gray-300">
            <h3 className="font-semibold mb-4">Skills & Competencies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {student.skills.map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm font-medium">
                    <span>{skill.name}</span>
                    <span className='text-gray-500'>{skill.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-lg mt-1">
                    <div
                      className="bg-[#3D57bb] h-2 rounded-lg"
                      style={{ width: `${skill.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Academic Progress */}
          <div className="bg-white shadow p-6 rounded-2xl border-1 border-gray-300">
            <h3 className="font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-gray-700" />
              <span>Academic Progress</span>
            </h3>

            <div className="space-y-2">
              <p className="text-sm">Semester Progress</p>
              <div className="flex items-center justify-between">
                <div className="w-full bg-gray-200 h-2 rounded-lg mr-3 relative">
                  <div
                    className="bg-[#3D57bb] h-2 rounded-lg"
                    style={{ width: `${student.semesterProgress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">
                  {student.semesterProgress}%
                </span>
              </div>
              {/* <div className="w-full bg-gray-200 h-2 rounded-lg">
                <div
                  className="bg-black h-2 rounded-lg"
                  style={{ width: `${student.semesterProgress}%` }}
                ></div>
              </div> */}
              <div className="text-sm flex justify-between">
                <span className='text-gray-500'>Current Semester:</span>
                <span>{student.currentSemester}</span>
              </div>
              <div className="text-sm flex justify-between">
                <span className='text-gray-500'>CGPA:</span>
                <span className="text-green-600">{student.cgpa}</span>
              </div>
              <div className="text-sm flex justify-between">
                <span className='text-gray-500'>Credits:</span>
                <span>{student.credits}</span>
              </div>
            
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white shadow p-6 rounded-2xl border-1 border-gray-300">
            <h3 className="font-semibold mb-4">Achievements</h3>
            <div className="space-y-4">
              {student.achievements.map((ach, idx) => (
                <div key={idx} className="flex items-center space-x-3 rounded-xl p-2 border-1 border-gray-300">
                  <Award className={`w-10 h-10 ${ach.color}`} />
                  <div>
                    <p className="font-medium">{ach.title}</p>
                    <p className="text-xs text-gray-500">{ach.desc}</p>
                    <p className="text-xs bg-gray-200 font-semibold p-1 w-fit rounded-2xl pl-2 pr-2 mt-1">{ach.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
