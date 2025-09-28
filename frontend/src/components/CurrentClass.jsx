import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import QRScanner from "./QRScanner";  // your QR scanner component

const CurrentClass = ({
  classId,           // pass the class identifier (so backend knows which class)
  subject,
  time,
  location,
  teacher,
  progress,
  remaining,
  present,
  totalStudents,
  user,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [planTitle, setPlanTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [keyTopic, setKeyTopic] = useState("");
  const [showAttendanceOptions, setShowAttendanceOptions] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [qrLocation, setQrLocation] = useState(null);
  const [classStarted, setClassStarted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // for “Generating…” state
  const [qrValue, setQrValue] = useState(""); // the actual QR data to show

  // This effect ensures if showQR becomes true but qrLocation hasn't been set yet, we fetch location
  useEffect(() => {
    if (showQR && !qrLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setQrLocation({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error("Error getting location:", error);
            // you may alert or fallback
          }
        );
      } else {
        console.warn("Geolocation not supported");
      }
    }
  }, [showQR, qrLocation]);

  const submitPlan = (e) => {
    e.preventDefault();
    const newPlan = { planTitle, description, duration, keyTopic };
    console.log("Plan submitted:", newPlan);
    // TODO: call backend to save plan
    setShowForm(false);
    setPlanTitle("");
    setDescription("");
    setDuration("");
    setKeyTopic("");
  };

  // Construct QR data (string) only once when class is started / QR is generated
  // We'll set this via backend response ideally
  // But for now client-side fallback:
  const buildQrData = () => {
    return JSON.stringify({
      classId,
      teacherId: user?.id,
      subject,
      timestamp: new Date().toISOString(),
      location: qrLocation,
    });
  };

  const handleStartClass = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }

    setIsGenerating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const loc = { lat: latitude, lng: longitude };
        setQrLocation(loc);

        try {
          // Call your backend API to “start class”:
          // it should save QR + location into the Class document and return the QR data (string)
          const resp = await fetch("/api/class/start", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              classId,
              location: loc,
            }),
          });

          if (!resp.ok) {
            throw new Error("Failed to start class");
          }
          const respJson = await resp.json();
          // Suppose the response has { qrData: "...some string..." }
          const { qrData } = respJson;

          // Use returned QR data
          setQrValue(qrData);

          // Mark class as started in UI
          setClassStarted(true);
        } catch (err) {
          console.error("Error in start class API:", err);
          alert("Failed to start class. Try again.");
        } finally {
          setIsGenerating(false);
          setShowQR(true);  // automatically show QR
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Location access denied. Cannot start class.");
        setIsGenerating(false);
      }
    );
  };

  return (
    <div className="bg-[#2c3e86] text-white rounded-2xl md:mt-5 p-6 md:p-4 shadow-lg relative">
      <h2 className="text-sm mb-1">Current Class</h2>
      <h3 className="text-xl font-bold">{subject}</h3>
      <p className="text-xs mb-1">{time}</p>
      {user?.role === "t" && (
        <div className="flex items-center gap-4 text-xs mb-2">
          <span>👥 {present} / {totalStudents} Present</span>
          <span>👨‍🏫 {teacher}</span>
        </div>
      )}
      {user?.role === "s" && (
        <div className="flex items-center gap-4 text-xs mb-2">
          <span>📍 {location}</span>
          <span>👨‍🏫 {teacher}</span>
        </div>
      )}

      <div className="w-full bg-white/30 h-2 rounded-lg overflow-hidden mb-2">
        <div className="bg-blue-300 h-2" style={{ width: `${progress}%` }}></div>
      </div>

      {user?.role === "t" && (
        <p className="text-xs mb-2">
          Attendance Rate: {totalStudents ? Math.floor((present * 100) / totalStudents) : 0}%
        </p>
      )}

      {user?.role === "s" && (
        <p className="text-xs mb-2">{remaining} minutes remaining</p>
      )}

      {user?.role === "t" && (
        <div className="flex gap-2">
          {!classStarted ? (
            <button
              onClick={handleStartClass}
              className="bg-white text-black rounded-lg py-2 md:py-1 px-4 font-semibold w-2/3"
              disabled={isGenerating}
            >
              {isGenerating ? "Generating…" : "Start Class"}
            </button>
          ) : (
            <button
              onClick={() => setShowQR(true)}
              className="bg-white text-black rounded-lg py-2 md:py-1 px-4 font-semibold w-2/3"
            >
              Show QR
            </button>
          )}
          <button
            className="bg-white text-black rounded-lg py-1 md:py-1 px-2 font-semibold w-1/3"
            onClick={() => setShowForm(true)}
          >
            Add Plan
          </button>
        </div>
      )}

      {user?.role === "s" && (
        <button
          onClick={() => {
            setShowAttendanceOptions(true);
            setShowQR(false);
          }}
          className="bg-white cursor-pointer text-black rounded-lg py-2 md:py-1 px-4 font-semibold w-full"
        >
          Mark Attendance
        </button>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowForm(false)}
          ></div>
          <form
            onSubmit={submitPlan}
            className="relative z-50 bg-white rounded-xl p-6 w-full max-w-md shadow-lg flex flex-col gap-3 text-black"
          >
            <h3 className="text-xl font-bold text-[#2C3E86] mb-2">Add Class Plan</h3>
            <input
              type="text"
              placeholder="Plan Title"
              value={planTitle}
              onChange={(e) => setPlanTitle(e.target.value)}
              className="border px-3 py-2 rounded-lg w-full"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border px-3 py-2 rounded-lg w-full"
              rows={3}
            />
            <input
              type="text"
              placeholder="Duration (e.g., 60 min)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="border px-3 py-2 rounded-lg w-full"
            />
            <input
              type="text"
              placeholder="Key Topic"
              value={keyTopic}
              onChange={(e) => setKeyTopic(e.target.value)}
              className="border px-3 py-2 rounded-lg w-full"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-white font-semibold"
                style={{ backgroundColor: "#3D57bb" }}
              >
                Save Plan
              </button>
            </div>
          </form>
        </div>
      )}

      {showAttendanceOptions && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md relative">
            {!showScanner ? (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
                  Choose Attendance Method
                </h2>
                <button
                  onClick={() => setShowScanner(true)}
                  className="bg-[#2C3E86] cursor-pointer text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                  Mark via QR + GPS
                </button>
                <button
                  onClick={() => {
                    setShowAttendanceOptions(false);
                    alert("Marked via Bluetooth");
                  }}
                  className="bg-[#2C3E86] cursor-pointer text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                  Mark via Bluetooth
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-700 mb-5">
                  Scan the QR to mark your attendance and please allow location permission as well.
                </p>
                <div className="flex justify-center">
                  <QRScanner
                    onScanComplete={(decodedText, loc) => {
                      alert(
                        `Scanned: ${decodedText}\nLocation: ${
                          loc
                            ? `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`
                            : "Unknown"
                        }`
                      );
                      setShowScanner(false);
                      setShowAttendanceOptions(false);
                    }}
                    onClose={() => {
                      setShowScanner(false);
                      setShowAttendanceOptions(false);
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    setShowScanner(false);
                    setShowAttendanceOptions(false);
                  }}
                  className="mt-6 bg-[#2C3E86] text-white py-2 px-6 rounded-lg font-semibold"
                >
                  Close
                </button>
              </div>
            )}

            {!showScanner && (
              <button
                onClick={() => setShowAttendanceOptions(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* QR Modal / overlay */}
      {showQR && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full relative flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4 text-center text-[#2c3e86]">
              Scan this QR to mark attendance
            </h3>
            <div className="flex justify-center">
              <QRCodeSVG
                value={qrValue || buildQrData()}
                size={256}
                className="border rounded-lg"
              />
            </div>
            <button
              onClick={() => setShowQR(false)}
              className="mt-6 bg-white text-black border border-[#2c3e86] hover:bg-[#2c3e86] hover:text-white py-2 px-6 rounded-lg font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentClass;