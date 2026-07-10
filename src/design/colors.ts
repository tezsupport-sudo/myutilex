/**
 * SmartUtils Design System — Colors
 * Enforces uniform light and dark color classes across all components.
 */

export const colors = {
  // Brand accents
  brand: {
    primary: 'text-indigo-600 dark:text-indigo-400',
    primaryHover: 'hover:text-indigo-700 dark:hover:text-indigo-300',
    primaryBg: 'bg-indigo-600 dark:bg-indigo-500',
    primaryBgHover: 'hover:bg-indigo-700 dark:hover:bg-indigo-600',
    accent: 'bg-indigo-50/50 dark:bg-indigo-950/10 text-indigo-600 dark:text-indigo-400',
  },
  
  // Neutral surfaces
  surface: {
    base: 'bg-white dark:bg-gray-900',
    card: 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 border',
    cardHover: 'hover:border-indigo-400/50 hover:shadow-md dark:hover:border-indigo-500/50',
    panel: 'bg-gray-50/50 dark:bg-gray-950/20 border-gray-150 dark:border-gray-800 border',
    accentPanel: 'bg-indigo-50/40 border-indigo-100 dark:bg-indigo-950/15 dark:border-indigo-900/40 border',
  },

  // Text colors
  text: {
    primary: 'text-gray-950 dark:text-white',
    secondary: 'text-gray-600 dark:text-gray-300',
    muted: 'text-gray-400 dark:text-gray-500',
    subtle: 'text-gray-500 dark:text-gray-400',
    link: 'text-indigo-600 dark:text-indigo-400 hover:underline',
  },

  // Borders
  border: {
    subtle: 'border-gray-100 dark:border-gray-850',
    standard: 'border-gray-200 dark:border-gray-800',
    strong: 'border-gray-300 dark:border-gray-700',
    focus: 'focus:border-indigo-500 focus:ring-indigo-500/20 dark:focus:border-indigo-400',
  },

  // Contextual feedback states
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
  neutral: {
    text: 'text-gray-600 dark:text-gray-300',
    bg: 'bg-gray-50 dark:bg-gray-900',
    border: 'border-gray-200 dark:border-gray-800',
    combined: 'text-gray-600 bg-gray-50 border border-gray-200 dark:text-gray-300 dark:bg-gray-900 dark:border-gray-800'
  }
};
