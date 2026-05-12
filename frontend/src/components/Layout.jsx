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
  Bell
} from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(14,165,233,0.05)]' 
        : 'text-muted hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const userName = localStorage.getItem('user_name') || 'Analyst';
  const userEmail = localStorage.getItem('user_email') || '';
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/agents', icon: Users, label: 'Agents' },
    { to: '/threats', icon: ShieldAlert, label: 'Threats' },
    { to: '/malware', icon: Activity, label: 'Malware' },
    { to: '/logs', icon: Terminal, label: 'Logs' },
    { to: '/reports', icon: FileBarChart, label: 'Reports' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-surface/50 backdrop-blur-xl p-6 flex flex-col fixed h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldAlert className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Threat<span className="text-primary">IQ</span></h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <SidebarLink 
              key={item.to} 
              {...item} 
              active={location.pathname === item.to} 
            />
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <SidebarLink to="/settings" icon={Settings} label="Settings" active={location.pathname === '/settings'} />
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted hover:text-accent transition-all duration-200 w-full"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 sticky top-0 bg-background/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white/90">
              {navItems.find(item => item.to === location.pathname)?.label || 'Overview'}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-muted hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full border-2 border-background"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted">{userEmail || 'Security Analyst'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
                {userInitial}
              </div>
            </div>
          </div>
        </header>

        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
