import React, { useState, useEffect } from 'react';
import { breachService } from '../services/api';
import { 
  ShieldCheck, 
  Search, 
  AlertCircle, 
  Database, 
  History, 
  Loader2, 
  Lock,
  Mail,
  ShieldAlert,
  CheckCircle
} from 'lucide-react';

const BreachChecker = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [emailResult, setEmailResult] = useState(null);
  const [passwordResult, setPasswordResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await breachService.getHistory();
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleCheckEmail = async (e) => {
    e.preventDefault();
    setCheckingEmail(true);
    setEmailResult(null);
    try {
      const res = await breachService.checkEmail(email);
      setEmailResult(res.data);
      fetchHistory();
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleCheckPassword = async (e) => {
    e.preventDefault();
    setCheckingPassword(true);
    setPasswordResult(null);
    try {
      const res = await breachService.checkPassword(password);
      setPasswordResult(res.data);
      fetchHistory();
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingPassword(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">Breach Checker</h1>
          <p className="text-slate-500 text-sm">Check if your email or password has been compromised in a data breach.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Checker */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
              <Mail size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Email Audit</h3>
          </div>
          
          <form onSubmit={handleCheckEmail} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="email" 
                required
                placeholder="email@example.com"
                className="modern-input !pl-11 py-2 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={checkingEmail}
              className="primary-button bg-secondary hover:bg-secondary/90 px-4 py-2 font-bold text-xs"
            >
              {checkingEmail ? <Loader2 className="animate-spin" size={18} /> : 'Check Email'}
            </button>
          </form>

          {emailResult && (
            <div className="animate-fade-in pt-4">
              {emailResult.breach_count > 0 ? (
                <div className="p-6 rounded-xl bg-accent/5 border border-accent/10 space-y-4">
                  <div className="flex items-center gap-2 text-accent">
                    <ShieldAlert size={18} />
                    <h4 className="text-sm font-bold uppercase tracking-wider">Exposure Detected</h4>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">{emailResult.breach_count}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Known Breaches</span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {emailResult.breaches.map((b, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-white/5">
                        <span className="text-xs font-bold text-white uppercase">{b.source}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{b.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-success/5 border border-success/10 flex items-center gap-4">
                  <CheckCircle size={24} className="text-success" />
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase">No Exposure Found</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Email address is clean.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Password Checker */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Lock size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Password Audit</h3>
          </div>
          
          <form onSubmit={handleCheckPassword} className="flex gap-2">
            <div className="relative flex-1">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="password" 
                required
                placeholder="Enter password..."
                className="modern-input !pl-11 py-2 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={checkingPassword}
              className="primary-button px-4 py-2 font-bold text-xs"
            >
              {checkingPassword ? <Loader2 className="animate-spin" size={18} /> : 'Check Password'}
            </button>
          </form>

          {passwordResult && (
            <div className="animate-fade-in pt-4">
              {passwordResult.is_breached ? (
                <div className="p-6 rounded-xl bg-accent/5 border border-accent/10 space-y-4">
                  <div className="flex items-center gap-2 text-accent">
                    <ShieldAlert size={18} />
                    <h4 className="text-sm font-bold uppercase tracking-wider">Compromised Password</h4>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">{passwordResult.breach_count.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Exposures</span>
                  </div>

                  <div className="p-4 rounded-lg bg-accent text-slate-950">
                    <p className="text-[10px] font-bold uppercase mb-1">Recommendation</p>
                    <p className="text-xs font-bold leading-tight">{passwordResult.recommendation}</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-success/5 border border-success/10 flex items-center gap-4">
                  <ShieldCheck size={24} className="text-success" />
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase">Password Secure</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Zero exposures found.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <History size={18} className="text-secondary" />
            <h3 className="text-lg font-bold text-white">Recent Audits</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.01]">
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Target</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loadingHistory ? (
                <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-500 text-sm">Loading history...</td></tr>
              ) : history.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-500 text-sm">No audit history found.</td></tr>
              ) : history.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] border-b border-white/5 last:border-0 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">{item.target}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="status-badge text-[10px] text-slate-400 border-white/5 bg-white/5">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`status-badge ${
                      (item.breach_count > 0 || item.is_breached) 
                        ? 'text-accent border-accent/20 bg-accent/5' 
                        : 'text-success border-success/20 bg-success/5'
                    }`}>
                      {(item.breach_count > 0 || item.is_breached) ? 'Compromised' : 'Secure'}
                    </span>
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



export default BreachChecker;
