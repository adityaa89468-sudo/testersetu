import React from 'react';
import { LayoutDashboard, Store, CheckSquare, Layers, User, Plus } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAddApp: () => void;
  tasksBadgeCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddApp,
  tasksBadgeCount = 0
}) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'marketplace', label: 'Market', icon: Store },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare, badge: tasksBadgeCount },
    { id: 'my_apps', label: 'My Apps', icon: Layers },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <>
      {/* Floating Action Button for Adding Apps */}
      <button
        onClick={onOpenAddApp}
        className="fixed bottom-20 sm:bottom-24 right-5 z-30 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white shadow-xl shadow-blue-500/30 flex items-center gap-2 font-bold text-xs transition-all active:scale-95 cursor-pointer border border-white/20"
        title="Submit New Android App Listing"
      >
        <Plus className="w-5 h-5" />
        <span className="hidden sm:inline">Add App Listing</span>
      </button>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 w-full max-w-full overflow-x-hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 py-2 px-3 sm:px-6 transition-colors">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  {!!tab.badge && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>

                {isActive && (
                  <div className="absolute -bottom-1 w-5 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
