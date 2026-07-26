import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Coins, 
  Users, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Smartphone, 
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { AppListing, AppCategory } from '../types';
import { useAuth } from '../context/AuthContext';
import { BannerAd } from './BannerAd';

interface MarketplaceProps {
  apps: AppListing[];
  onOpenAppDetails: (appId: string) => void;
  onRequestToTest: (app: AppListing) => void;
  myRequestedAppIds: string[];
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  apps = [],
  onOpenAppDetails,
  onRequestToTest,
  myRequestedAppIds = []
}) => {
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'highest_reward' | 'fewest_testers' | 'ending_soon'>('newest');
  const [hideOwnApps, setHideOwnApps] = useState(true);

  const categories = [
    'All',
    'Tools',
    'Productivity',
    'Games',
    'Finance',
    'Health & Fitness',
    'Education',
    'Lifestyle',
    'Utilities'
  ];

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      // Exclude suspended
      if (app.status === 'suspended') return false;

      // Hide own apps if toggled
      if (hideOwnApps && user && app.ownerId === user.uid) return false;

      // Category filter
      if (selectedCategory !== 'All' && app.category !== selectedCategory) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = app.appName.toLowerCase().includes(q);
        const matchDev = app.ownerDevName.toLowerCase().includes(q);
        const matchPkg = app.packageName.toLowerCase().includes(q);
        const matchDesc = app.shortDescription.toLowerCase().includes(q);
        if (!matchName && !matchDev && !matchPkg && !matchDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return b.createdAt - a.createdAt;
      } else if (sortBy === 'highest_reward') {
        return b.creditsOffered - a.creditsOffered;
      } else if (sortBy === 'fewest_testers') {
        return a.testersJoined - b.testersJoined;
      } else if (sortBy === 'ending_soon') {
        return a.startDate - b.startDate;
      }
      return 0;
    });
  }, [apps, user, hideOwnApps, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-x-hidden">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Closed Testing Marketplace</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-500/20">
            {filteredApps.length} Available
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Find genuine Android apps looking for closed-beta testers. Join campaigns, test for 14 days, and earn credits.
        </p>
      </div>

      {/* Controls: Search Bar & Sort Dropdown */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by app name, developer, package (e.g. com.dev.app)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          />
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <ArrowUpDown className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer"
            >
              <option value="newest">Newly Added</option>
              <option value="highest_reward">Highest Reward</option>
              <option value="fewest_testers">Fewest Testers</option>
              <option value="ending_soon">Ending Soon</option>
            </select>
          </div>

          <button
            onClick={() => setHideOwnApps(!hideOwnApps)}
            className={`px-3 py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
              hideOwnApps
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            {hideOwnApps ? 'Hiding My Apps' : 'Showing All'}
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Non-Intrusive Banner Ad */}
      <BannerAd />

      {/* Grid of Apps */}
      {filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => {
            const isMyOwnApp = user && app.ownerId === user.uid;
            const hasAlreadyRequested = myRequestedAppIds.includes(app.id);

            return (
              <div
                key={app.id}
                className="group relative flex flex-col justify-between p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Bar: Icon, Title & Reward */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.appIconUrl}
                        alt={app.appName}
                        className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="overflow-hidden space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                            {app.category}
                          </span>
                          {app.isVerified && (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3" /> Verified
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {app.appName}
                        </h3>
                        <p className="text-[11px] text-slate-500 truncate">
                          by {app.ownerDevName}
                        </p>
                      </div>
                    </div>

                    {/* Reward Pill */}
                    <div className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-black text-xs shrink-0 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      <span>+{app.creditsOffered}</span>
                    </div>
                  </div>

                  {/* Short description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {app.shortDescription}
                  </p>

                  {/* Android Version & Duration */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                      {app.minAndroidVersion}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {app.testingDurationDays || 14} Days
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      <span>{app.testersJoined} / {app.testersNeeded} Testers</span>
                      <span>{Math.round((app.testersJoined / app.testersNeeded) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-teal-500 rounded-full"
                        style={{ width: `${Math.min(100, (app.testersJoined / app.testersNeeded) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => onOpenAppDetails(app.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer text-center"
                  >
                    View Details
                  </button>

                  {isMyOwnApp ? (
                    <span className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-xs">
                      Your App
                    </span>
                  ) : hasAlreadyRequested ? (
                    <span className="px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Requested
                    </span>
                  ) : (
                    <button
                      onClick={() => onRequestToTest(app)}
                      className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                    >
                      Request to Test
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Matching App Listings Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing category filters, or toggling "Hiding My Apps".
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setHideOwnApps(false); }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

    </div>
  );
};
