import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { visitorApi } from '../../../api/visitorApi';
import { formatTimeAgo } from '../../../utils/helpers';
import { RefreshCw, Eye, Users } from 'lucide-react';

const C = {
  base:'#0D9488', light:'#14B8A6', lighter:'#2DD4BF',
  bg:'#F0FDFA', surface:'#FFFFFF', surfaceHigh:'#E6FAF8', surfaceHigher:'#CCFBF1',
  border:'rgba(13,148,136,0.12)', text:'#134E4A', textMuted:'#0F766E',
  shadow:'rgba(13,148,136,0.18)', shadowMd:'rgba(13,148,136,0.25)',
};

const AVATAR_GRADS = [
  'linear-gradient(135deg,#0D9488,#14B8A6)',
  'linear-gradient(135deg,#8B5CF6,#7C3AED)',
  'linear-gradient(135deg,#F59E0B,#D97706)',
  'linear-gradient(135deg,#3B82F6,#2563EB)',
  'linear-gradient(135deg,#EF4444,#DC2626)',
];
const DEVICE_COLOR = { desktop:C.base, mobile:'#8B5CF6', tablet:'#F59E0B' };

const MOCK_VISITORS = Array.from({ length: 8 }, (_, i) => ({
  _id:`v${i}`, ip:`192.168.${i}.${i*3+1}`,
  browser:['Chrome','Safari','Firefox','Edge'][i%4],
  os:['Windows','macOS','iOS','Android'][i%4],
  device:['desktop','mobile','tablet'][i%3],
  city:['Mumbai','Delhi','Hyderabad','Pune'][i%4], country:'India',
  page:['/home','/about','/products','/contact'][i%4],
  createdAt: new Date(Date.now() - i * 480000).toISOString(),
}));

const RecentVisitors = ({ limit = 15, autoRefresh = true }) => {
  const navigate = useNavigate();
  const [visitors, setVisitors]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [spinning, setSpinning]     = useState(false);
  const [hovRow, setHovRow]         = useState(null);

  const fetchRecent = async (manual = false) => {
    if (manual) setSpinning(true);
    else setLoading(true);
    try {
      const res = await visitorApi.getRecentVisitors(limit);
      setVisitors(res.data);
      setLastUpdate(new Date());
    } catch {
      setVisitors(MOCK_VISITORS);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
      setSpinning(false);
    }
  };

  useEffect(() => {
    fetchRecent();
    if (autoRefresh) {
      const iv = setInterval(() => fetchRecent(), 30000);
      return () => clearInterval(iv);
    }
  }, [limit, autoRefresh]);

  if (loading && !visitors.length) return (
    <div style={{ fontFamily:"'Nunito',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', height:200 }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:40,height:40,borderRadius:'50%',border:`4px solid #CCFBF1`,borderTopColor:C.base,animation:'spin 0.9s linear infinite',margin:'0 auto 10px' }}/>
        <p style={{ color:C.textMuted, fontSize:13, fontWeight:600 }}>Loading visitors…</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, boxShadow:`0 6px 20px ${C.shadow}, inset 0 1px 1px rgba(255,255,255,0.9)`, overflow:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .rv-row{animation:fadeUp 0.3s ease both;transition:background 0.12s;cursor:pointer;}
        .rv-row:hover{background:${C.surfaceHigh}!important;}
        .rv-row:hover .rv-eye{color:${C.base}!important;}
        .rv-all:hover{background:${C.bg}!important;}
        .rv-refresh:hover{background:${C.surfaceHigher}!important;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:${C.lighter};border-radius:10px;}
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px', borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:38,height:38,borderRadius:12,background:`linear-gradient(135deg,${C.base},${C.light})`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 5px 12px ${C.shadowMd}` }}>
            <Users size={18} color="#fff"/>
          </div>
          <div>
            <h3 style={{ color:C.text, fontSize:16, fontWeight:800, margin:0 }}>Recent Visitors</h3>
            {lastUpdate && (
              <p style={{ color:C.textMuted, fontSize:11, fontWeight:600, margin:'2px 0 0' }}>
                <span style={{ display:'inline-block', width:6, height:6, borderRadius:'50%', background:C.base, marginRight:5, animation:'pulse 2s ease infinite', verticalAlign:'middle' }}/>
                Updated {formatTimeAgo?.(lastUpdate) ?? 'just now'}
              </p>
            )}
          </div>
        </div>
        <button className="rv-refresh" onClick={() => fetchRecent(true)}
          style={{ width:36, height:36, borderRadius:11, background:C.bg, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'background 0.12s' }}
          title="Refresh">
          <RefreshCw size={15} color={C.textMuted} style={{ animation: spinning ? 'spin 0.8s linear infinite' : 'none' }}/>
        </button>
      </div>

      {/* List */}
      <div style={{ maxHeight:460, overflowY:'auto', padding:'10px 12px' }}>
        {visitors.map((v, i) => (
          <div key={v._id} className="rv-row"
            style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 10px', borderRadius:14, background:'transparent', marginBottom:4, animationDelay:`${i*0.04}s` }}
            onMouseEnter={() => setHovRow(i)} onMouseLeave={() => setHovRow(null)}
            onClick={() => navigate(`/visitors/${v._id}`)}>

            {/* Avatar */}
            <div style={{ width:36, height:36, borderRadius:'50%', background:AVATAR_GRADS[i%AVATAR_GRADS.length], display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12, fontWeight:800, flexShrink:0 }}>
              {v.ip?.split('.').pop()}
            </div>

            {/* Content */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3, flexWrap:'wrap' }}>
                <code style={{ fontSize:11, background:C.bg, border:`1px solid ${C.border}`, padding:'2px 7px', borderRadius:7, fontFamily:'monospace', color:C.text, fontWeight:700 }}>{v.ip}</code>
                <span style={{ padding:'2px 8px', borderRadius:20, background:`${(DEVICE_COLOR[v.device]||C.base)}18`, color:DEVICE_COLOR[v.device]||C.base, fontSize:10, fontWeight:800, textTransform:'capitalize' }}>{v.device}</span>
                <span style={{ color:C.textMuted, fontSize:11, fontWeight:600, marginLeft:'auto', whiteSpace:'nowrap' }}>
                  {formatTimeAgo?.(v.createdAt) ?? 'now'}
                </span>
              </div>
              <p style={{ color:C.text, fontSize:12, fontWeight:700, margin:'0 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }} title={v.page}>
                {v.page?.split('/').pop() || '/'}
              </p>
              <p style={{ color:C.textMuted, fontSize:11, fontWeight:600, margin:0 }}>
                {v.browser} · {v.os}{v.city ? ` · ${v.city}, ${v.country}` : ''}
              </p>
            </div>

            {/* Eye icon */}
            <Eye className="rv-eye" size={14} style={{ color:C.textMuted, transition:'color 0.12s', flexShrink:0 }}/>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ borderTop:`1px solid ${C.border}`, padding:'12px 16px' }}>
        <button className="rv-all" onClick={() => navigate('/visitors')}
          style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'10px', borderRadius:12, background:C.bg, border:`1px solid ${C.border}`, color:C.base, fontSize:13, fontWeight:800, cursor:'pointer', transition:'background 0.12s' }}>
          <Users size={15}/> View All Visitors
        </button>
      </div>
    </div>
  );
};

export default RecentVisitors;