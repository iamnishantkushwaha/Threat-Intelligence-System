const navItems = [
  { label: "Dashboard", key: "dashboard" },
  { label: "Alerts", key: "alerts" },
  { label: "Logs", key: "logs" },
  { label: "Analytics", key: "analytics" },
  { label: "Settings", key: "settings" },
];

export default function Sidebar({ activeSection, onNavigate }) {
  return (
    <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-[280px] shrink-0 flex-col rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,31,0.96)_0%,rgba(7,13,26,0.96)_100%)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-2xl lg:flex">
      <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-cyan-200/90">
          ThreatOps
        </p>
        <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.04em] text-white">
          Control Center
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Monitor threats, triage alerts, and inspect logs from one premium view.
        </p>
      </div>

      <nav className="mt-6 space-y-2">
        {navItems.map((item) => {
          const isActive = activeSection === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition duration-300 ${
                isActive
                  ? "bg-white text-slate-950 shadow-[0_18px_30px_rgba(96,165,250,0.22)]"
                  : "text-slate-300 hover:bg-white/6 hover:text-white"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isActive ? "bg-cyan-500" : "bg-slate-500"
                }`}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[24px] border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          System Health
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-300">Backend</p>
            <p className="mt-1 text-lg font-semibold text-white">Online</p>
          </div>
          <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
            Stable
          </span>
        </div>
      </div>
    </aside>
  );
}
