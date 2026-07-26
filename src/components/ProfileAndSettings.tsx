import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Briefcase, 
  Globe, 
  Coins, 
  Flame, 
  Award, 
  ShieldCheck, 
  Sun, 
  Moon, 
  LogOut, 
  Trash2, 
  FileText, 
  HelpCircle, 
  Edit3, 
  Save, 
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
  Lock,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, db, logoutUser, deleteAccount } from '../lib/firebase';
import { COMMUNITY_GUIDELINES } from '../lib/seedData';
import { PrivacyPolicyView } from './PrivacyPolicyView';

export const ProfileAndSettings: React.FC = () => {
  const { user, userProfile, theme, toggleTheme, refreshUserProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [developerName, setDeveloperName] = useState(userProfile?.developerName || '');
  const [playStoreDevLink, setPlayStoreDevLink] = useState(userProfile?.playStoreDevLink || '');
  const [country, setCountry] = useState(userProfile?.country || 'United States');
  
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const privacyUrl = `${window.location.origin}${window.location.pathname}?page=privacy`;

  const handleCopyPrivacyUrl = () => {
    navigator.clipboard.writeText(privacyUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setMsg(null);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: displayName.trim(),
        developerName: developerName.trim(),
        playStoreDevLink: playStoreDevLink.trim(),
        country,
        updatedAt: Date.now()
      });

      await refreshUserProfile();
      setIsEditing(false);
      setMsg('Profile updated successfully!');
      setLoading(false);
    } catch (err: any) {
      setMsg('Failed to update profile: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Developer Profile & Settings</h1>
        <p className="text-xs text-slate-500">
          Manage your developer metadata, testing streak, platform preferences, and community security rules.
        </p>
      </div>

      {msg && (
        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Avatar"
                className="w-16 h-16 rounded-3xl object-cover ring-2 ring-blue-500/30 shadow-md"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white font-black text-2xl flex items-center justify-center shadow-md">
                {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {userProfile?.displayName || 'Android Developer'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase">
                  {userProfile?.experience || 'Intermediate'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Studio: <strong className="text-slate-800 dark:text-slate-200">{userProfile?.developerName || 'Dev Studio'}</strong>
              </p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                {userProfile?.country || 'United States'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Developer / Studio Name</label>
                <input
                  type="text"
                  required
                  value={developerName}
                  onChange={e => setDeveloperName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Google Play Developer Page URL</label>
              <input
                type="url"
                value={playStoreDevLink}
                onChange={e => setPlayStoreDevLink(e.target.value)}
                placeholder="https://play.google.com/store/apps/dev?id=..."
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </form>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-[10px] text-amber-700 dark:text-amber-400 uppercase font-bold block">Available Credits</span>
            <span className="text-xl font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Coins className="w-4 h-4" /> {userProfile?.credits ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/20">
            <span className="text-[10px] text-orange-700 dark:text-orange-400 uppercase font-bold block">Testing Streak</span>
            <span className="text-xl font-black text-orange-600 dark:text-orange-400 flex items-center gap-1">
              <Flame className="w-4 h-4" /> {userProfile?.testingStreak ?? 1} Days
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold block">Reliability Score</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> {userProfile?.reliabilityScore ?? 100}%
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <span className="text-[10px] text-blue-700 dark:text-blue-400 uppercase font-bold block">Completed Tests</span>
            <span className="text-xl font-black text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <Award className="w-4 h-4" /> {userProfile?.completedTestsCount ?? 0}
            </span>
          </div>
        </div>

      </div>

      {/* Platform Settings & Community Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-black text-base text-slate-900 dark:text-white">Platform Settings</h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Theme Preference</p>
                <p className="text-[11px] text-slate-500">Currently set to {theme} mode</p>
              </div>
              <button
                onClick={toggleTheme}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
                <span>Toggle Theme</span>
              </button>
            </div>

            <button
              onClick={() => setShowGuidelines(true)}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-between font-bold text-slate-800 dark:text-slate-200"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                Community Guidelines & Testing Rules
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Privacy Policy Block */}
            <div className="p-3.5 rounded-2xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-slate-900 dark:text-white">Privacy Policy</span>
                </div>
                <button
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-colors cursor-pointer"
                >
                  View Policy
                </button>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Play Store & OAuth Privacy Policy URL for developer campaigns:
              </p>

              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={privacyUrl}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] select-all outline-none"
                />
                <button
                  onClick={handleCopyPrivacyUrl}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[10px] flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                >
                  {copiedUrl ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Safety Actions */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-black text-base text-slate-900 dark:text-white">Account Management</h3>

          <div className="space-y-2 text-xs">
            <button
              onClick={async () => { await logoutUser(); }}
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Account</span>
            </button>

            <button
              onClick={async () => {
                if (confirm('Are you sure you want to delete your developer account? This action is permanent and cannot be undone.')) {
                  const res = await deleteAccount();
                  if (res.error) alert(res.error);
                }
              }}
              className="w-full py-3 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 font-bold text-xs border border-rose-500/20 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Developer Account</span>
            </button>
          </div>
        </div>

      </div>

      {/* Guidelines Modal */}
      {showGuidelines && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[85vh] overflow-y-auto text-xs text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-black text-base">Community Guidelines & Testing Policy</h3>
              <button onClick={() => setShowGuidelines(false)} className="p-1 rounded-xl text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {COMMUNITY_GUIDELINES.map((g, i) => (
                <div key={i} className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">{g.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{g.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <PrivacyPolicyView onClose={() => setShowPrivacyPolicy(false)} />
      )}

    </div>
  );
};
