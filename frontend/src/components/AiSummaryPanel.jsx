function formatRiskScore(value) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return "0.00";
  }

  return numericValue.toFixed(2);
}

function getThreatTone(threatLevel) {
  if (threatLevel === "High") {
    return "text-rose-300";
  }

  if (threatLevel === "Medium") {
    return "text-amber-200";
  }

  return "text-emerald-200";
}

function StatTile({ label, value, valueClassName, loading }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      {loading ? (
        <div className="mt-3 h-8 w-24 animate-pulse rounded bg-white/10" />
      ) : (
        <p className={`mt-3 text-2xl font-bold ${valueClassName}`}>{value}</p>
      )}
    </div>
  );
}

export default function AiSummaryPanel({ ai, loading }) {
  if (!loading && !ai) {
    return null;
  }

  const threatLevel = ai?.threat_level ?? "Unknown";

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

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatTile
          label="Risk Score"
          value={formatRiskScore(ai?.risk_score)}
          valueClassName="text-white"
          loading={loading}
        />
        <StatTile
          label="Threat Level"
          value={threatLevel}
          valueClassName={getThreatTone(threatLevel)}
          loading={loading}
        />
        <StatTile
          label="Prediction"
          value={ai?.prediction ?? "Awaiting AI output"}
          valueClassName="text-cyan-100 text-lg md:text-xl"
          loading={loading}
        />
      </div>

      <div className="relative mt-4 rounded-[24px] border border-white/10 bg-white/6 p-5 text-sm leading-7 text-slate-200">
        <p className="text-sm text-slate-400">AI Insight</p>
        {loading ? (
          <div className="mt-3 space-y-3">
            <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-full animate-pulse rounded bg-white/10" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
          </div>
        ) : (
          <div className="mt-3 space-y-4">
            <p>{ai?.message}</p>
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
