import React, { useState, useEffect, useRef } from 'react';
import { intelService } from '../services/api';
import {
  Globe, Search, Bug, MapPin, Loader2, ShieldAlert,
  ShieldCheck, History, Upload, Mail, ExternalLink, X
} from 'lucide-react';

const VerdictBadge = ({ verdict }) => {
  const styles = {
    malicious: 'text-accent border-accent/20 bg-accent/5',
    suspicious: 'text-orange-500 border-orange-500/20 bg-orange-500/5',
    clean: 'text-success border-success/20 bg-success/5',
    mock: 'text-slate-400 border-white/10 bg-white/5',
  };
  return (
    <span className={`status-badge ${styles[verdict] || styles.mock}`}>
      {verdict === 'clean' ? 'Clean' : verdict === 'malicious' ? 'Malicious' : verdict === 'suspicious' ? 'Suspicious' : 'Demo'}
    </span>
  );
};

const StatGrid = ({ items }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
    {items.map(s => (
      <div key={s.label} className={`text-center p-3 rounded-xl border ${s.bg} ${s.border}`}>
        <p className={`text-xl font-bold mb-0.5 ${s.color}`}>{s.val}</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{s.label}</p>
      </div>
    ))}
  </div>
);

const EngineList = ({ engines }) => {
  if (!engines || engines.length === 0) return null;
  return (
    <div className="mt-4 space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Flagged By</p>
      {engines.map((e, i) => (
        <div key={i} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
          <span className="text-xs font-bold text-white">{e.engine}</span>
          <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{e.verdict}</span>
        </div>
      ))}
    </div>
  );
};

const TABS = [
  { id: 'url', label: 'URL Scan', icon: Globe },
  { id: 'file', label: 'File Scan', icon: Upload },
  { id: 'hash', label: 'Hash Lookup', icon: Bug },
  { id: 'ip', label: 'IP Reputation', icon: MapPin },
  { id: 'email', label: 'Email Exposure', icon: Mail },
];

