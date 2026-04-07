import { useMemo, useState } from "react";

const PAGE_SIZE = 4;

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
      <section className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl">
        <h2 className="text-[15px] font-semibold text-slate-100">Logs</h2>
        <div className="mt-4 space-y-2">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-11 animate-pulse rounded-xl bg-white/10"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-100">Logs</h2>
          <p className="mt-1 text-xs text-slate-400">Recent activity stream</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {visibleLogs.length ? (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/8">
          <table className="min-w-full border-collapse text-left text-[14px]">
            <thead>
              <tr className="bg-white/10 text-slate-200">
                <th className="px-4 py-3 font-semibold">Timestamp</th>
                <th className="px-4 py-3 font-semibold">IP Address</th>
                <th className="px-4 py-3 font-semibold">Event Type</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Username</th>
              </tr>
            </thead>
            <tbody>
              {visibleLogs.map((log, index) => (
                <tr
                  key={`${log.timestamp}-${index}`}
                  className="border-b border-white/8 bg-transparent"
                >
                  <td className="px-4 py-3 text-slate-200">{log.timestamp}</td>
                  <td className="px-4 py-3 text-slate-200">{log.ip}</td>
                  <td className="px-4 py-3 text-slate-200">{log.event_type}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-md px-3 py-1 text-xs font-medium ${
                        log.status === "success"
                          ? "bg-emerald-400/15 text-emerald-200"
                          : "bg-rose-400/15 text-rose-200"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-200">
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

      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-300">
        <button
          type="button"
          onClick={goPrevious}
          disabled={currentPage === 1}
          className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ‹
        </button>
        <span className="rounded-full bg-cyan-500 px-3 py-1 font-semibold text-white shadow-[0_10px_20px_rgba(34,211,238,0.18)]">
          {currentPage}
        </span>
        <button
          type="button"
          onClick={goNext}
          disabled={currentPage === totalPages}
          className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ›
        </button>
      </div>
    </section>
  );
}
