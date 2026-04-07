import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import TopNav from "../components/TopNav.jsx";
import AiSummaryPanel from "../components/AiSummaryPanel.jsx";
import SummaryCard from "../components/SummaryCard.jsx";
import AlertCard from "../components/AlertCard.jsx";
import LogsTable from "../components/LogsTable.jsx";
import ThreatChart from "../components/ThreatChart.jsx";
import TrendChart from "../components/TrendChart.jsx";
import { fetchAnalysis, fetchLogs, fetchSummary } from "../services/api.js";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [summaryData, alertsData, logsData] = await Promise.all([
          fetchSummary(),
          fetchAnalysis(),
          fetchLogs(),
        ]);

        if (!active) {
          return;
        }

        setSummary(summaryData);
        setAlerts(alertsData);
        setLogs(logsData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        if (active) {
          setError("We could not load the dashboard data. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const filteredLogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesQuery =
        !query ||
        [log.timestamp, log.ip, log.event_type, log.status, log.username]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      const matchesDate = !selectedDate || String(log.timestamp).startsWith(selectedDate);

      return matchesQuery && matchesDate;
    });
  }, [logs, searchQuery, selectedDate]);

  const filteredAlerts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return alerts.filter((alert) => {
      const matchesQuery =
        !query ||
        [alert.type, alert.ip, alert.summary, alert.severity]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      return matchesQuery;
    });
  }, [alerts, searchQuery]);

  const chartData = useMemo(
    () => [
      {
        name: "High",
        value: summary?.high_threats ?? 0,
        fill: "#ef5a5a",
      },
      {
        name: "Medium",
        value: summary?.medium_threats ?? 0,
        fill: "#f6a13a",
      },
      {
        name: "Low",
        value: summary?.low_threats ?? 0,
        fill: "#72b369",
      },
    ],
    [summary],
  );

  const trendData = useMemo(() => {
    const map = new Map();

    filteredLogs.forEach((log) => {
      const timestamp = String(log.timestamp || "");
      const label = timestamp.slice(11, 16) || timestamp.slice(0, 10) || "Now";
      const isAlert =
        log.status === "failed" || log.event_type === "login_attempt" ||
        !["192.168.1.10", "10.0.0.5"].includes(log.ip);

      if (!map.has(label)) {
        map.set(label, 0);
      }

      if (isAlert) {
        map.set(label, map.get(label) + 1);
      }
    });

    return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
  }, [filteredLogs]);

  const aiSummary = useMemo(() => {
    const topHigh = filteredAlerts.find((alert) => alert.severity === "High") || alerts.find((alert) => alert.severity === "High");

    if (topHigh) {
      return `Multiple failed login attempts detected from IP ${topHigh.ip}. Possible brute-force attack. Immediate action recommended.`;
    }

    const mediumAlert = filteredAlerts.find((alert) => alert.severity === "Medium") || alerts.find((alert) => alert.severity === "Medium");

    if (mediumAlert) {
      return `${mediumAlert.type} detected from IP ${mediumAlert.ip}. Review the source and validate whether the activity is expected.`;
    }

    return "No high-risk pattern detected right now. Keep monitoring logs and alert trends for unusual activity.";
  }, [alerts, filteredAlerts]);

  const handleNavigate = (section) => {
    setActiveSection(section);

    const targets = {
      dashboard: "dashboard-top",
      alerts: "alerts-section",
      logs: "logs-section",
      analytics: "analytics-section",
      settings: "dashboard-top",
    };

    const targetId = targets[section];
    const element = targetId ? document.getElementById(targetId) : null;

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const retry = () => {
    setLoading(true);
    setError("");
    Promise.all([fetchSummary(), fetchAnalysis(), fetchLogs()])
      .then(([summaryData, alertsData, logsData]) => {
        setSummary(summaryData);
        setAlerts(alertsData);
        setLogs(logsData);
      })
      .catch((retryError) => {
        console.error("Retry failed:", retryError);
        setError("We could not load the dashboard data. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 text-slate-100 md:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-1/2 top-[-8rem] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute right-[-6rem] top-[12rem] h-[18rem] w-[18rem] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl gap-6">
        <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <div id="dashboard-top">
            <TopNav
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>

          {error ? (
            <div className="rounded-[18px] border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100 shadow-[0_20px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={retry}
                  className="self-start rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-400"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : null}

          <SummaryCard summary={summary} loading={loading} />

          <div id="analytics-section" className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <ThreatChart chartData={chartData} loading={loading} />
            <TrendChart data={trendData} loading={loading} />
          </div>

          <AiSummaryPanel text={aiSummary} loading={loading} />

          <section id="alerts-section" className="space-y-3">
            <h2 className="text-[15px] font-semibold text-slate-100">Recent Alerts</h2>
            <AlertCard alerts={filteredAlerts} loading={loading} />
          </section>

          <div id="logs-section">
            <LogsTable logs={filteredLogs} loading={loading} />
          </div>
        </div>
      </div>
    </main>
  );
}
