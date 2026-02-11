import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, LogOut, User as UserIcon, LayoutDashboard, Dumbbell } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar glass-card">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <Activity size={32} color="var(--primary)" />
                    <span>FitTrack</span>
                </Link>

                <ul className="nav-links">
                    {user ? (
                        <>
                            <li>
                                <Link to="/">
                                    <LayoutDashboard size={20} className="nav-icon" />
                                    <span>Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/workouts">
                                    <Dumbbell size={20} className="nav-icon" />
                                    <span>Workouts</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/profile" title="Profile">
                                    <UserIcon size={20} />
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="logout-btn" title="Logout">
                                    <LogOut size={20} />
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login"><span>Login</span></Link></li>
                            <li><Link to="/register" className="btn-primary"><span>Sign Up</span></Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
