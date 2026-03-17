import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Users, Activity, AlertCircle, Waves,
  Globe, Monitor, Smartphone, Tablet, Chrome,
  Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  RefreshCw, Filter, Search, X, PieChart, BarChart3,
  MapPin, Eye, Info, ExternalLink, Copy, Check,
  Wifi, Server, Map, Flag, Clock3, Globe2, Compass,
  Gauge, Users2, MousePointer, Clock as TimeIcon,
  MoreVertical, ArrowUp, ArrowDown
} from 'lucide-react';

import {
  AreaChart, Area, BarChart, Bar, LineChart,
  PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

// ─── Clay Teal Design Tokens ────────────────────────────────────────────────
const C = {
  base: '#0D9488', light: '#14B8A6', lighter: '#2DD4BF',
  lightest: '#CCFBF1', bg: '#F0FDFA', surface: '#FFFFFF',
  surfaceHigh: '#E6FAF8', surfaceHigher: '#CCFBF1',
  border: 'rgba(13,148,136,0.12)', text: '#134E4A',
  textMuted: '#0F766E', textSub: '#5EEAD4',
  shadow: 'rgba(13,148,136,0.18)', shadowMd: 'rgba(13,148,136,0.25)',
  shadowLg: 'rgba(13,148,136,0.35)',
  chart: ['#14B8A6','#0D9488','#2DD4BF','#0F766E','#5EEAD4','#115E59','#99F6E4','#134E4A'],
};

// ─── Reusable Clay Card ──────────────────────────────────────────────────────
const Card = ({ children, style = {}, className = '' }) => (
  <div className={className} style={{
    background: C.surface, borderRadius: 20,
    border: `1px solid ${C.border}`,
    boxShadow: `0 6px 20px ${C.shadow}, inset 0 1px 1px rgba(255,255,255,0.9)`,
    ...style,
  }}>
    {children}
  </div>
);

// ─── Clay Icon Button ────────────────────────────────────────────────────────
const IconBtn = ({ children, onClick, active = false, style = {} }) => {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 38, height: 38, borderRadius: 12, border: 'none', cursor: 'pointer',
        background: active ? `linear-gradient(135deg,${C.base},${C.light})` : C.surface,
        color: active ? '#fff' : C.textMuted,
        boxShadow: active
          ? `0 6px 16px ${C.shadowLg}, inset 0 1px 1px rgba(255,255,255,0.2)`
          : hov
            ? `0 8px 20px ${C.shadowMd}, inset 0 1px 1px rgba(255,255,255,0.95)`
            : `0 4px 12px ${C.shadow}, inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -1px 2px rgba(13,148,136,0.08)`,
        transform: hov && !active ? 'translateY(-1px) scale(1.04)' : 'none',
        transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
        ...style,
      }}
    >{children}</button>
  );
};

// ─── Clay Primary Button ─────────────────────────────────────────────────────
const PrimaryBtn = ({ children, onClick, disabled = false, style = {} }) => {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '10px 18px', borderRadius: 14, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        background: `linear-gradient(135deg,${C.base},${C.light})`,
        color: '#fff', fontSize: 13.5, fontWeight: 700,
        fontFamily: "'Nunito',sans-serif", opacity: disabled ? 0.6 : 1,
        boxShadow: hov && !disabled
          ? `0 10px 24px ${C.shadowLg}, inset 0 1px 1px rgba(255,255,255,0.2)`
          : `0 6px 16px ${C.shadowMd}, inset 0 1px 1px rgba(255,255,255,0.2)`,
        transform: hov && !disabled ? 'translateY(-1px)' : 'none',
        transition: 'all 0.2s ease',
        ...style,
      }}
    >{children}</button>
  );
};

// ─── Clay Secondary Button ───────────────────────────────────────────────────
const SecBtn = ({ children, onClick, disabled = false }) => {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '10px 18px', borderRadius: 14, border: `1px solid ${C.border}`,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1,
        background: C.surface, color: C.textMuted,
        fontSize: 13.5, fontWeight: 700, fontFamily: "'Nunito',sans-serif",
        boxShadow: hov
          ? `0 8px 20px ${C.shadowMd}, inset 0 1px 1px rgba(255,255,255,0.95)`
          : `0 4px 12px ${C.shadow}, inset 0 1px 1px rgba(255,255,255,0.9)`,
        transform: hov ? 'translateY(-1px)' : 'none',
        transition: 'all 0.2s ease',
      }}
    >{children}</button>
  );
};

// ─── Section Title ───────────────────────────────────────────────────────────
const SectionTitle = ({ icon: Icon, title, right }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 42, height: 42, borderRadius: 14, flexShrink: 0,
        background: `linear-gradient(135deg,${C.base},${C.light})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 6px 16px ${C.shadowMd}`,
      }}>
        <Icon size={20} color="#fff" />
      </div>
      <h2 style={{ color: C.text, fontSize: 18, fontWeight: 800, margin: 0 }}>{title}</h2>
    </div>
    {right}
  </div>
);

