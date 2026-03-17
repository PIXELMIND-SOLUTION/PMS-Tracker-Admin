import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { visitorApi } from '../../api/visitorApi';
import { formatDate, formatTimeAgo } from '../../utils/helpers';
import { ExternalLink, Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const C = {
  base:'#0D9488', light:'#14B8A6', lighter:'#2DD4BF', lightest:'#CCFBF1',
  bg:'#F0FDFA', surface:'#FFFFFF', surfaceHigh:'#E6FAF8', surfaceHigher:'#CCFBF1',
  border:'rgba(13,148,136,0.12)', text:'#134E4A', textMuted:'#0F766E', textSub:'#5EEAD4',
  shadow:'rgba(13,148,136,0.18)', shadowMd:'rgba(13,148,136,0.25)',
  chart:['#14B8A6','#0D9488','#2DD4BF','#0F766E','#5EEAD4','#115E59'],
};

const Card = ({ children, style = {} }) => (
  <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, boxShadow:`0 6px 20px ${C.shadow}, inset 0 1px 1px rgba(255,255,255,0.9)`, padding:22, ...style }}>
    {children}
  </div>
);

const DEVICE_COLORS = { mobile:'#8B5CF6', desktop:C.base, tablet:'#F59E0B' };
const MOCK_VISITORS = Array.from({ length: 8 }, (_, i) => ({
  _id: `id_${i}`, ip:`192.168.${i}.${i*3+1}`, browser:['Chrome','Safari','Firefox','Edge'][i%4],
  os:['Windows','macOS','iOS','Android'][i%4], device:['desktop','mobile','tablet'][i%3],
  city:['Mumbai','Delhi','Hyderabad','Pune'][i%4], country:'India',
  page:['/home','/about','/products','/contact'][i%4],
  createdAt: new Date(Date.now() - i * 3600000).toISOString(),
}));
const MOCK_PAGINATION = { totalItems:128, currentPage:1, totalPages:6 };

