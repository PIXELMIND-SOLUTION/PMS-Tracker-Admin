import React from 'react';
import { useLocation } from 'react-router-dom';

const Products = () => {
  const location = useLocation();
  
  // Get the current subpage from the URL
  const getCurrentView = () => {
    const path = location.pathname;
    if (path.includes('/products/all')) return 'All Products';
    if (path.includes('/products/categories')) return 'Categories';
    if (path.includes('/products/add')) return 'Add New Product';
    if (path.includes('/products/inventory')) return 'Inventory';
    return 'Products';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{getCurrentView()}</h1>
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <p className="text-gray-600">Products content goes here...</p>
      </div>
    </div>
  );
};

export default Products;