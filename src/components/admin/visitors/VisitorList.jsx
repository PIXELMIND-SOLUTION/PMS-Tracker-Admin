import React, { useEffect, useState } from 'react';
import { visitorApi } from '../../api/visitorApi';
import { Table } from '../ui/Table';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import { VisitorFilters } from './VisitorFilters';
import { formatDate, formatTimeAgo } from '../../utils/helpers';

export const VisitorList = () => {
  const [visitors, setVisitors] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ page: 1, limit: 50 });

  const fetchVisitors = async (params = {}) => {
    setLoading(true);
    try {
      const res = await visitorApi.getVisitors(params.page, params.limit);
      setVisitors(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors(filters);
  }, [filters.page, filters.limit]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const columns = [
    { key: 'ip', label: 'IP Address' },
    { key: 'browser', label: 'Browser' },
    { key: 'os', label: 'OS' },
    { key: 'device', label: 'Device' },
    { key: 'country', label: 'Location', render: (val, row) => `${row.city || ''}, ${val}`.trim() },
    { key: 'page', label: 'Page', render: (val) => <span className="truncate max-w-xs block" title={val}>{val}</span> },
    { key: 'createdAt', label: 'Visited', render: (val) => (
      <span title={formatDate(val)}>{formatTimeAgo(val)}</span>
    )},
  ];

  return (
    <Card title="All Visitors" className="col-span-full">
      <VisitorFilters onFilterChange={handleFilterChange} />
      
      {error && <ErrorMessage message={error} onRetry={() => fetchVisitors(filters)} />}
      {loading && !visitors.length ? <LoadingSpinner /> : (
        <>
          <Table columns={columns} data={visitors} loading={loading} />
          
          {pagination.totalPages > 1 && (
            <div className="px-4 py-3 flex items-center justify-between border-t">
              <span className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} total)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
};