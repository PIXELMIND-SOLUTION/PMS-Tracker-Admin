import React, { useEffect, useState } from 'react';
import { visitorApi } from '../../../api/visitorApi';
import { Card } from '../../ui/Card';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { ErrorMessage } from '../../ui/ErrorMessage';
import { Badge } from '../../ui/Badge';
import { Clock, TrendingUp, Calendar } from 'lucide-react';

const TrafficAnalytics = ({ type = 'daily', days = 30 }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState(type);

  useEffect(() => {
    const fetch = viewType === 'hourly' 
      ? visitorApi.getHourlyTraffic()
      : visitorApi.getDailyTraffic(days);
      
    fetch.then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [viewType, days]);

  if (loading) return <LoadingSpinner className="h-64" />;
  if (error) return <ErrorMessage message={error} />;
  if (!data.length) return (
    <Card title="Traffic Analytics">
      <p className="text-center text-gray-500 py-8">No traffic data available for this period</p>
    </Card>
  );

  const maxValue = Math.max(...data.map(d => d.count));
  const totalVisits = data.reduce((sum, d) => sum + d.count, 0);
  const avgVisits = Math.round(totalVisits / data.length);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Traffic Analytics</h2>
          <p className="text-gray-500 mt-1">
            {viewType === 'hourly' ? 'Hourly distribution' : `${days}-day traffic trend`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewType('hourly')}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              viewType === 'hourly' 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Hourly
          </button>
          <button
            onClick={() => setViewType('daily')}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              viewType === 'daily' 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Daily
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={TrendingUp} label="Total Visits" value={totalVisits.toLocaleString()} />
        <StatCard icon={Clock} label="Average/Period" value={avgVisits.toLocaleString()} />
        <StatCard icon={Calendar} label="Peak Period" value={getPeakLabel(data, viewType)} />
      </div>

      {/* Chart Area */}
      <Card title={viewType === 'hourly' ? 'Hourly Traffic Distribution' : `Daily Traffic - Last ${days} Days`}>
        <div className="flex items-end gap-1 h-48 pt-4">
          {data.map((item, idx) => {
            const height = maxValue ? (item.count / maxValue) * 100 : 0;
            const label = viewType === 'hourly' 
              ? `${String(item.hour).padStart(2, '0')}:00` 
              : new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            
            return (
              <div key={idx} className="flex-1 flex flex-col items-center group relative">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t hover:from-blue-600 hover:to-purple-600 transition-colors cursor-pointer"
                  style={{ height: `${Math.max(height, 2)}%` }}
                  title={`${item.count} visits`}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none transition-opacity">
                    {item.count} visits
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 mt-2 truncate w-full text-center hidden sm:block">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* X-axis labels for mobile */}
        <div className="flex justify-between mt-2 sm:hidden">
          <span className="text-[10px] text-gray-400">{getFirstLabel(data, viewType)}</span>
          <span className="text-[10px] text-gray-400">{getLastLabel(data, viewType)}</span>
        </div>
      </Card>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value }) => (
  <Card className="text-center">
    <Icon className="h-5 w-5 text-blue-600 mx-auto mb-2" />
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </Card>
);

const getPeakLabel = (data, type) => {
  if (!data.length) return 'N/A';
  const peak = data.reduce((max, item) => item.count > max.count ? item : max);
  return type === 'hourly' ? `${String(peak.hour).padStart(2, '0')}:00` : peak.date;
};

const getFirstLabel = (data, type) => {
  if (!data.length) return '';
  const item = data[0];
  return type === 'hourly' ? `${String(item.hour).padStart(2, '0')}:00` : new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const getLastLabel = (data, type) => {
  if (!data.length) return '';
  const item = data[data.length - 1];
  return type === 'hourly' ? `${String(item.hour).padStart(2, '0')}:00` : new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export default TrafficAnalytics;