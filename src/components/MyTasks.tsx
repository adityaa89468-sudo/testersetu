import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckSquare, 
  ExternalLink, 
  Upload, 
  MessageSquare, 
  Clock, 
  Coins, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { Assignment, DailyProof } from '../types';
import { TestingChatBox } from './TestingChatBox';

interface MyTasksProps {
  assignments: Assignment[];
  onOpenProofModal: (assignment: Assignment) => void;
  onOpenFeedbackModal: (assignment: Assignment) => void;
  proofsMap: Record<string, DailyProof[]>;
}

export const MyTasks: React.FC<MyTasksProps> = ({
  assignments = [],
  onOpenProofModal,
  onOpenFeedbackModal,
  proofsMap = {}
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'in_progress' | 'completed'>('today');

  const filteredAssignments = assignments.filter(a => {
    if (activeTab === 'today') {
      return a.status === 'in_progress';
    } else if (activeTab === 'in_progress') {
      return a.status === 'in_progress';
    } else {
      return a.status === 'completed';
    }
  });

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-x-hidden">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">My Testing Tasks</h1>
        <p className="text-xs text-slate-500">
          Track your daily testing commitments for apps you joined. Upload daily screenshot proofs to complete your 14-day streak and earn credits.
        </p>
      </div>

      {/* Credit Rules Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <p className="font-bold text-slate-900 dark:text-white">Tester Credit Policy & Daily Rewards</p>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              Starting Balance: <strong className="text-amber-600 dark:text-amber-400">100 Credits</strong> • Approved Daily Screenshot: <strong className="text-emerald-600 dark:text-emerald-400">+1 Credit</strong> • Unsubmitted / Rejected Screenshot: <strong className="text-rose-600 dark:text-rose-400">-2 Credits</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('today')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'today'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Today's Proofs ({assignments.filter(a => a.status === 'in_progress').length})
        </button>

        <button
          onClick={() => setActiveTab('in_progress')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'in_progress'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Active Assignments ({assignments.filter(a => a.status === 'in_progress').length})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Completed ({assignments.filter(a => a.status === 'completed').length})
        </button>
      </div>

      {/* List of Task Cards */}
      {filteredAssignments.length > 0 ? (
        <div className="space-y-4">
          {filteredAssignments.map((item) => {
            const assignmentProofs = proofsMap[item.id] || [];
            const duration = item.testingDurationDays || 14;

            return (
              <div
                key={item.id}
                className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.appIconUrl}
                      alt={item.appName}
                      className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="overflow-hidden space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                          Day {item.currentDay || 1} of {duration}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-black">
                          +{item.creditsReward} Credits Reward
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                        {item.appName}
                      </h3>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <a
                      href={item.optInLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Opt-In Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {item.status === 'in_progress' && (
                      <button
                        onClick={() => onOpenProofModal(item)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Today's Proof</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 14-Day Calendar Matrix */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      14-Day Testing Progress Calendar
                    </span>
                    <span className="text-blue-600 dark:text-blue-400">
                      {assignmentProofs.filter(p => p.status === 'accepted').length} / {duration} Days Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 pt-1">
                    {Array.from({ length: duration }).map((_, i) => {
                      const dayNum = i + 1;
                      const dayProof = assignmentProofs.find(p => p.dayNumber === dayNum);

                      let dayStatusClass = 'bg-slate-200 dark:bg-slate-800 text-slate-400';
                      let label = `Day ${dayNum}`;

                      if (dayProof) {
                        if (dayProof.status === 'accepted') {
                          dayStatusClass = 'bg-emerald-500 text-white font-black';
                          label = `Day ${dayNum}: Accepted`;
                        } else if (dayProof.status === 'under_review') {
                          dayStatusClass = 'bg-amber-500 text-white font-black animate-pulse';
                          label = `Day ${dayNum}: Under Review`;
                        } else if (dayProof.status === 'rejected') {
                          dayStatusClass = 'bg-rose-500 text-white font-black';
                          label = `Day ${dayNum}: Rejected`;
                        }
                      } else if (dayNum === item.currentDay && item.status === 'in_progress') {
                        dayStatusClass = 'bg-blue-600 text-white font-black ring-2 ring-blue-400 animate-bounce';
                        label = `Day ${dayNum}: Due Today`;
                      }

                      return (
                        <div
                          key={dayNum}
                          title={label}
                          className={`h-9 rounded-xl flex flex-col items-center justify-center text-[10px] font-bold shadow-sm transition-transform hover:scale-105 ${dayStatusClass}`}
                        >
                          <span>{dayNum}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Instructions & Feedback trigger */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-1">
                  <p className="text-slate-500">
                    <strong>Instructions:</strong> {item.testingInstructions || 'Perform regular testing and upload daily proof.'}
                  </p>

                  <button
                    onClick={() => onOpenFeedbackModal(item)}
                    className="text-teal-600 dark:text-teal-400 font-bold hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send Private Feedback</span>
                  </button>
                </div>

                {/* Direct User-to-User Chat Box */}
                <div className="pt-1">
                  <TestingChatBox
                    assignmentId={item.id}
                    appName={item.appName}
                    otherPartyId={item.appOwnerId}
                    userRole="tester"
                    compact={true}
                  />
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Active Testing Tasks</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any active testing tasks in this view. Visit the marketplace to request testing apps and earn credits!
          </p>
        </div>
      )}

    </div>
  );
};
