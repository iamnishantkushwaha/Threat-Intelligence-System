import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function TrendSkeleton() {
  return (
    <div className="h-65 w-full animate-pulse rounded-[22px] bg-white/10" />
  );
}

export default function TrendChart({ data = [], loading }) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,25,38,0.92)_0%,rgba(9,18,29,0.84)_100%)] px-5 py-5 shadow-[0_24px_80px_rgba(2,8,23,0.22)] ring-1 ring-white/6 backdrop-blur-2xl md:px-6 md:py-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
            Trendline
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-100">
            Alert movement over time
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Watch short-term spikes and see when risk starts accelerating.
          </p>
        </div>
        <span className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
          Telemetry
        </span>
      </div>

      <div className="mt-5 h-[270px]">
        {loading ? (
          <TrendSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 18, right: 6, left: -10, bottom: 0 }}
            >
              <CartesianGrid stroke="rgba(148,163,184,0.14)" vertical={false} />
              <XAxis
                dataKey="label"
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
                cursor={{ stroke: "rgba(103,232,249,0.2)" }}
                contentStyle={{
                  borderRadius: "18px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(8, 15, 28, 0.94)",
                  color: "#fff",
                  boxShadow: "0 18px 36px rgba(0,0,0,0.35)",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#7ee7d7"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "#07101f" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
