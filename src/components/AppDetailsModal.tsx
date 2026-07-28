import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ExternalLink, 
  Coins, 
  Clock, 
  Smartphone, 
  ShieldCheck, 
  Copy, 
  Share2, 
  Flag, 
  CheckCircle2, 
  Users, 
  Mail, 
  FileText, 
  HelpCircle,
  AlertTriangle,
  Send
} from 'lucide-react';
import { AppListing } from '../types';
import { useAuth } from '../context/AuthContext';

interface AppDetailsModalProps {
  app: AppListing | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestToTest: (app: AppListing) => void;
  hasAlreadyRequested: boolean;
  onOpenReportModal: (app: AppListing) => void;
}

export const AppDetailsModal: React.FC<AppDetailsModalProps> = ({
  app,
  isOpen,
  onClose,
  onRequestToTest,
  hasAlreadyRequested,
  onOpenReportModal
}) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showConfirmRequest, setShowConfirmRequest] = useState(false);

  if (!isOpen || !app) return null;

  const isMyOwnApp = user && app.ownerId === user.uid;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(app.optInLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: app.appName,
          text: `Join testing campaign for ${app.appName} on TesterSetu`,
          url: window.location.href
        });
      } catch (err) {
        // ignore share cancellation
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100"
      >
        {/* Top Header Controls */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-500/20">
              {app.category}
            </span>
            {app.isVerified && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Listing
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Share Listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenReportModal(app)}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Report Listing"
            >
              <Flag className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* App Title & Hero Info */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <img
            src={app.appIconUrl}
            alt={app.appName}
            className="w-20 h-20 rounded-3xl object-cover ring-1 ring-slate-200 dark:ring-slate-800 shrink-0 shadow-md"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-1.5 flex-1">
            <h2 className="text-xl font-black">{app.appName}</h2>
            <p className="text-xs text-slate-500 font-medium">
              Developer: <strong className="text-slate-800 dark:text-slate-200">{app.ownerDevName}</strong>
            </p>
            <p className="text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded-lg inline-block">
              {app.packageName}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <div className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-black flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-500" />
                <span>+{app.creditsOffered} Reward Credits</span>
              </div>

              <div className="flex items-center gap-1 text-slate-500">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{app.testingDurationDays} Days Testing</span>
              </div>

              <div className="flex items-center gap-1 text-slate-500">
                <Smartphone className="w-4 h-4 text-slate-400" />
                <span>{app.minAndroidVersion}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Testers Progress Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-600 dark:text-slate-400">Campaign Testers Goal</span>
            <span className="text-blue-600 dark:text-blue-400">
              {app.testersJoined} / {app.testersNeeded} Testers Joined ({Math.round((app.testersJoined / app.testersNeeded) * 100)}%)
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-teal-500 rounded-full"
              style={{ width: `${Math.min(100, (app.testersJoined / app.testersNeeded) * 100)}%` }}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold uppercase tracking-wider text-slate-400">About the Application</h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {app.fullDescription || app.shortDescription}
          </p>
        </div>

        {/* Testing Instructions & Daily Proof Requirements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/15 space-y-2">
            <h4 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              Testing Instructions
            </h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {app.testingInstructions || 'Open the app daily, explore features, and report bugs directly.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/15 space-y-2">
            <h4 className="font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Daily Proof Requirement
            </h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {app.dailyProofRequirement || 'Upload 1 screenshot daily showing active app usage.'}
            </p>
          </div>
        </div>

        {/* Direct Google Play Links */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold uppercase tracking-wider text-slate-400">Opt-In & Play Store Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href={app.optInLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-between font-bold text-blue-600 dark:text-blue-400 transition-colors"
            >
              <span className="truncate">Google Play Closed Opt-In Link</span>
              <ExternalLink className="w-4 h-4 shrink-0 ml-1" />
            </a>

            <a
              href={app.playStoreLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-between font-bold text-teal-600 dark:text-teal-400 transition-colors"
            >
              <span className="truncate">Android App Store Link</span>
              <ExternalLink className="w-4 h-4 shrink-0 ml-1" />
            </a>

            {app.googleGroupLink && (
              <a
                href={app.googleGroupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-between font-bold text-indigo-600 dark:text-indigo-400 transition-colors sm:col-span-2"
              >
                <span className="truncate">Google Group Community Opt-In: {app.googleGroupLink}</span>
                <ExternalLink className="w-4 h-4 shrink-0 ml-1" />
              </a>
            )}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? 'Copied Link!' : 'Copy Opt-In Link'}</span>
          </button>

          {isMyOwnApp ? (
            <div className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-xs text-center">
              This is your application listing
            </div>
          ) : hasAlreadyRequested ? (
            <div className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-emerald-500/10 text-emerald-600 font-bold text-xs text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Testing Request Submitted</span>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmRequest(true)}
              className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>Request to Become Tester (+{app.creditsOffered} Credits)</span>
            </button>
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirmRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Tester Responsibility Commitment</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                By requesting to test <strong>{app.appName}</strong>, you agree to:
              </p>

              <ul className="text-xs space-y-2 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Opt-in to the Google Play closed test and keep the app installed for 14 consecutive days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Upload 1 authentic screenshot proof daily.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Earn <strong>+{app.creditsOffered} Credits</strong> upon successful completion.</span>
                </li>
              </ul>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setShowConfirmRequest(false)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowConfirmRequest(false);
                    onRequestToTest(app);
                    onClose();
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Confirm & Request
                </button>
              </div>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};
