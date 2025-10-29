import React, { useEffect, useMemo, useState } from "react";

// ReportsAnalyticsPage.jsx
// Single-file React component that recreates the "Reports & Analytics" UI shown in the screenshots.

export default function ReportsAnalyticsPage() {
  const THEME_PRIMARY = "#6C63FF"; // soft purple used in charts and highlights
  const ACCENT_GREEN = "#16A34A";
  const ACCENT_RED = "#EF4444";

  // --- sample KPIs ---
  const kpiDefault = {
    overallAttendance: { value: 88.5, delta: 2.3 },
    avgCGPA: { value: 8.1, delta: 0.2 },
    studentSatisfaction: { value: 92, delta: 1.5 },
    courseCompletion: { value: 94.2, delta: -0.8 },
  };

  // --- sample time series and dept data ---
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const attendanceSeries = [85, 88, 82, 91, 89, 95];
  const departments = ["Computer Science", "Electronics", "Mechanical", "Civil"];
  const deptAttendance = {
    "Computer Science": 92,
    Electronics: 89,
    Mechanical: 85,
    Civil: 88,
  };

  const gradeDistribution = [
    { label: "A+", pct: 12.5 },
    { label: "A", pct: 25 },
    { label: "B+", pct: 20 },
    { label: "B", pct: 18 },
    { label: "C+", pct: 15 },
    { label: "C", pct: 9.5 },
  ];

  const deptCGPA = {
    "Computer Science": 8.8,
    Electronics: 7.9,
    Mechanical: 8.3,
    Civil: 8.0,
  };

  const enrollmentTrend = {
    years: [2018, 2019, 2020, 2021, 2022, 2023],
    enrolled: [900, 980, 1020, 1100, 1250, 1350],
    graduated: [200, 220, 240, 300, 320, 340],
  };

  const faculty = [
    { id: 1, name: "Dr. Sarah Johnson", classes: 12, students: 320, hrs: 18 },
    { id: 2, name: "Prof. Michael Chen", classes: 10, students: 280, hrs: 15 },
    { id: 3, name: "Dr. Emily Rodriguez", classes: 8, students: 240, hrs: 12 },
  ];

  const feedback = [
    { course: "Machine Learning", responses: 45, rating: 4.8 },
    { course: "Digital Electronics", responses: 38, rating: 4.6 },
    { course: "Thermodynamics", responses: 52, rating: 4.4 },
    { course: "Structural Analysis", responses: 28, rating: 4.7 },
  ];

  // --- UI state ---
  const [kpis, setKpis] = useState(kpiDefault);
  const [activeTab, setActiveTab] = useState("Attendance");
  const [period, setPeriod] = useState("This Month");
  const [selectedDept, setSelectedDept] = useState("All Departments");

  // Simulate fetch / fresh data if period or department change
  useEffect(() => {
    // for demo, no network calls; could integrate fetch here
  }, [period, selectedDept]);

  // --- small helper utilities ---
  function formatPct(val) {
    if (Number.isInteger(val)) return `${val}%`;
    return `${val.toFixed(1)}%`;
  }

  function formatDelta(d) {
    const arrow = d > 0 ? "↑" : d < 0 ? "↓" : "→";
    const cls = d > 0 ? "text-green-600" : d < 0 ? "text-red-500" : "text-gray-500";
    return (
      <span className={cls + " font-medium text-sm flex items-center gap-1"}>
        {arrow} {Math.abs(d)} {Math.abs(d) === 0 ? "" : "%"}
      </span>
    );
  }

  // --- export helpers (simulate CSV/PNG export) ---
  function exportCSV(name, rows) {
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function exportReport() {
    // export a few CSVs for demo
    exportCSV(
      "attendance_over_time.csv",
      [
        ["Month", "Attendance"],
        ...months.map((m, i) => [m, attendanceSeries[i]])
      ]
    );

    setTimeout(() => alert("Exported sample CSVs (simulated)."), 200);
  }

  // --- small SVG chart components ---
function LineChart({ data = [], labels = [], height = 140 }) {
  // Layout + gutters so we can draw axis labels
  const w = 360;
  const h = height;
  const leftPadding = 40;      // room for y labels
  const rightPadding = 12;
  const bottomPadding = 28;    // room for x labels
  const topPadding = 8;

  const plotW = w - leftPadding - rightPadding;
  const plotH = h - topPadding - bottomPadding;

  // Y range
  const max = Math.max(...data, 100);
  const min = Math.min(...data, 0);
  const range = Math.max(1, max - min);

  // Generate points (in plot coordinate space)
  const pointsArr = data.map((v, i) => {
    const x = leftPadding + (i / (data.length - 1)) * plotW;
    const y = topPadding + plotH - ((v - min) / range) * plotH;
    return { x, y };
  });

  const points = pointsArr.map((p) => `${p.x},${p.y}`).join(" ");

  // Y tick values (4 ticks + 0) -> top-to-bottom
  const yTickCount = 4;
  const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) => {
    return Math.round((max * (yTickCount - i)) / yTickCount);
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} className="block">
      {/* grid lines */}
      {yTicks.map((t, i) => {
        const y = topPadding + (i / yTickCount) * plotH;
        return (
          <g key={i}>
            <line x1={leftPadding} x2={w - rightPadding} y1={y} y2={y} stroke="#E6E6E6" strokeDasharray="4 4" />
            <text x={leftPadding - 8} y={y + 4} fontSize={11} textAnchor="end" fill="#666">
              {t}
            </text>
          </g>
        );
      })}

      {/* Y axis */}
      <line
        x1={leftPadding}
        x2={leftPadding}
        y1={topPadding}
        y2={topPadding + plotH}
        stroke="#CFCFCF"
      />

      {/* X axis */}
      <line
        x1={leftPadding}
        x2={leftPadding + plotW}
        y1={topPadding + plotH}
        y2={topPadding + plotH}
        stroke="#CFCFCF"
      />

      {/* polyline (data line) */}
      <polyline
        points={points}
        fill="none"
        stroke={THEME_PRIMARY}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* data markers */}
      {pointsArr.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#fff" stroke={THEME_PRIMARY} strokeWidth={2.5} />
      ))}

      {/* x labels */}
      {labels.map((lab, i) => {
        const x = leftPadding + (i / (Math.max(1, labels.length - 1))) * plotW;
        const y = topPadding + plotH + 16;
        return (
          <text key={i} x={x} y={y} fontSize={11} textAnchor="middle" fill="#555">
            {lab}
          </text>
        );
      })}
    </svg>
  );
}


  function BarChart({ items = {}, height = 160, max: propMax, ticks }) {
    const keys = Object.keys(items);
    const vals = Object.values(items).map((v) => Number(v) || 0);
    let max = propMax;
    if (!max) {
      const computedMax = Math.max(...vals, 1);
      if (computedMax <= 12) max = 12; // for CGPA-like data
      else if (computedMax <= 100) max = 100; // for percentage-like data
      else max = Math.ceil(computedMax / 10) * 10;
    }

    // layout math
    const svgW = 360;
    const leftGutter = 44; // room for y-axis labels
    const rightPadding = 12;
    const barAreaWidth = svgW - leftGutter - rightPadding;
    const defaultBarWidth = Math.min(64, Math.floor(barAreaWidth / keys.length) - 12);
    const barW = Math.max(28, defaultBarWidth);
    const gap = keys.length > 1 ? Math.max(8, Math.floor((barAreaWidth - keys.length * barW) / (keys.length - 1))) : 0;

    const ticksToUse = ticks || (max === 12 ? [0, 3, 6, 9, 12] : [0, 25, 50, 75, 100]);

    return (
      <svg viewBox={`0 0 ${svgW} ${height}`} width="100%" height={height}>
        {/* y-axis grid + labels */}
        <g>
          {ticksToUse.map((t, i) => {
            const y = height - 20 - (t / max) * (height - 40);
            return (
              <g key={`tick-${i}`}>
                <line x1={leftGutter} x2={svgW - rightPadding} y1={y} y2={y} stroke="#E6E6E6" strokeDasharray="4 4" />
                <text x={leftGutter - 8} y={y + 4} fontSize={12} textAnchor="end" fill="#666">{t}</text>
              </g>
            );
          })}
        </g>

        {/* bars and x labels */}
        <g>
          {keys.map((k, i) => {
            const val = Number(items[k]) || 0;
            const h = ((val / max) * (height - 40)) || 0;
            const x = leftGutter + i * (barW + gap);
            const y = height - h - 20;
            return (
              <g key={`bar-${i}`}>
                <rect x={x} y={y} width={barW} height={h} rx={8} fill={"#9F94FF"} opacity={0.95} />
                <text x={x + barW / 2} y={height - 4} fontSize={12} textAnchor="middle" fill="#555">{k.split(" ")[0]}</text>
              </g>
            );
          })}
        </g>
      </svg>
    );
  }

  function PieChart({ data = [], size = 160 }) {
    const total = data.reduce((s, d) => s + d.pct, 0) || 1;
    let acc = 0;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 6;

    const arcs = data.map((d) => {
      const start = (acc / total) * Math.PI * 2;
      acc += d.pct;
      const end = (acc / total) * Math.PI * 2;
      const large = end - start > Math.PI ? 1 : 0;
      const x1 = cx + r * Math.cos(start - Math.PI / 2);
      const y1 = cy + r * Math.sin(start - Math.PI / 2);
      const x2 = cx + r * Math.cos(end - Math.PI / 2);
      const y2 = cy + r * Math.sin(end - Math.PI / 2);
      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
      return { path, label: d.label, pct: d.pct };
    });

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g>
          {arcs.map((a, i) => (
            <path key={i} d={a.path} fill={["#00C1A7", "#00A3FF", "#FFB664", "#FF7AA2", "#7B61FF", "#C4C4C4"][i % 6]} stroke="#fff" strokeWidth={1.5} />
          ))}
        </g>
      </svg>
    );
  }

  function AreaChart({ years = [], enrolled = [], graduated = [], height = 220 }) {
    // Enhanced AreaChart with X and Y axes, grid lines, and labels
    const w = 760;
    const h = height;
    const leftGutter = 64; // room for y-axis labels
    const bottomGutter = 44; // room for x-axis labels
    const topPadding = 12;
    const innerW = w - leftGutter - 20;
    const innerH = h - topPadding - bottomGutter;

    const allVals = [...enrolled, ...graduated];
    const max = Math.max(...allVals, 1);
    const niceMax = (() => {
      // choose a "nice" round max for ticks
      if (max <= 10) return 12;
      const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
      return Math.ceil(max / magnitude) * magnitude;
    })();

    const ticks = 4; // number of horizontal grid lines (not counting 0)
    const tickVals = Array.from({ length: ticks + 1 }, (_, i) => Math.round((niceMax * (ticks - i)) / ticks));

    function pointFor(value, i, len) {
      const x = leftGutter + (i / Math.max(1, len - 1)) * innerW;
      const y = topPadding + innerH - (value / niceMax) * innerH;
      return { x, y };
    }

    // build closed area paths
    const enrolledPts = enrolled.map((v, i) => pointFor(v, i, enrolled.length));
    const graduatedPts = graduated.map((v, i) => pointFor(v, i, graduated.length));

    const ptsToPath = (pts) => {
      if (!pts.length) return "";
      const top = pts.map((p) => `${p.x},${p.y}`).join(" ");
      const last = pts[pts.length - 1];
      const first = pts[0];
      // close the area to baseline
      return `M ${top} L ${last.x},${topPadding + innerH} L ${first.x},${topPadding + innerH} Z`;
    };

    const enrolledPath = ptsToPath(enrolledPts);
    const graduatedPath = ptsToPath(graduatedPts);

    const enrolledLine = enrolledPts.map((p) => `${p.x},${p.y}`).join(" ");
    const graduatedLine = graduatedPts.map((p) => `${p.x},${p.y}`).join(" ");

    return (
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
        <defs>
          <linearGradient id="areaEnrollGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#9F94FF" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#9F94FF" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="areaGradGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7BD389" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#7BD389" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* y-axis grid + labels */}
        <g>
          {tickVals.map((val, i) => {
            const y = topPadding + (i / ticks) * innerH;
            return (
              <g key={`yt-${i}`}>
                <line x1={leftGutter} x2={w - 12} y1={y} y2={y} stroke="#E6E6E6" strokeDasharray="4 4" />
                <text x={leftGutter - 12} y={y + 4} fontSize={12} textAnchor="end" fill="#666">{val}</text>
              </g>
            );
          })}
        </g>

        {/* enrolled area */}
        <g>
          {enrolledPath && <path d={enrolledPath} fill="url(#areaEnrollGrad)" stroke="none" />}
          {graduatedPath && <path d={graduatedPath} fill="url(#areaGradGrad)" stroke="none" />}

          {/* lines on top */}
          {enrolledLine && <polyline points={enrolledLine} fill="none" stroke="#6C63FF" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />}
          {graduatedLine && <polyline points={graduatedLine} fill="none" stroke="#4BBF7A" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />}

          {/* markers */}
          {enrolledPts.map((p, i) => (
            <circle key={`ept-${i}`} cx={p.x} cy={p.y} r={3.5} fill="#fff" stroke="#6C63FF" strokeWidth={2} />
          ))}
          {graduatedPts.map((p, i) => (
            <circle key={`gpt-${i}`} cx={p.x} cy={p.y} r={3.5} fill="#fff" stroke="#4BBF7A" strokeWidth={2} />
          ))}
        </g>

        {/* x-axis labels */}
        <g>
          {years.map((yr, i) => {
            const x = leftGutter + (i / Math.max(1, years.length - 1)) * innerW;
            const y = topPadding + innerH + 20;
            return (
              <text key={`xl-${i}`} x={x} y={y + 6} fontSize={12} textAnchor="middle" fill="#555">{yr}</text>
            );
          })}

          {/* x axis baseline */}
          <line x1={leftGutter} x2={leftGutter + innerW} y1={topPadding + innerH + 2} y2={topPadding + innerH + 2} stroke="#E6E6E6" />
        </g>

        {/* y-axis label (optional) - omitted visually; keep as a comment instead of a broken tag */}
        {/* If you want a visible y-axis label, add a properly closed <text> element here. */}
      </svg>
    );
  }

  // --- derived values --- (MOVED OUTSIDE JSX)
  const filteredDeptAttendance = useMemo(() => {
    if (selectedDept === "All Departments") return deptAttendance;
    return { [selectedDept]: deptAttendance[selectedDept] ?? 0 };
  }, [selectedDept, deptAttendance]);

  // --- render ---
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">Reports & Analytics</h1>
            <p className="mt-1 text-gray-500">Comprehensive insights into institutional performance and metrics.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-3 items-center">
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-4 py-2 rounded-lg border bg-white">
                <option>This Month</option>
                <option>Last Month</option>
                <option>Quarter</option>
                <option>Year</option>
              </select>

              <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="px-4 py-2 rounded-lg border bg-white">
                <option>All Departments</option>
                {departments.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>

              <button onClick={exportReport} title="Export All" className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
                </svg>
                Export All
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between text-sm text-gray-400">Overall Attendance <span className="text-green-500">↗</span></div>
            <div className="text-3xl font-bold mt-3">{kpis.overallAttendance.value}%</div>
            <div className="mt-2">{formatDelta(kpis.overallAttendance.delta)} <span className="text-gray-400 ml-2 text-sm">vs last month</span></div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between text-sm text-gray-400">Average CGPA <span className="text-yellow-500">★</span></div>
            <div className="text-3xl font-bold mt-3">{kpis.avgCGPA.value}</div>
            <div className="mt-2">{formatDelta(kpis.avgCGPA.delta)} <span className="text-gray-400 ml-2 text-sm">vs last month</span></div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between text-sm text-gray-400">Student Satisfaction <span className="text-blue-400">👥</span></div>
            <div className="text-3xl font-bold mt-3">{kpis.studentSatisfaction.value}%</div>
            <div className="mt-2">{formatDelta(kpis.studentSatisfaction.delta)} <span className="text-gray-400 ml-2 text-sm">vs last month</span></div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between text-sm text-gray-400">Course Completion <span className="text-purple-400">🎓</span></div>
            <div className="text-3xl font-bold mt-3">{kpis.courseCompletion.value}%</div>
            <div className="mt-2">{formatDelta(kpis.courseCompletion.delta)} <span className="text-gray-400 ml-2 text-sm">vs last month</span></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex gap-4 border-b pb-4 mb-6">
            {["Attendance", "Academic", "Enrollment", "Faculty", "Feedback"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-6 py-3 rounded-t-xl ${activeTab === t ? "bg-white border" : "bg-gray-100"}`}>
                {t}
              </button>
            ))}
          </div>

          {/* Panels */}
          {activeTab === "Attendance" && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-semibold">Attendance Trends</div>
                      <div className="text-sm text-gray-400">Monthly attendance percentages</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 border rounded" onClick={() => exportCSV("attendance.csv", [["month", "attendance"], ...months.map((m, i) => [m, attendanceSeries[i]])])}>
                        Export
                      </button>
                    </div>
                  </div>

                  <div style={{ maxWidth: 720 }}>
                    <LineChart data={attendanceSeries} labels={months} />
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-semibold">Department-wise Attendance</div>
                      <div className="text-sm text-gray-400">Attendance comparison across departments</div>
                    </div>
                    <div>
                      <button className="px-3 py-1 border rounded" onClick={() => exportCSV("dept_attendance.csv", [["department", "attendance"], ...Object.entries(deptAttendance)])}>Export</button>
                    </div>
                  </div>

                  <div>
                    <BarChart items={filteredDeptAttendance} ticks={[0,25,50,75,100]} />
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-lg border p-6">
                <div className="font-semibold mb-3">Attendance Summary by Department</div>
                <div className="space-y-4">
                  {Object.entries(deptAttendance).map(([d, pct]) => (
                    <div key={d} className="flex items-center justify-between bg-gray-50 p-4 rounded">
                      <div>
                        <div className="font-medium">{d}</div>
                        <div className="text-sm text-gray-500">{d === "Computer Science" ? "450 students" : d === "Electronics" ? "320 students" : "280 students"}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{pct}%</div>
                        <div className="text-sm text-gray-400">Attendance</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Academic" && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-semibold">Grade Distribution</div>
                      <div className="text-sm text-gray-400">Overall grade distribution across all students</div>
                    </div>
                    <div>
                      <button className="px-3 py-1 border rounded" onClick={() => exportCSV("grades.csv", [["grade", "pct"], ...gradeDistribution.map((g) => [g.label, g.pct])])}>Export</button>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <PieChart data={gradeDistribution} size={160} />
                    <div className="flex-1">
                      {gradeDistribution.map((g) => (
                        <div key={g.label} className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div style={{ width: 12, height: 12, borderRadius: 3, background: "#00C1A7" }} />
                            <div className="text-sm">{g.label}</div>
                          </div>
                          <div className="text-sm text-gray-600">{g.pct}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-semibold">Academic Performance by Department</div>
                      <div className="text-sm text-gray-400">Average CGPA across departments</div>
                    </div>
                    <div>
                      <button className="px-3 py-1 border rounded" onClick={() => exportCSV("dept_cgpa.csv", [["dept", "cgpa"], ...Object.entries(deptCGPA)])}>Export</button>
                    </div>
                  </div>

                  <div style={{ maxWidth: 360 }}>
                    <BarChart items={deptCGPA} height={200} max={12} ticks={[0,3,6,9,12]} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Enrollment" && (
            <div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold">Enrollment & Graduation Trends</div>
                    <div className="text-sm text-gray-400">Year-over-year enrollment and graduation statistics</div>
                  </div>
                  <div>
                    <button className="px-3 py-1 border rounded" onClick={() => exportCSV("enrollment.csv", [["year", "enrolled", "graduated"], ...enrollmentTrend.years.map((y, i) => [y, enrollmentTrend.enrolled[i], enrollmentTrend.graduated[i]])])}>Export</button>
                  </div>
                </div>

                <div style={{ height: 300 }}>
                  <AreaChart years={enrollmentTrend.years} enrolled={enrollmentTrend.enrolled} graduated={enrollmentTrend.graduated} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "Faculty" && (
            <div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold">Faculty Workload Analysis</div>
                    <div className="text-sm text-gray-400">Teaching hours and student load per faculty member</div>
                  </div>
                  <div>
                    <button className="px-3 py-1 border rounded" onClick={() => exportCSV("faculty_load.csv", [["name", "classes", "students", "hrs"], ...faculty.map((f) => [f.name, f.classes, f.students, f.hrs])])}>Export</button>
                  </div>
                </div>

                <div className="space-y-4">
                  {faculty.map((f) => (
                    <div key={f.id} className="bg-white border rounded p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{f.name}</div>
                        <div className="text-sm text-gray-500">Classes: {f.classes} • Students: {f.students}</div>
                      </div>
                      <div className="w-48 text-right">
                        <div className="text-sm text-gray-400 mb-1">{f.hrs} hrs/week</div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div style={{ width: `${Math.min(100, (f.hrs / 20) * 100)}%` }} className="h-full bg-gray-900" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Feedback" && (
            <div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold">Course Feedback Summary</div>
                    <div className="text-sm text-gray-400">Student feedback ratings for courses</div>
                  </div>
                  <div>
                    <button className="px-3 py-1 border rounded" onClick={() => exportCSV("feedback.csv", [["course", "responses", "rating"], ...feedback.map((f) => [f.course, f.responses, f.rating])])}>Export</button>
                  </div>
                </div>

                <div className="space-y-3">
                  {feedback.map((f) => (
                    <div key={f.course} className="bg-white border rounded p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{f.course}</div>
                        <div className="text-sm text-gray-500">{f.responses} responses</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-yellow-500 font-semibold">★ {f.rating.toFixed(1)}</div>
                        <div className="h-3 w-48 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-900" style={{ width: `${(f.rating / 5) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-500">Built with React + Tailwind — replace sample data with your API responses as needed.</div>
      </div>

      {/* floating export button */}
      <div className="fixed bottom-6 right-6">
        <button onClick={exportReport} className="px-4 py-3 rounded-lg shadow-lg bg-white border">
          Export All
        </button>
      </div>
    </div>
  );
}
