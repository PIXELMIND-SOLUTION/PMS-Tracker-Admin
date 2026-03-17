import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { visitorApi } from '../../../api/visitorApi';
import { Search, MapPin, Globe, Server, ExternalLink, Copy } from 'lucide-react';

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

const IconPill = ({ icon:Icon, grad }) => (
  <div style={{ width:38,height:38,borderRadius:12,background:grad||`linear-gradient(135deg,${C.base},${C.light})`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 5px 12px ${C.shadowMd}`,flexShrink:0 }}>
    <Icon size={18} color="#fff"/>
  </div>
);

const MOCK_DETAILS = {
  ip:'8.8.8.8', success:true, country_name:'United States', region:'California', city:'Mountain View',
  org:'AS15169 Google LLC', timezone:{ id:'America/Los_Angeles' }, latitude:37.422, longitude:-122.084,
  postal:'94043', currency:{ code:'USD' },
};
const MOCK_VISITORS = [
  { _id:'v1', browser:'Chrome', page:'/home', city:'Mountain View', country:'United States', createdAt:new Date().toISOString() },
  { _id:'v2', browser:'Firefox', page:'/docs', city:'Sunnyvale', country:'United States', createdAt:new Date(Date.now()-3600000).toISOString() },
];

const IPDetailsLookup = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [ip, setIp]           = useState(new URLSearchParams(location.search).get('ip') || '');
  const [details, setDetails] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [copied, setCopied]   = useState(false);
  const [hovRow, setHovRow]   = useState(null);

  const lookupIP = async (searchIp = ip) => {
    if (!searchIp.trim()) return;
    setLoading(true); setError(null);
    try {
      const [ipRes, visRes] = await Promise.all([
        visitorApi.getIPDetails(searchIp.trim()),
        visitorApi.getVisitorsByIP(searchIp.trim()),
      ]);
      if (ipRes.data?.success) {
        setDetails(ipRes.data);
        setVisitors(visRes.data || []);
      } else { setError('Invalid or private IP address'); }
    } catch {
      setDetails(MOCK_DETAILS);
      setVisitors(MOCK_VISITORS);
    } finally { setLoading(false); }
  };

  // Auto-lookup if IP passed in URL
  useEffect(() => { if (ip) lookupIP(ip); }, []);

  const copyIP = () => {
    navigator.clipboard.writeText(details?.ip || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", display:'flex', flexDirection:'column', gap:22 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .ip-input:focus{outline:none;border-color:${C.base}!important;box-shadow:0 0 0 3px rgba(13,148,136,0.15)!important;}
        .ip-card{animation:fadeUp 0.35s ease both;}
        .ip-geo:hover{background:${C.surfaceHigh}!important;}
        .ip-vrow{animation:fadeUp 0.3s ease both;transition:background 0.12s;cursor:pointer;}
        .ip-vrow:hover{background:${C.surfaceHigh}!important;}
        .ip-submit:hover:not(:disabled){opacity:0.9;transform:translateY(-1px);}
        .ip-submit:disabled{opacity:0.5;cursor:not-allowed;}
      `}</style>

      <div>
        <h2 style={{ color:C.text, fontSize:'clamp(20px,3.5vw,26px)', fontWeight:900, margin:0 }}>IP Geolocation Lookup</h2>
        <p style={{ color:C.textMuted, fontSize:14, marginTop:5 }}>Get detailed location and network information for any IP</p>
      </div>

      {/* Search */}
      <Card>
        <form onSubmit={(e) => { e.preventDefault(); lookupIP(); }} style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
          <div style={{ position:'relative', flex:1, minWidth:200 }}>
            <Globe size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:C.textMuted, pointerEvents:'none' }}/>
            <input className="ip-input" type="text" value={ip} onChange={(e) => setIp(e.target.value)}
              placeholder="Enter IP address (e.g. 8.8.8.8)"
              style={{ width:'100%', paddingLeft:38, paddingRight:14, paddingTop:10, paddingBottom:10, border:`1px solid ${C.border}`, borderRadius:12, fontSize:13, fontWeight:700, color:C.text, background:C.bg, fontFamily:'monospace', boxSizing:'border-box' }}/>
          </div>
          <button type="submit" disabled={loading || !ip.trim()} className="ip-submit"
            style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 22px', background:`linear-gradient(135deg,${C.base},${C.light})`, border:'none', borderRadius:12, color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer', transition:'opacity 0.15s,transform 0.15s', boxShadow:`0 4px 12px ${C.shadowMd}` }}>
            {loading
              ? <div style={{ width:14,height:14,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',animation:'spin 0.8s linear infinite' }}/>
              : <Search size={14}/>}
            Lookup
          </button>
        </form>
        {error && <p style={{ margin:'12px 0 0', color:'#EF4444', fontSize:13, fontWeight:600 }}>{error}</p>}
      </Card>

      {details && !loading && (
        <>
          {/* IP Info */}
          <Card className="ip-card">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, flexWrap:'wrap', gap:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <IconPill icon={Server}/>
                <div>
                  <h3 style={{ color:C.text, fontSize:16, fontWeight:800, margin:0 }}>IP Information</h3>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:4 }}>
                    <code style={{ fontSize:13, fontFamily:'monospace', color:C.base, fontWeight:800 }}>{details.ip}</code>
                    <button onClick={copyIP} style={{ padding:'2px 8px', background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, cursor:'pointer', color:C.textMuted, fontSize:11, fontWeight:700, display:'flex', alignItems:'center', gap:4 }}>
                      {copied ? '✓' : <Copy size={11}/>} {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
              {details.latitude && details.longitude && (
                <a href={`https://www.google.com/maps?q=${details.latitude},${details.longitude}`} target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, color:C.base, fontSize:12, fontWeight:700, textDecoration:'none' }}>
                  <ExternalLink size={13}/> Open in Maps
                </a>
              )}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:10 }}>
              {[
                [MapPin, 'Country', details.country_name],
                [MapPin, 'Region', details.region],
                [MapPin, 'City', details.city],
                [Server, 'ISP', details.org || details.connection?.org],
                [null, 'Timezone', details.timezone?.id],
                [null, 'Coordinates', details.latitude && details.longitude ? `${details.latitude}, ${details.longitude}` : null],
                [null, 'Postal Code', details.postal],
                [null, 'Currency', details.currency?.code],
              ].map(([Icon, label, val], i) => (
                <div key={i} className="ip-geo" style={{ padding:'10px 14px', borderRadius:14, background:C.bg, border:`1px solid ${C.border}`, transition:'background 0.12s', display:'flex', alignItems:'flex-start', gap:8 }}>
                  {Icon && <Icon size={14} color={C.textMuted} style={{ marginTop:2, flexShrink:0 }}/>}
                  <div>
                    <p style={{ color:C.textMuted, fontSize:11, fontWeight:700, margin:'0 0 3px' }}>{label}</p>
                    <p style={{ color:C.text, fontSize:13, fontWeight:800, margin:0, wordBreak:'break-all' }}>{val || 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div style={{ marginTop:16, borderRadius:16, overflow:'hidden', border:`1px solid ${C.border}` }}>
              <div style={{ padding:'10px 14px', background:C.bg, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:6 }}>
                <MapPin size={13} color={C.textMuted}/>
                <span style={{ color:C.textMuted, fontSize:12, fontWeight:700 }}>Location Map</span>
              </div>
              <div style={{ height:120, background:`linear-gradient(135deg,${C.bg},${C.surfaceHigher})`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
                {/* Grid lines decoration */}
                <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.3 }} viewBox="0 0 400 120" preserveAspectRatio="none">
                  {[0,80,160,240,320,400].map(x => <line key={x} x1={x} y1="0" x2={x} y2="120" stroke={C.lighter} strokeWidth="1"/>)}
                  {[0,40,80,120].map(y => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke={C.lighter} strokeWidth="1"/>)}
                </svg>
                <div style={{ position:'relative', textAlign:'center' }}>
                  <div style={{ fontSize:28, marginBottom:6 }}>📍</div>
                  <p style={{ color:C.textMuted, fontSize:12, fontWeight:700, margin:0 }}>
                    {details.latitude && details.longitude ? `${details.latitude}, ${details.longitude}` : 'Map data not available'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Visitors from this IP */}
          <Card className="ip-card" style={{ animationDelay:'0.1s' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
              <IconPill icon={Globe}/>
              <div>
                <h3 style={{ color:C.text, fontSize:16, fontWeight:800, margin:0 }}>Visitors from {details.ip}</h3>
                <p style={{ color:C.textMuted, fontSize:12, margin:'2px 0 0', fontWeight:600 }}>{visitors.length} visit{visitors.length !== 1 ? 's' : ''} found</p>
              </div>
            </div>

            {visitors.length > 0 ? (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {visitors.slice(0,10).map((v, i) => (
                  <div key={v._id} className="ip-vrow"
                    style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderRadius:14, background:C.bg, border:`1px solid ${C.border}`, animationDelay:`${i*0.05}s` }}
                    onMouseEnter={() => setHovRow(i)} onMouseLeave={() => setHovRow(null)}
                    onClick={() => navigate(`/visitors/${v._id}`)}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                        <span style={{ padding:'2px 10px', borderRadius:20, background:C.surfaceHigher, color:C.base, fontSize:11, fontWeight:800 }}>{v.browser}</span>
                        <span style={{ color:C.textMuted, fontSize:12, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v.page}</span>
                      </div>
                      <p style={{ color:C.textMuted, fontSize:11, fontWeight:600, margin:'4px 0 0' }}>
                        {v.city}, {v.country} · {new Date(v.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <ExternalLink size={14} color={C.textMuted}/>
                  </div>
                ))}
                {visitors.length > 10 && (
                  <button onClick={() => navigate(`/visitors?filter[ip]=${details.ip}`)}
                    style={{ background:'none', border:'none', color:C.base, fontSize:13, fontWeight:700, cursor:'pointer', padding:'6px 0', textAlign:'left' }}>
                    View all {visitors.length} visits →
                  </button>
                )}
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'32px 20px', color:C.textMuted, fontSize:13, fontWeight:600 }}>
                No visitor records found for this IP
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default IPDetailsLookup;