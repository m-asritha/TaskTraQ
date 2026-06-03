import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CellState = "completed" | "missed" | "pending";

export interface Habit {
  id: string;
  name: string;
  emoji?: string;
  createdAt: string;
}

// entries[habitId][YYYY-MM-DD] = "completed" | "missed"
export type Entries = Record<string, Record<string, "completed" | "missed">>;

interface Profile {
  name: string;
  email: string;
  joinDate: string;
}

interface HabitState {
  habits: Habit[];
  entries: Entries;
  profile: Profile;
  addHabit: (name: string, emoji?: string) => void;
  removeHabit: (id: string) => void;
  renameHabit: (id: string, name: string) => void;
  toggleCell: (habitId: string, dateKey: string) => void;
  setCell: (habitId: string, dateKey: string, state: CellState) => void;
  resetMonth: (yyyyMm: string) => void;
  importData: (data: { habits: Habit[]; entries: Entries }) => void;
  updateProfile: (p: Partial<Profile>) => void;
}

const seedHabits: Habit[] = [
  { id: "h1", name: "Exercise", emoji: "💪", createdAt: new Date().toISOString() },
  { id: "h2", name: "Read 20 pages", emoji: "📖", createdAt: new Date().toISOString() },
  { id: "h3", name: "Meditate", emoji: "🧘", createdAt: new Date().toISOString() },
  { id: "h4", name: "Drink water", emoji: "💧", createdAt: new Date().toISOString() },
  { id: "h5", name: "Sleep 7h", emoji: "😴", createdAt: new Date().toISOString() },
];

function seedEntries(): Entries {
  const e: Entries = {};
  const today = new Date();
  for (const h of seedHabits) {
    e[h.id] = {};
    for (let i = 1; i <= 18; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), i);
      const k = d.toISOString().slice(0, 10);
      const r = Math.random();
      if (r > 0.25) e[h.id][k] = "completed";
      else if (r > 0.1) e[h.id][k] = "missed";
    }
  }
  return e;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: seedHabits,
      entries: seedEntries(),
      profile: {
        name: "Alex Morgan",
        email: "alex@tasktraq.app",
        joinDate: new Date().toISOString(),
      },
      addHabit: (name, emoji) =>
        set((s) => {
          if (s.habits.length >= 25) return s;
          const id = crypto.randomUUID();
          return {
            habits: [...s.habits, { id, name, emoji, createdAt: new Date().toISOString() }],
            entries: { ...s.entries, [id]: {} },
          };
        }),
      removeHabit: (id) =>
        set((s) => {
          const { [id]: _, ...rest } = s.entries;
          return { habits: s.habits.filter((h) => h.id !== id), entries: rest };
        }),
      renameHabit: (id, name) =>
        set((s) => ({
          habits: s.habits.map((h) => (h.id === id ? { ...h, name } : h)),
        })),
      toggleCell: (habitId, dateKey) =>
        set((s) => {
          const cur = s.entries[habitId]?.[dateKey];
          const next: "completed" | "missed" | undefined =
            cur === "completed" ? "missed" : cur === "missed" ? undefined : "completed";
          const habitEntries = { ...(s.entries[habitId] ?? {}) };
          if (next) habitEntries[dateKey] = next;
          else delete habitEntries[dateKey];
          return { entries: { ...s.entries, [habitId]: habitEntries } };
        }),
      setCell: (habitId, dateKey, state) =>
        set((s) => {
          const habitEntries = { ...(s.entries[habitId] ?? {}) };
          if (state === "pending") delete habitEntries[dateKey];
          else habitEntries[dateKey] = state;
          return { entries: { ...s.entries, [habitId]: habitEntries } };
        }),
      resetMonth: (yyyyMm) =>
        set((s) => {
          const next: Entries = {};
          for (const [hid, days] of Object.entries(s.entries)) {
            next[hid] = {};
            for (const [k, v] of Object.entries(days)) {
              if (!k.startsWith(yyyyMm)) next[hid][k] = v;
            }
          }
          return { entries: next };
        }),
      importData: (data) => set({ habits: data.habits, entries: data.entries }),
      updateProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
    }),
    { name: "tasktraq-store" },
  ),
);
