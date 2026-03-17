import React, { useState } from 'react';
import { visitorApi } from '../../../api/visitorApi';
import { Table } from '../../ui/Table';
import { Card } from '../../ui/Card';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { ErrorMessage } from '../../ui/ErrorMessage';
import { Badge } from '../../ui/Badge';
import { Calendar, Clock, Download } from 'lucide-react';

const DateRangeFilter = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [preset, setPreset] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const presets = {
    today: { label: 'Today', getRange: () => {
      const today = new Date().toISOString().split('T')[0];
      return { start: today, end: today };
    }},
    yesterday: { label: 'Yesterday', getRange: () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      return { start: yesterday, end: yesterday };
    }},
    week: { label: 'Last 7 Days', getRange: () => {
      const end = new Date().toISOString().split('T')[0];
      const start = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
      return { start, end };
    }},
    month: { label: 'Last 30 Days', getRange: () => {
      const end = new Date().toISOString().split('T')[0];
      const start = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
      return { start, end };
    }},
  };

  const applyPreset = (key) => {
    const range = presets[key].getRange();
    setStartDate(range.start);
    setEndDate(range.end);
    setPreset(key);
    fetchByRange(range.start, range.end);
  };

  const fetchByRange = async (start, end) => {
    if (!start || !end) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await visitorApi.getVisitorsByDateRange(start, end);
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPreset('');
    fetchByRange(startDate, endDate);
  };

  const exportData = () => {
    const csv = [
      ['IP', 'Browser', 'OS', 'Device', 'Country', 'City', 'Page', 'Timestamp'].join(','),
      ...data.map(v => [
        v.ip, v.browser, v.os, v.device, v.country, v.city, `"${v.page}"`, new Date(v.createdAt).toISOString()
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitors-${startDate}-to-${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'ip', label: 'IP', render: (v) => <code className="text-xs bg-gray-100 px-2 py-1 rounded">{v}</code> },
    { key: 'browser', label: 'Browser' },
    { key: 'device', label: 'Device', render: (v) => <Badge variant="purple">{v}</Badge> },
    { key: 'location', label: 'Location', render: (_, row) => `${row.city || ''}, ${row.country}`.trim() || 'Unknown' },
    { key: 'page', label: 'Page', render: (v) => <span className="truncate max-w-xs block">{v}</span> },
    { key: 'createdAt', label: 'Timestamp', render: (v) => new Date(v).toLocaleString() },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Filter by Date Range</h2>
        <p className="text-gray-500 mt-1">Analyze visitor data for specific time periods</p>
      </div>

      {/* Date Filters */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(presets).map(([key, { label }]) => (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  preset === key 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Custom Range */}
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={loading || !startDate || !endDate}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Apply Filter
            </button>
          </div>
        </form>
      </Card>

      {/* Results */}
      {error && <ErrorMessage message={error} onRetry={() => fetchByRange(startDate, endDate)} />}
      
      {loading && <LoadingSpinner className="h-32" />}
      
      {!loading && data.length > 0 && (
        <Card 
          title={`Results: ${data.length} visitors`} 
          subtitle={`${startDate} to ${endDate}`}
          actions={
            <button 
              onClick={exportData}
              className="inline-flex items-center px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </button>
          }
        >
          <Table columns={columns} data={data} />
          
          {/* Summary Stats */}
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Visits" value={data.length} />
            <StatCard label="Unique IPs" value={new Set(data.map(v => v.ip)).size} />
            <StatCard label="Countries" value={new Set(data.map(v => v.country).filter(Boolean)).size} />
            <StatCard label="Avg. per Day" value={Math.ceil(data.length / Math.max(1, dateDiff(startDate, endDate)))} />
          </div>
        </Card>
      )}
      
      {!loading && startDate && endDate && !data.length && !error && (
        <Card>
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No visitors found for this date range</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or selecting a different period</p>
          </div>
        </Card>
      )}
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-2">
    {Icon && <Icon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />}
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900 break-all">{value || 'N/A'}</p>
    </div>
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="p-3 bg-gray-50 rounded-lg text-center">
    <p className="text-2xl font-bold text-gray-800">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

const dateDiff = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  return Math.ceil((e - s) / 86400000) + 1;
};

export default DateRangeFilter;