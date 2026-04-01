import { useState } from "react";
import { Settings, User, Bell, Shield, Palette, Database, Save, Check } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "billing", label: "Billing", icon: Database },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-surface-800 rounded-lg">
          <Settings className="w-5 h-5 text-surface-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Settings</h2>
          <p className="text-sm text-surface-500">Manage your account and preferences</p>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-56">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary-600/10 text-primary-400 border border-primary-600/20"
                      : "text-surface-400 hover:text-white hover:bg-surface-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="card space-y-6">
              <div>
                <h3 className="text-sm font-medium text-white mb-4">Profile Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-surface-500 mb-1.5">First Name</label>
                    <input type="text" defaultValue="Admin" className="input w-full" />
                  </div>
                  <div>
                    <label className="block text-xs text-surface-500 mb-1.5">Last Name</label>
                    <input type="text" defaultValue="User" className="input w-full" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-surface-500 mb-1.5">Email</label>
                    <input type="email" defaultValue="admin@neuralwatch.io" className="input w-full" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-surface-500 mb-1.5">Company</label>
                    <input type="text" defaultValue="NeuralWatch Inc." className="input w-full" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-4">Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-surface-800/50 rounded-lg cursor-pointer">
                    <div>
                      <p className="text-sm text-white">Email digest</p>
                      <p className="text-xs text-surface-500">Receive daily summary of your metrics</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-surface-600 bg-surface-700 text-primary-600 focus:ring-primary-500" />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-surface-800/50 rounded-lg cursor-pointer">
                    <div>
                      <p className="text-sm text-white">Weekly reports</p>
                      <p className="text-xs text-surface-500">Receive weekly performance reports</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-surface-600 bg-surface-700 text-primary-600 focus:ring-primary-500" />
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? "Saved" : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="card space-y-6">
              <div>
                <h3 className="text-sm font-medium text-white mb-4">Alert Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-surface-800/50 rounded-lg cursor-pointer">
                    <div>
                      <p className="text-sm text-white">Error alerts</p>
                      <p className="text-xs text-surface-500">Get notified when error rate exceeds threshold</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-surface-600 bg-surface-700 text-primary-600" />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-surface-800/50 rounded-lg cursor-pointer">
                    <div>
                      <p className="text-sm text-white">Latency alerts</p>
                      <p className="text-xs text-surface-500">Get notified when latency exceeds threshold</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-surface-600 bg-surface-700 text-primary-600" />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-surface-800/50 rounded-lg cursor-pointer">
                    <div>
                      <p className="text-sm text-white">Cost alerts</p>
                      <p className="text-xs text-surface-500">Get notified when spending approaches budget</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-surface-600 bg-surface-700 text-primary-600" />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-surface-800/50 rounded-lg cursor-pointer">
                    <div>
                      <p className="text-sm text-white">Model health alerts</p>
                      <p className="text-xs text-surface-500">Get notified when model status changes</p>
                    </div>
                    <input type="checkbox" className="w-4 h-4 rounded border-surface-600 bg-surface-700 text-primary-600" />
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? "Saved" : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="card space-y-6">
              <div>
                <h3 className="text-sm font-medium text-white mb-4">Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-surface-500 mb-1.5">Current Password</label>
                    <input type="password" className="input w-full" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-xs text-surface-500 mb-1.5">New Password</label>
                    <input type="password" className="input w-full" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-xs text-surface-500 mb-1.5">Confirm New Password</label>
                    <input type="password" className="input w-full" placeholder="••••••••" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-3 bg-surface-800/50 rounded-lg">
                  <div>
                    <p className="text-sm text-white">Enable 2FA</p>
                    <p className="text-xs text-surface-500">Add an extra layer of security to your account</p>
                  </div>
                  <button className="btn-secondary text-sm">Enable</button>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? "Saved" : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="card space-y-6">
              <div>
                <h3 className="text-sm font-medium text-white mb-4">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  <label className="cursor-pointer">
                    <input type="radio" name="theme" defaultChecked className="sr-only peer" />
                    <div className="p-4 bg-surface-800 border-2 border-surface-700 rounded-lg peer-checked:border-primary-500 transition-colors">
                      <div className="h-20 bg-surface-900 rounded mb-2" />
                      <p className="text-sm text-center text-white">Dark</p>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input type="radio" name="theme" className="sr-only peer" />
                    <div className="p-4 bg-surface-100 border-2 border-surface-700 rounded-lg peer-checked:border-primary-500 transition-colors">
                      <div className="h-20 bg-white rounded mb-2" />
                      <p className="text-sm text-center text-white">Light</p>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input type="radio" name="theme" className="sr-only peer" />
                    <div className="p-4 bg-gradient-to-b from-surface-900 to-surface-100 border-2 border-surface-700 rounded-lg peer-checked:border-primary-500 transition-colors">
                      <div className="h-20 bg-gradient-to-b from-surface-900 to-white rounded mb-2" />
                      <p className="text-sm text-center text-white">System</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? "Saved" : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="card space-y-6">
              <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Pro Plan</span>
                  <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs rounded">Current</span>
                </div>
                <p className="text-2xl font-bold text-white">$99<span className="text-sm font-normal text-surface-500">/month</span></p>
                <p className="text-xs text-surface-500 mt-2">Unlimited requests, all models, priority support</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-4">Usage This Month</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-surface-400">API Requests</span>
                    <span className="text-sm text-white">105,234 / Unlimited</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-surface-400">Models Used</span>
                    <span className="text-sm text-white">4 / 10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-surface-400">Team Members</span>
                    <span className="text-sm text-white">3 / 5</span>
                  </div>
                </div>
              </div>

              <button className="btn-secondary w-full">Manage Subscription</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}