import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DynamicBackground from './DynamicBackground';
import './Layout.css';

export default function Layout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="layout">
            <DynamicBackground />

            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />
            <div className={`layout-main ${collapsed ? 'sidebar-collapsed' : ''}`}>
                <Header onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />
                <main className="layout-content" key={location.pathname}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
