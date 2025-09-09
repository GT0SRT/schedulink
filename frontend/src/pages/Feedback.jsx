// src/pages/Feedback.jsx
import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

/* 
  Feedback.jsx
  - Matches project theme colors: #2C3E86 and #3D57bb
  - Persists to localStorage keys: 'pending_sessions' and 'class_feedbacks'
  - Place in pages folder and route to it (you already have a route)
*/

const THEME_DARK = "#2C3E86";
const THEME_LIGHT = "#3D57bb";

/* ---------- Small UI subcomponents ---------- */

const StarRating = ({ value = 0, onChange, size = 5 }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-1">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange && onChange(s)}
          aria-label={`Rate ${s}`}
          className="focus:outline-none"
        >
          <svg
            className={`w-5 h-5 ${
              s <= value ? "text-yellow-400" : "text-gray-300"
            }`}
            viewBox="0 0 24 24"
            fill={s <= value ? "currentColor" : "none"}
            stroke={s <= value ? "none" : "currentColor"}
            strokeWidth="1.5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 .587l3.668 7.431L23.6 9.763l-5.4 5.261L19.337 24 12 19.897 4.663 24l1.137-8.976L.4 9.763l7.932-1.745L12 .587z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

const Badge = ({ children, color = THEME_LIGHT }) => (
  <span
    style={{ backgroundColor: `${color}22`, color }}
    className="px-3 py-1 rounded-full text-sm font-semibold"
  >
    {children}
  </span>
);

/* ---------- Default seeded data ---------- */

const DEFAULT_PENDING = [
  {
    id: uuidv4(),
    subject: "Machine Learning",
    instructor: "Dr. Smith",
    time: "10:00 AM",
    duration: "60 min",
    dateISO: new Date().toISOString(),
    status: "pending",
  },
  {
    id: uuidv4(),
    subject: "Data Structures",
    instructor: "Prof. Wilson",
    time: "11:30 AM",
    duration: "90 min",
    dateISO: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: uuidv4(),
    subject: "Computer Networks",
    instructor: "Prof. Anderson",
    time: "09:00 AM",
    duration: "60 min",
    dateISO: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    status: "pending",
  },
];

const DEFAULT_FEEDBACKS = [
  {
    id: uuidv4(),
    sessionId: null,
    subject: "Computer Networks",
    instructor: "Prof. Anderson",
    dateISO: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    understanding: 4,
    pace: "Just Right",
    usefulness: 5,
    comment: "Great explanation of TCP/IP protocols",
  },
];

function Feedback() {
  /* --- localStorage keys --- */
  const LS_PENDING = "pending_sessions";
  const LS_FEEDBACKS = "class_feedbacks";

  /* --- state --- */
  const [pending, setPending] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState(null);

  // form state inside modal
  const [understanding, setUnderstanding] = useState(4);
  const [pace, setPace] = useState("Just Right");
  const [usefulness, setUsefulness] = useState(4);
  const [comment, setComment] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  /* ---------- Load / Save from localStorage ---------- */
  useEffect(() => {
    const p = JSON.parse(localStorage.getItem(LS_PENDING));
    const f = JSON.parse(localStorage.getItem(LS_FEEDBACKS));
    setPending(Array.isArray(p) && p.length ? p : DEFAULT_PENDING);
    setFeedbacks(Array.isArray(f) && f.length ? f : DEFAULT_FEEDBACKS);
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_PENDING, JSON.stringify(pending));
  }, [pending]);

  useEffect(() => {
    localStorage.setItem(LS_FEEDBACKS, JSON.stringify(feedbacks));
  }, [feedbacks]);

  /* ---------- Derived metrics ---------- */
  const metrics = useMemo(() => {
    const total = feedbacks.length;
    const avgUnderstanding =
      total === 0
        ? 0
        : (
            feedbacks.reduce((s, f) => s + (f.understanding || 0), 0) / total
          ).toFixed(1);
    const positiveCount = feedbacks.filter(
      (f) => (f.usefulness || 0) >= 4
    ).length;
    const positivePct =
      total === 0 ? 0 : Math.round((positiveCount / total) * 100);

    // top subject
    const freq = {};
    feedbacks.forEach((f) => {
      freq[f.subject] = (freq[f.subject] || 0) + 1;
    });
    let topSubject =
      Object.keys(freq).sort((a, b) => freq[b] - freq[a])[0] || "—";

    return {
      total,
      avgUnderstanding,
      positivePct,
      topSubject,
    };
  }, [feedbacks]);

  /* ---------- Handlers ---------- */
  const openModalFor = (session) => {
    setActiveSession(session);
    // reset form defaults
    setUnderstanding(4);
    setPace("Just Right");
    setUsefulness(4);
    setComment("");
    setModalOpen(true);
  };

  const submitFeedback = (e) => {
    e.preventDefault();
    if (!activeSession) return;

    const newFeedback = {
      id: uuidv4(),
      sessionId: activeSession.id,
      subject: activeSession.subject,
      instructor: activeSession.instructor,
      dateISO: new Date().toISOString(),
      understanding,
      pace,
      usefulness,
      comment,
    };

    // add feedback
    setFeedbacks((prev) => [newFeedback, ...prev]);

    // mark session submitted (or remove it)
    setPending((prev) =>
      prev.map((s) =>
        s.id === activeSession.id ? { ...s, status: "submitted" } : s
      )
    );

    setModalOpen(false);
  };

  const removeFeedback = (id) => {
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
  };

  const reopenSession = (sessionId) => {
    setPending((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: "pending" } : s))
    );
  };

  const clearAllFeedbacks = () => {
    if (!confirm("Clear all feedbacks? This can't be undone.")) return;
    setFeedbacks([]);
  };

  /* ---------- helpers ---------- */
  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: THEME_DARK }}>
            Class Feedback
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Share your learning experience and help improve classes
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Feedbacks</div>
            <div className="text-2xl font-bold">{metrics.total}</div>
          </div>
          <button
            onClick={clearAllFeedbacks}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          className="rounded-xl p-5 bg-white shadow border"
          style={{ borderColor: `${THEME_DARK}22` }}
        >
          <div className="text-sm text-gray-500">Avg Understanding</div>
          <div className="flex items-center justify-between mt-3">
            <div>
              <div className="text-2xl font-bold">
                {metrics.avgUnderstanding}/5
              </div>
              <div className="text-xs text-gray-400">Your learning rating</div>
            </div>
            <div className="text-2xl" style={{ color: THEME_LIGHT }}>
              ⭐
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-5 bg-white shadow border"
          style={{ borderColor: `${THEME_LIGHT}22` }}
        >
          <div className="text-sm text-gray-500">Total Feedbacks</div>
          <div className="mt-3">
            <div className="text-2xl font-bold">{metrics.total}</div>
            <div className="text-xs text-gray-400">Classes reviewed</div>
          </div>
        </div>

        <div
          className="rounded-xl p-5 bg-white shadow border"
          style={{ borderColor: `${THEME_DARK}22` }}
        >
          <div className="text-sm text-gray-500">Positive Response</div>
          <div className="mt-3">
            <div className="text-2xl font-bold">{metrics.positivePct}%</div>
            <div className="text-xs text-gray-400">Useful classes</div>
          </div>
        </div>

        <div
          className="rounded-xl p-5 bg-white shadow border"
          style={{ borderColor: `${THEME_LIGHT}22` }}
        >
          <div className="text-sm text-gray-500">Top Subject</div>
          <div className="mt-3">
            <div className="text-lg font-bold">{metrics.topSubject}</div>
            <div className="text-xs text-gray-400">Most helpful</div>
          </div>
        </div>
      </div>

      {/* Pending & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending */}
        <div>
          <div
            className="rounded-xl p-5 bg-white shadow border mb-4"
            style={{ borderColor: `${THEME_LIGHT}22` }}
          >
            <div className="flex items-center justify-between">
              <h3
                className="font-semibold text-lg"
                style={{ color: THEME_DARK }}
              >
                Pending Feedback
              </h3>
              <div className="text-sm text-gray-500">
                {pending.filter((p) => p.status === "pending").length} pending
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {pending.filter((p) => p.status === "pending").length === 0 && (
              <div className="text-gray-500 italic p-6 bg-[#3D57bb]/6 rounded-lg border border-[#3D57bb]/10">
                No pending feedback — great job!
              </div>
            )}

            {pending
              .filter((s) => s.status === "pending")
              .map((s) => (
                <div
                  key={s.id}
                  className="rounded-lg p-4 bg-[#3D57bb]/8 border border-[#3D57bb]/20 flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
                >
                  <div>
                    <div
                      className="text-lg font-semibold"
                      style={{ color: THEME_DARK }}
                    >
                      {s.subject}
                    </div>
                    <div className="text-sm text-gray-500">{s.instructor}</div>
                    <div className="text-xs text-gray-400 mt-2">
                      ⏱ {s.time} • {s.duration}
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <Badge color={THEME_LIGHT}>Pending</Badge>
                    <button
                      onClick={() => openModalFor(s)}
                      className="bg-[#3D57bb] hover:bg-[#2C3E86] text-white px-4 py-2 rounded-lg font-semibold shadow"
                    >
                      Provide Feedback
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Recent */}
        <div>
          <div
            className="rounded-xl p-5 bg-white shadow border mb-4"
            style={{ borderColor: `${THEME_DARK}22` }}
          >
            <div className="flex items-center justify-between">
              <h3
                className="font-semibold text-lg"
                style={{ color: THEME_DARK }}
              >
                Recent Feedback
              </h3>
              <input
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                placeholder="Filter by subject..."
                className="px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            {feedbacks.filter((f) =>
              f.subject.toLowerCase().includes(nameFilter.toLowerCase())
            ).length === 0 && (
              <div className="text-gray-500 italic p-6 bg-[#2C3E86]/6 rounded-lg border border-[#2C3E86]/10">
                No feedbacks yet.
              </div>
            )}

            {feedbacks
              .filter((f) =>
                f.subject.toLowerCase().includes(nameFilter.toLowerCase())
              )
              .map((f) => (
                <div
                  key={f.id}
                  className="rounded-lg p-4 bg-[#3D57bb]/6 border border-[#3D57bb]/14"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div
                        className="font-semibold text-lg"
                        style={{ color: THEME_DARK }}
                      >
                        {f.subject}
                      </div>
                      <div className="text-sm text-gray-500">
                        {f.instructor}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {formatDate(f.dateISO)}
                      </div>
                    </div>

                    <div className="flex gap-2 items-center">
                      <Badge color={THEME_DARK}>Submitted</Badge>
                      <button
                        onClick={() => removeFeedback(f.id)}
                        className="text-sm px-3 py-1 rounded-md border hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="text-xs text-gray-500">Understanding</div>
                      <div className="mt-1">
                        <StarRating value={f.understanding} />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Pace</div>
                      <div className="mt-1 text-sm font-medium">{f.pace}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Usefulness</div>
                      <div className="mt-1">
                        <StarRating value={f.usefulness} />
                      </div>
                    </div>
                  </div>

                  {f.comment && (
                    <div className="mt-3 text-sm text-gray-700 bg-white p-3 rounded-md border border-[#3D57bb]/6">
                      <strong>Comment:</strong>
                      <div className="mt-1">{f.comment}</div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && activeSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setModalOpen(false)}
          />
          <div
            className="relative z-50 w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 border"
            style={{ borderColor: `${THEME_LIGHT}22` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold" style={{ color: THEME_DARK }}>
                  Feedback — {activeSession.subject}
                </h3>
                <div className="text-sm text-gray-500">
                  {activeSession.instructor} • {activeSession.time}
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitFeedback} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Understanding
                </label>
                <div className="mt-2">
                  <StarRating
                    value={understanding}
                    onChange={setUnderstanding}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Pace
                </label>
                <select
                  value={pace}
                  onChange={(e) => setPace(e.target.value)}
                  className="mt-2 w-full px-3 py-2 border rounded-lg"
                >
                  <option>Too Slow</option>
                  <option>Just Right</option>
                  <option>Too Fast</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Usefulness
                </label>
                <div className="mt-2">
                  <StarRating value={usefulness} onChange={setUsefulness} />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Comments (optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg mt-2"
                  placeholder="Tell us what worked and what can improve..."
                />
              </div>

              <div className="flex items-center gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-white font-semibold"
                  style={{ background: THEME_LIGHT }}
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feedback;
