import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const PatientDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    console.log('[PatientDashboard] Render - User:', user);

    useEffect(() => {
        const fetchAppointments = async () => {
            console.log('[PatientDashboard] Fetching appointments...');
            try {
                const { data } = await API.get('/appointments');
                console.log('[PatientDashboard] Data received:', data);
                // Backend returns { appointments: [...] }
                const appointmentsList = data.appointments || [];
                setAppointments(Array.isArray(appointmentsList) ? appointmentsList : []);
            } catch (err) {
                console.error('[PatientDashboard] Fetch error:', err);
                setAppointments([]);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchAppointments();
    }, [user]);

    const stats = {
        total: appointments?.length || 0,
        pending: (appointments || []).filter((a) => a?.status === 'pending').length,
        approved: (appointments || []).filter((a) => a?.status === 'approved').length,
        rejected: (appointments || []).filter((a) => a?.status === 'rejected').length,
    };

    const recent = (appointments || []).slice(0, 3);

    return (
        <div className="dashboard-page">
            <div className="dashboard-header" style={{ animation: 'fadeIn 0.8s ease-out' }}>
                <div>
                    <h1 className="dashboard-title">Welcome back, {user?.name.split(' ')[0]}!</h1>
                    <p className="dashboard-subtitle">Manage your path to wellness today</p>
                </div>
                <Link to="/book-appointment" className="btn btn-primary">
                    <span>+</span> Book Appointment
                </Link>
            </div>

            <div className="stats-grid">
                <div className="stat-card glass-card stat-total">
                    <div className="stat-info">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total Visits</span>
                    </div>
                </div>
                <div className="stat-card glass-card stat-pending">
                    <div className="stat-info">
                        <span className="stat-value">{stats.pending}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                </div>
                <div className="stat-card glass-card stat-approved">
                    <div className="stat-info">
                        <span className="stat-value">{stats.approved}</span>
                        <span className="stat-label">Confirmed</span>
                    </div>
                </div>
                <div className="stat-card glass-card stat-rejected">
                    <div className="stat-info">
                        <span className="stat-value">{stats.rejected}</span>
                        <span className="stat-label">Cancelled</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="bento-card" style={{ animation: 'slideUp 0.6s ease-out' }}>
                    <div className="card-header">
                        <h3 className="card-title">Recent Appointments</h3>
                        <Link to="/appointments" className="card-link">See all →</Link>
                    </div>

                    {loading ? (
                        <div className="card-loading">
                            <div className="btn-spinner" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }}></div>
                        </div>
                    ) : recent.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">📅</span>
                            <p>No upcoming appointments found</p>
                        </div>
                    ) : (
                        <div className="appointment-list">
                            {recent.map((appt) => (
                                <div key={appt._id} className="appointment-item glass" style={{ border: 'none' }}>
                                    <div className="appt-info">
                                        <span className="appt-dept">{appt.department}</span>
                                        <span className="appt-doctor">Dr. {appt.doctorName}</span>
                                        <span className="appt-date">
                                            {new Date(appt.date).toLocaleDateString()} · {appt.timeSlot}
                                        </span>
                                    </div>
                                    <StatusBadge status={appt.status} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bento-card" style={{ animation: 'slideUp 0.8s ease-out' }}>
                    <div className="card-header">
                        <h3 className="card-title">Quick Actions</h3>
                    </div>
                    <div className="quick-actions">
                        <Link to="/book-appointment" className="quick-action-btn glass">
                            <span className="qa-icon">➕</span>
                            <span>Book New Appointment</span>
                        </Link>
                        <Link to="/appointments" className="quick-action-btn glass">
                            <span className="qa-icon">📋</span>
                            <span>View Medical Records</span>
                        </Link>
                        <div className="info-box glass" style={{ border: 'none' }}>
                            <span className="info-icon">💡</span>
                            <p>Pro-tip: You can cancel appointments up to 24h before the scheduled time.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
