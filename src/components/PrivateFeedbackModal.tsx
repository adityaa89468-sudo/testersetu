import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Star, 
  MessageSquare, 
  Send, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Assignment } from '../types';
import { addDoc, collection, db } from '../lib/firebase';

interface PrivateFeedbackModalProps {
  assignment: Assignment | null;
  isOpen: boolean;
  onClose: () => void;
  onFeedbackSubmitted: () => void;
}

export const PrivateFeedbackModal: React.FC<PrivateFeedbackModalProps> = ({
  assignment,
  isOpen,
  onClose,
  onFeedbackSubmitted
}) => {
  const [rating, setRating] = useState(5);
  const [uiRating, setUiRating] = useState(5);
  const [performanceRating, setPerformanceRating] = useState(5);
  const [stabilityRating, setStabilityRating] = useState(5);
  const [easeOfUseRating, setEaseOfUseRating] = useState(5);
  const [bugsFound, setBugsFound] = useState('');
  const [suggestedImprovements, setSuggestedImprovements] = useState('');
  const [deviceModel, setDeviceModel] = useState('Pixel / Android Device');
  const [androidVersion, setAndroidVersion] = useState('Android 14.0');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !assignment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const feedbackDoc = {
        appId: assignment.appId,
        appName: assignment.appName,
        assignmentId: assignment.id,
        testerId: assignment.testerId,
        testerDisplayName: assignment.testerDisplayName,
        appOwnerId: assignment.appOwnerId,
        rating: Number(rating),
        uiRating: Number(uiRating),
        performanceRating: Number(performanceRating),
        stabilityRating: Number(stabilityRating),
        easeOfUseRating: Number(easeOfUseRating),
        bugsFound: bugsFound.trim(),
        suggestedImprovements: suggestedImprovements.trim(),
        deviceModel: deviceModel.trim(),
        androidVersion: androidVersion.trim(),
        createdAt: Date.now()
      };

      await addDoc(collection(db, 'feedback'), feedbackDoc);

      setLoading(false);
      onFeedbackSubmitted();
      onClose();
    } catch (err: any) {
      console.error("Error submitting feedback:", err);
      setError(err.message || 'Failed to submit feedback.');
      setLoading(false);
    }
  };

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className="p-1 cursor-pointer transition-transform hover:scale-110"
          >
            <Star className={`w-4 h-4 ${s <= value ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-black">Submit Private Tester Feedback</h2>
            <p className="text-xs text-slate-500">{assignment.appName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <StarRating value={rating} onChange={setRating} label="Overall Rating" />
            <StarRating value={uiRating} onChange={setUiRating} label="UI / Visual Design" />
            <StarRating value={performanceRating} onChange={setPerformanceRating} label="Performance / Speed" />
            <StarRating value={stabilityRating} onChange={setStabilityRating} label="Stability / Crashes" />
            <StarRating value={easeOfUseRating} onChange={setEaseOfUseRating} label="Ease of Use" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Your Test Device Model</label>
              <input
                type="text"
                value={deviceModel}
                onChange={e => setDeviceModel(e.target.value)}
                placeholder="e.g. Pixel 8 Pro / Galaxy S23"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Android Version</label>
              <input
                type="text"
                value={androidVersion}
                onChange={e => setAndroidVersion(e.target.value)}
                placeholder="e.g. Android 14 (API 34)"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Bugs / Issues Discovered
            </label>
            <textarea
              rows={2}
              value={bugsFound}
              onChange={e => setBugsFound(e.target.value)}
              placeholder="Describe steps to reproduce any crashes or UI bugs..."
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Suggested Improvements
            </label>
            <textarea
              rows={2}
              value={suggestedImprovements}
              onChange={e => setSuggestedImprovements(e.target.value)}
              placeholder="Constructive ideas for features, colors, or navigation..."
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Sending Feedback...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Private Feedback</span>
              </>
            )}
          </button>

        </form>
      </motion.div>
    </div>
  );
};
