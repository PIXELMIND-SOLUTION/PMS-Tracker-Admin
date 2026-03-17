import React, { useEffect, useState } from 'react';
import { visitorApi } from '../../../api/visitorApi';
import { Globe } from 'lucide-react';

const C = {
  base:'#0D9488', light:'#14B8A6', lighter:'#2DD4BF', lightest:'#CCFBF1',
  bg:'#F0FDFA', surface:'#FFFFFF', surfaceHigh:'#E6FAF8', surfaceHigher:'#CCFBF1',
  border:'rgba(13,148,136,0.12)', text:'#134E4A', textMuted:'#0F766E', textSub:'#5EEAD4',
  shadow:'rgba(13,148,136,0.18)', shadowMd:'rgba(13,148,136,0.25)', shadowLg:'rgba(13,148,136,0.35)',
  chart: ['#14B8A6','#0D9488','#2DD4BF','#0F766E','#5EEAD4','#115E59','#99F6E4'],
};

const Card = ({ children, style = {} }) => (
  <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, boxShadow:`0 6px 20px ${C.shadow}, inset 0 1px 1px rgba(255,255,255,0.9)`, padding:22, ...style }}>
    {children}
  </div>
);

const BROWSER_ICONS = { Chrome:'🟢', Firefox:'🦊', Safari:'🧭', Edge:'🔷', Opera:'🔴', Samsung:'📱' };
const MOCK_DATA = [
  { browser:'Chrome',  count:5840 },
  { browser:'Safari',  count:2310 },
  { browser:'Firefox', count:1250 },
  { browser:'Edge',    count:890 },
  { browser:'Opera',   count:420 },
  { browser:'Samsung', count:290 },
];

const AnalyticsByBrowser = () => {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [hovRow, setHovRow]   = useState(null);

  useEffect(() => {
    if (visitorApi?.getAnalyticsByBrowser) {
      visitorApi.getAnalyticsByBrowser()
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
        <p style={{ color:C.textMuted, fontSize:14, fontWeight:600 }}>Loading browser data…</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const total  = data.reduce((s, d) => s + d.count, 0);
  const sorted = [...data].sort((a, b) => b.count - a.count);

  // SVG donut data
  const r = 60, cx = 80, cy = 80, circ = 2 * Math.PI * r;
  let cumPct = 0;
  const segments = sorted.map((item, i) => {
    const pct     = total ? item.count / total : 0;
    const offset  = circ * (1 - cumPct);
    const dash    = circ * pct;
    cumPct += pct;
    return { ...item, pct, offset, dash, color: C.chart[i % C.chart.length] };
  });

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", display:'flex', flexDirection:'column', gap:20 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .br-row{animation:fadeUp 0.3s ease both;transition:background 0.12s;}
        .br-row:hover{background:var(--c-high,#E6FAF8)!important;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-thumb{background:#2DD4BF;border-radius:10px;}
      `}</style>

      <div>
        <h2 style={{ color:C.text, fontSize:'clamp(20px,3.5vw,26px)', fontWeight:900, margin:0 }}>Visitors by Browser</h2>
        <p style={{ color:C.textMuted, fontSize:14, marginTop:5 }}>Browser usage statistics for your audience</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
        {/* Donut card */}
        <Card>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
            <div style={{ width:38,height:38,borderRadius:12,background:`linear-gradient(135deg,${C.base},${C.light})`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 5px 12px ${C.shadowMd}` }}>
              <Globe size={18} color="#fff"/>
            </div>
            <h3 style={{ color:C.text, fontSize:16, fontWeight:800, margin:0 }}>Browser Distribution</h3>
          </div>
          <div style={{ display:'flex', justifyContent:'center' }}>
            <svg viewBox="0 0 160 160" style={{ width:'clamp(140px,40vw,180px)', height:'clamp(140px,40vw,180px)' }}>
              {/* Background ring */}
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.surfaceHigher} strokeWidth="18"/>
              {/* Segments */}
              {segments.map((seg, i) => (
                <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                  stroke={seg.color} strokeWidth="18"
                  strokeDasharray={`${seg.dash} ${circ - seg.dash}`}
                  strokeDashoffset={seg.offset}
                  style={{ transform:'rotate(-90deg)', transformOrigin:`${cx}px ${cy}px`, transition:'stroke-dasharray 0.6s ease' }}
                />
              ))}
              {/* Center label */}
              <text x={cx} y={cy-6} textAnchor="middle" style={{ fill:C.text, fontSize:18, fontWeight:900, fontFamily:"'Nunito',sans-serif" }}>
                {sorted.length}
              </text>
              <text x={cx} y={cy+12} textAnchor="middle" style={{ fill:C.textMuted, fontSize:10, fontWeight:700, fontFamily:"'Nunito',sans-serif" }}>
                Browsers
              </text>
            </svg>
          </div>
          {/* Legend */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 14px', marginTop:14, justifyContent:'center' }}>
            {segments.slice(0,4).map((seg, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:seg.color, flexShrink:0 }}/>
                <span style={{ color:C.textMuted, fontSize:11, fontWeight:600 }}>{seg.browser}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Stats list card */}
        <Card>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
            <div style={{ width:38,height:38,borderRadius:12,background:`linear-gradient(135deg,${C.base},${C.light})`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 5px 12px ${C.shadowMd}` }}>
              <Globe size={18} color="#fff"/>
            </div>
            <h3 style={{ color:C.text, fontSize:16, fontWeight:800, margin:0 }}>Browser Stats</h3>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
            {sorted.map((item, i) => {
              const pct = total ? Math.round((item.count / total) * 100) : 0;
              const hov = hovRow === i;
              return (
                <div key={item.browser} className="br-row" style={{
                  display:'flex', alignItems:'center', gap:10,
                  padding:'10px 12px', borderRadius:12,
                  background: hov ? C.surfaceHigh : 'transparent',
                  animationDelay:`${i*0.06}s`,
                }}
                  onMouseEnter={() => setHovRow(i)} onMouseLeave={() => setHovRow(null)}>
                  <span style={{ width:20, textAlign:'center', color:C.textMuted, fontSize:11, fontWeight:700, flexShrink:0 }}>#{i+1}</span>
                  <span style={{ fontSize:18, flexShrink:0 }}>{BROWSER_ICONS[item.browser] || '🌐'}</span>
                  <span style={{ flex:1, color:C.text, fontSize:13, fontWeight:700, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.browser || 'Unknown'}</span>
                  <div style={{ width:'clamp(50px,15vw,100px)', height:7, borderRadius:7, background:C.surfaceHigher, overflow:'hidden', flexShrink:0 }}>
                    <div style={{ height:'100%', borderRadius:7, width:`${pct}%`, background:`linear-gradient(90deg,${C.chart[i%C.chart.length]},${C.chart[(i+1)%C.chart.length]})`, transition:'width 0.8s ease' }}/>
                  </div>
                  <span style={{ color:C.text, fontSize:12, fontWeight:800, width:46, textAlign:'right', flexShrink:0 }}>{item.count.toLocaleString()}</span>
                  <span style={{ color:C.textMuted, fontSize:11, fontWeight:700, width:30, textAlign:'right', flexShrink:0 }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsByBrowser;