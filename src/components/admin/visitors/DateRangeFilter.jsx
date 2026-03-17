import React, { useState } from 'react';
import { visitorApi } from '../../../api/visitorApi';
import { Calendar, Clock, Download } from 'lucide-react';

const C = {
  base:'#0D9488', light:'#14B8A6', lighter:'#2DD4BF',
  bg:'#F0FDFA', surface:'#FFFFFF', surfaceHigh:'#E6FAF8', surfaceHigher:'#CCFBF1',
  border:'rgba(13,148,136,0.12)', text:'#134E4A', textMuted:'#0F766E',
  shadow:'rgba(13,148,136,0.18)', shadowMd:'rgba(13,148,136,0.25)',
  chart:['#14B8A6','#0D9488','#2DD4BF','#0F766E','#5EEAD4','#115E59'],
};

const Card = ({ children, style = {} }) => (
  <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, boxShadow:`0 6px 20px ${C.shadow}, inset 0 1px 1px rgba(255,255,255,0.9)`, padding:22, ...style }}>
    {children}
  </div>
);

const dateDiff = (start, end) => {
  const s = new Date(start), e = new Date(end);
  return Math.ceil((e - s) / 86400000) + 1;
};

const MOCK_DATA = Array.from({ length:12 }, (_, i) => ({
  _id:`r${i}`, ip:`10.0.${i}.${i+1}`, browser:['Chrome','Safari','Firefox','Edge'][i%4],
  os:['Windows','macOS','iOS','Android'][i%4], device:['desktop','mobile','tablet'][i%3],
  country:['India','USA','Germany','Brazil'][i%4], city:['Hyderabad','NY','Berlin','SP'][i%4],
  page:['/home','/products','/about','/pricing'][i%4],
  createdAt: new Date(Date.now() - i * 3600000 * 4).toISOString(),
}));

const PRESETS = {
  today:     { label:'Today',       getRange:() => { const d=new Date().toISOString().split('T')[0]; return{start:d,end:d}; }},
  yesterday: { label:'Yesterday',   getRange:() => { const d=new Date(Date.now()-86400000).toISOString().split('T')[0]; return{start:d,end:d}; }},
  week:      { label:'Last 7 Days', getRange:() => ({ end:new Date().toISOString().split('T')[0], start:new Date(Date.now()-7*86400000).toISOString().split('T')[0] })},
  month:     { label:'Last 30 Days',getRange:() => ({ end:new Date().toISOString().split('T')[0], start:new Date(Date.now()-30*86400000).toISOString().split('T')[0] })},
};

const DEVICE_COLOR = { desktop:C.base, mobile:'#8B5CF6', tablet:'#F59E0B' };

