import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  className?: string;
  variant?: 'default' | 'white' | 'dark';
  layout?: 'row' | 'col';
}

export const TestCircleLogo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  variant = 'default',
  layout = 'row'
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8', svg: 'w-7 h-7', title: 'text-base', subtitle: 'text-[9px]' },
    md: { box: 'w-10 h-10', svg: 'w-9 h-9', title: 'text-xl', subtitle: 'text-[10px]' },
    lg: { box: 'w-14 h-14', svg: 'w-12 h-12', title: 'text-2xl', subtitle: 'text-[11px]' },
    xl: { box: 'w-20 h-20', svg: 'w-16 h-16', title: 'text-3xl', subtitle: 'text-[12px]' },
    '2xl': { box: 'w-28 h-28', svg: 'w-24 h-24', title: 'text-4xl sm:text-5xl', subtitle: 'text-[13px] sm:text-[14px]' }
  };

  const currentSize = sizeMap[size];
  const isCol = layout === 'col';

  // Unique ID prefix to avoid SVG gradient ID collisions
  const idSuffix = React.useId().replace(/:/g, '');

  return (
    <div className={`flex ${isCol ? 'flex-col items-center justify-center text-center gap-3' : 'items-center gap-2.5'} ${className}`}>
      {/* Official TesterSetu Bridge Icon (Mini Logo) */}
      <div className={`relative ${currentSize.box} shrink-0 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-blue-500/15 p-1 group hover:scale-105 transition-transform`}>
        <svg
          viewBox="0 0 200 200"
          className={`${currentSize.svg} w-full h-full object-contain`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`bridgeGrad_${idSuffix}`} x1="20" y1="60" x2="180" y2="140" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="50%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>

            <linearGradient id={`checkGrad_${idSuffix}`} x1="60" y1="130" x2="160" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            <radialGradient id={`sphereGrad_${idSuffix}`} cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="35%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </radialGradient>
          </defs>

          {/* Support Lattice Pillars under Arch */}
          <path
            d="M 62 110 L 62 132 M 82 100 L 82 136 M 100 94 L 100 138 M 118 100 L 118 136 M 138 110 L 138 132"
            stroke={`url(#bridgeGrad_${idSuffix})`}
            strokeWidth="4.5"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Lower Rail Arch */}
          <path
            d="M 32 136 Q 100 86 168 136"
            stroke={`url(#bridgeGrad_${idSuffix})`}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />

          {/* Main Arch Bridge Deck */}
          <path
            d="M 24 146 Q 100 74 176 146"
            stroke={`url(#bridgeGrad_${idSuffix})`}
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
          />

          {/* 3 Tester Avatars (3D Spheres on Bridge) */}
          <g>
            <circle cx="52" cy="108" r="17" fill={`url(#sphereGrad_${idSuffix})`} />
            <circle cx="47" cy="103" r="5" fill="#FFFFFF" opacity="0.5" />
          </g>

          <g>
            <circle cx="100" cy="86" r="21" fill={`url(#sphereGrad_${idSuffix})`} />
            <circle cx="93" cy="79" r="7" fill="#FFFFFF" opacity="0.55" />
          </g>

          <g>
            <circle cx="148" cy="108" r="17" fill={`url(#sphereGrad_${idSuffix})`} />
            <circle cx="143" cy="103" r="5" fill="#FFFFFF" opacity="0.5" />
          </g>

          {/* Dynamic Sky-Cyan Checkmark */}
          <path
            d="M 68 130 L 96 156 L 158 90"
            stroke={`url(#checkGrad_${idSuffix})`}
            strokeWidth="13"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Main Logo Text Branding */}
      {showText && (
        <div className={`flex flex-col leading-none ${isCol ? 'items-center text-center' : 'items-start'}`}>
          <span className={`${currentSize.title} font-black tracking-tight leading-none`}>
            {variant === 'white' ? (
              <span className="text-white">TesterSetu</span>
            ) : (
              <>
                <span className="text-blue-500 dark:text-blue-400">Tester</span>
                <span className="text-cyan-400">Setu</span>
              </>
            )}
          </span>
          <span className={`${currentSize.subtitle} font-extrabold tracking-widest uppercase ${variant === 'white' ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'} mt-1.5`}>
            Mutual Closed Testing
          </span>
        </div>
      )}
    </div>
  );
};
