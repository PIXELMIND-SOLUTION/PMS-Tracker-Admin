import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Users, Activity, ArrowUp, ArrowDown, MoreVertical,
  Globe, Monitor, Smartphone, Tablet, Chrome, Download,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  RefreshCw, Filter, Search, X, Calendar, PieChart,
  BarChart3, MapPin, Eye, Info, ExternalLink, Copy, Check,
  AlertCircle, Wifi, Server, Map, Flag, Clock3, Globe2,
  Compass, Gauge, Users2, MousePointer, Clock as TimeIcon, Waves
} from 'lucide-react';

import {
  AreaChart, Area, BarChart, Bar, LineChart,
  PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

/* ─── Design tokens ─── */
const C = {
  base:'#0D9488', light:'#14B8A6', lighter:'#2DD4BF', lightest:'#CCFBF1',
  bg:'#F0FDFA', surface:'#FFFFFF', surfaceHigh:'#E6FAF8', surfaceHigher:'#CCFBF1',
  border:'rgba(13,148,136,0.12)', text:'#134E4A', textMuted:'#0F766E', textSub:'#5EEAD4',
  shadow:'rgba(13,148,136,0.18)', shadowMd:'rgba(13,148,136,0.25)', shadowLg:'rgba(13,148,136,0.35)',
  chart:['#14B8A6','#0D9488','#2DD4BF','#0F766E','#5EEAD4','#115E59','#99F6E4','#134E4A'],
  tealGrad:'linear-gradient(135deg,#0D9488,#14B8A6)',
  tealGradDark:'linear-gradient(135deg,#0F766E,#0D9488)',
};

/* ─── Card primitive ─── */
const Card = ({ children, style = {} }) => (
  <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, boxShadow:`0 6px 20px ${C.shadow}, inset 0 1px 1px rgba(255,255,255,0.9)`, ...style }}>
    {children}
  </div>
);