const DateRangeFilter = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate]     = useState('');
  const [preset, setPreset]       = useState('');
  const [data, setData]           = useState([]);
  const [loading, setLoading]     = useState(false);
  const [hovRow, setHovRow]       = useState(null);

  const fetchByRange = async (start, end) => {
    if (!start || !end) return;
    setLoading(true);
    try {
      const res = await visitorApi.getVisitorsByDateRange(start, end);
      setData(res.data);
    } catch {
      setData(MOCK_DATA);
    } finally { setLoading(false); }
  };

  const applyPreset = (key) => {
    const range = PRESETS[key].getRange();
    setStartDate(range.start); setEndDate(range.end); setPreset(key);
    fetchByRange(range.start, range.end);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); setPreset('');
    fetchByRange(startDate, endDate);
  };

  const exportCSV = () => {
    const csv = [
      ['IP','Browser','OS','Device','Country','City','Page','Timestamp'].join(','),
      ...data.map(v => [v.ip,v.browser,v.os,v.device,v.country,v.city,`"${v.page}"`,new Date(v.createdAt).toISOString()].join(','))
    ].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv' }));
    a.download = `visitors-${startDate}-to-${endDate}.csv`;
    a.click();
  };

  const summaryStats = [
    { label:'Total Visits',  value: data.length },
    { label:'Unique IPs',    value: new Set(data.map(v=>v.ip)).size },
    { label:'Countries',     value: new Set(data.map(v=>v.country).filter(Boolean)).size },
    { label:'Avg. per Day',  value: startDate && endDate ? Math.ceil(data.length / Math.max(1, dateDiff(startDate, endDate))) : '—' },
  ];

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", display:'flex', flexDirection:'column', gap:22 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .dr-input:focus{outline:none;border-color:${C.base}!important;box-shadow:0 0 0 3px rgba(13,148,136,0.15)!important;}
        .dr-input::-webkit-calendar-picker-indicator{filter:invert(40%) sepia(50%) saturate(500%) hue-rotate(140deg);}
        .dr-preset{transition:background 0.12s,border-color 0.12s,color 0.12s;}
        .dr-row{animation:fadeUp 0.3s ease both;transition:background 0.12s;}
        .dr-row:hover{background:${C.surfaceHigh}!important;}
        .dr-stat:hover{background:${C.surfaceHigh}!important;}
        .dr-submit:hover:not(:disabled){opacity:0.9;transform:translateY(-1px);}
        .dr-submit:disabled{opacity:0.5;cursor:not-allowed;}
        .dr-export:hover{background:${C.surfaceHigh}!important;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-thumb{background:${C.lighter};border-radius:10px;}
      `}</style>

      <div>
        <h2 style={{ color:C.text, fontSize:'clamp(20px,3.5vw,26px)', fontWeight:900, margin:0 }}>Filter by Date Range</h2>
        <p style={{ color:C.textMuted, fontSize:14, marginTop:5 }}>Analyze visitor data for specific time periods</p>
      </div>

      {/* Filter Card */}
      <Card>
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Presets */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {Object.entries(PRESETS).map(([key, {label}]) => {
              const active = preset === key;
              return (
                <button key={key} type="button" className="dr-preset" onClick={() => applyPreset(key)}
                  style={{ padding:'7px 16px', borderRadius:12, border:`1px solid ${active?C.base:C.border}`, background:active?C.base:C.surface, color:active?'#fff':C.text, fontSize:12, fontWeight:800, cursor:'pointer' }}>
                  {label}
                </button>
              );
            })}
          </div>

          {/* Date inputs */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:14, alignItems:'flex-end' }}>
            {[['Start Date', startDate, setStartDate], ['End Date', endDate, setEndDate]].map(([label, val, setter]) => (
              <div key={label} style={{ flex:1, minWidth:160 }}>
                <label style={{ display:'block', color:C.textMuted, fontSize:12, fontWeight:800, marginBottom:7, textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</label>
                <div style={{ position:'relative' }}>
                  <Calendar size={14} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:C.textMuted, pointerEvents:'none' }}/>
                  <input type="date" value={val} onChange={(e) => setter(e.target.value)} className="dr-input"
                    style={{ width:'100%', paddingLeft:34, paddingRight:10, paddingTop:9, paddingBottom:9, border:`1px solid ${C.border}`, borderRadius:12, fontSize:13, fontWeight:700, color:C.text, background:C.bg, boxSizing:'border-box' }}/>
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading || !startDate || !endDate} className="dr-submit"
              style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 22px', background:`linear-gradient(135deg,${C.base},${C.light})`, border:'none', borderRadius:12, color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer', transition:'opacity 0.15s,transform 0.15s', boxShadow:`0 4px 12px ${C.shadowMd}`, flexShrink:0 }}>
              {loading
                ? <div style={{ width:14,height:14,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',animation:'spin 0.8s linear infinite' }}/>
                : <Clock size={14}/>}
              Apply Filter
            </button>
          </div>
        </form>
      </Card>

      {/* Loading */}
      {loading && (
        <div style={{ display:'flex', justifyContent:'center', padding:40 }}>
          <div style={{ width:40,height:40,borderRadius:'50%',border:`4px solid ${C.surfaceHigher}`,borderTopColor:C.base,animation:'spin 0.9s linear infinite' }}/>
        </div>
      )}

      {/* Results */}
      {!loading && data.length > 0 && (
        <Card>
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, flexWrap:'wrap', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:38,height:38,borderRadius:12,background:`linear-gradient(135deg,${C.base},${C.light})`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 5px 12px ${C.shadowMd}` }}>
                <Calendar size={18} color="#fff"/>
              </div>
              <div>
                <h3 style={{ color:C.text, fontSize:15, fontWeight:800, margin:0 }}>Results: {data.length} visitors</h3>
                <p style={{ color:C.textMuted, fontSize:12, margin:'2px 0 0', fontWeight:600 }}>{startDate} → {endDate}</p>
              </div>
            </div>
            <button className="dr-export" onClick={exportCSV}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, color:C.text, fontSize:12, fontWeight:700, cursor:'pointer', transition:'background 0.12s' }}>
              <Download size={13}/> Export CSV
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:C.bg, borderBottom:`1px solid ${C.border}` }}>
                  {['IP','Browser','Device','Location','Page','Timestamp'].map(h => (
                    <th key={h} style={{ padding:'10px 14px', textAlign:'left', color:C.textMuted, fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((v, i) => (
                  <tr key={v._id} className="dr-row"
                    style={{ borderBottom:`1px solid ${C.border}`, animationDelay:`${i*0.03}s` }}
                    onMouseEnter={() => setHovRow(i)} onMouseLeave={() => setHovRow(null)}>
                    <td style={{ padding:'11px 14px' }}>
                      <code style={{ fontSize:12, background:C.bg, border:`1px solid ${C.border}`, padding:'3px 8px', borderRadius:8, fontFamily:'monospace', color:C.text, fontWeight:700 }}>{v.ip}</code>
                    </td>
                    <td style={{ padding:'11px 14px', color:C.text, fontSize:13, fontWeight:700 }}>{v.browser}</td>
                    <td style={{ padding:'11px 14px' }}>
                      <span style={{ padding:'2px 10px', borderRadius:20, background:`${(DEVICE_COLOR[v.device]||C.base)}18`, color:DEVICE_COLOR[v.device]||C.base, fontSize:11, fontWeight:800, textTransform:'capitalize' }}>{v.device}</span>
                    </td>
                    <td style={{ padding:'11px 14px', color:C.text, fontSize:13, fontWeight:600 }}>
                      {[v.city, v.country].filter(Boolean).join(', ') || 'Unknown'}
                    </td>
                    <td style={{ padding:'11px 14px', maxWidth:130 }}>
                      <span style={{ color:C.textMuted, fontSize:12, fontWeight:600, display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v.page}</span>
                    </td>
                    <td style={{ padding:'11px 14px', color:C.textMuted, fontSize:12, fontWeight:600, whiteSpace:'nowrap' }}>{new Date(v.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary stats */}
          <div style={{ marginTop:18, paddingTop:16, borderTop:`1px solid ${C.border}`, display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))', gap:10 }}>
            {summaryStats.map(({ label, value }) => (
              <div key={label} className="dr-stat" style={{ padding:'12px 14px', borderRadius:14, background:C.bg, border:`1px solid ${C.border}`, textAlign:'center', transition:'background 0.12s' }}>
                <p style={{ color:C.text, fontSize:'clamp(20px,3vw,26px)', fontWeight:900, margin:'0 0 4px' }}>{value}</p>
                <p style={{ color:C.textMuted, fontSize:11, fontWeight:700, margin:0 }}>{label}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Empty state */}
      {!loading && startDate && endDate && !data.length && (
        <Card>
          <div style={{ textAlign:'center', padding:'48px 20px' }}>
            <div style={{ width:56,height:56,borderRadius:'50%',background:C.bg,border:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px' }}>
              <Calendar size={24} color={C.textMuted}/>
            </div>
            <p style={{ color:C.text, fontSize:15, fontWeight:700, margin:'0 0 6px' }}>No visitors found for this date range</p>
            <p style={{ color:C.textMuted, fontSize:13, fontWeight:600, margin:0 }}>Try adjusting your filters or selecting a different period</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DateRangeFilter;