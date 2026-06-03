import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useHabitStore } from "@/lib/store";
import {
  bestStreak,
  currentStreak,
  dailyCompletionForMonth,
  habitCompletionRate,
} from "@/lib/habit-utils";

export const Route = createFileRoute("/_app/analytics")({
  component: AnalyticsPage,
});

const palette = [
  "oklch(0.62 0.19 280)",
  "oklch(0.72 0.18 150)",
  "oklch(0.78 0.16 75)",
  "oklch(0.65 0.23 25)",
  "oklch(0.72 0.22 295)",
];

function AnalyticsPage() {
  const { habits, entries } = useHabitStore();
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  const trend = dailyCompletionForMonth(entries, habits, y, m);
  const rates = habits.map((h) => ({
    name: h.name,
    pct: habitCompletionRate(entries, h, y, m).pct,
    streak: currentStreak(entries, h),
    best: bestStreak(entries, h),
  }));

  const pie = rates.slice(0, 5).map((r) => ({ name: r.name, value: Math.max(1, r.pct) }));
  const streakArea = rates
    .slice()
    .sort((a, b) => b.best - a.best)
    .map((r) => ({ name: r.name, best: r.best, current: r.streak }));

  const top = [...rates].sort((a, b) => b.pct - a.pct).slice(0, 5);
  const weak = [...rates].sort((a, b) => a.pct - b.pct).slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Deep dive into your monthly performance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-5"
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Completion Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
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
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-elevated p-5"
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Habit Success Rate</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  stroke="none"
                >
                  {pie.map((_, i) => (
                    <Cell key={i} fill={palette[i % palette.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.235 0.03 260)",
                    border: "1px solid oklch(0.32 0.03 260)",
                    borderRadius: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-5 lg:col-span-2"
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Streak Analysis</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={streakArea}>
                <defs>
                  <linearGradient id="best" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.19 280)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="oklch(0.62 0.19 280)" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="cur" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.18 150)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="oklch(0.72 0.18 150)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="best"
                  stroke="oklch(0.62 0.19 280)"
                  fill="url(#best)"
                />
                <Area
                  type="monotone"
                  dataKey="current"
                  stroke="oklch(0.72 0.18 150)"
                  fill="url(#cur)"
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-elevated p-5"
        >
          <h3 className="text-sm font-medium text-success mb-3">Most Consistent</h3>
          <ol className="space-y-2 text-sm">
            {top.map((r, i) => (
              <li
                key={r.name}
                className="flex items-center justify-between p-2 rounded-md bg-success/10"
              >
                <span>
                  <span className="text-muted-foreground mr-2">#{i + 1}</span>
                  {r.name}
                </span>
                <span className="tabular-nums font-medium">{r.pct}%</span>
              </li>
            ))}
          </ol>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-5"
        >
          <h3 className="text-sm font-medium text-destructive mb-3">Needs Improvement</h3>
          <ol className="space-y-2 text-sm">
            {weak.map((r) => (
              <li
                key={r.name}
                className="flex items-center justify-between p-2 rounded-md bg-destructive/10"
              >
                <span>{r.name}</span>
                <span className="tabular-nums text-muted-foreground">
                  Try +1 day this week
                </span>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </div>
  );
}
