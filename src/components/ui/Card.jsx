import React from 'react';

export const Card = ({ title, subtitle, children, actions, className = '', headerClassName = '', bodyClassName = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
    {(title || actions) && (
      <div className={`px-4 py-3 border-b border-gray-100 flex items-center justify-between ${headerClassName}`}>
        <div>
          {title && <h3 className="text-base font-semibold text-gray-800">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    )}
    <div className={`p-4 ${bodyClassName}`}>{children}</div>
  </div>
);

export default Card;