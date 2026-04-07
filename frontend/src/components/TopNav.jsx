function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M10.5 4a6.5 6.5 0 1 0 4.14 11.52l4.42 4.43 1.41-1.42-4.42-4.42A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" />
    </svg>
  );
}

export default function TopNav({ searchQuery, onSearchChange, selectedDate, onDateChange }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/6 px-4 py-4 shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl md:px-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200/80">
            Live monitoring
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
            Threat Intelligence Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 md:text-[15px]">
            Premium threat visibility with alerts, analytics, and log intelligence.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:min-w-[420px] xl:max-w-[520px]">
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-3 text-slate-300">
              <IconSearch />
              <input
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search IP, username, alert, event..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </label>
            <label className="flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-3 text-slate-300">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Date
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => onDateChange(event.target.value)}
                className="bg-transparent text-sm text-white outline-none [color-scheme:dark]"
              />
            </label>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
            <div className="text-sm text-slate-300">
              <p className="font-medium text-white">Current context</p>
              <p className="mt-1 text-xs text-slate-400">API proxy active • data streaming live</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                Synced
              </span>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white transition hover:scale-105 hover:bg-white/12"
                aria-label="Profile"
              >
                <span className="text-sm font-semibold">TI</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
