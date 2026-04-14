import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { 
    Plus, 
    Trash2, 
    Edit2, 
    Flame, 
    Clock, 
    Calendar,
    Dumbbell,
    Activity,
    Zap,
    Wind,
    Target
} from 'lucide-react';
import './Workouts.css';

const getWorkoutIcon = (type) => {
    switch(type) {
        case 'Strength': return <Dumbbell size={20} />;
        case 'Cardio': return <Zap size={20} />;
        case 'Yoga': return <Wind size={20} />;
        case 'HIIT': return <Activity size={20} />;
        default: return <Target size={20} />;
    }
};

const Workouts = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWorkouts = async () => {
        try {
            const res = await API.get('/workouts');
            if (Array.isArray(res.data)) {
                setWorkouts(res.data);
            } else {
                setWorkouts([]);
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this workout?')) {
            try {
                await API.delete(`/workouts/${id}`);
                setWorkouts(workouts.filter(w => w._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div className="workouts-page container fade-in">
            <header className="page-header">
                <div>
                    <h1>History</h1>
                </div>
                <Link to="/add-workout" className="btn-primary add-btn">
                    <Plus size={20} /> New Workout
                </Link>
            </header>

            <div className="workouts-container">
                {/* Desktop Table View */}
                <div className="desktop-view glass-card">
                    <table className="workouts-table">
                        <thead>
                            <tr>
                                <th>Activity</th>
                                <th>Type</th>
                                <th>Duration</th>
                                <th>Energy</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workouts.map((workout) => (
                                <tr key={workout._id}>
                                    <td className="activity-cell">
                                        <div className={`table-icon ${workout.workoutType.toLowerCase()}`}>
                                            {getWorkoutIcon(workout.workoutType)}
                                        </div>
                                        <span>{workout.exercise || 'General Activity'}</span>
                                    </td>
                                    <td><span className={`table-tag ${workout.workoutType.toLowerCase()}`}>{workout.workoutType}</span></td>
                                    <td>{workout.duration} min</td>
                                    <td>{workout.caloriesBurned} kcal</td>
                                    <td>{new Date(workout.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                    <td>
                                        <div className="table-actions">
                                            <Link to={`/edit-workout/${workout._id}`} className="action-link edit" title="Edit">
                                                <Edit2 size={16} />
                                            </Link>
                                            <button className="action-link delete" onClick={() => handleDelete(workout._id)} title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {workouts.length === 0 && <p className="no-data-msg">No workouts found.</p>}
                </div>

                {/* Mobile Grid View */}
                <div className="mobile-view workouts-grid">
                    {workouts.map((workout) => (
                        <div key={workout._id} className="workout-card-v2 glass-card">
                            <div className="card-header">
                                <div className={`icon-box ${workout.workoutType.toLowerCase()}`}>
                                    {getWorkoutIcon(workout.workoutType)}
                                </div>
                                <div className="header-text">
                                    <h3>{workout.exercise || 'General Activity'}</h3>
                                    <span className={`type-tag ${workout.workoutType.toLowerCase()}`}>{workout.workoutType}</span>
                                </div>
                                <div className="card-actions">
                                    <Link to={`/edit-workout/${workout._id}`} className="action-link edit" title="Edit">
                                        <Edit2 size={16} />
                                    </Link>
                                    <button className="action-link delete" onClick={() => handleDelete(workout._id)} title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className="metric">
                                    <Clock size={14} />
                                    <span>{workout.duration} min</span>
                                </div>
                                <div className="metric">
                                    <Flame size={14} />
                                    <span>{workout.caloriesBurned} kcal</span>
                                </div>
                            </div>

                            <div className="card-footer">
                                <span className="date-tag">
                                    <Calendar size={14} />
                                    {new Date(workout.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                {workout.intensity && (
                                    <span className={`intensity-dot ${workout.intensity.toLowerCase()}`} title={`Intensity: ${workout.intensity}`}></span>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {workouts.length === 0 && (
                        <div className="empty-state glass-card">
                            <Activity size={48} color="var(--text-dim)" />
                            <p>No workouts yet.</p>
                            <Link to="/add-workout" className="btn-primary">Add Workout</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Workouts;
