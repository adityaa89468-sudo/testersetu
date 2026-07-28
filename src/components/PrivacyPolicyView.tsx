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
        <h1 className="text-xl sm:text-2xl font-black text-white">Privacy Policy for TesterSetu</h1>
        <p className="text-xs text-slate-300">
          Last Updated: July 2026 &bull; Compliant with Google Play Store 20-Tester Closed Beta Requirements & Firebase Security Protocols
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
            TesterSetu collects minimal necessary information to operate our Android closed-beta community testing platform and verify daily testing requirements:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Account Credentials & Profile:</strong> Display name, email address, profile avatar picture URL, and unique user identifier (UID) managed securely by Firebase Auth, as well as optional developer studio name, country, and Google Play Store developer URL.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Android App Campaign Data:</strong> Android Package Name (e.g. <code>com.example.app</code>), Google Group email, Web Opt-in testing join URL, application title, category, description, track type, and app icon image URLs.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Daily Screenshot Proof & Metadata:</strong> Uploaded daily screenshot images verifying active app installation and testing, submission timestamps, day numbers (Day 1 to 14), and optional device model or Android version metadata.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Bug Reports & Tester Feedback:</strong> Star ratings, usability comments, bug severity, and crash descriptions voluntarily submitted by testers to developers.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Credits, Streaks & Penalty Records:</strong> Account credit transactions (100 welcome bonus credits, +1 credit daily approved proof reward, -2 credits penalty for unsubmitted or rejected screenshots, +15 completion bonus), active testing streaks, and reliability scores (%).
            </li>
          </ul>
        </section>

        {/* Section 2: Permissions & Device Access */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Smartphone className="w-4 h-4 text-emerald-500" />
            2. Permissions & Device Access Requested
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            To provide seamless testing workflows, TesterSetu requests the following explicit device and browser permissions:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Storage & File Picker Access:</strong> Allows selecting and uploading image files (screenshots for daily proof submission and app graphics/icon images). We only access image files explicitly chosen by you.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Local Storage & Session Tokens:</strong> Used to maintain secure user authentication sessions, store dark/light theme preferences, and cache active testing progress.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">External Web Navigation:</strong> Enables redirecting developers and testers to Google Play Store opt-in testing links (<code>play.google.com/apps/testing/...</code>), Google Groups, and Play Store developer pages.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <UserCheck className="w-4 h-4 text-indigo-500" />
            3. How We Use Collected Data & Access
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Your data and permissions are strictly used for operational testing workflows:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li>Facilitating closed-beta testing compliance under Google Play Console rules (20 opt-in testers for 14 continuous days).</li>
            <li>Verifying genuine daily app testing through human screenshot proof reviews.</li>
            <li>Managing credit allocations (+1 credit for approved proof, -2 credits penalty for missed or rejected screenshots, 100 initial welcome credits).</li>
            <li>Calculating tester reliability scores (%) and tracking active testing streaks.</li>
            <li>Sending real-time platform notifications for proof approvals, rejections, and task updates.</li>
            <li>Preventing automated bots, fraud, fake screenshots, or duplicate campaign submissions.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Eye className="w-4 h-4 text-teal-500" />
            4. Data Sharing & Disclosure
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            We prioritize user confidentiality and restrict access through granular controls:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li><strong className="text-slate-900 dark:text-slate-100">With App Developers:</strong> App owners can view proof screenshots and private bug reports submitted specifically for their testing campaign.</li>
            <li><strong className="text-slate-900 dark:text-slate-100">Infrastructure Subprocessors:</strong> Data is hosted securely on Google Cloud Platform and Firebase (Firestore Database, Firebase Storage, and Authentication).</li>
            <li><strong className="text-slate-900 dark:text-slate-100">No Advertising Brokers:</strong> We NEVER sell, license, trade, or monetize your personal information or screenshots to third-party advertisers.</li>
            <li><strong className="text-slate-900 dark:text-slate-100">Legal Compliance:</strong> We disclose information only if strictly required by law or valid subpoena.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Lock className="w-4 h-4 text-amber-500" />
            5. Data Security & Storage Rules
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            All data transmission occurs over HTTPS using standard TLS 1.3 encryption. Firebase Firestore security rules strictly prevent unauthorized users from reading or altering other users' private accounts or submission records.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Trash2 className="w-4 h-4 text-rose-500" />
            6. Your Rights & Permanent Account Deletion
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            You retain full control over your personal data:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li><strong className="text-slate-900 dark:text-slate-100">Access & Edit:</strong> Update your display name, developer studio, and Play Store developer link at any time in Profile & Settings.</li>
            <li><strong className="text-slate-900 dark:text-slate-100">Permanent Account Deletion:</strong> You can submit an account deletion request directly from Profile & Settings. This sends an email request to testersetu@gmail.com and your account will be permanently deleted within 5-7 business days.</li>
            <li><strong className="text-slate-900 dark:text-slate-100">Data Export Requests:</strong> To request a full export of your submitted data, contact our privacy officer below.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Mail className="w-4 h-4 text-blue-500" />
            7. Contact & Data Controller
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            If you have questions, concerns, or data protection requests regarding this Privacy Policy or Google Play Console integration, please reach out to:
          </p>
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">TesterSetu Privacy & Security Team</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-mono">privacy@testersetu.app</p>
            </div>
            <a
              href="mailto:privacy@testersetu.app"
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
              <span>Back to TesterSetu App</span>
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
