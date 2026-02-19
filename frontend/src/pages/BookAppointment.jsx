import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const DEPARTMENTS = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
    'General Medicine', 'Neurology', 'Oncology', 'Ophthalmology',
    'Orthopedics', 'Pediatrics', 'Psychiatry', 'Pulmonology',
    'Radiology', 'Urology',
];

const TIME_SLOTS = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM',
    '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
    '04:30 PM', '05:00 PM',
];

const BookAppointment = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        department: '',
        doctorId: '',
        date: '',
        timeSlot: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data } = await API.get('/auth/doctors');
                setDoctors(data.doctors || []);
            } catch (err) {
                console.error('Failed to fetch doctors:', err);
            }
        };
        fetchDoctors();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Find selected doctor name for display in the record
            const selectedDoctor = doctors.find(d => d._id === formData.doctorId);
            const payload = {
                ...formData,
                doctorName: selectedDoctor ? selectedDoctor.name : 'Unknown Doctor'
            };
            await API.post('/appointments', payload);
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
                    <p className="page-subtitle">Select your preferred doctor and time slot</p>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '3rem', animation: 'slideUp 0.6s ease-out' }}>
                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="alert alert-error">{error}</div>}

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Specialist Department</label>
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

                        <div className="form-group">
                            <label className="form-label">Select Practitioner</label>
                            <select
                                name="doctorId"
                                className="form-input glass"
                                value={formData.doctorId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Choose a doctor</option>
                                {doctors.map((doc) => (
                                    <option key={doc._id} value={doc._id}>{doc.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Preferred Date</label>
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

                        <div className="form-group">
                            <label className="form-label">Available Time</label>
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

                    <div className="form-actions" style={{ marginTop: '2rem' }}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/patient')}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <span className="btn-spinner"></span> : 'Secure Appointment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookAppointment;
