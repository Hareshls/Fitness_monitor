import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import './Workouts.css';

const Workouts = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWorkouts = async () => {
        try {
            const res = await API.get('/workouts');
            if (Array.isArray(res.data)) {
                setWorkouts(res.data);
            } else {
                console.error('Expected an array for workouts, got:', res.data);
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
                    <h1>Workout Logs</h1>
                    <p>Track your consistency over time</p>
                </div>
                <Link to="/add-workout" className="btn-primary add-btn">
                    <Plus size={20} /> Add Workout
                </Link>
            </header>

            <div className="workouts-table-wrapper glass-card">
                <table className="workouts-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Duration</th>
                            <th>Calories</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workouts.map((workout) => (
                            <tr key={workout._id}>
                                <td>{new Date(workout.date).toLocaleDateString()}</td>
                                <td>
                                    <span className={`type-badge ${workout.workoutType.toLowerCase()}`}>
                                        {workout.workoutType}
                                    </span>
                                </td>
                                <td>{workout.duration} min</td>
                                <td>{workout.caloriesBurned} kcal</td>
                                <td>
                                    <div className="action-btns">
                                        <Link to={`/edit-workout/${workout._id}`} className="edit-btn" title="Edit">
                                            <Edit2 size={18} />
                                        </Link>
                                        <button
                                            className="delete-btn"
                                            title="Delete"
                                            onClick={() => handleDelete(workout._id)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {workouts.length === 0 && (
                            <tr>
                                <td colSpan="5" className="empty-row">No workouts yet. Start by adding one!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Workouts;
