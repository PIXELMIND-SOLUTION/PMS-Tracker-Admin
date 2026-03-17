import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { visitorApi } from '../../../api/visitorApi';
import { Card } from '../../ui/Card';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { ErrorMessage } from '../../ui/ErrorMessage';
import { Badge } from '../../ui/Badge';
import { Search, MapPin, Globe, Server, Clock, Copy, ExternalLink } from 'lucide-react';

const IPDetailsLookup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ip, setIp] = useState(new URLSearchParams(location.search).get('ip') || '');
  const [details, setDetails] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const lookupIP = async (searchIp = ip) => {
    if (!searchIp.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const [ipRes, visitorsRes] = await Promise.all([
        visitorApi.getIPDetails(searchIp.trim()),
        visitorApi.getVisitorsByIP(searchIp.trim())
      ]);
      
      if (ipRes.data?.success) {
        setDetails(ipRes.data);
        setVisitors(visitorsRes.data || []);
      } else {
        setError('Invalid or private IP address');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Lookup failed');
      setDetails(null);
      setVisitors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    lookupIP();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">IP Geolocation Lookup</h2>
        <p className="text-gray-500 mt-1">Get detailed location and network information for any IP</p>
      </div>

      {/* Search Form */}
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="Enter IP address (e.g., 8.8.8.8)"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            type="submit"
            disabled={loading || !ip.trim()}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <LoadingSpinner size="sm" /> : <Search className="h-4 w-4" />}
            Lookup
          </button>
        </form>
      </Card>

      {error && <ErrorMessage message={error} onRetry={() => lookupIP()} />}

      {details && !loading && (
        <>
          {/* IP Info Card */}
          <Card title="IP Information" subtitle={details.ip}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoItem icon={MapPin} label="Country" value={details.country_name} />
              <InfoItem icon={MapPin} label="Region" value={details.region} />
              <InfoItem icon={MapPin} label="City" value={details.city} />
              <InfoItem icon={Server} label="ISP" value={details.org || details.connection?.org || 'N/A'} />
              <InfoItem label="Timezone" value={details.timezone?.id} />
              <InfoItem label="Coordinates" value={details.latitude && details.longitude ? `${details.latitude}, ${details.longitude}` : 'N/A'} />
              <InfoItem label="Postal Code" value={details.postal} />
              <InfoItem label="Currency" value={details.currency?.code} />
            </div>
            
            {/* Map Placeholder */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Location Map</span>
                {details.latitude && details.longitude && (
                  <a 
                    href={`https://www.google.com/maps?q=${details.latitude},${details.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open in Maps
                  </a>
                )}
              </div>
              <div className="mt-2 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm">
                  {details.latitude && details.longitude 
                    ? `📍 ${details.latitude}, ${details.longitude}` 
                    : 'Map data not available'}
                </span>
              </div>
            </div>
          </Card>

          {/* Visitors from this IP */}
          <Card title={`Visitors from ${details.ip}`} subtitle={`${visitors.length} visits found`}>
            {visitors.length > 0 ? (
              <div className="space-y-3">
                {visitors.slice(0, 10).map((visitor) => (
                  <div 
                    key={visitor._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/visitors/${visitor._id}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="info">{visitor.browser}</Badge>
                        <span className="text-sm text-gray-600 truncate">{visitor.page}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {visitor.city}, {visitor.country} • {new Date(visitor.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
                {visitors.length > 10 && (
                  <button 
                    onClick={() => navigate(`/visitors?filter[ip]=${details.ip}`)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View all {visitors.length} visits →
                  </button>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No visitor records found for this IP</p>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-2">
    {Icon && <Icon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />}
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900 break-all">{value || 'N/A'}</p>
    </div>
  </div>
);

export default IPDetailsLookup;