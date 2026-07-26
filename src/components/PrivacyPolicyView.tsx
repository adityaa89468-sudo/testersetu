import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  Lock, 
  Database, 
  Eye, 
  UserCheck, 
  Trash2, 
  Mail, 
  ArrowLeft,
  Smartphone
} from 'lucide-react';

interface PrivacyPolicyViewProps {
  onClose?: () => void;
  isStandalonePage?: boolean;
  onNavigateHome?: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({
  onClose,
  isStandalonePage = false,
  onNavigateHome
}) => {
  const [copied, setCopied] = useState(false);

  // Construct canonical Privacy Policy URL
  const privacyUrl = `${window.location.origin}${window.location.pathname}?page=privacy`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(privacyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const content = (
    <div className="space-y-6 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed">
      
      {/* Privacy Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 border border-blue-500/20 shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Official Privacy Notice & Data Governance</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white">Privacy Policy for TesterCircle</h1>
        <p className="text-xs text-slate-300">
          Last Updated: July 2026 &bull; Compliant with Google Play Store 20-Tester Beta Requirement & Firebase Security Protocols
        </p>

        {/* Shareable Privacy URL Box */}
        <div className="pt-2">
          <label className="block text-[11px] font-bold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Direct Shareable Privacy Policy URL (for Google Play Console & OAuth):</span>
            {copied && <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Copied to clipboard</span>}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={privacyUrl}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-blue-300 font-mono text-xs select-all outline-none"
            />
            <button
              onClick={handleCopyUrl}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy URL'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs">
            <Lock className="w-4 h-4 text-emerald-500" />
            <span>No Data Selling</span>
          </div>
          <p className="text-[11px] text-slate-500">We never sell or monetize your personal data or screenshots to third parties.</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs">
            <Smartphone className="w-4 h-4 text-blue-500" />
            <span>Beta Testing Focus</span>
          </div>
          <p className="text-[11px] text-slate-500">Data collected is used exclusively for verifying daily test compliance & feedback.</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs">
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span>Account Control</span>
          </div>
          <p className="text-[11px] text-slate-500">You retain full right to delete your developer account & testing logs anytime.</p>
        </div>
      </div>

      {/* Main Policy Body */}
      <div className="space-y-6 pt-2">
        
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Database className="w-4 h-4 text-blue-500" />
            1. Information We Collect
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            TesterCircle collects minimal necessary information to operate our Android closed-beta community testing platform and verify daily testing requirements:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Account Credentials:</strong> When signing in with Google Authentication, we collect your display name, email address, profile avatar picture URL, and unique user identifier (UID) managed securely by Firebase Auth.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">App Listing Details:</strong> When developers register an Android application, we store the Play Store package name, Google Group / Web Opt-in testing links, application title, category, description, and target tester count.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Proof of Testing:</strong> When testers submit daily testing verification, we collect opt-in uploaded screenshots, test completion timestamps, device model metadata, and optional feedback logs.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Private Feedback & Bug Reports:</strong> Crash logs, usability feedback, and star ratings voluntarily provided by testers directly to app developers.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <UserCheck className="w-4 h-4 text-indigo-500" />
            2. How We Use Collected Data
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Your data is strictly processed for the following operational purposes:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li>Facilitating closed-beta testing compliance under Google Play Console rules (20 testers for 14 continuous days).</li>
            <li>Tracking daily testing streaks, reliability scores, and allocating testing campaign credits.</li>
            <li>Allowing developers to verify that testers are actively installing and evaluating their APKs or opt-in builds.</li>
            <li>Sending critical platform alerts, such as proof approvals, task assignments, or safety flags.</li>
            <li>Preventing automated bots, fraud, duplicate submissions, or unauthorized usage of testing campaigns.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Eye className="w-4 h-4 text-teal-500" />
            3. Data Sharing & Disclosure
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            We prioritize user confidentiality and implement granular access controls:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li><strong className="text-slate-900 dark:text-slate-100">With App Developers:</strong> The developer who owns a campaign can view proof screenshots and private bug reports submitted for their specific app.</li>
            <li><strong className="text-slate-900 dark:text-slate-100">Infrastructure Providers:</strong> Data is hosted on Google Cloud Platform and Firebase (Firestore database, Firebase Storage, and Authentication).</li>
            <li><strong className="text-slate-900 dark:text-slate-100">Legal Compliance:</strong> We disclose data only if required by law or in response to valid court subpoenas or safety enforcement.</li>
            <li><strong className="text-slate-900 dark:text-slate-100">No Advertising Brokers:</strong> We do not sell, license, or share user lists with third-party advertisers.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Lock className="w-4 h-4 text-amber-500" />
            4. Data Security & Retention
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            All network communication takes place over HTTPS using standard TLS encryption. Firebase Firestore security rules strictly prevent unauthorized users from modifying or inspecting other users' private account records or submissions.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Trash2 className="w-4 h-4 text-rose-500" />
            5. Your Rights & Account Deletion
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            You retain total control over your personal information:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li><strong className="text-slate-900 dark:text-slate-100">Access & Edit:</strong> You can edit your profile display name, developer studio name, and country directly in the Profile & Settings menu.</li>
            <li><strong className="text-slate-900 dark:text-slate-100">Permanent Account Deletion:</strong> You can permanently delete your developer account directly from the app's Profile page. Deletion purges your profile data and unlinks your campaign activities.</li>
            <li><strong className="text-slate-900 dark:text-slate-100">Data Export:</strong> To request a full JSON export of your submitted data, contact our privacy contact below.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Mail className="w-4 h-4 text-blue-500" />
            6. Contact & Data Controller
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            If you have questions, concerns, or data protection requests regarding this Privacy Policy or Google Play Console integration, please reach out to:
          </p>
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">TesterCircle Privacy & Security Team</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-mono">privacy@testercircle.app</p>
            </div>
            <a
              href="mailto:privacy@testercircle.app"
              className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-blue-500 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Us</span>
            </a>
          </div>
        </section>

      </div>
    </div>
  );

  if (isStandalonePage) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to TesterCircle App</span>
            </button>
            <span className="text-xs font-semibold text-slate-500">Official Privacy Policy</span>
          </div>

          <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[88vh] overflow-y-auto space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10 -mx-6 sm:-mx-8 px-6 sm:px-8 pt-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">Privacy Policy</h3>
          </div>
          {onClose && (
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {content}

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
            >
              I Understand & Close
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
