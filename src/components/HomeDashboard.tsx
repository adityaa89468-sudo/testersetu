import React from 'react';
import { motion } from 'motion/react';
import { 
  Coins, 
  Flame, 
  CheckSquare, 
  Users, 
  Plus, 
  ArrowRight, 
  AlertTriangle, 
  ShieldCheck, 
  Smartphone, 
  Store,
  Sparkles,
  Info,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AppListing, Assignment, TestingRequest } from '../types';
import { BannerAd } from './BannerAd';

interface HomeDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenAddApp: () => void;
  myApps: AppListing[];
  activeAssignments: Assignment[];
  pendingRequests: TestingRequest[];
  onOpenAppDetails: (appId: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigateTab,
  onOpenAddApp,
  myApps = [],
  activeAssignments = [],
  pendingRequests = [],
  onOpenAppDetails
}) => {
  const { userProfile } = useAuth();

  // Calculate urgent actions
  const proofsDueToday = (activeAssignments || []).filter(a => a.status === 'in_progress');
  const pendingRequestsToReview = (pendingRequests || []).filter(r => r.status === 'pending');

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 w-full max-w-full overflow-x-hidden">
      
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/15">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-teal-400/20 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-white border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Closed Testing Hub</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Hello, {userProfile?.displayName || 'Developer'}! 👋
            </h1>

            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Test other developers' Android applications daily to earn credits, and recruit genuine testers for your Google Play closed beta release.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('marketplace')}
              className="px-5 py-3 rounded-2xl bg-white text-blue-700 font-bold text-xs shadow-lg hover:bg-blue-50 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Store className="w-4 h-4" />
              <span>Browse Market</span>
            </button>

            <button
              onClick={onOpenAddApp}
              className="px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer active:scale-98 border border-white/20"
            >
              <Plus className="w-4 h-4" />
              <span>Submit My App</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metric Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Credits Card */}
        <div 
          onClick={() => onNavigateTab('profile')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Available Credits</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {userProfile?.credits ?? 0}
            </span>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">PTS</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium group-hover:text-blue-500 transition-colors flex items-center gap-1">
            <span>Earn more in Market</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* Streak Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Testing Streak</span>
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Flame className="w-4 h-4 animate-bounce" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {userProfile?.testingStreak ?? 1}
            </span>
            <span className="text-[10px] font-bold text-orange-500 uppercase">Days</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Keep uploading daily proofs</p>
        </div>

        {/* Active Tasks Card */}
        <div 
          onClick={() => onNavigateTab('tasks')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Apps Testing</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {activeAssignments.length}
            </span>
            <span className="text-[10px] font-bold text-blue-500 uppercase">Apps</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium group-hover:text-blue-500 transition-colors flex items-center gap-1">
            <span>View daily tasks</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* My Apps Card */}
        <div 
          onClick={() => onNavigateTab('my_apps')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">My Campaigns</span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {myApps.length}
            </span>
            <span className="text-[10px] font-bold text-teal-500 uppercase">Active</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium group-hover:text-teal-500 transition-colors flex items-center gap-1">
            <span>Manage listings</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>

      </div>

      {/* Credit Rules Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <p className="font-bold text-slate-900 dark:text-white">Tester Credit Policy & Rewards</p>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              Starting Balance: <strong className="text-amber-600 dark:text-amber-400">100 Credits</strong> • Approved Daily Screenshot: <strong className="text-emerald-600 dark:text-emerald-400">+1 Credit</strong> • Unsubmitted / Rejected Screenshot: <strong className="text-rose-600 dark:text-rose-400">-2 Credits Penalty</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Urgent Action Alerts */}
      {(proofsDueToday.length > 0 || pendingRequestsToReview.length > 0) && (
        <div className="space-y-3">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Attention Needed</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {proofsDueToday.length > 0 && (
              <div 
                onClick={() => onNavigateTab('tasks')}
                className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between cursor-pointer hover:bg-amber-500/15 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {proofsDueToday.length} Daily Proof{proofsDueToday.length > 1 ? 's' : ''} Due Today
                    </p>
                    <p className="text-[11px] text-slate-500">Upload screenshot to maintain your streak</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
            )}

            {pendingRequestsToReview.length > 0 && (
              <div 
                onClick={() => onNavigateTab('my_apps')}
                className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between cursor-pointer hover:bg-blue-500/15 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {pendingRequestsToReview.length} Tester Request{pendingRequestsToReview.length > 1 ? 's' : ''} Pending
                    </p>
                    <p className="text-[11px] text-slate-500">Review candidate developers for your app</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Community Closed Testing Policy Card */}
      <div className="p-5 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
          <ShieldCheck className="w-4 h-4 text-teal-500" />
          <span>Google Play Closed Testing Policy & Disclaimers</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          TesterSetu provides a community environment to recruit opt-in closed-beta testers. <strong>Google Play maintains sole control over production track access approvals.</strong> Utilizing TesterSetu does not guarantee Google Play approval, but ensures genuine 14-day manual testing compliance.
        </p>
      </div>

      {/* Non-Intrusive Sponsored Community Banner Ad */}
      <BannerAd />

      {/* Quick App Marketplace Spotlight */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">Featured Apps Needing Testers</h2>
            <p className="text-xs text-slate-500">Join testing campaigns and earn reward credits</p>
          </div>
          <button
            onClick={() => onNavigateTab('marketplace')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {myApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myApps.slice(0, 2).map((app) => (
              <div
                key={app.id}
                onClick={() => onOpenAppDetails(app.id)}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={app.appIconUrl}
                    alt={app.appName}
                    className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-800 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="overflow-hidden space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                        {app.category}
                      </span>
                      {app.isVerified && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Verified</span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {app.appName}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate">by {app.ownerDevName}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    <span>{app.testersJoined} / {app.testersNeeded} Testers Joined</span>
                    <span className="text-teal-600 font-bold">+{app.creditsOffered} Credits</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-teal-500 rounded-full"
                      style={{ width: `${Math.min(100, (app.testersJoined / app.testersNeeded) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Ready to post your first Android App?
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Submit your Google Play opt-in closed testing link and start receiving genuine 14-day testing requests from fellow developers.
            </p>
            <button
              onClick={onOpenAddApp}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your App Listing</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
