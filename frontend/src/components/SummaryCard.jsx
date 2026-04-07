function StatCard({ label, value, accentClassName, loading }) {
  return (
    <article className="group rounded-[22px] border border-white/10 bg-white/8 px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[13px] font-medium tracking-[0.02em] text-slate-200">
          {label}
        </h3>
        <span className="h-2.5 w-2.5 rounded-full bg-cyan-300/70 shadow-[0_0_0_4px_rgba(103,232,249,0.12)]" />
      </div>
      <div className="mt-4 flex min-h-[56px] items-end justify-start">
        {loading ? (
          <div className="h-8 w-14 animate-pulse rounded bg-white/20" />
        ) : (
          <span
            className={`text-[32px] font-semibold leading-none tracking-[-0.05em] ${accentClassName}`}
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
    },
    {
      label: "High Threats",
      value: summary?.high_threats ?? 0,
      accentClassName: "text-[#ff7c7c]",
    },
    {
      label: "Medium Threats",
      value: summary?.medium_threats ?? 0,
      accentClassName: "text-[#ffb44e]",
    },
    {
      label: "Low Threats",
      value: summary?.low_threats ?? 0,
      accentClassName: "text-[#7ddb8c]",
    },
  ];

  return (
    <section className="grid gap-3 md:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.label} loading={loading} {...card} />
      ))}
    </section>
  );
}
