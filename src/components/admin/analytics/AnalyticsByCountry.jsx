import React, { useEffect, useState } from 'react';
import { visitorApi } from '../../../api/visitorApi';
import { Card } from '../../ui/Card';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { ErrorMessage } from '../../ui/ErrorMessage';
import { Globe, Users } from 'lucide-react';

const AnalyticsByCountry = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    visitorApi.getAnalyticsByCountry()
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner className="h-64" />;
  if (error) return <ErrorMessage message={error} />;

  const total = data.reduce((sum, item) => sum + item.count, 0);
  const topCountries = data.slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Visitors by Country</h2>
        <p className="text-gray-500 mt-1">Geographic distribution of your website traffic</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Cards */}
        <Card className="lg:col-span-1">
          <div className="space-y-4">
            <StatItem icon={Globe} label="Countries" value={data.length} />
            <StatItem icon={Users} label="Total Visits" value={total.toLocaleString()} />
            <StatItem 
              icon={Users} 
              label="Top Country" 
              value={topCountries[0]?.country || 'N/A'} 
              subValue={`${topCountries[0]?.count || 0} visits`}
            />
          </div>
        </Card>

        {/* Country List */}
        <Card title="Top Countries" className="lg:col-span-2">
          <div className="space-y-3">
            {topCountries.map((item, index) => (
              <div key={item.country} className="flex items-center gap-4">
                <span className="w-6 text-center text-sm font-medium text-gray-400">#{index + 1}</span>
                <span className="w-32 text-sm font-medium truncate">{item.country || 'Unknown'}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${(item.count / total) * 100}%` }}
                  />
                </div>
                <span className="w-16 text-right text-sm font-medium text-gray-700">{item.count}</span>
                <span className="w-12 text-right text-xs text-gray-400">{Math.round((item.count / total) * 100)}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const StatItem = ({ icon: Icon, label, value, subValue }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white rounded-lg shadow-sm">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
      </div>
    </div>
    {subValue && <span className="text-xs text-gray-400">{subValue}</span>}
  </div>
);

export default AnalyticsByCountry;