const IconPill = ({ icon:Icon, size=18, grad=C.tealGrad }) => (
  <div style={{ width:42,height:42,borderRadius:13,background:grad,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 5px 12px ${C.shadowMd}`,flexShrink:0 }}>
    <Icon size={size} color="#fff"/>
  </div>
);

/* ─── Mock data generators ─── */
const genWeekly   = () => ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => ({ name:d, visitors:Math.floor(Math.random()*1000)+500, pageViews:Math.floor(Math.random()*2000)+1000, unique:Math.floor(Math.random()*800)+400 }));
const genMonthly  = () => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => ({ name:m, value:Math.floor(Math.random()*5000)+2000 }));
const genTraffic  = () => [{ name:'Direct',value:45 },{ name:'Social',value:30 },{ name:'Email',value:15 },{ name:'Referral',value:10 }];
const genEngagement = () => [
  { subject:'Bounce Rate',A:42,fullMark:100 },
  { subject:'Session Dur.',A:185,fullMark:300 },
  { subject:'Pages/Session',A:3.2,fullMark:10 },
  { subject:'Return Rate',A:28,fullMark:100 },
  { subject:'Conversion',A:3.24,fullMark:10 },
];

const MOCK_OVERVIEW = { totalVisitors:142830, uniqueVisitors:98410, todayVisitors:1247, yesterdayVisitors:1089, weeklyVisitors:8432, monthlyVisitors:32410, dailyGrowth:14.5, weeklyGrowth:8.2, averageDaily:1120, activeNow:47, bounceRate:42.5, avgSessionDuration:185, pagesPerSession:3.2 };
const MOCK_DEVICES  = [{ device:'Desktop',count:6200 },{ device:'Mobile',count:4100 },{ device:'Tablet',count:1120 }];
const MOCK_PAGES    = ['/home','/products','/about','/pricing','/blog'].map((p,i) => ({ _id:`p${i}`, page:p, visits:1400-i*220, uniqueVisitors:900-i*140 }));
const MOCK_VISITORS = Array.from({length:8},(_,i)=>({ id:`v${i}`, ip:`192.168.${i}.${i*3+1}`, browser:['Chrome','Safari','Firefox','Edge'][i%4], os:['Windows','macOS','iOS','Android'][i%4], device:['desktop','mobile','tablet'][i%3], city:['Mumbai','Delhi','Hyderabad','Pune'][i%4], country:'India', page:['/home','/about','/products','/contact'][i%4], timeAgo:`${i+1}m ago` }));
const MOCK_IP = { ip:'103.21.58.42', type:'IPv4', city:'Hyderabad', region:'Telangana', country:'India', continent:'Asia', continent_code:'AS', capital:'New Delhi', flag:{ emoji:'🇮🇳', img:'' }, timezone:{ id:'Asia/Kolkata', utc:'+05:30' }, connection:{ asn:'AS13335', org:'Cloudflare', isp:'Cloudflare Inc.', domain:'cloudflare.com' }, latitude:17.385, longitude:78.4867, postal:'500001', is_eu:false, calling_code:'91', borders:'CHN,PAK,BGD,NPL,MMR,BTN' };

/* ─── Custom recharts tooltip ─── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:'10px 14px', boxShadow:`0 8px 20px ${C.shadow}` }}>
      <p style={{ color:C.text, fontSize:12, fontWeight:700, marginBottom:6 }}>{label}</p>
      {payload.map((e,i) => (
        <p key={i} style={{ color:C.textMuted, fontSize:11, fontWeight:600, margin:'2px 0' }}>{e.name}: {e.value?.toLocaleString()}</p>
      ))}
    </div>
  );
};

/* ════════════════════════════════════════════════ */
const DashboardContent = () => {
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [timeRange,    setTimeRange]    = useState('last7days');
  const [refreshing,   setRefreshing]   = useState(false);
  const [showFilters,  setShowFilters]  = useState(false);
  const [searchTerm,   setSearchTerm]   = useState('');
  const [selectedIp,   setSelectedIp]   = useState(null);
  const [showModal,    setShowModal]    = useState(false);
  const [ipDetails,    setIpDetails]    = useState(null);
  const [loadingIp,    setLoadingIp]    = useState(false);
  const [copied,       setCopied]       = useState(false);
  const [activeTab,    setActiveTab]    = useState('overview');
  const [currentPage,  setCurrentPage]  = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems,   setTotalItems]   = useState(0);
  const [hovStat,      setHovStat]      = useState(null);
  const [hovRow,       setHovRow]       = useState(null);
  const [filters,      setFilters]      = useState({ country:'', device:'', browser:'', dateFrom:'', dateTo:'' });
  const [exporting,    setExporting]    = useState(false);
  const [dashData,     setDashData]     = useState({
    overview: MOCK_OVERVIEW,
    charts: { countries:[], devices:MOCK_DEVICES, browsers:[], os:[], hourly:[], weekly:genWeekly(), monthly:genMonthly(), traffic:genTraffic(), engagement:genEngagement() },
    topPages: MOCK_PAGES, recentVisitors: MOCK_VISITORS,
  });

  useEffect(() => {
    fetchAll();
    const iv = setInterval(fetchRealtime, 30000);
    return () => clearInterval(iv);
  }, [timeRange, currentPage, itemsPerPage, filters]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page:currentPage, limit:itemsPerPage, timeRange, ...filters, search:searchTerm });
      const res = await fetch(`http://localhost:5000/api/dashboard/summary?${qs}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setDashData({ ...data, charts:{ ...data.charts, weekly:genWeekly(), monthly:genMonthly(), traffic:genTraffic(), engagement:genEngagement() }});
      setTotalItems(data.pagination?.total || data.recentVisitors?.length || 0);
    } catch {
      setDashData(d => ({ ...d, charts:{ ...d.charts, weekly:genWeekly(), monthly:genMonthly(), traffic:genTraffic(), engagement:genEngagement() }}));
      setTotalItems(MOCK_VISITORS.length);
    } finally { setLoading(false); }
  };

  const fetchRealtime = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/dashboard/realtime');
      if (!res.ok) return;
      const data = await res.json();
      setDashData(p => ({ ...p, overview:{ ...p.overview, activeNow:data.stats.activeNow }}));
    } catch {}
  };

  const fetchIpDetails = async (ip) => {
    setLoadingIp(true);
    try {
      const res = await fetch(`http://localhost:5000/api/ip-details/${ip}`);
      if (!res.ok) throw new Error('Failed');
      setIpDetails(await res.json());
    } catch { setIpDetails(MOCK_IP); }
    finally { setLoadingIp(false); }
  };

  const handleViewDetails = (ip) => { setSelectedIp(ip); setShowModal(true); fetchIpDetails(ip); setActiveTab('overview'); };
  const handleRefresh = async () => { setRefreshing(true); await fetchAll(); setRefreshing(false); };
  const copyIP = () => { navigator.clipboard.writeText(ipDetails?.ip||''); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  const exportCSV = (type) => {
    setExporting(true);
    const rows = type==='visitors' ? dashData.recentVisitors : type==='pages' ? dashData.topPages : [];
    if (rows.length) {
      const h = Object.keys(rows[0]);
      const csv = [h.join(','), ...rows.map(r=>h.map(k=>JSON.stringify(r[k]??'')).join(','))].join('\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
      a.download = `${type}.csv`; a.click();
    }
    setExporting(false);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const goToPage = (p) => setCurrentPage(Math.max(1, Math.min(p, totalPages)));
  const getPaginationRange = () => {
    const delta=2, range=[], res=[];
    for(let i=1;i<=totalPages;i++) if(i===1||i===totalPages||(i>=currentPage-delta&&i<=currentPage+delta)) range.push(i);
    let l;
    range.forEach(i => {
      if(l) { if(i-l===2) res.push(l+1); else if(i-l!==1) res.push('...'); }
      res.push(i); l=i;
    });
    return res;
  };

  const { overview } = dashData;
  const DEVICE_COLOR = { desktop:C.base, mobile:'#8B5CF6', tablet:'#F59E0B' };

  const STATS = [
    { title:'Total Visitors',   value:overview.totalVisitors?.toLocaleString()||'0', change:`+${overview.dailyGrowth||0}%`,   trend:overview.dailyGrowth>=0?'up':'down', icon:Users,        grad:C.tealGrad,     sub:'All time visitors',    sec:`${overview.uniqueVisitors?.toLocaleString()||0} unique` },
    { title:'Active Now',       value:overview.activeNow?.toString()||'0',           change:`${overview.weeklyGrowth||0}%`,   trend:overview.weeklyGrowth>=0?'up':'down',icon:Activity,     grad:'linear-gradient(135deg,#14B8A6,#2DD4BF)', sub:'Last 5 minutes',      sec:`${overview.bounceRate||0}% bounce rate` },
    { title:"Today's Visitors", value:overview.todayVisitors?.toLocaleString()||'0', change:`${overview.dailyGrowth>=0?'+':''}${overview.dailyGrowth||0}%`, trend:overview.dailyGrowth>=0?'up':'down', icon:TrendingUp, grad:C.tealGradDark, sub:'vs yesterday', sec:`${Math.floor(overview.avgSessionDuration/60)}m ${overview.avgSessionDuration%60}s avg session` },
    { title:'Engagement',       value:overview.pagesPerSession?.toFixed(1)||'3.2',   change:'+12%',                           trend:'up',                                icon:MousePointer, grad:'linear-gradient(135deg,#0D9488,#06B6D4)', sub:'Pages per session',   sec:`${overview.weeklyVisitors?.toLocaleString()||0} this week` },
  ];

  /* ── Loading state ── */
  if (loading && !dashData.recentVisitors.length) return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Nunito',sans-serif" }}>
      <div style={{ background:C.surface, borderRadius:24, padding:'56px 64px', boxShadow:`0 24px 48px ${C.shadowLg}`, border:`1px solid ${C.border}`, textAlign:'center' }}>
        <div style={{ position:'relative', width:80,height:80,margin:'0 auto 20px' }}>
          <div style={{ width:80,height:80,borderRadius:'50%',border:`6px solid ${C.surfaceHigher}`,borderTopColor:C.base,animation:'spin 0.9s linear infinite' }}/>
          <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center' }}>
            <Waves size={28} color={C.base} style={{ animation:'pulse 1.5s ease infinite' }}/>
          </div>
        </div>
        <p style={{ color:C.text, fontSize:20, fontWeight:800, margin:'0 0 6px' }}>Loading Dashboard</p>
        <p style={{ color:C.textMuted, fontSize:14, fontWeight:600, margin:0 }}>Fetching your analytics…</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );

  /* ── Error state ── */
  if (error) return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Nunito',sans-serif" }}>
      <div style={{ background:C.surface, borderRadius:24, padding:'56px 64px', boxShadow:`0 24px 48px ${C.shadowLg}`, border:`1px solid ${C.border}`, textAlign:'center', maxWidth:400 }}>
        <div style={{ width:80,height:80,borderRadius:'50%',background:C.surfaceHigher,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px' }}>
          <AlertCircle size={36} color={C.base}/>
        </div>
        <p style={{ color:C.text, fontSize:20, fontWeight:800, margin:'0 0 8px' }}>Error Loading Dashboard</p>
        <p style={{ color:C.textMuted, fontSize:13, fontWeight:600, margin:'0 0 24px' }}>{error}</p>
        <button onClick={fetchAll} style={{ padding:'10px 28px', background:C.tealGrad, border:'none', borderRadius:14, color:'#fff', fontSize:14, fontWeight:800, cursor:'pointer', boxShadow:`0 5px 14px ${C.shadowMd}` }}>Try Again</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:C.bg, padding:'28px 24px', fontFamily:"'Nunito',sans-serif" }}>

      {/* ── Global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&display=swap');
        @keyframes spin    { to { transform: rotate(360deg) } }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes scaleIn { from{transform:scale(0.95);opacity:0} to{transform:scale(1);opacity:1} }
        .dc-stat   { animation:fadeUp 0.35s ease both; transition:transform 0.15s,box-shadow 0.15s; cursor:default; }
        .dc-stat:hover { transform:translateY(-3px); }
        .dc-row    { animation:fadeUp 0.3s ease both; transition:background 0.12s; }
        .dc-row:hover { background:${C.surfaceHigh}!important; }
        .dc-btn:hover { background:${C.surfaceHigh}!important; border-color:${C.lighter}!important; }
        .dc-input:focus { outline:none; border-color:${C.base}!important; box-shadow:0 0 0 3px rgba(13,148,136,0.15)!important; }
        .dc-tab:hover { color:${C.base}!important; }
        .dc-modal  { animation:scaleIn 0.2s ease; }
        .dc-page-active { background:${C.tealGrad}!important; color:#fff!important; border-color:transparent!important; }
        .dc-page-btn:hover { background:${C.surfaceHigh}!important; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-thumb { background:${C.lighter}; border-radius:10px; }
      `}</style>

      {/* ── IP Details Modal ── */}
      {showModal && (
        <div style={{ position:'fixed',inset:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',padding:16 }}>
          <div style={{ position:'absolute',inset:0,background:'rgba(19,78,74,0.35)',backdropFilter:'blur(4px)' }} onClick={()=>setShowModal(false)}/>
          <div className="dc-modal" style={{ position:'relative',background:C.surface,borderRadius:24,border:`2px solid ${C.border}`,boxShadow:`0 32px 64px ${C.shadowLg}`,width:'100%',maxWidth:800,maxHeight:'90vh',overflow:'hidden',display:'flex',flexDirection:'column' }}>

            {/* Modal header */}
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 28px',borderBottom:`1px solid ${C.border}`,background:C.bg,flexShrink:0 }}>
              <div style={{ display:'flex',alignItems:'center',gap:14 }}>
                <IconPill icon={Globe}/>
                <div>
                  <h2 style={{ color:C.text,fontSize:20,fontWeight:900,margin:0 }}>IP Address Details</h2>
                  <p style={{ color:C.textMuted,fontSize:13,fontWeight:600,margin:'2px 0 0' }}>Info for {selectedIp}</p>
                </div>
              </div>
              <button onClick={()=>setShowModal(false)} className="dc-btn"
                style={{ width:36,height:36,borderRadius:11,background:'none',border:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:C.textMuted }}>
                <X size={16}/>
              </button>
            </div>

            {/* Loading */}
            {loadingIp && (
              <div style={{ padding:64,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flex:1 }}>
                <div style={{ position:'relative',width:60,height:60 }}>
                  <div style={{ width:60,height:60,borderRadius:'50%',border:`5px solid ${C.surfaceHigher}`,borderTopColor:C.base,animation:'spin 0.9s linear infinite' }}/>
                  <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center' }}>
                    <Waves size={22} color={C.base} style={{ animation:'pulse 1.5s ease infinite' }}/>
                  </div>
                </div>
                <p style={{ color:C.textMuted,fontSize:14,fontWeight:700,marginTop:16 }}>Fetching IP details…</p>
              </div>
            )}

            {/* Content */}
            {!loadingIp && ipDetails && !ipDetails.error && (
              <div style={{ display:'flex',flexDirection:'column',flex:1,overflow:'hidden' }}>
                {/* Tabs */}
                <div style={{ display:'flex',gap:0,padding:'0 28px',borderBottom:`1px solid ${C.border}`,flexShrink:0 }}>
                  {['overview','network','location'].map(tab => (
                    <button key={tab} className="dc-tab" onClick={()=>setActiveTab(tab)}
                      style={{ padding:'14px 18px',background:'none',border:'none',borderBottom:`2px solid ${activeTab===tab?C.base:'transparent'}`,color:activeTab===tab?C.base:C.textMuted,fontSize:13,fontWeight:800,cursor:'pointer',textTransform:'capitalize',transition:'color 0.15s,border-color 0.15s' }}>
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab body */}
                <div style={{ overflowY:'auto',padding:'24px 28px',flex:1,display:'flex',flexDirection:'column',gap:14 }}>

                  {/* Overview */}
                  {activeTab==='overview' && (
                    <>
                      <div style={{ background:C.bg,borderRadius:16,padding:'16px 20px',border:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12 }}>
                        <div style={{ display:'flex',alignItems:'center',gap:14 }}>
                          <IconPill icon={Server}/>
                          <div>
                            <p style={{ color:C.textMuted,fontSize:11,fontWeight:700,margin:0 }}>IP Address</p>
                            <div style={{ display:'flex',alignItems:'center',gap:10,marginTop:4 }}>
                              <code style={{ color:C.text,fontSize:18,fontWeight:900,fontFamily:'monospace' }}>{ipDetails.ip}</code>
                              <button onClick={copyIP} style={{ padding:'3px 10px',background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,cursor:'pointer',color:C.base,fontSize:11,fontWeight:700,display:'flex',alignItems:'center',gap:4 }}>
                                {copied?<><Check size={11}/> Copied</>:<><Copy size={11}/> Copy</>}
                              </button>
                            </div>
                          </div>
                        </div>
                        <span style={{ padding:'4px 14px',borderRadius:20,background:C.tealGrad,color:'#fff',fontSize:12,fontWeight:800 }}>{ipDetails.type||'IPv4'}</span>
                      </div>
                      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:10 }}>
                        {[
                          { icon:MapPin,  label:'Location',     val:`${ipDetails.city}, ${ipDetails.region}`, sub:ipDetails.country },
                          { icon:Globe2,  label:'Continent',    val:ipDetails.continent, sub:ipDetails.continent_code },
                          { icon:Flag,    label:'Country Info', val:ipDetails.country, sub:`Capital: ${ipDetails.capital}`, flag:ipDetails.flag?.emoji },
                          { icon:Clock3,  label:'Timezone',     val:ipDetails.timezone?.id, sub:`UTC ${ipDetails.timezone?.utc}` },
                        ].map((item,i) => (
                          <div key={i} style={{ background:C.bg,borderRadius:14,padding:'14px 16px',border:`1px solid ${C.border}` }}>
                            <div style={{ display:'flex',alignItems:'flex-start',gap:10 }}>
                              <div style={{ width:34,height:34,borderRadius:10,background:C.surfaceHigher,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                                <item.icon size={15} color={C.base}/>
                              </div>
                              <div>
                                <p style={{ color:C.textMuted,fontSize:11,fontWeight:700,margin:'0 0 4px' }}>{item.label}</p>
                                <div style={{ display:'flex',alignItems:'center',gap:6 }}>
                                  {item.flag&&<span style={{ fontSize:20 }}>{item.flag}</span>}
                                  <p style={{ color:C.text,fontSize:13,fontWeight:800,margin:0 }}>{item.val}</p>
                                </div>
                                <p style={{ color:C.textMuted,fontSize:12,fontWeight:600,margin:'2px 0 0' }}>{item.sub}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Network */}
                  {activeTab==='network' && (
                    <>
                      <div style={{ background:C.bg,borderRadius:16,padding:'16px 20px',border:`1px solid ${C.border}` }}>
                        <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:14 }}>
                          <Wifi size={16} color={C.base}/><h3 style={{ color:C.text,fontSize:14,fontWeight:800,margin:0 }}>Connection Details</h3>
                        </div>
                        {[['ASN',ipDetails.connection?.asn],['Organization',ipDetails.connection?.org],['ISP',ipDetails.connection?.isp],['Domain',ipDetails.connection?.domain]].map(([l,v],i)=>(
                          <div key={i} style={{ display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:`1px solid ${C.border}` }}>
                            <span style={{ color:C.textMuted,fontSize:13,fontWeight:700 }}>{l}</span>
                            <span style={{ color:C.text,fontSize:13,fontWeight:800,fontFamily:'monospace' }}>{v||'N/A'}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ background:C.bg,borderRadius:16,padding:'16px 20px',border:`1px solid ${C.border}` }}>
                        <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:14 }}>
                          <Info size={16} color={C.base}/><h3 style={{ color:C.text,fontSize:14,fontWeight:800,margin:0 }}>Additional Info</h3>
                        </div>
                        {[[`+${ipDetails.calling_code||'N/A'}`,'Calling Code'],[ipDetails.postal||'N/A','Postal Code'],[ipDetails.is_eu?'Yes':'No','European Union']].map(([v,l],i)=>(
                          <div key={i} style={{ display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:`1px solid ${C.border}` }}>
                            <span style={{ color:C.textMuted,fontSize:13,fontWeight:700 }}>{l}</span>
                            <span style={{ color:C.text,fontSize:13,fontWeight:800 }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Location */}
                  {activeTab==='location' && (
                    <>
                      <div style={{ background:C.bg,borderRadius:16,padding:'16px 20px',border:`1px solid ${C.border}` }}>
                        <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:14 }}>
                          <Compass size={16} color={C.base}/><h3 style={{ color:C.text,fontSize:14,fontWeight:800,margin:0 }}>Geographic Coordinates</h3>
                        </div>
                        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
                          {[['Latitude',ipDetails.latitude],['Longitude',ipDetails.longitude]].map(([l,v])=>(
                            <div key={l} style={{ background:C.surfaceHigher,borderRadius:12,padding:'12px 16px' }}>
                              <p style={{ color:C.textMuted,fontSize:11,fontWeight:700,margin:'0 0 4px' }}>{l}</p>
                              <p style={{ color:C.text,fontSize:16,fontWeight:900,fontFamily:'monospace',margin:0 }}>{v}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ background:C.bg,borderRadius:16,padding:'16px 20px',border:`1px solid ${C.border}` }}>
                        <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:14 }}>
                          <Map size={16} color={C.base}/><h3 style={{ color:C.text,fontSize:14,fontWeight:800,margin:0 }}>Location Hierarchy</h3>
                        </div>
                        {[[Compass,'Continent',ipDetails.continent],[Flag,'Country',ipDetails.country],[MapPin,'Region',ipDetails.region],[Map,'City',ipDetails.city]].map(([Icon,l,v],i)=>(
                          <div key={i} style={{ display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:`1px solid ${C.border}` }}>
                            <div style={{ width:30,height:30,borderRadius:9,background:C.surfaceHigher,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                              <Icon size={13} color={C.base}/>
                            </div>
                            <div>
                              <p style={{ color:C.textMuted,fontSize:11,fontWeight:700,margin:0 }}>{l}</p>
                              <p style={{ color:C.text,fontSize:13,fontWeight:800,margin:'1px 0 0' }}>{v}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {ipDetails.borders && (
                        <div style={{ background:C.bg,borderRadius:16,padding:'16px 20px',border:`1px solid ${C.border}` }}>
                          <p style={{ color:C.text,fontSize:13,fontWeight:800,margin:'0 0 10px' }}>Bordering Countries</p>
                          <div style={{ display:'flex',flexWrap:'wrap',gap:8 }}>
                            {ipDetails.borders.split(',').map(b=>(
                              <span key={b} style={{ padding:'4px 12px',background:C.surfaceHigher,borderRadius:10,fontSize:12,fontWeight:700,color:C.base }}>{b.trim()}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Modal footer */}
            <div style={{ display:'flex',justifyContent:'flex-end',gap:10,padding:'14px 28px',borderTop:`1px solid ${C.border}`,background:C.bg,flexShrink:0 }}>
              <button onClick={()=>setShowModal(false)} className="dc-btn"
                style={{ padding:'8px 20px',background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,color:C.text,fontSize:13,fontWeight:700,cursor:'pointer' }}>Close</button>
              {ipDetails&&!ipDetails.error&&(
                <a href={`https://whatismyipaddress.com/ip/${selectedIp}`} target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex',alignItems:'center',gap:6,padding:'8px 20px',background:C.tealGrad,borderRadius:12,color:'#fff',fontSize:13,fontWeight:800,textDecoration:'none' }}>
                  <ExternalLink size={14}/> View on WhatIsMyIP
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Page content ── */}
      <div style={{ maxWidth:1280,margin:'0 auto',display:'flex',flexDirection:'column',gap:28 }}>

        {/* Header */}
        <div style={{ display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:14 }}>
          <div>
            <h1 style={{ color:C.text,fontSize:'clamp(26px,4vw,38px)',fontWeight:900,margin:0,letterSpacing:'-0.5px' }}>Dashboard Overview</h1>
            <p style={{ color:C.textMuted,fontSize:14,fontWeight:600,marginTop:5 }}>Real-time analytics and visitor insights</p>
          </div>
          <div style={{ display:'flex',flexWrap:'wrap',gap:10,alignItems:'center' }}>
            <button onClick={handleRefresh} disabled={refreshing} className="dc-btn"
              style={{ display:'flex',alignItems:'center',gap:7,padding:'9px 18px',background:C.surface,border:`1px solid ${C.border}`,borderRadius:13,color:C.text,fontSize:13,fontWeight:700,cursor:'pointer',opacity:refreshing?0.6:1 }}>
              <RefreshCw size={15} color={C.textMuted} style={{ animation:refreshing?'spin 0.8s linear infinite':'none' }}/> {refreshing?'Refreshing…':'Refresh'}
            </button>
            <div style={{ position:'relative' }}>
              <button style={{ display:'flex',alignItems:'center',gap:7,padding:'9px 18px',background:C.tealGrad,border:'none',borderRadius:13,color:'#fff',fontSize:13,fontWeight:800,cursor:'pointer',boxShadow:`0 4px 12px ${C.shadowMd}` }}
                onMouseEnter={e=>e.currentTarget.nextSibling.style.display='block'}
                onMouseLeave={e=>{ const m=e.currentTarget.nextSibling; setTimeout(()=>m.style.display='none',200); }}>
                <Download size={14}/> Export
              </button>
              <div style={{ display:'none',position:'absolute',right:0,top:'calc(100% + 6px)',background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,boxShadow:`0 12px 24px ${C.shadow}`,zIndex:40,minWidth:160,overflow:'hidden' }}
                onMouseEnter={e=>e.currentTarget.style.display='block'} onMouseLeave={e=>e.currentTarget.style.display='none'}>
                {['visitors','pages','analytics'].map(t=>(
                  <button key={t} onClick={()=>exportCSV(t)}
                    style={{ display:'block',width:'100%',textAlign:'left',padding:'10px 16px',background:'none',border:'none',color:C.text,fontSize:13,fontWeight:700,cursor:'pointer',textTransform:'capitalize' }}
                    onMouseEnter={e=>e.currentTarget.style.background=C.surfaceHigh} onMouseLeave={e=>e.currentTarget.style.background='none'}>
                    Export {t}
                  </button>
                ))}
              </div>
            </div>
            <select value={timeRange} onChange={e=>{setTimeRange(e.target.value);setCurrentPage(1);}} className="dc-input"
              style={{ padding:'9px 14px',background:C.surface,border:`1px solid ${C.border}`,borderRadius:13,color:C.text,fontSize:13,fontWeight:700,cursor:'pointer' }}>
              {[['today','Today'],['yesterday','Yesterday'],['last7days','Last 7 days'],['last30days','Last 30 days'],['last90days','Last 90 days'],['thisyear','This year']].map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:16 }}>
          {STATS.map((s,i)=>{
            const Icon=s.icon;
            return (
              <div key={i} className="dc-stat"
                style={{ background:C.surface,borderRadius:20,border:`1px solid ${hovStat===i?C.lighter:C.border}`,boxShadow:hovStat===i?`0 14px 32px ${C.shadowMd},inset 0 1px 1px rgba(255,255,255,0.9)`:`0 6px 20px ${C.shadow},inset 0 1px 1px rgba(255,255,255,0.9)`,padding:22,position:'relative',overflow:'hidden',animationDelay:`${i*0.07}s` }}
                onMouseEnter={()=>setHovStat(i)} onMouseLeave={()=>setHovStat(null)}>
                {/* BG decoration */}
                <div style={{ position:'absolute',top:-30,right:-30,width:110,height:110,borderRadius:'50%',background:C.surfaceHigher,opacity:0.5 }}/>
                <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',position:'relative' }}>
                  <div>
                    <p style={{ color:C.textMuted,fontSize:12,fontWeight:700,margin:0 }}>{s.title}</p>
                    <p style={{ color:C.text,fontSize:'clamp(24px,4vw,32px)',fontWeight:900,margin:'6px 0 2px' }}>{s.value}</p>
                    <p style={{ color:C.textMuted,fontSize:11,fontWeight:600,margin:'0 0 8px' }}>{s.sub}</p>
                    <span style={{ display:'inline-block',padding:'3px 10px',borderRadius:20,background:C.surfaceHigher,color:C.base,fontSize:11,fontWeight:800 }}>{s.sec}</span>
                  </div>
                  <div style={{ width:46,height:46,borderRadius:14,background:s.grad,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 6px 14px ${C.shadowMd}`,flexShrink:0 }}>
                    <Icon size={20} color="#fff"/>
                  </div>
                </div>
                <div style={{ marginTop:16,display:'flex',alignItems:'center',gap:6 }}>
                  <span style={{ display:'flex',alignItems:'center',gap:4,fontSize:13,fontWeight:800,color:s.trend==='up'?C.base:'#F59E0B' }}>
                    {s.trend==='up'?<ArrowUp size={14}/>:<ArrowDown size={14}/>} {s.change}
                  </span>
                  <span style={{ color:C.textMuted,fontSize:12,fontWeight:600 }}>vs last period</span>
                </div>
                {/* Hover bar */}
                <div style={{ position:'absolute',bottom:0,left:0,height:3,width:'100%',background:C.tealGrad,transform:hovStat===i?'scaleX(1)':'scaleX(0)',transformOrigin:'left',transition:'transform 0.2s ease',borderRadius:'0 0 20px 20px' }}/>
              </div>
            );
          })}
        </div>

        {/* ── Charts row ── */}
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:16 }}>

          {/* Weekly Traffic */}
          <Card style={{ padding:22 }}>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20 }}>
              <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                <IconPill icon={TrendingUp}/>
                <h2 style={{ color:C.text,fontSize:16,fontWeight:800,margin:0 }}>Weekly Traffic</h2>
              </div>
              <MoreVertical size={16} color={C.textMuted} style={{ cursor:'pointer' }}/>
            </div>
            <div style={{ height:280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashData.charts.weekly}>
                  <defs>
                    <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.light} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={C.light} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                  <XAxis dataKey="name" tick={{ fill:C.textMuted, fontSize:11, fontWeight:700 }} stroke={C.border}/>
                  <YAxis tick={{ fill:C.textMuted, fontSize:11 }} stroke={C.border}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Legend wrapperStyle={{ fontSize:12,fontWeight:700,color:C.textMuted }}/>
                  <Area type="monotone" dataKey="visitors" stroke={C.light} strokeWidth={3} fill="url(#gV)" name="Visitors"/>
                  <Area type="monotone" dataKey="pageViews" stroke={C.base} strokeWidth={2} fill="url(#gV)" name="Page Views"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Device Distribution */}
          <Card style={{ padding:22 }}>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20 }}>
              <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                <IconPill icon={PieChart}/>
                <h2 style={{ color:C.text,fontSize:16,fontWeight:800,margin:0 }}>Device Distribution</h2>
              </div>
              <MoreVertical size={16} color={C.textMuted} style={{ cursor:'pointer' }}/>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,alignItems:'center' }}>
              <div style={{ height:200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={dashData.charts.devices} cx="50%" cy="50%" innerRadius={54} outerRadius={76} paddingAngle={4} dataKey="count">
                      {dashData.charts.devices.map((_,i)=><Cell key={i} fill={C.chart[i%C.chart.length]}/>)}
                    </Pie>
                    <Tooltip content={<CustomTooltip/>}/>
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
                {dashData.charts.devices.map((d,i)=>{
                  const total=dashData.charts.devices.reduce((a,x)=>a+x.count,0)||1;
                  const pct=((d.count/total)*100).toFixed(1);
                  const DevI=d.device==='mobile'?Smartphone:d.device==='tablet'?Tablet:Monitor;
                  return (
                    <div key={i}>
                      <div style={{ display:'flex',justifyContent:'space-between',marginBottom:5 }}>
                        <span style={{ display:'flex',alignItems:'center',gap:6,color:C.text,fontSize:12,fontWeight:700 }}>
                          <DevI size={13} color={C.chart[i%C.chart.length]}/> {d.device||'Unknown'}
                        </span>
                        <span style={{ color:C.text,fontSize:12,fontWeight:800 }}>{pct}%</span>
                      </div>
                      <div style={{ height:7,borderRadius:7,background:C.surfaceHigher,overflow:'hidden' }}>
                        <div style={{ height:'100%',borderRadius:7,width:`${pct}%`,background:`linear-gradient(90deg,${C.chart[i%C.chart.length]},${C.chart[(i+1)%C.chart.length]})`,transition:'width 0.8s ease' }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Traffic Sources */}
          <Card style={{ padding:22 }}>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20 }}>
              <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                <IconPill icon={BarChart3}/>
                <h2 style={{ color:C.text,fontSize:16,fontWeight:800,margin:0 }}>Traffic Sources</h2>
              </div>
              <MoreVertical size={16} color={C.textMuted} style={{ cursor:'pointer' }}/>
            </div>
            <div style={{ height:200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashData.charts.traffic}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                  <XAxis dataKey="name" tick={{ fill:C.textMuted, fontSize:11, fontWeight:700 }} stroke={C.border}/>
                  <YAxis tick={{ fill:C.textMuted, fontSize:11 }} stroke={C.border}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Bar dataKey="value" radius={[6,6,0,0]}>
                    {dashData.charts.traffic.map((_,i)=><Cell key={i} fill={C.chart[i%C.chart.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Engagement Radar */}
          <Card style={{ padding:22 }}>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20 }}>
              <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                <IconPill icon={Gauge}/>
                <h2 style={{ color:C.text,fontSize:16,fontWeight:800,margin:0 }}>Engagement Metrics</h2>
              </div>
              <MoreVertical size={16} color={C.textMuted} style={{ cursor:'pointer' }}/>
            </div>
            <div style={{ height:200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={dashData.charts.engagement}>
                  <PolarGrid stroke={C.border}/>
                  <PolarAngleAxis dataKey="subject" tick={{ fill:C.textMuted, fontSize:10, fontWeight:700 }}/>
                  <PolarRadiusAxis stroke={C.border}/>
                  <Radar name="Metrics" dataKey="A" stroke={C.light} strokeWidth={3} fill={C.light} fillOpacity={0.25}/>
                  <Tooltip content={<CustomTooltip/>}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* ── Top Pages ── */}
        <Card style={{ padding:22 }}>
          <div style={{ display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:18 }}>
            <div style={{ display:'flex',alignItems:'center',gap:12 }}>
              <IconPill icon={Eye}/>
              <h2 style={{ color:C.text,fontSize:16,fontWeight:800,margin:0 }}>Top Pages</h2>
            </div>
            <div style={{ display:'flex',gap:8 }}>
              <div style={{ position:'relative' }}>
                <Search size={14} style={{ position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:C.textMuted,pointerEvents:'none' }}/>
                <input type="text" placeholder="Search pages…" value={searchTerm} onChange={e=>{setSearchTerm(e.target.value);setCurrentPage(1);}} className="dc-input"
                  style={{ paddingLeft:34,paddingRight:12,paddingTop:9,paddingBottom:9,border:`1px solid ${C.border}`,borderRadius:12,fontSize:13,fontWeight:600,color:C.text,background:C.bg,width:200 }}/>
              </div>
              <button onClick={()=>setShowFilters(f=>!f)}
                style={{ padding:'9px 12px',background:showFilters?C.tealGrad:C.bg,border:`1px solid ${showFilters?'transparent':C.border}`,borderRadius:12,cursor:'pointer',display:'flex',alignItems:'center',color:showFilters?'#fff':C.textMuted }}>
                <Filter size={15}/>
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div style={{ marginBottom:18,padding:'16px 18px',background:C.bg,borderRadius:16,border:`1px solid ${C.border}` }}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12 }}>
                <span style={{ color:C.text,fontSize:13,fontWeight:800 }}>Filters</span>
                <button onClick={()=>setFilters({country:'',device:'',browser:'',dateFrom:'',dateTo:''})} style={{ background:'none',border:'none',color:C.base,fontSize:12,fontWeight:700,cursor:'pointer' }}>Clear all</button>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:10 }}>
                {[
                  { key:'device', opts:[['','All Devices'],['desktop','Desktop'],['mobile','Mobile'],['tablet','Tablet']] },
                  { key:'browser', opts:[['','All Browsers'],['chrome','Chrome'],['firefox','Firefox'],['safari','Safari'],['edge','Edge']] },
                ].map(({key,opts})=>(
                  <select key={key} value={filters[key]} onChange={e=>setFilters({...filters,[key]:e.target.value})} className="dc-input"
                    style={{ padding:'9px 12px',border:`1px solid ${C.border}`,borderRadius:12,fontSize:13,fontWeight:700,color:C.text,background:C.surface }}>
                    {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                  </select>
                ))}
                {['dateFrom','dateTo'].map(k=>(
                  <input key={k} type="date" value={filters[k]} onChange={e=>setFilters({...filters,[k]:e.target.value})} className="dc-input"
                    style={{ padding:'9px 12px',border:`1px solid ${C.border}`,borderRadius:12,fontSize:13,fontWeight:700,color:C.text,background:C.surface }}/>
                ))}
              </div>
            </div>
          )}

          <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
            {dashData.topPages.map((page,i)=>{
              const max=dashData.topPages[0]?.visits||1;
              const pct=(page.visits/max)*100;
              return (
                <div key={i} className="dc-row" style={{ padding:'12px 14px',borderRadius:14,border:`1px solid transparent`,animationDelay:`${i*0.05}s` }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=C.border} onMouseLeave={e=>e.currentTarget.style.borderColor='transparent'}>
                  <div style={{ display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:8,marginBottom:8 }}>
                    <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                      <span style={{ color:C.text,fontSize:13,fontWeight:800 }}>{page.page||'/'}</span>
                      <span style={{ padding:'2px 9px',background:C.surfaceHigher,borderRadius:20,color:C.textMuted,fontSize:10,fontWeight:700 }}>ID: {page._id?.substring(0,8)}…</span>
                    </div>
                    <div style={{ display:'flex',gap:16 }}>
                      <span style={{ color:C.textMuted,fontSize:12,fontWeight:600 }}><strong style={{ color:C.text,fontWeight:800 }}>{page.visits}</strong> visits</span>
                      <span style={{ color:C.textMuted,fontSize:12,fontWeight:600 }}><strong style={{ color:C.text,fontWeight:800 }}>{page.uniqueVisitors}</strong> unique</span>
                    </div>
                  </div>
                  <div style={{ height:7,borderRadius:7,background:C.surfaceHigher,overflow:'hidden' }}>
                    <div style={{ height:'100%',borderRadius:7,width:`${pct}%`,background:`linear-gradient(90deg,${C.chart[i%C.chart.length]},${C.chart[(i+1)%C.chart.length]})`,transition:'width 0.8s ease' }}/>
                  </div>
                </div>
              );
            })}
            {!dashData.topPages.length && <p style={{ textAlign:'center',color:C.textMuted,fontSize:14,fontWeight:600,padding:'32px 0' }}>No page data available</p>}
          </div>
        </Card>

        {/* ── Recent Visitors Table ── */}
        <Card style={{ padding:0,overflow:'hidden' }}>
          {/* Table header */}
          <div style={{ display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:12,padding:'18px 22px',borderBottom:`1px solid ${C.border}`,background:C.bg }}>
            <div style={{ display:'flex',alignItems:'center',gap:12 }}>
              <IconPill icon={Users2}/>
              <h2 style={{ color:C.text,fontSize:16,fontWeight:800,margin:0 }}>Recent Visitors</h2>
              <span style={{ padding:'3px 12px',background:C.tealGrad,color:'#fff',borderRadius:20,fontSize:12,fontWeight:800 }}>{totalItems} total</span>
            </div>
            <div style={{ display:'flex',alignItems:'center',gap:8 }}>
              <span style={{ color:C.textMuted,fontSize:13,fontWeight:600 }}>Show:</span>
              <select value={itemsPerPage} onChange={e=>{setItemsPerPage(Number(e.target.value));setCurrentPage(1);}} className="dc-input"
                style={{ padding:'7px 12px',border:`1px solid ${C.border}`,borderRadius:11,fontSize:13,fontWeight:700,color:C.text,background:C.surface }}>
                {[5,10,20,50].map(n=><option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%',borderCollapse:'collapse',minWidth:900 }}>
              <thead>
                <tr style={{ background:C.bg,borderBottom:`1px solid ${C.border}` }}>
                  {['IP Address','Location','Device','Browser / OS','Page','Time','Actions'].map(h=>(
                    <th key={h} style={{ padding:'12px 18px',textAlign:'left',color:C.textMuted,fontSize:11,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.05em',whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dashData.recentVisitors.map((v,i)=>{
                  const DevI=v.device==='mobile'?Smartphone:v.device==='tablet'?Tablet:Monitor;
                  return (
                    <tr key={v.id} className="dc-row" style={{ borderBottom:`1px solid ${C.border}`,animationDelay:`${i*0.04}s` }}
                      onMouseEnter={e=>e.currentTarget.style.background=C.surfaceHigh} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'12px 18px' }}>
                        <code style={{ fontSize:12,background:C.bg,border:`1px solid ${C.border}`,padding:'3px 8px',borderRadius:8,fontFamily:'monospace',color:C.text,fontWeight:700 }}>{v.ip}</code>
                      </td>
                      <td style={{ padding:'12px 18px' }}>
                        <div style={{ display:'flex',alignItems:'center',gap:6,color:C.text,fontSize:13,fontWeight:600 }}>
                          <MapPin size={13} color={C.textMuted}/> {v.city?`${v.city}, `:''}{v.country||'Unknown'}
                        </div>
                      </td>
                      <td style={{ padding:'12px 18px' }}>
                        <div style={{ display:'flex',alignItems:'center',gap:7,color:C.text,fontSize:13,fontWeight:700 }}>
                          <DevI size={14} color={DEVICE_COLOR[v.device]||C.base}/>
                          <span style={{ padding:'2px 9px',borderRadius:20,background:`${(DEVICE_COLOR[v.device]||C.base)}18`,color:DEVICE_COLOR[v.device]||C.base,fontSize:11,fontWeight:800,textTransform:'capitalize' }}>{v.device||'Unknown'}</span>
                        </div>
                      </td>
                      <td style={{ padding:'12px 18px' }}>
                        <div style={{ display:'flex',alignItems:'center',gap:6,color:C.text,fontSize:13,fontWeight:600 }}>
                          <Chrome size={13} color={C.textMuted}/> {v.browser||'Unknown'} <span style={{ color:C.textMuted }}>/</span> {v.os||'Unknown'}
                        </div>
                      </td>
                      <td style={{ padding:'12px 18px',maxWidth:130 }}>
                        <span style={{ color:C.textMuted,fontSize:12,fontWeight:600,display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{v.page||'/'}</span>
                      </td>
                      <td style={{ padding:'12px 18px' }}>
                        <div style={{ display:'flex',alignItems:'center',gap:6,color:C.textMuted,fontSize:12,fontWeight:600 }}>
                          <TimeIcon size={13} color={C.textMuted}/> {v.timeAgo||'Just now'}
                        </div>
                      </td>
                      <td style={{ padding:'12px 18px' }}>
                        <button onClick={()=>handleViewDetails(v.ip)}
                          style={{ display:'flex',alignItems:'center',gap:6,padding:'7px 14px',background:C.tealGrad,border:'none',borderRadius:11,color:'#fff',fontSize:12,fontWeight:800,cursor:'pointer',boxShadow:`0 3px 8px ${C.shadowMd}` }}>
                          <Info size={13}/> Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!dashData.recentVisitors.length && (
              <div style={{ textAlign:'center',padding:'56px 20px' }}>
                <div style={{ width:64,height:64,borderRadius:'50%',background:C.surfaceHigher,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px' }}>
                  <Users size={28} color={C.base}/>
                </div>
                <p style={{ color:C.textMuted,fontSize:14,fontWeight:700 }}>No visitor data available</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {dashData.recentVisitors.length > 0 && (
            <div style={{ display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:12,padding:'14px 22px',borderTop:`1px solid ${C.border}`,background:C.bg }}>
              <span style={{ color:C.textMuted,fontSize:13,fontWeight:600 }}>
                Showing {(currentPage-1)*itemsPerPage+1}–{Math.min(currentPage*itemsPerPage,totalItems)} of {totalItems}
              </span>
              <div style={{ display:'flex',alignItems:'center',gap:6 }}>
                {[
                  [ChevronsLeft, ()=>goToPage(1),           currentPage===1,        'First'],
                  [ChevronLeft,  ()=>goToPage(currentPage-1),currentPage===1,        'Prev'],
                ].map(([Icon,fn,dis,title],i)=>(
                  <button key={i} onClick={fn} disabled={dis} title={title} className="dc-btn"
                    style={{ width:34,height:34,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',background:C.surface,border:`1px solid ${C.border}`,color:C.text,cursor:dis?'not-allowed':'pointer',opacity:dis?0.4:1 }}>
                    <Icon size={15}/>
                  </button>
                ))}
                {getPaginationRange().map((pg,i)=>pg==='...'?(
                  <span key={`d${i}`} style={{ padding:'0 8px',color:C.textMuted,fontWeight:700 }}>…</span>
                ):(
                  <button key={pg} onClick={()=>goToPage(pg)} className={currentPage===pg?'dc-page-active':'dc-page-btn'}
                    style={{ width:34,height:34,borderRadius:10,border:`1px solid ${C.border}`,background:currentPage===pg?undefined:C.surface,color:currentPage===pg?undefined:C.text,fontSize:13,fontWeight:800,cursor:'pointer' }}>
                    {pg}
                  </button>
                ))}
                {[
                  [ChevronRight,  ()=>goToPage(currentPage+1),currentPage===totalPages,'Next'],
                  [ChevronsRight, ()=>goToPage(totalPages),    currentPage===totalPages,'Last'],
                ].map(([Icon,fn,dis,title],i)=>(
                  <button key={i} onClick={fn} disabled={dis} title={title} className="dc-btn"
                    style={{ width:34,height:34,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',background:C.surface,border:`1px solid ${C.border}`,color:C.text,cursor:dis?'not-allowed':'pointer',opacity:dis?0.4:1 }}>
                    <Icon size={15}/>
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
};

export default DashboardContent;