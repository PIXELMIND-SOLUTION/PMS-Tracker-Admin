import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Table } from '../../ui/Table';
import { Badge } from '../../ui/Badge';
import { Search, Filter, Download, Calendar } from 'lucide-react';

const AuditLogs = () => {
  const [logs] = useState([
    { id: 1, action: 'User Created', user: 'admin@example.com', ip: '192.168.1.1', timestamp: '2024-01-15T10:30:00', status: 'success' },
    { id: 2, action: 'Permission Updated', user: 'admin@example.com', ip: '192.168.1.1', timestamp: '2024-01-15T09:15:00', status: 'success' },
    { id: 3, action: 'Login Failed', user: 'unknown@example.com', ip: '203.0.113.42', timestamp: '2024-01-14T23:45:00', status: 'error' },
    { id: 4, action: 'Data Exported', user: 'analyst@example.com', ip: '198.51.100.23', timestamp: '2024-01-14T16:20:00', status: 'success' },
    { id: 5, action: 'Settings Changed', user: 'admin@example.com', ip: '192.168.1.1', timestamp: '2024-01-14T14:10:00', status: 'success' },
  ]);

  const columns = [
    { key: 'action', label: 'Action', render: (v) => <span className="font-medium">{v}</span> },
    { key: 'user', label: 'User' },
    { key: 'ip', label: 'IP Address', render: (v) => <code className="text-xs bg-gray-100 px-2 py-1 rounded">{v}</code> },
    { key: 'status', label: 'Status', render: (v) => <Badge variant={v === 'success' ? 'success' : 'error'}>{v}</Badge> },
    { key: 'timestamp', label: 'Timestamp', render: (v) => new Date(v).toLocaleString() },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Audit Logs</h2>
        <p className="text-gray-500 mt-1">Track all administrative actions and security events</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search actions, users, IPs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Actions</option>
            <option>User Created</option>
            <option>Permission Updated</option>
            <option>Login Failed</option>
            <option>Data Exported</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>Success</option>
            <option>Error</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </button>
        </div>
      </Card>

      {/* Logs Table */}
      <Card 
        title={`Recent Logs (${logs.length})`}
        actions={
          <button className="inline-flex items-center px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
        }
      >
        <Table columns={columns} data={logs} />
      </Card>

      {/* Log Retention Notice */}
      <Card className="bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Log Retention Policy</p>
            <p className="text-sm text-yellow-700 mt-1">
              Audit logs are retained for 90 days. For compliance requirements, 
              consider enabling extended retention or external log forwarding.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

import { Shield } from 'lucide-react';

export default AuditLogs;