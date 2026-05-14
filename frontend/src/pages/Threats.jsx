import React, { useEffect, useState } from 'react';
import { threatService } from '../services/api';
import { 
  ShieldAlert, 
  ExternalLink, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Terminal,
  Users,
  Clock,
  ShieldCheck,
  Info,
  Monitor
} from 'lucide-react';

const SeverityIndicator = ({ severity }) => {
  const configs = {
    Critical: { color: 'text-accent', bg: 'bg-accent/5', border: 'border-accent/10', icon: AlertCircle },
    High: { color: 'text-orange-500', bg: 'bg-orange-500/5', border: 'border-orange-500/10', icon: AlertTriangle },
    Medium: { color: 'text-yellow-500', bg: 'bg-yellow-500/5', border: 'border-yellow-500/10', icon: Info },
    Low: { color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/10', icon: ShieldCheck },
  };
  
  const config = configs[severity] || configs.Low;
  const Icon = config.icon;
  
  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${config.bg} ${config.color} ${config.border}`}>
      <Icon size={12} />
      <span className="text-[10px] font-bold uppercase tracking-wider">{severity}</span>
    </div>
  );
};

const Threats = () => {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThreats();
  }, []);

  const fetchThreats = async () => {
    try {
      const res = await threatService.getThreats();
      setThreats(res.data);
    } catch (err) {
      console.error('Failed to fetch threats', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await threatService.updateStatus(id, status);
      fetchThreats();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">Threats</h1>
          <p className="text-slate-500 text-sm">Real-time analysis of anomalous system activity.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => {
              import('react-hot-toast').then(t => t.default("Filter functionality coming soon."));
            }}
            className="secondary-button text-xs py-2 px-4"
          >
            <Filter size={16} />
            Filter
          </button>
          <button 
            onClick={() => {
              import('react-hot-toast').then(t => t.default.success("Exporting threat database..."));
            }}
            className="primary-button text-xs py-2 px-4"
          >
            <ExternalLink size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Threats Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-sm">Loading threats...</div>
        ) : threats.length === 0 ? (
          <div className="glass-card p-20 text-center">
            <ShieldCheck size={48} className="mx-auto mb-4 text-slate-700" />
            <h3 className="text-xl font-bold text-white mb-2">System Secure</h3>
            <p className="text-slate-500 text-sm">No threats detected in the current environment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {threats.map((threat) => (
              <div key={threat.id} className="glass-card p-5 flex flex-col md:flex-row gap-6 border-l-4"
                style={{ borderLeftColor: threat.severity === 'Critical' ? '#f43f5e' : threat.severity === 'High' ? '#f97316' : '#38bdf8' }}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                  threat.severity === 'Critical' ? 'bg-accent/10 text-accent' : 
                  threat.severity === 'High' ? 'bg-orange-500/10 text-orange-500' : 'bg-primary/10 text-primary'
                }`}>
                  <ShieldAlert size={24} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-white truncate">{threat.title}</h3>
                        <div className="flex gap-2">
                          <SeverityIndicator severity={threat.severity} />
                          <span className={`status-badge ${threat.status === 'open' ? 'text-accent border-accent/20 bg-accent/5' : 'text-success border-success/20 bg-success/5'}`}>
                            {threat.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-slate-500 uppercase tracking-wider">
                        <span className="flex items-center gap-1"><Monitor size={12} /> {threat.device_name || 'System'}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(threat.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-lg border border-white/5 mb-4">
                    <p className="text-sm text-slate-300 leading-relaxed">{threat.description}</p>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-4 pt-4 border-t border-white/5">
                    <div className="flex-1 text-sm">
                      <span className="text-success font-bold uppercase text-[10px] block mb-0.5">Recommended Action</span>
                      <p className="text-white font-medium">{threat.recommendation}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {threat.status === 'open' ? (
                        <button 
                          onClick={() => handleStatusUpdate(threat.id, 'resolved')}
                          className="primary-button text-xs py-1.5"
                        >
                          Resolve
                        </button>
                      ) : (
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                          Resolved
                        </span>
                      )}
                      <button className="secondary-button p-2">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


export default Threats;

