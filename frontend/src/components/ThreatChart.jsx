import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ChartSkeleton() {
  return (
    <div className="h-55 w-full animate-pulse rounded-[22px] bg-white/10" />
  );
}

export default function ThreatChart({ chartData = [], loading }) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,25,38,0.92)_0%,rgba(9,18,29,0.84)_100%)] px-5 py-5 shadow-[0_24px_80px_rgba(2,8,23,0.22)] ring-1 ring-white/6 backdrop-blur-2xl md:px-6 md:py-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
            Threat mix
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-100">
            Severity overview
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Compare critical, elevated, and low-priority detections at a glance.
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
          Live counts
        </span>
      </div>

      <div className="mt-5 h-[260px]">
        {loading ? (
          <ChartSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 18, right: 6, left: -10, bottom: 0 }}
            >
              <CartesianGrid stroke="rgba(148,163,184,0.16)" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#d8e2f0", fontSize: 13 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#d8e2f0", fontSize: 13 }}
              />
              <Tooltip
                cursor={{ fill: "rgba(148,163,184,0.08)" }}
                contentStyle={{
                  borderRadius: "18px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(8, 15, 28, 0.96)",
                  color: "#fff",
                  boxShadow: "0 18px 36px rgba(0,0,0,0.35)",
                }}
              />
              <Bar dataKey="value" radius={[16, 16, 4, 4]} barSize={72}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
