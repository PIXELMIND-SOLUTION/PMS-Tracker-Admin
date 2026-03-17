import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';

// Layouts
import AdminLayout from './components/layout/AdminLayout';

// Pages
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Pages
import Dashboard from './pages/Dashboard'; // Your existing dashboard
import VisitorsPage from './pages/admin/VisitorsPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import SettingsPage from './pages/admin/SettingsPage';
import ReportsPage from './pages/admin/ReportsPage';

// Individual Components for direct routes
import VisitorDetail from './components/admin/visitors/VisitorDetail';
import SearchVisitors from './components/admin/visitors/SearchVisitors';
import IPDetailsLookup from './components/admin/visitors/IPDetailsLookup';
import DateRangeFilter from './components/admin/visitors/DateRangeFilter';
import RecentVisitors from './components/admin/visitors/RecentVisitors';

function App() {
  // Mock auth - replace with real auth logic
  const [isAuthenticated] = useState(() => !!localStorage.getItem('admin_token'));

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Admin Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Visitors Routes */}
            <Route path="visitors" element={<VisitorsPage />} />
            <Route path="visitors/:id" element={<VisitorDetail />} />
            <Route path="visitors/search" element={<SearchVisitors />} />
            <Route path="visitors/ip-lookup" element={<IPDetailsLookup />} />
            <Route path="visitors/location" element={<DateRangeFilter />} />
            <Route path="visitors/date-range" element={<DateRangeFilter />} />
            <Route path="visitors/recent" element={<RecentVisitors />} />
            
            {/* Analytics Routes */}
            <Route path="analytics/*" element={<AnalyticsPage />} />
            
            {/* Settings Routes */}
            <Route path="settings/*" element={<SettingsPage />} />
            
            {/* Reports */}
            <Route path="reports" element={<ReportsPage />} />
            <Route path="help" element={<div className="p-6"><h2 className="text-2xl font-bold">Help & Support</h2><p className="text-gray-600 mt-2">Documentation and support resources coming soon.</p></div>} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
          
          {/* Catch-all for unauthenticated */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;