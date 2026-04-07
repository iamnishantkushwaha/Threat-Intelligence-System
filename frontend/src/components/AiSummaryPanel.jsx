export default function AiSummaryPanel({ text, loading }) {
  return (
    <section className="rounded-[26px] border border-cyan-400/15 bg-[linear-gradient(135deg,rgba(10,18,33,0.95)_0%,rgba(11,24,42,0.88)_100%)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/80">
            AI Threat Summary
          </p>
          <h2 className="mt-2 text-[18px] font-semibold tracking-[-0.04em] text-white">
            Automatic threat narrative
          </h2>
        </div>
        <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
          AI
        </span>
      </div>

      <div className="mt-4 rounded-[22px] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-slate-200">
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-full animate-pulse rounded bg-white/10" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
          </div>
        ) : (
          <p>{text}</p>
        )}
      </div>
    </section>
  );
}
