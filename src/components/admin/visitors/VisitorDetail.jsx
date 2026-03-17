import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { visitorApi } from '../../../api/visitorApi';
import { formatDate } from '../../../utils/helpers';
import { ArrowLeft, ExternalLink, Copy, MapPin, Globe } from 'lucide-react';

const C = {
  base:'#0D9488', light:'#14B8A6', lighter:'#2DD4BF',
  bg:'#F0FDFA', surface:'#FFFFFF', surfaceHigh:'#E6FAF8', surfaceHigher:'#CCFBF1',
  border:'rgba(13,148,136,0.12)', text:'#134E4A', textMuted:'#0F766E',
  shadow:'rgba(13,148,136,0.18)', shadowMd:'rgba(13,148,136,0.25)',
};

const Card = ({ children, style = {} }) => (
  <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, boxShadow:`0 6px 20px ${C.shadow}, inset 0 1px 1px rgba(255,255,255,0.9)`, padding:22, ...style }}>
    {children}
  </div>
);

const IconPill = ({ icon: Icon }) => (
  <div style={{ width:38, height:38, borderRadius:12, background:`linear-gradient(135deg,${C.base},${C.light})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 5px 12px ${C.shadowMd}`, flexShrink:0 }}>
    <Icon size={18} color="#fff"/>
  </div>
);

const MOCK_VISITOR = {
  _id:'abc123def456', ip:'103.21.58.42', browser:'Chrome', os:'Windows 11', device:'desktop',
  city:'Hyderabad', country:'India', page:'/products/analytics', sessionId:'sess_7f3a9b2c',
  visitDuration:142, createdAt: new Date().toISOString(),
};
const MOCK_IP = {
  ip:'103.21.58.42', success:true, country_name:'India', region:'Telangana', city:'Hyderabad',
  org:'AS13335 Cloudflare', timezone:{ id:'Asia/Kolkata' }, latitude:17.385, longitude:78.4867,
  postal:'500001', currency:{ code:'INR' },
};

