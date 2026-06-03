import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { Download, Upload, RotateCcw, Trash2 } from "lucide-react";
import { useHabitStore } from "@/lib/store";
import { monthKey } from "@/lib/habit-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { habits, entries, importData, resetMonth } = useHabitStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ habits, entries }, null, 2)], {
      type: "application/json",
    });
    download(blob, "tasktraq-export.json");
  };

  const exportCSV = () => {
    const rows = ["habit_id,habit_name,date,state"];
    for (const h of habits) {
      const days = entries[h.id] ?? {};
      for (const [date, state] of Object.entries(days)) {
        rows.push(`${h.id},"${h.name.replace(/"/g, '""')}",${date},${state}`);
      }
    }
    download(new Blob([rows.join("\n")], { type: "text/csv" }), "tasktraq-export.csv");
  };

  const onImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!data.habits || !data.entries) throw new Error("Invalid file");
        importData(data);
        toast.success("Data imported");
      } catch {
        toast.error("Invalid file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your data. TaskTraQ runs in a permanent dark theme.
        </p>
      </div>

      <section className="card-elevated p-5 space-y-3">
        <h2 className="font-medium">Data</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportJSON}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent"
          >
            <Download className="h-4 w-4" /> Export JSON
          </button>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent"
          >
            <Upload className="h-4 w-4" /> Import JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={onImport}
          />
        </div>
      </section>

      <section className="card-elevated p-5 space-y-3">
        <h2 className="font-medium">Danger zone</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              if (confirm("Reset the current month? Entries this month will be removed."))
                resetMonth(monthKey(new Date()));
              toast.success("Month reset");
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-warning/40 text-warning px-4 py-2 text-sm hover:bg-warning/10"
          >
            <RotateCcw className="h-4 w-4" /> Reset Current Month
          </button>
          <button
            onClick={() => {
              if (confirm("Delete all local data? This cannot be undone.")) {
                localStorage.removeItem("tasktraq-store");
                location.reload();
              }
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-destructive/40 text-destructive px-4 py-2 text-sm hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" /> Delete All Data
          </button>
        </div>
      </section>
    </div>
  );
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
