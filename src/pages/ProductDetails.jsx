import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>
      
      <h1 className="text-2xl font-bold text-gray-900">Product Details #{id}</h1>
      
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <p className="text-gray-600">Product details for ID: {id}</p>
      </div>
    </div>
  );
};

export default ProductDetails;