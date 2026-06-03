import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { useHabitStore } from "@/lib/store";
import { bestStreak, habitCompletionRate } from "@/lib/habit-utils";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, updateProfile, habits, entries } = useHabitStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);

  const now = new Date();
  const rates = habits.map((h) => habitCompletionRate(entries, h, now.getFullYear(), now.getMonth()));
  const monthly = rates.length ? Math.round(rates.reduce((a, b) => a + b.pct, 0) / rates.length) : 0;
  const longest = habits.length ? Math.max(...habits.map((h) => bestStreak(entries, h))) : 0;

  const initials = profile.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated p-6 flex items-center gap-5"
      >
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-2xl font-semibold glow-primary">
          {initials}
        </div>
        <div className="flex-1">
          {editing ? (
            <div className="space-y-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">{profile.name}</h1>
              <p className="text-muted-foreground text-sm">{profile.email}</p>
            </>
          )}
        </div>
        <button
          onClick={() => {
            if (editing) updateProfile({ name, email });
            setEditing(!editing);
          }}
          className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
        >
          {editing ? "Save" : "Edit"}
        </button>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Join Date", value: new Date(profile.joinDate).toLocaleDateString() },
          { label: "Total Habits", value: habits.length },
          { label: "Longest Streak", value: `${longest}d` },
          { label: "Monthly Success", value: `${monthly}%` },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-elevated p-4"
          >
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold">{s.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
