import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './StudentAttendance.css';

const subjects = [
    { name: 'Data Structures', code: 'CS-101', total: 45, present: 42, absent: 1, late: 1, od: 1 },
    { name: 'Discrete Math', code: 'MA-102', total: 44, present: 38, absent: 4, late: 2, od: 0 },
    { name: 'English', code: 'EN-101', total: 40, present: 37, absent: 2, late: 1, od: 0 },
    { name: 'Physics Lab', code: 'PH-103', total: 20, present: 18, absent: 1, late: 1, od: 0 },
    { name: 'Programming Lab', code: 'CS-104', total: 22, present: 21, absent: 0, late: 1, od: 0 },
    { name: 'Mentoring', code: 'MN-100', total: 18, present: 17, absent: 0, late: 0, od: 1 },
];

const todaySchedule = [
    { hour: 1, time: '9:00 – 9:50', subject: 'Data Structures', status: 'present', arrivalTime: '8:57 AM' },
    { hour: 2, time: '9:50 – 10:40', subject: 'Discrete Math', status: 'present', arrivalTime: '9:48 AM' },
    { hour: 3, time: '10:50 – 11:40', subject: 'English', status: 'late', arrivalTime: '11:02 AM' },
    { hour: 4, time: '11:40 – 12:30', subject: 'Physics Lab', status: 'present', arrivalTime: '11:38 AM' },
    { hour: 5, time: '1:30 – 2:20', subject: 'Programming Lab', status: null, arrivalTime: null },
    { hour: 6, time: '2:20 – 3:10', subject: 'Mentoring', status: null, arrivalTime: null },
];

const getStatusLabel = (status) => {
    if (!status) return 'Upcoming';
    const map = { present: 'Present', absent: 'Absent', late: 'Late', od: 'On Duty' };
    return map[status] || status;
};

const getStatusClass = (status) => {
    if (!status) return 'upcoming';
    return status;
};

export default function StudentAttendance() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('today');

    const totalClasses = subjects.reduce((s, sub) => s + sub.total, 0);
    const totalPresent = subjects.reduce((s, sub) => s + sub.present, 0);
    const totalAbsent = subjects.reduce((s, sub) => s + sub.absent, 0);
    const totalLate = subjects.reduce((s, sub) => s + sub.late, 0);
    const totalOD = subjects.reduce((s, sub) => s + sub.od, 0);
    const overallPercent = Math.round(((totalPresent + totalLate + totalOD) / totalClasses) * 100);

    return (
        <div className="stu-att-page">
            <div className="page-top animate-fade-in">
                <div>
                    <h2 className="page-heading">My Attendance</h2>
                    <p className="page-description">View your attendance records by subject and hour</p>
                </div>
                <div className="stu-att-student-info">
                    <div className="stu-att-avatar">{user?.avatar || 'U'}</div>
                    <div>
                        <div className="stu-att-name">{user?.name || 'Student'}</div>
                        <div className="stu-att-role">CSE — Semester IV</div>
                    </div>
                </div>
            </div>

            {/* Overall Stats */}
            <div className="stu-att-stats animate-fade-in stagger-1">
                <div className="stu-att-stat stu-att-stat--accent">
                    <div className="stu-att-stat-value">{overallPercent}%</div>
                    <div className="stu-att-stat-label">Overall</div>
                </div>
                <div className="stu-att-stat stu-att-stat--success">
                    <div className="stu-att-stat-value">{totalPresent}</div>
                    <div className="stu-att-stat-label">Present</div>
                </div>
                <div className="stu-att-stat stu-att-stat--danger">
                    <div className="stu-att-stat-value">{totalAbsent}</div>
                    <div className="stu-att-stat-label">Absent</div>
                </div>
                <div className="stu-att-stat stu-att-stat--warning">
                    <div className="stu-att-stat-value">{totalLate}</div>
                    <div className="stu-att-stat-label">Late</div>
                </div>
                <div className="stu-att-stat stu-att-stat--info">
                    <div className="stu-att-stat-value">{totalOD}</div>
                    <div className="stu-att-stat-label">OD</div>
                </div>
            </div>

            {/* Tab toggle */}
            <div className="stu-att-tabs animate-fade-in stagger-2">
                <button className={`stu-att-tab ${activeTab === 'today' ? 'active' : ''}`} onClick={() => setActiveTab('today')}>
                    📅 Today's Schedule
                </button>
                <button className={`stu-att-tab ${activeTab === 'subjects' ? 'active' : ''}`} onClick={() => setActiveTab('subjects')}>
                    📚 Subject-wise
                </button>
            </div>

            {activeTab === 'today' && (
                <div className="stu-att-today animate-fade-in">
                    <div className="stu-att-today-header">
                        <h3>Today — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
                    </div>
                    <div className="stu-att-timeline">
                        {todaySchedule.map((slot, i) => (
                            <div key={slot.hour} className={`timeline-item timeline-item--${getStatusClass(slot.status)}`} style={{ animationDelay: `${i * 0.08}s` }}>
                                <div className="timeline-line">
                                    <div className={`timeline-dot timeline-dot--${getStatusClass(slot.status)}`} />
                                    {i < todaySchedule.length - 1 && <div className="timeline-connector" />}
                                </div>
                                <div className="timeline-content">
                                    <div className="timeline-hour">Hour {slot.hour}</div>
                                    <div className="timeline-subject">{slot.subject}</div>
                                    <div className="timeline-time">{slot.time}</div>
                                    <div className="timeline-bottom">
                                        <span className={`timeline-status timeline-status--${getStatusClass(slot.status)}`}>
                                            {getStatusLabel(slot.status)}
                                        </span>
                                        {slot.arrivalTime && (
                                            <span className="timeline-arrival">🕐 {slot.arrivalTime}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'subjects' && (
                <div className="stu-att-subjects animate-fade-in">
                    {subjects.map((sub, i) => {
                        const attended = sub.present + sub.late + sub.od;
                        const pct = Math.round((attended / sub.total) * 100);
                        const status = pct >= 90 ? 'good' : pct >= 75 ? 'warning' : 'danger';
                        return (
                            <div key={sub.code} className="subject-card" style={{ animationDelay: `${i * 0.06}s` }}>
                                <div className="subject-card-top">
                                    <div>
                                        <div className="subject-card-name">{sub.name}</div>
                                        <div className="subject-card-code">{sub.code}</div>
                                    </div>
                                    <div className={`subject-card-pct subject-card-pct--${status}`}>{pct}%</div>
                                </div>
                                <div className="subject-card-bar">
                                    <div className={`subject-card-fill subject-card-fill--${status}`} style={{ width: `${pct}%` }} />
                                </div>
                                <div className="subject-card-stats">
                                    <span className="scs scs--present">✓ {sub.present}</span>
                                    <span className="scs scs--absent">✕ {sub.absent}</span>
                                    <span className="scs scs--late">⏰ {sub.late}</span>
                                    <span className="scs scs--od">📋 {sub.od}</span>
                                    <span className="scs scs--total">Total: {sub.total}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
