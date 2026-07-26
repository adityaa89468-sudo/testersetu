import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Smartphone, 
  Link as LinkIcon, 
  Coins, 
  ShieldCheck, 
  AlertCircle,
  Upload,
  Info,
  HelpCircle,
  Lock,
  Check,
  Users,
  ExternalLink,
  Copy
} from 'lucide-react';
import { AppListing, AppCategory } from '../types';
import { useAuth } from '../context/AuthContext';
import { db, addDoc, collection, doc, updateDoc } from '../lib/firebase';
import { recordCreditTransaction } from '../lib/firebase';

interface AddAppWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onAppCreated: () => void;
}

export const AddAppWizard: React.FC<AddAppWizardProps> = ({ isOpen, onClose, onAppCreated }) => {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const googleGroupEmail = 'developer-community-t4t@googlegroups.com';
  const googleGroupUrl = 'https://groups.google.com/g/developer-community-t4t';

  const handleCopyGroupEmail = () => {
    navigator.clipboard.writeText(googleGroupEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Form State
  const [appName, setAppName] = useState('');
  const [appUrl, setAppUrl] = useState('');
  const [packageName, setPackageName] = useState('');
  const [appIconUrl, setAppIconUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80');

  // Helper to extract package name from URL
  const extractPackageNameFromUrl = (urlStr: string): string => {
    if (!urlStr) return '';
    const trimmed = urlStr.trim();

    try {
      const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      const idParam = parsed.searchParams.get('id');
      if (idParam && /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/i.test(idParam)) {
        return idParam;
      }

      const pathMatch = parsed.pathname.match(/\/apps\/testing\/([a-zA-Z0-9_.]+)/);
      if (pathMatch && pathMatch[1] && /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/i.test(pathMatch[1])) {
        return pathMatch[1];
      }
    } catch (e) {
      // ignore URL parsing error
    }

    const idMatch = trimmed.match(/(?:id=|testing\/)([a-zA-Z][a-zA-Z0-9_]*(?:\.[a-zA-Z0-9_]+)+)/i);
    if (idMatch && idMatch[1]) {
      return idMatch[1];
    }

    const pkgMatch = trimmed.match(/([a-zA-Z][a-zA-Z0-9_]*(?:\.[a-zA-Z0-9_]+)+)/);
    if (pkgMatch && pkgMatch[1] && pkgMatch[1].includes('.')) {
      if (/^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/i.test(pkgMatch[1])) {
        return pkgMatch[1];
      }
    }

    return '';
  };

  const handleAppUrlChange = (val: string) => {
    setAppUrl(val);
    const detected = extractPackageNameFromUrl(val);
    setPackageName(detected);
  };

  // Icon Preset options
  const presetIcons = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=150&auto=format&fit=crop&q=80'
  ];

  // Icon File Upload Handler
  const handleIconFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('App icon file size must be smaller than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 200;
          canvas.height = 200;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, 200, 200);
            setAppIconUrl(canvas.toDataURL('image/png'));
          } else {
            setAppIconUrl(reader.result as string);
          }
        };
        img.onerror = () => {
          setAppIconUrl(reader.result as string);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!user) {
      setError('You must be signed in.');
      return;
    }

    if (!appName.trim() || !appUrl.trim()) {
      setError('Please fill in App Name and App URL.');
      return;
    }

    if (!packageName.trim()) {
      setError('Could not auto-detect a valid package name from the App URL. Please check your Google Play URL (e.g. containing id=com.example.app).');
      return;
    }

    if (!appIconUrl) {
      setError('Please upload an app icon image file.');
      return;
    }

    const pkgRegex = /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/i;
    if (!pkgRegex.test(packageName.trim())) {
      setError('Detected package name format is invalid (e.g. com.mycompany.myapp).');
      return;
    }

    setLoading(true);

    try {
      const defaultDesc = `Android application testing campaign for ${appName.trim()}.`;
      const detectedPkg = packageName.trim().toLowerCase();
      
      const optIn = appUrl.includes('/apps/testing/') 
        ? appUrl.trim() 
        : `https://play.google.com/apps/testing/${detectedPkg}`;

      const storeLink = appUrl.includes('id=') 
        ? appUrl.trim() 
        : `https://play.google.com/store/apps/details?id=${detectedPkg}`;

      const privacy = `${window.location.origin}${window.location.pathname}?page=privacy`;

      const newAppDoc: Omit<AppListing, 'id'> = {
        ownerId: user.uid,
        ownerDisplayName: userProfile?.displayName || user.displayName || 'Developer',
        ownerDevName: userProfile?.developerName || 'Dev Studio',
        appName: appName.trim(),
        packageName: detectedPkg,
        category: 'Tools',
        shortDescription: defaultDesc,
        fullDescription: defaultDesc,
        appIconUrl: appIconUrl || presetIcons[0],
        minAndroidVersion: 'Android 8.0+',
        optInLink: optIn,
        playStoreLink: storeLink,
        googleGroupLink: '',
        privacyPolicyUrl: privacy,
        devContactEmail: user.email || '',
        testersNeeded: 20,
        testersJoined: 0,
        testingDurationDays: 14,
        startDate: Date.now(),
        testingInstructions: 'Please open the app daily, explore features, and report any crashes or UI glitches.',
        dailyProofRequirement: 'Screenshot showing active app usage on your Android device.',
        creditsOffered: 15,
        status: 'active',
        isVerified: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await addDoc(collection(db, 'apps'), newAppDoc);

      // Record transaction if campaign credits reserved
      const campaignCost = 20 * 15;
      if (campaignCost > 0) {
        await recordCreditTransaction(
          user.uid,
          -campaignCost,
          'RESERVED_CAMPAIGN',
          `Reserved ${campaignCost} credits for testing campaign: ${appName}`
        );
      }

      // Update submitted apps count
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        submittedAppsCount: (userProfile?.submittedAppsCount || 0) + 1
      });

      setLoading(false);
      onAppCreated();
      onClose();
    } catch (err: any) {
      console.error("Error creating app listing:", err);
      setError(err.message || 'Failed to publish app listing.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 my-8 max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-black">Submit Android App Listing</h2>
            <p className="text-xs text-slate-500">Provide app details to start your testing campaign</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Group Setup Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-teal-500/10 border border-blue-500/20 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-blue-600 text-white shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                Join Google Group First
              </h3>
            </div>
            
            <a
              href={googleGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] shadow-sm transition-colors cursor-pointer shrink-0"
            >
              <span>Join Group</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Steps to enable community testing for your app:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 pl-0.5 text-slate-600 dark:text-slate-400">
              <li>
                Click <strong className="text-blue-600 dark:text-blue-400 font-bold">Join Group</strong> above to join our Google Group community.
              </li>
              <li>
                In <strong className="text-slate-800 dark:text-slate-200">Google Play Console</strong> &rarr; <strong className="text-slate-800 dark:text-slate-200">Closed Testing</strong> &rarr; <strong className="text-slate-800 dark:text-slate-200">Testers</strong>, select Google Groups and add this group email:
              </li>
            </ol>
            
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 mt-1 font-mono text-[11px]">
              <span className="text-blue-600 dark:text-blue-400 font-bold truncate">
                {googleGroupEmail}
              </span>
              <button
                type="button"
                onClick={handleCopyGroupEmail}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-sans font-bold text-[10px] cursor-pointer transition-colors shrink-0"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 italic pt-0.5">
              3. Once added in Play Console, submit your app details below to list your app in the community.
            </p>
          </div>
        </div>

        {/* Basic App Details Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              App Name *
            </label>
            <input
              type="text"
              required
              value={appName}
              onChange={e => setAppName(e.target.value)}
              placeholder="e.g. FocusPomo - Task Timer"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              App URL (Google Play Store or Closed Testing Link) *
            </label>
            <input
              type="url"
              required
              value={appUrl}
              onChange={e => handleAppUrlChange(e.target.value)}
              placeholder="https://play.google.com/store/apps/details?id=com.yourcompany.yourapp"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-[11px]"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Paste your Google Play Store URL or Testing Opt-in link. Package name will be extracted automatically.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-slate-700 dark:text-slate-300 font-bold">
                Package Name (Auto-Detected) *
              </label>
              {packageName ? (
                <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Auto-detected
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Auto-detects from URL
                </span>
              )}
            </div>
            <input
              type="text"
              readOnly
              disabled
              value={packageName}
              placeholder="Auto-detected package name will appear here..."
              className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px] cursor-not-allowed select-none opacity-90"
            />
          </div>

          {/* Upload App Icon from File */}
          <div className="space-y-2">
            <label className="block text-slate-700 dark:text-slate-300 font-bold">
              Upload App Icon *
            </label>

            <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <img
                src={appIconUrl}
                alt="App Icon Preview"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/30 shrink-0 bg-slate-800"
                referrerPolicy="no-referrer"
              />
              
              <div className="flex-1 space-y-1.5">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer transition-colors shadow-sm">
                  <Upload className="w-4 h-4" />
                  <span>Choose Icon File</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleIconFileUpload} 
                    className="hidden" 
                  />
                </label>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Upload PNG, JPG, or WEBP image file for your app icon.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] text-slate-400 font-bold">Or pick preset:</span>
              {presetIcons.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAppIconUrl(url)}
                  className={`w-7 h-7 rounded-lg overflow-hidden border-2 cursor-pointer transition-transform hover:scale-105 ${
                    appIconUrl === url ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <img src={url} alt="Preset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-pulse">Publishing App...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish App Listing</span>
                </>
              )}
            </button>
          </div>
        </form>

      </motion.div>
    </div>
  );
};
