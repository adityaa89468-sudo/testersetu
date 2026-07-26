import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, 
  Users, 
  CheckCircle2, 
  Clock, 
  Coins, 
  Plus, 
  ExternalLink, 
  PauseCircle, 
  PlayCircle, 
  Trash2, 
  Share2, 
  Copy,
  ChevronRight,
  Eye,
  MessageSquare,
  Award,
  X
} from 'lucide-react';
import { AppListing, Assignment, DailyProof, PrivateFeedback } from '../types';
import { db, updateDoc, doc, deleteDoc, recordCreditTransaction } from '../lib/firebase';

interface MyAppTrackingProps {
  myApps: AppListing[];
  onOpenAddApp: () => void;
  onOpenProofReviewModal: (app: AppListing) => void;
  assignmentsByApp: Record<string, Assignment[]>;
  feedbackByApp: Record<string, PrivateFeedback[]>;
  onOpenCompletionModal: (app: AppListing) => void;
}

export const MyAppTracking: React.FC<MyAppTrackingProps> = ({
  myApps = [],
  onOpenAddApp,
  onOpenProofReviewModal,
  assignmentsByApp = {},
  feedbackByApp = {},
  onOpenCompletionModal
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'paused'>('active');
  const [selectedAppForTesters, setSelectedAppForTesters] = useState<AppListing | null>(null);

  const filteredApps = myApps.filter(app => {
    if (activeTab === 'active') return app.status === 'active' || app.status === 'pending_review';
    if (activeTab === 'completed') return app.status === 'completed';
    if (activeTab === 'paused') return app.status === 'paused';
    return true;
  });

  const handleTogglePause = async (app: AppListing) => {
    try {
      const newStatus = app.status === 'paused' ? 'active' : 'paused';
      await updateDoc(doc(db, 'apps', app.id), {
        status: newStatus,
        updatedAt: Date.now()
      });
    } catch (err) {
      console.error("Error toggling app status:", err);
    }
  };

  const handleDeleteApp = async (app: AppListing) => {
    if (confirm(`Are you sure you want to delete "${app.appName}"? Any unused reserved credits will be refunded.`)) {
      try {
        await deleteDoc(doc(db, 'apps', app.id));
      } catch (err) {
        console.error("Error deleting app:", err);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-x-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">My App Testing Campaigns</h1>
          <p className="text-xs text-slate-500">
            Manage your submitted Android applications, review daily proofs from candidate testers, and track progress toward Google Play closed testing qualification.
          </p>
        </div>

        <button
          onClick={onOpenAddApp}
          className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Submit New App Listing</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'active'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Active Campaigns ({myApps.filter(a => a.status === 'active' || a.status === 'pending_review').length})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Completed ({myApps.filter(a => a.status === 'completed').length})
        </button>

        <button
          onClick={() => setActiveTab('paused')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'paused'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Paused ({myApps.filter(a => a.status === 'paused').length})
        </button>
      </div>

      {/* Campaign Cards */}
      {filteredApps.length > 0 ? (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const appAssignments = assignmentsByApp[app.id] || [];
            const appFeedback = feedbackByApp[app.id] || [];

            return (
              <div
                key={app.id}
                className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={app.appIconUrl}
                      alt={app.appName}
                      className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="overflow-hidden space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                          {app.category}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-mono">
                          {app.packageName}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                        {app.appName}
                      </h3>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => onOpenProofReviewModal(app)}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Proofs</span>
                    </button>

                    <button
                      onClick={() => setSelectedAppForTesters(app)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Testers ({appAssignments.length})</span>
                    </button>

                    <button
                      onClick={() => handleTogglePause(app)}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title={app.status === 'paused' ? 'Resume Campaign' : 'Pause Campaign'}
                    >
                      {app.status === 'paused' ? <PlayCircle className="w-4 h-4 text-emerald-500" /> : <PauseCircle className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleDeleteApp(app)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase">Testers Recruited</span>
                    <p className="font-black text-slate-900 dark:text-white text-sm">
                      {app.testersJoined} / {app.testersNeeded} Goal
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase">Feedback Received</span>
                    <p className="font-black text-teal-600 dark:text-teal-400 text-sm flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> {appFeedback.length} Reviews
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase">Credits Reward</span>
                    <p className="font-black text-amber-600 dark:text-amber-400 text-sm flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" /> +{app.creditsOffered} / Tester
                    </p>
                  </div>
                </div>

                {/* Completion Trigger */}
                {app.testersJoined >= app.testersNeeded && app.status !== 'completed' && (
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Award className="w-4 h-4" /> Goal Reached! Ready for Google Play qualification review.
                    </span>
                    <button
                      onClick={() => onOpenCompletionModal(app)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-md cursor-pointer"
                    >
                      View Campaign Summary
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Apps in This Section</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Submit your Android app's closed testing link to recruit genuine testers and track campaign progress.
          </p>
          <button
            onClick={onOpenAddApp}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Submit App Listing</span>
          </button>
        </div>
      )}

      {/* View Testers Modal */}
      {selectedAppForTesters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[85vh] overflow-y-auto text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black">Active Testers List</h3>
                <p className="text-xs text-slate-500">{selectedAppForTesters.appName}</p>
              </div>
              <button
                onClick={() => setSelectedAppForTesters(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Note: Tester email addresses are kept private to protect developer anonymity and prevent off-platform harassment.
            </p>

            <div className="space-y-3">
              {(assignmentsByApp[selectedAppForTesters.id] || []).length > 0 ? (
                (assignmentsByApp[selectedAppForTesters.id] || []).map((asgn) => (
                  <div
                    key={asgn.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900 dark:text-white">{asgn.testerDisplayName}</p>
                      <p className="text-[10px] text-slate-500">
                        Joined: {new Date(asgn.startDate).toLocaleDateString()} • Current Progress: Day {asgn.completedDays || 0} / 14
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                      {asgn.status.toUpperCase()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  No testers have joined this campaign yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
