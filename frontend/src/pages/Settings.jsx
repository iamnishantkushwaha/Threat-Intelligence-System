import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Key, 
  Database, 
  Monitor,
  Save,
  Check
} from 'lucide-react';

const SettingSection = ({ title, description, children }) => (
  <div className="glass-card p-8 space-y-6">
    <div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-sm text-muted mt-1">{description}</p>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const Settings = () => {
  const [saved, setSaved] = useState(false);
  const userName = localStorage.getItem('user_name') || 'Admin User';
  const userEmail = localStorage.getItem('user_email') || 'admin@threatiq.io';

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Platform Settings</h1>
        <p className="text-muted text-sm mt-1">Manage your account, security preferences, and system configuration</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Section */}
        <SettingSection 
          title="Account Profile" 
          description="Your personal information and how it appears across the platform"
        >
          <div className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-2xl font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-lg">{userName}</p>
              <p className="text-sm text-muted">{userEmail}</p>
            </div>
            <button className="ml-auto secondary-button py-2">Change Avatar</button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted uppercase">Full Name</label>
              <input type="text" defaultValue={userName} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:border-primary/50" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted uppercase">Email Address</label>
              <input type="email" defaultValue={userEmail} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:border-primary/50" />
            </div>
          </div>
        </SettingSection>

        {/* Security Section */}
        <SettingSection 
          title="Security & Access" 
          description="Manage your password, API access, and authentication methods"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                  <Key size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">Two-Factor Authentication</p>
                  <p className="text-xs text-muted">Currently disabled. Enable for extra security.</p>
                </div>
              </div>
              <button className="primary-button py-1.5 px-4 text-xs">Enable</button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">Password Management</p>
                  <p className="text-xs text-muted">Last changed 4 months ago</p>
                </div>
              </div>
              <button className="secondary-button py-1.5 px-4 text-xs">Update</button>
            </div>
          </div>
        </SettingSection>

        {/* Notifications Section */}
        <SettingSection 
          title="Notification Preferences" 
          description="Control how you receive alerts and system updates"
        >
          <div className="space-y-3">
            {[
              { label: 'Critical Threat Alerts', desc: 'Instant email and browser notification', enabled: true },
              { label: 'New Agent Registration', desc: 'Notify when a new device joins the network', enabled: true },
              { label: 'System Health Reports', desc: 'Weekly summary of platform activity', enabled: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-bold">{item.label}</p>
                  <p className="text-xs text-muted">{item.desc}</p>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${item.enabled ? 'bg-primary' : 'bg-white/10'}`}>
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${item.enabled ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </SettingSection>

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            className="primary-button px-8 py-3 flex items-center gap-2"
          >
            {saved ? <Check size={18} /> : <Save size={18} />}
            <span>{saved ? 'Saved Successfully' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
