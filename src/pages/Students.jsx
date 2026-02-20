import { useState } from 'react';
import DataTable from '../components/shared/DataTable';
import Button from '../components/shared/Button';
import Modal from '../components/shared/Modal';
import './Students.css';

const studentsData = [
    { id: 1, name: 'Aarav Sharma', rollNo: 'CSE-2024-001', class: 'CS-101', email: 'aarav@university.edu', phone: '+91 98765 43210', attendance: 96, status: 'active', avatar: 'AS' },
    { id: 2, name: 'Priya Patel', rollNo: 'CSE-2024-002', class: 'CS-101', email: 'priya@university.edu', phone: '+91 98765 43211', attendance: 92, status: 'active', avatar: 'PP' },
    { id: 3, name: 'Arjun Kumar', rollNo: 'ECE-2024-003', class: 'EE-205', email: 'arjun@university.edu', phone: '+91 98765 43212', attendance: 88, status: 'active', avatar: 'AK' },
    { id: 4, name: 'Sneha Reddy', rollNo: 'ECE-2024-004', class: 'EE-205', email: 'sneha@university.edu', phone: '+91 98765 43213', attendance: 94, status: 'active', avatar: 'SR' },
    { id: 5, name: 'Rohan Gupta', rollNo: 'CSE-2023-005', class: 'CS-301', email: 'rohan@university.edu', phone: '+91 98765 43214', attendance: 78, status: 'warning', avatar: 'RG' },
    { id: 6, name: 'Ananya Singh', rollNo: 'CSE-2023-006', class: 'CS-301', email: 'ananya@university.edu', phone: '+91 98765 43215', attendance: 97, status: 'active', avatar: 'AS' },
    { id: 7, name: 'Karan Mehta', rollNo: 'MBA-2022-007', class: 'BA-401', email: 'karan@university.edu', phone: '+91 98765 43216', attendance: 65, status: 'danger', avatar: 'KM' },
    { id: 8, name: 'Diya Joshi', rollNo: 'IT-2024-008', class: 'IT-201', email: 'diya@university.edu', phone: '+91 98765 43217', attendance: 91, status: 'active', avatar: 'DJ' },
    { id: 9, name: 'Vivaan Nair', rollNo: 'IT-2024-009', class: 'IT-201', email: 'vivaan@university.edu', phone: '+91 98765 43218', attendance: 85, status: 'active', avatar: 'VN' },
    { id: 10, name: 'Ishita Verma', rollNo: 'CSE-2024-010', class: 'CS-101', email: 'ishita@university.edu', phone: '+91 98765 43219', attendance: 93, status: 'active', avatar: 'IV' },
    { id: 11, name: 'Aditya Rao', rollNo: 'MBA-2022-011', class: 'BA-401', email: 'aditya@university.edu', phone: '+91 98765 43220', attendance: 72, status: 'warning', avatar: 'AR' },
    { id: 12, name: 'Kavya Iyer', rollNo: 'ECE-2024-012', class: 'EE-205', email: 'kavya@university.edu', phone: '+91 98765 43221', attendance: 90, status: 'active', avatar: 'KI' },
];

const columns = [
    {
        key: 'name',
        label: 'Student',
        render: (val, row) => (
            <div className="student-cell">
                <div className={`student-avatar student-avatar--${row.status}`}>{row.avatar}</div>
                <div>
                    <div className="student-name">{val}</div>
                    <div className="student-roll">{row.rollNo}</div>
                </div>
            </div>
        ),
    },
    { key: 'class', label: 'Course' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    {
        key: 'attendance',
        label: 'Attendance',
        render: (val) => (
            <div className="attendance-cell">
                <div className="attendance-bar-bg">
                    <div
                        className={`attendance-bar-fill ${val >= 90 ? 'good' : val >= 75 ? 'warning' : 'danger'}`}
                        style={{ width: `${val}%` }}
                    />
                </div>
                <span className={`attendance-val ${val >= 90 ? 'good' : val >= 75 ? 'warning' : 'danger'}`}>
                    {val}%
                </span>
            </div>
        ),
    },
    {
        key: 'status',
        label: 'Status',
        render: (val) => (
            <span className={`status-badge status-badge--${val}`}>
                {val === 'active' ? 'Active' : val === 'warning' ? 'Low Attendance' : 'Critical'}
            </span>
        ),
    },
];

export default function Students() {
    const [modalOpen, setModalOpen] = useState(false);
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all' ? studentsData : studentsData.filter(s => s.status === filter);

    return (
        <div className="students-page">
            <div className="page-top animate-fade-in">
                <div>
                    <h2 className="page-heading">Student Directory</h2>
                    <p className="page-description">Manage and view all enrolled students</p>
                </div>
                <div className="page-top-actions">
                    <Button variant="secondary" size="md" icon="📥">Import CSV</Button>
                    <Button variant="primary" size="md" icon="➕" onClick={() => setModalOpen(true)}>Add Student</Button>
                </div>
            </div>

            <div className="students-filters animate-fade-in stagger-1">
                <button className={`filter-chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                    All Students <span className="filter-count">{studentsData.length}</span>
                </button>
                <button className={`filter-chip ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>
                    Active <span className="filter-count">{studentsData.filter(s => s.status === 'active').length}</span>
                </button>
                <button className={`filter-chip ${filter === 'warning' ? 'active' : ''}`} onClick={() => setFilter('warning')}>
                    Low Attendance <span className="filter-count">{studentsData.filter(s => s.status === 'warning').length}</span>
                </button>
                <button className={`filter-chip ${filter === 'danger' ? 'active' : ''}`} onClick={() => setFilter('danger')}>
                    Critical <span className="filter-count">{studentsData.filter(s => s.status === 'danger').length}</span>
                </button>
            </div>

            <div className="animate-fade-in stagger-2">
                <DataTable columns={columns} data={filtered} pageSize={8} />
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Student" size="md">
                <div className="modal-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input className="form-input" placeholder="First name" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input className="form-input" placeholder="Last name" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Course</label>
                            <select className="form-select">
                                <option value="">Select course</option>
                                <option value="CS-101">CS-101 — Data Structures</option>
                                <option value="EE-205">EE-205 — Circuit Analysis</option>
                                <option value="CS-301">CS-301 — Operating Systems</option>
                                <option value="IT-201">IT-201 — Database Systems</option>
                                <option value="BA-401">BA-401 — Business Analytics</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Enrollment No.</label>
                            <input className="form-input" placeholder="e.g. CSE-2024-013" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input className="form-input" type="email" placeholder="student@university.edu" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input className="form-input" type="tel" placeholder="+91 98765 43210" />
                    </div>
                    <div className="form-actions">
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" icon="✓">Add Student</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

