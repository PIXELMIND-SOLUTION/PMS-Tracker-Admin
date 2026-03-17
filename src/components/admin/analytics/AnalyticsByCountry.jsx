import React, { useEffect, useState } from 'react';
import { visitorApi } from '../../../api/visitorApi';
import { Globe, Users } from 'lucide-react';

const C = {
  base:'#0D9488', light:'#14B8A6', lighter:'#2DD4BF', lightest:'#CCFBF1',
  bg:'#F0FDFA', surface:'#FFFFFF', surfaceHigh:'#E6FAF8', surfaceHigher:'#CCFBF1',
  border:'rgba(13,148,136,0.12)', text:'#134E4A', textMuted:'#0F766E', textSub:'#5EEAD4',
  shadow:'rgba(13,148,136,0.18)', shadowMd:'rgba(13,148,136,0.25)', shadowLg:'rgba(13,148,136,0.35)',
  chart: ['#14B8A6','#0D9488','#2DD4BF','#0F766E','#5EEAD4','#115E59','#99F6E4','#134E4A','#2DD4BF','#14B8A6'],
};

const Card = ({ children, style = {} }) => (
  <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, boxShadow:`0 6px 20px ${C.shadow}, inset 0 1px 1px rgba(255,255,255,0.9)`, padding:22, ...style }}>
    {children}
  </div>
);

const MOCK_DATA = [
  { country:'United States', count:4821, flag:'🇺🇸' },
  { country:'United Kingdom', count:2340, flag:'🇬🇧' },
  { country:'Germany',        count:1890, flag:'🇩🇪' },
  { country:'France',         count:1540, flag:'🇫🇷' },
  { country:'Japan',          count:1280, flag:'🇯🇵' },
  { country:'India',          count:1120, flag:'🇮🇳' },
  { country:'Canada',         count:980, flag:'🇨🇦' },
  { country:'Australia',      count:870, flag:'🇦🇺' },
  { country:'Brazil',         count:720, flag:'🇧🇷' },
  { country:'Netherlands',    count:590, flag:'🇳🇱' },
];

