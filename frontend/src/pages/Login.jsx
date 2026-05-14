import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { ShieldAlert, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.login(formData);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user_name', res.data.user_name || 'Analyst');
      localStorage.setItem('user_email', res.data.user_email || formData.username);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 font-sans">
      <div className="w-full max-w-sm">
        <div className="glass-card p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-slate-950 shadow-lg mb-4">
              <ShieldAlert size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">ThreatIQ</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Security Platform</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-accent/5 border border-accent/20 text-accent text-xs font-bold text-center uppercase tracking-wider">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  required
                  className="modern-input !pl-12 py-2.5 text-sm"
                  placeholder="analyst@threatiq.io"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="password"
                  required
                  className="modern-input !pl-12 py-2.5 text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full primary-button py-2.5 text-sm mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  <span>Signing in...</span>
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-slate-500 mb-2">New to the platform?</p>
            <Link to="/register" className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">
              Create Account
            </Link>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center items-center opacity-40">
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Build v2.5.0</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
