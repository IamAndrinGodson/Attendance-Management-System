import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Button from '../components/shared/Button';
import { useToast } from '../components/shared/Toast';
import { useAuth } from '../context/AuthContext';
import { sendAttendanceAlert } from '../services/emailService';
import './Attendance.css';

const courseOptions = [
    { value: 'CS-101A', label: 'CS-101 Sec A', teacher: 'Prof. Sharma' },
    { value: 'EE-205B', label: 'EE-205 Sec B', teacher: 'Prof. Gupta' },
    { value: 'CS-301', label: 'CS-301', teacher: 'Prof. Reddy' },
    { value: 'IT-201A', label: 'IT-201 Sec A', teacher: 'Prof. Patel' },
    { value: 'BA-401', label: 'BA-401', teacher: 'Prof. Singh' },
];

const hours = [
    { id: 1, label: 'Hour 1', time: '9:00 – 9:50' },
    { id: 2, label: 'Hour 2', time: '9:50 – 10:40' },
    { id: 3, label: 'Hour 3', time: '10:50 – 11:40' },
    { id: 4, label: 'Hour 4', time: '11:40 – 12:30' },
    { id: 5, label: 'Hour 5', time: '1:30 – 2:20' },
    { id: 6, label: 'Hour 6', time: '2:20 – 3:10' },
];

const timetable = {
    'CS-101A': {
        1: 'Data Structures', 2: 'Discrete Math', 3: 'English',
        4: 'Physics Lab', 5: 'Programming Lab', 6: 'Mentoring'
    },
    'EE-205B': {
        1: 'Circuit Analysis', 2: 'Signals & Systems', 3: 'EM Theory',
        4: 'Electronics Lab', 5: 'Math-III', 6: 'Seminar'
    },
    'CS-301': {
        1: 'Operating Systems', 2: 'Computer Networks', 3: 'DBMS',
        4: 'OS Lab', 5: 'Software Engg.', 6: 'Project Work'
    },
    'IT-201A': {
        1: 'Database Systems', 2: 'Web Technologies', 3: 'Statistics',
        4: 'DBMS Lab', 5: 'Java Programming', 6: 'Library'
    },
    'BA-401': {
        1: 'Business Analytics', 2: 'Marketing Mgmt.', 3: 'Finance',
        4: 'Case Study', 5: 'Entrepreneurship', 6: 'Placement Prep'
    },
};

const generateStudents = (cls) => {
    const names = {
        'CS-101A': ['Aarav Sharma', 'Priya Patel', 'Ishita Verma', 'Rahul Dey', 'Meera Nair', 'Siddharth Rao', 'Kavya Iyer', 'Arjun Malhotra'],
        'EE-205B': ['Arjun Kumar', 'Sneha Reddy', 'Kavya Iyer', 'Ravi Shankar', 'Nisha Gupta', 'Dev Thakur', 'Pooja Mehta', 'Sameer Khan'],
        'CS-301': ['Rohan Gupta', 'Ananya Singh', 'Vikram Shah', 'Tanya Bose', 'Harsh Vardhan', 'Riya Kapoor', 'Amit Das', 'Sunita Pillai'],
        'IT-201A': ['Diya Joshi', 'Vivaan Nair', 'Aisha Khan', 'Lakshmi Rajan', 'Nikhil Goyal', 'Tanvi Deshmukh', 'Om Prakash', 'Simran Kaur'],
        'BA-401': ['Karan Mehta', 'Aditya Rao', 'Nandini Shetty', 'Pranav Kulkarni', 'Deepa Mishra', 'Rajesh Pillai', 'Monika Agarwal', 'Suresh Kumar'],
    };
    return (names[cls] || names['CS-101A']).map((name, i) => ({
        id: i + 1,
        name,
        rollNo: `${cls}-${String(i + 1).padStart(2, '0')}`,
        avatar: name.split(' ').map(n => n[0]).join(''),
        status: null,
        arrivalTime: null,
    }));
};

const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const calendarData = [
    { date: 1, rate: 95 }, { date: 2, rate: 92 }, { date: 3, rate: 88 }, { date: 4, rate: null },
    { date: 5, rate: 94 }, { date: 6, rate: 91 }, { date: 7, rate: 96 }, { date: 8, rate: 90 },
    { date: 9, rate: null }, { date: 10, rate: 93 }, { date: 11, rate: 87 }, { date: 12, rate: 95 },
    { date: 13, rate: 92 }, { date: 14, rate: 89 }, { date: 15, rate: null }, { date: 16, rate: 94 },
    { date: 17, rate: 96 }, { date: 18, rate: 91 }, { date: 19, rate: 88 }, { date: 20, rate: 93 },
    { date: 21, rate: null }, { date: 22, rate: null }, { date: 23, rate: null }, { date: 24, rate: null },
    { date: 25, rate: null }, { date: 26, rate: null }, { date: 27, rate: null }, { date: 28, rate: null },
];

