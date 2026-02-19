import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthPage =
        location.pathname === '/login' || location.pathname === '/register';

    if (isAuthPage || !user) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/dashboard" className="navbar-brand">
                <span className="brand-icon">🏥</span>
                <span className="brand-name">BookMyDoc</span>
            </Link>
            <div className="navbar-links">
                {user.role === 'patient' && (
                    <>
                        <Link to="/patient" className={`nav-link ${location.pathname === '/patient' ? 'active' : ''}`}>Dashboard</Link>
                        <Link to="/book-appointment" className={`nav-link ${location.pathname === '/book-appointment' ? 'active' : ''}`}>Book Appointment</Link>
                    </>
                )}
                {user.role === 'doctor' && (
                    <Link to="/doctor" className={`nav-link ${location.pathname === '/doctor' ? 'active' : ''}`}>Dashboard</Link>
                )}
                <Link to="/appointments" className={`nav-link ${location.pathname === '/appointments' ? 'active' : ''}`}>Appointments</Link>
            </div>
            <div className="navbar-user">
                <button
                    className="theme-toggle glass"
                    onClick={toggleTheme}
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
                <div className="user-info">
                    <span className="user-avatar" style={{ marginBottom: 0 }}>{user?.name ? user.name.charAt(0).toUpperCase() : '?'}</span>
                    <div className="user-details" style={{ marginLeft: '1rem' }}>
                        <span className="user-name">{user.name}</span>
                        <span className="role-badge">{user.role}</span>
                    </div>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
