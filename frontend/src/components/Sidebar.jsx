const navItems = [
  { label: "Dashboard", key: "dashboard", hint: "Executive overview" },
  { label: "Alerts", key: "alerts", hint: "Escalations and triage" },
  { label: "Logs", key: "logs", hint: "Full activity ledger" },
  { label: "Analytics", key: "analytics", hint: "Threat movement" },
  { label: "Settings", key: "settings", hint: "Workspace controls" },
];

function SidebarIcon({ itemKey, isActive }) {
  const fill = isActive ? "#ffffff" : "#94a3b8";

  if (itemKey === "alerts") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          d="M12 3 3 19h18L12 3Zm0 5.8 3.95 7.2H8.05L12 8.8Zm0 5.95a1.05 1.05 0 1 0 0 2.1 1.05 1.05 0 0 0 0-2.1Z"
          fill={fill}
        />
      </svg>
    );
  }

  if (itemKey === "logs") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          d="M6 4h12a2 2 0 0 1 2 2v12.5A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5V6a2 2 0 0 1 2-2Zm0 2v12h12V6H6Zm2.5 3h7v1.8h-7V9Zm0 4h7v1.8h-7V13Z"
          fill={fill}
        />
      </svg>
    );
  }

  if (itemKey === "analytics") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          d="M4 18h16v2H2V4h2v14Zm2-2V9h3v7H6Zm5 0V5h3v11h-3Zm5 0v-4h3v4h-3Z"
          fill={fill}
        />
      </svg>
    );
  }

  if (itemKey === "settings") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          d="m12 2 1.2 2.45 2.72.4-.97 2.57 1.92 1.95-1.92 1.94.97 2.58-2.72.4L12 18l-1.2-2.45-2.72-.4.97-2.58-1.92-1.94 1.92-1.95-.97-2.57 2.72-.4L12 2Zm0 6.1a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Z"
          fill={fill}
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        d="M3 13h8V3H3v10Zm10 8h8V3h-8v18ZM3 21h8v-6H3v6Z"
        fill={fill}
      />
    </svg>
  );
}

export default function Sidebar({
  activeSection,
  onNavigate,
  postureScore = 92,
  totalAlerts = 0,
  highThreatCount = 0,
}) {
  return (
    <aside className="scrollbar-hidden sticky top-5 hidden h-[calc(100svh-2.5rem)] w-[320px] shrink-0 overflow-y-auto rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,16,26,0.96)_0%,rgba(5,11,19,0.92)_100%)] p-5 shadow-[0_30px_100px_rgba(2,8,23,0.38)] ring-1 ring-white/8 backdrop-blur-2xl xl:block">
      <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top,rgba(99,211,255,0.22),transparent_72%)] opacity-80" />

      <div className="relative rounded-[26px] border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7ee7d7_0%,#f7b267_100%)] text-sm font-bold text-slate-950 shadow-[0_18px_30px_rgba(98,214,199,0.18)]">
            TI
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-cyan-100/80">
              ThreatOps
            </p>
            <h2 className="mt-1 text-[22px] font-semibold text-white">
              Command Deck
            </h2>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          Premium security operations workspace for monitoring posture,
          incident spikes, and suspicious log movement.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
              Posture
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {postureScore}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
              Alerts
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {totalAlerts}
            </p>
          </div>
        </div>
      </div>

      <nav className="relative mt-6 space-y-2">
        {navItems.map((item) => {
          const isActive = activeSection === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              className={`flex w-full items-center gap-4 rounded-[22px] border px-4 py-3.5 text-left transition duration-300 ${
                isActive
                  ? "border-cyan-300/20 bg-[linear-gradient(135deg,rgba(99,211,255,0.18),rgba(255,255,255,0.08))] text-white shadow-[0_18px_30px_rgba(96,165,250,0.14)]"
                  : "border-transparent text-slate-300 hover:border-white/8 hover:bg-white/6 hover:text-white"
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
                  isActive
                    ? "border-white/16 bg-white/10"
                    : "border-white/8 bg-white/4"
                }`}
              >
                <SidebarIcon itemKey={item.key} isActive={isActive} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">
                  {item.label}
                </span>
                <span className="mt-1 block text-xs text-slate-400">
                  {item.hint}
                </span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="relative mt-6 rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,24,37,0.92)_0%,rgba(8,15,26,0.88)_100%)] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Security Posture
        </p>
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm text-slate-300">Environment status</p>
              <p className="mt-1 text-3xl font-semibold text-white">
                Guarded
              </p>
            </div>
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
              Stable
            </span>
          </div>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div>
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
                <span>Detection coverage</span>
                <span>{postureScore}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/8">
                <div
                  className="h-2 rounded-full bg-[linear-gradient(90deg,#7ee7d7_0%,#9cf3c8_100%)]"
                  style={{ width: `${postureScore}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-3 py-2">
              <span>High-priority incidents</span>
              <span className="font-semibold text-rose-200">
                {highThreatCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
