import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const TestCircleLogo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7', svg: 'w-5 h-5', text: 'text-base' },
    md: { box: 'w-10 h-10', svg: 'w-7 h-7', text: 'text-lg' },
    lg: { box: 'w-14 h-14', svg: 'w-10 h-10', text: 'text-2xl' },
    xl: { box: 'w-20 h-20', svg: 'w-14 h-14', text: 'text-4xl' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Interconnected Circles with Checkmark Icon */}
      <div className={`relative ${currentSize.box} rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 p-0.5 shadow-lg shadow-blue-500/20 shrink-0 flex items-center justify-center`}>
        <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden relative">
          <svg
            viewBox="0 0 100 100"
            className={`${currentSize.svg} text-blue-600 dark:text-blue-400`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top Circle */}
            <circle cx="50" cy="34" r="22" stroke="currentColor" strokeWidth="7" opacity="0.85" />
            {/* Bottom Left Circle */}
            <circle cx="34" cy="62" r="22" stroke="#0d9488" strokeWidth="7" opacity="0.85" />
            {/* Bottom Right Circle */}
            <circle cx="66" cy="62" r="22" stroke="#2563eb" strokeWidth="7" opacity="0.85" />
            {/* Center Checkmark */}
            <path
              d="M38 50L46 58L62 42"
              stroke="#10b981"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`${currentSize.text} font-black tracking-tight text-slate-900 dark:text-white leading-none`}>
            Tester<span className="text-blue-600 dark:text-blue-400">Setu</span>
          </span>
          <span className="text-[10px] font-bold tracking-widest uppercase text-teal-600 dark:text-teal-400 leading-tight">
            Mutual Closed Testing
          </span>
        </div>
      )}
    </div>
  );
};
