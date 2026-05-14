import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/api';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Cpu, 
  Terminal,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const StatCard = ({ label, value, icon: Icon, trend, colorClass, onClick }) => (
  <div 
    onClick={onClick}
    className="glass-card p-6 cursor-pointer hover:border-primary/30 hover:bg-white/[0.04] transition-all group"
  >
    <div className="flex justify-between items-center mb-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border border-white/5 transition-transform group-hover:scale-110 ${colorClass.bg} ${colorClass.text}`}>
        <Icon size={20} />
      </div>
      {trend !== undefined && (
        <div className={`text-[10px] font-bold px-2 py-1 rounded border ${trend > 0 ? 'text-success border-success/20 bg-success/5' : 'text-accent border-accent/20 bg-accent/5'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
    
    <div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 group-hover:text-slate-400 transition-colors">{label}</p>
      <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await dashboardService.getSummary();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-4">
      <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Dashboard...</p>
    </div>
  );

  const stats = [
    { label: 'Active Endpoints', value: data?.stats.active_agents || 0, icon: Cpu, trend: 12, colorClass: { bg: 'bg-blue-500/10', text: 'text-blue-400' }, onClick: () => navigate('/agents') },
    { label: 'Critical Events', value: data?.stats.critical_threats || 0, icon: AlertTriangle, trend: -5, colorClass: { bg: 'bg-rose-500/10', text: 'text-rose-400' }, onClick: () => navigate('/threats') },
    { label: 'Intel Records', value: data?.stats.total_logs?.toLocaleString() || 0, icon: Terminal, trend: 24, colorClass: { bg: 'bg-indigo-500/10', text: 'text-indigo-400' }, onClick: () => navigate('/logs') },
    { label: 'Malware Neutralized', value: data?.stats.malware_detected || 0, icon: ShieldCheck, colorClass: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' }, onClick: () => navigate('/malware') },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => <StatCard key={idx} {...s} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Threat Trends Chart */}
        <div className="xl:col-span-2 glass-card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Threat Trends</h3>
              <p className="text-[11px] text-slate-500">Real-time threat activity monitor</p>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Monitoring</span>
            </div>
          </div>

          <div className="flex-1 h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.trends || []}>
                <defs>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#475569', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em'}} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#475569', fontSize: 10, fontWeight: 900}} 
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#0f172a', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '8px',
                    fontSize: '11px',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{color: '#38bdf8'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="threats" 
                  stroke="#38bdf8" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorThreats)" 
                  animationDuration={2500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="glass-card flex flex-col">
          <div className="p-5 border-b border-white/5 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white">Recent Activity</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Live System Logs</p>
            </div>
            <button 
              onClick={() => navigate('/threats')}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all"
            >
              <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar max-h-[400px]">
            {data?.recent_alerts.map((alert, idx) => (
              <div key={alert.id || idx} className="p-4 rounded-lg bg-white/5 border border-white/5">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-xs font-bold text-white line-clamp-1">{alert.title}</h4>
                  <span className="text-[10px] text-slate-500 font-bold">
                    {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 mb-3">{alert.description}</p>
                  
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{alert.device_name?.split('.')[0] || 'System'}</span>
                  <span className={`status-badge ${
                    alert.severity === 'Critical' ? 'text-accent border-accent/20 bg-accent/5' : 
                    alert.severity === 'High' ? 'text-orange-500 border-orange-500/20 bg-orange-500/5' : 
                    'text-primary border-primary/20 bg-primary/5'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              </div>
            ))}
            
            {(!data?.recent_alerts || data.recent_alerts.length === 0) && (
              <div className="flex flex-col items-center justify-center py-20 gap-6 opacity-20 group-hover:opacity-40 transition-opacity duration-1000">
                <div className="w-16 h-16 rounded-3xl border border-white/20 flex items-center justify-center rotate-45 group-hover:rotate-[225deg] transition-transform duration-1000">
                   <ShieldCheck size={32} className="-rotate-45 group-hover:-rotate-[225deg] transition-transform duration-1000" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">System Pulse Clear</p>
              </div>
            )}
          </div>
          
          <div className="p-5 border-t border-white/5">
            <button 
              onClick={() => navigate('/logs')}
              className="w-full secondary-button text-xs"
            >
              View Full History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;

