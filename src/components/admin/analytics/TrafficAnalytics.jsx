import React, { useEffect, useState } from 'react';
import { visitorApi } from '../../../api/visitorApi';
import { Monitor, Smartphone, Tablet, Laptop } from 'lucide-react';

// ─── Clay Teal Tokens ────────────────────────────────────────────────────────
const C = {
  base:'#0D9488', light:'#14B8A6', lighter:'#2DD4BF', lightest:'#CCFBF1',
  bg:'#F0FDFA', surface:'#FFFFFF', surfaceHigh:'#E6FAF8', surfaceHigher:'#CCFBF1',
  border:'rgba(13,148,136,0.12)', text:'#134E4A', textMuted:'#0F766E', textSub:'#5EEAD4',
  shadow:'rgba(13,148,136,0.18)', shadowMd:'rgba(13,148,136,0.25)', shadowLg:'rgba(13,148,136,0.35)',
};

const Card = ({ children, style = {} }) => (
  <div style={{
    background: C.surface, borderRadius: 20, border: `1px solid ${C.border}`,
    boxShadow: `0 6px 20px ${C.shadow}, inset 0 1px 1px rgba(255,255,255,0.9)`,
    padding: 22, ...style,
  }}>{children}</div>
);

const SectionIconBox = ({ icon: Icon, grad }) => (
  <div style={{
    width: 52, height: 52, borderRadius: 16, flexShrink: 0,
    background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: `0 6px 16px ${C.shadowMd}`, margin: '0 auto 12px',
  }}>
    <Icon size={24} color="#fff" />
  </div>
);

const DEVICE_META = {
  mobile:  { icon: Smartphone, grad: `linear-gradient(135deg,${C.light},${C.lighter})`, label: 'Mobile' },
  tablet:  { icon: Tablet,     grad: `linear-gradient(135deg,${C.base},${C.light})`,    label: 'Tablet' },
  desktop: { icon: Monitor,    grad: `linear-gradient(135deg,#0F766E,${C.base})`,        label: 'Desktop' },
  unknown: { icon: Laptop,     grad: `linear-gradient(135deg,#5EEAD4,${C.light})`,       label: 'Unknown' },
};

// Mock data for preview when API isn't available
const MOCK_DATA = [
  { device: 'desktop', count: 4521 },
  { device: 'mobile',  count: 3840 },
  { device: 'tablet',  count: 1280 },
  { device: 'unknown', count: 359  },
];

