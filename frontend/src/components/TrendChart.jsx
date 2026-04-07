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
  return <div className="h-[260px] w-full animate-pulse rounded-[22px] bg-white/10" />;
}

export default function TrendChart({ data = [], loading }) {
  return (
    <section className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl md:px-5 md:py-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold tracking-[0.01em] text-slate-100">
            Alerts Over Time
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Trend of detected alerts from recent activity
          </p>
        </div>
      </div>

      <div className="mt-4 h-[260px]">
        {loading ? (
          <TrendSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 18, right: 6, left: -10, bottom: 0 }}>
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
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(8, 15, 28, 0.94)",
                  color: "#fff",
                  boxShadow: "0 18px 36px rgba(0,0,0,0.35)",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#67e8f9"
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
