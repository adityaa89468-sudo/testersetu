import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Bug,
  Smartphone,
  Coins
} from 'lucide-react';
import { Assignment } from '../types';
import { addDoc, collection, doc, updateDoc, db } from '../lib/firebase';

interface DailyProofModalProps {
  assignment: Assignment | null;
  isOpen: boolean;
  onClose: () => void;
  onProofSubmitted: () => void;
}

export const DailyProofModal: React.FC<DailyProofModalProps> = ({
  assignment,
  isOpen,
  onClose,
  onProofSubmitted
}) => {
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [featuresTested, setFeaturesTested] = useState('');
  const [bugsFound, setBugsFound] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !assignment) return null;

  const currentDay = assignment.currentDay || 1;

  // Preset sample screenshot generator / file upload helper
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSampleScreenshot = () => {
    // Generate a clean mock Android screenshot representation
    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = 360;
    sampleCanvas.height = 780;
    const ctx = sampleCanvas.getContext('2d');
    if (ctx) {
      // Android status bar
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 360, 780);
      
      // Top status bar
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 360, 40);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('9:41 AM  •  5G 100%', 15, 25);

      // App Header
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(0, 40, 360, 80);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(assignment.appName, 20, 85);

      // App Body Card
      ctx.fillStyle = '#1e293b';
      ctx.roundRect(20, 140, 320, 180, 16);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(`Day ${currentDay} Active Session`, 40, 180);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('Testing Package: ' + assignment.appId.slice(0, 15), 40, 210);
      ctx.fillText('Client Time: ' + new Date().toLocaleTimeString(), 40, 235);

      // Verification Stamp
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(180, 420, 45, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('TESTCIRCLE', 138, 418);
      ctx.fillText(`DAY ${currentDay} PROOF`, 132, 438);

      setScreenshotUrl(sampleCanvas.toDataURL('image/png'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshotUrl) {
      setError('Please upload or select a screenshot image.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const proofDoc = {
        assignmentId: assignment.id,
        appId: assignment.appId,
        testerId: assignment.testerId,
        appOwnerId: assignment.appOwnerId,
        dayNumber: currentDay,
        screenshotUrl,
        notes: notes.trim(),
        featuresTested: featuresTested.trim(),
        bugsFound: bugsFound.trim(),
        clientTimestamp: Date.now(),
        serverTimestamp: Date.now(),
        status: 'under_review',
        createdAt: Date.now()
      };

      // Add to dailyProofs sub-collection under assignment
      await addDoc(collection(db, `assignments/${assignment.id}/dailyProofs`), proofDoc);

      setLoading(false);
      onProofSubmitted();
      onClose();
    } catch (err: any) {
      console.error("Error submitting proof:", err);
      setError(err.message || 'Failed to submit testing proof.');
      setLoading(false);
    }
  };

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
            <h2 className="text-xl font-black">Upload Day {currentDay} Testing Proof</h2>
            <p className="text-xs text-slate-500">{assignment.appName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Screenshot Upload / Preview */}
          <div className="space-y-2">
            <label className="block text-slate-700 dark:text-slate-300 font-bold">
              Android Screenshot *
            </label>

            {screenshotUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 p-2 max-h-64 flex justify-center">
                <img src={screenshotUrl} alt="Screenshot Preview" className="max-h-60 rounded-xl object-contain" />
                <button
                  type="button"
                  onClick={() => setScreenshotUrl('')}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-blue-500 rounded-2xl cursor-pointer bg-slate-50 dark:bg-slate-950 transition-colors">
                  <Upload className="w-8 h-8 text-blue-500 mb-2" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">Click to upload screenshot file</span>
                  <span className="text-[10px] text-slate-400">PNG, JPG, WEBP from your Android device</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                <div className="text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">OR</span>
                </div>

                <button
                  type="button"
                  onClick={handleUseSampleScreenshot}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Smartphone className="w-4 h-4 text-blue-500" />
                  <span>Generate Device Screenshot Proof</span>
                </button>
              </div>
            )}
          </div>

          {/* Notes & Features Tested */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Features Tested Today
            </label>
            <input
              type="text"
              value={featuresTested}
              onChange={e => setFeaturesTested(e.target.value)}
              placeholder="e.g. Tested timer start/stop, settings, dynamic colors..."
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Bugs / Issues Encountered
            </label>
            <input
              type="text"
              value={bugsFound}
              onChange={e => setBugsFound(e.target.value)}
              placeholder="e.g. Slight UI lag when switching dark mode..."
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              General Testing Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add optional comments for the app owner..."
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Credit Policy Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Credit Rules & Penalty Notice</span>
            </div>
            <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 list-disc pl-4">
              <li>Earn <strong className="text-emerald-600 dark:text-emerald-400">+1 Credit</strong> for every daily screenshot approved by the app owner.</li>
              <li>A penalty of <strong className="text-rose-600 dark:text-rose-400">-2 Credits</strong> will be deducted if you do not submit or if your screenshot is rejected.</li>
            </ul>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Uploading Proof...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Day {currentDay} Proof</span>
              </>
            )}
          </button>

        </form>
      </motion.div>
    </div>
  );
};
