import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

export const Table = ({ 
  columns, 
  data, 
  loading, 
  error, 
  emptyMessage = 'No data available',
  onRetry,
  className = ''
}) => {
  if (loading && !data?.length) return <LoadingSpinner className="h-32" />;
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;
  if (!data?.length) return (
    <div className="text-center py-12 text-gray-500">
      <p className="text-sm">{emptyMessage}</p>
    </div>
  );

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th 
                key={col.key} 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((row, idx) => (
            <tr key={row._id || idx} className="hover:bg-gray-50/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {col.render ? col.render(row[col.key], row, idx) : row[col.key] || '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};