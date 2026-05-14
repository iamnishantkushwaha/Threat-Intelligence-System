import React, { useEffect, useState } from 'react';
import { agentService } from '../services/api';
import { 
  Users, 
  Plus, 
  Trash2, 
  Monitor, 
  Key, 
  Calendar, 
  Clock,
  X,
  Copy,
  Check,
  Download
} from 'lucide-react';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [createdAgent, setCreatedAgent] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await agentService.getAgents();
      setAgents(res.data);
    } catch (err) {
      console.error('Failed to fetch agents', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    try {
      const res = await agentService.registerAgent({ device_name: newAgentName });
      setCreatedAgent(res.data);
      fetchAgents();
    } catch (err) {
      console.error('Failed to register agent', err);
    }
  };

  const handleDeleteAgent = async (id) => {
    if (window.confirm('Confirm permanent decommissioning of this agent node?')) {
      try {
        await agentService.deleteAgent(id);
        fetchAgents();
      } catch (err) {
        console.error('Failed to delete agent', err);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPackage = async () => {
    try {
      const response = await agentService.downloadAgent();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ThreatIQ-Agent-Production.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">Agents</h1>
          <p className="text-slate-500 text-sm">Manage distributed security agents in real-time.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleDownloadPackage}
            className="secondary-button text-xs py-2 px-4"
          >
            <Download size={16} />
            Download Agent
          </button>
          
          <button 
            onClick={() => { setShowModal(true); setCreatedAgent(null); }}
            className="primary-button text-xs py-2 px-4"
          >
            <Plus size={16} />
            Register Agent
          </button>
        </div>
      </div>

      {/* Agents Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.01]">
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Operating System</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Last Seen</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-500 text-sm">Loading agents...</td></tr>
              ) : agents.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-500 text-sm">No agents registered.</td></tr>
              ) : agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-white/[0.02] border-b border-white/5 last:border-0 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                        <Monitor size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{agent.device_name}</span>
                        <span className="text-[10px] font-mono text-slate-500">{agent.id.substring(0, 12)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`status-badge ${agent.status === 'active' ? 'text-success border-success/20 bg-success/5' : 'text-slate-500 border-white/5 bg-white/5'}`}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-300 font-bold">{agent.os || 'Unknown'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-300">
                      {agent.last_seen ? new Date(agent.last_seen).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Never'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteAgent(agent.id)}
                      className="p-2 text-slate-500 hover:text-accent transition-colors"
                      title="Delete Agent"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="w-full max-w-md relative z-10">
            <div className="glass-card p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Register Agent</h2>
                  <p className="text-slate-500 text-xs">Provision a new security endpoint.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              {!createdAgent ? (
                <form onSubmit={handleCreateAgent} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Device Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. WORKSTATION-01"
                      className="modern-input py-2 text-sm"
                      value={newAgentName}
                      onChange={(e) => setNewAgentName(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="w-full primary-button py-2 text-sm font-bold">
                    Register Agent
                  </button>
                </form>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-4 rounded-lg bg-success/5 border border-success/10 flex items-center gap-4">
                    <ShieldCheck size={24} className="text-success" />
                    <span className="text-sm font-bold text-success">Agent Registered Successfully</span>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { label: 'Agent ID', value: createdAgent.id },
                      { label: 'API Key', value: createdAgent.api_key }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.label}</label>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-black/40 rounded-lg px-4 py-2 text-xs font-mono border border-white/5 text-slate-300 break-all">
                            {item.value}
                          </div>
                          <button 
                            onClick={() => copyToClipboard(item.value)} 
                            className="p-2 bg-primary text-slate-950 rounded-lg hover:bg-primary/90 transition-colors"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex items-center justify-between gap-4 border-t border-white/5">
                    <div className="h-4">
                      {copied && (
                        <div className="flex items-center gap-2 text-success text-[10px] font-bold uppercase tracking-wider">
                          <Check size={12} /> Copied
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => setShowModal(false)}
                      className="secondary-button py-2 px-6 text-xs font-bold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Agents;

