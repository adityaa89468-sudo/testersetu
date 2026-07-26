import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { AppListing, PrivateFeedback } from '../types';

interface CampaignCompletionModalProps {
  app: AppListing | null;
  isOpen: boolean;
  onClose: () => void;
  feedbackList: PrivateFeedback[];
}

export const CampaignCompletionModal: React.FC<CampaignCompletionModalProps> = ({
  app,
  isOpen,
  onClose,
  feedbackList
}) => {
  useEffect(() => {
    if (isOpen && app) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen, app]);

  if (!isOpen || !app) return null;

  const handleDownloadSummary = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      app,
      feedbackList,
      exportDate: new Date().toISOString()
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${app.packageName}-testing-summary.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 15 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto text-center text-slate-900 dark:text-slate-100"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Trophy */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-emerald-500 text-white flex items-center justify-center shadow-xl shadow-amber-500/20">
          <Award className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" /> 14-Day Goal Milestone Reached!
          </span>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Testing Campaign Completed!
          </h2>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            Your testing campaign for <strong>{app.appName}</strong> has reached its configured target. Review your testing results and check Google Play Console to determine whether you can apply for production access.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Testers Participated</span>
            <span className="text-lg font-black text-blue-600">{app.testersJoined} Testers</span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Private Reviews</span>
            <span className="text-lg font-black text-teal-600">{feedbackList.length} Reports</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <a
            href="https://play.google.com/console"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Google Play Console</span>
          </a>

          <button
            onClick={handleDownloadSummary}
            className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Summary Report (JSON)</span>
          </button>
        </div>

      </motion.div>
    </div>
  );
};
