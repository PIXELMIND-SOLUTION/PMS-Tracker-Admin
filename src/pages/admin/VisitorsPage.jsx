import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { visitorApi } from '../../api/visitorApi';
import { Table } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Badge } from '../../components/ui/Badge';
import { formatDate, formatTimeAgo } from '../../utils/helpers';
import { ExternalLink, Eye, Search } from 'lucide-react';

const VisitorsPage = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ page: 1, limit: 25 });

  const fetchVisitors = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await visitorApi.getVisitors({ 
        page: params.page || filters.page, 
        limit: params.limit || filters.limit 
      });
      setVisitors(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [filters.page, filters.limit]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters(f => ({ ...f, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const columns = [
    { 
      key: 'ip', 
      label: 'IP Address',
      render: (ip, row) => (
        <div className="flex items-center space-x-2">
          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{ip}</code>
          <button 
            onClick={() => navigate(`/visitors/ip-lookup?ip=${ip}`)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Lookup IP"
          >
            <ExternalLink className="h-3 w-3 text-gray-400" />
          </button>
        </div>
      )
    },
    { 
      key: 'browser', 
      label: 'Browser',
      render: (browser, row) => (
        <span className="flex items-center space-x-1">
          <span>{browser}</span>
          <Badge variant="info">{row.os}</Badge>
        </span>
      )
    },
    { 
      key: 'device', 
      label: 'Device',
      render: (device) => <Badge variant={device === 'mobile' ? 'purple' : 'default'}>{device}</Badge>
    },
    { 
      key: 'location', 
      label: 'Location',
      render: (_, row) => (
        <span className="text-sm">{row.city ? `${row.city}, ` : ''}{row.country || 'Unknown'}</span>
      )
    },
    { 
      key: 'page', 
      label: 'Page',
      render: (page) => (
        <span className="truncate max-w-xs block text-gray-600" title={page}>
          {page?.split('/').pop() || '/'}
        </span>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Visited',
      render: (date) => (
        <div className="text-sm">
          <div>{formatTimeAgo(date)}</div>
          <div className="text-xs text-gray-400">{formatDate(date, { time: false })}</div>
        </div>
      )
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <button 
          onClick={() => navigate(`/visitors/${row._id}`)}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          title="View details"
        >
          <Eye className="h-4 w-4 text-gray-500" />
        </button>
      )
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">All Visitors</h2>
          <p className="text-gray-500 mt-1">
            {pagination.totalItems || 0} total visitors • Page {pagination.currentPage || 1} of {pagination.totalPages || 1}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/visitors/search')}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </button>
          <select
            value={filters.limit}
            onChange={(e) => setFilters(f => ({ ...f, limit: Number(e.target.value), page: 1 }))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <Card className="overflow-hidden">
        <Table 
          columns={columns} 
          data={visitors} 
          loading={loading} 
          error={error} 
          onRetry={() => fetchVisitors()}
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-sm text-gray-600">
              Showing {(pagination.currentPage - 1) * filters.limit + 1} to{' '}
              {Math.min(pagination.currentPage * filters.limit, pagination.totalItems)} of{' '}
              {pagination.totalItems} results
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = pagination.currentPage <= 3 
                    ? i + 1 
                    : pagination.currentPage >= pagination.totalPages - 2 
                      ? pagination.totalPages - 4 + i 
                      : pagination.currentPage - 2 + i;
                  
                  if (pageNum < 1 || pageNum > pagination.totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                        pagination.currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default VisitorsPage;