import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ListChecks,
  CheckCircle2,
  Flame,
  Trophy,
  Percent,
  Sparkles,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { StatCard } from "@/components/StatCard";
import { useHabitStore } from "@/lib/store";
import {
  bestStreak,
  currentStreak,
  dailyCompletionForMonth,
  fmtDate,
  habitCompletionRate,
  weeksOfMonth,
} from "@/lib/habit-utils";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const habits = useHabitStore((s) => s.habits);
  const entries = useHabitStore((s) => s.entries);

  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const todayKey = fmtDate(now);

  const completedToday = habits.filter((h) => entries[h.id]?.[todayKey] === "completed").length;
  const streaks = habits.map((h) => currentStreak(entries, h));
  const bests = habits.map((h) => bestStreak(entries, h));
  const curStreak = streaks.length ? Math.max(...streaks) : 0;
  const best = bests.length ? Math.max(...bests) : 0;

  const rates = habits.map((h) => habitCompletionRate(entries, h, y, m));
  const avg = rates.length
    ? Math.round(rates.reduce((a, b) => a + b.pct, 0) / rates.length)
    : 0;
  const monthlyScore = Math.min(
    100,
    avg + Math.round((curStreak / Math.max(1, habits.length * 7)) * 20),
  );

  const daily = dailyCompletionForMonth(entries, habits, y, m);

  const weeks = weeksOfMonth(y, m).map((w, i) => {
    let done = 0;
    let total = 0;
    for (const d of w.days) {
      const k = fmtDate(new Date(y, m, d));
      for (const h of habits) {
        total++;
        if (entries[h.id]?.[k] === "completed") done++;
      }
    }
    return { name: `W${i + 1}`, pct: total ? Math.round((done / total) * 100) : 0 };
  });

  const totalPossible = habits.length * new Date(y, m + 1, 0).getDate();
  const totalDone = daily.reduce((a, b) => a + b.done, 0);
  const ring = [
    { name: "Done", value: totalDone },
    { name: "Remaining", value: Math.max(0, totalPossible - totalDone) },
  ];

  const top = habits
    .map((h, i) => ({ habit: h, pct: rates[i].pct, streak: streaks[i] }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 10);

  const insights = [
    `You completed ${avg}% of your habits this month.`,
    top[0] && top[0].streak > 0
      ? `Your "${top[0].habit.name}" habit has a ${top[0].streak}-day streak.`
      : "Start a streak today — pick one habit and complete it.",
    completedToday >= habits.length / 2
      ? "Great pace today — you're past the halfway mark."
      : "Show up for at least 3 habits today to stay on track.",
  ].filter(Boolean);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Good day to show up.</h1>
          <p className="text-muted-foreground mt-1">
            {now.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="text-foreground font-medium">{completedToday}</span> of{" "}
          <span className="text-foreground font-medium">{habits.length}</span> habits done today
        </div>
      </motion.div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total Habits" value={habits.length} icon={ListChecks} delay={0.02} />
        <StatCard
          label="Completed Today"
          value={completedToday}
          icon={CheckCircle2}
          accent="success"
          delay={0.06}
        />
        <StatCard
          label="Current Streak"
          value={`${curStreak}d`}
          icon={Flame}
          accent="warning"
          delay={0.1}
        />
        <StatCard label="Best Streak" value={`${best}d`} icon={Trophy} delay={0.14} />
        <StatCard
          label="Completion Rate"
          value={`${avg}%`}
          icon={Percent}
          accent="success"
          delay={0.18}
        />
        <StatCard
          label="Monthly Score"
          value={monthlyScore}
          icon={Sparkles}
          accent="primary"
          delay={0.22}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-5 lg:col-span-2"
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Daily Consistency</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daily}>
                <CartesianGrid stroke="oklch(0.32 0.03 260 / 0.4)" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="oklch(0.7 0.025 255)" fontSize={11} />
                <YAxis stroke="oklch(0.7 0.025 255)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.235 0.03 260)",
                    border: "1px solid oklch(0.32 0.03 260)",
                    borderRadius: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="pct"
                  stroke="oklch(0.62 0.19 280)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="card-elevated p-5"
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Monthly Progress</h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ring}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="oklch(0.62 0.19 280)" />
                  <Cell fill="oklch(0.32 0.03 260)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="text-center">
                <div className="text-3xl font-semibold">
                  {totalPossible ? Math.round((totalDone / totalPossible) * 100) : 0}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {totalDone}/{totalPossible}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="card-elevated p-5"
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Weekly Performance</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeks}>
                <CartesianGrid stroke="oklch(0.32 0.03 260 / 0.4)" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="oklch(0.7 0.025 255)" fontSize={11} />
                <YAxis stroke="oklch(0.7 0.025 255)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.235 0.03 260)",
                    border: "1px solid oklch(0.32 0.03 260)",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="pct" fill="oklch(0.62 0.19 280)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="card-elevated p-5 lg:col-span-2"
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Top Habits</h3>
          <div className="space-y-2">
            {top.length === 0 && (
              <p className="text-sm text-muted-foreground">No habits yet — add one to begin.</p>
            )}
            {top.map((t, i) => (
              <div
                key={t.habit.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/30 transition"
              >
                <div className="w-6 text-xs text-muted-foreground tabular-nums">#{i + 1}</div>
                <div className="text-lg">{t.habit.emoji ?? "•"}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{t.habit.name}</div>
                  <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary-glow"
                      style={{ width: `${t.pct}%` }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-medium tabular-nums">{t.pct}%</div>
                  <div className="text-xs text-warning tabular-nums">🔥 {t.streak}d</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="card-elevated p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Smart Insights</h3>
        </div>
        <ul className="grid sm:grid-cols-3 gap-3">
          {insights.map((t, i) => (
            <li
              key={i}
              className="text-sm p-3 rounded-lg bg-accent/30 border border-border/50"
            >
              {t}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
