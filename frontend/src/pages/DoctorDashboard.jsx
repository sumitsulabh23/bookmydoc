import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('pending');
    const [lastRefresh, setLastRefresh] = useState(new Date());

    const fetchAppointments = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const { data } = await API.get('/appointments');
            setAppointments(data.appointments || []);
            setLastRefresh(new Date());
        } catch (err) {
            console.error('[DoctorDashboard] Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        if (user) fetchAppointments();
    }, [user, fetchAppointments]);

    // Auto-refresh every 5 seconds for real-time feel
    useEffect(() => {
        const interval = setInterval(() => {
            if (user) fetchAppointments(true);
        }, 5000);
        return () => clearInterval(interval);
    }, [user, fetchAppointments]);

    const handleStatusUpdate = async (id, status) => {
        setUpdatingId(id);
        try {
            await API.put(`/appointments/${id}`, { status });
            // Optimistic update
            setAppointments((prev) =>
                prev.map((a) => (a._id === id ? { ...a, status } : a))
            );
        } catch (err) {
            console.error('Failed to update status:', err);
        } finally {
            setUpdatingId(null);
        }
    };

    const stats = {
        total: appointments.length,
        pending: appointments.filter((a) => a.status === 'pending').length,
        approved: appointments.filter((a) => a.status === 'approved').length,
        rejected: appointments.filter((a) => a.status === 'rejected').length,
    };

    const filtered = appointments.filter((a) =>
        filterStatus === 'all' ? true : a.status === filterStatus
    );

    return (
        <div className="dashboard-page">
            {/* Header */}
            <div className="dashboard-header" style={{ animation: 'fadeIn 0.8s ease-out' }}>
                <div>
                    <h1 className="dashboard-title">Admin Panel</h1>
                    <p className="dashboard-subtitle">
                        Welcome, Dr. {user?.name?.split(' ')[0]} · All patient requests appear here in real-time
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-soft)', fontWeight: 600 }}>
                        🔄 Last synced {lastRefresh.toLocaleTimeString()}
                    </span>
                    <button
                        className="btn btn-secondary"
                        onClick={() => fetchAppointments()}
                        style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card glass-card stat-total">
                    <div className="stat-info">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total Cases</span>
                    </div>
                </div>
                <div className="stat-card glass-card stat-pending">
                    <div className="stat-info">
                        <span className="stat-value">{stats.pending}</span>
                        <span className="stat-label">Awaiting Action</span>
                    </div>
                </div>
                <div className="stat-card glass-card stat-approved">
                    <div className="stat-info">
                        <span className="stat-value">{stats.approved}</span>
                        <span className="stat-label">Approved</span>
                    </div>
                </div>
                <div className="stat-card glass-card stat-rejected">
                    <div className="stat-info">
                        <span className="stat-value">{stats.rejected}</span>
                        <span className="stat-label">Rejected</span>
                    </div>
                </div>
            </div>

            {/* Patient Request Queue — full inline panel */}
            <div className="glass-card" style={{ padding: '0', overflow: 'hidden', animation: 'slideUp 0.6s ease-out' }}>
                {/* Queue Header + Filter Tabs */}
                <div style={{
                    padding: '1.5rem 2rem',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}>
                    <div>
                        <h2 style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
                            📋 Patient Appointment Requests
                        </h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginTop: '0.2rem' }}>
                            {stats.pending} pending · Accept or reject directly from here
                        </p>
                    </div>
                    <div className="filter-tabs glass" style={{ padding: '0.35rem', borderRadius: '12px' }}>
                        {['pending', 'approved', 'rejected', 'all'].map((s) => (
                            <button
                                key={s}
                                className={`filter-tab ${filterStatus === s ? 'active' : ''}`}
                                onClick={() => setFilterStatus(s)}
                            >
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Queue Body */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <div className="spinner" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state" style={{ padding: '4rem 2rem' }}>
                        <span className="empty-icon">
                            {filterStatus === 'pending' ? '✅' : '📭'}
                        </span>
                        <p style={{ fontWeight: 600, fontSize: '1.1rem', marginTop: '0.5rem' }}>
                            {filterStatus === 'pending'
                                ? "You're all caught up! No pending requests."
                                : `No ${filterStatus} appointments.`}
                        </p>
                    </div>
                ) : (
                    <div>
                        {filtered.map((appt, idx) => (
                            <div
                                key={appt._id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '1.25rem 2rem',
                                    borderBottom: idx < filtered.length - 1 ? '1px solid var(--border-light)' : 'none',
                                    gap: '1rem',
                                    flexWrap: 'wrap',
                                    transition: 'background 0.2s',
                                    background: appt.status === 'pending'
                                        ? 'hsla(35, 90%, 50%, 0.03)'
                                        : appt.status === 'approved'
                                            ? 'hsla(142, 70%, 45%, 0.03)'
                                            : 'transparent',
                                    animation: 'fadeIn 0.4s ease-out',
                                }}
                            >
                                {/* Patient Info */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '200px' }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '14px',
                                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                        display: 'grid',
                                        placeItems: 'center',
                                        color: '#fff',
                                        fontWeight: 800,
                                        fontSize: '1rem',
                                        flexShrink: 0,
                                    }}>
                                        {(appt.patientName || 'P').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                                            {appt.patientName || 'Patient'}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>
                                            {appt.department} · Dr. {appt.doctorName}
                                        </div>
                                    </div>
                                </div>

                                {/* Date & Time */}
                                <div style={{ textAlign: 'center', minWidth: '110px' }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                                        {new Date(appt.date).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                        ⏰ {appt.timeSlot}
                                    </div>
                                </div>

                                {/* Status */}
                                <div style={{ minWidth: '100px', textAlign: 'center' }}>
                                    <StatusBadge status={appt.status} />
                                </div>

                                {/* Action Buttons */}
                                <div style={{ minWidth: '200px' }}>
                                    {appt.status === 'pending' ? (
                                        <div className="action-btns">
                                            <button
                                                className="btn-action btn-approve"
                                                onClick={() => handleStatusUpdate(appt._id, 'approved')}
                                                disabled={updatingId === appt._id}
                                            >
                                                {updatingId === appt._id ? '...' : '✅ Approve'}
                                            </button>
                                            <button
                                                className="btn-action btn-reject"
                                                onClick={() => handleStatusUpdate(appt._id, 'rejected')}
                                                disabled={updatingId === appt._id}
                                            >
                                                {updatingId === appt._id ? '...' : '❌ Reject'}
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="processed-tag">
                                            {appt.status === 'approved' ? '✓ Approved' : '✕ Rejected'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
