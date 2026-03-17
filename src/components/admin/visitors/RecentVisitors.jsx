import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { visitorApi } from '../../../api/visitorApi';
import { Card } from '../../ui/Card';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { ErrorMessage } from '../../ui/ErrorMessage';
import { Badge } from '../../ui/Badge';
import { formatTimeAgo } from '../../../utils/helpers';
import { RefreshCw, Eye, Users } from 'lucide-react';

const RecentVisitors = ({ limit = 15, autoRefresh = true }) => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchRecent = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await visitorApi.getRecentVisitors(limit);
      setVisitors(res.data);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecent();
    
    if (autoRefresh) {
      const interval = setInterval(fetchRecent, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [limit, autoRefresh]);

  if (loading && !visitors.length) return <LoadingSpinner className="h-32" />;
  if (error) return <ErrorMessage message={error} onRetry={fetchRecent} />;

  return (
    <Card 
      title="Recent Visitors" 
      subtitle={lastUpdate ? `Updated ${formatTimeAgo(lastUpdate)}` : 'Live'}
      actions={
        <button 
          onClick={fetchRecent}
          disabled={loading}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`h-4 w-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      }
      className="h-full"
    >
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {visitors.map((visitor) => (
          <div 
            key={visitor._id}
            onClick={() => navigate(`/visitors/${visitor._id}`)}
            className="group flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
          >
            {/* Avatar/Icon */}
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                {visitor.ip?.split('.').pop()}
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <code className="text-xs bg-white px-2 py-0.5 rounded border font-mono truncate">
                    {visitor.ip}
                  </code>
                  <Badge variant={visitor.device === 'mobile' ? 'purple' : 'default'}>
                    {visitor.device}
                  </Badge>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap" title={new Date(visitor.createdAt).toLocaleString()}>
                  {formatTimeAgo(visitor.createdAt)}
                </span>
              </div>
              
              <p className="text-sm text-gray-700 truncate mt-1" title={visitor.page}>
                {visitor.page?.split('/').pop() || '/'}
              </p>
              
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <span>{visitor.browser}</span>
                <span>•</span>
                <span>{visitor.os}</span>
                {visitor.city && (
                  <>
                    <span>•</span>
                    <span>{visitor.city}, {visitor.country}</span>
                  </>
                )}
              </div>
            </div>
            
            {/* View Icon */}
            <Eye className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
          </div>
        ))}
      </div>
      
      {/* View All Link */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <button 
          onClick={() => navigate('/visitors')}
          className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium py-2"
        >
          <Users className="h-4 w-4" />
          View All Visitors
        </button>
      </div>
    </Card>
  );
};

export default RecentVisitors;