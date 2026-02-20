import { useState } from 'react';
import Button from '../components/shared/Button';
import Modal from '../components/shared/Modal';
import './Classes.css';

const classesData = [
    { id: 1, name: 'CS-101 Sec A', section: 'A', department: 'CSE', subject: 'Data Structures', students: 42, teacher: 'Prof. Sharma', schedule: 'Mon/Wed/Fri, 9:00 AM', room: 'LH-101', attendance: 96, color: '#06b6d4' },
    { id: 2, name: 'EE-205 Sec B', section: 'B', department: 'ECE', subject: 'Circuit Analysis', students: 38, teacher: 'Prof. Gupta', schedule: 'Tue/Thu, 10:30 AM', room: 'LH-205', attendance: 94, color: '#8b5cf6' },
    { id: 3, name: 'CS-301', section: 'A', department: 'CSE', subject: 'Operating Systems', students: 35, teacher: 'Prof. Reddy', schedule: 'Mon/Wed, 11:00 AM', room: 'LH-301', attendance: 92, color: '#10b981' },
    { id: 4, name: 'IT-201 Sec A', section: 'A', department: 'IT', subject: 'Database Systems', students: 40, teacher: 'Prof. Patel', schedule: 'Tue/Thu/Sat, 9:00 AM', room: 'Lab-102', attendance: 90, color: '#f59e0b' },
    { id: 5, name: 'BA-401', section: 'A', department: 'MBA', subject: 'Business Analytics', students: 36, teacher: 'Prof. Singh', schedule: 'Mon/Wed/Fri, 2:00 PM', room: 'LH-501', attendance: 88, color: '#ef4444' },
    { id: 6, name: 'ME-103 Sec B', section: 'B', department: 'Mechanical', subject: 'Thermodynamics', students: 38, teacher: 'Prof. Desai', schedule: 'Tue/Thu, 8:30 AM', room: 'LH-103', attendance: 91, color: '#3b82f6' },
];

