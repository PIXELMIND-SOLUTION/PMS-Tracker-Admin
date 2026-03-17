import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Download, FileText, Calendar, Filter, Clock } from 'lucide-react';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('visitors');
  const [dateRange, setDateRange] = useState('month');

  const reportTemplates = [
    {
      id: 'visitors',
      name: 'Visitor Summary Report',
      description: 'Overview of visitor traffic, locations, and devices',
      icon: FileText,
      formats: ['PDF', 'CSV', 'Excel'],
    },
    {
      id: 'analytics',
      name: 'Analytics Deep Dive',
      description: 'Detailed breakdown of browser, OS, and page performance',
      icon: FileText,
      formats: ['PDF', 'CSV'],
    },
    {
      id: 'security',
      name: 'Security & Access Log',
      description: 'Audit trail of admin actions and authentication events',
      icon: FileText,
      formats: ['PDF', 'CSV'],
    },
    {
      id: 'custom',
      name: 'Custom Report Builder',
      description: 'Create tailored reports with selected metrics and filters',
      icon: FileText,
      formats: ['PDF', 'CSV', 'Excel', 'JSON'],
    },
  ];

  const generateReport = (template) => {
    // In real app: API call to generate report
    alert(`Generating ${template.name} for ${dateRange}...\n\nThis would trigger a backend report generation job.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Reports Center</h2>
        <p className="text-gray-500 mt-1">Generate and export analytics reports</p>
      </div>

      {/* Report Configuration */}
      <Card title="Report Settings">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {reportTemplates.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last Quarter</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>PDF</option>
              <option>CSV</option>
              <option>Excel</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Available Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {reportTemplates.map((template) => {
          const Icon = template.icon;
          const isSelected = reportType === template.id;
          
          return (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-blue-500 border-blue-300' : 'hover:border-gray-300'
              }`}
              onClick={() => setReportType(template.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{template.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.formats.map((fmt) => (
                        <Badge key={fmt} variant="default">{fmt}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <Badge variant="success">Selected</Badge>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Generate Button */}
      <div className="flex justify-end">
        <button 
          onClick={() => generateReport(reportTemplates.find(t => t.id === reportType))}
          className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          <Download className="h-4 w-4 mr-2" />
          Generate Report
        </button>
      </div>

      {/* Scheduled Reports */}
      <Card title="Scheduled Reports">
        <div className="space-y-3">
          {[
            { name: 'Weekly Analytics Summary', schedule: 'Every Monday at 9:00 AM', lastRun: '2 days ago', nextRun: 'in 5 days' },
            { name: 'Monthly Visitor Export', schedule: '1st of month at 2:00 AM', lastRun: '15 days ago', nextRun: 'in 15 days' },
          ].map((report, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">{report.name}</p>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {report.schedule}</span>
                  <span>Last: {report.lastRun}</span>
                  <span>Next: {report.nextRun}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-200 rounded" title="Edit">
                  <Filter className="h-4 w-4 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded" title="Run Now">
                  <Download className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;