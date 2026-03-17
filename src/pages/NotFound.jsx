import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <div className="py-8">
          {/* 404 Illustration */}
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-6">
            <span className="text-4xl font-bold text-blue-600">404</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
          <p className="text-gray-500 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="px-4 py-3 bg-gray-50 rounded-b-lg border-t border-gray-100">
          <p className="text-xs text-gray-400">
            If you believe this is an error, please contact your administrator.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;