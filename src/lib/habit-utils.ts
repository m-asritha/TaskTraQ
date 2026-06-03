import type { Entries, Habit } from "./store";

export const fmtDate = (d: Date) => d.toISOString().slice(0, 10);

export function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function habitCompletionRate(entries: Entries, habit: Habit, year: number, month: number) {
  const total = daysInMonth(year, month);
  const days = entries[habit.id] ?? {};
  let done = 0;
  for (let i = 1; i <= total; i++) {
    const k = fmtDate(new Date(year, month, i));
    if (days[k] === "completed") done++;
  }
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function currentStreak(entries: Entries, habit: Habit) {
  const days = entries[habit.id] ?? {};
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const k = fmtDate(d);
    if (days[k] === "completed") streak++;
    else if (i === 0 && !days[k]) continue; // today not done yet — don't break
    else break;
  }
  return streak;
}

export function bestStreak(entries: Entries, habit: Habit) {
  const days = entries[habit.id] ?? {};
  const keys = Object.keys(days).filter((k) => days[k] === "completed").sort();
  let best = 0;
  let cur = 0;
  let prev: Date | null = null;
  for (const k of keys) {
    const d = new Date(k);
    if (prev && (d.getTime() - prev.getTime()) / 86400000 === 1) cur++;
    else cur = 1;
    if (cur > best) best = cur;
    prev = d;
  }
  return best;
}

export function dailyCompletionForMonth(
  entries: Entries,
  habits: Habit[],
  year: number,
  month: number,
) {
  const total = daysInMonth(year, month);
  const out: { day: number; pct: number; done: number }[] = [];
  for (let i = 1; i <= total; i++) {
    const k = fmtDate(new Date(year, month, i));
    let done = 0;
    for (const h of habits) if (entries[h.id]?.[k] === "completed") done++;
    out.push({
      day: i,
      done,
      pct: habits.length ? Math.round((done / habits.length) * 100) : 0,
    });
  }
  return out;
}

export function weeksOfMonth(year: number, month: number) {
  const total = daysInMonth(year, month);
  const weeks: { label: string; days: number[] }[] = [];
  let cur: number[] = [];
  let wi = 1;
  for (let i = 1; i <= total; i++) {
    cur.push(i);
    if (cur.length === 7 || i === total) {
      weeks.push({ label: `Week ${wi++}`, days: cur });
      cur = [];
    }
  }
  return weeks;
}
