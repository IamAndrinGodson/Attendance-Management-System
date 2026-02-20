import { useState } from 'react';
import Button from '../components/shared/Button';
import { useToast } from '../components/shared/Toast';
import './Settings.css';

export default function Settings() {
    const [collegeName, setCollegeName] = useState('Greenwood Institute of Technology');
    const [collegeEmail, setCollegeEmail] = useState('admin@greenwood.edu');
    const [lateThreshold, setLateThreshold] = useState('15');
    const [minAttendance, setMinAttendance] = useState('75');
    const [notifyParents, setNotifyParents] = useState(true);
    const [notifyTeachers, setNotifyTeachers] = useState(true);
    const [weeklyReport, setWeeklyReport] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [saved, setSaved] = useState(false);
    const toast = useToast();

    const workingDays = [
        { day: 'Monday', enabled: true },
        { day: 'Tuesday', enabled: true },
        { day: 'Wednesday', enabled: true },
        { day: 'Thursday', enabled: true },
        { day: 'Friday', enabled: true },
        { day: 'Saturday', enabled: false },
        { day: 'Sunday', enabled: false },
    ];

    const [days, setDays] = useState(workingDays);

    const toggleDay = (index) => {
        setDays(prev => prev.map((d, i) => i === index ? { ...d, enabled: !d.enabled } : d));
    };

    const handleSave = () => {
        setSaved(true);
        toast.success('Settings saved successfully!');
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="settings-page">
            <div className="page-top animate-fade-in">
                <div>
                    <h2 className="page-heading">Settings</h2>
                    <p className="page-description">Configure system preferences and institution information</p>
                </div>
                <div className="page-top-actions">
                    <Button variant="primary" size="md" icon={saved ? '✓' : '💾'} onClick={handleSave}>
                        {saved ? 'Saved!' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <div className="settings-grid">
                {/* School Profile */}
                <div className="settings-card animate-fade-in stagger-1">
                    <div className="settings-card-header">
                        <span className="settings-card-icon">🏫</span>
                        <div>
                            <h3 className="settings-card-title">College Profile</h3>
                            <p className="settings-card-desc">Basic institution information</p>
                        </div>
                    </div>
                    <div className="settings-card-body">
                        <div className="form-group">
                            <label className="form-label">College Name</label>
                            <input className="form-input" value={collegeName} onChange={(e) => setCollegeName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Admin Email</label>
                            <input className="form-input" type="email" value={collegeEmail} onChange={(e) => setCollegeEmail(e.target.value)} />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Academic Year</label>
                                <select className="form-select">
                                    <option>2025-2026</option>
                                    <option>2026-2027</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Time Zone</label>
                                <select className="form-select">
                                    <option>Asia/Kolkata (IST)</option>
                                    <option>America/New_York (EST)</option>
                                    <option>Europe/London (GMT)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendance Rules */}
                <div className="settings-card animate-fade-in stagger-2">
                    <div className="settings-card-header">
                        <span className="settings-card-icon">📋</span>
                        <div>
                            <h3 className="settings-card-title">Attendance Rules</h3>
                            <p className="settings-card-desc">Configure thresholds and policies</p>
                        </div>
                    </div>
                    <div className="settings-card-body">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Late Threshold (minutes)</label>
                                <input className="form-input" type="number" value={lateThreshold} onChange={(e) => setLateThreshold(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Minimum Attendance %</label>
                                <input className="form-input" type="number" value={minAttendance} onChange={(e) => setMinAttendance(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Attendance Marking Window</label>
                            <select className="form-select">
                                <option>First 30 minutes of class</option>
                                <option>First 15 minutes of class</option>
                                <option>Entire class period</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Working Days */}
                <div className="settings-card animate-fade-in stagger-3">
                    <div className="settings-card-header">
                        <span className="settings-card-icon">📅</span>
                        <div>
                            <h3 className="settings-card-title">Working Days</h3>
                            <p className="settings-card-desc">Set active college days</p>
                        </div>
                    </div>
                    <div className="settings-card-body">
                        <div className="working-days-grid">
                            {days.map((d, i) => (
                                <button
                                    key={d.day}
                                    className={`working-day-btn ${d.enabled ? 'active' : ''}`}
                                    onClick={() => toggleDay(i)}
                                >
                                    <span className="working-day-name">{d.day}</span>
                                    <span className="working-day-toggle">
                                        <span className={`toggle-track ${d.enabled ? 'on' : ''}`}>
                                            <span className="toggle-thumb"></span>
                                        </span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="settings-card animate-fade-in stagger-4">
                    <div className="settings-card-header">
                        <span className="settings-card-icon">🔔</span>
                        <div>
                            <h3 className="settings-card-title">Notifications</h3>
                            <p className="settings-card-desc">Email and alert preferences</p>
                        </div>
                    </div>
                    <div className="settings-card-body">
                        <div className="toggle-row" onClick={() => setNotifyParents(!notifyParents)}>
                            <div>
                                <div className="toggle-title">Notify Parents</div>
                                <div className="toggle-desc">Send email to parents when student is absent</div>
                            </div>
                            <span className={`toggle-track ${notifyParents ? 'on' : ''}`}>
                                <span className="toggle-thumb"></span>
                            </span>
                        </div>
                        <div className="toggle-row" onClick={() => setNotifyTeachers(!notifyTeachers)}>
                            <div>
                                <div className="toggle-title">Notify Teachers</div>
                                <div className="toggle-desc">Alert course faculty for low attendance students</div>
                            </div>
                            <span className={`toggle-track ${notifyTeachers ? 'on' : ''}`}>
                                <span className="toggle-thumb"></span>
                            </span>
                        </div>
                        <div className="toggle-row" onClick={() => setWeeklyReport(!weeklyReport)}>
                            <div>
                                <div className="toggle-title">Weekly Report</div>
                                <div className="toggle-desc">Auto-generate and send weekly attendance reports</div>
                            </div>
                            <span className={`toggle-track ${weeklyReport ? 'on' : ''}`}>
                                <span className="toggle-thumb"></span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