const AnalyticsByDevice = () => {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [hovRow, setHovRow]   = useState(null);

  useEffect(() => {
    if (visitorApi?.getAnalyticsByDevice) {
      visitorApi.getAnalyticsByDevice()
        .then(res => setData(res.data))
        .catch(err => { setError(err.message); setData(MOCK_DATA); })
        .finally(() => setLoading(false));
    } else {
      setTimeout(() => { setData(MOCK_DATA); setLoading(false); }, 600);
    }
  }, []);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:220, fontFamily:"'Nunito',sans-serif" }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:48,height:48,borderRadius:'50%',border:`4px solid ${C.surfaceHigher}`,borderTopColor:C.base,animation:'spin 0.9s linear infinite',margin:'0 auto 12px' }}/>
        <p style={{ color:C.textMuted, fontSize:14, fontWeight:600 }}>Loading device data…</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const total = data.reduce((s, d) => s + d.count, 0);
  const sorted = [...data].sort((a, b) => b.count - a.count);

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", display:'flex', flexDirection:'column', gap:20 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .dev-card{animation:fadeUp 0.35s ease both;}
        .dev-card:hover{transform:translateY(-3px)!important;box-shadow:0 12px 32px rgba(13,148,136,0.25),inset 0 1px 1px rgba(255,255,255,0.9)!important;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-thumb{background:var(--c-lighter,#2DD4BF);border-radius:10px;}
        @media(max-width:480px){.stat-grid{grid-template-columns:1fr 1fr!important;}.table-browser,.table-os{display:none;}}
        @media(max-width:360px){.stat-grid{grid-template-columns:1fr!important;}}
      `}</style>

      {/* Page header */}
      <div>
        <h2 style={{ color:C.text, fontSize:'clamp(20px,3.5vw,26px)', fontWeight:900, margin:0 }}>Visitors by Device</h2>
        <p style={{ color:C.textMuted, fontSize:14, marginTop:5 }}>Distribution of traffic across device categories</p>
      </div>

      {/* Stat cards */}
      <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14 }}>
        {sorted.map((item, i) => {
          const meta = DEVICE_META[item.device] || DEVICE_META.unknown;
          const pct  = total ? Math.round((item.count / total) * 100) : 0;
          return (
            <div key={item.device} className="dev-card" style={{
              background: C.surface, borderRadius: 20, padding: '20px 16px', textAlign:'center',
              border: `1px solid ${C.border}`,
              boxShadow: `0 6px 20px ${C.shadow}, inset 0 1px 1px rgba(255,255,255,0.9)`,
              transition:'transform 0.2s ease,box-shadow 0.2s ease',
              animationDelay:`${i*0.08}s`, position:'relative', overflow:'hidden',
            }}>
              <div style={{ position:'absolute',top:-30,right:-30,width:90,height:90,borderRadius:'50%',background:`radial-gradient(circle,${C.surfaceHigher},transparent 70%)`,pointerEvents:'none' }}/>
              <SectionIconBox icon={meta.icon} grad={meta.grad} />
              <h3 style={{ color:C.text, fontSize:15, fontWeight:800, margin:'0 0 6px', textTransform:'capitalize' }}>{item.device || 'Unknown'}</h3>
              <p style={{ color:C.base, fontSize:28, fontWeight:900, margin:'0 0 3px' }}>{item.count.toLocaleString()}</p>
              <p style={{ color:C.textMuted, fontSize:12, fontWeight:600, margin:'0 0 12px' }}>{pct}% of total</p>
              <div style={{ height:8, borderRadius:8, background:C.surfaceHigher, overflow:'hidden' }}>
                <div style={{ height:'100%', borderRadius:8, width:`${pct}%`, background:meta.grad, transition:'width 1s ease' }}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <Card>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
          <div style={{ width:38,height:38,borderRadius:12,background:`linear-gradient(135deg,${C.base},${C.light})`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 5px 12px ${C.shadowMd}` }}>
            <Monitor size={18} color="#fff"/>
          </div>
          <h3 style={{ color:C.text, fontSize:16, fontWeight:800, margin:0 }}>Device Breakdown</h3>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', minWidth:420, borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:C.surfaceHigh }}>
                {['Device','Visits','Share','Trend'].map(h => (
                  <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:10, fontWeight:800, color:C.textMuted, textTransform:'uppercase', letterSpacing:0.8, whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((item, i) => {
                const meta = DEVICE_META[item.device] || DEVICE_META.unknown;
                const pct  = total ? ((item.count / total) * 100).toFixed(1) : 0;
                const hov  = hovRow === i;
                return (
                  <tr key={item.device} style={{ borderBottom:`1px solid ${C.border}`, background: hov ? C.surfaceHigh : 'transparent', transition:'background 0.12s' }}
                    onMouseEnter={() => setHovRow(i)} onMouseLeave={() => setHovRow(null)}>
                    <td style={{ padding:'12px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:30,height:30,borderRadius:9,background:meta.grad,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 3px 8px ${C.shadowMd}`,flexShrink:0 }}>
                          <meta.icon size={14} color="#fff"/>
                        </div>
                        <span style={{ color:C.text, fontSize:13, fontWeight:700, textTransform:'capitalize' }}>{item.device || 'Unknown'}</span>
                      </div>
                    </td>
                    <td style={{ padding:'12px 16px', color:C.text, fontSize:13, fontWeight:800 }}>{item.count.toLocaleString()}</td>
                    <td style={{ padding:'12px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ flex:1, minWidth:60, maxWidth:100, height:7, borderRadius:7, background:C.surfaceHigher, overflow:'hidden' }}>
                          <div style={{ height:'100%', borderRadius:7, width:`${pct}%`, background:meta.grad }}/>
                        </div>
                        <span style={{ color:C.textMuted, fontSize:12, fontWeight:700, whiteSpace:'nowrap' }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding:'12px 16px' }}>
                      <span style={{ display:'inline-flex', alignItems:'center', gap:4, background:C.surfaceHigher, color:C.base, fontSize:11, fontWeight:800, padding:'4px 10px', borderRadius:20 }}>
                        ↑ 12%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsByDevice;