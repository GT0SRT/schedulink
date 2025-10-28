import React, { useState } from "react";

export default function JoinInvite() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  function handleJoin() {
    const valid = localStorage.getItem("invite-code");
    if (!valid) {
      setMessage("❌ No active invite codes found.");
      return;
    }
    if (code.trim() === valid) {
      // In real app, API call to join
      setMessage("✅ Successfully joined the group!");
    } else {
      setMessage("❌ Invalid invite code.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow w-96">
        <h1 className="text-2xl font-bold text-[#2C3E86] mb-4">
          Join with Invite Code
        </h1>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter invite code"
          className="w-full border p-3 rounded-xl mb-4"
        />
        <button
          onClick={handleJoin}
          className="w-full py-3 bg-[#2C3E86] text-white rounded-xl"
        >
          Join
        </button>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}
