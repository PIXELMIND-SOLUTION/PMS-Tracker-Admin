import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Get page title from path
  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/dashboard': 'Dashboard',
      '/analytics': 'Analytics Overview',
      '/analytics/country': 'Visitors by Country',
      '/analytics/device': 'Visitors by Device',
      '/analytics/browser': 'Visitors by Browser',
      '/analytics/traffic': 'Traffic Trends',
      '/analytics/pages': 'Top Pages',
      '/visitors': 'All Visitors',
      '/visitors/search': 'Search Visitors',
      '/visitors/ip-lookup': 'IP Lookup',
      '/visitors/location': 'Visitors by Location',
      '/visitors/date-range': 'Date Range Filter',
      '/visitors/recent': 'Recent Visitors',
      '/settings': 'Settings',
      '/settings/users': 'User Management',
      '/settings/roles': 'Roles',
      '/settings/permissions': 'Permissions',
      '/settings/audit-logs': 'Audit Logs',
      '/reports': 'Reports',
      '/help': 'Help & Support',
    };
    return titles[path] || 'Admin Panel';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:ml-64">
        <Header toggleSidebar={toggleSidebar} title={getPageTitle()} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;