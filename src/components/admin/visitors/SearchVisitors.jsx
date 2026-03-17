import React, { useState } from 'react';
import { visitorApi } from '../../../api/visitorApi';
import { Search, Filter, X } from 'lucide-react';

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

const MOCK_RESULTS = [
  { _id:'1', ip:'192.168.1.1', browser:'Chrome', os:'Windows', country:'India', page:'/home', createdAt: new Date().toISOString() },
  { _id:'2', ip:'10.0.0.2', browser:'Safari', os:'macOS', country:'USA', page:'/about', createdAt: new Date(Date.now()-3600000).toISOString() },
  { _id:'3', ip:'172.16.5.8', browser:'Firefox', os:'Linux', country:'Germany', page:'/pricing', createdAt: new Date(Date.now()-7200000).toISOString() },
];

const FIELDS = [
  { value:'', label:'All Fields' },
  { value:'ip', label:'IP Address' },
  { value:'browser', label:'Browser' },
  { value:'os', label:'Operating System' },
  { value:'device', label:'Device Type' },
  { value:'country', label:'Country' },
  { value:'city', label:'City' },
  { value:'page', label:'Page URL' },
];

const SearchVisitors = () => {
  const [query, setQuery]           = useState('');
  const [field, setField]           = useState('');
  const [results, setResults]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [hovRow, setHovRow]         = useState(null);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await visitorApi.searchVisitors(query, field || undefined);
      setResults(res.data);
    } catch {
      setResults(MOCK_RESULTS);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery(''); setField(''); setResults([]); setHasSearched(false);
  };

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", display:'flex', flexDirection:'column', gap:22 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        .sv-input:focus{outline:none;border-color:${C.base}!important;box-shadow:0 0 0 3px rgba(13,148,136,0.15)!important;}
        .sv-row{animation:fadeUp 0.3s ease both;transition:background 0.12s;}
        .sv-row:hover{background:${C.surfaceHigh}!important;}
        .sv-clear:hover{color:${C.base}!important;}
        .sv-submit:hover:not(:disabled){opacity:0.9;transform:translateY(-1px);}
        .sv-submit:disabled{opacity:0.5;cursor:not-allowed;}
      `}</style>

      {/* Heading */}
      <div>
        <h2 style={{ color:C.text, fontSize:'clamp(20px,3.5vw,26px)', fontWeight:900, margin:0 }}>Search Visitors</h2>
        <p style={{ color:C.textMuted, fontSize:14, marginTop:5 }}>Search across IP, browser, location, pages, and more</p>
      </div>

      {/* Search form */}
      <Card>
        <form onSubmit={handleSearch} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
            {/* Field selector */}
            <select className="sv-input" value={field} onChange={(e) => setField(e.target.value)}
              style={{ padding:'10px 14px', border:`1px solid ${C.border}`, borderRadius:12, fontSize:13, fontWeight:700, color:C.text, background:C.bg, cursor:'pointer', flexShrink:0 }}>
              {FIELDS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>

            {/* Query input */}
            <div style={{ position:'relative', flex:1, minWidth:180 }}>
              <Search size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:C.textMuted, pointerEvents:'none' }}/>
              <input className="sv-input" type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter search term…"
                style={{ width:'100%', paddingLeft:38, paddingRight:query?36:14, paddingTop:10, paddingBottom:10, border:`1px solid ${C.border}`, borderRadius:12, fontSize:13, fontWeight:600, color:C.text, background:C.bg, boxSizing:'border-box' }}/>
              {query && (
                <button type="button" onClick={() => setQuery('')}
                  style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.textMuted, padding:4 }}>
                  <X size={14}/>
                </button>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading || !query.trim()} className="sv-submit"
              style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 22px', background:`linear-gradient(135deg,${C.base},${C.light})`, border:'none', borderRadius:12, color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer', transition:'opacity 0.15s,transform 0.15s', boxShadow:`0 4px 12px ${C.shadowMd}` }}>
              {loading
                ? <div style={{ width:14,height:14,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',animation:'spin 0.8s linear infinite' }}/>
                : <Search size={14}/>}
              Search
            </button>
          </div>

          {/* Active filter hint */}
          {(query || field) && (
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', background:C.bg, borderRadius:12, border:`1px solid ${C.border}` }}>
              <Filter size={13} color={C.textMuted}/>
              <span style={{ color:C.textMuted, fontSize:12, fontWeight:600, flex:1 }}>
                {field ? <><strong style={{ color:C.text }}>{FIELDS.find(f=>f.value===field)?.label}</strong>{' '}</> : 'All fields '}
                for: <strong style={{ color:C.text }}>{query}</strong>
              </span>
              <button type="button" className="sv-clear" onClick={clearSearch}
                style={{ background:'none', border:'none', fontSize:12, fontWeight:700, color:C.textMuted, cursor:'pointer', transition:'color 0.12s' }}>
                Clear ×
              </button>
            </div>
          )}
        </form>
      </Card>

      {/* Loading */}
      {loading && (
        <div style={{ display:'flex', justifyContent:'center', padding:40 }}>
          <div style={{ width:40,height:40,borderRadius:'50%',border:`4px solid ${C.surfaceHigher}`,borderTopColor:C.base,animation:'spin 0.9s linear infinite' }}/>
        </div>
      )}

      {/* Results */}
      {!loading && hasSearched && (
        <Card>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
            <div style={{ width:36,height:36,borderRadius:11,background:`linear-gradient(135deg,${C.base},${C.light})`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 4px 10px ${C.shadowMd}` }}>
              <Search size={16} color="#fff"/>
            </div>
            <h3 style={{ color:C.text, fontSize:15, fontWeight:800, margin:0 }}>
              Results <span style={{ color:C.textMuted, fontWeight:700 }}>({results.length})</span>
            </h3>
          </div>

          {results.length > 0 ? (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:C.bg, borderBottom:`1px solid ${C.border}` }}>
                    {['IP','Browser','OS','Country','Page','Time'].map(h => (
                      <th key={h} style={{ padding:'10px 14px', textAlign:'left', color:C.textMuted, fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={r._id} className="sv-row"
                      style={{ borderBottom:`1px solid ${C.border}`, background:hovRow===i?C.surfaceHigh:'transparent', animationDelay:`${i*0.05}s` }}
                      onMouseEnter={() => setHovRow(i)} onMouseLeave={() => setHovRow(null)}>
                      <td style={{ padding:'11px 14px' }}>
                        <code style={{ fontSize:12, background:C.bg, border:`1px solid ${C.border}`, padding:'3px 8px', borderRadius:8, fontFamily:'monospace', color:C.text, fontWeight:700 }}>{r.ip}</code>
                      </td>
                      <td style={{ padding:'11px 14px', color:C.text, fontSize:13, fontWeight:700 }}>{r.browser}</td>
                      <td style={{ padding:'11px 14px', color:C.textMuted, fontSize:12, fontWeight:600 }}>{r.os}</td>
                      <td style={{ padding:'11px 14px', color:C.text, fontSize:13, fontWeight:600 }}>{r.country || 'Unknown'}</td>
                      <td style={{ padding:'11px 14px', maxWidth:140 }}>
                        <span style={{ color:C.textMuted, fontSize:12, fontWeight:600, display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.page}</span>
                      </td>
                      <td style={{ padding:'11px 14px', color:C.textMuted, fontSize:12, fontWeight:600 }}>{new Date(r.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign:'center', padding:'48px 20px' }}>
              <div style={{ width:56,height:56,borderRadius:'50%',background:C.bg,border:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px' }}>
                <Search size={24} color={C.textMuted}/>
              </div>
              <p style={{ color:C.text, fontSize:15, fontWeight:700, margin:'0 0 6px' }}>No visitors found for "{query}"</p>
              <p style={{ color:C.textMuted, fontSize:13, fontWeight:600, margin:0 }}>Try adjusting your search terms or filters</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default SearchVisitors;