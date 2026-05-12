import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { ShieldAlert, Mail, Lock, Loader2 } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#05060a]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md glass-card p-10 relative z-10 shadow-2xl">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 mb-6 rotate-3">
            <ShieldAlert className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Threat<span className="text-primary">IQ</span></h1>
          <p className="text-muted mt-2 text-center">Secure access to your threat intelligence console</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                type="email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-primary/50 focus:ring-4 ring-primary/10 transition-all outline-none"
                placeholder="admin@threatiq.io"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-primary/50 focus:ring-4 ring-primary/10 transition-all outline-none"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full primary-button py-4 mt-4 flex items-center justify-center gap-2 group"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <span>Sign In</span>
                <ShieldAlert className="group-hover:translate-x-1 transition-transform" size={18} />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted">
          Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Register now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
