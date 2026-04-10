function severityStyles(severity) {
  if (severity === "High") {
    return {
      background:
        "from-[#2f1217]/95 via-[#271117]/90 to-[#17131d]/92 border-rose-400/20",
      badge: "border-rose-400/20 bg-rose-400/12 text-rose-100",
      line: "bg-rose-300",
    };
  }

  if (severity === "Medium") {
    return {
      background:
        "from-[#2a1f11]/95 via-[#241b12]/90 to-[#17141a]/92 border-amber-300/20",
      badge: "border-amber-300/20 bg-amber-300/12 text-amber-100",
      line: "bg-amber-300",
    };
  }

  return {
    background:
      "from-[#122536]/95 via-[#0f2232]/90 to-[#131822]/92 border-cyan-300/20",
    badge: "border-cyan-300/20 bg-cyan-300/12 text-cyan-100",
    line: "bg-cyan-300",
  };
}

function abuseVariant(score) {
  if ((score ?? 0) >= 75) {
    return "border-rose-400/20 bg-rose-400/12 text-rose-100";
  }

  if ((score ?? 0) >= 30) {
    return "border-amber-300/20 bg-amber-300/12 text-amber-100";
  }

  return "border-white/10 bg-white/8 text-slate-200";
}

function AlertSkeleton() {
  return (
    <article className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="h-4 w-32 animate-pulse rounded bg-white/20" />
          <div className="mt-3 h-3 w-44 animate-pulse rounded bg-white/10" />
          <div className="mt-3 h-3 w-40 animate-pulse rounded bg-white/10" />
        </div>
        <div className="h-7 w-16 animate-pulse rounded bg-white/20" />
      </div>
    </article>
  );
}

export default function AlertCard({ alerts = [], loading }) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <AlertSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!alerts.length) {
    return (
      <div className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-8 text-center text-sm text-slate-200 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl">
        No active alerts right now.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {alerts.slice(0, 3).map((alert, idx) => {
        const styles = severityStyles(alert.severity);

        return (
          <article
            key={`${alert.type}-${idx}`}
            className={`relative overflow-hidden rounded-[28px] border bg-gradient-to-br ${styles.background} px-5 py-5 shadow-[0_24px_60px_rgba(2,8,23,0.18)] ring-1 ring-white/6 backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5`}
          >
            <div className={`absolute left-0 top-6 h-16 w-1.5 rounded-r-full ${styles.line}`} />
            <div className="flex items-start justify-between gap-3 pl-2">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Incident snapshot
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-lg ${styles.badge}`}
                  >
                    {alert.severity}
                  </span>
                  {alert.abuse_confidence_score != null ? (
                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${abuseVariant(alert.abuse_confidence_score)}`}
                    >
                      Abuse {alert.abuse_confidence_score}
                    </span>
                  ) : null}
                  {alert.is_malicious ? (
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                      Malicious IP
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-3 text-[18px] font-semibold text-white">
                  {alert.type}
                </h3>
                <p className="mt-2 text-[13px] uppercase tracking-[0.12em] text-slate-400">
                  IP: {alert.ip}
                </p>
                <p className="mt-4 border-t border-white/10 pt-4 text-[14px] leading-6 text-slate-200/90">
                  {alert.summary}
                </p>
                {alert.intel_summary ? (
                  <div className="mt-4 rounded-[18px] border border-cyan-300/14 bg-cyan-300/8 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100/80">
                      Threat Intel
                    </p>
                    <p className="mt-2 text-[13px] leading-6 text-slate-200/90">
                      {alert.intel_summary}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-300">
                      {alert.country_name ? (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                          {alert.country_name}
                        </span>
                      ) : null}
                      {alert.isp ? (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                          {alert.isp}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
