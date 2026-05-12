import React, { useEffect, useState } from 'react';
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

const StatCard = ({ label, value, icon: Icon, trend, color }) => (
  <div className="glass-card p-6 relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-125 duration-500`}></div>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-${color}/10 text-${color}`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`flex items-center text-xs font-medium ${trend > 0 ? 'text-emerald-500' : 'text-accent'}`}>
          {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div>
      <p className="text-muted text-sm font-medium mb-1">{label}</p>
      <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const chartData = data?.trends || [];

  if (loading) return <div className="text-center py-20 text-muted">Loading security telemetry...</div>;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Active Agents" 
          value={data?.stats.active_agents || 0} 
          icon={Cpu} 
          color="primary"
          trend={12}
        />
        <StatCard 
          label="Critical Threats" 
          value={data?.stats.critical_threats || 0} 
          icon={AlertTriangle} 
          color="accent"
          trend={-5}
        />
        <StatCard 
          label="Total Logs Processed" 
          value={data?.stats.total_logs?.toLocaleString() || 0} 
          icon={Terminal} 
          color="secondary"
          trend={24}
        />
        <StatCard 
          label="Malware Detected" 
          value={data?.stats.malware_detected || 0} 
          icon={ShieldCheck} 
          color="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Chart */}
        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold">Threat Activity</h3>
              <p className="text-sm text-muted">Weekly detection trends and log volume</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#12141c', border: '1px solid #ffffff10', borderRadius: '12px'}}
                  itemStyle={{color: '#fff'}}
                />
                <Area type="monotone" dataKey="threats" stroke="#f43f5e" fillOpacity={1} fill="url(#colorThreats)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-6">Recent Alerts</h3>
          <div className="space-y-6">
            {data?.recent_alerts.map((alert) => (
              <div key={alert.id} className="flex gap-4 group">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  alert.severity === 'Critical' ? 'bg-accent shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 
                  alert.severity === 'High' ? 'bg-orange-500' : 'bg-primary'
                }`}></div>
                <div>
                  <h4 className="text-sm font-semibold group-hover:text-primary transition-colors cursor-pointer">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{alert.description.substring(0, 80)}...</p>
                  <p className="text-[10px] text-muted/50 mt-2 font-mono uppercase tracking-wider">
                    {new Date(alert.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {(!data?.recent_alerts || data.recent_alerts.length === 0) && (
              <p className="text-center text-muted py-10 italic">No recent alerts found</p>
            )}
          </div>
          <button className="w-full mt-8 py-3 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl border border-primary/10 transition-colors">
            View All Threats
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