const ThreatIntel = () => {
  const [activeTab, setActiveTab] = useState('url');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [resultType, setResultType] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [url, setUrl] = useState('');
  const [hash, setHash] = useState('');
  const [ip, setIp] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);
  const fileRef = useRef();

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try { const r = await intelService.getHistory(); setHistory(r.data); }
    catch (e) { console.error(e); }
    finally { setLoadingHistory(false); }
  };

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      let res;
      if (activeTab === 'url') res = await intelService.scanUrl(url);
      else if (activeTab === 'hash') res = await intelService.checkHash(hash);
      else if (activeTab === 'ip') res = await intelService.checkIP(ip);
      else if (activeTab === 'email') res = await intelService.checkEmailExposure(email);
      else if (activeTab === 'file') {
        const fd = new FormData(); fd.append('file', file);
        res = await intelService.scanFile(fd);
      }
      setResult(res.data);
      setResultType(activeTab);
      fetchHistory();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const renderForm = () => {
    if (activeTab === 'url') return (
      <div className="relative">
        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
        <input type="url" required placeholder="https://suspicious-site.com" className="modern-input !pl-11 py-2.5 text-sm" value={url} onChange={e => setUrl(e.target.value)} />
      </div>
    );
    if (activeTab === 'hash') return (
      <div className="relative">
        <Bug className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
        <input type="text" required placeholder="SHA-256 / SHA-1 / MD5" className="modern-input !pl-11 py-2.5 text-sm font-mono" value={hash} onChange={e => setHash(e.target.value)} />
      </div>
    );
    if (activeTab === 'ip') return (
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
        <input type="text" required placeholder="IPv4 / IPv6 address" className="modern-input !pl-11 py-2.5 text-sm font-mono" value={ip} onChange={e => setIp(e.target.value)} />
      </div>
    );
    if (activeTab === 'email') return (
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
        <input type="email" required placeholder="user@example.com" className="modern-input !pl-11 py-2.5 text-sm" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
    );
    if (activeTab === 'file') return (
      <div
        className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 transition-colors"
        onClick={() => fileRef.current.click()}
      >
        <input ref={fileRef} type="file" className="hidden" onChange={e => setFile(e.target.files[0])} />
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <Upload size={20} className="text-primary" />
            <span className="text-sm font-bold text-white">{file.name}</span>
            <button type="button" onClick={e => { e.stopPropagation(); setFile(null); }} className="text-slate-500 hover:text-accent"><X size={16} /></button>
          </div>
        ) : (
          <>
            <Upload size={32} className="mx-auto mb-3 text-slate-600" />
            <p className="text-sm font-bold text-slate-400">Drop file or click to browse</p>
            <p className="text-xs text-slate-600 mt-1">Max 32 MB</p>
          </>
        )}
      </div>
    );
  };

  const renderResult = () => {
    if (!result) return null;
    const r = result.result || result;
    const scanType = resultType; // use saved type, not current active tab

    if (scanType === 'email') {
      const breaches = r.breaches || [];
      const googleLinked = breaches.filter(b => b.is_google_linked);
      const reputation = r.reputation || 'unknown';
      const repColor = reputation === 'high' ? 'text-success' : reputation === 'medium' ? 'text-yellow-500' : reputation === 'low' ? 'text-orange-500' : 'text-accent';

      return (
        <div className="space-y-4 animate-fade-in">
          {/* Summary Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Reputation', val: reputation.toUpperCase(), color: repColor, bg: 'bg-white/5', border: 'border-white/5' },
              { label: 'Breached', val: r.has_breach ? 'YES' : 'NO', color: r.has_breach ? 'text-accent' : 'text-success', bg: r.has_breach ? 'bg-accent/5' : 'bg-success/5', border: r.has_breach ? 'border-accent/10' : 'border-success/10' },
              { label: 'Suspicious', val: r.suspicious ? 'YES' : 'NO', color: r.suspicious ? 'text-orange-500' : 'text-success', bg: r.suspicious ? 'bg-orange-500/5' : 'bg-success/5', border: r.suspicious ? 'border-orange-500/10' : 'border-success/10' },
              { label: 'Profiles Found', val: r.profiles_found ?? breaches.length, color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/10' },
            ].map(s => (
              <div key={s.label} className={`text-center p-3 rounded-xl border ${s.bg} ${s.border}`}>
                <p className={`text-lg font-bold mb-0.5 ${s.color}`}>{s.val}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Warning flags */}
          {(r.malicious_activity || r.spam) && (
            <div className="flex gap-2 flex-wrap">
              {r.malicious_activity && <span className="status-badge text-accent border-accent/20 bg-accent/5">Malicious Activity Detected</span>}
              {r.spam && <span className="status-badge text-orange-500 border-orange-500/20 bg-orange-500/5">Known Spam Source</span>}
            </div>
          )}

          {/* Google-linked profiles */}
          {googleLinked.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2">⚠ Google-Linked Accounts Found</p>
              <div className="space-y-2">
                {googleLinked.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                    <img src={b.logo} className="w-5 h-5 rounded" alt="" onError={e => e.target.style.display='none'} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white">{b.site}</p>
                      <p className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">Supports Sign in with Google</p>
                    </div>
                    <span className="status-badge text-orange-500 border-orange-500/20 bg-orange-500/5">Linked</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other profiles */}
          {breaches.filter(b => !b.is_google_linked).length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Other Linked Profiles</p>
              <div className="flex flex-wrap gap-2">
                {breaches.filter(b => !b.is_google_linked).map((b, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                    <img src={b.logo} className="w-4 h-4 rounded" alt="" onError={e => e.target.style.display='none'} />
                    <span className="text-xs font-bold text-slate-300">{b.site}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {breaches.length === 0 && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-success/5 border border-success/10">
              <ShieldCheck size={20} className="text-success" />
              <p className="text-sm font-bold text-white">No linked profiles or breach indicators found.</p>
            </div>
          )}
        </div>
      );
    }

    if (scanType === 'ip') {
      return (
        <div className="space-y-4 animate-fade-in p-4 rounded-xl bg-white/5 border border-white/5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-lg font-bold text-white font-mono">{r.ipAddress}</p>
              <div className="flex gap-2 mt-1">
                <span className="status-badge text-indigo-400 border-indigo-500/20 bg-indigo-500/5">{r.countryCode}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">{r.isp}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Abuse Score</p>
              <p className={`text-2xl font-bold ${r.abuseConfidenceScore > 50 ? 'text-accent' : 'text-success'}`}>{r.abuseConfidenceScore}%</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase mb-1">Total Reports</p>
              <p className="text-lg font-bold text-white">{r.totalReports?.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase mb-1">Usage Type</p>
              <p className="text-xs font-bold text-white truncate">{r.usageType || 'N/A'}</p>
            </div>
          </div>
        </div>
      );
    }

    // URL, File, Hash results
    const malicious = r.malicious ?? 0;
    const suspicious = r.suspicious ?? 0;
    const verdict = malicious > 0 ? 'malicious' : suspicious > 0 ? 'suspicious' : r.verdict || 'clean';
    const statItems = [
      { label: 'Malicious', val: malicious, color: 'text-accent', bg: 'bg-accent/5', border: 'border-accent/10' },
      { label: 'Suspicious', val: suspicious, color: 'text-orange-500', bg: 'bg-orange-500/5', border: 'border-orange-500/10' },
      { label: 'Harmless', val: r.harmless ?? 0, color: 'text-success', bg: 'bg-success/5', border: 'border-success/10' },
      { label: 'Undetected', val: r.undetected ?? 0, color: 'text-slate-400', bg: 'bg-white/5', border: 'border-white/5' },
    ];
    return (
      <div className="animate-fade-in space-y-2">
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Verdict</p>
            <p className="text-sm font-bold text-white mt-0.5">{r.name || r.url || r.filename || result.target || 'Unknown'}</p>
          </div>
          <div className="flex items-center gap-2">
            {r.status === 'mock' && <span className="status-badge text-slate-400 border-white/10 bg-white/5">Demo</span>}
            <VerdictBadge verdict={verdict} />
          </div>
        </div>
        <StatGrid items={statItems} />
        <EngineList engines={r.engines} />
      </div>
    );
  };

  const tabLabels = { vt_url: 'URL', vt_file: 'File', vt_hash: 'Hash', abuseipdb_ip: 'IP', email_exposure: 'Email' };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Threat Intel</h1>
        <p className="text-slate-500 text-sm mt-1">Scan URLs, files, hashes, IPs and check email breach exposure.</p>
      </div>

      <div className="glass-card overflow-hidden">
        {/* Tab Bar */}
        <div className="flex border-b border-white/5 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id); setResult(null); setResultType(null); }}
              className={`flex items-center gap-2 px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                activeTab === t.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handle} className="space-y-4">
            {renderForm()}
            <button
              type="submit"
              disabled={loading || (activeTab === 'file' && !file)}
              className="primary-button py-2.5 px-6 text-sm font-bold"
            >
              {loading ? <><Loader2 className="animate-spin" size={16} /> Scanning...</> : <><Search size={16} /> Scan Now</>}
            </button>
          </form>

          {result && <div className="mt-6 pt-6 border-t border-white/5">{renderResult()}</div>}
        </div>
      </div>

      {/* History */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
          <History size={18} className="text-primary" />
          <h3 className="text-lg font-bold text-white">Scan History</h3>
          <span className="ml-auto text-[10px] font-bold text-slate-500 uppercase tracking-widest">{history.length} records</span>
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
                <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-500 text-sm">Loading...</td></tr>
              ) : history.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-500 text-sm">No scan history yet.</td></tr>
              ) : history.map(item => {
                const r = item.result || {};
                const mal = r.malicious ?? 0;
                const sus = r.suspicious ?? 0;
                const verdict = item.type === 'email_exposure'
                  ? (r.has_breach ? 'malicious' : 'clean')
                  : item.type === 'abuseipdb_ip'
                    ? (r.abuseConfidenceScore > 50 ? 'malicious' : 'clean')
                    : (mal > 0 ? 'malicious' : sus > 0 ? 'suspicious' : 'clean');

                return (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3 text-xs text-slate-500 font-mono">
                      {new Date(item.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-6 py-3 text-xs font-bold text-white font-mono max-w-xs truncate">{item.target}</td>
                    <td className="px-6 py-3">
                      <span className="status-badge text-slate-400 border-white/10 bg-white/5">{tabLabels[item.type] || item.type}</span>
                    </td>
                    <td className="px-6 py-3 text-right"><VerdictBadge verdict={verdict} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ThreatIntel;
