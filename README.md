<div align="center">
  <h1>TaskTraQ</h1>
  <p>A premium habit tracker web application built for consistency, clarity, and motivation.</p>
  <p>
    <a href="#features">Features</a> ·
    <a href="#tech-stack">Tech Stack</a> ·
    <a href="#getting-started">Getting Started</a> ·
    <a href="#deployment">Deployment</a> ·
    <a href="#screenshots">Screenshots</a>
  </p>
</div>

---

---

## Features

- **Habit Management** — Create, edit, and organize daily habits with color-coded categories and priority levels.
- **Daily Tracking** — Toggle habits as Completed, Missed, or Pending with a single click.
- **Streak Tracking** — Track current and longest streaks automatically to stay motivated.
- **Visual Analytics** — Rich charts powered by Recharts: completion trends, success rates, and habit performance over time.
- **Activity Heatmap** — GitHub-style monthly heatmap to visualize daily consistency at a glance.
- **Smart Insights** — AI-like analytics that surface your best-performing habits, strongest days, and improvement areas.
- **Weekly Grid View** — Spreadsheet-style layout to log habits across the full week in one screen.
- **Data Portability** — Export your data as JSON or CSV. Import back anytime.
- **User Profile** — Editable profile with milestones and achievements.
- **Responsive Design** — Fully mobile-first, optimized for phone, tablet, and desktop.
- **Dark Theme** — Premium dark UI with elegant accent colors and subtle animations.
- **Local Persistence** — All data is stored in the browser via localStorage (no sign-in required).

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [TanStack Start](https://tanstack.com/start) (React 19 + Vite 7) |
| Routing | [TanStack Router](https://tanstack.com/router) (file-based) |
| State | [Zustand](https://zustand.docs.pmnd.rs/) (persistent local store) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + custom `oklch` tokens |
| UI Components | [shadcn/ui](https://ui.shadcn.com) (Radix primitives) |
| Charts | [Recharts](https://recharts.org) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Date Utilities | [date-fns](https://date-fns.org) |
| Icons | [Lucide React](https://lucide.dev) |
| Build Tool | Vite 7 with TypeScript |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (or [Bun](https://bun.sh/))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/tasktraq.git
cd tasktraq

# 2. Install dependencies
bun install

# 3. Start the development server
bun dev
```

The app will be available at `http://localhost:3000`.

### Build for Production

```bash
bun run build
```

### Lint & Format

```bash
bun run lint      # Run ESLint
bun run format    # Run Prettier
```

---

## Deployment

TaskTraQ uses a **safe branch-based deployment workflow** with GitHub and Vercel.

| Branch   | Purpose         | Vercel Target  |
|----------|-----------------|----------------|
| `main`   | Production      | Live site      |
| `develop`| Development     | Preview URL    |

All changes made in the Lovable editor are committed to the `develop` branch. When changes are tested and ready, merge `develop` into `main` via a Pull Request. Vercel then deploys `main` to production automatically.

See [`WORKFLOW.md`](WORKFLOW.md) for the full setup guide, including branch protection rules, CI checks, and step-by-step merge instructions.

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui primitives
│   └── layout/         # App shell, sidebar, etc.
├── lib/                # Utilities, store, and helpers
│   ├── store.ts        # Zustand habit store
│   └── habit-utils.ts  # Streaks, completion rates, heatmap
├── routes/             # TanStack Start file-based routes
│   ├── __root.tsx      # Root layout (SEO, providers)
│   ├── _app.tsx        # Authenticated app shell
│   ├── _app/
│   │   ├── dashboard.tsx  # Overview + stats
│   │   ├── habits.tsx     # Weekly grid tracker
│   │   ├── calendar.tsx   # Monthly heatmap
│   │   ├── analytics.tsx  # Detailed charts
│   │   ├── profile.tsx    # User profile
│   │   └── settings.tsx   # Export/import/reset
│   └── index.tsx       # Landing redirect
├── styles.css          # Tailwind + design tokens
└── router.tsx          # Router configuration
```

---

## Screenshots

> Add your own screenshots by placing images in the repo and updating the paths below.

| Dashboard | Habits Grid |
|-----------|-------------|
| ![Dashboard](screenshots/dashboard.png) | ![Habits](screenshots/habits.png) |

| Analytics | Calendar Heatmap |
|-----------|-----------------|
| ![Analytics](screenshots/analytics.png) | ![Calendar](screenshots/calendar.png) |

---

## Key Design Decisions

1. **No Authentication Required** — TaskTraQ works entirely client-side. Your data lives in your browser's `localStorage`, making it instant and private.
2. **Mobile-First** — The interface is optimized for thumb-friendly daily check-ins.
3. **Triple-State Tracking** — Habits can be Completed, Missed, or Pending. Partial data is better than no data.
4. **Premium Feel** — Dark theme, subtle animations, and generous whitespace make the app feel like a native productivity tool.

---

## Roadmap

- [ ] Cloud sync (optional Supabase backend)
- [ ] Push notifications for daily reminders
- [ ] Habit categories and filters
- [ ] Weekly / monthly PDF export
- [ ] Light theme toggle
- [ ] Collaborative habit groups

---

## License

[MIT](LICENSE)

---

<div align="center">
  <sub>Built with focus. Track your habits, build your future.</sub>
</div>