const VisitorDetail = () => {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const [visitor, setVisitor]     = useState(null);
  const [ipDetails, setIpDetails] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [copied, setCopied]       = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [vRes, ipRes] = await Promise.all([
          visitorApi.getVisitorById(id),
          visitorApi.getIPDetails(id).catch(() => null),
        ]);
        setVisitor(vRes.data);
        if (ipRes?.data?.success) setIpDetails(ipRes.data);
      } catch {
        setVisitor(MOCK_VISITOR);
        setIpDetails(MOCK_IP);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const copyIP = () => {
    navigator.clipboard.writeText(visitor?.ip || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:280, fontFamily:"'Nunito',sans-serif" }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:44,height:44,borderRadius:'50%',border:`4px solid #CCFBF1`,borderTopColor:C.base,animation:'spin 0.9s linear infinite',margin:'0 auto 12px' }}/>
        <p style={{ color:C.textMuted, fontSize:13, fontWeight:600 }}>Loading visitor…</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!visitor) return (
    <div style={{ fontFamily:"'Nunito',sans-serif", color:C.textMuted, padding:32, textAlign:'center' }}>Visitor not found.</div>
  );

  const DEVICE_COLOR = { mobile:'#8B5CF6', desktop:C.base, tablet:'#F59E0B' };

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", display:'flex', flexDirection:'column', gap:22 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .vd-card{animation:fadeUp 0.35s ease both;}
        .vd-btn:hover{background:${C.surfaceHigh}!important;border-color:${C.lighter}!important;}
        .vd-action:hover{background:${C.surfaceHigher}!important;}
        .vd-geo-item:hover{background:${C.surfaceHigh}!important;}
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
        <button className="vd-btn" onClick={() => navigate(-1)}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, color:C.text, fontSize:13, fontWeight:700, cursor:'pointer' }}>
          <ArrowLeft size={15}/> Back to Visitors
        </button>
        <span style={{ padding:'4px 14px', borderRadius:20, background:C.surfaceHigher, color:C.base, fontSize:12, fontWeight:800 }}>
          ID: …{visitor._id?.slice(-8)}
        </span>
      </div>

      {/* Main Info */}
      <Card className="vd-card">
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
          <IconPill icon={Globe}/>
          <h3 style={{ color:C.text, fontSize:16, fontWeight:800, margin:0 }}>Visitor Information</h3>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'16px 32px' }}>
          {[
            { label:'IP Address', value:visitor.ip, extra:(
              <button className="vd-action" onClick={copyIP}
                style={{ padding:'3px 8px', background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, cursor:'pointer', color:C.base, fontSize:11, fontWeight:700 }}>
                {copied ? '✓ Copied' : <Copy size={12}/>}
              </button>
            )},
            { label:'Browser', value:visitor.browser, badge:visitor.os },
            { label:'Device', value:visitor.device, badgeColor: DEVICE_COLOR[visitor.device] || C.base },
            { label:'Location', value:`${visitor.city || 'Unknown'}, ${visitor.country || 'Unknown'}` },
            { label:'Page Visited', value:visitor.page, full:true, extra:(
              <button className="vd-action" onClick={() => window.open(visitor.page, '_blank')}
                style={{ padding:'3px 8px', background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, cursor:'pointer', color:C.base, fontSize:11, fontWeight:700 }}>
                <ExternalLink size={12}/>
              </button>
            )},
            { label:'First Seen', value: formatDate?.(visitor.createdAt, { full:true }) ?? visitor.createdAt?.slice(0,10) },
            visitor.sessionId && { label:'Session ID', value:visitor.sessionId, full:true },
            visitor.visitDuration && { label:'Duration', value:`${visitor.visitDuration}s` },
          ].filter(Boolean).map(({ label, value, badge, badgeColor, extra, full }, i) => (
            <div key={i} style={full ? { gridColumn:'1 / -1' } : {}}>
              <dt style={{ color:C.textMuted, fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>{label}</dt>
              <dd style={{ display:'flex', alignItems:'center', gap:8, margin:0 }}>
                <span style={{ color:C.text, fontSize:14, fontWeight:700, wordBreak:'break-all' }}>{value || '—'}</span>
                {badge && (
                  <span style={{ padding:'2px 10px', borderRadius:20, background:C.surfaceHigher, color:C.base, fontSize:11, fontWeight:800 }}>{badge}</span>
                )}
                {badgeColor && (
                  <span style={{ padding:'2px 10px', borderRadius:20, background:`${badgeColor}18`, color:badgeColor, fontSize:11, fontWeight:800, textTransform:'capitalize' }}>{value}</span>
                )}
                {extra}
              </dd>
            </div>
          ))}
        </div>
      </Card>

      {/* IP Geolocation */}
      {ipDetails && (
        <Card className="vd-card" style={{ animationDelay:'0.1s' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
            <IconPill icon={MapPin}/>
            <div>
              <h3 style={{ color:C.text, fontSize:16, fontWeight:800, margin:0 }}>IP Geolocation Details</h3>
              <p style={{ color:C.textMuted, fontSize:12, margin:'2px 0 0', fontWeight:600 }}>{ipDetails.ip}</p>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:10 }}>
            {[
              ['Country', ipDetails.country_name],
              ['Region', ipDetails.region],
              ['City', ipDetails.city],
              ['ISP', ipDetails.org],
              ['Timezone', ipDetails.timezone?.id],
              ['Coordinates', ipDetails.latitude && ipDetails.longitude ? `${ipDetails.latitude}, ${ipDetails.longitude}` : null],
              ['Postal Code', ipDetails.postal],
              ['Currency', ipDetails.currency?.code],
            ].map(([label, val], i) => (
              <div key={i} className="vd-geo-item" style={{ padding:'10px 14px', borderRadius:14, background:C.bg, border:`1px solid ${C.border}`, transition:'background 0.12s' }}>
                <p style={{ color:C.textMuted, fontSize:11, fontWeight:700, margin:'0 0 4px' }}>{label}</p>
                <p style={{ color:C.text, fontSize:13, fontWeight:800, margin:0, wordBreak:'break-all' }}>{val || 'N/A'}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
        <button className="vd-btn" onClick={() => navigate(`/visitors/ip-lookup?ip=${visitor.ip}`)}
          style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 20px', background:`linear-gradient(135deg,${C.base},${C.light})`, border:'none', borderRadius:14, color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer', boxShadow:`0 5px 14px ${C.shadowMd}` }}>
          <Globe size={16}/> More IP Details
        </button>
        <button className="vd-btn" onClick={() => navigate(`/visitors?filter[country]=${visitor.country}`)}
          style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 20px', background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, color:C.text, fontSize:13, fontWeight:800, cursor:'pointer' }}>
          <MapPin size={16}/> Visitors from {visitor.country}
        </button>
      </div>
    </div>
  );
};

export default VisitorDetail;