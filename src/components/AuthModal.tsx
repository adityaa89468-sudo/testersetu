import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Globe, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  signInWithGoogle, 
  signInWithEmail, 
  signUpWithEmail, 
  resetPassword,
  db 
} from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { TestCircleLogo } from './TestCircleLogo';
import { UserProfile } from '../types';
import { DEFAULT_PLATFORM_CONFIG } from '../lib/seedData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'login' | 'register' | 'forgot';
  onSwitchMode?: (mode: 'login' | 'register' | 'forgot') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode: externalMode, onSwitchMode }) => {
  const [internalMode, setInternalMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  const mode = externalMode || internalMode;

  const setMode = (newMode: 'login' | 'register' | 'forgot') => {
    setInternalMode(newMode);
    if (onSwitchMode) {
      onSwitchMode(newMode);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      if (externalMode) {
        setInternalMode(externalMode);
      }
      setError(null);
      setSuccessMsg(null);
    }
  }, [isOpen, externalMode]);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [developerName, setDeveloperName] = useState('');
  const [country, setCountry] = useState('United States');
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'experienced' | 'studio'>('intermediate');
  const [playStoreDevLink, setPlayStoreDevLink] = useState('');
  const [agreedToManualTesting, setAgreedToManualTesting] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    const { user, error: googleErr } = await signInWithGoogle();
    if (googleErr) {
      setError(googleErr);
      setLoading(false);
    } else {
      setLoading(false);
      onClose();
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const { user, error: loginErr } = await signInWithEmail(email, password);
        if (loginErr) {
          setError(loginErr);
        } else {
          onClose();
        }
      } else if (mode === 'register') {
        if (!agreedToManualTesting) {
          setError('You must agree to perform genuine manual testing.');
          setLoading(false);
          return;
        }

        const { user, error: signUpErr } = await signUpWithEmail(email, password, displayName || 'Android Developer');
        if (signUpErr) {
          setError(signUpErr);
        } else if (user) {
          // Store complete developer profile
          const userDocRef = doc(db, 'users', user.uid);
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || email,
            displayName: displayName || 'Android Developer',
            developerName: developerName || `${displayName || 'Dev'} Studio`,
            country,
            experience,
            photoURL: user.photoURL || '',
            playStoreDevLink,
            agreedToManualTesting: true,
            credits: DEFAULT_PLATFORM_CONFIG.welcomeBonusCredits,
            testingStreak: 1,
            reliabilityScore: 100,
            completedTestsCount: 0,
            submittedAppsCount: 0,
            role: email === 'adityaa89468@gmail.com' ? 'admin' : 'user',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            notificationPreferences: {
              emailReminders: true,
              pushNotifications: true,
              proofUpdates: true
            }
          };

          await setDoc(userDocRef, newProfile);
          onClose();
        }
      } else if (mode === 'forgot') {
        const { error: resetErr } = await resetPassword(email);
        if (resetErr) {
          setError(resetErr);
        } else {
          setSuccessMsg('Password reset link sent to your email address.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <TestCircleLogo size="lg" className="justify-center" showText={false} />
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Join TesterSetu'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'login' && 'Sign in to manage your closed testing campaigns & tasks'}
            {mode === 'register' && 'Create your developer account and receive 100 welcome credits'}
            {mode === 'forgot' && 'Enter your registered email to receive a password reset link'}
          </p>
        </div>

        {/* Alert Error / Success */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Google One-Click Auth */}
        {mode !== 'forgot' && (
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>
        )}

        {mode !== 'forgot' && (
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
            <span className="relative px-3 bg-white dark:bg-slate-900 text-[10px] font-bold uppercase tracking-widest text-slate-400">or email</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4 text-xs">
          {mode === 'register' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Your Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Developer / Studio Name</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={developerName}
                    onChange={e => setDeveloperName(e.target.value)}
                    placeholder="e.g. Nexus Games Studio"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 dark:text-slate-300 font-bold">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Country</label>
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="United States">United States</option>
                    <option value="India">India</option>
                    <option value="Germany">Germany</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Japan">Japan</option>
                    <option value="Other">Other Country</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Android Dev Experience</label>
                  <select
                    value={experience}
                    onChange={e => setExperience(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="beginner">Beginner (First App)</option>
                    <option value="intermediate">Intermediate (1-3 Apps)</option>
                    <option value="experienced">Experienced (4+ Apps)</option>
                    <option value="studio">Professional Studio</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Google Play Developer Page (Optional)</label>
                <input
                  type="url"
                  value={playStoreDevLink}
                  onChange={e => setPlayStoreDevLink(e.target.value)}
                  placeholder="https://play.google.com/store/apps/dev?id=..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Mandatory Agreement Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreedToManualTesting}
                  onChange={e => setAgreedToManualTesting(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-[11px] leading-snug">
                  I commit to conducting <strong>genuine manual testing</strong> on real Android devices or emulators, and uploading authentic daily screenshots. I understand bots or fake proof will result in permanent account suspension.
                </span>
              </label>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <span>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'register' && 'Create Account (+100 Credits)'}
                  {mode === 'forgot' && 'Send Reset Email'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
          {mode === 'login' && (
            <p>
              Don't have a developer account?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); }}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign Up
              </button>
            </p>
          )}

          {mode === 'register' && (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign In
              </button>
            </p>
          )}

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Back to Sign In
            </button>
          )}
        </div>

      </motion.div>
    </div>
  );
};
