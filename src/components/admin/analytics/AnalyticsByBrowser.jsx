// src/components/admin/analytics/AnalyticsByBrowser.jsx
import React, { useEffect, useState } from 'react';
import { visitorApi } from '../../../api/visitorApi';
import { Card } from '../../ui/Card';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { ErrorMessage } from '../../ui/ErrorMessage';
import { Globe } from 'lucide-react';

const AnalyticsByBrowser = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    visitorApi.getAnalyticsByBrowser()
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner className="h-64" />;
  if (error) return <ErrorMessage message={error} />;

  const total = data.reduce((sum, item) => sum + item.count, 0);
  const browserIcons = {
    Chrome: '🟢', Firefox: '🦊', Safari: '🧭', Edge: '🔷', Opera: '🔴'
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Visitors by Browser</h2>
        <p className="text-gray-500 mt-1">Browser usage statistics for your audience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart Placeholder */}
        <Card title="Browser Distribution">
          <div className="flex items-center justify-center h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
            <div className="text-center">
              <Globe className="h-16 w-16 text-blue-300 mx-auto mb-3" />
              <p className="text-gray-500">Interactive chart would render here</p>
              <p className="text-sm text-gray-400">Using Chart.js or Recharts</p>
            </div>
          </div>
        </Card>

        {/* List */}
        <Card title="Browser Stats">
          <div className="space-y-4">
            {data.sort((a, b) => b.count - a.count).map((item, index) => {
              const percentage = total ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.browser} className="flex items-center gap-4">
                  <span className="w-6 text-center text-sm font-medium text-gray-400">#{index + 1}</span>
                  <span className="text-xl">{browserIcons[item.browser] || '🌐'}</span>
                  <span className="flex-1 font-medium">{item.browser || 'Unknown'}</span>
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-medium">{item.count}</span>
                  <span className="w-10 text-right text-sm text-gray-400">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsByBrowser;