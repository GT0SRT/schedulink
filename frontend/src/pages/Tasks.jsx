import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Clock,
  CheckCircle2,
  Flag,
  CalendarDays,
  Trash2,
  Edit3,
} from "lucide-react";

/** THEME */
const THEME = { primary: "#2C3E86", accent: "#3D57BB" };

/** Utility to apply alpha to a hex color */
function withAlpha(hex, alpha = 1) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const TINTS = {
  subtle: `linear-gradient(135deg, ${withAlpha(THEME.accent, 0.08)}, ${withAlpha(THEME.primary, 0.08)})`,
  mid: `linear-gradient(135deg, ${withAlpha(THEME.accent, 0.14)}, ${withAlpha(THEME.primary, 0.14)})`,
};

const STATUS = {
  todo: { label: "To‑Do", icon: Clock, chip: { bg: withAlpha(THEME.accent, 0.14), text: THEME.accent, ring: withAlpha(THEME.accent, 0.35) } },
  doing: { label: "In Progress", icon: Flag, chip: { bg: withAlpha(THEME.primary, 0.16), text: THEME.primary, ring: withAlpha(THEME.primary, 0.35) } },
  done: { label: "Done", icon: CheckCircle2, chip: { bg: withAlpha("#22c55e", 0.16), text: "#16a34a", ring: withAlpha("#22c55e", 0.35) } },
};

const PRIORITY = {
  low: { label: "Low", dot: withAlpha(THEME.accent, 0.9), bg: withAlpha(THEME.accent, 0.1) },
  medium: { label: "Medium", dot: withAlpha("#f59e0b", 0.9), bg: withAlpha("#f59e0b", 0.1) },
  high: { label: "High", dot: withAlpha("#ef4444", 0.9), bg: withAlpha("#ef4444", 0.1) },
};

const sampleTasks = [
  { id: "t-01", title: "Wire the DB models for classes", desc: "Create schema for Course, Slot, Room, Faculty, and Timetable.", status: "todo", priority: "high", due: "2025-09-09", assignee: "MDV" },
  { id: "t-02", title: "Design ‘Create Task’ modal", desc: "Match Figma: rounded 2xl, soft shadow, theme tint.", status: "doing", priority: "medium", due: "2025-09-08", assignee: "Riya" },
  { id: "t-03", title: "Implement drag & drop between columns", desc: "Column reorder + smooth spring animations.", status: "todo", priority: "medium", due: "2025-09-12", assignee: "Aman" },
  { id: "t-04", title: "API: auth + role guards", desc: "JWT + roles (student, faculty, admin).", status: "done", priority: "high", due: "2025-09-05", assignee: "Zoya" },
];

function Chip({ children, style }) {
  return <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1" style={style}>{children}</span>;
}

function PriorityPill({ level, onChange }) {
  const p = PRIORITY[level] ?? PRIORITY.low;
  return (
    <select
      value={level}
      onChange={(e) => onChange?.(e.target.value)}
      className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ background: p.bg }}
    >
      {Object.keys(PRIORITY).map((k) => (
        <option key={k} value={k}>{PRIORITY[k].label}</option>
      ))}
    </select>
  );
}