// ─── Custom Recharts Tooltip ─────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: '10px 14px',
      boxShadow: `0 8px 24px ${C.shadowMd}`,
    }}>
      <p style={{ color: C.text, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{label}</p>
      {payload.map((e, i) => (
        <p key={i} style={{ color: C.textMuted, fontSize: 12, margin: '2px 0' }}>
          {e.name}: <strong style={{ color: C.base }}>{e.value?.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  );
};

// ─── Mock Data Generators ────────────────────────────────────────────────────
const genWeekly = () =>
  ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => ({
    name: d,
    visitors: Math.floor(Math.random()*1000)+500,
    pageViews: Math.floor(Math.random()*2000)+1000,
  }));

const genTraffic = () => [
  { name:'Direct', value:45 }, { name:'Social', value:30 },
  { name:'Email', value:15 }, { name:'Referral', value:10 },
];

const genEngagement = () => [
  { subject:'Bounce', A:42, fullMark:100 },
  { subject:'Duration', A:62, fullMark:100 },
  { subject:'Pages/Session', A:32, fullMark:100 },
  { subject:'Return Rate', A:28, fullMark:100 },
  { subject:'Conversion', A:32, fullMark:100 },
];

const mockVisitors = Array.from({ length: 12 }, (_, i) => ({
  id: i+1,
  ip: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
  city: ['New York','London','Tokyo','Berlin','Paris','Sydney'][i%6],
  country: ['USA','UK','Japan','Germany','France','Australia'][i%6],
  device: ['desktop','mobile','tablet'][i%3],
  browser: ['Chrome','Safari','Firefox','Edge'][i%4],
  os: ['Windows','macOS','iOS','Android'][i%4],
  page: ['/','/analytics','/products','/reports','/help'][i%5],
  timeAgo: [`${i+1}m ago`,`${i+1}h ago`][i%2],
}));

// ─── Main Component ──────────────────────────────────────────────────────────
const DashboardContent = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('last7days');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIp, setSelectedIp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({ device: '', browser: '', dateFrom: '', dateTo: '' });
  const [weeklyData] = useState(genWeekly());
  const [trafficData] = useState(genTraffic());
  const [engagementData] = useState(genEngagement());
  const [devices] = useState([
    { device:'Desktop', count:45 },{ device:'Mobile', count:40 },{ device:'Tablet', count:15 },
  ]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const copyIp = (ip) => {
    navigator.clipboard.writeText(ip).catch(()=>{});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalItems = mockVisitors.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedVisitors = mockVisitors
    .filter(v => !searchTerm || v.ip.includes(searchTerm) || v.city?.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(v => !filters.device || v.device === filters.device)
    .filter(v => !filters.browser || v.browser.toLowerCase() === filters.browser)
    .slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);

  const stats = [
    { title:'Total Visitors', value:'48,291', change:'+12.4%', trend:'up', icon:Users, sub:'All time', secondary:'12,840 unique', grad:`linear-gradient(135deg,${C.base},${C.light})` },
    { title:'Active Now', value:'142', change:'+8.1%', trend:'up', icon:Activity, sub:'Last 5 minutes', secondary:'34.2% bounce rate', grad:`linear-gradient(135deg,${C.lighter},${C.base})` },
    { title:"Today's Visitors", value:'1,284', change:'+9.3%', trend:'up', icon:TrendingUp, sub:'vs yesterday', secondary:'3m 5s avg session', grad:`linear-gradient(135deg,${C.base},#0F766E)` },
    { title:'Engagement', value:'3.2', change:'+12%', trend:'up', icon:MousePointer, sub:'Pages per session', secondary:'8,471 this week', grad:`linear-gradient(135deg,${C.light},${C.lighter})` },
  ];

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        minHeight:'100vh', background:`linear-gradient(135deg,${C.bg},${C.surfaceHigh})`,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily:"'Nunito',sans-serif",
      }}>
        <Card style={{ padding: 48, textAlign:'center', maxWidth: 320 }}>
          <div style={{ position:'relative', width:80, height:80, margin:'0 auto 20px' }}>
            <div style={{
              width:80, height:80, borderRadius:'50%', border:`6px solid ${C.surfaceHigher}`,
              borderTopColor: C.base, animation:'spin 0.9s linear infinite',
            }}/>
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Waves size={28} color={C.base} />
            </div>
          </div>
          <p style={{ color:C.text, fontWeight:800, fontSize:18, margin:0 }}>Loading Dashboard</p>
          <p style={{ color:C.textMuted, fontSize:13, marginTop:6 }}>Fetching your analytics…</p>
        </Card>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight:'100vh', background:`linear-gradient(160deg,${C.bg} 0%,${C.surfaceHigh} 100%)`,
      padding:'24px 16px', fontFamily:"'Nunito',sans-serif",
      boxSizing:'border-box',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&display=swap');
        *{box-sizing:border-box;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp 0.4s ease both;}
        .stat-card:hover .hover-bar{transform:scaleX(1)!important;}
        select,input{font-family:'Nunito',sans-serif;}
        @media(max-width:640px){
          .hide-mobile{display:none!important;}
          .stack-mobile{flex-direction:column!important;}
          .full-mobile{width:100%!important;}
        }
        @media(max-width:900px){
          .hide-tablet{display:none!important;}
        }
        ::-webkit-scrollbar{width:6px;height:6px;}
        ::-webkit-scrollbar-track{background:${C.surfaceHigh};border-radius:10px;}
        ::-webkit-scrollbar-thumb{background:linear-gradient(180deg,${C.lighter},${C.base});border-radius:10px;}
        tr:hover td{background:${C.surfaceHigh};}
        td{transition:background 0.15s;}
      `}</style>

      <div style={{ maxWidth:1280, margin:'0 auto' }}>

        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div className="fade-up stack-mobile" style={{
          display:'flex', alignItems:'flex-start', justifyContent:'space-between',
          gap:16, marginBottom:28,
        }}>
          <div>
            <h1 style={{
              fontSize:'clamp(24px,4vw,40px)', fontWeight:900, margin:0,
              background:`linear-gradient(135deg,${C.text},${C.base})`,
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            }}>Dashboard Overview</h1>
            <p style={{ color:C.textMuted, fontSize:14, marginTop:6 }}>Real-time analytics & visitor insights</p>
          </div>
          <div className="full-mobile" style={{ display:'flex', flexWrap:'wrap', gap:10, alignItems:'center', justifyContent:'flex-end' }}>
            <SecBtn onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw size={15} style={{ animation: refreshing ? 'spin 0.9s linear infinite' : 'none' }} />
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </SecBtn>
            <PrimaryBtn>
              <Download size={15} /> Export
            </PrimaryBtn>
            <select value={timeRange} onChange={e=>setTimeRange(e.target.value)} style={{
              padding:'10px 14px', borderRadius:14, border:`1px solid ${C.border}`,
              background:C.surface, color:C.textMuted, fontSize:13.5, fontWeight:700,
              boxShadow:`0 4px 12px ${C.shadow}, inset 0 1px 1px rgba(255,255,255,0.9)`,
              outline:'none', cursor:'pointer',
            }}>
              <option value="today">Today</option>
              <option value="last7days">Last 7 days</option>
              <option value="last30days">Last 30 days</option>
              <option value="last90days">Last 90 days</option>
              <option value="thisyear">This year</option>
            </select>
          </div>
        </div>

        {/* ── Stats Grid ──────────────────────────────────────────────── */}
        <div className="fade-up" style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',
          gap:16, marginBottom:24,
        }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-card" style={{
              background:C.surface, borderRadius:20, padding:22,
              border:`1px solid ${C.border}`, position:'relative', overflow:'hidden',
              boxShadow:`0 6px 20px ${C.shadow}, inset 0 1px 1px rgba(255,255,255,0.9)`,
              animationDelay:`${i*0.08}s`,
              transition:'transform 0.2s ease, box-shadow 0.2s ease',
            }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow=`0 12px 32px ${C.shadowMd}, inset 0 1px 1px rgba(255,255,255,0.9)`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=`0 6px 20px ${C.shadow}, inset 0 1px 1px rgba(255,255,255,0.9)`;}}
            >
              {/* Bg blob */}
              <div style={{
                position:'absolute', top:-40, right:-40, width:120, height:120,
                borderRadius:'50%', background:`radial-gradient(circle,${C.surfaceHigher} 0%,transparent 70%)`,
                pointerEvents:'none',
              }}/>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', position:'relative' }}>
                <div>
                  <p style={{ color:C.textMuted, fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:0.8, margin:0 }}>{s.title}</p>
                  <p style={{ color:C.text, fontSize:30, fontWeight:900, margin:'6px 0 4px' }}>{s.value}</p>
                  <p style={{ color:C.textSub, fontSize:12, margin:0 }}>{s.sub}</p>
                  <span style={{
                    display:'inline-block', marginTop:8,
                    background:C.surfaceHigh, color:C.textMuted,
                    fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20,
                  }}>{s.secondary}</span>
                </div>
                <div style={{
                  width:46, height:46, borderRadius:14, flexShrink:0,
                  background:s.grad,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:`0 6px 16px ${C.shadowMd}`,
                }}>
                  <s.icon size={22} color="#fff" />
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:16 }}>
                <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:13, fontWeight:800, color: s.trend==='up' ? C.base : '#EF4444' }}>
                  {s.trend==='up' ? <ArrowUp size={14}/> : <ArrowDown size={14}/>}
                  {s.change}
                </span>
                <span style={{ color:C.textSub, fontSize:12 }}>vs last period</span>
              </div>
              {/* Hover bar */}
              <div className="hover-bar" style={{
                position:'absolute', bottom:0, left:0, height:3, width:'100%',
                background:`linear-gradient(90deg,${C.lighter},${C.base})`,
                transform:'scaleX(0)', transformOrigin:'left', transition:'transform 0.3s ease',
                borderRadius:'0 0 20px 20px',
              }}/>
            </div>
          ))}
        </div>

        {/* ── Charts Row ──────────────────────────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:16, marginBottom:24 }}>

          {/* Weekly Traffic */}
          <Card style={{ padding:22 }}>
            <SectionTitle icon={BarChart3} title="Weekly Traffic" right={<IconBtn><MoreVertical size={16}/></IconBtn>} />
            <div style={{ height:260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.light} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={C.light} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.base} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={C.base} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.surfaceHigher}/>
                  <XAxis dataKey="name" tick={{ fill:C.textMuted, fontSize:11 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill:C.textMuted, fontSize:11 }} axisLine={false} tickLine={false} width={40}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Legend wrapperStyle={{ color:C.textMuted, fontSize:12 }}/>
                  <Area type="monotone" dataKey="visitors" stroke={C.light} strokeWidth={2.5} fill="url(#vg)" name="Visitors"/>
                  <Area type="monotone" dataKey="pageViews" stroke={C.base} strokeWidth={2.5} fill="url(#pg)" name="Page Views"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Device Distribution */}
          <Card style={{ padding:22 }}>
            <SectionTitle icon={PieChart} title="Device Distribution" right={<IconBtn><MoreVertical size={16}/></IconBtn>}/>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ height:180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={devices} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="count">
                      {devices.map((_, i) => <Cell key={i} fill={C.chart[i]}/>)}
                    </Pie>
                    <Tooltip content={<CustomTooltip/>}/>
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {devices.map((d, i) => {
                  const total = devices.reduce((a,b)=>a+b.count,0);
                  const pct = ((d.count/total)*100).toFixed(1);
                  const DevIcon = d.device==='Mobile' ? Smartphone : d.device==='Tablet' ? Tablet : Monitor;
                  return (
                    <div key={i}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                        <span style={{ display:'flex', alignItems:'center', gap:6, color:C.textMuted, fontSize:13, fontWeight:600 }}>
                          <DevIcon size={13} color={C.chart[i]}/>{d.device}
                        </span>
                        <span style={{ color:C.text, fontSize:13, fontWeight:800 }}>{pct}%</span>
                      </div>
                      <div style={{ height:8, borderRadius:8, background:C.surfaceHigh, overflow:'hidden' }}>
                        <div style={{ height:'100%', borderRadius:8, width:`${pct}%`, background:`linear-gradient(90deg,${C.chart[i]},${C.chart[(i+1)%C.chart.length]})`, transition:'width 1s ease' }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Traffic Sources */}
          <Card style={{ padding:22 }}>
            <SectionTitle icon={BarChart3} title="Traffic Sources" right={<IconBtn><MoreVertical size={16}/></IconBtn>}/>
            <div style={{ height:260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.surfaceHigher}/>
                  <XAxis dataKey="name" tick={{ fill:C.textMuted, fontSize:11 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill:C.textMuted, fontSize:11 }} axisLine={false} tickLine={false} width={30}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Bar dataKey="value" radius={[8,8,0,0]} name="Share %">
                    {trafficData.map((_, i) => <Cell key={i} fill={C.chart[i]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Engagement Radar */}
          <Card style={{ padding:22 }}>
            <SectionTitle icon={Gauge} title="Engagement Metrics" right={<IconBtn><MoreVertical size={16}/></IconBtn>}/>
            <div style={{ height:260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={engagementData}>
                  <PolarGrid stroke={C.surfaceHigher}/>
                  <PolarAngleAxis dataKey="subject" tick={{ fill:C.textMuted, fontSize:11 }}/>
                  <PolarRadiusAxis tick={{ fill:C.textSub, fontSize:10 }} axisLine={false}/>
                  <Radar dataKey="A" stroke={C.base} strokeWidth={2.5} fill={C.base} fillOpacity={0.2} name="Metrics"/>
                  <Tooltip content={<CustomTooltip/>}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* ── Top Pages ───────────────────────────────────────────────── */}
        <Card style={{ padding:22, marginBottom:24 }}>
          <SectionTitle icon={Eye} title="Top Pages" right={
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <div style={{ position:'relative' }}>
                <Search size={14} color={C.lighter} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                <input placeholder="Search pages…" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} style={{
                  paddingLeft:32, paddingRight:12, paddingTop:9, paddingBottom:9,
                  borderRadius:12, border:`1px solid ${C.border}`, background:C.surfaceHigh,
                  color:C.text, fontSize:13, fontWeight:500, outline:'none',
                  boxShadow:`inset 0 2px 4px ${C.shadow}`,
                  width:180,
                }}/>
              </div>
              <IconBtn active={showFilters} onClick={()=>setShowFilters(!showFilters)}>
                <Filter size={15}/>
              </IconBtn>
            </div>
          }/>

          {showFilters && (
            <div style={{ background:C.surfaceHigh, borderRadius:14, padding:16, marginBottom:16, border:`1px solid ${C.border}` }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:10 }}>
                {[['device',['desktop','mobile','tablet']],['browser',['chrome','firefox','safari','edge']]].map(([key,opts])=>(
                  <select key={key} value={filters[key]} onChange={e=>setFilters({...filters,[key]:e.target.value})} style={{
                    padding:'9px 12px', borderRadius:12, border:`1px solid ${C.border}`,
                    background:C.surface, color:C.textMuted, fontSize:13, fontWeight:600, outline:'none',
                    boxShadow:`0 2px 8px ${C.shadow}`,
                  }}>
                    <option value="">All {key[0].toUpperCase()+key.slice(1)}s</option>
                    {opts.map(o=><option key={o} value={o}>{o[0].toUpperCase()+o.slice(1)}</option>)}
                  </select>
                ))}
                <input type="date" value={filters.dateFrom} onChange={e=>setFilters({...filters,dateFrom:e.target.value})} style={{ padding:'9px 12px',borderRadius:12,border:`1px solid ${C.border}`,background:C.surface,color:C.textMuted,fontSize:13,outline:'none',boxShadow:`0 2px 8px ${C.shadow}` }}/>
                <input type="date" value={filters.dateTo} onChange={e=>setFilters({...filters,dateTo:e.target.value})} style={{ padding:'9px 12px',borderRadius:12,border:`1px solid ${C.border}`,background:C.surface,color:C.textMuted,fontSize:13,outline:'none',boxShadow:`0 2px 8px ${C.shadow}` }}/>
              </div>
              <button onClick={()=>setFilters({device:'',browser:'',dateFrom:'',dateTo:''})} style={{ background:'none',border:'none',cursor:'pointer',color:C.base,fontSize:13,fontWeight:700,marginTop:10 }}>Clear all ×</button>
            </div>
          )}

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {['/','/','/analytics','/products','/reports','/help','/visitors'].map((page,i)=>{
              const visits = [3241,2870,2100,1850,1400,980,760][i];
              const max = 3241;
              const pct = (visits/max*100).toFixed(1);
              return (
                <div key={i} style={{
                  padding:'12px 14px', borderRadius:14,
                  border:`1px solid transparent`,
                  transition:'all 0.18s ease',
                }}
                  onMouseEnter={e=>{e.currentTarget.style.background=C.surfaceHigh;e.currentTarget.style.borderColor=C.border;}}
                  onMouseLeave={e=>{e.currentTarget.style.background='';e.currentTarget.style.borderColor='transparent';}}
                >
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8, marginBottom:8 }}>
                    <span style={{ color:C.text, fontSize:14, fontWeight:700 }}>{['/','/','/analytics','/products','/reports','/help','/visitors'][i]}</span>
                    <div style={{ display:'flex', gap:16 }}>
                      <span style={{ color:C.textMuted, fontSize:13 }}><strong style={{ color:C.text }}>{visits.toLocaleString()}</strong> visits</span>
                      <span style={{ color:C.textMuted, fontSize:13 }}><strong style={{ color:C.text }}>{Math.floor(visits*0.72).toLocaleString()}</strong> unique</span>
                    </div>
                  </div>
                  <div style={{ height:8, borderRadius:8, background:C.surfaceHigher, overflow:'hidden' }}>
                    <div style={{ height:'100%', borderRadius:8, width:`${pct}%`, background:`linear-gradient(90deg,${C.chart[i%C.chart.length]},${C.chart[(i+1)%C.chart.length]})`, transition:'width 1s ease' }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* ── Recent Visitors Table ────────────────────────────────────── */}
        <Card style={{ overflow:'hidden', marginBottom:24 }}>
          {/* Table Header */}
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            flexWrap:'wrap', gap:12, padding:'20px 22px',
            background:`linear-gradient(90deg,${C.surfaceHigh},${C.surface})`,
            borderBottom:`1px solid ${C.border}`,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:42,height:42,borderRadius:14,background:`linear-gradient(135deg,${C.base},${C.light})`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 6px 16px ${C.shadowMd}` }}>
                <Users2 size={20} color="#fff"/>
              </div>
              <h2 style={{ color:C.text, fontSize:18, fontWeight:800, margin:0 }}>Recent Visitors</h2>
              <span style={{ background:`linear-gradient(135deg,${C.base},${C.light})`, color:'#fff', fontSize:12, fontWeight:700, padding:'3px 12px', borderRadius:20, boxShadow:`0 4px 10px ${C.shadowMd}` }}>
                {totalItems} total
              </span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ color:C.textMuted, fontSize:13, fontWeight:600 }}>Show:</span>
              <select value={itemsPerPage} onChange={e=>{setItemsPerPage(Number(e.target.value));setCurrentPage(1);}} style={{
                padding:'7px 12px', borderRadius:12, border:`1px solid ${C.border}`,
                background:C.surface, color:C.textMuted, fontSize:13, fontWeight:700,
                boxShadow:`0 3px 8px ${C.shadow}`, outline:'none',
              }}>
                {[5,10,20,50].map(n=><option key={n}>{n}</option>)}
              </select>
            </div>
          </div>

          {/* Scrollable table */}
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', minWidth:700, borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:C.surfaceHigh }}>
                  {['IP Address','Location','Device','Browser / OS','Page','Time','Actions'].map(h=>(
                    <th key={h} style={{ padding:'12px 18px', textAlign:'left', fontSize:11, fontWeight:800, color:C.textMuted, textTransform:'uppercase', letterSpacing:0.8, whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedVisitors.map((v,i)=>(
                  <tr key={v.id}>
                    <td style={{ padding:'13px 18px', fontFamily:'monospace', fontSize:13, fontWeight:700, color:C.text, whiteSpace:'nowrap' }}>{v.ip}</td>
                    <td style={{ padding:'13px 18px' }}>
                      <span style={{ display:'flex', alignItems:'center', gap:6, color:C.textMuted, fontSize:13, fontWeight:600, whiteSpace:'nowrap' }}>
                        <MapPin size={13} color={C.lighter}/>{v.city}, {v.country}
                      </span>
                    </td>
                    <td style={{ padding:'13px 18px' }}>
                      <span style={{ display:'flex', alignItems:'center', gap:6, color:C.textMuted, fontSize:13, fontWeight:600, textTransform:'capitalize' }}>
                        {v.device==='mobile'?<Smartphone size={13} color={C.base}/>:v.device==='tablet'?<Tablet size={13} color={C.base}/>:<Monitor size={13} color={C.base}/>}
                        {v.device}
                      </span>
                    </td>
                    <td style={{ padding:'13px 18px' }}>
                      <span style={{ display:'flex', alignItems:'center', gap:6, color:C.textMuted, fontSize:13, fontWeight:600, whiteSpace:'nowrap' }}>
                        <Chrome size={13} color={C.light}/>{v.browser} / {v.os}
                      </span>
                    </td>
                    <td style={{ padding:'13px 18px', color:C.textMuted, fontSize:13, fontWeight:600 }}>{v.page}</td>
                    <td style={{ padding:'13px 18px' }}>
                      <span style={{ display:'flex', alignItems:'center', gap:6, color:C.textMuted, fontSize:13, fontWeight:600, whiteSpace:'nowrap' }}>
                        <TimeIcon size={13} color={C.lighter}/>{v.timeAgo}
                      </span>
                    </td>
                    <td style={{ padding:'13px 18px' }}>
                      <button onClick={()=>{setSelectedIp(v.ip);setShowModal(true);setActiveTab('overview');}} style={{
                        display:'inline-flex', alignItems:'center', gap:6,
                        padding:'7px 14px', borderRadius:10, border:'none', cursor:'pointer',
                        background:`linear-gradient(135deg,${C.base},${C.light})`, color:'#fff',
                        fontSize:12, fontWeight:700, fontFamily:"'Nunito',sans-serif",
                        boxShadow:`0 4px 12px ${C.shadowMd}`,
                        transition:'all 0.15s ease', whiteSpace:'nowrap',
                      }}
                        onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 6px 18px ${C.shadowLg}`;e.currentTarget.style.transform='translateY(-1px)';}}
                        onMouseLeave={e=>{e.currentTarget.style.boxShadow=`0 4px 12px ${C.shadowMd}`;e.currentTarget.style.transform='';}}
                      >
                        <Info size={12}/> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginatedVisitors.length === 0 && (
            <div style={{ textAlign:'center', padding:'48px 24px' }}>
              <div style={{ width:64,height:64,borderRadius:'50%',background:C.surfaceHigh,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px' }}>
                <Users size={28} color={C.lighter}/>
              </div>
              <p style={{ color:C.textMuted, fontSize:15, fontWeight:600 }}>No visitors found</p>
            </div>
          )}

          {/* Pagination */}
          {paginatedVisitors.length > 0 && (
            <div style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              flexWrap:'wrap', gap:12, padding:'14px 22px',
              borderTop:`1px solid ${C.border}`, background:C.surfaceHigh,
            }}>
              <p style={{ color:C.textMuted, fontSize:13, fontWeight:600, margin:0 }}>
                Showing {((currentPage-1)*itemsPerPage)+1}–{Math.min(currentPage*itemsPerPage,totalItems)} of {totalItems}
              </p>
              <div style={{ display:'flex', gap:6, alignItems:'center', flexWrap:'wrap' }}>
                {[
                  [<ChevronsLeft size={14}/>, ()=>setCurrentPage(1), currentPage===1],
                  [<ChevronLeft size={14}/>, ()=>setCurrentPage(p=>Math.max(1,p-1)), currentPage===1],
                ].map(([icon,fn,dis],i)=>(
                  <button key={i} onClick={fn} disabled={dis} style={{
                    width:34,height:34,borderRadius:10,border:`1px solid ${C.border}`,
                    background:C.surface,cursor:dis?'not-allowed':'pointer',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    color:dis?C.textSub:C.textMuted, opacity:dis?0.5:1,
                    boxShadow:`0 2px 6px ${C.shadow}`, transition:'all 0.15s',
                  }}>{icon}</button>
                ))}
                {Array.from({length:Math.min(totalPages,5)},(_, i)=>{
                  const p = Math.max(1,Math.min(currentPage-2,totalPages-4))+i;
                  if(p<1||p>totalPages) return null;
                  return (
                    <button key={p} onClick={()=>setCurrentPage(p)} style={{
                      width:34,height:34,borderRadius:10,border:`1px solid ${p===currentPage?C.base:C.border}`,
                      background:p===currentPage?`linear-gradient(135deg,${C.base},${C.light})`:C.surface,
                      cursor:'pointer', color:p===currentPage?'#fff':C.textMuted,
                      fontSize:13, fontWeight:700,
                      boxShadow:p===currentPage?`0 4px 12px ${C.shadowMd}`:`0 2px 6px ${C.shadow}`,
                      transition:'all 0.15s',
                    }}>{p}</button>
                  );
                })}
                {[
                  [<ChevronRight size={14}/>, ()=>setCurrentPage(p=>Math.min(totalPages,p+1)), currentPage===totalPages],
                  [<ChevronsRight size={14}/>, ()=>setCurrentPage(totalPages), currentPage===totalPages],
                ].map(([icon,fn,dis],i)=>(
                  <button key={i} onClick={fn} disabled={dis} style={{
                    width:34,height:34,borderRadius:10,border:`1px solid ${C.border}`,
                    background:C.surface,cursor:dis?'not-allowed':'pointer',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    color:dis?C.textSub:C.textMuted, opacity:dis?0.5:1,
                    boxShadow:`0 2px 6px ${C.shadow}`, transition:'all 0.15s',
                  }}>{icon}</button>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ── IP Details Modal ─────────────────────────────────────────── */}
      {showModal && (
        <div style={{ position:'fixed',inset:0,zIndex:1000,overflow:'auto', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <div onClick={()=>setShowModal(false)} style={{ position:'fixed',inset:0,background:'rgba(13,148,136,0.18)',backdropFilter:'blur(4px)' }}/>
          <div style={{
            position:'relative', width:'100%', maxWidth:680, maxHeight:'90vh',
            background:C.surface, borderRadius:24, overflow:'hidden',
            border:`2px solid ${C.border}`,
            boxShadow:`0 24px 60px ${C.shadowLg}, 0 6px 20px rgba(0,0,0,0.08)`,
          }}>
            {/* Modal Header */}
            <div style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'20px 24px', borderBottom:`1px solid ${C.border}`,
              background:`linear-gradient(90deg,${C.surfaceHigh},${C.surface})`,
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:44,height:44,borderRadius:14,background:`linear-gradient(135deg,${C.base},${C.light})`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 6px 16px ${C.shadowMd}` }}>
                  <Globe size={22} color="#fff"/>
                </div>
                <div>
                  <h2 style={{ color:C.text, fontSize:18, fontWeight:800, margin:0 }}>IP Address Details</h2>
                  <p style={{ color:C.textMuted, fontSize:13, margin:0 }}>{selectedIp}</p>
                </div>
              </div>
              <IconBtn onClick={()=>setShowModal(false)}><X size={16}/></IconBtn>
            </div>

            {/* Tabs */}
            <div style={{ display:'flex', borderBottom:`1px solid ${C.border}`, padding:'0 24px', background:C.surface }}>
              {['overview','network','location'].map(tab=>(
                <button key={tab} onClick={()=>setActiveTab(tab)} style={{
                  padding:'14px 16px', border:'none', background:'none', cursor:'pointer',
                  fontSize:13.5, fontWeight:700, textTransform:'capitalize',
                  color:activeTab===tab ? C.base : C.textMuted,
                  borderBottom:activeTab===tab ? `3px solid ${C.base}` : '3px solid transparent',
                  transition:'all 0.15s', fontFamily:"'Nunito',sans-serif",
                }}>{tab}</button>
              ))}
            </div>

            {/* Modal Body */}
            <div style={{ overflowY:'auto', maxHeight:'calc(90vh - 180px)', padding:24 }}>
              {activeTab==='overview' && (
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div style={{ background:C.surfaceHigh, borderRadius:16, padding:18, border:`1px solid ${C.border}` }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                        <div style={{ width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${C.base},${C.light})`,display:'flex',alignItems:'center',justifyContent:'center' }}>
                          <Server size={18} color="#fff"/>
                        </div>
                        <div>
                          <p style={{ color:C.textMuted, fontSize:12, fontWeight:600, margin:0 }}>IP Address</p>
                          <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:2 }}>
                            <span style={{ fontFamily:'monospace', fontSize:17, fontWeight:800, color:C.text }}>{selectedIp}</span>
                            <button onClick={()=>copyIp(selectedIp)} style={{ background:'none',border:'none',cursor:'pointer',color:C.lighter, display:'flex', alignItems:'center' }}>
                              {copied ? <Check size={16} color={C.base}/> : <Copy size={16}/>}
                            </button>
                          </div>
                        </div>
                      </div>
                      <span style={{ background:`linear-gradient(135deg,${C.base},${C.light})`,color:'#fff',fontSize:12,fontWeight:700,padding:'5px 14px',borderRadius:20,boxShadow:`0 4px 10px ${C.shadowMd}` }}>IPv4</span>
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12 }}>
                    {[
                      {icon:MapPin, label:'Location', value:'San Francisco, CA', sub:'United States'},
                      {icon:Globe2, label:'Continent', value:'North America', sub:'NA'},
                      {icon:Flag, label:'Country', value:'🇺🇸 United States', sub:'Capital: Washington D.C.'},
                      {icon:Clock3, label:'Timezone', value:'America/Los_Angeles', sub:'UTC −8:00'},
                    ].map((item,i)=>(
                      <div key={i} style={{ background:C.surfaceHigh, borderRadius:14, padding:16, border:`1px solid ${C.border}` }}>
                        <div style={{ display:'flex', gap:12 }}>
                          <div style={{ width:36,height:36,borderRadius:11,background:C.surfaceHigher,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                            <item.icon size={16} color={C.base}/>
                          </div>
                          <div>
                            <p style={{ color:C.textMuted, fontSize:11, fontWeight:700, margin:0 }}>{item.label}</p>
                            <p style={{ color:C.text, fontSize:13, fontWeight:700, margin:'3px 0 2px' }}>{item.value}</p>
                            <p style={{ color:C.textMuted, fontSize:12, margin:0 }}>{item.sub}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab==='network' && (
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  {[
                    {title:'Connection Details', icon:Wifi, rows:[['ASN','AS15169'],['Organization','Google LLC'],['ISP','Google Fiber'],['Domain','google.com']]},
                    {title:'Additional Info', icon:Info, rows:[['Calling Code','+1'],['Postal Code','94105'],['European Union','No']]},
                  ].map((section,si)=>(
                    <div key={si} style={{ background:C.surfaceHigh, borderRadius:16, padding:18, border:`1px solid ${C.border}` }}>
                      <h3 style={{ display:'flex', alignItems:'center', gap:8, color:C.text, fontSize:15, fontWeight:800, margin:'0 0 14px' }}>
                        <section.icon size={16} color={C.base}/>{section.title}
                      </h3>
                      {section.rows.map(([k,v],i)=>(
                        <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:i<section.rows.length-1?`1px solid ${C.border}`:'none' }}>
                          <span style={{ color:C.textMuted, fontSize:13, fontWeight:600 }}>{k}</span>
                          <span style={{ color:C.text, fontSize:13, fontWeight:700, fontFamily:'monospace' }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {activeTab==='location' && (
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div style={{ background:C.surfaceHigh, borderRadius:16, padding:18, border:`1px solid ${C.border}` }}>
                    <h3 style={{ display:'flex', alignItems:'center', gap:8, color:C.text, fontSize:15, fontWeight:800, margin:'0 0 14px' }}>
                      <Compass size={16} color={C.base}/>Coordinates
                    </h3>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                      {[['Latitude','37.7749'],['Longitude','-122.4194']].map(([k,v])=>(
                        <div key={k} style={{ background:C.surfaceHigher, borderRadius:12, padding:14 }}>
                          <p style={{ color:C.textMuted, fontSize:12, fontWeight:600, margin:0 }}>{k}</p>
                          <p style={{ fontFamily:'monospace', fontSize:16, fontWeight:800, color:C.text, margin:'4px 0 0' }}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background:C.surfaceHigh, borderRadius:16, padding:18, border:`1px solid ${C.border}` }}>
                    <h3 style={{ display:'flex', alignItems:'center', gap:8, color:C.text, fontSize:15, fontWeight:800, margin:'0 0 14px' }}>
                      <Map size={16} color={C.base}/>Location Hierarchy
                    </h3>
                    {[['Continent','North America'],[' Country','United States'],['Region','California'],['City','San Francisco']].map(([k,v],i,arr)=>(
                      <div key={k} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:i<arr.length-1?`1px solid ${C.border}`:'none' }}>
                        <div style={{ width:32,height:32,borderRadius:10,background:C.surfaceHigher,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                          <MapPin size={14} color={C.base}/>
                        </div>
                        <div>
                          <p style={{ color:C.textMuted, fontSize:11, fontWeight:600, margin:0 }}>{k.trim()}</p>
                          <p style={{ color:C.text, fontSize:13, fontWeight:700, margin:'2px 0 0' }}>{v}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ display:'flex', justifyContent:'flex-end', gap:10, padding:'14px 24px', borderTop:`1px solid ${C.border}`, background:C.surfaceHigh }}>
              <SecBtn onClick={()=>setShowModal(false)}>Close</SecBtn>
              <PrimaryBtn>
                <ExternalLink size={14}/> View on WhatIsMyIP
              </PrimaryBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;