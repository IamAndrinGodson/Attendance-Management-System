import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const adminNavItems = [
    {
        section: 'Main',
        items: [
            { path: '/', label: 'Dashboard', icon: '📊', badge: null },
            { path: '/attendance', label: 'Attendance', icon: '✅', badge: '3' },
            { path: '/students', label: 'Students', icon: '👨‍🎓', badge: null },
            { path: '/classes', label: 'Courses', icon: '🏫', badge: null },
        ]
    },
    {
        section: 'Analytics',
        items: [
            { path: '/reports', label: 'Reports', icon: '📈', badge: null },
        ]
    },
    {
        section: 'System',
        items: [
            { path: '/settings', label: 'Settings', icon: '⚙️', badge: null },
        ]
    }
];

const studentNavItems = [
    {
        section: 'Main',
        items: [
            { path: '/', label: 'Dashboard', icon: '📊', badge: null },
            { path: '/my-attendance', label: 'My Attendance', icon: '📋', badge: null },
        ]
    },
    {
        section: 'System',
        items: [
            { path: '/settings', label: 'Settings', icon: '⚙️', badge: null },
        ]
    }
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const navItems = user?.role === 'Student' ? studentNavItems : adminNavItems;

    return (
        <>
            <div className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`} onClick={() => setMobileOpen(false)} />
            <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <span className="sidebar-logo-text">A</span>
                    </div>
                    <div className="sidebar-brand">
                        <h1>ERP Error404</h1>
                        <span>Student Management</span>
                    </div>
                </div>

                <button
                    className="sidebar-toggle"
                    onClick={() => setCollapsed(!collapsed)}
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? '›' : '‹'}
                </button>

                <nav className="sidebar-nav">
                    {navItems.map((section) => (
                        <div key={section.section} className="nav-section">
                            <div className="nav-section-title">{section.section}</div>
                            {section.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `nav-item ${isActive ? 'active' : ''}`
                                    }
                                    end={item.path === '/'}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <span className="nav-item-icon">{item.icon}</span>
                                    <span className="nav-item-label">{item.label}</span>
                                    {item.badge && <span className="nav-item-badge badge-pulse">{item.badge}</span>}
                                    {collapsed && <span className="nav-tooltip">{item.label}</span>}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-user-avatar">
                            <span>{user?.avatar || 'U'}</span>
                            <span className="user-status-dot"></span>
                        </div>
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name">{user?.name || 'User'}</div>
                            <div className="sidebar-user-role">{user?.role || 'Guest'}</div>
                        </div>
                    </div>
                    <button
                        className="sidebar-logout-btn"
                        onClick={handleLogout}
                        title="Sign out"
                    >
                        🚪
                    </button>
                </div>
            </aside>
        </>
    );
}
