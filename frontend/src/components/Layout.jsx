import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Users, 
  Terminal, 
  Activity, 
  FileBarChart, 
  Settings, 
  LogOut,
  Bell,
  Mail,
  ShieldCheck,
  Globe
} from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
      active 
        ? 'bg-primary text-slate-950 font-bold' 
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon size={18} />
    <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
  </Link>
);

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const userName = localStorage.getItem('user_name') || 'Administrator';
  const userEmail = localStorage.getItem('user_email') || 'admin@threatiq.io';
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', group: 'Management' },
    { to: '/agents', icon: Users, label: 'Agents', group: 'Management' },
    { to: '/threats', icon: ShieldAlert, label: 'Threats', group: 'Management' },
    { to: '/malware', icon: Activity, label: 'Malware', group: 'Management' },
    { to: '/logs', icon: Terminal, label: 'Logs', group: 'Management' },
    { to: '/email-analyzer', icon: Mail, label: 'Email Analyzer', group: 'Intelligence' },
    { to: '/breach-checker', icon: ShieldCheck, label: 'Breach Checker', group: 'Intelligence' },
    { to: '/threat-intel', icon: Globe, label: 'Threat Intelligence', group: 'Intelligence' },
    { to: '/reports', icon: FileBarChart, label: 'Reports', group: 'Intelligence' },
  ];

  const currentLabel = navItems.find(item => item.to === location.pathname)?.label || 'System Core';

  return (
    <div className="flex min-h-screen bg-bg-deep text-slate-300">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-slate-950 flex flex-col fixed h-screen z-40">
        <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-slate-950">
            <ShieldCheck size={20} strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">ThreatIQ</h1>
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Security Platform</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar">
          <div>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4 px-2">Management</p>
            <div className="space-y-1">
              {navItems.filter(i => i.group === 'Management').map((item) => (
                <SidebarLink key={item.to} {...item} active={location.pathname === item.to} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4 px-2">Intelligence</p>
            <div className="space-y-1">
              {navItems.filter(i => i.group === 'Intelligence').map((item) => (
                <SidebarLink key={item.to} {...item} active={location.pathname === item.to} />
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1">
          <SidebarLink to="/settings" icon={Settings} label="Settings" active={location.pathname === '/settings'} />
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-500 hover:text-accent hover:bg-accent/5 transition-all w-full"
          >
            <LogOut size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col">
        {/* Header Navigation */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 bg-bg-deep/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {currentLabel}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Online</span>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-500 hover:text-white transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border border-bg-deep"></span>
              </button>
                
              <div className="flex items-center gap-3 pl-6 border-l border-white/5">
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{userName}</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Administrator</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-slate-950 font-bold">
                  {userInitial}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Container */}
        <div className="p-8 lg:p-10 max-w-[1600px] mx-auto w-full flex-1">
          {children}
        </div>

        {/* Footer Stats Overlay */}
        <footer className="px-8 py-4 border-t border-white/5 flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase tracking-wider">
           <div className="flex items-center gap-6">
              <span>Health: 99%</span>
              <span>Latency: 12ms</span>
           </div>
           <div>
              ThreatIQ Platform v2.5
           </div>
        </footer>
      </main>
    </div>
  );
};


export default Layout;
