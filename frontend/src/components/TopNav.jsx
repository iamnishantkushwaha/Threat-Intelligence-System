function IconSearch() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 fill-current"
    >
      <path d="M10.5 4a6.5 6.5 0 1 0 4.14 11.52l4.42 4.43 1.41-1.42-4.42-4.42A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 fill-current"
    >
      <path d="M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v13a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a2 2 0 0 1 2-2h3V2Zm12 8H5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9Zm-1-4H6a1 1 0 0 0-1 1v1h14V7a1 1 0 0 0-1-1Z" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 fill-current"
    >
      <path d="M12 3a5 5 0 0 0-5 5v1.29c0 .86-.3 1.69-.84 2.35L4.2 14.1a1 1 0 0 0 .8 1.6h14a1 1 0 0 0 .8-1.6l-1.96-2.46a3.75 3.75 0 0 1-.84-2.35V8a5 5 0 0 0-5-5Zm0 18a2.75 2.75 0 0 0 2.58-1.8H9.42A2.75 2.75 0 0 0 12 21Z" />
    </svg>
  );
}

export default function TopNav({
  pageTitle = "Threat Intelligence Control Center",
  pageDescription = "Premium operational view for live threat monitoring and incident response.",
  searchQuery,
  onSearchChange,
  selectedDate,
  onDateChange,
  highThreatCount = 0,
  uniqueIps = 0,
  lastUpdated = "Awaiting sync",
}) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(12,23,36,0.94)_0%,rgba(8,16,27,0.9)_100%)] px-5 py-5 shadow-[0_30px_90px_rgba(2,8,23,0.22)] ring-1 ring-white/6 backdrop-blur-2xl md:px-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-100/80">
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(134,239,172,0.14)]" />
            Live monitoring
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
            {pageTitle}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400 md:text-[15px]">
            {pageDescription}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                High threats
              </p>
              <p className="mt-2 text-lg font-semibold text-rose-100">
                {highThreatCount}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Active IPs
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {uniqueIps}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Last sync
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {lastUpdated}
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-[560px] flex-col gap-3">
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="flex flex-1 items-center gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <IconSearch />
              <input
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search IP, username, alert, or event"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </label>
            <label className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <IconCalendar />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Date
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => onDateChange(event.target.value)}
                className="appearance-none bg-transparent text-sm text-white outline-none [color-scheme:dark]"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-300">
              <p className="font-medium text-white">Current context</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                API proxy active | data streaming live
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-white transition hover:scale-[1.03] hover:bg-white/10"
                aria-label="Notifications"
              >
                <IconBell />
              </button>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
                Synced
              </span>
              <button
                type="button"
                className="flex h-11 min-w-11 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(126,231,215,0.28),rgba(247,178,103,0.2))] px-4 text-sm font-semibold text-white transition hover:scale-[1.03]"
                aria-label="Profile"
              >
                TI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
