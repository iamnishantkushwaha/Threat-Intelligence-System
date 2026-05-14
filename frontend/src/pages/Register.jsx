import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { ShieldCheck, Mail, Lock, User, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.register(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Try again.');
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
              <ShieldCheck size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">ThreatIQ</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Platform Registration</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-accent/5 border border-accent/20 text-accent text-xs font-bold text-center uppercase tracking-wider">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center py-10 space-y-6 animate-fade-in">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-success/10 border border-success/20 flex items-center justify-center text-success">
                  <CheckCircle2 size={40} strokeWidth={3} />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Registration Successful</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Redirecting to login...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    required
                    className="modern-input !pl-12 py-2.5 text-sm"
                    placeholder="Analyst Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="email"
                    required
                    className="modern-input !pl-12 py-2.5 text-sm"
                    placeholder="analyst@threatiq.io"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    minLength={6}
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
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    Create Account <ArrowRight size={18} />
                  </span>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-slate-500 mb-2">Already have an account?</p>
            <Link to="/login" className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
