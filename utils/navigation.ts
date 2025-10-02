// Navigation utilities for OCEH app
// This would be expanded with React Navigation in a full implementation

export interface NavigationRoute {
  name: string;
  component: React.ComponentType<any>;
  title: string;
}

export const routes = {
  HOME: 'Home',
  DEBRIS_TRACKING: 'DebrisTracking',
  RECYCLING_HUB: 'RecyclingHub',
  BUSINESS_DASHBOARD: 'BusinessDashboard',
  SETTINGS: 'Settings',
} as const;

export type RouteNames = typeof routes[keyof typeof routes];

// Simple navigation functions for now
export const navigateTo = (route: RouteNames) => {
  console.log(`Navigating to: ${route}`);
  // In a full app, this would use React Navigation
};

export const goBack = () => {
  console.log('Going back');
  // In a full app, this would use React Navigation
};

export const resetToHome = () => {
  console.log('Resetting to home');
  // In a full app, this would use React Navigation
};