const AnalyticsByCountry = () => {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [hovRow, setHovRow]   = useState(null);

  useEffect(() => {
    if (visitorApi?.getAnalyticsByCountry) {
      visitorApi.getAnalyticsByCountry()
        .then(res => setData(res.data))
        .catch(() => setData(MOCK_DATA))
        .finally(() => setLoading(false));
    } else {
      setTimeout(() => { setData(MOCK_DATA); setLoading(false); }, 500);
    }
  }, []);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:220, fontFamily:"'Nunito',sans-serif" }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:48,height:48,borderRadius:'50%',border:`4px solid ${C.surfaceHigher}`,borderTopColor:C.base,animation:'spin 0.9s linear infinite',margin:'0 auto 12px' }}/>
        <p style={{ color:C.textMuted, fontSize:14, fontWeight:600 }}>Loading country data…</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const total      = data.reduce((s, d) => s + d.count, 0);
  const topCountries = data.slice(0, 10);
  const topItem    = topCountries[0];

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", display:'flex', flexDirection:'column', gap:20 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes growW{from{width:0}to{}}
        .ct-row{animation:fadeUp 0.3s ease both;transition:background 0.12s;}
        .ct-row:hover{background:var(--c-high,#E6FAF8)!important;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-thumb{background:#2DD4BF;border-radius:10px;}
        @media(max-width:480px){.stat-summary{grid-template-columns:1fr!important;}.col-bar{display:none!important;}}
      `}</style>

      <div>
        <h2 style={{ color:C.text, fontSize:'clamp(20px,3.5vw,26px)', fontWeight:900, margin:0 }}>Visitors by Country</h2>
        <p style={{ color:C.textMuted, fontSize:14, marginTop:5 }}>Geographic distribution of your website traffic</p>
      </div>

      {/* Summary stat cards */}
      <div className="stat-summary" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14 }}>
        {[
          { icon:Globe, label:'Countries Tracked', value:data.length, sub:null },
          { icon:Users, label:'Total Visits', value:total.toLocaleString(), sub:null },
          { icon:Globe, label:'Top Country', value:topItem?.flag ? `${topItem.flag} ${topItem.country}` : topItem?.country || 'N/A', sub:`${topItem?.count?.toLocaleString() || 0} visits` },
        ].map(({ icon:Icon, label, value, sub }) => (
          <div key={label} style={{
            background:C.surface, borderRadius:18, padding:'18px 16px',
            border:`1px solid ${C.border}`,
            boxShadow:`0 6px 20px ${C.shadow}, inset 0 1px 1px rgba(255,255,255,0.9)`,
            position:'relative', overflow:'hidden',
          }}>
            <div style={{ position:'absolute',top:-25,right:-25,width:80,height:80,borderRadius:'50%',background:`radial-gradient(circle,${C.surfaceHigher},transparent 70%)`,pointerEvents:'none' }}/>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${C.base},${C.light})`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 5px 12px ${C.shadowMd}`,flexShrink:0 }}>
                <Icon size={18} color="#fff"/>
              </div>
              <div style={{ minWidth:0 }}>
                <p style={{ color:C.textMuted, fontSize:11, fontWeight:700, margin:0, textTransform:'uppercase', letterSpacing:0.6 }}>{label}</p>
                <p style={{ color:C.base, fontSize:18, fontWeight:900, margin:'4px 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{value}</p>
                {sub && <p style={{ color:C.textSub, fontSize:11, fontWeight:600, margin:0 }}>{sub}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Country list card */}
      <Card>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
          <div style={{ width:38,height:38,borderRadius:12,background:`linear-gradient(135deg,${C.base},${C.light})`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 5px 12px ${C.shadowMd}` }}>
            <Globe size={18} color="#fff"/>
          </div>
          <div>
            <h3 style={{ color:C.text, fontSize:16, fontWeight:800, margin:0 }}>Top Countries</h3>
            <p style={{ color:C.textMuted, fontSize:12, margin:0 }}>Ranked by visit count</p>
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          {topCountries.map((item, i) => {
            const pct = total ? ((item.count / total) * 100) : 0;
            const hov = hovRow === i;
            return (
              <div key={item.country} className="ct-row" style={{
                display:'flex', alignItems:'center', gap:10, flexWrap:'nowrap',
                padding:'11px 12px', borderRadius:12,
                background: hov ? C.surfaceHigh : 'transparent',
                animationDelay:`${i*0.05}s`,
              }}
                onMouseEnter={() => setHovRow(i)} onMouseLeave={() => setHovRow(null)}>
                {/* Rank */}
                <span style={{ width:22, textAlign:'center', color:i<3?C.base:C.textMuted, fontSize:11, fontWeight:800, flexShrink:0 }}>
                  {i<3 ? ['🥇','🥈','🥉'][i] : `#${i+1}`}
                </span>
                {/* Flag */}
                <span style={{ fontSize:18, flexShrink:0 }}>{item.flag || '🌍'}</span>
                {/* Country name */}
                <span style={{ flex:1, color:C.text, fontSize:13, fontWeight:700, minWidth:80, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {item.country || 'Unknown'}
                </span>
                {/* Bar */}
                <div className="col-bar" style={{ width:'clamp(60px,20vw,160px)', height:8, borderRadius:8, background:C.surfaceHigher, overflow:'hidden', flexShrink:0 }}>
                  <div style={{
                    height:'100%', borderRadius:8,
                    width:`${pct}%`,
                    background:`linear-gradient(90deg,${C.chart[i%C.chart.length]},${C.chart[(i+1)%C.chart.length]})`,
                    transition:'width 0.8s ease',
                  }}/>
                </div>
                {/* Count */}
                <span style={{ color:C.text, fontSize:13, fontWeight:800, width:50, textAlign:'right', flexShrink:0 }}>{item.count.toLocaleString()}</span>
                {/* Pct badge */}
                <span style={{ background:C.surfaceHigher, color:C.base, fontSize:11, fontWeight:800, padding:'3px 8px', borderRadius:20, flexShrink:0, minWidth:36, textAlign:'center' }}>
                  {pct.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsByCountry;