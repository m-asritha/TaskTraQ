import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, X, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import { useHabitStore, type CellState } from "@/lib/store";
import {
  bestStreak,
  currentStreak,
  daysInMonth,
  fmtDate,
  habitCompletionRate,
  weeksOfMonth,
} from "@/lib/habit-utils";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/habits")({
  component: HabitsPage,
});

function HabitsPage() {
  const { habits, entries, addHabit, removeHabit, toggleCell } = useHabitStore();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("✨");
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const total = daysInMonth(year, month);
  const weeks = useMemo(() => weeksOfMonth(year, month), [year, month]);
  const monthLabel = new Date(year, month, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const cellState = (hid: string, day: number): CellState => {
    const k = fmtDate(new Date(year, month, day));
    const v = entries[hid]?.[k];
    return v ?? "pending";
  };

  const cellStyles: Record<CellState, string> = {
    completed: "bg-success/20 text-success border-success/40",
    missed: "bg-destructive/20 text-destructive border-destructive/40",
    pending: "bg-card/50 text-muted-foreground/40 border-border hover:border-primary/50",
  };

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Habit Tracker</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Click a cell to toggle: pending → done → missed.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(2000, i, 1).toLocaleDateString(undefined, { month: "long" })}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm"
          >
            {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add habit */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated p-4 flex flex-wrap items-center gap-2"
      >
        <input
          value={newEmoji}
          onChange={(e) => setNewEmoji(e.target.value.slice(0, 2))}
          className="w-14 text-center bg-background border border-border rounded-lg py-2"
        />
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New habit name…"
          className="flex-1 min-w-[200px] bg-background border border-border rounded-lg px-3 py-2 text-sm"
        />
        <button
          disabled={!newName.trim() || habits.length >= 25}
          onClick={() => {
            addHabit(newName.trim(), newEmoji);
            setNewName("");
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition glow-primary"
        >
          <Plus className="h-4 w-4" />
          Add Habit
        </button>
        <span className="text-xs text-muted-foreground ml-auto">
          {habits.length}/25 habits — {monthLabel}
        </span>
      </motion.div>

      {/* Grid card */}
      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-card/95 backdrop-blur z-10">
              <tr className="text-left">
                <th className="sticky left-0 z-20 bg-card/95 backdrop-blur px-4 py-3 font-medium text-muted-foreground border-b border-border min-w-[220px]">
                  Habit
                </th>
                {weeks.map((w, wi) => (
                  <th
                    key={wi}
                    colSpan={collapsed[wi] ? 1 : w.days.length}
                    className="px-2 py-2 text-center border-b border-l border-border font-medium text-muted-foreground"
                  >
                    <button
                      onClick={() =>
                        setCollapsed((c) => ({ ...c, [wi]: !c[wi] }))
                      }
                      className="inline-flex items-center gap-1 hover:text-foreground"
                    >
                      {w.label}
                      {collapsed[wi] ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronUp className="h-3 w-3" />
                      )}
                    </button>
                  </th>
                ))}
                <th className="px-3 py-3 text-center border-b border-l border-border font-medium text-muted-foreground">
                  %
                </th>
                <th className="px-3 py-3 text-center border-b border-l border-border font-medium text-muted-foreground">
                  🔥
                </th>
                <th className="px-3 py-3 text-center border-b border-l border-border font-medium text-muted-foreground">
                  Best
                </th>
                <th className="px-3 py-3 text-center border-b border-l border-border font-medium text-muted-foreground">
                  ✕
                </th>
                <th className="px-2 py-3 border-b border-l border-border" />
              </tr>
              <tr className="text-[10px] text-muted-foreground/70">
                <th className="sticky left-0 z-20 bg-card/95 backdrop-blur border-b border-border" />
                {weeks.map((w, wi) =>
                  collapsed[wi] ? (
                    <th
                      key={wi}
                      className="border-b border-l border-border px-2 py-1 text-center"
                    >
                      …
                    </th>
                  ) : (
                    w.days.map((d) => (
                      <th
                        key={`${wi}-${d}`}
                        className="border-b border-border px-1 py-1 text-center font-normal"
                      >
                        {d}
                      </th>
                    ))
                  ),
                )}
                <th colSpan={5} className="border-b border-border" />
              </tr>
            </thead>
            <tbody>
              {habits.map((h, ri) => {
                const rate = habitCompletionRate(entries, h, year, month);
                const cs = currentStreak(entries, h);
                const bs = bestStreak(entries, h);
                const missed = Array.from({ length: total }).filter((_, i) => {
                  const k = fmtDate(new Date(year, month, i + 1));
                  return entries[h.id]?.[k] === "missed";
                }).length;
                return (
                  <tr key={h.id} className="hover:bg-accent/20 transition-colors">
                    <td className="sticky left-0 z-10 bg-card/90 backdrop-blur px-4 py-2 border-b border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{h.emoji ?? "•"}</span>
                        <span className="font-medium truncate">{h.name}</span>
                      </div>
                    </td>
                    {weeks.map((w, wi) =>
                      collapsed[wi] ? (
                        <td
                          key={wi}
                          className="border-b border-l border-border text-center px-2 py-2 text-xs text-muted-foreground"
                        >
                          {
                            w.days.filter(
                              (d) => cellState(h.id, d) === "completed",
                            ).length
                          }
                          /{w.days.length}
                        </td>
                      ) : (
                        w.days.map((d) => {
                          const state = cellState(h.id, d);
                          return (
                            <td
                              key={`${wi}-${d}`}
                              className="border-b border-border p-0.5 text-center"
                            >
                              <button
                                onClick={() =>
                                  toggleCell(h.id, fmtDate(new Date(year, month, d)))
                                }
                                className={cn(
                                  "h-7 w-7 rounded-md border grid place-items-center transition mx-auto",
                                  cellStyles[state],
                                )}
                              >
                                {state === "completed" && <Check className="h-3.5 w-3.5" />}
                                {state === "missed" && <X className="h-3.5 w-3.5" />}
                              </button>
                            </td>
                          );
                        })
                      ),
                    )}
                    <td className="border-b border-l border-border text-center px-3 py-2 tabular-nums">
                      {rate.pct}%
                    </td>
                    <td className="border-b border-l border-border text-center px-3 py-2 tabular-nums text-warning">
                      {cs}
                    </td>
                    <td className="border-b border-l border-border text-center px-3 py-2 tabular-nums">
                      {bs}
                    </td>
                    <td className="border-b border-l border-border text-center px-3 py-2 tabular-nums text-destructive">
                      {missed}
                    </td>
                    <td className="border-b border-l border-border text-center px-2 py-2">
                      <button
                        onClick={() => removeHabit(h.id)}
                        className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition"
                        aria-label="Remove habit"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {habits.length === 0 && (
                <tr>
                  <td colSpan={99} className="text-center py-10 text-muted-foreground">
                    No habits yet. Add one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
