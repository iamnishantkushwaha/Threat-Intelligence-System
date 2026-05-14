import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Key, 
  Database, 
  Monitor,
  Save,
  Check,
  X
} from 'lucide-react';

const SettingSection = ({ icon: Icon, title, description, children }) => (
  <div className="glass-card p-6 space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-primary">
        {Icon && <Icon size={20} />}
      </div>
      <div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>

    <div className="space-y-6 pt-4">
      {children}
    </div>
  </div>
);

const Settings = () => {
  const [saved, setSaved] = useState(false);
  const userName = localStorage.getItem('user_name') || 'Administrator';
  const userEmail = localStorage.getItem('user_email') || 'admin@threatiq.io';

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl space-y-6 animate-fade-in pb-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-500 text-sm">Manage your account and platform preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile Section */}
        <SettingSection 
          icon={User}
          title="Account Profile" 
          description="Manage your identity and contact information."
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/[0.02] rounded-2xl border border-white/5">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-xl font-bold text-white">{userName}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded border border-white/5">{userEmail}</span>
                 <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Administrator</span>
              </div>
            </div>
            
            <button className="sm:ml-auto secondary-button text-xs py-1.5 px-4">Change Avatar</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                defaultValue={userName} 
                className="modern-input py-2 text-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                defaultValue={userEmail} 
                className="modern-input py-2 text-sm" 
              />
            </div>
          </div>
        </SettingSection>

        {/* Security Section */}
        <SettingSection 
          icon={Shield}
          title="Security Protocols" 
          description="Manage authentication and access control."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Key, title: 'Multi-Factor Auth', status: 'Disabled', action: 'Enable', color: 'accent' },
              { icon: Shield, title: 'Security Key', status: 'Last updated 4 months ago', action: 'Update', color: 'primary' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-white/[0.02] rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg ${item.color === 'accent' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'} flex items-center justify-center border border-current/10`}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.title}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{item.status}</p>
                  </div>
                </div>
                <button className="secondary-button text-[10px] py-1 px-3">{item.action}</button>
              </div>
            ))}
          </div>
        </SettingSection>

        {/* Notifications Section */}
        <SettingSection 
          icon={Bell}
          title="Notification Settings" 
          description="Choose which alerts you want to receive."
        >
          <div className="space-y-2 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
            {[
              { label: 'Security Alerts', desc: 'Critical threat detections', enabled: true },
              { label: 'Agent Status', desc: 'When agents go offline', enabled: true },
              { label: 'Weekly Reports', desc: 'Consolidated security summaries', enabled: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors">
                <div>
                  <p className="text-sm font-bold text-white">{item.label}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">{item.desc}</p>
                </div>
                <div 
                  className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${item.enabled ? 'bg-primary' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-slate-950 transition-all ${item.enabled ? 'left-6' : 'left-1'}`} />
                </div>
              </div>
            ))}
          </div>
        </SettingSection>

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            className="primary-button px-8 py-3 flex items-center gap-2 font-bold"
          >
            {saved ? (
              <>
                <Check size={18} />
                <span>Settings Saved</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};



export default Settings;
