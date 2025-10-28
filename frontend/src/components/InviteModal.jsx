import React, { useState } from "react";

export default function InviteModal({ onClose }) {
  const [invite, setInvite] = useState("");

  function generateCode() {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setInvite(code);
    localStorage.setItem("invite-code", code);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 shadow-lg w-96">
        <h2 className="text-lg font-bold text-[#2C3E86]">Generate Invite Code</h2>
        <p className="text-gray-500 mt-2">Share this code with students.</p>
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={generateCode}
            className="px-4 py-2 bg-[#2C3E86] text-white rounded-lg"
          >
            Generate
          </button>
          {invite && (
            <div className="flex-1 text-center font-mono text-lg">{invite}</div>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
