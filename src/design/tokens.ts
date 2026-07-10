/**
 * SmartUtils Design System — Unified Visual API
 * This file acts as the primary visual specification engine.
 * Every component in our architecture imports and consumes this visual system.
 */

import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { motion } from './motion';
import { radius } from './radius';
import { shadow } from './shadow';
import { zIndex } from './zIndex';

export const designTokens = {
  colors,
  spacing,
  typography,
  animations: motion, // alias to preserve compatibility with existing designTokens.animations references
  motion,
  radius,
  shadow,
  zIndex
};

export default designTokens;
export { colors, spacing, typography, motion, radius, shadow, zIndex };
