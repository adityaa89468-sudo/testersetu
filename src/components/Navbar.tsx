import React, { useState } from 'react';
import { 
  Coins, 
  Bell, 
  Sun, 
  Moon, 
  User as UserIcon, 
  LogOut, 
  ShieldAlert, 
  ShieldCheck, 
  ChevronDown, 
  Sparkles,
  Settings,
  HelpCircle,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TestCircleLogo } from './TestCircleLogo';
import { logoutUser } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenAndroidToolkit?: () => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenNotifications, 
  onOpenAuth, 
  onNavigateTab,
  onOpenAndroidToolkit,
  activeTab 
}) => {
  const { user, userProfile, unreadNotificationsCount, theme, toggleTheme, isAdmin } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full max-w-full overflow-x-hidden bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => onNavigateTab('home')}
            className="cursor-pointer"
          >
            <TestCircleLogo size="md" />
          </div>

          {/* Right Header Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Android Dev Toolkit Button */}
            {onOpenAndroidToolkit && (
              <button
                onClick={onOpenAndroidToolkit}
                title="Android Studio & Play Console Toolkit"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-bold text-xs hover:bg-emerald-500/20 transition-all cursor-pointer shadow-sm"
              >
                <Smartphone className="w-4 h-4 text-emerald-500" />
                <span className="hidden sm:inline">Android Dev Toolkit</span>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </button>

            {user ? (
              <>
                {/* Available Credits Chip */}
                <button
                  onClick={() => onNavigateTab('profile')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-bold text-xs hover:bg-amber-500/20 transition-all cursor-pointer shadow-sm"
                  title="Your Testing Credits Balance"
                >
                  <Coins className="w-4 h-4 text-amber-500 animate-bounce" />
                  <span>{userProfile?.credits ?? 0}</span>
                  <span className="text-[10px] uppercase font-semibold text-amber-600 dark:text-amber-500">Credits</span>
                </button>

                {/* Notifications Bell */}
                <button
                  onClick={onOpenNotifications}
                  className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                      {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* Admin Mode Badge */}
                {isAdmin && (
                  <button
                    onClick={() => onNavigateTab('admin')}
                    className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === 'admin'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:bg-purple-500/20'
                    }`}
                  >
                    <ShieldAlert className="w-3 h-3" /> Admin Portal
                  </button>
                )}

                {/* User Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 p-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 pr-1" />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showDropdown && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowDropdown(false)} 
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-3 space-y-3"
                        >
                          {/* User Header */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                            <div className="flex items-center gap-2.5">
                              {user.photoURL ? (
                                <img
                                  src={user.photoURL}
                                  alt="Avatar"
                                  className="w-10 h-10 rounded-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center">
                                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                                </div>
                              )}
                              <div className="overflow-hidden space-y-0.5">
                                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                                  {userProfile?.displayName || user.displayName || 'Developer'}
                                </p>
                                <p className="text-[10px] text-slate-500 font-mono truncate">
                                  {user.email}
                                </p>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                              <span className="text-slate-500">Reliability Score</span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {userProfile?.reliabilityScore ?? 100}%
                              </span>
                            </div>
                          </div>

                          {/* Options */}
                          <div className="space-y-1 text-xs">
                            <button
                              onClick={() => {
                                onNavigateTab('profile');
                                setShowDropdown(false);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                            >
                              <UserIcon className="w-4 h-4 text-blue-500" />
                              <span>My Profile & Settings</span>
                            </button>

                            {isAdmin && (
                              <button
                                onClick={() => {
                                  onNavigateTab('admin');
                                  setShowDropdown(false);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-colors text-left font-semibold"
                              >
                                <ShieldAlert className="w-4 h-4" />
                                <span>Admin Dashboard</span>
                              </button>
                            )}

                            <button
                              onClick={async () => {
                                await logoutUser();
                                setShowDropdown(false);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors text-left font-semibold mt-1"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In / Join</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
