import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserManagement from '../../components/admin/settings/UserManagement';
import Roles from '../../components/admin/settings/Roles';
import Permissions from '../../components/admin/settings/Permissions';
import AuditLogs from '../../components/admin/settings/AuditLogs';

const SettingsPage = () => (
  <Routes>
    <Route index element={<Navigate to="/settings/users" replace />} />
    <Route path="users" element={<UserManagement />} />
    <Route path="roles" element={<Roles />} />
    <Route path="permissions" element={<Permissions />} />
    <Route path="audit-logs" element={<AuditLogs />} />
    <Route path="*" element={<Navigate to="/settings/users" replace />} />
  </Routes>
);

export default SettingsPage;