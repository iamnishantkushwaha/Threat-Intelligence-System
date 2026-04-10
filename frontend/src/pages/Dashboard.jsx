import { useMemo } from "react";
import AiSummaryPanel from "../components/AiSummaryPanel.jsx";
import Badge from "../components/Badge.jsx";
import SummaryCard from "../components/SummaryCard.jsx";
import { getAbuseVariant, getTopMaliciousIps } from "../utils/threat.js";

export default function Dashboard({
  summary,
  alerts = [],
  logs = [],
  aiPrediction,
  loading,
  onNavigate,
}) {
  const highThreatCount = alerts.filter(
    (alert) => alert.severity === "High",
  ).length;

  const successfulEvents = logs.filter((log) => log.status === "success").length;
  const successRate = logs.length
    ? Math.round((successfulEvents / logs.length) * 100)
    : 100;
  const uniqueIps = new Set(logs.map((log) => log.ip).filter(Boolean)).size;

  const watchlist = useMemo(() => {
    const rank = { High: 0, Medium: 1, Low: 2 };

    return [...alerts]
      .sort((left, right) => {
        const severityRank =
          (rank[left.severity] ?? 3) - (rank[right.severity] ?? 3);

        if (severityRank !== 0) {
          return severityRank;
        }

        return String(right.timestamp || "").localeCompare(
          String(left.timestamp || ""),
        );
      })
      .slice(0, 3);
  }, [alerts]);

  const topMaliciousIps = useMemo(() => getTopMaliciousIps(alerts, 3), [alerts]);

  const priorityLabel = highThreatCount
    ? "Immediate analyst attention recommended."
    : "No critical incidents at this moment.";

  return (
    <div className="space-y-4">
      <section className="grid gap-5 2xl:grid-cols-[1.1fr_0.9fr]">
        <article className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(12,25,38,0.98)_0%,rgba(8,16,27,0.94)_50%,rgba(18,32,32,0.92)_100%)] p-6 shadow-[0_30px_90px_rgba(2,8,23,0.26)] ring-1 ring-white/6 backdrop-blur-2xl">
          <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="relative flex flex-col gap-5">
            <div className="min-w-0 max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-cyan-100/80">
                Executive overview
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-4xl">
                Dashboard overview
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                Track posture, review critical activity, and jump into the
                detailed workspaces when needed.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="min-w-0 rounded-[24px] border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  Monitored IPs
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {uniqueIps}
                </p>
              </div>
              <div className="min-w-0 rounded-[24px] border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  Success rate
                </p>
                <p className="mt-3 text-3xl font-semibold text-emerald-100">
                  {successRate}%
                </p>
              </div>
              <div className="min-w-0 rounded-[24px] border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  Priority note
                </p>
                <p className="mt-3 break-words text-sm font-semibold leading-5 text-white">
                  {priorityLabel}
                </p>
              </div>
            </div>
          </div>
        </article>

        <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-1">
          <article className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,25,38,0.94)_0%,rgba(9,17,28,0.88)_100%)] p-5 shadow-[0_24px_70px_rgba(2,8,23,0.22)] ring-1 ring-white/6 backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                  Mission status
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  Threat posture guarded
                </h3>
              </div>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
                Stable
              </span>
            </div>
            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() => onNavigate("alerts")}
                className="flex w-full items-center justify-between rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/8"
              >
                <span className="text-sm text-slate-300">Open full alerts</span>
                <span className="text-lg font-semibold text-white">
                  {alerts.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate("logs")}
                className="flex w-full items-center justify-between rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/8"
              >
                <span className="text-sm text-slate-300">Open full logs</span>
                <span className="text-sm font-semibold text-white">
                  {logs.length} events
                </span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate("analytics")}
                className="flex w-full items-center justify-between rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/8"
              >
                <span className="text-sm text-slate-300">
                  Open analytics workspace
                </span>
                <span className="text-sm font-semibold text-cyan-100">
                  Trends
                </span>
              </button>
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,25,35,0.96)_0%,rgba(10,16,24,0.92)_100%)] p-5 shadow-[0_24px_70px_rgba(2,8,23,0.22)] ring-1 ring-white/6 backdrop-blur-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
              Analyst watchlist
            </p>
            <div className="mt-4 space-y-3">
              {watchlist.length ? (
                watchlist.map((alert, index) => (
                  <div
                    key={`${alert.type}-${index}`}
                    className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">
                        {alert.type}
                      </p>
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                          {alert.severity}
                        </span>
                        {alert.abuse_confidence_score != null ? (
                          <Badge variant={getAbuseVariant(alert.abuse_confidence_score)}>
                            {alert.abuse_confidence_score}
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{alert.ip}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-slate-400">
                  No alerts in the current filter set.
                </div>
              )}
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(26,17,18,0.96)_0%,rgba(12,16,24,0.92)_100%)] p-5 shadow-[0_24px_70px_rgba(2,8,23,0.22)] ring-1 ring-white/6 backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                  Top malicious IPs
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  AbuseIPDB watch
                </h3>
              </div>
              <span className="rounded-full border border-rose-400/20 bg-rose-400/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-100">
                Top 3
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {topMaliciousIps.length ? (
                topMaliciousIps.map((alert, index) => (
                  <div
                    key={`${alert.ip}-${index}`}
                    className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">{alert.ip}</p>
                      <Badge variant={getAbuseVariant(alert.abuse_confidence_score)}>
                        {alert.abuse_confidence_score}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-300">
                      {alert.country ? (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                          {alert.country}
                        </span>
                      ) : null}
                      {alert.isp ? (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                          {alert.isp}
                        </span>
                      ) : null}
                      {alert.total_reports != null ? (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                          {alert.total_reports} reports
                        </span>
                      ) : null}
                      {alert.is_malicious ? <Badge variant="ai">Malicious</Badge> : null}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-slate-400">
                  No public enriched IPs are available yet.
                </div>
              )}
            </div>
          </article>
        </div>
      </section>

      <SummaryCard summary={summary} loading={loading} />
      <AiSummaryPanel ai={aiPrediction} loading={loading} />
    </div>
  );
}
