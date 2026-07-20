/**
 * Super Admin Dashboard Constants
 *
 * Contains all constant values used across the Super Admin dashboard
 * for better maintainability and consistency.
 */

// Platform statistics refresh interval (in milliseconds)
export const STATS_REFRESH_INTERVAL = 30000; // 30 seconds

// Sidebar collapse state localStorage key
export const SIDEBAR_COLLAPSE_KEY = 'superAdminSidebarCollapsed';

// Default platform statistics (fallback values)
export const DEFAULT_PLATFORM_STATS = {
  totalAirlines: 0,
  activeAirlines: 0,
  totalAirports: 0,
  totalFlights: 0,
  activeFlights: 0,
  totalBookings: 0,
  totalUsers: 0,
  totalAgents: 0,
  systemRevenue: 0,
  commissionRevenue: 0,
  pendingApprovals: 0,
  securityAlerts: 0,
  systemUptime: 99.0,
};

// Badge color schemes for different alert types
export const ALERT_COLORS = {
  error: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  success: 'bg-green-100 text-green-800',
  info: 'bg-blue-100 text-blue-800',
};

// Common CSS classes for consistent styling
export const COMMON_STYLES = {
  pageContainer: 'flex min-h-screen bg-background',
  contentArea: 'flex-1 transition-all duration-300 ease-in-out',
  header: 'bg-background border-b border-border sticky top-0 z-30',
  headerContent: 'px-6 py-4',
  mainContent: 'flex-1 p-6',
  statCard: 'p-4 rounded-xl border',
  gradientCard: 'bg-gradient-to-br',
};

// KPI card color schemes
export const KPI_COLORS = {
  airlines: {
    bg: 'from-purple-50 to-purple-100',
    border: 'border-purple-200',
    text: 'text-purple-600',
    icon: 'text-purple-600',
  },
  flights: {
    bg: 'from-blue-50 to-blue-100',
    border: 'border-blue-200',
    text: 'text-blue-600',
    icon: 'text-blue-600',
  },
  bookings: {
    bg: 'from-green-50 to-green-100',
    border: 'border-green-200',
    text: 'text-green-600',
    icon: 'text-green-600',
  },
  revenue: {
    bg: 'from-orange-50 to-orange-100',
    border: 'border-orange-200',
    text: 'text-orange-600',
    icon: 'text-orange-600',
  },
  uptime: {
    bg: 'from-indigo-50 to-indigo-100',
    border: 'border-indigo-200',
    text: 'text-indigo-600',
    icon: 'text-indigo-600',
  },
  security: {
    bg: 'from-red-50 to-red-100',
    border: 'border-red-200',
    text: 'text-red-600',
    icon: 'text-red-600',
  },
};

// Error messages
export const ERROR_MESSAGES = {
  navigationError: 'Failed to navigate to the requested section',
  dataLoadError: 'Failed to load dashboard data',
  networkError: 'Network connection error. Please check your connection.',
  unknownError: 'An unexpected error occurred',
};

// Success messages
export const SUCCESS_MESSAGES = {
  dataRefreshed: 'Dashboard data refreshed successfully',
  settingsSaved: 'Settings saved successfully',
  actionCompleted: 'Action completed successfully',
};

// Loading states
export const LOADING_STATES = {
  initial: 'initial',
  loading: 'loading',
  success: 'success',
  error: 'error',
};