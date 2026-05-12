import React, { useEffect, useState } from 'react';
import { threatService } from '../services/api';
import { 
  ShieldAlert, 
  ExternalLink, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';

const SeverityBadge = ({ severity }) => {
  const styles = {
    Critical: 'bg-accent/10 text-accent border-accent/20',
    High: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    Medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    Low: 'bg-primary/10 text-primary border-primary/20',
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${styles[severity] || styles.Low}`}>
      {severity}
    </span>
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Threat Intelligence</h1>
          <p className="text-muted text-sm mt-1">Real-time analysis of suspicious activities and malware</p>
        </div>
        <div className="flex gap-3">
          <button className="secondary-button flex items-center gap-2">
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button className="primary-button">Export List</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-20 text-muted italic">Scanning threat landscape...</div>
        ) : threats.length === 0 ? (
          <div className="glass-card p-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-muted">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold">All Systems Clear</h3>
            <p className="text-muted mt-2 max-w-sm">No active threats detected on your monitored agents.</p>
          </div>
        ) : threats.map((threat) => (
          <div key={threat.id} className="glass-card p-6 flex flex-col md:flex-row gap-6 items-start hover:border-white/10 transition-colors">
            <div className={`p-4 rounded-2xl shrink-0 ${
              threat.severity === 'Critical' ? 'bg-accent/10 text-accent' : 
              threat.severity === 'High' ? 'bg-orange-500/10 text-orange-500' : 'bg-primary/10 text-primary'
            }`}>
              {threat.severity === 'Critical' ? <AlertCircle size={28} /> : <AlertTriangle size={28} />}
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold">{threat.title}</h3>
                    <SeverityBadge severity={threat.severity} />
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      threat.status === 'open' ? 'bg-accent/20 text-accent' : 'bg-emerald-500/20 text-emerald-500'
                    }`}>
                      {threat.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted">Device: <span className="text-white/80">{threat.device_name}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted font-mono">{new Date(threat.created_at).toLocaleString()}</p>
                </div>
              </div>

              <p className="text-sm text-white/70 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5 font-mono text-[13px]">
                {threat.description}
              </p>

              <div className="flex items-center gap-4 pt-2">
                <div className="flex-1">
                  <p className="text-[10px] uppercase font-bold text-muted mb-1">Recommendation</p>
                  <p className="text-xs text-emerald-400">{threat.recommendation}</p>
                </div>
                <div className="flex gap-2">
                  {threat.status === 'open' && (
                    <button 
                      onClick={() => handleStatusUpdate(threat.id, 'resolved')}
                      className="text-xs font-bold py-2 px-4 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
                    >
                      Resolve
                    </button>
                  )}
                  <button className="p-2 text-muted hover:text-white transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Threats;
