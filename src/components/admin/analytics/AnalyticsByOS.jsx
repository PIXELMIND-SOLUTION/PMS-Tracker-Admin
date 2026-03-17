// src/components/admin/analytics/AnalyticsByOS.jsx
import React, { useEffect, useState } from 'react';
import { visitorApi } from '../../../api/visitorApi';
import { Card } from '../../ui/Card';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { ErrorMessage } from '../../ui/ErrorMessage';
import { Badge } from '../../ui/Badge';

const AnalyticsByOS = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    visitorApi.getAnalyticsByOS()
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner className="h-64" />;
  if (error) return <ErrorMessage message={error} />;

  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  const osBadges = {
    Windows: 'info',
    'Mac OS': 'purple',
    Linux: 'success',
    Android: 'warning',
    iOS: 'info'
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Visitors by Operating System</h2>
        <p className="text-gray-500 mt-1">OS distribution of your website visitors</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.sort((a, b) => b.count - a.count).map((item) => {
            const percentage = total ? ((item.count / total) * 100).toFixed(1) : 0;
            return (
              <div key={item.os} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">{item.os || 'Unknown'}</h3>
                  <Badge variant={osBadges[item.os] || 'default'}>{percentage}%</Badge>
                </div>
                <p className="text-2xl font-bold text-gray-900">{item.count.toLocaleString()}</p>
                <p className="text-sm text-gray-500">total visits</p>
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsByOS;