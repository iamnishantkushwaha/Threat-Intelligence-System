function StatCard({
  label,
  value,
  accentClassName,
  pulseClassName,
  loading,
}) {
  return (
    <article className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,25,38,0.95)_0%,rgba(9,17,27,0.88)_100%)] px-5 py-4 shadow-[0_20px_60px_rgba(2,8,23,0.18)] ring-1 ring-white/6 backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_70px_rgba(2,8,23,0.26)]">
      <div
        className={`absolute -right-10 top-0 h-24 w-24 rounded-full blur-3xl ${pulseClassName}`}
      />
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          {label}
        </h3>
        <span className="h-2.5 w-2.5 rounded-full bg-cyan-200/70 shadow-[0_0_0_6px_rgba(103,232,249,0.1)]" />
      </div>
      <div className="mt-5 flex items-end justify-start">
        {loading ? (
          <div className="h-8 w-14 animate-pulse rounded bg-white/20" />
        ) : (
          <span
            className={`text-[30px] font-semibold leading-none tracking-[-0.05em] ${accentClassName}`}
          >
            {value}
          </span>
        )}
      </div>
    </article>
  );
}

export default function SummaryCard({ summary, loading }) {
  const cards = [
    {
      label: "Total Alerts",
      value: summary?.total_alerts ?? 0,
      accentClassName: "text-white",
      pulseClassName: "bg-cyan-400/18",
    },
    {
      label: "High Threats",
      value: summary?.high_threats ?? 0,
      accentClassName: "text-rose-100",
      pulseClassName: "bg-rose-400/18",
    },
    {
      label: "Medium Threats",
      value: summary?.medium_threats ?? 0,
      accentClassName: "text-amber-100",
      pulseClassName: "bg-amber-300/20",
    },
    {
      label: "Low Threats",
      value: summary?.low_threats ?? 0,
      accentClassName: "text-emerald-100",
      pulseClassName: "bg-emerald-300/18",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.label} loading={loading} {...card} />
      ))}
    </section>
  );
}
