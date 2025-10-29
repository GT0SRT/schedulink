import create from "zustand";

const useScheduleStore = create((set, get) => ({
  schedules: {}, // { "Computer Science": [periods...], ... }
  loading: false,
  error: null,

  setSchedules: (s) => set({ schedules: s }),

  fetchSchedules: async (departments = [], days = []) => {
    set({ loading: true, error: null });
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "";
      const result = {};

      for (const dept of departments) {
        result[dept] = [];
        for (const day of days) {
          const url = `${API_BASE}/api/timetable/${encodeURIComponent(dept)}/${encodeURIComponent(day)}/periods`;
          const res = await fetch(url, { credentials: "include" });
          if (!res.ok) {
            const text = await res.text().catch(() => res.statusText);
            throw new Error(`Failed to fetch ${dept} ${day}: ${res.status} ${text}`);
          }
          const data = await res.json().catch(() => []);
          if (Array.isArray(data)) result[dept] = result[dept].concat(data);
        }
      }

      set({ schedules: result, loading: false });
      return result;
    } catch (err) {
      set({ error: err.message || String(err), loading: false });
      throw err;
    }
  },

  addPeriod: async (department, period) => {
    // Posts to /api/timetable/:className/:day/period and updates store
    set({ loading: true, error: null });
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "";
      const url = `${API_BASE}/api/timetable/${encodeURIComponent(department)}/${encodeURIComponent(period.day)}/period`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          time: period.time,
          subject: period.subject,
          room: period.room,
          teacher: period.teacher,
          color: period.color,
        }),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text || res.statusText);

      let saved;
      try {
        saved = JSON.parse(text);
      } catch {
        saved = { ...period, _serverResponse: text };
      }

      set((state) => {
        const prev = state.schedules || {};
        const list = prev[department] ? [...prev[department], saved] : [saved];
        return { schedules: { ...prev, [department]: list }, loading: false };
      });

      return saved;
    } catch (err) {
      set({ error: err.message || String(err), loading: false });
      throw err;
    }
  },
}));

export default useScheduleStore;