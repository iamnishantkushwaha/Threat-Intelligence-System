import React, { useState, useEffect } from 'react';
import { emailService } from '../services/api';
import { 
  MailSearch, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  History, 
  Loader2, 
  Send,
  ExternalLink
} from 'lucide-react';

const EmailAnalyzer = () => {
  const [formData, setFormData] = useState({ sender: '', subject: '', text: '' });
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await emailService.getHistory();
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setAnalyzing(true);
    try {
      const res = await emailService.analyze(formData);
      setResult(res.data);
      fetchHistory();
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">Email Analyzer</h1>
          <p className="text-slate-500 text-sm">Analyze email headers and content for phishing markers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Analyzer Form */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <MailSearch size={20} />
              </div>
              <h3 className="text-lg font-bold text-white">Security Scan</h3>
            </div>
            
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sender Address</label>
                  <input 
                    type="email" 
                    placeholder="support@example.com"
                    className="modern-input py-2 text-sm"
                    value={formData.sender}
                    onChange={(e) => setFormData({...formData, sender: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Subject Line</label>
                  <input 
                    type="text" 
                    placeholder="Email Subject"
                    className="modern-input py-2 text-sm"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email Content</label>
                <textarea 
                  rows="6"
                  placeholder="Paste the full email body here..."
                  className="modern-input resize-none text-sm p-4 min-h-[150px]"
                  value={formData.text}
                  onChange={(e) => setFormData({...formData, text: e.target.value})}
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={analyzing || !formData.text}
                className="w-full primary-button py-2.5 font-bold flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Scan for Threats</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Result Display */}
        <div className="lg:col-span-2 h-full">
          {result ? (
            <div className="glass-card p-6 h-full flex flex-col border-primary/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Analysis Result</h3>
                <span className={`status-badge ${
                  result.severity === 'Critical' ? 'text-accent border-accent/20 bg-accent/5' :
                  result.severity === 'High' ? 'text-orange-500 border-orange-500/20 bg-orange-500/5' :
                  result.severity === 'Medium' ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5' :
                  'text-success border-success/20 bg-success/5'
                }`}>
                  {result.severity} Risk
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 p-6 rounded-xl bg-white/[0.02] border border-white/5 mb-6">
                <div className={`text-4xl font-bold ${
                  result.risk_score >= 70 ? 'text-accent' :
                  result.risk_score >= 40 ? 'text-orange-500' : 'text-primary'
                }`}>
                  {result.risk_score}%
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Risk Score</p>
              </div>

              {result.reasons.length > 0 && (
                <div className="space-y-4 flex-1">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Detected Markers</p>
                  <div className="space-y-3">
                    {result.reasons.map((reason, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/5 items-start">
                        <ShieldAlert size={16} className={result.risk_score >= 70 ? 'text-accent' : 'text-primary'} />
                        <span className="text-xs text-slate-300 font-bold">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Recommendation</p>
                <p className="text-xs text-white font-bold">{result.recommendation}</p>
              </div>
            </div>
          ) : (
            <div className="glass-card h-full flex flex-col items-center justify-center text-center p-12 text-slate-600">
              <MailSearch size={48} className="mb-4 opacity-20" />
              <h3 className="text-xl font-bold text-white/20">Awaiting Input</h3>
              <p className="text-xs uppercase tracking-wider">Analyze an email to see the result here.</p>
            </div>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <History size={18} className="text-primary" />
            <h3 className="text-lg font-bold text-white">Recent Analyses</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.01]">
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sender</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Risk Score</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loadingHistory ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500 text-sm">Loading history...</td></tr>
              ) : history.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500 text-sm">No analysis history found.</td></tr>
              ) : history.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] border-b border-white/5 last:border-0 transition-colors cursor-pointer" onClick={() => setResult(item)}>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-white truncate max-w-[150px] block">{item.sender || 'Unknown'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-400 truncate max-w-[200px] block">{item.subject || 'No Subject'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        item.risk_score >= 70 ? 'bg-accent' :
                        item.risk_score >= 40 ? 'bg-orange-500' : 'bg-primary'
                      }`} />
                      <span className={`text-xs font-bold ${
                        item.risk_score >= 70 ? 'text-accent' :
                        item.risk_score >= 40 ? 'text-orange-500' : 'text-primary'
                      }`}>{item.risk_score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`status-badge ${
                      item.severity === 'Critical' ? 'text-accent border-accent/20 bg-accent/5' :
                      item.severity === 'High' ? 'text-orange-500 border-orange-500/20 bg-orange-500/5' :
                      item.severity === 'Medium' ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5' :
                      'text-success border-success/20 bg-success/5'
                    }`}>{item.severity}</span>
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



export default EmailAnalyzer;
