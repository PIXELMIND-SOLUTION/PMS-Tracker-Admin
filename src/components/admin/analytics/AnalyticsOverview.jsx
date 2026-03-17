import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { visitorApi } from '../../../api/visitorApi';
import { Users, Globe, Monitor, BarChart3, TrendingUp, Clock } from 'lucide-react';

/* ─── Design tokens (identical to AnalyticsByBrowser) ─── */
const C = {
  base: '#0D9488', light: '#14B8A6', lighter: '#2DD4BF', lightest: '#CCFBF1',
  bg: '#F0FDFA', surface: '#FFFFFF', surfaceHigh: '#E6FAF8', surfaceHigher: '#CCFBF1',
  border: 'rgba(13,148,136,0.12)', text: '#134E4A', textMuted: '#0F766E', textSub: '#5EEAD4',
  shadow: 'rgba(13,148,136,0.18)', shadowMd: 'rgba(13,148,136,0.25)', shadowLg: 'rgba(13,148,136,0.35)',
  chart: ['#14B8A6', '#0D9488', '#2DD4BF', '#0F766E', '#5EEAD4', '#115E59', '#99F6E4'],
  purpleGrad: 'linear-gradient(135deg,#8B5CF6,#7C3AED)',
  blueGrad: 'linear-gradient(135deg,#3B82F6,#2563EB)',
  greenGrad: 'linear-gradient(135deg,#10B981,#059669)',
  tealGrad: 'linear-gradient(135deg,#0D9488,#14B8A6)',
};

/* ─── Shared Card ─── */
const Card = ({ children, style = {} }) => (
  <div style={{
    background: C.surface, borderRadius: 20,
    border: `1px solid ${C.border}`,
    boxShadow: `0 6px 20px ${C.shadow}, inset 0 1px 1px rgba(255,255,255,0.9)`,
    padding: 22, ...style,
  }}>
    {children}
  </div>
);

/* ─── Mock data fallbacks ─── */
const MOCK_STATS    = { total: 11_420, unique: 7_830 };
const MOCK_COUNTRIES = [
  { country: 'United States', count: 3_820 },
  { country: 'India',         count: 2_310 },
  { country: 'Germany',       count: 1_180 },
  { country: 'Brazil',        count:   940 },
  { country: 'Japan',         count:   720 },
];
const MOCK_DEVICES = [
  { device: 'Desktop', count: 6_200 },
  { device: 'Mobile',  count: 4_100 },
  { device: 'Tablet',  count: 1_120 },
];

const DEVICE_ICONS = { Desktop: '🖥️', Mobile: '📱', Tablet: '📟' };
const DEVICE_COLORS = ['#14B8A6', '#8B5CF6', '#F59E0B'];