function TaskCard({ task, onEdit, onDelete, onToggleStatus, editable, onChange, isDone }) {
  const S = STATUS[task.status] ?? STATUS.todo;
  const Icon = S.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group rounded-2xl p-4 shadow-sm ring-1 ring-black/5"
      style={{ background: TINTS.subtle }}
    >
      <div className="flex flex-col gap-2">
        {editable ? (
          <>
            <input
              className="border px-2 py-1 rounded"
              placeholder="Title"
              value={task.title}
              onChange={(e) => onChange({ ...task, title: e.target.value })}
            />
            <textarea
              className="border px-2 py-1 rounded"
              placeholder="Description"
              value={task.desc}
              onChange={(e) => onChange({ ...task, desc: e.target.value })}
            />
            <div className="flex gap-2 items-center">
              <PriorityPill level={task.priority} onChange={(p) => onChange({ ...task, priority: p })} />
              <input
                type="date"
                value={task.due}
                onChange={(e) => onChange({ ...task, due: e.target.value })}
                className="border px-2 py-1 rounded text-sm"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => onEdit?.(task)} className="px-3 py-1 rounded bg-green-500 text-white">Save</button>
              <button onClick={() => onDelete?.()} className="px-3 py-1 rounded bg-red-500 text-white">Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <h3 className="truncate text-base font-semibold text-gray-900">{task.title}</h3>
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => onChange?.({ ...task, _edit: true })} className="rounded-xl p-2 hover:bg-black/5" title="Edit">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button onClick={() => onDelete?.(task.id)} className="rounded-xl p-2 hover:bg-black/5" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-600">{task.desc}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Chip style={{ background: S.chip.bg, color: S.chip.text, boxShadow: `0 0 0 1px ${S.chip.ring} inset` }}>
                <Icon className="h-3.5 w-3.5" /> {S.label}
              </Chip>
              <PriorityPill level={task.priority} />
              {task.due && (
                <Chip style={{ background: withAlpha("#0ea5e9", 0.12), color: "#0369a1", boxShadow: `0 0 0 1px ${withAlpha("#0ea5e9", 0.28)} inset` }}>
                  <CalendarDays className="h-3.5 w-3.5" /> {new Date(task.due).toDateString()}
                </Chip>
              )}
              <button
                onClick={() => isDone ? onDelete?.(task.id) : onToggleStatus?.(task.id)}
                className="ml-auto rounded-xl px-3 py-1.5 text-sm font-semibold text-white shadow-sm"
                style={{ background: `linear-gradient(135deg, ${THEME.accent}, ${THEME.primary})` }}
              >
                {isDone ? "Delete" : "Advance"}
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

function Column({ title, count, children }) {
  return (
    <div className="space-y-3 rounded-2xl p-4 ring-1 ring-black/5" style={{ background: TINTS.mid }}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-wide text-gray-800 uppercase">{title}</h2>
        <span className="rounded-full bg-white/60 px-2 py-0.5 text-xs font-semibold text-gray-700 ring-1 ring-black/5">{count}</span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default function Tasks() {
  const [tasks, setTasks] = useState(sampleTasks);
  const [query, setQuery] = useState("");
  const [newTask, setNewTask] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) => t.title.toLowerCase().includes(q) || t.desc?.toLowerCase().includes(q));
  }, [tasks, query]);

  const byStatus = useMemo(() => ({
    todo: filtered.filter((t) => t.status === "todo"),
    doing: filtered.filter((t) => t.status === "doing"),
    done: filtered.filter((t) => t.status === "done"),
  }), [filtered]);

  function advanceStatus(id) {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        const order = ["todo", "doing", "done"];
        const i = order.indexOf(t.status);
        return { ...t, status: order[(i + 1) % order.length] };
      })
    );
  }

  function startNewTask() {
    setNewTask({ id: Date.now(), title: "", desc: "", priority: "low", status: "todo", due: "" });
  }

  function saveNewTask(task) {
    setTasks(prev => [task, ...prev]);
    setNewTask(null);
  }

  function cancelNewTask() {
    setNewTask(null);
  }

  function handleDelete(id) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  function updateTask(task) {
    setTasks(prev => prev.map(t => t.id === task.id ? { ...task, _edit: false } : t));
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-2xl font-extrabold" style={{ color: THEME.primary }}>Tasks</div>
        <div className="ml-auto flex items-center gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-64 rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:ring-2"
            style={{ boxShadow: `0 0 0 2px ${withAlpha(THEME.accent, 0.0)}` }}
          />
          <button
            onClick={startNewTask}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white shadow-md"
            style={{ background: `linear-gradient(135deg, ${THEME.accent}, ${THEME.primary})` }}
          >
            <Plus className="h-4 w-4" /> New Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Column title="To‑Do" count={byStatus.todo.length + (newTask ? 1 : 0)}>
          {newTask && (
            <TaskCard
              task={newTask}
              editable
              onEdit={saveNewTask}
              onDelete={cancelNewTask}
              onChange={setNewTask}
            />
          )}
          {byStatus.todo.map(t => (
            <TaskCard
              key={t.id}
              task={t}
              onToggleStatus={advanceStatus}
              onDelete={() => handleDelete(t.id)}
              editable={t._edit}
              onChange={updateTask}
            />
          ))}
        </Column>

        <Column title="In Progress" count={byStatus.doing.length}>
          {byStatus.doing.map(t => (
            <TaskCard
              key={t.id}
              task={t}
              onToggleStatus={advanceStatus}
              onDelete={() => handleDelete(t.id)}
              editable={t._edit}
              onChange={updateTask}
            />
          ))}
        </Column>

        <Column title="Done" count={byStatus.done.length}>
          {byStatus.done.map(t => (
            <TaskCard
              key={t.id}
              task={t}
              onToggleStatus={advanceStatus}
              onDelete={() => handleDelete(t.id)}
              isDone={true}
              editable={t._edit}
              onChange={updateTask}
            />
          ))}
        </Column>
      </div>
    </div>
  );
}
