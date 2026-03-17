import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, Settings, User } from 'lucide-react';

const clay = {
  base: "#0D9488",
  light: "#14B8A6",
  lighter: "#2DD4BF",
  lightest: "#CCFBF1",
  bg: "#F0FDFA",
  surface: "#FFFFFF",
  surfaceHigh: "#E6FAF8",
  border: "rgba(13,148,136,0.12)",
  text: "#134E4A",
  textMuted: "#0F766E",
  shadow: "rgba(13,148,136,0.18)",
  shadowDark: "rgba(13,148,136,0.28)",
};

const S = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 30,
    display: "flex",
    height: "64px",
    alignItems: "center",
    justifyContent: "space-between",
    background: `linear-gradient(135deg, ${clay.bg} 0%, #E6FAF8 100%)`,
    borderBottom: `1px solid ${clay.border}`,
    padding: "0 24px",
    fontFamily: "'Nunito', 'Poppins', sans-serif",
    gap: "16px",
  },
  iconBtn: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: "38px", height: "38px", borderRadius: "12px",
    background: clay.surface, border: "none", cursor: "pointer",
    boxShadow: `0 4px 12px ${clay.shadow}, inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -1px 2px rgba(13,148,136,0.08)`,
    transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
    color: clay.textMuted,
    flexShrink: 0,
  },
  searchWrap: {
    flex: 1,
    maxWidth: "420px",
    position: "relative",
  },
  searchInput: {
    width: "100%",
    padding: "9px 14px 9px 38px",
    borderRadius: "14px",
    border: `1px solid ${clay.border}`,
    background: clay.surface,
    fontFamily: "'Nunito', sans-serif",
    fontSize: "13.5px",
    fontWeight: "500",
    color: clay.text,
    outline: "none",
    boxShadow: `0 4px 12px ${clay.shadow}, inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -1px 2px rgba(13,148,136,0.06)`,
    transition: "box-shadow 0.2s ease",
  },
  searchIcon: {
    position: "absolute", left: "12px", top: "50%",
    transform: "translateY(-50%)", pointerEvents: "none",
  },
  title: {
    color: clay.text,
    fontSize: "18px",
    fontWeight: "800",
    letterSpacing: "-0.3px",
    whiteSpace: "nowrap",
  },
  badge: {
    position: "absolute", top: "4px", right: "4px",
    width: "17px", height: "17px", borderRadius: "50%",
    background: `linear-gradient(135deg, #EF4444, #F87171)`,
    color: "#fff", fontSize: "10px", fontWeight: "800",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 2px 6px rgba(239,68,68,0.45)",
  },
  dropdown: {
    position: "absolute", right: 0, top: "calc(100% + 10px)",
    width: "300px",
    background: clay.surface,
    borderRadius: "18px",
    border: `1px solid ${clay.border}`,
    boxShadow: `0 16px 40px rgba(13,148,136,0.18), 0 4px 12px rgba(0,0,0,0.06)`,
    overflow: "hidden",
    zIndex: 50,
  },
  dropdownHeader: {
    padding: "14px 18px",
    borderBottom: `1px solid ${clay.border}`,
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  notifItem: (unread) => ({
    padding: "12px 18px",
    borderBottom: `1px solid rgba(13,148,136,0.07)`,
    cursor: "pointer",
    background: unread ? "rgba(13,148,136,0.05)" : "transparent",
    transition: "background 0.15s ease",
    display: "flex", alignItems: "flex-start", gap: "10px",
  }),
  notifDot: (unread) => ({
    width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0, marginTop: "5px",
    background: unread ? clay.base : clay.lightest,
    boxShadow: unread ? `0 0 5px ${clay.light}` : "none",
  }),
  avatar: {
    width: "34px", height: "34px", borderRadius: "11px",
    background: `linear-gradient(135deg, ${clay.lighter}, ${clay.light})`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "13px", fontWeight: "800", color: "#fff", flexShrink: 0,
    boxShadow: `0 4px 10px ${clay.shadow}, inset 0 1px 1px rgba(255,255,255,0.4)`,
  },
  profileBtn: {
    display: "flex", alignItems: "center", gap: "9px",
    padding: "5px 12px 5px 5px",
    borderRadius: "14px", border: "none", cursor: "pointer",
    background: clay.surface, fontFamily: "'Nunito', sans-serif",
    boxShadow: `0 4px 12px ${clay.shadow}, inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -1px 2px rgba(13,148,136,0.08)`,
    transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
  },
};

