import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { visitorApi } from '../../../api/visitorApi';
import { Table } from '../../ui/Table';
import { Card } from '../../ui/Card';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { ErrorMessage } from '../../ui/ErrorMessage';
import { Badge } from '../../ui/Badge';
import { ExternalLink, Eye } from 'lucide-react';

const TopPages = ({ limit = 20 }) => {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    visitorApi.getTopPages(limit)
      .then(res => setPages(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [limit]);

  if (loading) return <LoadingSpinner className="h-64" />;
  if (error) return <ErrorMessage message={error} />;

  const totalVisits = pages.reduce((sum, p) => sum + p.visits, 0);

  const columns = [
    { 
      key: 'page', 
      label: 'Page URL',
      render: (page) => (
        <div className="flex items-center gap-2 min-w-0">
          <span className="truncate max-w-md text-gray-700" title={page}>
            {page || '/'}
          </span>
          {page && (
            <a 
              href={page} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3 w-3 text-gray-400" />
            </a>
          )}
        </div>
      )
    },
    { 
      key: 'visits', 
      label: 'Total Visits',
      render: (visits) => (
        <div>
          <span className="font-semibold">{visits.toLocaleString()}</span>
          <span className="text-xs text-gray-400 ml-1">
            ({totalVisits ? Math.round((visits/totalVisits)*100) : 0}%)
          </span>
        </div>
      )
    },
    { 
      key: 'uniqueVisitors', 
      label: 'Unique Visitors',
      render: (unique) => <Badge variant="info">{unique.toLocaleString()}</Badge>
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <button 
          onClick={() => navigate(`/visitors?filter[page]=${encodeURIComponent(row.page)}`)}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          title="View visitors for this page"
        >
          <Eye className="h-4 w-4 text-gray-500" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Top Pages</h2>
        <p className="text-gray-500 mt-1">Most visited pages on your website</p>
      </div>

      <Card 
        title={`Top ${pages.length} Pages`} 
        subtitle={`${totalVisits.toLocaleString()} total visits`}
      >
        <Table 
          columns={columns} 
          data={pages} 
          emptyMessage="No page data available yet"
        />
      </Card>

      {/* Insights */}
      {pages.length > 0 && (
        <Card title="Quick Insights">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InsightItem 
              label="Most Popular Page" 
              value={pages[0]?.page?.split('/').pop() || '/'}
              subValue={`${pages[0]?.visits?.toLocaleString()} visits`}
            />
            <InsightItem 
              label="Avg. Visits/Page" 
              value={Math.round(totalVisits / pages.length).toLocaleString()}
            />
            <InsightItem 
              label="Top 3 Share" 
              value={`${pages.slice(0,3).reduce((s,p)=>s+p.visits,0) / totalVisits * 100 | 0}%`}
              subValue="of all traffic"
            />
          </div>
        </Card>
      )}
    </div>
  );
};

const InsightItem = ({ label, value, subValue }) => (
  <div className="p-3 bg-gray-50 rounded-lg">
    <p className="text-xs text-gray-500 uppercase">{label}</p>
    <p className="text-lg font-semibold text-gray-900 mt-1">{value}</p>
    {subValue && <p className="text-xs text-gray-400">{subValue}</p>}
  </div>
);

export default TopPages;