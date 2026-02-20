import { useLocation } from 'react-router-dom';
import './Header.css';

const pageTitles = {
    '/': { title: 'Dashboard', breadcrumb: 'Overview' },
    '/attendance': { title: 'Attendance', breadcrumb: 'Mark & View' },
    '/students': { title: 'Students', breadcrumb: 'Directory' },
    '/classes': { title: 'Courses', breadcrumb: 'Management' },
    '/reports': { title: 'Reports', breadcrumb: 'Analytics' },
    '/settings': { title: 'Settings', breadcrumb: 'Configuration' },
};

export default function Header({ onMobileMenuToggle }) {
    const location = useLocation();
    const currentPage = pageTitles[location.pathname] || { title: 'Page', breadcrumb: '' };

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <header className="header">
            <div className="header-left">
                <button className="mobile-menu-btn" onClick={onMobileMenuToggle}>
                    ☰
                </button>
                <div className="header-title-section">
                    <div className="header-breadcrumb">
                        <span>AMS</span>
                        <span className="breadcrumb-sep">/</span>
                        <span className="breadcrumb-active">{currentPage.breadcrumb}</span>
                    </div>
                    <h2 className="header-title">{currentPage.title}</h2>
                </div>
            </div>

            <div className="header-right">
                <div className="header-search">
                    <span className="header-search-icon">🔍</span>
                    <input type="text" placeholder="Search students, courses..." />
                </div>

                <div className="header-date">
                    📅 {today}
                </div>

                <button className="header-icon-btn" title="Notifications">
                    🔔
                    <span className="notification-dot badge-pulse"></span>
                </button>
            </div>
        </header>
    );
}
