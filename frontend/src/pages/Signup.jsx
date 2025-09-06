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
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <AuthCard title="Schedulink - Sign Up">
      <p className="p-3 text-lg text-[#2C3E86] font-semibold">Create your account</p>
      <form className="flex flex-col gap-4 w-full items-center">
        {/* Name fields */}
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

        {/* Submit */}
        <button
          type="button"
          className="w-3/4 mt-4 py-2 rounded-xl bg-[#3D57BB] text-white hover:bg-[#2C3E86] transition"
        >
          Sign Up as {isAdmin ? "Teacher" : "Student"}
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