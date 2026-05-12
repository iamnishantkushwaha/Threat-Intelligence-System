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
  Check
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
    if (window.confirm('Are you sure you want to delete this agent?')) {
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Agents Management</h1>
          <p className="text-muted text-sm mt-1">Manage and monitor your deployed security agents</p>
        </div>
        <button 
          onClick={() => { setShowModal(true); setCreatedAgent(null); }}
          className="primary-button flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Register New Agent</span>
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Device Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">OS</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Last Seen</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Created</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan="6" className="px-6 py-10 text-center text-muted">Loading agents...</td></tr>
            ) : agents.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-10 text-center text-muted italic">No agents registered yet.</td></tr>
            ) : agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Monitor size={18} />
                    </div>
                    <span className="font-medium">{agent.device_name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`status-badge ${
                    agent.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted/10 text-muted'
                  }`}>
                    {agent.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-white/70 capitalize">{agent.os}</span>
                </td>
                <td className="px-6 py-4 text-sm text-muted">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {agent.last_seen ? new Date(agent.last_seen).toLocaleString() : 'Never'}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {new Date(agent.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDeleteAgent(agent.id)}
                    className="p-2 text-muted hover:text-accent transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Register Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="glass-card w-full max-w-lg p-8 relative z-10 shadow-2xl border-white/10 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold">Register Agent</h2>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-white">
                <X size={20} />
              </button>
            </div>

            {!createdAgent ? (
              <form onSubmit={handleCreateAgent} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Device Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Workstation-Alpha"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-primary/50 outline-none transition-all"
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                  />
                </div>
                <button type="submit" className="w-full primary-button py-3">
                  Generate Credentials
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm">
                  Agent registered successfully! Copy these credentials to your <code>config.json</code>.
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-muted font-bold">Agent ID</label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-black/40 rounded-lg px-4 py-2 text-xs font-mono border border-white/5 overflow-hidden text-ellipsis">
                        {createdAgent.id}
                      </div>
                      <button onClick={() => copyToClipboard(createdAgent.id)} className="p-2 hover:bg-white/5 rounded-lg text-primary transition-colors">
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-muted font-bold">API Key</label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-black/40 rounded-lg px-4 py-2 text-xs font-mono border border-white/5 overflow-hidden text-ellipsis">
                        {createdAgent.api_key}
                      </div>
                      <button onClick={() => copyToClipboard(createdAgent.api_key)} className="p-2 hover:bg-white/5 rounded-lg text-primary transition-colors">
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  {copied && (
                    <span className="text-xs text-emerald-500 flex items-center gap-1">
                      <Check size={14} /> Copied to clipboard
                    </span>
                  )}
                  <button 
                    onClick={() => setShowModal(false)}
                    className="secondary-button py-2 ml-auto"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;
