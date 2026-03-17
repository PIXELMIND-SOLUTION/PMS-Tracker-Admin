import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Table } from '../../ui/Table';
import { Badge } from '../../ui/Badge';
import { Plus, Search, Edit, Trash2, Shield } from 'lucide-react';

const UserManagement = () => {
  const [users] = useState([
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', lastLogin: '2024-01-15' },
    { id: 2, name: 'John Analyst', email: 'john@example.com', role: 'analyst', status: 'active', lastLogin: '2024-01-14' },
    { id: 3, name: 'Sarah Viewer', email: 'sarah@example.com', role: 'viewer', status: 'inactive', lastLogin: '2024-01-10' },
  ]);

  const columns = [
    { key: 'name', label: 'User', render: (name, row) => (
      <div>
        <div className="font-medium text-gray-900">{name}</div>
        <div className="text-sm text-gray-500">{row.email}</div>
      </div>
    )},
    { key: 'role', label: 'Role', render: (role) => (
      <Badge variant={role === 'admin' ? 'purple' : role === 'analyst' ? 'info' : 'default'}>
        {role}
      </Badge>
    )},
    { key: 'status', label: 'Status', render: (status) => (
      <Badge variant={status === 'active' ? 'success' : 'error'}>{status}</Badge>
    )},
    { key: 'lastLogin', label: 'Last Login', render: (date) => new Date(date).toLocaleDateString() },
    { key: 'actions', label: '', render: (_, row) => (
      <div className="flex items-center gap-1">
        <button className="p-1.5 hover:bg-gray-100 rounded" title="Edit"><Edit className="h-4 w-4 text-gray-500" /></button>
        <button className="p-1.5 hover:bg-gray-100 rounded" title="Permissions"><Shield className="h-4 w-4 text-gray-500" /></button>
        {row.id !== 1 && <button className="p-1.5 hover:bg-red-50 rounded" title="Delete"><Trash2 className="h-4 w-4 text-red-500" /></button>}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-gray-500 mt-1">Manage admin users, roles, and permissions</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Roles</option>
            <option>Admin</option>
            <option>Analyst</option>
            <option>Viewer</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <Table columns={columns} data={users} />
      </Card>
    </div>
  );
};

export default UserManagement;