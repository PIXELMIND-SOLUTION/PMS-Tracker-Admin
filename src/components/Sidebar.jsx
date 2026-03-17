import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  BarChart3,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const clay = {
  base: "#FF3B30",
  light: "#FF6B63",
  lighter: "#FF8F89",
  lightest: "#FFCECB",
  bg: "#2A0A09",
  surface: "#3D1210",
  surfaceHigh: "#5C1C1A",
  surfaceHigher: "#7A2422",
  text: "#FFE5E4",
  textMuted: "#FF9E99",
  white: "#FFF5F5",
};

const styles = {
  sidebar: {
    width: "260px",
    height: "100vh",
    background: `linear-gradient(160deg, ${clay.bg} 0%, #1A0605 100%)`,
    display: "flex",
    flexDirection: "column",
    padding: "20px 16px",
    gap: "8px",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Nunito', 'Poppins', sans-serif",
  },
  blob1: {
    position: "absolute",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,59,48,0.25) 0%, transparent 70%)",
    top: "-60px",
    right: "-60px",
    pointerEvents: "none",
  },
  blob2: {
    position: "absolute",
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,59,48,0.15) 0%, transparent 70%)",
    bottom: "80px",
    left: "-50px",
    pointerEvents: "none",
  },
  logo: {
    background: `linear-gradient(135deg, ${clay.base}, ${clay.light})`,
    borderRadius: "20px",
    padding: "16px 20px",
    marginBottom: "12px",
    cursor: "pointer",
    boxShadow: `
      0 8px 24px rgba(255,59,48,0.5),
      0 2px 6px rgba(0,0,0,0.4),
      inset 0 1px 1px rgba(255,255,255,0.2),
      inset 0 -2px 4px rgba(0,0,0,0.2)
    `,
    display: "flex",
    alignItems: "center",
    gap: "12px",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  },
  logoIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 1px rgba(255,255,255,0.15)",
  },
  logoText: {
    color: clay.white,
    fontWeight: "800",
    fontSize: "18px",
    letterSpacing: "-0.3px",
  },
  logoSub: {
    color: "rgba(255,245,245,0.65)",
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  divider: {
    height: "1px",
    background: `linear-gradient(90deg, transparent, ${clay.surfaceHigher}, transparent)`,
    margin: "4px 0 8px",
  },
  sectionLabel: {
    color: clay.textMuted,
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    padding: "0 8px",
    marginBottom: "4px",
    marginTop: "4px",
  },
  menuItem: (active) => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 14px",
    borderRadius: "16px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
    fontFamily: "inherit",
    fontSize: "14px",
    fontWeight: active ? "700" : "600",
    background: active
      ? `linear-gradient(135deg, ${clay.base} 0%, ${clay.light} 100%)`
      : clay.surface,
    color: active ? clay.white : clay.textMuted,
    boxShadow: active
      ? `0 8px 20px rgba(255,59,48,0.45), 0 2px 6px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2)`
      : `0 4px 12px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.05), inset 0 -1px 2px rgba(0,0,0,0.2)`,
  }),
  menuItemHover: {
    transform: "translateY(-2px) scale(1.01)",
    boxShadow: `0 10px 24px rgba(255,59,48,0.3), 0 4px 8px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1)`,
  },
  iconWrap: (active) => ({
    width: "32px",
    height: "32px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: active ? "rgba(255,255,255,0.2)" : clay.surfaceHigh,
    boxShadow: active
      ? "inset 0 2px 4px rgba(0,0,0,0.15), 0 1px 1px rgba(255,255,255,0.15)"
      : "inset 0 2px 4px rgba(0,0,0,0.3), 0 1px 1px rgba(255,255,255,0.05)",
    flexShrink: 0,
    transition: "all 0.2s ease",
  }),
  badge: {
    background: "rgba(255,255,255,0.25)",
    color: clay.white,
    fontSize: "10px",
    fontWeight: "800",
    padding: "2px 7px",
    borderRadius: "20px",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)",
  },
  badgeInactive: {
    background: clay.base,
    color: clay.white,
    fontSize: "10px",
    fontWeight: "800",
    padding: "2px 7px",
    borderRadius: "20px",
    boxShadow: "0 2px 6px rgba(255,59,48,0.5)",
  },
  subItem: (active) => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    fontWeight: active ? "700" : "500",
    background: active ? `rgba(255,59,48,0.2)` : "transparent",
    color: active ? clay.lighter : clay.textMuted,
    transition: "all 0.2s ease",
    boxShadow: active
      ? `inset 0 2px 6px rgba(0,0,0,0.2), 0 1px 2px rgba(255,59,48,0.15)`
      : "none",
    borderLeft: active ? `3px solid ${clay.base}` : "3px solid transparent",
  }),
  subDot: (active) => ({
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: active ? clay.base : clay.surfaceHigher,
    flexShrink: 0,
    boxShadow: active ? `0 0 6px ${clay.base}` : "none",
    transition: "all 0.2s ease",
  }),
  logout: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    borderRadius: "16px",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "14px",
    fontWeight: "600",
    background: "rgba(255,59,48,0.08)",
    color: clay.lighter,
    boxShadow: `inset 0 1px 3px rgba(0,0,0,0.2), 0 1px 1px rgba(255,255,255,0.03)`,
    transition: "all 0.2s ease",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "12px",
    background: `linear-gradient(135deg, ${clay.surfaceHigher}, ${clay.surfaceHigh})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "800",
    color: clay.lighter,
    boxShadow: `0 4px 10px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1)`,
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    borderRadius: "16px",
    background: clay.surface,
    boxShadow: `0 4px 12px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.05)`,
    marginTop: "auto",
    marginBottom: "8px",
  },
  userName: {
    color: clay.text,
    fontSize: "13px",
    fontWeight: "700",
    lineHeight: 1.2,
  },
  userRole: {
    color: clay.textMuted,
    fontSize: "11px",
    fontWeight: "500",
  },
};

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard", badge: "3" },
  { title: "Analytics", icon: BarChart3, path: "/analytics" },
  {
    title: "Products",
    icon: ShoppingBag,
    path: "/products",
    submenu: [
      { title: "All Products", path: "/products/all" },
      { title: "Categories", path: "/products/categories" },
      { title: "Add New", path: "/products/add" },
      { title: "Inventory", path: "/products/inventory" },
    ],
  },
];

const MenuItem = ({ item, index, location, navigate, expanded, onToggle }) => {
  const [hovered, setHovered] = useState(false);
  const [logoutHovered, setLogoutHovered] = useState(false);

  const isActivePath = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");
  const isSubmenuActive = (submenu) =>
    submenu?.some((s) => location.pathname === s.path);

  const active = isActivePath(item.path) || (item.submenu && isSubmenuActive(item.submenu));
  const Icon = item.icon;

  return (
    <div>
      <button
        style={{
          ...styles.menuItem(active),
          ...(hovered && !active ? styles.menuItemHover : {}),
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => item.submenu ? onToggle(index) : navigate(item.path)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={styles.iconWrap(active)}>
            <Icon size={16} color={active ? "#FFF5F5" : clay.textMuted} />
          </div>
          {item.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {item.badge && (
            <span style={active ? styles.badge : styles.badgeInactive}>{item.badge}</span>
          )}
          {item.submenu && (
            expanded
              ? <ChevronDown size={14} color={active ? "rgba(255,245,245,0.7)" : clay.textMuted} />
              : <ChevronRight size={14} color={active ? "rgba(255,245,245,0.7)" : clay.textMuted} />
          )}
        </div>
      </button>

      {item.submenu && expanded && (
        <div style={{ marginLeft: "16px", marginTop: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {item.submenu.map((sub, si) => {
            const subActive = location.pathname === sub.path;
            return (
              <button
                key={si}
                style={styles.subItem(subActive)}
                onClick={() => navigate(sub.path)}
              >
                <div style={styles.subDot(subActive)} />
                {sub.title}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [logoutHover, setLogoutHover] = useState(false);

  const toggleSubmenu = (index) => {
    setExpandedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  useEffect(() => {
    menuItems.forEach((item, index) => {
      if (item.submenu && item.submenu.some((s) => location.pathname === s.path)) {
        setExpandedItems((prev) => ({ ...prev, [index]: true }));
      }
    });
  }, [location.pathname]);

  return (
    <>
      {/* Mobile toggle */}
      <button
        style={{
          display: "none",
          position: "fixed",
          top: "16px",
          left: "16px",
          zIndex: 50,
          padding: "8px 12px",
          borderRadius: "12px",
          background: clay.surface,
          border: "none",
          color: clay.text,
          cursor: "pointer",
          boxShadow: `0 4px 12px rgba(0,0,0,0.4)`,
        }}
        className="mobile-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      <div style={styles.sidebar}>
        {/* Ambient blobs */}
        <div style={styles.blob1} />
        <div style={styles.blob2} />

        {/* Logo */}
        <div
          style={styles.logo}
          onClick={() => navigate("/dashboard")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px) scale(1.01)";
            e.currentTarget.style.boxShadow = `0 12px 30px rgba(255,59,48,0.6), 0 4px 8px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.25)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = `0 8px 24px rgba(255,59,48,0.5), 0 2px 6px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.2)`;
          }}
        >
          <div style={styles.logoIcon}>🔥</div>
          <div>
            <div style={styles.logoText}>AdminPro</div>
            <div style={styles.logoSub}>Control Center</div>
          </div>
        </div>

        <div style={styles.sectionLabel}>Main Menu</div>

        {/* Nav Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              item={item}
              index={index}
              location={location}
              navigate={navigate}
              expanded={expandedItems[index]}
              onToggle={toggleSubmenu}
            />
          ))}
        </div>

        <div style={styles.divider} />

        {/* User card */}
        <div style={styles.userCard}>
          <div style={styles.avatar}>AP</div>
          <div style={{ flex: 1 }}>
            <div style={styles.userName}>Alex Parker</div>
            <div style={styles.userRole}>Super Admin</div>
          </div>
        </div>

        {/* Logout */}
        <button
          style={{
            ...styles.logout,
            ...(logoutHover
              ? {
                  background: "rgba(255,59,48,0.18)",
                  color: clay.lightest,
                  boxShadow: `inset 0 2px 6px rgba(0,0,0,0.25), 0 2px 8px rgba(255,59,48,0.2)`,
                }
              : {}),
          }}
          onMouseEnter={() => setLogoutHover(true)}
          onMouseLeave={() => setLogoutHover(false)}
          onClick={() => navigate("/login")}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;