import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: "primary" | "success" | "warning" | "destructive";
  delay?: number;
}

const accentMap = {
  primary: "from-primary/20 to-primary-glow/10 text-primary",
  success: "from-success/20 to-success/5 text-success",
  warning: "from-warning/20 to-warning/5 text-warning",
  destructive: "from-destructive/20 to-destructive/5 text-destructive",
};

export function StatCard({ label, value, hint, icon: Icon, accent = "primary", delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="card-elevated p-5 relative overflow-hidden group"
    >
      <div
        className={cn(
          "absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl opacity-60 transition group-hover:opacity-90",
          accentMap[accent],
        )}
      />
      <div className="flex items-center justify-between relative">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className={cn("h-4 w-4", accentMap[accent].split(" ").pop())} />
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight relative">{value}</div>
      {hint && <p className="mt-1 text-xs text-muted-foreground relative">{hint}</p>}
    </motion.div>
  );
}
