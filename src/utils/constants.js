export const API_ENDPOINTS = {
  TRACK: '/track',
  VISITORS: '/visitors',
  ANALYTICS: {
    BY_COUNTRY: '/visitors/analytics/by-country',
    BY_DEVICE: '/visitors/analytics/by-device',
    BY_BROWSER: '/visitors/analytics/by-browser',
    BY_OS: '/visitors/analytics/by-os',
    HOURLY: '/visitors/analytics/hourly',
    DAILY: '/visitors/analytics/daily',
    TOP_PAGES: '/visitors/analytics/top-pages',
  },
  SEARCH: '/visitors/search',
  IP_DETAILS: '/ip-details',
};

export const DATE_PRESETS = {
  TODAY: { label: 'Today', days: 0 },
  YESTERDAY: { label: 'Yesterday', days: 1 },
  WEEK: { label: 'Last 7 Days', days: 7 },
  MONTH: { label: 'Last 30 Days', days: 30 },
  QUARTER: { label: 'Last 90 Days', days: 90 },
};

export const DEVICE_TYPES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
  UNKNOWN: 'unknown',
};

export const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  ADMIN: 'admin',
};

export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  ANALYST: 'analyst',
  VIEWER: 'viewer',
};

export const TABLE_PAGE_SIZES = [10, 25, 50, 100];

export const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  gray: '#6B7280',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'admin_token',
  AUTH_USER: 'admin_user',
  THEME: 'admin_theme',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
};