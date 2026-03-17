import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { visitorApi } from '../../../api/visitorApi';
import { Card } from '../../ui/Card';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { ErrorMessage } from '../../ui/ErrorMessage';
import { Badge } from '../../ui/Badge';
import { formatDate } from '../../../utils/helpers';
import { ArrowLeft, ExternalLink, Copy, MapPin, Monitor, Globe } from 'lucide-react';

const VisitorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ipDetails, setIpDetails] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [visitorRes, ipRes] = await Promise.all([
          visitorApi.getVisitorById(id),
          visitorApi.getIPDetails(id).catch(() => null)
        ]);
        setVisitor(visitorRes.data);
        if (ipRes?.data?.success) setIpDetails(ipRes.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  if (loading) return <LoadingSpinner className="h-64" />;
  if (error) return <ErrorMessage message={error} onRetry={() => navigate(0)} />;
  if (!visitor) return <ErrorMessage message="Visitor not found" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Visitors
        </button>
        <Badge variant="info">ID: {visitor._id?.slice(-8)}</Badge>
      </div>

      {/* Main Info */}
      <Card title="Visitor Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <DetailRow 
              label="IP Address" 
              value={visitor.ip} 
              action={{ icon: Copy, onClick: () => copyToClipboard(visitor.ip), label: 'Copy' }}
            />
            <DetailRow label="Browser" value={visitor.browser} badge={visitor.os} />
            <DetailRow label="Device" value={visitor.device} badgeVariant="purple" />
            <DetailRow 
              label="Location" 
              value={`${visitor.city || 'Unknown'}, ${visitor.country || 'Unknown'}`}
              icon={MapPin}
            />
          </div>
          <div className="space-y-4">
            <DetailRow 
              label="Page Visited" 
              value={visitor.page} 
              full 
              action={{ icon: ExternalLink, onClick: () => window.open(visitor.page, '_blank'), label: 'Open' }}
            />
            <DetailRow label="First Seen" value={formatDate(visitor.createdAt, { full: true })} />
            {visitor.sessionId && <DetailRow label="Session ID" value={visitor.sessionId} full />}
            {visitor.visitDuration && <DetailRow label="Duration" value={`${visitor.visitDuration}s`} badge="time" />}
          </div>
        </div>
      </Card>

      {/* IP Geolocation */}
      {ipDetails && (
        <Card title="IP Geolocation Details" subtitle={ipDetails.ip}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <DetailItem label="Country" value={ipDetails.country_name} />
            <DetailItem label="Region" value={ipDetails.region} />
            <DetailItem label="City" value={ipDetails.city} />
            <DetailItem label="ISP" value={ipDetails.org || 'N/A'} />
            <DetailItem label="Timezone" value={ipDetails.timezone?.id} />
            <DetailItem label="Coordinates" value={ipDetails.latitude && ipDetails.longitude ? `${ipDetails.latitude}, ${ipDetails.longitude}` : 'N/A'} />
            <DetailItem label="Postal Code" value={ipDetails.postal} />
            <DetailItem label="Currency" value={ipDetails.currency?.code} />
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => navigate(`/visitors/ip-lookup?ip=${visitor.ip}`)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Globe className="h-4 w-4 mr-2" />
          More IP Details
        </button>
        <button 
          onClick={() => navigate(`/visitors?filter[country]=${visitor.country}`)}
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <MapPin className="h-4 w-4 mr-2" />
          Visitors from {visitor.country}
        </button>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, badge, badgeVariant = 'default', icon: Icon, action, full = false }) => (
  <div className={full ? 'md:col-span-2' : ''}>
    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</dt>
    <dd className="mt-1 flex items-center gap-2">
      {Icon && <Icon className="h-4 w-4 text-gray-400" />}
      <span className="text-gray-900 break-all">{value || '—'}</span>
      {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
      {action && (
        <button 
          onClick={action.onClick}
          className="p-1 hover:bg-gray-100 rounded"
          title={action.label}
        >
          <action.icon className="h-4 w-4 text-gray-400" />
        </button>
      )}
    </dd>
  </div>
);

const DetailItem = ({ label, value }) => (
  <div>
    <span className="text-gray-500">{label}:</span>
    <span className="ml-2 font-medium text-gray-900">{value || 'N/A'}</span>
  </div>
);

export default VisitorDetail;