import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Coins, Calendar, ArrowRight, CheckCircle2, Smartphone, Users } from 'lucide-react';
import { TestCircleLogo } from './TestCircleLogo';

interface SplashAndOnboardingProps {
  onComplete?: () => void;
  onGetStarted?: () => void;
  onLogin?: () => void;
}

export const SplashAndOnboarding: React.FC<SplashAndOnboardingProps> = ({ onComplete, onGetStarted, onLogin }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else if (onComplete) {
      onComplete();
    }
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else if (onComplete) {
      onComplete();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const slides = [
    {
      icon: Users,
      badge: 'Community Marketplace',
      title: 'Find Genuine Testers',
      description: 'Connect with Android developers who are also preparing their apps for Google Play closed testing.',
      bgGradient: 'from-blue-600/10 via-indigo-600/5 to-transparent',
      illustration: (
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative z-10 w-36 h-36 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Android Beta</p>
                <p className="text-[10px] text-teal-600 font-medium">14 Testers Active</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-3/4 rounded-full" />
              </div>
              <p className="text-[10px] text-slate-400 font-mono text-right">15/20 Testers</p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Coins,
      badge: 'Credit Rewards',
      title: 'Test Apps and Earn Credits',
      description: 'Help other developers, submit useful feedback and earn credits for your own testing campaign.',
      bgGradient: 'from-teal-600/10 via-emerald-600/5 to-transparent',
      illustration: (
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative z-10 w-36 h-36 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-4 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-600">
              <Coins className="w-7 h-7" />
            </div>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100">+15 Credits</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">
              Verified Testing
            </span>
          </div>
        </div>
      )
    },
    {
      icon: Calendar,
      badge: '14-Day Progress',
      title: 'Track Every Testing Day',
      description: 'Upload testing proof and monitor your progress from one simple dashboard.',
      bgGradient: 'from-indigo-600/10 via-purple-600/5 to-transparent',
      illustration: (
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative z-10 w-40 h-36 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Testing streak</span>
              <span className="text-xs font-mono font-bold text-indigo-600">Day 12/14</span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-4 rounded-md flex items-center justify-center text-[9px] font-bold ${
                    i < 12
                      ? 'bg-emerald-500 text-white'
                      : i === 12
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 text-center">Daily Proof Verified</p>
          </div>
        </div>
      )
    }
  ];

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-6 text-slate-100">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center justify-center space-y-6 text-center max-w-sm w-full mx-auto"
        >
          {/* Main Logo & Glow Container - Stacked Column Layout */}
          <div className="relative flex flex-col items-center justify-center text-center mx-auto w-full">
            <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
            <TestCircleLogo size="2xl" layout="col" showText={true} />
          </div>

          <div className="w-40 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-3 mx-auto">
            <div className="w-full h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-teal-400 animate-pulse" />
          </div>
        </motion.div>
      </div>
    );
  }

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 sm:p-10 transition-colors overflow-y-auto">
      <div className="w-full max-w-md mx-auto h-full flex flex-col justify-between items-center my-auto">
        
        {/* Top Header Bar */}
        <div className="w-full shrink-0 flex items-center justify-between py-2">
          <TestCircleLogo size="sm" />

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogin}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer px-3 py-1.5 rounded-full"
            >
              Log In
            </button>
            <button
              onClick={handleGetStarted}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 transition-colors cursor-pointer px-3 py-1.5 rounded-full"
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Main Slide Content - Vertically and Horizontally Centered */}
        <div className="flex-1 w-full flex items-center justify-center py-6 my-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full text-center space-y-6 flex flex-col items-center justify-center"
            >
              <div className="flex items-center justify-center w-full mx-auto">
                {slide.illustration}
              </div>

              <div className="space-y-3 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <slide.icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{slide.badge}</span>
                </span>

                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white text-center">
                  {slide.title}
                </h2>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-center">
                  {slide.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Controls */}
        <div className="w-full space-y-6 shrink-0 py-2">
          
          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === index
                    ? 'w-8 bg-blue-600 dark:bg-blue-500'
                    : 'w-2 bg-slate-300 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Next / Get Started Button */}
          {currentSlide < slides.length - 1 ? (
            <button
              onClick={() => setCurrentSlide(prev => prev + 1)}
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleGetStarted}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Get Started</span>
              </button>
              <div className="text-center">
                <button
                  onClick={handleLogin}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Already have an account? <span className="text-blue-600 dark:text-blue-400 font-bold">Log In</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
