import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { visitorApi } from '../../../api/visitorApi';
import { ExternalLink, Eye, FileText } from 'lucide-react';

const C = {
  base:'#0D9488', light:'#14B8A6', lighter:'#2DD4BF', lightest:'#CCFBF1',
  bg:'#F0FDFA', surface:'#FFFFFF', surfaceHigh:'#E6FAF8', surfaceHigher:'#CCFBF1',
  border:'rgba(13,148,136,0.12)', text:'#134E4A', textMuted:'#0F766E', textSub:'#5EEAD4',
  shadow:'rgba(13,148,136,0.18)', shadowMd:'rgba(13,148,136,0.25)', shadowLg:'rgba(13,148,136,0.35)',
};

const Card = ({ children, style = {} }) => (
  <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, boxShadow:`0 6px 20px ${C.shadow}, inset 0 1px 1px rgba(255,255,255,0.9)`, padding:22, ...style }}>
    {children}
  </div>
);

const MOCK_PAGES = [
  { page:'/', visits:3241, uniqueVisitors:2332, _id:'aaa111' },
  { page:'/analytics', visits:2870, uniqueVisitors:2064, _id:'bbb222' },
  { page:'/products', visits:2100, uniqueVisitors:1512, _id:'ccc333' },
  { page:'/reports', visits:1850, uniqueVisitors:1332, _id:'ddd444' },
  { page:'/visitors', visits:1400, uniqueVisitors:1008, _id:'eee555' },
  { page:'/help', visits:980, uniqueVisitors:705, _id:'fff666' },
  { page:'/settings', visits:640, uniqueVisitors:461, _id:'ggg777' },
  { page:'/login', visits:420, uniqueVisitors:420, _id:'hhh888' },
];

