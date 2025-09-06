// Pages/Signin.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthCard title="">
      {/* Logo + Title */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <h1 className="text-2xl font-bold text-[#2C3E86]">EduSmart</h1>
        </div>
        <h2 className="text-xl font-semibold mt-4">Welcome Back</h2>
        <p className="text-gray-500 text-sm">
          Sign in to access your academic dashboard
        </p>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-4 w-full px-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            placeholder="student@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2C3E86] bg-gray-50"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2C3E86] bg-gray-50"
          />
        </div>

        <div className="flex justify-between text-sm">
          <Link to="/forgotpassword" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="button"
          className="w-full py-2 rounded-lg bg-[#2C3E86] text-white font-medium hover:bg-[#1f2d5c] transition"
        >
          Sign In
        </button>
      </form>
      {/* Demo accounts */}
      <div className="mt-6 text-xs text-gray-500 text-center">
        <p className="font-semibold">Demo Accounts:</p>
        <p>Student: student@university.edu</p>
        <p>Teacher: teacher@university.edu</p>
        <p>Admin: admin@university.edu</p>
      </div>

      {/* Sign up link */}
      <div className="flex justify-center mt-4 text-sm">
        <p>Don’t have an account?</p>
        <Link to="/signup" className="pl-1 text-blue-600 hover:underline">
          Sign Up
        </Link>
      </div>
    </AuthCard>
  );
}
