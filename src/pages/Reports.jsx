import { useState } from 'react';
import Button from '../components/shared/Button';
import './Reports.css';

const classReportData = [
    { name: 'CS-101 Sec A', present: 96, absent: 4, late: 2, students: 42 },
    { name: 'EE-205 Sec B', present: 94, absent: 6, late: 3, students: 38 },
    { name: 'CS-301', present: 92, absent: 8, late: 4, students: 35 },
    { name: 'IT-201 Sec A', present: 90, absent: 10, late: 5, students: 40 },
    { name: 'BA-401', present: 88, absent: 12, late: 6, students: 36 },
    { name: 'ME-103 Sec B', present: 91, absent: 9, late: 4, students: 38 },
];

const monthlyTrend = [
    { month: 'Sep', rate: 91 },
    { month: 'Oct', rate: 93 },
    { month: 'Nov', rate: 89 },
    { month: 'Dec', rate: 85 },
    { month: 'Jan', rate: 92 },
    { month: 'Feb', rate: 90 },
];

export default function Reports() {
    const [dateRange, setDateRange] = useState('this-month');
    const [selectedClass, setSelectedClass] = useState('all');

    const avgRate = Math.round(classReportData.reduce((s, c) => s + c.present, 0) / classReportData.length);
    const totalStudents = classReportData.reduce((s, c) => s + c.students, 0);

    return (
        <div className="reports-page">
            <div className="page-top animate-fade-in">
                <div>
                    <h2 className="page-heading">Reports & Analytics</h2>
                    <p className="page-description">Comprehensive attendance analytics and insights</p>
                </div>
                <div className="page-top-actions">
                    <Button variant="secondary" size="md" icon="📄">Export PDF</Button>
                    <Button variant="primary" size="md" icon="📊">Export CSV</Button>
                </div>
            </div>

            {/* Filters */}
            <div className="reports-filters animate-fade-in stagger-1">
                <div className="filter-group">
                    <label className="control-label">Date Range</label>
                    <select className="form-select" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                        <option value="today">Today</option>
                        <option value="this-week">This Week</option>
                        <option value="this-month">This Month</option>
                        <option value="last-month">Last Month</option>
                        <option value="this-year">This Year</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label className="control-label">Course</label>
                    <select className="form-select" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                        <option value="all">All Courses</option>
                        {classReportData.map(c => (
                            <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="reports-summary animate-fade-in stagger-2">
                <div className="report-stat-card">
                    <div className="report-stat-icon">📊</div>
                    <div className="report-stat-info">
                        <div className="report-stat-value">{avgRate}%</div>
                        <div className="report-stat-label">Average Attendance</div>
                    </div>
                </div>
                <div className="report-stat-card">
                    <div className="report-stat-icon">👥</div>
                    <div className="report-stat-info">
                        <div className="report-stat-value">{totalStudents}</div>
                        <div className="report-stat-label">Total Students</div>
                    </div>
                </div>
                <div className="report-stat-card">
                    <div className="report-stat-icon">🏫</div>
                    <div className="report-stat-info">
                        <div className="report-stat-value">{classReportData.length}</div>
                        <div className="report-stat-label">Active Courses</div>
                    </div>
                </div>
                <div className="report-stat-card">
                    <div className="report-stat-icon">📅</div>
                    <div className="report-stat-info">
                        <div className="report-stat-value">20</div>
                        <div className="report-stat-label">Working Days</div>
                    </div>
                </div>
            </div>

            <div className="reports-grid">
                {/* Monthly Trend */}
                <div className="dashboard-card animate-fade-in stagger-3">
                    <div className="card-header">
                        <div>
                            <h3 className="card-title">Monthly Trend</h3>
                            <p className="card-subtitle">Attendance rate over time</p>
                        </div>
                    </div>
                    <div className="trend-chart">
                        <div className="trend-y-axis">
                            {[100, 90, 80, 70].map(v => (
                                <span key={v} className="trend-y-label">{v}%</span>
                            ))}
                        </div>
                        <div className="trend-bars">
                            {monthlyTrend.map((m) => (
                                <div key={m.month} className="trend-bar-group">
                                    <div className="trend-bar-container">
                                        <div
                                            className="trend-bar"
                                            style={{ height: `${(m.rate - 60) * 2.5}%` }}
                                        >
                                            <span className="trend-bar-value">{m.rate}%</span>
                                        </div>
                                    </div>
                                    <span className="trend-bar-label">{m.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Class Breakdown */}
                <div className="dashboard-card animate-fade-in stagger-4">
                    <div className="card-header">
                        <div>
                            <h3 className="card-title">Course Breakdown</h3>
                            <p className="card-subtitle">Attendance by course</p>
                        </div>
                    </div>
                    <div className="breakdown-list">
                        {classReportData.map((cls) => (
                            <div key={cls.name} className="breakdown-item">
                                <div className="breakdown-info">
                                    <span className="breakdown-name">{cls.name}</span>
                                    <span className="breakdown-students">{cls.students} students</span>
                                </div>
                                <div className="breakdown-bars">
                                    <div className="breakdown-bar-track">
                                        <div className="breakdown-bar-present" style={{ width: `${cls.present}%` }}></div>
                                    </div>
                                    <div className="breakdown-stats">
                                        <span className="bstat bstat--present">✓ {cls.present}%</span>
                                        <span className="bstat bstat--absent">✕ {cls.absent}%</span>
                                        <span className="bstat bstat--late">⏰ {cls.late}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Insights */}
                <div className="dashboard-card reports-insights animate-fade-in stagger-5">
                    <div className="card-header">
                        <div>
                            <h3 className="card-title">Key Insights</h3>
                            <p className="card-subtitle">AI-generated observations</p>
                        </div>
                    </div>
                    <div className="insights-list">
                        <div className="insight-item insight-item--success">
                            <div className="insight-icon">📈</div>
                            <div>
                                <div className="insight-title">Attendance Improving</div>
                                <div className="insight-desc">Overall attendance has increased by 2.1% compared to last month.</div>
                            </div>
                        </div>
                        <div className="insight-item insight-item--warning">
                            <div className="insight-icon">⚠️</div>
                            <div>
                                <div className="insight-title">Friday Dip</div>
                                <div className="insight-desc">Attendance drops by ~7% on Fridays consistently. Consider engagement activities.</div>
                            </div>
                        </div>
                        <div className="insight-item insight-item--danger">
                            <div className="insight-icon">🚨</div>
                            <div>
                                <div className="insight-title">Critical Students</div>
                                <div className="insight-desc">3 students have attendance below 70%. Immediate intervention recommended.</div>
                            </div>
                        </div>
                        <div className="insight-item insight-item--info">
                            <div className="insight-icon">💡</div>
                            <div>
                                <div className="insight-title">Best Performing</div>
                                <div className="insight-desc">CS-101 Sec A leads with 96% attendance rate this month.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
