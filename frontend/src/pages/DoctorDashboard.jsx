import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    console.log('[DoctorDashboard] Render - User:', user);

    useEffect(() => {
        const fetchAppointments = async () => {
            console.log('[DoctorDashboard] Fetching appointments...');
            try {
                const { data } = await API.get('/appointments');
                console.log('[DoctorDashboard] Data received:', data);
                // Backend returns { appointments: [...] }
                const appointmentsList = data.appointments || [];
                setAppointments(Array.isArray(appointmentsList) ? appointmentsList : []);
            } catch (err) {
                console.error('[DoctorDashboard] Fetch error:', err);
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

    const pendingAppointments = (appointments || []).filter((a) => a?.status === 'pending').slice(0, 4);

    return (
        <div className="dashboard-page">
            <div className="dashboard-header" style={{ animation: 'fadeIn 0.8s ease-out' }}>
                <div>
                    <h1 className="dashboard-title">Medical Center HQ</h1>
                    <p className="dashboard-subtitle">Welcome back, Dr. {user?.name.split(' ')[0]}</p>
                </div>
                <Link to="/appointments" className="btn btn-primary">
                    Manage Schedule
                </Link>
            </div>

            <div className="stats-grid">
                <div className="stat-card glass-card stat-total">
                    <div className="stat-info">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total Cases</span>
                    </div>
                </div>
                <div className="stat-card glass-card stat-pending">
                    <div className="stat-info">
                        <span className="stat-value">{stats.pending}</span>
                        <span className="stat-label">Pending Review</span>
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
                        <span className="stat-label">Completed</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="bento-card" style={{ animation: 'slideUp 0.6s ease-out' }}>
                    <div className="card-header">
                        <h3 className="card-title">Patient Queue</h3>
                        <Link to="/appointments" className="card-link">View queue →</Link>
                    </div>

                    {loading ? (
                        <div className="card-loading">
                            <div className="btn-spinner" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }}></div>
                        </div>
                    ) : pendingAppointments.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">✅</span>
                            <p>You're all caught up!</p>
                        </div>
                    ) : (
                        <div className="appointment-list">
                            {pendingAppointments.map((appt) => (
                                <div key={appt._id} className="appointment-item glass" style={{ border: 'none' }}>
                                    <div className="appt-info">
                                        <span className="appt-dept">{appt.department}</span>
                                        <span className="appt-doctor">Patient: {appt.patientName}</span>
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
                        <h3 className="card-title">System Insights</h3>
                    </div>
                    <div className="quick-actions">
                        <Link to="/appointments" className="quick-action-btn glass">
                            <span className="qa-icon">📋</span>
                            <span>Patient Log</span>
                        </Link>
                        <div className="info-box glass" style={{ border: 'none' }}>
                            <span className="info-icon">⚡</span>
                            <p>Sync complete. All patient data is up to date with the central server.</p>
                        </div>
                        <div className="info-box glass" style={{ border: 'none', background: 'var(--primary-soft)', color: 'var(--primary)' }}>
                            <span className="info-icon">📅</span>
                            <p>Tip: Confirm pending requests quickly to improve patient satisfaction.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
