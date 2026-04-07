import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card.jsx";
import Badge from "../components/Badge.jsx";

const PAGE_SIZE = 6;

const EVENT_TYPES = ["All", "login_attempt", "server_access", "unknown"];

export default function Logs({ logs = [], loading }) {
  const [eventType, setEventType] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [eventType, status, logs.length]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const eventMatches = eventType === "All" || log.event_type === eventType;
      const statusMatches = status === "All" || log.status === status;
      return eventMatches && statusMatches;
    });
  }, [logs, eventType, status]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleLogs = filteredLogs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="space-y-5">
      <Card className="px-5 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
              Logs
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Full activity table with event and status filtering.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <select
              value={eventType}
              onChange={(event) => setEventType(event.target.value)}
              className="rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm text-white outline-none"
            >
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type} className="bg-slate-950">
                  {type === "All" ? "All event types" : type}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="All" className="bg-slate-950">
                All status
              </option>
              <option value="success" className="bg-slate-950">
                success
              </option>
              <option value="failed" className="bg-slate-950">
                failed
              </option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden px-0 py-0">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-white/10 text-slate-200">
                <th className="px-5 py-4 font-semibold">Timestamp</th>
                <th className="px-5 py-4 font-semibold">IP</th>
                <th className="px-5 py-4 font-semibold">Event Type</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Username</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? [...Array(PAGE_SIZE)].map((_, index) => (
                    <tr key={index} className="border-b border-white/8">
                      <td className="px-5 py-4">
                        <div className="h-4 w-36 animate-pulse rounded bg-white/10" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-6 w-16 animate-pulse rounded bg-white/10" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
                      </td>
                    </tr>
                  ))
                : visibleLogs.map((log, index) => (
                    <tr
                      key={`${log.timestamp}-${index}`}
                      className="border-b border-white/8 hover:bg-white/5"
                    >
                      <td className="px-5 py-4 text-slate-200">
                        {log.timestamp}
                      </td>
                      <td className="px-5 py-4 text-slate-200">{log.ip}</td>
                      <td className="px-5 py-4 text-slate-200">
                        {log.event_type}
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          variant={
                            log.status === "success" ? "success" : "failed"
                          }
                        >
                          {log.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-slate-200">
                        {log.username || "-"}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </Card>

      {!loading ? (
        <Card className="px-5 py-4">
          <div className="flex items-center justify-between gap-3 text-sm text-slate-300">
            <span>
              Showing {visibleLogs.length} of {filteredLogs.length} logs
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
