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
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">Logs</h1>
          <p className="text-slate-500 text-sm">Security events and system telemetry stream.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="modern-input !pl-11 w-full sm:w-64 py-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => {
              import('react-hot-toast').then(t => t.default("Log filtering coming soon."));
            }}
            className="secondary-button py-2 px-4 text-sm"
          >
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Device</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-500 text-sm">Loading logs...</td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-500 text-sm">No logs found.</td></tr>
              ) : filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] border-b border-white/5 last:border-0 transition-colors">
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                    {new Date(log.timestamp).toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-white">{log.device_name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-slate-400">
                      {log.event_id}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-md">
                    <div className="text-xs text-slate-400 truncate" title={log.log}>
                      {log.log}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border ${
                      log.risk_score >= 80 ? 'bg-accent/5 text-accent border-accent/20' :
                      log.risk_score >= 50 ? 'bg-orange-500/5 text-orange-500 border-orange-500/20' :
                      'bg-success/5 text-success border-success/20'
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