export default function Classes() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    return (
        <div className="classes-page">
            <div className="page-top animate-fade-in">
                <div>
                    <h2 className="page-heading">Courses</h2>
                    <p className="page-description">Manage courses, sections, and faculty assignments</p>
                </div>
                <div className="page-top-actions">
                    <Button variant="primary" size="md" icon="➕" onClick={() => setModalOpen(true)}>Add Course</Button>
                </div>
            </div>

            <div className="classes-stats animate-fade-in stagger-1">
                <div className="class-stat">
                    <div className="class-stat-value">{classesData.length}</div>
                    <div className="class-stat-label">Total Courses</div>
                </div>
                <div className="class-stat">
                    <div className="class-stat-value">{classesData.reduce((sum, c) => sum + c.students, 0)}</div>
                    <div className="class-stat-label">Total Students</div>
                </div>
                <div className="class-stat">
                    <div className="class-stat-value">{new Set(classesData.map(c => c.teacher)).size}</div>
                    <div className="class-stat-label">Faculty</div>
                </div>
                <div className="class-stat">
                    <div className="class-stat-value">
                        {Math.round(classesData.reduce((sum, c) => sum + c.attendance, 0) / classesData.length)}%
                    </div>
                    <div className="class-stat-label">Avg Attendance</div>
                </div>
            </div>

            <div className="classes-grid animate-fade-in stagger-2">
                {classesData.map((cls) => (
                    <div
                        key={cls.id}
                        className="class-card"
                        onClick={() => setSelectedClass(cls)}
                    >
                        <div className="class-card-accent" style={{ background: cls.color }}></div>
                        <div className="class-card-body">
                            <div className="class-card-top">
                                <div className="class-card-icon" style={{ background: `${cls.color}20`, color: cls.color }}>
                                    📚
                                </div>
                                <div className="class-card-attendance">
                                    <span className="class-card-rate">{cls.attendance}%</span>
                                    <span className="class-card-rate-label">attendance</span>
                                </div>
                            </div>

                            <h3 className="class-card-name">{cls.name}</h3>

                            <div className="class-card-details">
                                <div className="class-detail">
                                    <span className="detail-icon">👨‍🏫</span>
                                    <span>{cls.teacher}</span>
                                </div>
                                <div className="class-detail">
                                    <span className="detail-icon">👥</span>
                                    <span>{cls.students} students</span>
                                </div>
                                <div className="class-detail">
                                    <span className="detail-icon">🕐</span>
                                    <span>{cls.schedule}</span>
                                </div>
                                <div className="class-detail">
                                    <span className="detail-icon">📍</span>
                                    <span>{cls.room}</span>
                                </div>
                            </div>

                            <div className="class-card-progress">
                                <div className="class-progress-bar">
                                    <div
                                        className="class-progress-fill"
                                        style={{ width: `${cls.attendance}%`, background: cls.color }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Course" size="md">
                <div className="modal-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Department</label>
                            <select className="form-select">
                                <option value="">Select department</option>
                                <option value="CSE">Computer Science (CSE)</option>
                                <option value="ECE">Electronics & Communication (ECE)</option>
                                <option value="EEE">Electrical Engineering (EEE)</option>
                                <option value="IT">Information Technology (IT)</option>
                                <option value="ME">Mechanical Engineering (ME)</option>
                                <option value="CE">Civil Engineering (CE)</option>
                                <option value="MBA">Business Administration (MBA)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Course Code</label>
                            <input className="form-input" placeholder="e.g. CS-101, EE-205" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Subject Name</label>
                            <input className="form-input" placeholder="e.g. Data Structures" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Section</label>
                            <input className="form-input" placeholder="e.g. A, B, C" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Course Instructor</label>
                        <select className="form-select">
                            <option value="">Assign faculty</option>
                            <option value="sharma">Prof. Sharma</option>
                            <option value="gupta">Prof. Gupta</option>
                            <option value="reddy">Prof. Reddy</option>
                            <option value="patel">Prof. Patel</option>
                            <option value="singh">Prof. Singh</option>
                        </select>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Room / Hall</label>
                            <input className="form-input" placeholder="e.g. LH-301, Lab-102" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Schedule</label>
                            <input className="form-input" placeholder="e.g. Mon/Wed/Fri, 9:00 AM" />
                        </div>
                    </div>
                    <div className="form-actions">
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" icon="✓">Create Course</Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={!!selectedClass}
                onClose={() => setSelectedClass(null)}
                title={selectedClass?.name || ''}
                size="md"
            >
                {selectedClass && (
                    <div className="class-detail-modal">
                        <div className="class-detail-grid">
                            <div className="class-detail-item">
                                <span className="class-detail-label">Department</span>
                                <span className="class-detail-value">{selectedClass.department}</span>
                            </div>
                            <div className="class-detail-item">
                                <span className="class-detail-label">Subject</span>
                                <span className="class-detail-value">{selectedClass.subject}</span>
                            </div>
                            <div className="class-detail-item">
                                <span className="class-detail-label">Section</span>
                                <span className="class-detail-value">{selectedClass.section}</span>
                            </div>
                            <div className="class-detail-item">
                                <span className="class-detail-label">Instructor</span>
                                <span className="class-detail-value">{selectedClass.teacher}</span>
                            </div>
                            <div className="class-detail-item">
                                <span className="class-detail-label">Students</span>
                                <span className="class-detail-value">{selectedClass.students}</span>
                            </div>
                            <div className="class-detail-item">
                                <span className="class-detail-label">Schedule</span>
                                <span className="class-detail-value">{selectedClass.schedule}</span>
                            </div>
                            <div className="class-detail-item">
                                <span className="class-detail-label">Room</span>
                                <span className="class-detail-value">{selectedClass.room}</span>
                            </div>
                        </div>
                        <div className="class-detail-attendance">
                            <span>Attendance Rate</span>
                            <div className="class-detail-bar">
                                <div
                                    className="class-detail-fill"
                                    style={{ width: `${selectedClass.attendance}%`, background: selectedClass.color }}
                                />
                            </div>
                            <strong>{selectedClass.attendance}%</strong>
                        </div>
                        <div className="form-actions">
                            <Button variant="outline" icon="✏️">Edit</Button>
                            <Button variant="danger" icon="🗑️">Delete</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
