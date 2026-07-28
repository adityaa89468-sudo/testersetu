import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Flag, 
  AlertCircle, 
  Eye, 
  MessageSquare,
  Clock,
  User,
  Check
} from 'lucide-react';
import { AppListing, DailyProof, Assignment } from '../types';
import { doc, updateDoc, db, recordCreditTransaction, sendNotification } from '../lib/firebase';
import { TestingChatBox } from './TestingChatBox';

interface ProofReviewModalProps {
  app: AppListing | null;
  proofs: DailyProof[];
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onOpenReportModal: (targetType: 'proof', targetId: string) => void;
}

export const ProofReviewModal: React.FC<ProofReviewModalProps> = ({
  app,
  proofs,
  isOpen,
  onClose,
  onRefresh,
  onOpenReportModal
}) => {
  const [selectedProof, setSelectedProof] = useState<DailyProof | null>(proofs[0] || null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !app) return null;

  const handleAccept = async (proof: DailyProof) => {
    setLoading(true);
    try {
      // 1. Update proof status
      const proofRef = doc(db, `assignments/${proof.assignmentId}/dailyProofs`, proof.id);
      await updateDoc(proofRef, {
        status: 'accepted',
        updatedAt: Date.now()
      });

      // 2. Update assignment progress
      const assignmentRef = doc(db, 'assignments', proof.assignmentId);
      const newCompletedDays = Math.min(14, (proof.dayNumber || 1));
      const isFinished = newCompletedDays >= 14;

      await updateDoc(assignmentRef, {
        completedDays: newCompletedDays,
        status: isFinished ? 'completed' : 'in_progress',
        currentDay: Math.min(14, newCompletedDays + 1),
        updatedAt: Date.now()
      });

      // 3. Award +1 credit to tester for approved 1 day screenshot proof
      await recordCreditTransaction(
        proof.testerId,
        1,
        'EARNED_TESTING',
        `Earned +1 credit for Day ${proof.dayNumber} approved screenshot for ${app.appName}`,
        app.id,
        proof.assignmentId
      );

      // 4. Notify tester
      await sendNotification(
        proof.testerId,
        'Daily Proof Approved (+1 Credit) 🎉',
        `Your Day ${proof.dayNumber} screenshot proof for ${app.appName} was accepted (+1 credit awarded).`,
        'proof_accepted',
        proof.assignmentId
      );

      // 5. If day 14 completed, award bonus campaign credits to tester
      if (isFinished) {
        await recordCreditTransaction(
          proof.testerId,
          app.creditsOffered || 15,
          'EARNED_TESTING',
          `Earned +${app.creditsOffered || 15} bonus credits for completing 14-day closed testing for ${app.appName}`,
          app.id,
          proof.assignmentId
        );

        await sendNotification(
          proof.testerId,
          'Campaign Completed! Bonus Credits Received! 🏆',
          `You have earned +${app.creditsOffered || 15} bonus credits for completing 14 consecutive testing days for ${app.appName}.`,
          'campaign_completed',
          app.id
        );
      }

      setLoading(false);
      onRefresh();
    } catch (err) {
      console.error("Error accepting proof:", err);
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedProof || !rejectionReason.trim()) return;
    setLoading(true);

    try {
      const proofRef = doc(db, `assignments/${selectedProof.assignmentId}/dailyProofs`, selectedProof.id);
      await updateDoc(proofRef, {
        status: 'rejected',
        rejectionReason: rejectionReason.trim(),
        updatedAt: Date.now()
      });

      // Deduct 2 credits for rejected/invalid daily screenshot proof
      await recordCreditTransaction(
        selectedProof.testerId,
        -2,
        'PENALTY_MISSED_TESTING',
        `Deducted 2 credits for rejected/invalid Day ${selectedProof.dayNumber} screenshot for ${app.appName}`,
        app.id,
        selectedProof.assignmentId
      );

      await sendNotification(
        selectedProof.testerId,
        'Daily Proof Rejected (-2 Credits) ⚠️',
        `Your Day ${selectedProof.dayNumber} proof for ${app.appName} was rejected (-2 credits deducted): "${rejectionReason.trim()}". Please submit a valid screenshot.`,
        'proof_rejected',
        selectedProof.assignmentId
      );

      setLoading(false);
      setShowRejectDialog(false);
      setRejectionReason('');
      onRefresh();
    } catch (err) {
      console.error("Error rejecting proof:", err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-black">Review Daily Proofs</h2>
            <p className="text-xs text-slate-500">{app.appName} ({proofs.length} Submissions)</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {proofs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Proof Selection List */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {proofs.map((p) => {
                const isSelected = selectedProof?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProof(p)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                      isSelected
                        ? 'bg-blue-500/10 border-blue-500/30'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Day {p.dayNumber} Proof</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        p.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-600' :
                        p.status === 'rejected' ? 'bg-rose-500/10 text-rose-600' :
                        'bg-amber-500/10 text-amber-600'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {new Date(p.clientTimestamp || p.createdAt).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Selected Proof Inspector */}
            {selectedProof && (
              <div className="md:col-span-2 space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                
                {/* Screenshot Image Preview */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex justify-center max-h-64">
                  <img
                    src={selectedProof.screenshotUrl}
                    alt="Proof"
                    className="max-h-60 rounded-xl object-contain"
                  />
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span>Submitted Day {selectedProof.dayNumber} Proof</span>
                    <button
                      onClick={() => onOpenReportModal('proof', selectedProof.id)}
                      className="text-rose-500 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Flag className="w-3.5 h-3.5" /> Report Suspicious Proof
                    </button>
                  </div>

                  {selectedProof.featuresTested && (
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong>Features Tested:</strong> {selectedProof.featuresTested}
                    </p>
                  )}

                  {selectedProof.bugsFound && (
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong>Bugs Reported:</strong> {selectedProof.bugsFound}
                    </p>
                  )}

                  {selectedProof.notes && (
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong>Notes:</strong> {selectedProof.notes}
                    </p>
                  )}

                  {/* Chat Box with Tester */}
                  <div className="pt-2">
                    <TestingChatBox
                      assignmentId={selectedProof.assignmentId}
                      appName={app.appName}
                      otherPartyId={selectedProof.testerId}
                      userRole="developer"
                      compact={true}
                    />
                  </div>
                </div>

                {/* Review Actions */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => handleAccept(selectedProof)}
                    disabled={loading || selectedProof.status === 'accepted'}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{selectedProof.status === 'accepted' ? 'Accepted' : 'Accept Proof'}</span>
                  </button>

                  <button
                    onClick={() => setShowRejectDialog(true)}
                    disabled={loading}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-600 font-bold text-xs border border-rose-500/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Proof</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            No daily proof submissions pending for this app.
          </div>
        )}

        {/* Rejection Reason Dialog */}
        {showRejectDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Reason for Rejection</h3>
              <p className="text-slate-500">Provide feedback so the tester can re-upload a clear screenshot.</p>
              
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] font-medium">
                <strong>Penalty Warning:</strong> Rejecting this proof will deduct <strong>2 credits</strong> from the tester's balance.
              </div>

              <textarea
                rows={3}
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="e.g. Screenshot does not show app UI, or image is blurry..."
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-rose-500"
              />

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setShowRejectDialog(false)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={loading || !rejectionReason.trim()}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
