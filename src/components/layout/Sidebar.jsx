import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, BarChart3, HelpCircle,
  LogOut, ChevronRight, FileText,
  Globe, Monitor, Search, Clock, MapPin, Database
} from 'lucide-react';

const clay = {
  base: "#0D9488",
  light: "#14B8A6",
  lighter: "#2DD4BF",
  lightest: "#CCFBF1",
  bg: "#F0FDFA",
  surface: "#FFFFFF",
  surfaceHigh: "#E6FAF8",
  surfaceHigher: "#CCFBF1",
  border: "rgba(13,148,136,0.12)",
  text: "#134E4A",
  textMuted: "#0F766E",
  textSub: "#5EEAD4",
  shadow: "rgba(13,148,136,0.18)",
  shadowDark: "rgba(13,148,136,0.35)",
};

const S = {
  sidebar: {
    width: "260px",
    height: "100%",
    background: `linear-gradient(160deg, ${clay.bg} 0%, #E6FAF8 100%)`,
    display: "flex",
    flexDirection: "column",
    padding: "20px 16px",
    gap: "6px",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Nunito', 'Poppins', sans-serif",
    borderRight: `1px solid ${clay.border}`,
  },
  blob1: {
    position: "absolute", width: "240px", height: "240px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(45,212,191,0.2) 0%, transparent 70%)",
    top: "-80px", right: "-80px", pointerEvents: "none",
  },
  blob2: {
    position: "absolute", width: "180px", height: "180px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(13,148,136,0.1) 0%, transparent 70%)",
    bottom: "120px", left: "-60px", pointerEvents: "none",
  },
  logo: {
    background: `linear-gradient(135deg, ${clay.base}, ${clay.light})`,
    borderRadius: "20px", padding: "14px 18px", marginBottom: "8px", cursor: "pointer",
    boxShadow: `0 8px 24px ${clay.shadowDark}, 0 2px 6px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.1)`,
    display: "flex", alignItems: "center", gap: "12px",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  logoIcon: {
    width: "36px", height: "36px", borderRadius: "12px",
    background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "18px",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1), 0 1px 1px rgba(255,255,255,0.4)",
  },
  logoText: { color: "#FFFFFF", fontWeight: "900", fontSize: "17px", letterSpacing: "-0.3px" },
  logoSub: { color: "rgba(255,255,255,0.65)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.6px", textTransform: "uppercase" },
  sectionLabel: {
    color: clay.light, fontSize: "10px", fontWeight: "700", letterSpacing: "1.2px",
    textTransform: "uppercase", padding: "0 8px", margin: "8px 0 4px",
  },
  nav: { flex: 1, display: "flex", flexDirection: "column", gap: "5px", overflowY: "auto" },
  menuBtn: (active, submenuActive) => ({
    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "11px 14px", borderRadius: "16px", border: "none", cursor: "pointer",
    fontFamily: "inherit", fontSize: "13.5px", fontWeight: active ? "700" : "600",
    background: active
      ? `linear-gradient(135deg, ${clay.base} 0%, ${clay.light} 100%)`
      : submenuActive
        ? clay.surfaceHigher
        : clay.surface,
    color: active ? "#FFFFFF" : submenuActive ? clay.base : clay.textMuted,
    boxShadow: active
      ? `0 8px 20px ${clay.shadowDark}, 0 2px 6px rgba(0,0,0,0.06), inset 0 1px 1px rgba(255,255,255,0.3)`
      : `0 4px 14px ${clay.shadow}, 0 1px 3px rgba(0,0,0,0.04), inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -1px 2px rgba(13,148,136,0.08)`,
    transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
  }),
  iconWrap: (active, submenuActive) => ({
    width: "30px", height: "30px", borderRadius: "10px", display: "flex",
    alignItems: "center", justifyContent: "center", flexShrink: 0,
    background: active ? "rgba(255,255,255,0.22)" : submenuActive ? clay.surfaceHigh : clay.surfaceHigh,
    boxShadow: active
      ? "inset 0 2px 4px rgba(0,0,0,0.1), 0 1px 1px rgba(255,255,255,0.3)"
      : `inset 0 2px 4px ${clay.shadow}, 0 1px 1px rgba(255,255,255,0.9)`,
    transition: "all 0.2s ease",
  }),
  subWrap: { marginLeft: "14px", marginTop: "4px", display: "flex", flexDirection: "column", gap: "3px" },
  subBtn: (active) => ({
    width: "100%", display: "flex", alignItems: "center", gap: "10px",
    padding: "9px 12px", borderRadius: "12px", border: "none", cursor: "pointer",
    fontFamily: "inherit", fontSize: "12.5px", fontWeight: active ? "700" : "500",
    background: active ? `rgba(13,148,136,0.1)` : "transparent",
    color: active ? clay.base : clay.textMuted,
    borderLeft: active ? `3px solid ${clay.base}` : "3px solid transparent",
    boxShadow: active ? `inset 0 2px 5px rgba(13,148,136,0.1)` : "none",
    transition: "all 0.18s ease",
  }),
  subDot: (active) => ({
    width: "5px", height: "5px", borderRadius: "50%", flexShrink: 0,
    background: active ? clay.base : clay.surfaceHigher,
    boxShadow: active ? `0 0 5px ${clay.light}` : "none",
    transition: "all 0.2s ease",
  }),
  divider: {
    height: "1px",
    background: `linear-gradient(90deg, transparent, ${clay.surfaceHigher}, transparent)`,
    margin: "8px 0",
  },
  userCard: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "11px 14px", borderRadius: "16px", background: clay.surface,
    boxShadow: `0 4px 14px ${clay.shadow}, inset 0 1px 1px rgba(255,255,255,0.9)`,
    marginBottom: "6px",
  },
  avatar: {
    width: "34px", height: "34px", borderRadius: "12px", flexShrink: 0,
    background: `linear-gradient(135deg, ${clay.lighter}, ${clay.light})`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "13px", fontWeight: "800", color: "#FFFFFF",
    boxShadow: `0 4px 10px ${clay.shadow}, inset 0 1px 1px rgba(255,255,255,0.4)`,
  },
  userName: { color: clay.text, fontSize: "13px", fontWeight: "700", lineHeight: 1.2 },
  userEmail: { color: clay.textMuted, fontSize: "11px", fontWeight: "500" },
  logoutBtn: {
    width: "100%", display: "flex", alignItems: "center", gap: "10px",
    padding: "11px 14px", borderRadius: "16px", border: "none", cursor: "pointer",
    fontFamily: "inherit", fontSize: "13.5px", fontWeight: "600",
    background: `rgba(13,148,136,0.06)`,
    color: clay.textMuted,
    boxShadow: `0 2px 8px ${clay.shadow}, inset 0 1px 1px rgba(255,255,255,0.9)`,
    transition: "all 0.2s ease",
  },
};

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  {
    title: 'Visitor Analytics', icon: BarChart3, path: '/analytics',
    submenu: [
      { title: 'Overview', path: '/analytics', icon: BarChart3 },
      { title: 'By Country', path: '/analytics/country', icon: Globe },
      { title: 'By Device', path: '/analytics/device', icon: Monitor },
      { title: 'By Browser', path: '/analytics/browser', icon: Globe },
      { title: 'Traffic Trends', path: '/analytics/traffic', icon: Clock },
      { title: 'Top Pages', path: '/analytics/pages', icon: FileText },
    ],
  },
  {
    title: 'Visitors', icon: Users, path: '/visitors',
    submenu: [
      { title: 'All Visitors', path: '/visitors', icon: Users },
      { title: 'Search', path: '/visitors/search', icon: Search },
      { title: 'By IP', path: '/visitors/ip-lookup', icon: Database },
      { title: 'By Location', path: '/visitors/location', icon: MapPin },
      { title: 'Date Filter', path: '/visitors/date-range', icon: Clock },
      { title: 'Recent', path: '/visitors/recent', icon: Clock },
    ],
  },
  // { title: 'Reports', icon: FileText, path: '/reports' },
  // { title: 'Help', icon: HelpCircle, path: '/help' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredSub, setHoveredSub] = useState(null);
  const [logoutHover, setLogoutHover] = useState(false);

  const isActivePath = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
  const isSubmenuActive = (submenu) => submenu?.some(i => location.pathname === i.path);

  const toggleSubmenu = (index) =>
    setExpandedItems(prev => ({ ...prev, [index]: !prev[index] }));

  React.useEffect(() => {
    menuItems.forEach((item, index) => {
      if (item.submenu && isSubmenuActive(item.submenu))
        setExpandedItems(prev => ({ ...prev, [index]: true }));
    });
  }, [location.pathname]);

  return (
    <div style={S.sidebar}>
      <div style={S.blob1} />
      <div style={S.blob2} />

      {/* Logo */}
      <div
        style={S.logo}
        onClick={() => navigate('/dashboard')}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
          e.currentTarget.style.boxShadow = `0 12px 30px ${clay.shadowDark}, 0 4px 8px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255,255,255,0.35)`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = `0 8px 24px ${clay.shadowDark}, 0 2px 6px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.1)`;
        }}
      >
        <div style={S.logoIcon}>🔍</div>
        <div>
          <div style={S.logoText}>VisitorTrack</div>
          <div style={S.logoSub}>Analytics Suite</div>
        </div>
      </div>

      <div style={S.sectionLabel}>Navigation</div>

      <nav style={S.nav}>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const hasSubmenu = !!item.submenu;
          const active = isActivePath(item.path) && !hasSubmenu;
          const submenuActive = hasSubmenu && isSubmenuActive(item.submenu);
          const isExpanded = expandedItems[index];
          const hovered = hoveredIndex === index;

          return (
            <div key={index}>
              <button
                style={{
                  ...S.menuBtn(active, submenuActive),
                  ...(hovered && !active ? {
                    transform: 'translateY(-2px) scale(1.01)',
                    boxShadow: `0 10px 24px ${clay.shadowDark}, 0 4px 8px rgba(0,0,0,0.04), inset 0 1px 1px rgba(255,255,255,0.95)`,
                  } : {}),
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => hasSubmenu ? toggleSubmenu(index) : navigate(item.path)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={S.iconWrap(active, submenuActive)}>
                    <Icon size={15} color={active ? "#FFFFFF" : submenuActive ? clay.base : clay.light} />
                  </div>
                  {item.title}
                </div>
                {hasSubmenu && (
                  <ChevronRight
                    size={14}
                    color={active ? "rgba(255,255,255,0.7)" : clay.lighter}
                    style={{ transform: isExpanded ? "rotate(90deg)" : "", transition: "transform 0.25s ease" }}
                  />
                )}
              </button>

              {hasSubmenu && isExpanded && (
                <div style={S.subWrap}>
                  {item.submenu.map((sub, si) => {
                    const SubIcon = sub.icon;
                    const subActive = location.pathname === sub.path;
                    const subHov = hoveredSub === `${index}-${si}`;
                    return (
                      <button
                        key={si}
                        style={{
                          ...S.subBtn(subActive),
                          ...(subHov && !subActive ? { background: "rgba(13,148,136,0.06)", color: clay.base } : {}),
                        }}
                        onMouseEnter={() => setHoveredSub(`${index}-${si}`)}
                        onMouseLeave={() => setHoveredSub(null)}
                        onClick={() => navigate(sub.path)}
                      >
                        <div style={S.subDot(subActive)} />
                        <SubIcon size={13} color={subActive ? clay.base : clay.light} style={{ flexShrink: 0 }} />
                        {sub.title}
                        {subActive && (
                          <div style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: clay.base, boxShadow: `0 0 5px ${clay.light}` }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div style={S.divider} />

      <div style={S.userCard}>
        <div style={S.avatar}>A</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={S.userName}>Admin User</div>
          <div style={S.userEmail}>admin@example.com</div>
        </div>
        <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 5px #10b981", flexShrink: 0 }} />
      </div>

      <button
        style={{
          ...S.logoutBtn,
          ...(logoutHover ? {
            background: "rgba(13,148,136,0.12)",
            color: clay.base,
            boxShadow: `0 4px 14px ${clay.shadowDark}, inset 0 1px 1px rgba(255,255,255,0.9)`,
          } : {}),
        }}
        onMouseEnter={() => setLogoutHover(true)}
        onMouseLeave={() => setLogoutHover(false)}
        onClick={() => {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          navigate('/login');
        }}
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;