const VisitorsPage = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors]     = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading]       = useState(true);
  const [filters, setFilters]       = useState({ page:1, limit:25 });
  const [hovRow, setHovRow]         = useState(null);

  const fetchVisitors = async (params = {}) => {
    setLoading(true);
    try {
      const res = await visitorApi.getVisitors({ page: params.page || filters.page, limit: params.limit || filters.limit });
      setVisitors(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      setVisitors(MOCK_VISITORS);
      setPagination(MOCK_PAGINATION);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVisitors(); }, [filters.page, filters.limit]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters(f => ({ ...f, page: newPage }));
      window.scrollTo({ top:0, behavior:'smooth' });
    }
  };

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", display:'flex', flexDirection:'column', gap:24 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .vp-row{animation:fadeUp 0.3s ease both;transition:background 0.12s,box-shadow 0.12s;}
        .vp-row:hover{background:${C.surfaceHigh}!important;}
        .vp-btn:hover{background:${C.surfaceHigh}!important;border-color:${C.lighter}!important;}
        .vp-sel:focus{outline:none;border-color:${C.base}!important;box-shadow:0 0 0 3px rgba(13,148,136,0.15)!important;}
        .vp-page-btn:hover{background:${C.surfaceHigh}!important;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-thumb{background:${C.lighter};border-radius:10px;}
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:12 }}>
        <div>
          <h2 style={{ color:C.text, fontSize:'clamp(20px,3.5vw,26px)', fontWeight:900, margin:0 }}>All Visitors</h2>
          <p style={{ color:C.textMuted, fontSize:14, marginTop:5 }}>
            {pagination.totalItems || 0} total visitors · Page {pagination.currentPage || 1} of {pagination.totalPages || 1}
          </p>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <button className="vp-btn" onClick={() => navigate('/visitors/search')}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, color:C.text, fontSize:13, fontWeight:700, cursor:'pointer' }}>
            <Search size={15} color={C.textMuted}/> Search
          </button>
          <select className="vp-sel" value={filters.limit}
            onChange={(e) => setFilters(f => ({ ...f, limit:Number(e.target.value), page:1 }))}
            style={{ padding:'9px 14px', border:`1px solid ${C.border}`, borderRadius:12, fontSize:13, fontWeight:700, color:C.text, background:C.surface, cursor:'pointer' }}>
            {[10,25,50,100].map(n => <option key={n} value={n}>{n} / page</option>)}
          </select>
        </div>
      </div>

      {/* Table Card */}
      <Card style={{ padding:0, overflow:'hidden' }}>
        {loading ? (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:220 }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ width:40,height:40,borderRadius:'50%',border:`4px solid ${C.surfaceHigher}`,borderTopColor:C.base,animation:'spin 0.9s linear infinite',margin:'0 auto 10px' }}/>
              <p style={{ color:C.textMuted, fontSize:13, fontWeight:600 }}>Loading visitors…</p>
            </div>
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:C.bg, borderBottom:`1px solid ${C.border}` }}>
                  {['IP Address','Browser','Device','Location','Page','Visited',''].map((h, i) => (
                    <th key={i} style={{ padding:'12px 16px', textAlign:'left', color:C.textMuted, fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visitors.map((v, i) => (
                  <tr key={v._id} className="vp-row"
                    style={{ borderBottom:`1px solid ${C.border}`, background:hovRow===i ? C.surfaceHigh : 'transparent', animationDelay:`${i*0.04}s` }}
                    onMouseEnter={() => setHovRow(i)} onMouseLeave={() => setHovRow(null)}>
                    {/* IP */}
                    <td style={{ padding:'12px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <code style={{ fontSize:12, background:C.bg, border:`1px solid ${C.border}`, padding:'3px 8px', borderRadius:8, fontFamily:'monospace', color:C.text, fontWeight:700 }}>{v.ip}</code>
                        <button onClick={() => navigate(`/visitors/ip-lookup?ip=${v.ip}`)}
                          style={{ padding:4, background:'none', border:'none', cursor:'pointer', borderRadius:6, color:C.textMuted }}>
                          <ExternalLink size={13}/>
                        </button>
                      </div>
                    </td>
                    {/* Browser */}
                    <td style={{ padding:'12px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <span style={{ color:C.text, fontSize:13, fontWeight:700 }}>{v.browser}</span>
                        <span style={{ padding:'2px 8px', borderRadius:20, background:C.surfaceHigher, color:C.base, fontSize:10, fontWeight:800 }}>{v.os}</span>
                      </div>
                    </td>
                    {/* Device */}
                    <td style={{ padding:'12px 16px' }}>
                      <span style={{ padding:'3px 10px', borderRadius:20, background: v.device==='mobile' ? 'rgba(139,92,246,0.12)' : C.surfaceHigher, color: DEVICE_COLORS[v.device] || C.base, fontSize:11, fontWeight:800, textTransform:'capitalize' }}>
                        {v.device}
                      </span>
                    </td>
                    {/* Location */}
                    <td style={{ padding:'12px 16px', color:C.text, fontSize:13, fontWeight:600 }}>
                      {v.city ? `${v.city}, ` : ''}{v.country || 'Unknown'}
                    </td>
                    {/* Page */}
                    <td style={{ padding:'12px 16px', maxWidth:160 }}>
                      <span style={{ color:C.textMuted, fontSize:13, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', display:'block' }} title={v.page}>
                        {v.page?.split('/').pop() || '/'}
                      </span>
                    </td>
                    {/* Visited */}
                    <td style={{ padding:'12px 16px' }}>
                      <div style={{ color:C.text, fontSize:12, fontWeight:700 }}>{formatTimeAgo?.(v.createdAt) ?? 'Just now'}</div>
                      <div style={{ color:C.textMuted, fontSize:11, marginTop:2 }}>{formatDate?.(v.createdAt, { time:false }) ?? v.createdAt?.slice(0,10)}</div>
                    </td>
                    {/* Action */}
                    <td style={{ padding:'12px 16px' }}>
                      <button onClick={() => navigate(`/visitors/${v._id}`)}
                        style={{ padding:'6px 8px', background:'none', border:`1px solid ${C.border}`, borderRadius:10, cursor:'pointer', color:C.textMuted, display:'flex', alignItems:'center' }}>
                        <Eye size={15}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{ padding:'14px 20px', borderTop:`1px solid ${C.border}`, display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:12 }}>
            <span style={{ color:C.textMuted, fontSize:13, fontWeight:600 }}>
              Showing {(pagination.currentPage-1)*filters.limit+1}–{Math.min(pagination.currentPage*filters.limit, pagination.totalItems)} of {pagination.totalItems}
            </span>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <button onClick={() => handlePageChange(pagination.currentPage-1)} disabled={pagination.currentPage===1}
                style={{ display:'flex', alignItems:'center', padding:'6px 12px', border:`1px solid ${C.border}`, borderRadius:10, background:C.surface, color:C.text, fontSize:13, fontWeight:700, cursor:pagination.currentPage===1?'not-allowed':'pointer', opacity:pagination.currentPage===1?0.4:1 }}>
                <ChevronLeft size={15}/> Prev
              </button>
              {Array.from({ length:Math.min(5, pagination.totalPages) }, (_, i) => {
                const pg = pagination.currentPage <= 3 ? i+1
                  : pagination.currentPage >= pagination.totalPages-2 ? pagination.totalPages-4+i
                  : pagination.currentPage-2+i;
                if (pg < 1 || pg > pagination.totalPages) return null;
                const active = pagination.currentPage === pg;
                return (
                  <button key={pg} className={active ? '' : 'vp-page-btn'} onClick={() => handlePageChange(pg)}
                    style={{ width:34, height:34, borderRadius:10, border:`1px solid ${active?C.base:C.border}`, background:active?C.base:C.surface, color:active?'#fff':C.text, fontSize:13, fontWeight:800, cursor:'pointer' }}>
                    {pg}
                  </button>
                );
              })}
              <button onClick={() => handlePageChange(pagination.currentPage+1)} disabled={pagination.currentPage===pagination.totalPages}
                style={{ display:'flex', alignItems:'center', padding:'6px 12px', border:`1px solid ${C.border}`, borderRadius:10, background:C.surface, color:C.text, fontSize:13, fontWeight:700, cursor:pagination.currentPage===pagination.totalPages?'not-allowed':'pointer', opacity:pagination.currentPage===pagination.totalPages?0.4:1 }}>
                Next <ChevronRight size={15}/>
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default VisitorsPage;