const getHeatColor = (rate) => {
    if (rate === null) return 'none';
    if (rate >= 95) return 'excellent';
    if (rate >= 90) return 'good';
    if (rate >= 80) return 'average';
    return 'poor';
};

export default function Attendance() {
    const { user } = useAuth();
    const [selectedCourse, setSelectedCourse] = useState('CS-101A');
    const [selectedHour, setSelectedHour] = useState(1);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState(generateStudents('CS-101A'));
    const [submitted, setSubmitted] = useState(false);
    const toast = useToast();

    // Students should use the My Attendance page
    if (user?.role === 'Student') {
        return <Navigate to="/my-attendance" replace />;
    }

    const currentSubject = timetable[selectedCourse]?.[selectedHour] || 'N/A';
    const currentHourInfo = hours.find(h => h.id === selectedHour);

    const handleCourseChange = (cls) => {
        setSelectedCourse(cls);
        setStudents(generateStudents(cls));
        setSubmitted(false);
    };

    const handleStatusChange = (id, status) => {
        const now = new Date();
        setStudents(prev =>
            prev.map(s => {
                if (s.id !== id) return s;
                const arrivalTime = (status === 'present' || status === 'late') ? formatTime(now) : null;
                return { ...s, status, arrivalTime };
            })
        );
    };

    const markAll = (status) => {
        const now = new Date();
        const arrivalTime = (status === 'present' || status === 'late') ? formatTime(now) : null;
        setStudents(prev => prev.map(s => ({ ...s, status, arrivalTime })));
        toast.success(`All students marked as ${status}`);
    };

    const handleSubmit = async () => {
        setSubmitted(true);
        toast.success(`Attendance submitted for ${selectedCourse} — Hour ${selectedHour} (${currentSubject})`);

        // Simulate cumulative attendance check — flag students below 75%
        // In a real app, this would use actual cumulative data from the backend
        const belowThreshold = students.filter(s => s.status === 'absent');
        if (belowThreshold.length > 0) {
            const courseLabel = courseOptions.find(c => c.value === selectedCourse)?.label || selectedCourse;
            let alertsSent = 0;
            for (const student of belowThreshold) {
                // Use a placeholder student email — in production, each student record would have an email
                const studentEmail = `${student.rollNo.toLowerCase().replace('-', '.')}@university.edu`;
                const result = await sendAttendanceAlert(
                    studentEmail,
                    student.name,
                    currentSubject,
                    70  // simulated cumulative % below threshold
                );
                if (result.success) alertsSent++;
            }
            if (alertsSent > 0) {
                toast.info(`📧 Attendance alert sent to ${alertsSent} student(s) below 75%`);
            } else {
                toast.warning('⚠️ Could not send alerts — configure EmailJS in emailService.js');
            }
        }

        setTimeout(() => setSubmitted(false), 3000);
    };

    const presentCount = students.filter(s => s.status === 'present').length;
    const absentCount = students.filter(s => s.status === 'absent').length;
    const lateCount = students.filter(s => s.status === 'late').length;
    const odCount = students.filter(s => s.status === 'od').length;
    const unmarked = students.filter(s => !s.status).length;

    return (
        <div className="attendance-page">
            <div className="page-top animate-fade-in">
                <div>
                    <h2 className="page-heading">Attendance</h2>
                    <p className="page-description">Mark and manage hour-wise attendance</p>
                </div>
            </div>

            {/* Hour Tabs */}
            <div className="hour-tabs animate-fade-in stagger-1">
                {hours.map(h => (
                    <button
                        key={h.id}
                        className={`hour-tab ${selectedHour === h.id ? 'active' : ''}`}
                        onClick={() => { setSelectedHour(h.id); setSubmitted(false); }}
                    >
                        <span className="hour-tab-label">{h.label}</span>
                        <span className="hour-tab-time">{h.time}</span>
                    </button>
                ))}
            </div>

            <div className="attendance-layout">
                {/* Mark Attendance */}
                <div className="attendance-main animate-fade-in stagger-2">
                    <div className="attendance-controls">
                        <div className="control-group">
                            <label className="control-label">Select Course</label>
                            <select
                                className="form-select"
                                value={selectedCourse}
                                onChange={(e) => handleCourseChange(e.target.value)}
                            >
                                {courseOptions.map(c => (
                                    <option key={c.value} value={c.value}>{c.label} — {c.teacher}</option>
                                ))}
                            </select>
                        </div>
                        <div className="control-group">
                            <label className="control-label">Date</label>
                            <input
                                type="date"
                                className="form-input"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Subject & Hour Info Bar */}
                    <div className="subject-info-bar">
                        <div className="subject-badge">
                            <span className="subject-badge-icon">📖</span>
                            <span className="subject-badge-name">{currentSubject}</span>
                        </div>
                        <div className="subject-hour-info">
                            <span className="subject-hour-tag">🕐 {currentHourInfo?.time}</span>
                            <span className="subject-hour-tag">📋 {currentHourInfo?.label}</span>
                        </div>
                    </div>

                    <div className="attendance-summary-bar">
                        <div className="summary-chip summary-chip--present">
                            <span className="summary-dot"></span> Present: {presentCount}
                        </div>
                        <div className="summary-chip summary-chip--absent">
                            <span className="summary-dot"></span> Absent: {absentCount}
                        </div>
                        <div className="summary-chip summary-chip--late">
                            <span className="summary-dot"></span> Late: {lateCount}
                        </div>
                        <div className="summary-chip summary-chip--od">
                            <span className="summary-dot"></span> OD: {odCount}
                        </div>
                        <div className="summary-chip summary-chip--unmarked">
                            <span className="summary-dot"></span> Unmarked: {unmarked}
                        </div>
                        <div className="summary-actions">
                            <Button variant="ghost" size="sm" onClick={() => markAll('present')}>Mark All Present</Button>
                        </div>
                    </div>

                    <div className="attendance-list">
                        {students.map((s, i) => (
                            <div key={s.id} className={`attendance-row ${s.status ? 'marked' : ''}`} style={{ animationDelay: `${i * 0.04}s` }}>
                                <div className="attendance-student">
                                    <div className="attendance-avatar">{s.avatar}</div>
                                    <div>
                                        <div className="attendance-sname">{s.name}</div>
                                        <div className="attendance-sroll">{s.rollNo}</div>
                                    </div>
                                </div>
                                <div className="attendance-row-right">
                                    {s.arrivalTime && (
                                        <div className="arrival-time">
                                            <span className="arrival-time-icon">🕐</span>
                                            <span className="arrival-time-text">{s.arrivalTime}</span>
                                        </div>
                                    )}
                                    <div className="attendance-actions">
                                        <button
                                            className={`att-btn att-btn--present ${s.status === 'present' ? 'active' : ''}`}
                                            onClick={() => handleStatusChange(s.id, 'present')}
                                        >
                                            ✓ Present
                                        </button>
                                        <button
                                            className={`att-btn att-btn--absent ${s.status === 'absent' ? 'active' : ''}`}
                                            onClick={() => handleStatusChange(s.id, 'absent')}
                                        >
                                            ✕ Absent
                                        </button>
                                        <button
                                            className={`att-btn att-btn--late ${s.status === 'late' ? 'active' : ''}`}
                                            onClick={() => handleStatusChange(s.id, 'late')}
                                        >
                                            ⏰ Late
                                        </button>
                                        <button
                                            className={`att-btn att-btn--od ${s.status === 'od' ? 'active' : ''}`}
                                            onClick={() => handleStatusChange(s.id, 'od')}
                                        >
                                            📋 OD
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="attendance-submit">
                        <Button
                            variant="primary"
                            size="lg"
                            icon={submitted ? '✓' : '📤'}
                            onClick={handleSubmit}
                            disabled={unmarked > 0}
                            fullWidth
                        >
                            {submitted ? 'Attendance Submitted!' : `Submit Attendance (${students.length - unmarked}/${students.length})`}
                        </Button>
                    </div>
                </div>

                {/* Calendar heatmap */}
                <div className="attendance-sidebar animate-fade-in stagger-3">
                    <div className="dashboard-card">
                        <div className="card-header">
                            <div>
                                <h3 className="card-title">February 2026</h3>
                                <p className="card-subtitle">Attendance heatmap</p>
                            </div>
                        </div>
                        <div className="calendar-grid">
                            <div className="calendar-header-row">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                    <div key={i} className="calendar-header-cell">{d}</div>
                                ))}
                            </div>
                            <div className="calendar-days">
                                <div className="calendar-day empty"></div>
                                {calendarData.map((d) => (
                                    <div
                                        key={d.date}
                                        className={`calendar-day calendar-day--${getHeatColor(d.rate)}`}
                                        title={d.rate ? `${d.date} Feb: ${d.rate}%` : `${d.date} Feb: No data`}
                                    >
                                        <span className="calendar-date">{d.date}</span>
                                        {d.rate && <span className="calendar-rate">{d.rate}%</span>}
                                    </div>
                                ))}
                            </div>
                            <div className="calendar-legend">
                                <div className="legend-item">
                                    <div className="legend-box legend-box--excellent"></div>
                                    <span>≥95%</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-box legend-box--good"></div>
                                    <span>90-94%</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-box legend-box--average"></div>
                                    <span>80-89%</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-box legend-box--poor"></div>
                                    <span>&lt;80%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
