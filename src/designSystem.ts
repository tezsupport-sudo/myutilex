/**
 * SmartUtils Platform Design System Tokens
 * Prepared for Sprint 4.4 — "Professional Product Intelligence"
 * 
 * Enforces visual consistency across the entire application.
 */

export const designTokens = {
  colors: {
    success: {
      text: 'text-emerald-700 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
      border: 'border-emerald-100 dark:border-emerald-900/40',
      combined: 'text-emerald-700 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-900/40 border'
    },
    warning: {
      text: 'text-amber-700 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      border: 'border-amber-100 dark:border-amber-900/40',
      combined: 'text-amber-700 bg-amber-50 border-amber-100 dark:text-amber-400 dark:bg-amber-950/20 dark:border-amber-900/40 border'
    },
    danger: {
      text: 'text-rose-700 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/20',
      border: 'border-rose-100 dark:border-rose-900/40',
      combined: 'text-rose-700 bg-rose-50 border-rose-100 dark:text-rose-400 dark:bg-rose-950/20 dark:border-rose-900/40 border'
    },
    info: {
      text: 'text-indigo-700 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/20',
      border: 'border-indigo-100 dark:border-indigo-900/40',
      combined: 'text-indigo-700 bg-indigo-50 border-indigo-100 dark:text-indigo-400 dark:bg-indigo-950/20 dark:border-indigo-900/40 border'
    },
    accent: {
      text: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50/50 dark:bg-indigo-950/10'
    },
    neutral: {
      text: 'text-gray-600 dark:text-gray-300',
      bg: 'bg-gray-50 dark:bg-gray-900',
      border: 'border-gray-200 dark:border-gray-800',
      combined: 'text-gray-600 bg-gray-50 border border-gray-200 dark:text-gray-300 dark:bg-gray-900 dark:border-gray-800'
    }
  },
  typography: {
    displayXl: 'font-sans text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight',
    displayL: 'font-sans text-2xl md:text-3xl font-bold tracking-tight',
    heading: 'font-sans text-lg md:text-xl font-bold tracking-tight',
    subheading: 'font-sans text-sm font-semibold tracking-normal text-gray-500 dark:text-gray-400',
    body: 'font-sans text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed',
    caption: 'font-sans text-[11px] text-gray-400 dark:text-gray-500',
    mono: 'font-mono text-xs text-gray-500 dark:text-gray-400'
  },
  spacing: {
    s4: '4px',
    s8: '8px',
    s12: '12px',
    s16: '16px',
    s20: '20px',
    s24: '24px',
    s32: '32px',
    s48: '48px',
    s64: '64px'
  },
  radius: {
    small: 'rounded-md',
    medium: 'rounded-lg',
    large: 'rounded-xl',
    xl: 'rounded-2xl'
  },
  shadows: {
    light: 'shadow-[0_2px_8px_rgba(0,0,0,0.02)]',
    medium: 'shadow-[0_4px_24px_rgba(0,0,0,0.02)]',
    large: 'shadow-[0_12px_30px_rgba(99,102,241,0.06)]',
    glow: 'shadow-[0_0_20px_rgba(99,102,241,0.15)] dark:shadow-[0_0_25px_rgba(99,102,241,0.05)]'
  },
  animations: {
    spring: { type: 'spring', damping: 26, stiffness: 350 },
    springTight: { type: 'spring', damping: 20, stiffness: 400 },
    hoverScale: { y: -4, scale: 1.01 },
    transitionFast: 'transition-all duration-150',
    transitionNormal: 'transition-all duration-200',
    transitionSlow: 'transition-all duration-300'
  }
};
