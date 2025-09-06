import React from 'react';
import loginImg from "../Assets/happy.png";

export default function AuthCard({ title, children }) {
  return (
    <div className="bg-gradient-to-tr from-[#0d1a4e] via-[#2C3E86] to-[#3D57bb] min-h-screen p-7 flex items-center justify-center">
      {/* Left image */}
      <div className="w-1/2 m-3 p-3 hidden md:block">
        <img src={loginImg} className="h-[60vh] ml-12" alt="Login Visual" />
        <h1
          style={{ fontFamily: '"Leckerli One", cursive' }}
          className="text-white font-extralight p-4 text-2xl m-7"
        >
          Welcome, unlock your full potential.
        </h1>
      </div>

      {/* Right form card */}
      <div className="bg-white min-w-[350px] max-w-[420px] w-full  rounded-xl flex flex-col p-6 items-center justify-center">
        <h1
          style={{ fontFamily: '"Leckerli One", cursive' }}
          className="font-extralight mb-6 text-2xl text-[#2C3E86]"
        >
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
}