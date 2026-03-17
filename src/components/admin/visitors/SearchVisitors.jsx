import React, { useState } from 'react';
import { visitorApi } from '../../../api/visitorApi';
import { Table } from '../../ui/Table';
import { Card } from '../../ui/Card';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { ErrorMessage } from '../../ui/ErrorMessage';
import { Search, Filter, X } from 'lucide-react';

const SearchVisitors = () => {
  const [query, setQuery] = useState('');
  const [field, setField] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const res = await visitorApi.searchVisitors(query, field || undefined);
      setResults(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setField('');
    setResults([]);
    setError(null);
    setHasSearched(false);
  };

  const columns = [
    { key: 'ip', label: 'IP', render: (v) => <code className="text-xs bg-gray-100 px-2 py-1 rounded">{v}</code> },
    { key: 'browser', label: 'Browser' },
    { key: 'os', label: 'OS' },
    { key: 'country', label: 'Country' },
    { key: 'page', label: 'Page', render: (v) => <span className="truncate max-w-xs block">{v}</span> },
    { key: 'createdAt', label: 'Time', render: (v) => new Date(v).toLocaleString() },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Search Visitors</h2>
        <p className="text-gray-500 mt-1">Search across IP, browser, location, pages, and more</p>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            >
              <option value="">All Fields</option>
              <option value="ip">IP Address</option>
              <option value="browser">Browser</option>
              <option value="os">Operating System</option>
              <option value="device">Device Type</option>
              <option value="country">Country</option>
              <option value="city">City</option>
              <option value="page">Page URL</option>
            </select>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter search term..."
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {query && (
                <button 
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
            <button 
              type="submit" 
              disabled={loading || !query.trim()}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <LoadingSpinner size="sm" /> : <Search className="h-4 w-4" />}
              Search
            </button>
          </div>
          
          {(query || field) && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>
                {field ? `Searching in <strong>${field}</strong>` : 'Searching all fields'} for: <strong>{query}</strong>
              </span>
              <button type="button" onClick={clearSearch} className="text-blue-600 hover:underline ml-auto">
                Clear
              </button>
            </div>
          )}
        </form>
      </Card>

      {error && <ErrorMessage message={error} onRetry={handleSearch} />}
      
      {loading && !hasSearched && <LoadingSpinner className="h-32" />}
      
      {!loading && hasSearched && (
        <Card title={`Results (${results.length})`}>
          {results.length > 0 ? (
            <Table columns={columns} data={results} />
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No visitors found matching "{query}"</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search terms or filters</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default SearchVisitors;