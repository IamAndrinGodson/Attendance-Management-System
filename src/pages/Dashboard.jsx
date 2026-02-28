import { useState, useEffect } from 'react';
import StatCard from '../components/shared/StatCard';
import Button from '../components/shared/Button';
import AnimatedCounter from '../components/shared/AnimatedCounter';
import { useToast } from '../components/shared/Toast';
import { SkeletonCard, SkeletonRow } from '../components/shared/Skeleton';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const recentActivity = [
    { id: 1, action: 'Attendance marked', target: 'CS-101 Sec A', user: 'Prof. Sharma', time: '2 min ago', icon: '✅' },
    { id: 2, action: 'New student registered', target: 'Priya Patel', user: 'Admin', time: '15 min ago', icon: '👤' },
    { id: 3, action: 'Report generated', target: 'Monthly Summary', user: 'Prof. Gupta', time: '1 hr ago', icon: '📄' },
    { id: 4, action: 'Attendance marked', target: 'EE-205 Sec B', user: 'Prof. Reddy', time: '2 hrs ago', icon: '✅' },
    { id: 5, action: 'Course created', target: 'CS-301', user: 'Admin', time: '3 hrs ago', icon: '🏫' },
    { id: 6, action: 'Student transferred', target: 'Arjun Kumar', user: 'Admin', time: '5 hrs ago', icon: '🔄' },
];

const weeklyData = [
    { day: 'Mon', present: 92, absent: 8 },
    { day: 'Tue', present: 88, absent: 12 },
    { day: 'Wed', present: 95, absent: 5 },
    { day: 'Thu', present: 90, absent: 10 },
    { day: 'Fri', present: 85, absent: 15 },
];

const topClasses = [
    { name: 'CS-101 Sec A', rate: 96, students: 42, teacher: 'Prof. Sharma' },
    { name: 'EE-205 Sec B', rate: 94, students: 38, teacher: 'Prof. Gupta' },
    { name: 'CS-301', rate: 92, students: 35, teacher: 'Prof. Reddy' },
    { name: 'IT-201 Sec A', rate: 90, students: 40, teacher: 'Prof. Patel' },
    { name: 'BA-401', rate: 88, students: 36, teacher: 'Prof. Singh' },
];

export default function Dashboard() {
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate data loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const handleQuickAction = (label) => {
        toast.success(`${label} — opening soon!`);
    };

    return (
        <div className="dashboard">
            {/* Stats Row */}
            <div className="dashboard-stats">
                {isLoading ? (
                    <>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </>
                ) : (
                    <>
                        <div className="animate-fade-in stagger-1">
                            <StatCard
                                icon="👨‍🎓"
                                title="Total Students"
                                value={<AnimatedCounter value="1,247" />}
                                trend={5.2}
                                trendLabel="vs last month"
                                color="accent"
                            />
                        </div>
                        <div className="animate-fade-in stagger-2">
                            <StatCard
                                icon="✅"
                                title="Present Today"
                                value={<AnimatedCounter value="1,128" />}
                                trend={2.1}
                                trendLabel="vs yesterday"
                                color="success"
                            />
                        </div>
                        <div className="animate-fade-in stagger-3">
                            <StatCard
                                icon="❌"
                                title="Absent Today"
                                value={<AnimatedCounter value="119" />}
                                trend={-3.4}
                                trendLabel="vs yesterday"
                                color="danger"
                            />
                        </div>
                        <div className="animate-fade-in stagger-4">
                            <StatCard
                                icon="📊"
                                title="Attendance Rate"
                                value={<AnimatedCounter value="90.5" suffix="%" />}
                                trend={1.8}
                                trendLabel="vs last week"
                                color="info"
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Main Content */}
            <div className="dashboard-grid">
                {/* Weekly Chart */}
                <div className="dashboard-card dashboard-chart glass-hover animate-fade-in stagger-2">
                    <div className="card-header">
                        <div>
                            <h3 className="card-title">Weekly Attendance</h3>
                            <p className="card-subtitle">This week's attendance overview</p>
                        </div>
                        <div className="card-actions">
                            <Button variant="ghost" size="sm">This Week</Button>
                        </div>
                    </div>
                    <div className="chart-container" style={{ height: '240px' }}>
                        {isLoading ? (
                            <SkeletonCard />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)' }}
                                        itemStyle={{ color: 'var(--text-primary)' }}
                                    />
                                    <Area type="monotone" dataKey="present" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorPresent)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Top Classes */}
                <div className="dashboard-card dashboard-leaderboard glass-hover animate-fade-in stagger-3">
                    <div className="card-header">
                        <div>
                            <h3 className="card-title">Top Courses</h3>
                            <p className="card-subtitle">By attendance rate</p>
                        </div>
                    </div>
                    <div className="leaderboard-list">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                        ) : (
                            topClasses.map((cls, i) => (
                                <div key={cls.name} className="leaderboard-item" style={{ animationDelay: `${0.4 + i * 0.08}s` }}>
                                    <div className="leaderboard-rank">#{i + 1}</div>
                                    <div className="leaderboard-info">
                                        <div className="leaderboard-name">{cls.name}</div>
                                        <div className="leaderboard-meta">{cls.students} students • {cls.teacher}</div>
                                    </div>
                                    <div className="leaderboard-rate">
                                        <div className="leaderboard-bar-bg">
                                            <div
                                                className="leaderboard-bar-fill"
                                                style={{ width: `${cls.rate}%` }}
                                            />
                                        </div>
                                        <span className="leaderboard-percent">{cls.rate}%</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="dashboard-card dashboard-activity glass-hover animate-fade-in stagger-4">
                    <div className="card-header">
                        <div>
                            <h3 className="card-title">Recent Activity</h3>
                            <p className="card-subtitle">Latest actions in the system</p>
                        </div>
                        <Button variant="ghost" size="sm">View All</Button>
                    </div>
                    <div className="activity-list">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                        ) : (
                            recentActivity.map((item, i) => (
                                <div key={item.id} className="activity-item activity-item-animate" style={{ animationDelay: `${0.5 + i * 0.07}s` }}>
                                    <div className="activity-icon">{item.icon}</div>
                                    <div className="activity-content">
                                        <div className="activity-text">
                                            <strong>{item.action}</strong> — {item.target}
                                        </div>
                                        <div className="activity-meta">
                                            {item.user} • {item.time}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="dashboard-card dashboard-quick-actions glass-hover animate-fade-in stagger-5">
                    <div className="card-header">
                        <div>
                            <h3 className="card-title">Quick Actions</h3>
                            <p className="card-subtitle">Common tasks</p>
                        </div>
                    </div>
                    <div className="quick-actions-grid">
                        {[
                            { icon: '✅', label: 'Mark Attendance' },
                            { icon: '👤', label: 'Add Student' },
                            { icon: '📊', label: 'Generate Report' },
                            { icon: '📧', label: 'Send Notices' },
                            { icon: '🏫', label: 'Manage Courses' },
                            { icon: '⚙️', label: 'Settings' },
                        ].map((action, i) => (
                            <button
                                key={action.label}
                                className="quick-action-btn tilt-hover"
                                style={{ animationDelay: `${0.6 + i * 0.05}s` }}
                                onClick={() => handleQuickAction(action.label)}
                            >
                                <span className="quick-action-icon">{action.icon}</span>
                                <span className="quick-action-label">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="dashboard-footer">
                A Project by <span className="dashboard-footer-brand">Error404</span>
            </footer>
        </div>
    );
}
