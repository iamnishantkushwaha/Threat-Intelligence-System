function severityStyles(severity) {
  if (severity === "High") {
    return {
      background: "from-[#2a1014]/90 to-[#331015]/70 border-red-400/20",
      badge: "bg-[#ff6c6c] text-white",
    };
  }

  if (severity === "Medium") {
    return {
      background: "from-[#2a1c0d]/90 to-[#34220e]/70 border-amber-400/20",
      badge: "bg-[#ffb347] text-white",
    };
  }

  return {
    background: "from-[#122033]/90 to-[#12283a]/70 border-sky-400/20",
    badge: "bg-[#4fa7ff] text-white",
  };
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
      <div className="grid gap-3 md:grid-cols-3">
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
    <div className="grid gap-3 md:grid-cols-3">
      {alerts.slice(0, 3).map((alert, idx) => {
        const styles = severityStyles(alert.severity);

        return (
          <article
            key={`${alert.type}-${idx}`}
            className={`rounded-[22px] border bg-gradient-to-br ${styles.background} px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-[16px] font-semibold tracking-[-0.03em] text-white">
                  {alert.type}
                </h3>
                <p className="mt-2 text-[13px] text-slate-300">
                  IP: {alert.ip}
                </p>
                <p className="mt-4 border-t border-white/10 pt-3 text-[13px] leading-6 text-slate-200/90">
                  {alert.summary}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[12px] font-semibold shadow-lg ${styles.badge}`}
              >
                {alert.severity}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
