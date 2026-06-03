import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useHabitStore } from "@/lib/store";
import { daysInMonth, fmtDate } from "@/lib/habit-utils";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/calendar")({
  component: CalendarPage,
});

function CalendarPage() {
  const { habits, entries } = useHabitStore();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const data = useMemo(() => {
    const total = daysInMonth(year, month);
    const firstDow = new Date(year, month, 1).getDay();
    const cells: { day: number | null; done: number; pct: number }[] = [];
    for (let i = 0; i < firstDow; i++) cells.push({ day: null, done: 0, pct: 0 });
    for (let d = 1; d <= total; d++) {
      const k = fmtDate(new Date(year, month, d));
      let done = 0;
      for (const h of habits) if (entries[h.id]?.[k] === "completed") done++;
      cells.push({
        day: d,
        done,
        pct: habits.length ? done / habits.length : 0,
      });
    }
    return cells;
  }, [year, month, habits, entries]);

  const monthLabel = new Date(year, month, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const intensity = (pct: number) => {
    if (pct === 0) return "bg-card/60 border-border";
    if (pct < 0.25) return "bg-primary/15 border-primary/30";
    if (pct < 0.5) return "bg-primary/30 border-primary/50";
    if (pct < 0.75) return "bg-primary/55 border-primary/70";
    return "bg-primary border-primary glow-primary";
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Heatmap of daily completion across {monthLabel}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const d = new Date(year, month - 1, 1);
              setYear(d.getFullYear());
              setMonth(d.getMonth());
            }}
            className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent"
          >
            ←
          </button>
          <span className="text-sm font-medium px-2">{monthLabel}</span>
          <button
            onClick={() => {
              const d = new Date(year, month + 1, 1);
              setYear(d.getFullYear());
              setMonth(d.getMonth());
            }}
            className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent"
          >
            →
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated p-5"
      >
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {data.map((c, i) =>
            c.day === null ? (
              <div key={`x${i}`} />
            ) : (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.005 }}
                className={cn(
                  "aspect-square rounded-lg border p-2 flex flex-col justify-between transition hover:scale-[1.04]",
                  intensity(c.pct),
                )}
                title={`${c.day}: ${c.done}/${habits.length} habits`}
              >
                <span className="text-xs font-medium">{c.day}</span>
                <span className="text-[10px] opacity-90 self-end">
                  {c.done}/{habits.length}
                </span>
              </motion.div>
            ),
          )}
        </div>

        <div className="flex items-center gap-2 mt-5 text-xs text-muted-foreground">
          <span>Less</span>
          {[0, 0.2, 0.4, 0.7, 1].map((v, i) => (
            <span
              key={i}
              className={cn("h-3 w-5 rounded-sm border", intensity(v))}
            />
          ))}
          <span>More</span>
        </div>
      </motion.div>
    </div>
  );
}
