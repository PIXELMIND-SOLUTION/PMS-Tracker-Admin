import React, { useEffect, useState } from 'react';
import { visitorApi } from '../../../api/visitorApi';
import { Card } from '../../ui/Card';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { ErrorMessage } from '../../ui/ErrorMessage';
import { Monitor, Smartphone, Tablet, Laptop } from 'lucide-react';

const AnalyticsByDevice = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    visitorApi.getAnalyticsByDevice()
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner className="h-64" />;
  if (error) return <ErrorMessage message={error} />;

  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  const deviceIcons = {
    mobile: Smartphone,
    tablet: Tablet,
    desktop: Monitor,
    unknown: Laptop
  };

  const deviceColors = {
    mobile: 'from-purple-500 to-pink-500',
    tablet: 'from-blue-500 to-cyan-500',
    desktop: 'from-green-500 to-emerald-500',
    unknown: 'from-gray-500 to-slate-500'
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Visitors by Device Type</h2>
        <p className="text-gray-500 mt-1">Distribution of traffic across device categories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((item) => {
          const Icon = deviceIcons[item.device] || deviceIcons.unknown;
          const color = deviceColors[item.device] || deviceColors.unknown;
          const percentage = total ? Math.round((item.count / total) * 100) : 0;
          
          return (
            <Card key={item.device} className="text-center hover:shadow-md transition-shadow">
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${color} mb-3`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 capitalize">
                {item.device || 'Unknown'}
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{item.count}</p>
              <p className="text-sm text-gray-500">{percentage}% of total</p>
              
              {/* Mini bar */}
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detailed Table */}
      <Card title="Device Breakdown">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Device</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Visits</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Percentage</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.sort((a, b) => b.count - a.count).map((item) => {
                const percentage = total ? ((item.count / total) * 100).toFixed(1) : 0;
                return (
                  <tr key={item.device} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {React.createElement(deviceIcons[item.device] || deviceIcons.unknown, { 
                          className: 'h-5 w-5 text-gray-400' 
                        })}
                        <span className="font-medium capitalize">{item.device || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{item.count.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden w-24">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{percentage}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-green-600 text-sm font-medium">↑ 12%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsByDevice;