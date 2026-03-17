import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Table } from '../../ui/Table';
import { Badge } from '../../ui/Badge';
import { Plus, Edit, Trash2, Shield, Users } from 'lucide-react';

const Roles = () => {
  const [roles] = useState([
    { id: 1, name: 'Super Admin', permissions: ['all'], users: 2, color: 'purple' },
    { id: 2, name: 'Admin', permissions: ['read', 'write', 'analytics'], users: 5, color: 'blue' },
    { id: 3, name: 'Analyst', permissions: ['read', 'analytics'], users: 12, color: 'green' },
    { id: 4, name: 'Viewer', permissions: ['read'], users: 28, color: 'gray' },
  ]);

  const columns = [
    { 
      key: 'name', 
      label: 'Role',
      render: (name, row) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-${row.color}-100`}>
            <Shield className={`h-4 w-4 text-${row.color}-600`} />
          </div>
          <div>
            <p className="font-medium text-gray-900">{name}</p>
            <p className="text-xs text-gray-500">{row.permissions.join(', ')}</p>
          </div>
        </div>
      )
    },
    { 
      key: 'users', 
      label: 'Users',
      render: (count) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{count}</span>
        </div>
      )
    },
    { key: 'permissions', label: 'Permissions', render: (perms) => (
      <div className="flex flex-wrap gap-1">
        {perms.slice(0, 3).map(p => <Badge key={p} variant="default">{p}</Badge>)}
        {perms.length > 3 && <Badge variant="default">+{perms.length - 3}</Badge>}
      </div>
    )},
    { key: 'actions', label: '', render: (_, row) => (
      <div className="flex items-center gap-1">
        <button className="p-1.5 hover:bg-gray-100 rounded" title="Edit">
          <Edit className="h-4 w-4 text-gray-500" />
        </button>
        {row.id !== 1 && (
          <button className="p-1.5 hover:bg-red-50 rounded" title="Delete">
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Roles Management</h2>
          <p className="text-gray-500 mt-1">Define and manage user roles and access levels</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </button>
      </div>

      <Card>
        <Table columns={columns} data={roles} />
      </Card>

      {/* Permissions Legend */}
      <Card title="Permission Types">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'read', label: 'Read', desc: 'View data and reports' },
            { key: 'write', label: 'Write', desc: 'Create and edit content' },
            { key: 'analytics', label: 'Analytics', desc: 'Access analytics dashboards' },
            { key: 'admin', label: 'Admin', desc: 'Manage users and settings' },
          ].map((perm) => (
            <div key={perm.key} className="p-3 bg-gray-50 rounded-lg">
              <Badge variant="info" className="mb-2">{perm.key}</Badge>
              <p className="font-medium text-gray-800">{perm.label}</p>
              <p className="text-xs text-gray-500 mt-1">{perm.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Roles;