const TopPages = ({ limit = 20 }) => {
  const navigate  = useNavigate ? useNavigate() : null;
  const [pages, setPages]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [hovRow, setHovRow]   = useState(null);

  useEffect(() => {
    if (visitorApi?.getTopPages) {
      visitorApi.getTopPages(limit)
        .then(res => setPages(res.data))
        .catch(() => setPages(MOCK_PAGES))
        .finally(() => setLoading(false));
    } else {
      setTimeout(() => { setPages(MOCK_PAGES); setLoading(false); }, 500);
    }
  }, [limit]);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:220, fontFamily:"'Nunito',sans-serif" }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:48,height:48,borderRadius:'50%',border:`4px solid ${C.surfaceHigher}`,borderTopColor:C.base,animation:'spin 0.9s linear infinite',margin:'0 auto 12px' }}/>
        <p style={{ color:C.textMuted, fontSize:14, fontWeight:600 }}>Loading pages…</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const totalVisits = pages.reduce((s, p) => s + p.visits, 0);
  const avg         = pages.length ? Math.round(totalVisits / pages.length) : 0;
  const top3Share   = pages.length >= 3 ? Math.round((pages.slice(0,3).reduce((s,p)=>s+p.visits,0) / totalVisits) * 100) : 0;
  const CHART_COLORS = ['#14B8A6','#0D9488','#2DD4BF','#0F766E','#5EEAD4','#115E59','#99F6E4','#134E4A'];

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", display:'flex', flexDirection:'column', gap:20 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .page-row{animation:fadeUp 0.3s ease both;transition:background 0.12s;}
        .page-row:hover{background:var(--c-high,#E6FAF8)!important;}
        .eye-btn:hover{background:rgba(13,148,136,0.12)!important;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-thumb{background:#2DD4BF;border-radius:10px;}
        @media(max-width:480px){.insight-grid{grid-template-columns:1fr!important;}.col-unique,.col-action{display:none!important;}}
      `}</style>

      {/* Header */}
      <div>
        <h2 style={{ color:C.text, fontSize:'clamp(20px,3.5vw,26px)', fontWeight:900, margin:0 }}>Top Pages</h2>
        <p style={{ color:C.textMuted, fontSize:14, marginTop:5 }}>Most visited pages on your website</p>
      </div>

      {/* Main table card */}
      <Card>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10, marginBottom:18 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:38,height:38,borderRadius:12,background:`linear-gradient(135deg,${C.base},${C.light})`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 5px 12px ${C.shadowMd}` }}>
              <FileText size={18} color="#fff"/>
            </div>
            <div>
              <h3 style={{ color:C.text, fontSize:16, fontWeight:800, margin:0 }}>Top {pages.length} Pages</h3>
              <p style={{ color:C.textMuted, fontSize:12, margin:0 }}>{totalVisits.toLocaleString()} total visits</p>
            </div>
          </div>
          <span style={{ background:`linear-gradient(135deg,${C.base},${C.light})`, color:'#fff', fontSize:12, fontWeight:700, padding:'4px 12px', borderRadius:20, boxShadow:`0 4px 10px ${C.shadowMd}` }}>
            {pages.length} pages
          </span>
        </div>

        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', minWidth:380, borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:C.surfaceHigh }}>
                <th style={{ padding:'10px 16px', textAlign:'left', fontSize:10, fontWeight:800, color:C.textMuted, textTransform:'uppercase', letterSpacing:0.8 }}>Page URL</th>
                <th style={{ padding:'10px 16px', textAlign:'left', fontSize:10, fontWeight:800, color:C.textMuted, textTransform:'uppercase', letterSpacing:0.8, whiteSpace:'nowrap' }}>Total Visits</th>
                <th className="col-unique" style={{ padding:'10px 16px', textAlign:'left', fontSize:10, fontWeight:800, color:C.textMuted, textTransform:'uppercase', letterSpacing:0.8, whiteSpace:'nowrap' }}>Unique</th>
                <th className="col-action" style={{ padding:'10px 16px', width:40 }}></th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page, i) => {
                const pct = totalVisits ? ((page.visits / totalVisits) * 100).toFixed(1) : 0;
                const barColor = CHART_COLORS[i % CHART_COLORS.length];
                const hov = hovRow === i;
                return (
                  <tr key={page._id || i} className="page-row" style={{ borderBottom:`1px solid ${C.border}`, background: hov ? C.surfaceHigh : 'transparent', animationDelay:`${i*0.04}s` }}
                    onMouseEnter={() => setHovRow(i)} onMouseLeave={() => setHovRow(null)}>
                    <td style={{ padding:'13px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
                        <div style={{ width:6,height:6,borderRadius:'50%',background:barColor,flexShrink:0 }}/>
                        <span style={{ color:C.text, fontSize:13, fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'clamp(120px,30vw,280px)' }} title={page.page}>
                          {page.page || '/'}
                        </span>
                        {page.page && (
                          <a href={page.page} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}
                            style={{ color:C.lighter, flexShrink:0, display:'flex', alignItems:'center', textDecoration:'none' }}>
                            <ExternalLink size={12}/>
                          </a>
                        )}
                      </div>
                      {/* Inline bar */}
                      <div style={{ marginTop:6, height:5, borderRadius:5, background:C.surfaceHigher, overflow:'hidden', maxWidth:200 }}>
                        <div style={{ height:'100%', borderRadius:5, width:`${pct}%`, background:`linear-gradient(90deg,${barColor},${CHART_COLORS[(i+1)%CHART_COLORS.length]})` }}/>
                      </div>
                    </td>
                    <td style={{ padding:'13px 16px' }}>
                      <span style={{ color:C.text, fontSize:13, fontWeight:800 }}>{page.visits.toLocaleString()}</span>
                      <span style={{ color:C.textMuted, fontSize:11, marginLeft:5 }}>({pct}%)</span>
                    </td>
                    <td className="col-unique" style={{ padding:'13px 16px' }}>
                      <span style={{ background:C.surfaceHigher, color:C.base, fontSize:12, fontWeight:700, padding:'4px 10px', borderRadius:20, whiteSpace:'nowrap' }}>
                        {page.uniqueVisitors.toLocaleString()}
                      </span>
                    </td>
                    <td className="col-action" style={{ padding:'13px 16px' }}>
                      <button className="eye-btn" onClick={() => navigate && navigate(`/visitors?filter[page]=${encodeURIComponent(page.page)}`)}
                        title="View visitors" style={{ width:30,height:30,borderRadius:9,border:'none',cursor:'pointer',background:'transparent',display:'flex',alignItems:'center',justifyContent:'center',color:C.textMuted,transition:'background 0.15s' }}>
                        <Eye size={14}/>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Insights */}
      {pages.length > 0 && (
        <Card>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
            <div style={{ width:38,height:38,borderRadius:12,background:`linear-gradient(135deg,${C.base},${C.light})`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 5px 12px ${C.shadowMd}` }}>
              <Eye size={18} color="#fff"/>
            </div>
            <h3 style={{ color:C.text, fontSize:16, fontWeight:800, margin:0 }}>Quick Insights</h3>
          </div>
          <div className="insight-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12 }}>
            {[
              { label:'Most Popular Page', value:pages[0]?.page?.split('/').pop()||'/', sub:`${pages[0]?.visits?.toLocaleString()} visits` },
              { label:'Avg. Visits / Page', value:avg.toLocaleString(), sub:'across all pages' },
              { label:'Top 3 Share', value:`${top3Share}%`, sub:'of all traffic' },
            ].map(({ label, value, sub }) => (
              <div key={label} style={{ background:C.surfaceHigh, borderRadius:14, padding:'16px 14px', border:`1px solid ${C.border}` }}>
                <p style={{ color:C.textMuted, fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:0.8, margin:0 }}>{label}</p>
                <p style={{ color:C.base, fontSize:22, fontWeight:900, margin:'6px 0 3px' }}>{value}</p>
                <p style={{ color:C.textSub, fontSize:11, fontWeight:600, margin:0 }}>{sub}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default TopPages;