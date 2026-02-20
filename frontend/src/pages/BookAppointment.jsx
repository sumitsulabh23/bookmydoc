import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const DEPARTMENT_DOCTORS = {
    'Cardiology': ['Dr. Arjun Mehta', 'Dr. Priya Sharma', 'Dr. Rohit Kapoor'],
    'Dermatology': ['Dr. Ananya Iyer', 'Dr. Vikram Sinha', 'Dr. Neha Malhotra'],
    'Endocrinology': ['Dr. Kunal Verma', 'Dr. Shreya Nair', 'Dr. Manish Reddy'],
    'Gastroenterology': ['Dr. Amit Desai', 'Dr. Pooja Bhatia', 'Dr. Sandeep Khanna'],
    'General Medicine': ['Dr. Rajesh Gupta', 'Dr. Sneha Kulkarni', 'Dr. Aditya Rao'],
    'Neurology': ['Dr. Vivek Menon', 'Dr. Kavya Pillai', 'Dr. Nitin Joshi'],
    'Oncology': ['Dr. Radhika Sen', 'Dr. Harshvardhan Singh', 'Dr. Meenal Agarwal'],
    'Orthopedics': ['Dr. Deepak Yadav', 'Dr. Swati Mishra', 'Dr. Anil Choudhary'],
    'Pediatrics': ['Dr. Aarti Sharma', 'Dr. Rohan Mallick', 'Dr. Ishita Banerjee'],
    'Psychiatry': ['Dr. Sameer Khan', 'Dr. Divya Anand', 'Dr. Akash Tiwari'],
    'Pulmonology': ['Dr. Farhan Ali', 'Dr. Ritika Sood', 'Dr. Prakash Iyer'],
    'Radiology': ['Dr. Tanvi Kapoor', 'Dr. Mohit Arora', 'Dr. Leena Thomas'],
    'Urology': ['Dr. Sanjay Patel', 'Dr. Nidhi Agarwal', 'Dr. Arvind Narayan'],
};

const DEPARTMENTS = Object.keys(DEPARTMENT_DOCTORS);

const TIME_SLOTS = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM',
    '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
    '04:30 PM', '05:00 PM',
];

const BookAppointment = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        department: '',
        doctorName: '',
        date: '',
        timeSlot: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    // Doctors available for the selected department
    const availableDoctors = formData.department
        ? DEPARTMENT_DOCTORS[formData.department]
        : [];

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Reset doctor when department changes
        if (name === 'department') {
            setFormData({ ...formData, department: value, doctorName: '' });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.doctorName) {
            setError('Please select a doctor.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await API.post('/appointments', {
                department: formData.department,
                doctorName: formData.doctorName,
                date: formData.date,
                timeSlot: formData.timeSlot,
            });
            navigate('/appointments');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container" style={{ animation: 'fadeIn 0.8s ease-out' }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Book an Appointment</h1>
                    <p className="page-subtitle">Select your department and preferred doctor</p>
                </div>
            </div>

            <div className="glass-card book-card" style={{ animation: 'slideUp 0.6s ease-out' }}>
                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="alert alert-error">{error}</div>}

                    <div className="form-grid">
                        {/* Step 1: Department */}
                        <div className="form-group">
                            <label className="form-label">
                                <span style={{ marginRight: '0.5rem' }}>🏥</span>
                                Specialist Department
                            </label>
                            <select
                                name="department"
                                className="form-input glass"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a department</option>
                                {DEPARTMENTS.map((dept) => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>

                        {/* Step 2: Doctor — dynamic based on department */}
                        <div className="form-group">
                            <label className="form-label">
                                <span style={{ marginRight: '0.5rem' }}>👨‍⚕️</span>
                                Select Practitioner
                            </label>
                            <select
                                name="doctorName"
                                className="form-input glass"
                                value={formData.doctorName}
                                onChange={handleChange}
                                required
                                disabled={!formData.department}
                            >
                                <option value="">
                                    {formData.department
                                        ? `Choose from ${formData.department}`
                                        : 'Select a department first'}
                                </option>
                                {availableDoctors.map((doc) => (
                                    <option key={doc} value={doc}>{doc}</option>
                                ))}
                            </select>
                        </div>

                        {/* Step 3: Date */}

                        <div className="form-group">
                            <label className="form-label">
                                <span style={{ marginRight: '0.5rem' }}>📅</span>
                                Preferred Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                className="form-input glass"
                                value={formData.date}
                                onChange={handleChange}
                                min={today}
                                required
                            />
                        </div>

                        {/* Step 4: Time Slot */}
                        <div className="form-group">
                            <label className="form-label">
                                <span style={{ marginRight: '0.5rem' }}>⏰</span>
                                Available Time
                            </label>
                            <select
                                name="timeSlot"
                                className="form-input glass"
                                value={formData.timeSlot}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a slot</option>
                                {TIME_SLOTS.map((slot) => (
                                    <option key={slot} value={slot}>{slot}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Doctor info preview card */}
                    {formData.department && formData.doctorName && (
                        <div className="doctor-preview glass">
                            <span style={{ fontSize: '2rem' }}>👨‍⚕️</span>
                            <div>
                                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                                    {formData.doctorName}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    {formData.department} Specialist
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/patient')}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <span className="btn-spinner"></span> : 'Confirm Appointment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookAppointment;
