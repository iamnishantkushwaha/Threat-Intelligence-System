export default function AiSummaryPanel({ text, loading }) {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-cyan-300/14 bg-[linear-gradient(135deg,rgba(11,26,40,0.98)_0%,rgba(7,17,28,0.96)_60%,rgba(24,34,31,0.88)_100%)] p-5 shadow-[0_30px_90px_rgba(2,8,23,0.24)] ring-1 ring-cyan-300/10 backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 md:p-6">
      <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100/80">
            AI Threat Summary
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Automatic threat narrative
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Machine-generated briefing distilled from your active alerts and
            activity stream.
          </p>
        </div>
        <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
          AI
        </span>
      </div>

      <div className="relative mt-5 rounded-[24px] border border-white/10 bg-white/6 p-5 text-sm leading-7 text-slate-200">
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-full animate-pulse rounded bg-white/10" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
          </div>
        ) : (
          <div className="space-y-4">
            <p>{text}</p>
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Prioritized
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Contextual
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Analyst-ready
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
