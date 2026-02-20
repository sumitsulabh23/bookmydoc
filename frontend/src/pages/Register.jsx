import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'patient',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await API.post('/auth/register', formData);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            console.error('[Register] Error:', err);
            const message = err.response?.data?.message ||
                (err.message === 'Network Error' ? 'Connection failed. Check if local server is running or API URL is correct.' : 'Registration failed. Please try again.');
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="glass-card auth-card">
                <div className="auth-header">
                    <div className="auth-logo">🏥</div>
                    <h1 className="auth-title">BookMyDoc</h1>
                    <p className="auth-subtitle">Create your secure medical profile</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-input"
                            placeholder="Dr. John Smith"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="Min. 6 characters"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Register As</label>
                        <div className="role-selector">
                            <div
                                className={`role-option ${formData.role === 'patient' ? 'active' : ''} glass`}
                                onClick={() => setFormData({ ...formData, role: 'patient' })}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value="patient"
                                    checked={formData.role === 'patient'}
                                    readOnly
                                />
                                <span className="role-icon">🧑‍⚕️</span>
                                <span>Patient Account</span>
                            </div>
                            <div
                                className={`role-option ${formData.role === 'doctor' ? 'active' : ''} glass`}
                                onClick={() => setFormData({ ...formData, role: 'doctor' })}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value="doctor"
                                    checked={formData.role === 'doctor'}
                                    readOnly
                                />
                                <span className="role-icon">👨‍⚕️</span>
                                <span>Medical Doctor</span>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: '0.9rem' }}>
                        {loading ? <span className="btn-spinner"></span> : 'Complete Secure Registration'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already a member?{' '}
                    <Link to="/login" className="auth-link">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
