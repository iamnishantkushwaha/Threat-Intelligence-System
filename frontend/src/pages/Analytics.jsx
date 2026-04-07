import Card from "../components/Card.jsx";
import TrendChart from "../components/TrendChart.jsx";
import {
  getEventTypeDistribution,
  getTopIps,
  getTrendData,
} from "../utils/threat.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PIE_COLORS = ["#67e8f9", "#7c8cff", "#f6a13a", "#7ddb8c", "#ff7c7c"];

export default function Analytics({ logs = [], loading }) {
  const trendData = getTrendData(logs);
  const topIps = getTopIps(logs, 5);
  const eventTypes = getEventTypeDistribution(logs);

  return (
    <div className="space-y-5">
      <Card className="px-5 py-5">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          Analytics
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Advanced charting for threat trends, suspicious IPs, and event mix.
        </p>
      </Card>

      <TrendChart data={trendData} loading={loading} />

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="px-4 py-4 md:px-5 md:py-5">
          <h3 className="text-[15px] font-semibold text-slate-100">
            Top Attacking IPs
          </h3>
          <div className="mt-4 h-[280px]">
            {loading ? (
              <div className="h-full animate-pulse rounded-[22px] bg-white/10" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topIps}
                  layout="vertical"
                  margin={{ top: 8, right: 18, left: 6, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="rgba(148,163,184,0.14)"
                    vertical={false}
                  />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#d8e2f0", fontSize: 13 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="ip"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#d8e2f0", fontSize: 13 }}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "14px",
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(8, 15, 28, 0.94)",
                      color: "#fff",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#67e8f9"
                    radius={[0, 12, 12, 0]}
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="px-4 py-4 md:px-5 md:py-5">
          <h3 className="text-[15px] font-semibold text-slate-100">
            Event Type Distribution
          </h3>
          <div className="mt-4 h-[280px]">
            {loading ? (
              <div className="h-full animate-pulse rounded-[22px] bg-white/10" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventTypes}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={98}
                    paddingAngle={4}
                  >
                    {eventTypes.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "14px",
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(8, 15, 28, 0.94)",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {eventTypes.map((entry, index) => (
              <span
                key={entry.name}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-slate-300"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: PIE_COLORS[index % PIE_COLORS.length] }}
                />
                {entry.name}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
