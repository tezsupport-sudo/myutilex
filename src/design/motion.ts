/**
 * SmartUtils Design System — Motion & Animations
 * Houses transition timing configurations, easing curves, and key motion objects.
 */

export const motion = {
  // Motion curve structures for Framer Motion
  spring: { type: 'spring', damping: 26, stiffness: 350 },
  springTight: { type: 'spring', damping: 20, stiffness: 400 },
  
  // Interactive gesture behaviors
  hoverScale: { y: -4, scale: 1.01 },
  hoverTap: { scale: 0.98 },
  
  // Exit-entry definitions
  fadeInUp: {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 15 }
  },
  
  // Speed values in classes
  transitionFast: 'transition-all duration-150',
  transitionNormal: 'transition-all duration-200',
  transitionSlow: 'transition-all duration-300'
};
