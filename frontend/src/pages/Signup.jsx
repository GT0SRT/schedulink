import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { FaRegCircle, FaRegDotCircle } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { PiStudentBold } from "react-icons/pi";

export default function Signup() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isAdmin, setIsAdmin] = useState(false); // false = Student, true = Teacher

  // Student fields
  const [college, setCollege] = useState("");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [stream, setStream] = useState("");

  // Teacher fields
  const [department, setDepartment] = useState("");
  const [specialization, setSpecialization] = useState("");

  return (
    <AuthCard title="Create Account">
      <p className="p-3 text-md text-gray-600">Fill in your details</p>

      <form className="flex flex-col gap-4 w-full items-center">
        {/* Full Name */}
        <div className="flex gap-3 w-3/4">
          <input
            type="text"
            placeholder="First Name"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            className="border-b-2 w-1/2 text-md border-[#2C3E86] focus:outline-none pl-1 text-[#2C3E86]"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            className="border-b-2 w-1/2 text-md border-[#2C3E86] focus:outline-none pl-1 text-[#2C3E86]"
          />
        </div>

        {/* Email */}
        <div className="w-3/4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-b-2 w-full text-md border-[#2C3E86] focus:outline-none pl-1 text-[#2C3E86]"
          />
        </div>

        {/* Password */}
        <div className="w-3/4">
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-b-2 w-full text-md border-[#2C3E86] focus:outline-none pl-1 text-[#2C3E86]"
          />
        </div>

        {/* Role selection */}
        <div className="flex gap-4 w-3/4 mt-2">
          <button
            type="button"
            onClick={() => setIsAdmin(false)}
            className={`flex items-center justify-center gap-2 flex-1 border px-3 py-2 rounded-lg ${
              !isAdmin ? "bg-[#3D57BB] text-white" : "border-gray-400 text-[#2C3E86]"
            }`}
          >
            {!isAdmin ? <FaRegDotCircle /> : <FaRegCircle />}
            <PiStudentBold />
            Student
          </button>
          <button
            type="button"
            onClick={() => setIsAdmin(true)}
            className={`flex items-center justify-center gap-2 flex-1 border px-3 py-2 rounded-lg ${
              isAdmin ? "bg-[#3D57BB] text-white" : "border-gray-400 text-[#2C3E86]"
            }`}
          >
            {isAdmin ? <FaRegDotCircle /> : <FaRegCircle />}
            <GiTeacher />
            Teacher
          </button>
        </div>

        {/* Conditional Forms */}
        {!isAdmin ? (
          // Student Info
          <div className="w-3/4 p-3 rounded-lg bg-blue-50 mt-3">
            <h3 className="text-blue-700 font-semibold mb-2">Student Information</h3>
            <input
              type="text"
              placeholder="College"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="border p-2 mb-2 w-full rounded-md"
            />
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border p-2 mb-2 w-full rounded-md"
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="border p-2 mb-2 w-full rounded-md"
            >
              <option value="">Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
              <option value="EE">EE</option>
            </select>
            <select
              value={stream}
              onChange={(e) => setStream(e.target.value)}
              className="border p-2 w-full rounded-md"
            >
              <option value="">Select Stream</option>
              <option value="Regular">Regular</option>
              <option value="Honors">Honors</option>
              <option value="Lateral">Lateral</option>
            </select>
          </div>
        ) : (
          // Teacher Info
          <div className="w-3/4 p-3 rounded-lg bg-green-50 mt-3">
            <h3 className="text-green-700 font-semibold mb-2">Teacher Information</h3>
            <input
              type="text"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="border p-2 mb-2 w-full rounded-md"
            />
            <input
              type="text"
              placeholder="Specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="border p-2 w-full rounded-md"
            />
          </div>
        )}
        
        {/* Submit */}
        <button
          type="button"
          className="w-3/4 mt-4 py-2 rounded-xl bg-[#3D57BB] text-white hover:bg-[#2C3E86] transition"
        >
          Create Account
        </button>
      </form>

      <div className="flex pt-5">
        <p>Already have an account?</p>
        <Link to="/signin" className="pl-1 text-[#3D57BB] hover:underline">
          Sign in
        </Link>
      </div>
    </AuthCard>
  );
}
