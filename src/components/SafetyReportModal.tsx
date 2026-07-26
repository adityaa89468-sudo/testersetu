import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Flag, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ReportReason } from '../types';
import { useAuth } from '../context/AuthContext';
import { addDoc, collection, db } from '../lib/firebase';

interface SafetyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'app' | 'proof' | 'user';
  targetId: string;
  targetTitle?: string;
}

export const SafetyReportModal: React.FC<SafetyReportModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetTitle
}) => {
  const { user, userProfile } = useAuth();
  const [reason, setReason] = useState<ReportReason>('invalid_link');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      await addDoc(collection(db, 'reports'), {
        reporterId: user.uid,
        reporterDisplayName: userProfile?.displayName || user.displayName || 'Developer',
        targetType,
        targetId,
        targetTitle: targetTitle || '',
        reason,
        details: details.trim(),
        status: 'pending',
        createdAt: Date.now()
      });

      setLoading(false);
      setMsg('Report submitted to moderation queue.');
      setTimeout(() => {
        onClose();
        setMsg(null);
      }, 1500);
    } catch (err: any) {
      console.error("Error submitting report:", err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 my-8 text-slate-900 dark:text-slate-100"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-rose-500 font-black text-sm">
            <Flag className="w-4 h-4" />
            <span>Report Violation / Issue</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {msg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{msg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Reason for Report</label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none"
            >
              <option value="invalid_link">Invalid or broken Opt-In / Play Store Link</option>
              <option value="misleading_info">Misleading App Info / Fake Listing</option>
              <option value="suspicious_proof">Suspicious or Generated Fake Proof Screenshot</option>
              <option value="inappropriate_content">Inappropriate Content</option>
              <option value="harassment">Offensive Feedback / Harassment</option>
              <option value="credit_manipulation">Credit System Manipulation</option>
              <option value="other">Other Violation</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Additional Details</label>
            <textarea
              rows={3}
              required
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="Describe the issue in detail..."
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Submitting Report...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Violation Report</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