const Header = ({ toggleSidebar, title = 'Dashboard' }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const notifications = [
    { id: 1, message: 'New visitor from USA', time: '2m ago', read: false },
    { id: 2, message: 'Traffic spike detected', time: '15m ago', read: false },
    { id: 3, message: 'Weekly report ready', time: '1h ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const hoverStyle = {
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: `0 8px 20px ${clay.shadowDark}, inset 0 1px 1px rgba(255,255,255,0.95)`,
  };

  return (
    <header style={S.header}>
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", flexShrink: 0 }}>
        <button
          onClick={toggleSidebar}
          style={{
            ...S.iconBtn,
            ...(hoveredBtn === 'menu' ? hoverStyle : {}),
          }}
          onMouseEnter={() => setHoveredBtn('menu')}
          onMouseLeave={() => setHoveredBtn(null)}
          aria-label="Toggle sidebar"
          className="lg:hidden"
        >
          <Menu size={18} color={clay.textMuted} />
        </button>
        <h1 style={S.title}>{title}</h1>
      </div>

      {/* Center: Search */}
      <div style={S.searchWrap}>
        <div style={S.searchIcon}>
          <Search size={15} color={searchFocused ? clay.base : clay.lighter} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Search visitors, pages, IPs..."
          style={{
            ...S.searchInput,
            ...(searchFocused ? {
              boxShadow: `0 6px 18px ${clay.shadowDark}, 0 0 0 3px rgba(13,148,136,0.12), inset 0 1px 1px rgba(255,255,255,0.9)`,
              borderColor: clay.lighter,
            } : {}),
          }}
        />
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              ...S.iconBtn,
              position: "relative",
              background: showNotifications
                ? `linear-gradient(135deg, ${clay.base}, ${clay.light})`
                : clay.surface,
              boxShadow: showNotifications
                ? `0 8px 20px ${clay.shadowDark}, inset 0 1px 1px rgba(255,255,255,0.2)`
                : `0 4px 12px ${clay.shadow}, inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -1px 2px rgba(13,148,136,0.08)`,
              ...(hoveredBtn === 'bell' && !showNotifications ? hoverStyle : {}),
            }}
            onMouseEnter={() => setHoveredBtn('bell')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            <Bell size={17} color={showNotifications ? "#fff" : clay.textMuted} />
            {unreadCount > 0 && (
              <div style={S.badge}>{unreadCount}</div>
            )}
          </button>

          {showNotifications && (
            <div style={S.dropdown}>
              <div style={S.dropdownHeader}>
                <span style={{ color: clay.text, fontSize: "14px", fontWeight: "700" }}>Notifications</span>
                <span style={{ background: clay.lightest, color: clay.base, fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "20px" }}>
                  {unreadCount} new
                </span>
              </div>
              <div style={{ maxHeight: "220px", overflowY: "auto" }}>
                {notifications.map(notif => (
                  <div key={notif.id} style={S.notifItem(notif.read === false)}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(13,148,136,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = notif.read === false ? 'rgba(13,148,136,0.05)' : 'transparent'}
                  >
                    <div style={S.notifDot(!notif.read)} />
                    <div>
                      <p style={{ fontSize: "13px", color: clay.text, fontWeight: notif.read ? "500" : "600", margin: 0 }}>{notif.message}</p>
                      <p style={{ fontSize: "11px", color: clay.lighter, marginTop: "3px" }}>{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "12px 18px", borderTop: `1px solid ${clay.border}` }}>
                <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "700", color: clay.base, fontFamily: "'Nunito', sans-serif" }}>
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          onClick={() => navigate('/settings')}
          style={{
            ...S.iconBtn,
            ...(hoveredBtn === 'settings' ? hoverStyle : {}),
          }}
          onMouseEnter={() => setHoveredBtn('settings')}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          <Settings size={17} color={clay.textMuted} />
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate('/settings/users')}
          style={{
            ...S.profileBtn,
            ...(hoveredBtn === 'profile' ? {
              transform: 'translateY(-2px) scale(1.02)',
              boxShadow: `0 8px 20px ${clay.shadowDark}, inset 0 1px 1px rgba(255,255,255,0.95)`,
            } : {}),
          }}
          onMouseEnter={() => setHoveredBtn('profile')}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          <div style={S.avatar}>A</div>
          <span style={{ fontSize: "13px", fontWeight: "700", color: clay.text }}>Admin</span>
        </button>
      </div>
    </header>
  );
};

export default Header;