/* ════════════════════════════════════════════════════════ */
const AnalyticsOverview = () => {
  const navigate = useNavigate();

  const [stats,       setStats]       = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [deviceData,  setDeviceData]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [hovMetric,   setHovMetric]   = useState(null);
  const [hovCountry,  setHovCountry]  = useState(null);
  const [hovDevice,   setHovDevice]   = useState(null);
  const [hovAction,   setHovAction]   = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [total, unique, countries, devices] = await Promise.all([
          visitorApi.getTotalCount(),
          visitorApi.getUniqueCount(),
          visitorApi.getAnalyticsByCountry(),
          visitorApi.getAnalyticsByDevice(),
        ]);
        setStats({ total: total.data.total, unique: unique.data.unique });
        setCountryData(countries.data.slice(0, 5));
        setDeviceData(devices.data);
      } catch {
        setStats(MOCK_STATS);
        setCountryData(MOCK_COUNTRIES);
        setDeviceData(MOCK_DEVICES);
      } finally {
        setLoading(false);
      }
    };

    if (visitorApi?.getTotalCount) {
      load();
    } else {
      setTimeout(() => {
        setStats(MOCK_STATS);
        setCountryData(MOCK_COUNTRIES);
        setDeviceData(MOCK_DEVICES);
        setLoading(false);
      }, 500);
    }
  }, []);

  /* ── Loading state ── */
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, fontFamily: "'Nunito',sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: `4px solid ${C.surfaceHigher}`, borderTopColor: C.base, animation: 'spin 0.9s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: C.textMuted, fontSize: 14, fontWeight: 600 }}>Loading overview…</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  /* ── Derived ── */
  const deviceTotal = deviceData.reduce((s, d) => s + d.count, 0);

  const metrics = [
    { icon: Users,    label: 'Total Visits',     value: stats.total?.toLocaleString(),  trend: '+12.5%', grad: C.tealGrad,   nav: '/visitors' },
    { icon: Users,    label: 'Unique Visitors',  value: stats.unique?.toLocaleString(), trend: '+8.2%',  grad: C.purpleGrad, nav: '/visitors' },
    { icon: Globe,    label: 'Countries',        value: countryData.length,             sub: 'destinations tracked', grad: C.blueGrad, nav: '/analytics/country' },
    { icon: Monitor,  label: 'Device Types',     value: deviceData.length,              sub: 'categories tracked',   grad: C.greenGrad, nav: '/analytics/device' },
  ];

  const quickActions = [
    { icon: BarChart3,  label: 'Traffic Trends',   nav: '/analytics/traffic' },
    { icon: Globe,      label: 'By Browser',        nav: '/analytics/browser' },
    { icon: Clock,      label: 'Recent Activity',   nav: '/visitors/recent' },
    { icon: TrendingUp, label: 'Top Pages',          nav: '/analytics/pages' },
  ];

  return (
    <div style={{ fontFamily: "'Nunito',sans-serif", display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&display=swap');
        @keyframes spin  { to { transform: rotate(360deg) } }
        @keyframes fadeUp{ from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .ov-metric { animation: fadeUp 0.35s ease both; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; }
        .ov-metric:hover { transform: translateY(-3px); }
        .ov-row   { transition: background 0.12s; animation: fadeUp 0.3s ease both; }
        .ov-row:hover { background: #E6FAF8 !important; }
        .ov-dev   { transition: background 0.12s, transform 0.12s; cursor: pointer; }
        .ov-dev:hover { background: #E6FAF8 !important; transform: translateY(-2px); }
        .ov-qa    { transition: background 0.12s, transform 0.12s; cursor: pointer; }
        .ov-qa:hover { background: #E6FAF8 !important; transform: translateY(-2px); }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: #2DD4BF; border-radius: 10px; }
      `}</style>

      {/* ── Heading ── */}
      <div>
        <h2 style={{ color: C.text, fontSize: 'clamp(20px,3.5vw,26px)', fontWeight: 900, margin: 0 }}>Analytics Overview</h2>
        <p style={{ color: C.textMuted, fontSize: 14, marginTop: 5 }}>Key metrics and insights at a glance</p>
      </div>

      {/* ── Metric Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
        {metrics.map((m, i) => {
          const Icon = m.icon;
          const hov = hovMetric === i;
          return (
            <div key={i} className="ov-metric"
              style={{
                background: C.surface, borderRadius: 20,
                border: `1px solid ${hov ? C.lighter : C.border}`,
                boxShadow: hov
                  ? `0 12px 28px ${C.shadowMd}, inset 0 1px 1px rgba(255,255,255,0.9)`
                  : `0 6px 20px ${C.shadow}, inset 0 1px 1px rgba(255,255,255,0.9)`,
                padding: 22, animationDelay: `${i * 0.07}s`,
              }}
              onMouseEnter={() => setHovMetric(i)} onMouseLeave={() => setHovMetric(null)}
              onClick={() => navigate?.(m.nav)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: C.textMuted, fontSize: 12, fontWeight: 700, margin: 0 }}>{m.label}</p>
                  <p style={{ color: C.text, fontSize: 'clamp(22px,4vw,30px)', fontWeight: 900, margin: '6px 0 0' }}>{m.value}</p>
                  {m.sub && <p style={{ color: C.textMuted, fontSize: 11, fontWeight: 600, marginTop: 4 }}>{m.sub}</p>}
                  {m.trend && (
                    <span style={{ display: 'inline-block', marginTop: 8, padding: '3px 10px', borderRadius: 20, background: C.surfaceHigher, color: C.base, fontSize: 11, fontWeight: 800 }}>
                      ↑ {m.trend}
                    </span>
                  )}
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 13, background: m.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 5px 12px ${C.shadowMd}`, flexShrink: 0 }}>
                  <Icon size={18} color="#fff" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>

        {/* Top Countries */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: C.tealGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 5px 12px ${C.shadowMd}` }}>
                <Globe size={18} color="#fff" />
              </div>
              <h3 style={{ color: C.text, fontSize: 16, fontWeight: 800, margin: 0 }}>Top Countries</h3>
            </div>
            <button onClick={() => navigate?.('/analytics/country')} style={{ background: 'none', border: 'none', color: C.base, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              View All →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {countryData.map((item, i) => {
              const maxCount = countryData[0]?.count || 1;
              const pct = Math.round((item.count / maxCount) * 100);
              return (
                <div key={item.country} className="ov-row"
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 12, background: 'transparent', animationDelay: `${i * 0.06}s` }}
                  onMouseEnter={() => setHovCountry(i)} onMouseLeave={() => setHovCountry(null)}>
                  <span style={{ width: 20, color: C.textMuted, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>#{i + 1}</span>
                  <span style={{ flex: 1, color: C.text, fontSize: 13, fontWeight: 700 }}>{item.country || 'Unknown'}</span>
                  <div style={{ width: 90, height: 7, borderRadius: 7, background: C.surfaceHigher, overflow: 'hidden', flexShrink: 0 }}>
                    <div style={{ height: '100%', borderRadius: 7, width: `${pct}%`, background: `linear-gradient(90deg,${C.chart[i % C.chart.length]},${C.chart[(i + 1) % C.chart.length]})`, transition: 'width 0.8s ease' }} />
                  </div>
                  <span style={{ color: C.text, fontSize: 12, fontWeight: 800, width: 46, textAlign: 'right', flexShrink: 0 }}>{item.count.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Device Distribution */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: C.tealGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 5px 12px ${C.shadowMd}` }}>
                <Monitor size={18} color="#fff" />
              </div>
              <h3 style={{ color: C.text, fontSize: 16, fontWeight: 800, margin: 0 }}>Device Distribution</h3>
            </div>
            <button onClick={() => navigate?.('/analytics/device')} style={{ background: 'none', border: 'none', color: C.base, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              Details →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {deviceData.map((item, i) => {
              const pct = deviceTotal ? Math.round((item.count / deviceTotal) * 100) : 0;
              return (
                <div key={item.device} className="ov-dev"
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 14, background: C.bg, border: `1px solid ${C.border}` }}
                  onMouseEnter={() => setHovDevice(i)} onMouseLeave={() => setHovDevice(null)}
                  onClick={() => navigate?.('/analytics/device')}
                >
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{DEVICE_ICONS[item.device] || '💻'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>{item.device || 'Unknown'}</span>
                      <span style={{ color: C.textMuted, fontSize: 12, fontWeight: 700 }}>{pct}%</span>
                    </div>
                    <div style={{ height: 7, borderRadius: 7, background: C.surfaceHigher, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 7, width: `${pct}%`, background: `linear-gradient(90deg,${DEVICE_COLORS[i % DEVICE_COLORS.length]},${DEVICE_COLORS[(i + 1) % DEVICE_COLORS.length]})`, transition: 'width 0.8s ease' }} />
                    </div>
                  </div>
                  <span style={{ color: C.text, fontSize: 14, fontWeight: 800, flexShrink: 0 }}>{item.count.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* ── Quick Actions ── */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: C.tealGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 5px 12px ${C.shadowMd}` }}>
            <TrendingUp size={18} color="#fff" />
          </div>
          <h3 style={{ color: C.text, fontSize: 16, fontWeight: 800, margin: 0 }}>Quick Actions</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 10 }}>
          {quickActions.map((qa, i) => {
            const Icon = qa.icon;
            return (
              <div key={i} className="ov-qa"
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 14, background: C.bg, border: `1px solid ${C.border}` }}
                onMouseEnter={() => setHovAction(i)} onMouseLeave={() => setHovAction(null)}
                onClick={() => navigate?.(qa.nav)}
              >
                <div style={{ width: 32, height: 32, borderRadius: 10, background: C.tealGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color="#fff" />
                </div>
                <span style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>{qa.label}</span>
              </div>
            );
          })}
        </div>
      </Card>

    </div>
  );
};

export default AnalyticsOverview;