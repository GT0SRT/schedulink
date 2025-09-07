// src/pages/Attendance.jsx
import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

/* Theme colors */
const THEME_DARK = "#2C3E86";
const THEME_LIGHT = "#3D57bb";

/* Haversine distance (meters) */
function distanceMeters(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371000; // meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/* ---------- Sample / seeded data (you can replace coords with real ones) ---------- */
const DEFAULT_SUBJECTS = [
  {
    id: "s-ml",
    name: "Machine Learning",
    room: "Lab 301",
    instructor: "Dr. Smith",
    // Example lat/lon (replace with your classroom geolocation)
    coords: { lat: 28.7041, lon: 77.1025 }, // Delhi approx (replace)
    totalSessions: 20,
  },
  {
    id: "s-ds",
    name: "Data Structures",
    room: "Room 102",
    instructor: "Prof. Wilson",
    coords: { lat: 28.7043, lon: 77.1030 },
    totalSessions: 18,
  },
  {
    id: "s-cn",
    name: "Computer Networks",
    room: "Room 210",
    instructor: "Prof. Anderson",
    coords: { lat: 28.7045, lon: 77.1020 },
    totalSessions: 22,
  },
];

const LS_RECORDS = "attendance_records";
const LS_SUBJECTS = "attendance_subjects";

/* ---------- Component ---------- */

export default function Attendance() {
  const [subjects, setSubjects] = useState([]);
  const [records, setRecords] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle"); // idle/loading/granted/denied/error
  const [distanceToClass, setDistanceToClass] = useState(null);
  const [allowedRadius, setAllowedRadius] = useState(100); // meters
  const [isMarking, setIsMarking] = useState(false);
  const [activeSubjectId, setActiveSubjectId] = useState(null); // subject shown in header (current class)
  const [errorMessage, setErrorMessage] = useState("");

  /* Load seeds from localStorage */
  useEffect(() => {
    const s = JSON.parse(localStorage.getItem(LS_SUBJECTS));
    const r = JSON.parse(localStorage.getItem(LS_RECORDS));
    setSubjects(Array.isArray(s) && s.length ? s : DEFAULT_SUBJECTS);
    setRecords(Array.isArray(r) ? r : []);
    // set default active subject to first
    setActiveSubjectId((Array.isArray(s) && s.length ? s[0].id : DEFAULT_SUBJECTS[0].id));
  }, []);

  /* Persist records & subjects */
  useEffect(() => {
    localStorage.setItem(LS_RECORDS, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem(LS_SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  /* Derived metrics */
  const metrics = useMemo(() => {
    const totalSessions = subjects.reduce((s, sub) => s + (sub.totalSessions || 0), 0) || 0;
    const totalPresent = records.filter((r) => r.status === "present").length;
    const overallPct = totalSessions === 0 ? 0 : Math.round((totalPresent / totalSessions) * 100);
    // month & week (simple)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // sunday start
    const thisMonthCount = records.filter((r) => new Date(r.dateISO) >= startOfMonth && r.status === "present").length;
    const thisWeekCount = records.filter((r) => new Date(r.dateISO) >= startOfWeek && r.status === "present").length;
    return {
      overallPct,
      thisMonthCount,
      thisWeekCount,
      target: 85,
      totalSessions,
      totalPresent,
    };
  }, [records, subjects]);

  /* Subject-wise stats */
  const subjectStats = useMemo(() => {
    return subjects.map((sub) => {
      const presentCount = records.filter((r) => r.subjectId === sub.id && r.status === "present").length;
      const percent = sub.totalSessions ? Math.round((presentCount / sub.totalSessions) * 100) : 0;
      return { ...sub, presentCount, percent };
    });
  }, [records, subjects]);

  /* Recent attendance */
  const recent = [...records].sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO)).slice(0, 6);

  /* helpers */
  const formatDateTime = (iso) => {
    const d = new Date(iso);
    return `${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • ${d.toLocaleDateString()}`;
  };

  /* --- Geolocation logic --- */
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser.");
      setLocationStatus("error");
      return;
    }
    setLocationStatus("loading");
    setErrorMessage("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setCurrentPosition({ lat, lon, accuracy: pos.coords.accuracy });
        setLocationStatus("granted");
        // compute distance to active subject's coords
        const sub = subjects.find((s) => s.id === activeSubjectId) || subjects[0];
        if (sub && sub.coords) {
          const d = distanceMeters(lat, lon, sub.coords.lat, sub.coords.lon);
          setDistanceToClass(Math.round(d));
        } else {
          setDistanceToClass(null);
        }
      },
      (err) => {
        setLocationStatus("denied");
        setErrorMessage(err.message || "Could not retrieve location.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  /* Mark Attendance */
  const canMarkNow = () => {
    if (!activeSubjectId) return false;
    const sub = subjects.find((s) => s.id === activeSubjectId);
    // check if already marked today for this subject
    const alreadyToday = records.some((r) => {
      return (
        r.subjectId === activeSubjectId &&
        new Date(r.dateISO).toDateString() === new Date().toDateString()
      );
    });
    return !alreadyToday;
  };

  const markAttendance = async ({ manual = false } = {}) => {
    if (!activeSubjectId) return;
    if (!manual) {
      // ensure we have location
      if (locationStatus !== "granted" || !currentPosition) {
        // try requesting location
        requestLocation();
        setErrorMessage("Please allow location access and try again.");
        return;
      }
    }

    setIsMarking(true);
    try {
      const sub = subjects.find((s) => s.id === activeSubjectId);
      const nowISO = new Date().toISOString();
      const d = currentPosition
        ? Math.round(distanceMeters(currentPosition.lat, currentPosition.lon, sub.coords.lat, sub.coords.lon))
        : null;
      // if not manual and outside radius — block and offer manual override
      if (!manual && typeof d === "number" && d > allowedRadius) {
        setErrorMessage(`You are ${d}m away from the classroom (allowed ${allowedRadius}m). You can 'Mark Anyway' if needed.`);
        setIsMarking(false);
        return;
      }

      const rec = {
        id: uuidv4(),
        subjectId: sub.id,
        subjectName: sub.name,
        instructor: sub.instructor,
        room: sub.room,
        dateISO: nowISO,
        status: "present",
        method: manual ? "manual" : "geo",
        lat: currentPosition ? currentPosition.lat : null,
        lon: currentPosition ? currentPosition.lon : null,
        distance: d,
      };

      setRecords((prev) => [rec, ...prev]);
      setErrorMessage("");
    } catch (e) {
      setErrorMessage("Failed to mark attendance: " + e.message);
    } finally {
      setIsMarking(false);
    }
  };

  const markAbsentForToday = (subjectId) => {
    if (!subjectId) return;
    const sub = subjects.find((s) => s.id === subjectId);
    const rec = {
      id: uuidv4(),
      subjectId: sub.id,
      subjectName: sub.name,
      instructor: sub.instructor,
      room: sub.room,
      dateISO: new Date().toISOString(),
      status: "absent",
      method: "manual",
    };
    setRecords((prev) => [rec, ...prev]);
  };

  const undoLastRecord = () => {
    setRecords((prev) => prev.slice(1));
  };

  const clearAllRecords = () => {
    if (!window.confirm("Clear all attendance records? This cannot be undone.")) return;
    setRecords([]);
  };

  /* UI small helpers */
  const activeSubject = subjects.find((s) => s.id === activeSubjectId) || subjects[0];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold" style={{ color: THEME_DARK }}>
          Attendance Tracking
        </h1>
        <p className="text-sm text-gray-500">
          Monitor your class attendance and maintain your academic record
        </p>
      </div>

      {/* Current class card */}
      <div
        className="rounded-xl p-6 mb-6 shadow-lg"
        style={{
          background: `linear-gradient(90deg, ${THEME_LIGHT}, ${THEME_DARK})`,
          color: "white",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-sm flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full border border-white/30" />
              Mark Attendance - Current Class
            </div>
            <h2 className="text-2xl font-bold mt-3">{activeSubject.name}</h2>
            <div className="text-sm mt-1">
              {activeSubject.room} • {activeSubject.instructor}
            </div>
            <div className="text-xs mt-2 opacity-90">
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • {new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="flex-1 md:flex-none">
            <div className="bg-white rounded-lg p-3" style={{ color: THEME_DARK }}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 6.11 7 13 7 13s7-6.89 7-13c0-3.87-3.13-7-7-7z" fill={THEME_DARK}/></svg>
                  <div>
                    <div className="text-sm font-semibold">Mark Attendance</div>
                    <div className="text-xs text-gray-500">Current Class</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    requestLocation();
                    // if permission already granted and inside radius, mark
                    if (locationStatus === "granted" && distanceToClass !== null && distanceToClass <= allowedRadius) {
                      markAttendance({ manual: false });
                    } else {
                      // request location then let user press Mark once location fetched
                      setErrorMessage("Location requested. If inside classroom press Mark Attendance again to confirm.");
                    }
                  }}
                  disabled={!canMarkNow() || isMarking}
                  className="mt-2 md:mt-0 w-full md:w-auto bg-white text-[#2C3E86] font-bold px-6 py-3 rounded-lg shadow-md hover:opacity-95"
                >
                  {isMarking ? "Marking..." : "Mark Attendance"}
                </button>
              </div>

              <div className="mt-3 text-xs text-gray-600">
                <div>Allowed radius: {allowedRadius} m</div>
                <div>
                  Location status:{" "}
                  <strong className="capitalize">
                    {locationStatus === "idle" ? "idle" : locationStatus}
                  </strong>
                </div>
                {locationStatus === "granted" && distanceToClass !== null && (
                  <div className="mt-1">
                    Distance to class:{" "}
                    <strong>{distanceToClass} m</strong>{" "}
                    {distanceToClass <= allowedRadius ? (
                      <span className="text-green-600 font-semibold"> — inside classroom</span>
                    ) : (
                      <span className="text-red-600 font-semibold"> — outside classroom</span>
                    )}
                  </div>
                )}
                {errorMessage && <div className="mt-2 text-sm text-red-600">{errorMessage}</div>}

                {/* Manual override */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      if (!canMarkNow()) return alert("Already marked today for this subject.");
                      if (!window.confirm("Mark attendance manually? This will record as manual entry.")) return;
                      markAttendance({ manual: true });
                    }}
                    className="px-4 py-2 bg-white/90 text-[#2C3E86] rounded-md border border-white/30 font-semibold"
                  >
                    Mark Anyway (Manual)
                  </button>

                  <button
                    onClick={requestLocation}
                    className="px-4 py-2 bg-white/10 text-white rounded-md border border-white/30"
                  >
                    Request Location
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow border" style={{ borderColor: `${THEME_DARK}22` }}>
          <div className="text-sm text-gray-500">Overall Attendance</div>
          <div className="text-2xl font-bold mt-2" style={{ color: "#16a34a" }}>
            {metrics.overallPct}% 
          </div>
          <div className="text-xs text-gray-400 mt-1">Above target ({metrics.target}%)</div>
          <div className="mt-3 h-2 bg-gray-200 rounded-full">
            <div className="h-2 rounded-full" style={{ width: `${metrics.overallPct}%`, background: THEME_DARK }} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow border" style={{ borderColor: `${THEME_LIGHT}22` }}>
          <div className="text-sm text-gray-500">This Month</div>
          <div className="text-2xl font-bold mt-2" style={{ color: THEME_LIGHT }}>
            {metrics.thisMonthCount} present
          </div>
          <div className="text-xs text-gray-400 mt-1">This month</div>
          <div className="mt-3 h-2 bg-gray-200 rounded-full">
            <div className="h-2 rounded-full" style={{ width: `${Math.min(100, metrics.thisMonthCount * 5)}%`, background: THEME_LIGHT }} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow border" style={{ borderColor: `${THEME_DARK}22` }}>
          <div className="text-sm text-gray-500">This Week</div>
          <div className="text-2xl font-bold mt-2" style={{ color: "#8b5cf6" }}>
            {metrics.thisWeekCount} present
          </div>
          <div className="text-xs text-gray-400 mt-1">This week</div>
          <div className="mt-3 h-2 bg-gray-200 rounded-full">
            <div className="h-2 rounded-full" style={{ width: `${Math.min(100, metrics.thisWeekCount * 10)}%`, background: "#8b5cf6" }} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow border" style={{ borderColor: `${THEME_LIGHT}22` }}>
          <div className="text-sm text-gray-500">Target</div>
          <div className="text-2xl font-bold mt-2">{metrics.target}%</div>
          <div className="text-xs text-gray-400 mt-1">Minimum required</div>
          <div className="mt-3 h-2 bg-gray-200 rounded-full">
            <div className="h-2 rounded-full" style={{ width: `${metrics.target}%`, background: THEME_DARK }} />
          </div>
        </div>
      </div>

      {/* Subject columns and recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject-wise attendance */}
        <div className="bg-white rounded-xl p-5 shadow border" style={{ borderColor: `${THEME_DARK}22` }}>
          <h3 className="font-semibold text-lg mb-4">Subject-wise Attendance</h3>
          <div className="space-y-4">
            {subjectStats.map((s) => (
              <div key={s.id} className="p-4 rounded-lg bg-[#f9fafb] border border-[#e9eefb]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-lg">{s.name}</div>
                    <div className="text-xs text-gray-500">{s.instructor}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold" style={{ color: s.percent >= 90 ? "#16a34a" : s.percent >= 80 ? "#f59e0b" : "#ef4444" }}>
                      {s.percent}%
                    </div>
                    <div className="text-xs text-gray-400">{s.presentCount}/{s.totalSessions}</div>
                  </div>
                </div>

                <div className="mt-3 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div style={{ width: `${s.percent}%`, height: "100%", background: `linear-gradient(90deg, ${THEME_LIGHT}, ${THEME_DARK})` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="bg-white rounded-xl p-5 shadow border" style={{ borderColor: `${THEME_LIGHT}22` }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Recent Attendance</h3>
            <div className="flex gap-2">
              <button onClick={undoLastRecord} className="px-3 py-1 border rounded-md text-sm">Undo Last</button>
              <button onClick={clearAllRecords} className="px-3 py-1 bg-red-600 text-white rounded-md text-sm">Clear All</button>
            </div>
          </div>

          <div className="space-y-3">
            {recent.length === 0 && <div className="text-gray-500 italic">No recent attendance</div>}
            {recent.map((r) => (
              <div key={r.id} className="p-3 rounded-md bg-[#fbfbff] border border-[#eef2ff] flex justify-between items-center">
                <div>
                  <div className="font-semibold">{r.subjectName}</div>
                  <div className="text-xs text-gray-500">{r.instructor} • {formatDateTime(r.dateISO)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${r.status === "present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {r.status === "present" ? "Present" : "Absent"}
                  </div>
                  {r.distance != null && <div className="text-xs text-gray-500">{r.distance} m</div>}
                  {r.method && <div className="text-xs text-gray-400">{r.method}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Small selectors */}
      <div className="mt-6 flex items-center gap-3">
        <label className="text-sm font-medium">Choose class: </label>
        <select
          value={activeSubjectId}
          onChange={(e) => { setActiveSubjectId(e.target.value); setDistanceToClass(null); setLocationStatus("idle"); }}
          className="px-3 py-2 border rounded-md"
        >
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.room}</option>)}
        </select>

        <label className="text-sm">Allowed radius (m):</label>
        <input type="number" value={allowedRadius} onChange={(e) => setAllowedRadius(Number(e.target.value || 0))} className="w-24 px-2 py-1 border rounded-md" />
      </div>
    </div>
  );
}
