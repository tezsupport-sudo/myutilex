/**
 * SmartUtils Design System — Spacing
 * Enforces uniform padding, margins, alignment, and grid sizes across screen densities.
 */

export const spacing = {
  // Container alignments
  container: 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',
  containerNarrow: 'mx-auto max-w-3xl px-4 sm:px-6 lg:px-8',
  containerHeader: 'h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8',
  
  // Outer margins
  sectionPadding: 'py-12 sm:py-16 md:py-20',
  sectionSpacing: 'space-y-12 sm:space-y-16',

  // Sizing in px mapping
  px: {
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

  // Grid configs
  grid: {
    bento: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
    tools: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6',
    fiveCol: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5'
  }
};
