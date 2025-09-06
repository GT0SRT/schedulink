// Pages/Signin.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthCard title="schedulink - Sign In">
      <p className="p-3 text-lg">Welcome back!</p>
      <form className="flex flex-col gap-3 w-full items-center">
        <input
          type="email"
          placeholder="Email or Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-b-2 text-md w-3/4 border-black focus:outline-none pl-1"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-b-2 text-md w-3/4 border-black focus:outline-none pl-1"
        />
        <p className="text-sm text-red-600 self-end w-3/4">
          <Link to="/forgotpassword">Forgot Password?</Link>
        </p>
        <button
          type="button"
          className="border-2 text-md mt-1 px-5 py-1 border-[#061F2B] rounded-xl
                     text-white hover:text-[#061F2B] bg-[#061F2B] hover:bg-transparent"
        >
          Sign In
        </button>
      </form>
      <div className="flex pt-5">
        <p>Don't have an account?</p>
        <Link to="/signup" className="pl-1 text-[#3131e7] hover:underline">
          Sign up
        </Link>
      </div>
    </AuthCard>
  );
}