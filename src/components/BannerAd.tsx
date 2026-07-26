import React, { useState } from 'react';
import { ExternalLink, X, Sparkles, Smartphone, ShieldCheck, Zap } from 'lucide-react';

interface BannerAdProps {
  type?: 'community' | 'admob' | 'promo';
  className?: string;
}

const AD_ITEMS = [
  {
    id: 'ad-1',
    title: 'Google Play Console 20-Testers Accelerator',
    description: 'Boost your closed beta testing campaign with verified daily Android active testers.',
    tag: 'Sponsored',
    cta: 'Learn More',
    url: 'https://play.google.com/console',
    bgGradient: 'from-blue-600/10 via-indigo-600/5 to-teal-500/10',
    borderColor: 'border-blue-500/20',
    icon: Sparkles,
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
  },
  {
    id: 'ad-2',
    title: 'Android Studio Jellyfish & Koala Support',
    description: 'Need help setting up Gradle Kotlin DSL or AAB builds? Explore our Android Developer Toolkit.',
    tag: 'Dev Resource',
    cta: 'View Toolkit',
    url: 'https://developer.android.com/studio',
    bgGradient: 'from-emerald-600/10 via-teal-600/5 to-cyan-500/10',
    borderColor: 'border-emerald-500/20',
    icon: Smartphone,
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
  },
  {
    id: 'ad-3',
    title: 'AdMob & Firebase Integration Made Easy',
    description: 'Monetize your Android apps seamlessly while keeping user experience smooth and non-intrusive.',
    tag: 'Community Ad',
    cta: 'Explore Guidelines',
    url: 'https://admob.google.com',
    bgGradient: 'from-amber-600/10 via-orange-600/5 to-rose-500/10',
    borderColor: 'border-amber-500/20',
    icon: Zap,
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  }
];

export const BannerAd: React.FC<BannerAdProps> = ({ className = '' }) => {
  const [dismissed, setDismissed] = useState(false);
  const [adIndex] = useState(() => Math.floor(Math.random() * AD_ITEMS.length));

  if (dismissed) return null;

  const ad = AD_ITEMS[adIndex];
  const IconComponent = ad.icon;

  return (
    <div
      className={`relative w-full rounded-2xl bg-gradient-to-r ${ad.bgGradient} border ${ad.borderColor} p-3.5 sm:p-4 my-4 transition-all duration-300 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
            <IconComponent className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${ad.badgeColor}`}>
                {ad.tag}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                {ad.title}
              </h4>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">
              {ad.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={ad.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-slate-100 dark:text-slate-900 font-bold text-[11px] shadow-sm transition-colors cursor-pointer"
          >
            <span>{ad.cta}</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={() => setDismissed(true)}
            title="Dismiss Ad"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
