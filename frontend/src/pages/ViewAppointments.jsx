import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const ViewAppointments = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchAppointments = async () => {
        try {
            const { data } = await API.get('/appointments');
            // Backend returns { appointments: [...] }
            setAppointments(data.appointments || []);
        } catch (err) {
            console.error('Failed to fetch appointments', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        setUpdatingId(id);
        try {
            await API.put(`/appointments/${id}`, { status });
            setAppointments((prev) =>
                prev.map((a) => (a._id === id ? { ...a, status } : a))
            );
        } catch (err) {
            console.error('Failed to update status', err);
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = (Array.isArray(appointments) ? appointments : [])
        .filter((a) => filterStatus === 'all' ? true : a.status === filterStatus);

    return (
        <div className="page-container" style={{ animation: 'fadeIn 0.8s ease-out' }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        {user?.role === 'doctor' ? 'Clinical Queue' : 'Medical Schedule'}
                    </h1>
                    <p className="page-subtitle">
                        {user?.role === 'doctor'
                            ? 'Review and manage your incoming patient cases'
                            : 'Monitor the status of your medical consultations'}
                    </p>
                </div>
                <div className="filter-tabs glass" style={{ padding: '0.4rem', borderRadius: '14px' }}>
                    {['all', 'pending', 'approved', 'rejected'].map((status) => (
                        <button
                            key={status}
                            className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
                            onClick={() => setFilterStatus(status)}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="loading-screen">
                    <div className="spinner"></div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="glass-card empty-state-full" style={{ padding: '4rem' }}>
                    <span className="empty-icon" style={{ fontSize: '4rem' }}>📭</span>
                    <h3 style={{ fontSize: '1.5rem', marginTop: '1rem' }}>No records found</h3>
                    <p style={{ color: 'var(--text-soft)' }}>{filterStatus !== 'all' ? `No ${status} appointments matched your filter.` : 'Your clinical record is currently empty.'}</p>
                </div>
            ) : (
                <div className="table-card" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
                    <div className="table-wrapper">
                        <table className="appointments-table">
                            <thead>
                                <tr>
                                    <th>Specialty</th>
                                    <th>{user?.role === 'doctor' ? 'Patient' : 'Practitioner'}</th>
                                    <th>Date</th>
                                    <th>Time Slot</th>
                                    <th>Status</th>
                                    {user?.role === 'doctor' && <th>Action Control</th>}
                                </tr>
                            </thead>
                            <tbody style={{ animation: 'fadeIn 1s ease-out' }}>
                                {filtered.map((appt) => (
                                    <tr key={appt._id}>
                                        <td>
                                            <span className="dept-tag glass" style={{ border: 'none' }}>{appt.department}</span>
                                        </td>
                                        <td className="name-cell">
                                            {user?.role === 'doctor' ? appt.patientName : `Dr. ${appt.doctorName}`}
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{new Date(appt.date).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}</td>
                                        <td style={{ color: 'var(--text-muted)' }}>{appt.timeSlot}</td>
                                        <td><StatusBadge status={appt.status} /></td>
                                        {user?.role === 'doctor' && (
                                            <td>
                                                {appt.status === 'pending' ? (
                                                    <div className="action-btns">
                                                        <button
                                                            className="btn-action btn-approve"
                                                            onClick={() => handleStatusUpdate(appt._id, 'approved')}
                                                            disabled={updatingId === appt._id}
                                                            title="Approve Appointment"
                                                        >
                                                            {updatingId === appt._id ? '...' : '✅ Approve'}
                                                        </button>
                                                        <button
                                                            className="btn-action btn-reject"
                                                            onClick={() => handleStatusUpdate(appt._id, 'rejected')}
                                                            disabled={updatingId === appt._id}
                                                            title="Reject Appointment"
                                                        >
                                                            {updatingId === appt._id ? '...' : '❌ Reject'}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="action-done">
                                                        <span className="processed-tag">
                                                            {appt.status === 'approved' ? '✓ Processed' : '✕ Declined'}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewAppointments;
