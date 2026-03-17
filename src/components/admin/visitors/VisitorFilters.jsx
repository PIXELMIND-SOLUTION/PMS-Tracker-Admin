import React, { useState } from 'react';

export const VisitorFilters = ({ onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState({ limit: 50 });

  const handleChange = (key, value) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onFilterChange?.(updated);
  };

  return (
    <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b">
      <select
        value={localFilters.limit}
        onChange={(e) => handleChange('limit', Number(e.target.value))}
        className="px-3 py-1.5 border rounded text-sm"
      >
        <option value={25}>25 / page</option>
        <option value={50}>50 / page</option>
        <option value={100}>100 / page</option>
      </select>
      
      {/* Add more filters as needed: date range, country dropdown, etc. */}
    </div>
  );
};