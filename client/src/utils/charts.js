// Chart configuration utilities for FocusTube

/**
 * Default chart colors matching the design system
 */
export const chartColors = {
  primary: 'hsl(174, 72%, 40%)',
  primaryLight: 'hsl(174, 72%, 50%)',
  accent: 'hsl(16, 85%, 57%)',
  accentLight: 'hsl(16, 85%, 67%)',
  success: 'hsl(142, 76%, 36%)',
  warning: 'hsl(38, 92%, 50%)',
  muted: 'hsl(215, 16%, 47%)',
  background: 'hsl(210, 20%, 98%)',
};

/**
 * Dark mode chart colors
 */
export const chartColorsDark = {
  primary: 'hsl(174, 72%, 50%)',
  primaryLight: 'hsl(174, 72%, 60%)',
  accent: 'hsl(16, 85%, 60%)',
  accentLight: 'hsl(16, 85%, 70%)',
  success: 'hsl(142, 76%, 42%)',
  warning: 'hsl(38, 92%, 55%)',
  muted: 'hsl(215, 20%, 65%)',
  background: 'hsl(222, 47%, 6%)',
};

/**
 * Common chart configuration
 */
export const chartConfig = {
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
  animationDuration: 800,
  gridStroke: '#e2e8f0',
  gridStrokeDark: '#334155',
};

/**
 * Generate gradient definitions for charts
 */
export const getGradientDefs = (id, startColor, endColor) => ({
  id,
  x1: '0',
  y1: '0',
  x2: '0',
  y2: '1',
  stops: [
    { offset: '0%', color: startColor, opacity: 0.8 },
    { offset: '100%', color: endColor, opacity: 0.1 },
  ],
});

/**
 * Format large numbers for display
 */
export const formatChartNumber = (value) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toString();
};

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

/**
 * Get appropriate color based on value trend
 */
export const getTrendColor = (change) => {
  if (change > 0) return chartColors.success;
  if (change < 0) return 'hsl(0, 84%, 60%)';
  return chartColors.muted;
};
