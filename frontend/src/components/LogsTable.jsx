import { useMemo, useState } from "react";

const PAGE_SIZE = 4;

function formatEventType(value) {
  return String(value || "unknown").replaceAll("_", " ");
}

export default function LogsTable({ logs = [], loading }) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const visibleLogs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return logs.slice(start, start + PAGE_SIZE);
  }, [logs, currentPage]);

  const goPrevious = () => setPage((value) => Math.max(1, value - 1));
  const goNext = () => setPage((value) => Math.min(totalPages, value + 1));

  if (loading) {
    return (
      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,25,38,0.92)_0%,rgba(9,18,29,0.84)_100%)] px-5 py-5 shadow-[0_24px_80px_rgba(2,8,23,0.22)] ring-1 ring-white/6 backdrop-blur-2xl">
        <h2 className="text-xl font-semibold text-slate-100">Activity ledger</h2>
        <div className="mt-4 space-y-2">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-2xl bg-white/10"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,25,38,0.92)_0%,rgba(9,18,29,0.84)_100%)] px-5 py-5 shadow-[0_24px_80px_rgba(2,8,23,0.22)] ring-1 ring-white/6 backdrop-blur-2xl md:px-6 md:py-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
            Activity stream
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100">
            Activity ledger
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Recent authentication and server events from the monitored estate.
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {visibleLogs.length ? (
        <div className="mt-5 overflow-x-auto rounded-[24px] border border-white/8 bg-[rgba(255,255,255,0.02)]">
          <table className="min-w-full border-collapse text-left text-[14px]">
            <thead>
              <tr className="bg-white/8 text-slate-300">
                <th className="px-5 py-4 font-semibold uppercase tracking-[0.16em]">
                  Timestamp
                </th>
                <th className="px-5 py-4 font-semibold uppercase tracking-[0.16em]">
                  IP Address
                </th>
                <th className="px-5 py-4 font-semibold uppercase tracking-[0.16em]">
                  Event Type
                </th>
                <th className="px-5 py-4 font-semibold uppercase tracking-[0.16em]">
                  Status
                </th>
                <th className="px-5 py-4 font-semibold uppercase tracking-[0.16em]">
                  Username
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleLogs.map((log, index) => (
                <tr
                  key={`${log.timestamp}-${index}`}
                  className="border-b border-white/8 bg-transparent transition hover:bg-white/5"
                >
                  <td className="px-5 py-4 text-slate-200">{log.timestamp}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-100">
                      {log.ip}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-200 capitalize">
                    {formatEventType(log.event_type)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                        log.status === "success"
                          ? "bg-emerald-400/15 text-emerald-100"
                          : "bg-rose-400/15 text-rose-100"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-200">
                    {log.username || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 py-8 text-center text-sm text-slate-300">
          No logs available
        </p>
      )}

      <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-300">
        <button
          type="button"
          onClick={goPrevious}
          disabled={currentPage === 1}
          className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {"<"}
        </button>
        <span className="rounded-full bg-[linear-gradient(135deg,#7ee7d7_0%,#5fb8ff_100%)] px-3 py-1 font-semibold text-slate-950 shadow-[0_10px_20px_rgba(34,211,238,0.18)]">
          {currentPage}
        </span>
        <button
          type="button"
          onClick={goNext}
          disabled={currentPage === totalPages}
          className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {">"}
        </button>
      </div>
    </section>
  );
}
