import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';
import './AddWorkout.css';

const AddWorkout = () => {
    const [formData, setFormData] = useState({
        workoutType: 'Cardio',
        duration: '',
        caloriesBurned: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            const fetchWorkout = async () => {
                try {
                    const res = await API.get('/workouts');
                    const workout = res.data.find(w => w._id === id);
                    if (workout) {
                        setFormData({
                            workoutType: workout.workoutType,
                            duration: workout.duration,
                            caloriesBurned: workout.caloriesBurned,
                            date: new Date(workout.date).toISOString().split('T')[0]
                        });
                    }
                } catch (err) {
                    console.error(err);
                }
            };
            fetchWorkout();
        }
    }, [id]);

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (id) {
                await API.put(`/workouts/${id}`, formData);
            } else {
                await API.post('/workouts', formData);
            }
            navigate('/workouts');
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving workout');
            setLoading(false);
        }
    };

    return (
        <div className="add-workout-page container fade-in">
            <div className="form-container glass-card">
                <h1>{id ? 'Edit Workout' : 'Add New Workout'}</h1>
                <p>{id ? 'Update your workout details' : 'Record your effort and stay consistent'}</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Workout Type</label>
                            <select
                                name="workoutType"
                                value={formData.workoutType}
                                onChange={onChange}
                                className="custom-select"
                            >
                                <option value="Cardio">Cardio</option>
                                <option value="Strength">Strength</option>
                                <option value="Yoga">Yoga</option>
                                <option value="HIIT">HIIT</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={onChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Duration (minutes)</label>
                            <input
                                type="number"
                                name="duration"
                                placeholder="e.g. 45"
                                value={formData.duration}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Calories Burned</label>
                            <input
                                type="number"
                                name="caloriesBurned"
                                placeholder="e.g. 350"
                                value={formData.caloriesBurned}
                                onChange={onChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => navigate('/workouts')}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Adding...' : 'Save Workout'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddWorkout;
