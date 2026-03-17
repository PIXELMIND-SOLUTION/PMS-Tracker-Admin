import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Save, Shield, Check, X } from 'lucide-react';

const Permissions = () => {
  const [selectedRole, setSelectedRole] = useState('analyst');
  const [permissions, setPermissions] = useState({
    visitors: { read: true, write: false, delete: false },
    analytics: { read: true, write: true, delete: false },
    settings: { read: false, write: false, delete: false },
    reports: { read: true, write: true, delete: false },
  });

  const modules = [
    { key: 'visitors', label: 'Visitors Management', icon: Users },
    { key: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { key: 'settings', label: 'System Settings', icon: Settings },
    { key: 'reports', label: 'Export & Reports', icon: FileText },
  ];

  const permissionTypes = [
    { key: 'read', label: 'Read', color: 'blue' },
    { key: 'write', label: 'Write', color: 'green' },
    { key: 'delete', label: 'Delete', color: 'red' },
  ];

  const togglePermission = (module, type) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [type]: !prev[module][type]
      }
    }));
  };

  const savePermissions = () => {
    // API call would go here
    alert('Permissions saved!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Permissions Manager</h2>
        <p className="text-gray-500 mt-1">Configure granular access controls for each role</p>
      </div>

      {/* Role Selector */}
      <Card>
        <div className="flex flex-wrap gap-2">
          {['superadmin', 'admin', 'analyst', 'viewer'].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                selectedRole === role
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </Card>

      {/* Permissions Matrix */}
      <Card title="Permission Matrix">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Module</th>
                {permissionTypes.map((type) => (
                  <th key={type.key} className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                    <Badge variant={type.color}>{type.label}</Badge>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((module) => (
                <tr key={module.key} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <module.icon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-800">{module.label}</span>
                    </div>
                  </td>
                  {permissionTypes.map((type) => (
                    <td key={type.key} className="px-4 py-3 text-center">
                      <button
                        onClick={() => togglePermission(module.key, type.key)}
                        className={`p-2 rounded-lg transition-colors ${
                          permissions[module.key]?.[type.key]
                            ? `bg-${type.color}-100 text-${type.color}-600`
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {permissions[module.key]?.[type.key] ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Reset Changes
        </button>
        <button 
          onClick={savePermissions}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Permissions
        </button>
      </div>
    </div>
  );
};

// Import icons at top of file
import { Users, BarChart3, Settings, FileText } from 'lucide-react';

export default Permissions;