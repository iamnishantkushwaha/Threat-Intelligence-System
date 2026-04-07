import { useState } from "react";
import Card from "../components/Card.jsx";
import Badge from "../components/Badge.jsx";

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[18px] border border-white/10 bg-white/5 p-4">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-8 w-14 rounded-full border transition duration-300 ${
          checked
            ? "border-cyan-300/30 bg-cyan-400/25"
            : "border-white/10 bg-white/10"
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition duration-300 ${
            checked ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [autoRemediation, setAutoRemediation] = useState(false);

  return (
    <div className="space-y-5">
      <Card className="px-5 py-5">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          Settings
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Manage notification behavior, API health, and system preferences.
        </p>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4 px-5 py-5">
          <div>
            <h3 className="text-[15px] font-semibold text-slate-100">
              Preferences
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Simple controls for the current cybersecurity workspace.
            </p>
          </div>
          <Toggle
            checked={notifications}
            onChange={setNotifications}
            label="Enable notifications"
            description="Receive alerts when high-severity events are detected."
          />
          <Toggle
            checked={autoRemediation}
            onChange={setAutoRemediation}
            label="Auto remediation"
            description="Enable suggested mitigation actions for repeat offenders."
          />
        </Card>

        <Card className="space-y-4 px-5 py-5">
          <div>
            <h3 className="text-[15px] font-semibold text-slate-100">
              System Info
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Basic runtime and API state.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-300">API Status</span>
              <Badge variant="success">Online</Badge>
            </div>
            <div className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-300">Backend</span>
              <span className="text-sm font-medium text-white">FastAPI</span>
            </div>
            <div className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-300">Theme</span>
              <span className="text-sm font-medium text-white">
                Premium Dark SaaS
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
