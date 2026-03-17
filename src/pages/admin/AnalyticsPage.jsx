import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AnalyticsOverview from '../../components/admin/analytics/AnalyticsOverview';
import AnalyticsByCountry from '../../components/admin/analytics/AnalyticsByCountry';
import AnalyticsByDevice from '../../components/admin/analytics/AnalyticsByDevice';
import AnalyticsByBrowser from '../../components/admin/analytics/AnalyticsByBrowser';
import TrafficAnalytics from '../../components/admin/analytics/TrafficAnalytics';
import TopPages from '../../components/admin/analytics/TopPages';

const AnalyticsPage = () => (
  <Routes>
    <Route index element={<AnalyticsOverview />} />
    <Route path="country" element={<AnalyticsByCountry />} />
    <Route path="device" element={<AnalyticsByDevice />} />
    <Route path="browser" element={<AnalyticsByBrowser />} />
    <Route path="traffic" element={<TrafficAnalytics />} />
    <Route path="pages" element={<TopPages />} />
    <Route path="*" element={<Navigate to="/analytics" replace />} />
  </Routes>
);

export default AnalyticsPage;