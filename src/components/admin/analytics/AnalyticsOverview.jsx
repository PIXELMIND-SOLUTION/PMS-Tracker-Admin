import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { visitorApi } from '../../../api/visitorApi';
import { Card } from '../../ui/Card';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { ErrorMessage } from '../../ui/ErrorMessage';
import { Badge } from '../../ui/Badge';
import { Users, Globe, Monitor, BarChart3, TrendingUp, Clock } from 'lucide-react';

const AnalyticsOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [countryData, setCountryData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [total, unique, countries, devices] = await Promise.all([
          visitorApi.getTotalCount(),
          visitorApi.getUniqueCount(),
          visitorApi.getAnalyticsByCountry(),
          visitorApi.getAnalyticsByDevice()
        ]);
        
        setStats({
          total: total.data.total,
          unique: unique.data.unique
        });
        setCountryData(countries.data.slice(0, 5));
        setDeviceData(devices.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <LoadingSpinner className="h-64" />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Analytics Overview</h2>
        <p className="text-gray-500 mt-1">Key metrics and insights at a glance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          icon={Users} 
          label="Total Visits" 
          value={stats.total?.toLocaleString() || 0}
          trend="+12.5%"
          onClick={() => navigate('/visitors')}
        />
        <MetricCard 
          icon={Users} 
          label="Unique Visitors" 
          value={stats.unique?.toLocaleString() || 0}
          trend="+8.2%"
          variant="purple"
          onClick={() => navigate('/visitors')}
        />
        <MetricCard 
          icon={Globe} 
          label="Countries" 
          value={countryData.length}
          subValue="top destinations"
          onClick={() => navigate('/analytics/country')}
        />
        <MetricCard 
          icon={Monitor} 
          label="Device Types" 
          value={deviceData.length}
          subValue="categories tracked"
          onClick={() => navigate('/analytics/device')}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <Card title="Top Countries" actions={
          <button 
            onClick={() => navigate('/analytics/country')}
            className="text-sm text-blue-600 hover:underline"
          >
            View All →
          </button>
        }>
          <div className="space-y-3">
            {countryData.map((item, idx) => (
              <div key={item.country} className="flex items-center gap-3">
                <span className="w-5 text-xs text-gray-400">#{idx + 1}</span>
                <span className="flex-1 font-medium">{item.country || 'Unknown'}</span>
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.min(item.count / 10, 100)}%` }}
                  />
                </div>
                <span className="w-12 text-right text-sm font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Device Distribution */}
        <Card title="Device Distribution" actions={
          <button 
            onClick={() => navigate('/analytics/device')}
            className="text-sm text-blue-600 hover:underline"
          >
            Details →
          </button>
        }>
          <div className="grid grid-cols-2 gap-4">
            {deviceData.map((item) => (
              <div 
                key={item.device}
                className="p-3 bg-gray-50 rounded-lg text-center cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => navigate('/analytics/device')}
              >
                <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                <p className="text-sm text-gray-500 capitalize">{item.device || 'Unknown'}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickAction 
            icon={BarChart3} 
            label="Traffic Trends" 
            onClick={() => navigate('/analytics/traffic')}
          />
          <QuickAction 
            icon={Globe} 
            label="By Browser" 
            onClick={() => navigate('/analytics/browser')}
          />
          <QuickAction 
            icon={Clock} 
            label="Recent Activity" 
            onClick={() => navigate('/visitors/recent')}
          />
          <QuickAction 
            icon={TrendingUp} 
            label="Top Pages" 
            onClick={() => navigate('/analytics/pages')}
          />
        </div>
      </Card>
    </div>
  );
};

const MetricCard = ({ icon: Icon, label, value, trend, subValue, variant = 'blue', onClick }) => {
  const variants = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600'
  };
  
  return (
    <Card className={`cursor-pointer hover:shadow-md transition-shadow ${onClick ? 'hover:border-blue-300' : ''}`} onClick={onClick}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
          {trend && (
            <Badge variant="success" className="mt-2">{trend}</Badge>
          )}
        </div>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${variants[variant]}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </Card>
  );
};

const QuickAction = ({ icon: Icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
  >
    <Icon className="h-5 w-5 text-gray-500" />
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </button>
);

export default AnalyticsOverview;