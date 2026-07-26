import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  Users, 
  Layers, 
  CheckCircle2, 
  Coins, 
  AlertTriangle, 
  Settings, 
  Trash2, 
  Ban, 
  Check, 
  X, 
  Plus, 
  Edit3,
  Search,
  RefreshCw,
  Award,
  Lock
} from 'lucide-react';
import { db, collection, getDocs, updateDoc, doc, setDoc } from '../lib/firebase';
import { UserProfile, AppListing, SafetyReport, PlatformConfig } from '../types';
import { DEFAULT_PLATFORM_CONFIG } from '../lib/seedData';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'apps' | 'users' | 'reports' | 'config'>('analytics');
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [apps, setApps] = useState<AppListing[]>([]);
  const [reports, setReports] = useState<SafetyReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Credit adjustment dialog
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [creditDelta, setCreditDelta] = useState<number>(50);
  const [creditReason, setCreditReason] = useState('Admin grant');

  // Config state
  const [config, setConfig] = useState<PlatformConfig>(DEFAULT_PLATFORM_CONFIG);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const uSnap = await getDocs(collection(db, 'users'));
      setUsers(uSnap.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile)));

      const aSnap = await getDocs(collection(db, 'apps'));
      setApps(aSnap.docs.map(d => ({ id: d.id, ...d.data() } as AppListing)));

      const rSnap = await getDocs(collection(db, 'reports'));
      setReports(rSnap.docs.map(d => ({ id: d.id, ...d.data() } as SafetyReport)));

      setLoading(false);
    } catch (err) {
      console.error("Error fetching admin portal data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAppStatusChange = async (appId: string, status: AppListing['status']) => {
    try {
      await updateDoc(doc(db, 'apps', appId), { status, updatedAt: Date.now() });
      await fetchAdminData();
    } catch (err) {
      console.error("Error updating app status:", err);
    }
  };

  const handleToggleUserSuspend = async (userItem: UserProfile) => {
    try {
      await updateDoc(doc(db, 'users', userItem.uid), {
        isSuspended: !userItem.isSuspended,
        updatedAt: Date.now()
      });
      await fetchAdminData();
    } catch (err) {
      console.error("Error toggling user suspend status:", err);
    }
  };

  const handleAdjustCredits = async () => {
    if (!selectedUser) return;
    try {
      const newCredits = Math.max(0, (selectedUser.credits || 0) + Number(creditDelta));
      await updateDoc(doc(db, 'users', selectedUser.uid), {
        credits: newCredits,
        updatedAt: Date.now()
      });
      setSelectedUser(null);
      await fetchAdminData();
    } catch (err) {
      console.error("Error adjusting user credits:", err);
    }
  };

  const handleResolveReport = async (reportId: string, status: 'resolved' | 'dismissed') => {
    try {
      await updateDoc(doc(db, 'reports', reportId), {
        status,
        resolutionNotes: 'Handled by Admin Portal'
      });
      await fetchAdminData();
    } catch (err) {
      console.error("Error resolving report:", err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Admin Management Portal</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 font-bold text-xs">
              Platform Master
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Moderate app listings, manage developer credit balances, enforce safety rules, and configure platform settings.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'analytics', label: 'Platform Analytics', icon: Users },
          { id: 'apps', label: `App Listings (${apps.length})`, icon: Layers },
          { id: 'users', label: `Users (${users.length})`, icon: Users },
          { id: 'reports', label: `Reports (${reports.filter(r => r.status === 'pending').length})`, icon: AlertTriangle },
          { id: 'config', label: 'System Configuration', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Users</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{users.length}</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Active App Campaigns</span>
            <p className="text-2xl font-black text-blue-600">{apps.filter(a => a.status === 'active').length}</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Total System Credits</span>
            <p className="text-2xl font-black text-amber-500">
              {users.reduce((acc, u) => acc + (u.credits || 0), 0)} PTS
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Pending Safety Queue</span>
            <p className="text-2xl font-black text-rose-500">
              {reports.filter(r => r.status === 'pending').length}
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: APP LISTINGS */}
      {activeTab === 'apps' && (
        <div className="space-y-3 text-xs">
          {apps.map((app) => (
            <div
              key={app.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img src={app.appIconUrl} alt={app.appName} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{app.appName}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">{app.packageName} • by {app.ownerDevName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  app.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' :
                  app.status === 'suspended' ? 'bg-rose-500/10 text-rose-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {app.status}
                </span>

                {app.status !== 'active' && (
                  <button
                    onClick={() => handleAppStatusChange(app.id, 'active')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-[10px] cursor-pointer"
                  >
                    Approve / Activate
                  </button>
                )}

                {app.status !== 'suspended' && (
                  <button
                    onClick={() => handleAppStatusChange(app.id, 'suspended')}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-[10px] cursor-pointer"
                  >
                    Suspend Listing
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: USERS */}
      {activeTab === 'users' && (
        <div className="space-y-3 text-xs">
          {users.map((u) => (
            <div
              key={u.uid}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{u.displayName} ({u.developerName})</p>
                <p className="text-[10px] text-slate-400 font-mono">{u.email} • Role: {u.role} • Country: {u.country}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 font-bold text-[11px]">
                  {u.credits || 0} Credits
                </span>

                <button
                  onClick={() => setSelectedUser(u)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-[10px] cursor-pointer"
                >
                  Adjust Credits
                </button>

                <button
                  onClick={() => handleToggleUserSuspend(u)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[10px] cursor-pointer ${
                    u.isSuspended ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}
                >
                  {u.isSuspended ? 'Unsuspend' : 'Suspend Account'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-3 text-xs">
          {reports.length > 0 ? (
            reports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-500 uppercase">{rep.reason}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    rep.status === 'pending' ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'
                  }`}>
                    {rep.status}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300">{rep.details}</p>
                <p className="text-[10px] text-slate-400">Reporter: {rep.reporterDisplayName}</p>

                {rep.status === 'pending' && (
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleResolveReport(rep.id, 'resolved')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-[10px] cursor-pointer"
                    >
                      Resolve & Take Action
                    </button>
                    <button
                      onClick={() => handleResolveReport(rep.id, 'dismissed')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold text-[10px] cursor-pointer"
                    >
                      Dismiss Report
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400">No reports pending.</div>
          )}
        </div>
      )}

      {/* TAB 5: SYSTEM CONFIG */}
      {activeTab === 'config' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 text-xs max-w-lg">
          <h3 className="font-bold text-base">Global Platform Rules</h3>
          
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Testing Duration Default (Days)</label>
            <input
              type="number"
              value={config.minTestingDays}
              onChange={e => setConfig({ ...config, minTestingDays: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Welcome Bonus Credits</label>
            <input
              type="number"
              value={config.welcomeBonusCredits}
              onChange={e => setConfig({ ...config, welcomeBonusCredits: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none"
            />
          </div>

          <button
            onClick={() => alert('Platform config saved.')}
            className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md cursor-pointer"
          >
            Save System Config
          </button>
        </div>
      )}

      {/* Credit Dialog */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 space-y-4 text-xs border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-sm">Adjust Credits for {selectedUser.displayName}</h3>
            
            <div>
              <label className="block font-bold mb-1">Credit Adjustment (+ or -)</label>
              <input
                type="number"
                value={creditDelta}
                onChange={e => setCreditDelta(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setSelectedUser(null)} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold">Cancel</button>
              <button onClick={handleAdjustCredits} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-md">Apply Adjustment</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
