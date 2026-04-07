import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card.jsx";
import Badge from "../components/Badge.jsx";
import { matchesQuery } from "../utils/threat.js";

const PAGE_SIZE = 6;

function getSeverityVariant(severity) {
  return severity === "High"
    ? "high"
    : severity === "Medium"
      ? "medium"
      : "low";
}

export default function Alerts({ alerts = [], loading }) {
  const [severity, setSeverity] = useState("All");
  const [ipSearch, setIpSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [severity, ipSearch]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const severityMatches = severity === "All" || alert.severity === severity;
      const searchMatches = matchesQuery([alert.ip], ipSearch);
      return severityMatches && searchMatches;
    });
  }, [alerts, severity, ipSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleAlerts = filteredAlerts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="space-y-5">
      <Card className="px-5 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
              Alerts
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Full alert feed with severity filtering and IP lookup.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <label className="rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-300">
              <span className="mr-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Search IP
              </span>
              <input
                value={ipSearch}
                onChange={(event) => setIpSearch(event.target.value)}
                placeholder="192.168.1.10"
                className="bg-transparent text-white outline-none placeholder:text-slate-500"
              />
            </label>
            <select
              value={severity}
              onChange={(event) => setSeverity(event.target.value)}
              className="rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="All" className="bg-slate-950">
                All severity
              </option>
              <option value="High" className="bg-slate-950">
                High
              </option>
              <option value="Medium" className="bg-slate-950">
                Medium
              </option>
              <option value="Low" className="bg-slate-950">
                Low
              </option>
            </select>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {(loading ? [...Array(6)] : visibleAlerts).map((alert, index) => {
          if (loading) {
            return (
              <Card
                key={index}
                className="h-[168px] animate-pulse bg-white/6 px-5 py-5"
              >
                <div className="h-4 w-32 rounded bg-white/10" />
                <div className="mt-4 h-5 w-40 rounded bg-white/10" />
                <div className="mt-4 h-3 w-3/4 rounded bg-white/10" />
                <div className="mt-3 h-3 w-2/3 rounded bg-white/10" />
              </Card>
            );
          }

          const variant = getSeverityVariant(alert.severity);

          return (
            <Card
              key={`${alert.type}-${index}`}
              className="px-5 py-5 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant={variant}>{alert.severity}</Badge>
                  <h3 className="mt-3 text-[18px] font-semibold tracking-[-0.03em] text-white">
                    {alert.type}
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">IP: {alert.ip}</p>
                </div>
              </div>
              <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-slate-200/90">
                {alert.summary}
              </p>
            </Card>
          );
        })}
      </div>

      {!loading ? (
        <Card className="px-5 py-4">
          <div className="flex items-center justify-between gap-3 text-sm text-slate-300">
            <span>
              Showing {visibleAlerts.length} of {filteredAlerts.length} alerts
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              <Badge variant="neutral">
                {currentPage} / {totalPages}
              </Badge>
              <button
                type="button"
                onClick={() =>
                  setPage((value) => Math.min(totalPages, value + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
