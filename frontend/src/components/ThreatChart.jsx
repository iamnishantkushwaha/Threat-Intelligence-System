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
    <div className="h-[220px] w-full animate-pulse rounded-[22px] bg-white/10" />
  );
}

export default function ThreatChart({ chartData = [], loading }) {
  return (
    <section className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl md:px-5 md:py-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold tracking-[0.01em] text-slate-100">
            Threat Severity Overview
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            High, medium, and low alert counts
          </p>
        </div>
      </div>

      <div className="mt-4 h-[250px]">
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
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(8, 15, 28, 0.92)",
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
