import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import TopNav from "./components/TopNav.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Alerts from "./pages/Alerts.jsx";
import Logs from "./pages/Logs.jsx";
import Analytics from "./pages/Analytics.jsx";
import Settings from "./pages/Settings.jsx";
import { fetchAnalysis, fetchLogs, fetchSummary } from "./services/api.js";
import { matchesDate, matchesQuery } from "./utils/threat.js";

const PAGE_META = {
  dashboard: {
    title: "Threat Intelligence Control Center",
    description:
      "Executive overview of live incidents, security posture, and operational risk.",
  },
  alerts: {
    title: "Alerts Workspace",
    description:
      "Review escalations, inspect severity, and isolate suspicious IP activity.",
  },
  logs: {
    title: "Activity Ledger",
    description:
      "Inspect authentication traffic, server events, and user-level activity trails.",
  },
  analytics: {
    title: "Threat Analytics",
    description:
      "Track attack movement, event distribution, and behavior patterns over time.",
  },
  settings: {
    title: "Workspace Settings",
    description:
      "Manage operational preferences and keep the monitoring environment aligned.",
  },
};

const MOBILE_NAV_ITEMS = [
  { label: "Dashboard", key: "dashboard" },
  { label: "Alerts", key: "alerts" },
  { label: "Logs", key: "logs" },
  { label: "Analytics", key: "analytics" },
  { label: "Settings", key: "settings" },
];

export default function App() {
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [aiPrediction, setAiPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    let active = true;

    const loadAppData = async () => {
      setLoading(true);
      setError("");

      try {
        const [summaryData, analysisData, logsData] = await Promise.all([
          fetchSummary(),
          fetchAnalysis(),
          fetchLogs(),
        ]);

        if (!active) {
          return;
        }

        setSummary(summaryData);
        setAlerts(analysisData.alerts);
        setAiPrediction(analysisData.aiPrediction);
        setLogs(logsData);
      } catch (loadError) {
        console.error("Failed to load application data:", loadError);
        if (active) {
          setError("We could not load the dashboard data. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadAppData();

    return () => {
      active = false;
    };
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const queryMatches = matchesQuery(
        [log.timestamp, log.ip, log.event_type, log.status, log.username],
        searchQuery,
      );
      const dateMatches = matchesDate(log.timestamp, selectedDate);
      return queryMatches && dateMatches;
    });
  }, [logs, searchQuery, selectedDate]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) =>
      matchesQuery(
        [
          alert.type,
          alert.ip,
          alert.summary,
          alert.severity,
          alert.country,
          alert.isp,
          alert.domain,
          alert.usage_type,
        ],
        searchQuery,
      ),
    );
  }, [alerts, searchQuery]);

  const highThreatCount = useMemo(
    () => filteredAlerts.filter((alert) => alert.severity === "High").length,
    [filteredAlerts],
  );

  const uniqueIps = useMemo(
    () => new Set(filteredLogs.map((log) => log.ip).filter(Boolean)).size,
    [filteredLogs],
  );

  const successfulEvents = useMemo(
    () => filteredLogs.filter((log) => log.status === "success").length,
    [filteredLogs],
  );

  const postureScore = filteredLogs.length
    ? Math.round((successfulEvents / filteredLogs.length) * 100)
    : 100;

  const lastUpdated =
    filteredLogs[0]?.timestamp || logs[0]?.timestamp || "Live feed";

  const pageMeta = PAGE_META[activePage] || PAGE_META.dashboard;

  const retry = () => {
    setLoading(true);
    setError("");
    Promise.all([fetchSummary(), fetchAnalysis(), fetchLogs()])
      .then(([summaryData, analysisData, logsData]) => {
        setSummary(summaryData);
        setAlerts(analysisData.alerts);
        setAiPrediction(analysisData.aiPrediction);
        setLogs(logsData);
      })
      .catch((retryError) => {
        console.error("Retry failed:", retryError);
        setError("We could not load the dashboard data. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  const sharedPageProps = {
    summary,
    alerts: filteredAlerts,
    logs: filteredLogs,
    aiPrediction,
    loading,
    onNavigate: setActivePage,
  };

  const renderPage = () => {
    if (activePage === "alerts") {
      return <Alerts alerts={filteredAlerts} loading={loading} />;
    }

    if (activePage === "logs") {
      return <Logs logs={filteredLogs} loading={loading} />;
    }

    if (activePage === "analytics") {
      return <Analytics logs={filteredLogs} loading={loading} />;
    }

    if (activePage === "settings") {
      return <Settings />;
    }

    return <Dashboard {...sharedPageProps} />;
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-5 text-slate-100 md:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute left-1/2 top-0 h-[360px] w-[560px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -right-16 top-48 h-[320px] w-[320px] rounded-full bg-amber-300/8 blur-3xl" />
        <div className="absolute -left-20 bottom-16 h-[280px] w-[280px] rounded-full bg-emerald-300/8 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-[1600px] gap-5">
        <Sidebar
          activeSection={activePage}
          onNavigate={setActivePage}
          postureScore={postureScore}
          totalAlerts={summary?.total_alerts ?? 0}
          highThreatCount={summary?.high_threats ?? 0}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-5 overflow-y-auto pb-6 pr-1">
          <TopNav
            pageTitle={pageMeta.title}
            pageDescription={pageMeta.description}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            highThreatCount={highThreatCount}
            uniqueIps={uniqueIps}
            lastUpdated={lastUpdated}
          />

          <div className="flex gap-2 overflow-x-auto pb-1 xl:hidden">
            {MOBILE_NAV_ITEMS.map((item) => {
              const isActive = activePage === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActivePage(item.key)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-cyan-300/20 bg-cyan-300/12 text-cyan-100"
                      : "border-white/10 bg-white/5 text-slate-300"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {error ? (
            <div className="rounded-[24px] border border-red-400/20 bg-red-500/10 px-4 py-4 text-sm text-red-100 shadow-[0_20px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
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

          {renderPage()}
        </div>
      </div>
    </main>
  );
}
