import React, { useEffect, useState } from 'react';
import { logService } from '../services/api';
import { 
  Terminal, 
  Activity, 
  Search, 
  Filter,
  Monitor,
  Clock,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await logService.getLogs();
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to fetch logs', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.device_name.toLowerCase().includes(search.toLowerCase()) ||
    log.log.toLowerCase().includes(search.toLowerCase()) ||
    log.event_id.toString().includes(search)
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">System Telemetry</h1>
          <p className="text-muted text-sm mt-1">Live feed of Windows Security and system events</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:border-primary/50 outline-none transition-all w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="secondary-button flex items-center gap-2">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Device</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Event ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider text-right">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-20 text-center text-muted">Awaiting telemetry stream...</td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-20 text-center text-muted italic">No logs found matching your criteria.</td></tr>
              ) : filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-xs font-mono text-muted">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Monitor size={14} className="text-primary" />
                      <span className="text-sm font-medium">{log.device_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold px-2 py-1 rounded bg-white/5 border border-white/10">
                      {log.event_id}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted">
                    {log.source}
                  </td>
                  <td className="px-6 py-4 max-w-md">
                    <div className="text-xs text-white/70 font-mono truncate" title={log.log}>
                      {log.log}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
                      log.risk_score >= 80 ? 'bg-accent/10 text-accent' :
                      log.risk_score >= 50 ? 'bg-orange-500/10 text-orange-500' :
                      'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {log.risk_score}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Logs;
