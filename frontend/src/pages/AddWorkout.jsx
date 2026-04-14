import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';
import { 
    Dumbbell, 
    Clock, 
    Flame, 
    Calendar, 
    Type, 
    Trophy, 
    Hash, 
    Notebook, 
    Info, 
    ChevronRight,
    Weight as WeightIcon,
    Zap
} from 'lucide-react';
import './AddWorkout.css';

const EXERCISES_BY_TYPE = {
    Cardio: ['Running', 'Cycling', 'Swimming', 'Walking', 'Hiking', 'Jumping Rope'],
    Strength: ['Push-ups', 'Squats', 'Deadlifts', 'Bench Press', 'Pull-ups', 'Shoulder Press'],
    Yoga: ['Sun Salutation', 'Vinyasa Flow', 'Hatha Yoga', 'Power Yoga', 'Stretching'],
    HIIT: ['Burpees', 'Mountain Climbers', 'Plank Jacks', 'Push-up Burpees', 'Tuck Jumps'],
    Other: ['General Activity', 'Sports', 'Dancing', 'Martial Arts']
};

const MET_VALUES = {
    'Running': 10,
    'Cycling': 8,
    'Swimming': 7,
    'Walking': 3.5,
    'Hiking': 6,
    'Push-ups': 8,
    'Squats': 8,
    'Deadlifts': 6,
    'Bench Press': 6,
    'Burpees': 12,
    'Plank': 3,
    'Other': 5
};

const AddWorkout = () => {
    const [formData, setFormData] = useState({
        workoutType: 'Cardio',
        exercise: 'Running',
        duration: '',
        caloriesBurned: '',
        intensity: 'Medium',
        difficulty: 'Beginner',
        notes: '',
        sets: '',
        reps: '',
        goal: 'General Fitness',
        weight: '70',
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
                            ...workout,
                            date: new Date(workout.date).toISOString().split('T')[0],
                            weight: workout.weight || '70',
                            sets: workout.sets || '',
                            reps: workout.reps || ''
                        });
                    }
                } catch (err) {
                    console.error(err);
                }
            };
            fetchWorkout();
        }
    }, [id]);

    // Auto calculate calories
    useEffect(() => {
        if (formData.duration && formData.weight) {
            const met = MET_VALUES[formData.exercise] || MET_VALUES['Other'];
            const intensityMultiplier = 
                formData.intensity === 'High' ? 1.2 : 
                formData.intensity === 'Low' ? 0.8 : 1;
            
            const calculatedCals = (parseFloat(formData.duration) * met * parseFloat(formData.weight) * intensityMultiplier) / 60;
            setFormData(prev => ({ ...prev, caloriesBurned: Math.round(calculatedCals).toString() }));
        }
    }, [formData.duration, formData.exercise, formData.weight, formData.intensity]);

    const onChange = (e) => {
        const { name, value } = e.target;
        if (name === 'workoutType') {
            setFormData(prev => ({
                ...prev,
                workoutType: value,
                exercise: value === 'Other' ? '' : EXERCISES_BY_TYPE[value][0]
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const setToday = () => {
        setFormData(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
    };

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
            <div className="form-layout">
                <div className="form-container glass-card">
                    <header className="form-header">
                        <div className="icon-wrapper">
                            <Dumbbell size={24} color="var(--primary)" />
                        </div>
                        <div>
                            <h1>{id ? 'Refine Workout' : 'New Workout'}</h1>
                            <p>Level up your fitness journey</p>
                        </div>
                    </header>

                    {error && <div className="error-msg">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-section">
                            <h3><Type size={18} /> Activity Basics</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Workout Type</label>
                                    <select name="workoutType" value={formData.workoutType} onChange={onChange} className="custom-select">
                                        <option value="Cardio">Cardio</option>
                                        <option value="Strength">Strength</option>
                                        <option value="Yoga">Yoga</option>
                                        <option value="HIIT">HIIT</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                 <div className="form-group">
                                    <label>Exercise</label>
                                    {formData.workoutType === 'Other' ? (
                                        <input 
                                            type="text" 
                                            name="exercise" 
                                            placeholder="Enter activity name" 
                                            value={formData.exercise} 
                                            onChange={onChange} 
                                            required 
                                        />
                                    ) : (
                                        <select name="exercise" value={formData.exercise} onChange={onChange} className="custom-select">
                                            {EXERCISES_BY_TYPE[formData.workoutType].map(ex => (
                                                <option key={ex} value={ex}>{ex}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date & Time</label>
                                    <div className="input-with-action">
                                        <input type="date" name="date" value={formData.date} onChange={onChange} required />
                                        <button type="button" onClick={setToday} className="today-btn">Today</button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Intensity</label>
                                    <select name="intensity" value={formData.intensity} onChange={onChange} className="custom-select">
                                        <option value="Low">Low (Restorative)</option>
                                        <option value="Medium">Medium (Steady State)</option>
                                        <option value="High">High (Peaking)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3><Zap size={18} /> Performance Metrics</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label><Clock size={16} /> Duration (min)</label>
                                    <input type="number" name="duration" placeholder="45" value={formData.duration} onChange={onChange} required />
                                </div>
                                <div className="form-group">
                                    <label><WeightIcon size={16} /> Your Weight (kg)</label>
                                    <input type="number" name="weight" placeholder="70" value={formData.weight} onChange={onChange} required />
                                </div>
                            </div>

                            {formData.workoutType === 'Strength' && (
                                <div className="form-row animate-in">
                                    <div className="form-group">
                                        <label><Hash size={16} /> Sets</label>
                                        <input type="number" name="sets" placeholder="3" value={formData.sets} onChange={onChange} />
                                    </div>
                                    <div className="form-group">
                                        <label><Hash size={16} /> Reps</label>
                                        <input type="number" name="reps" placeholder="12" value={formData.reps} onChange={onChange} />
                                    </div>
                                </div>
                            )}

                            <div className="form-row">
                                <div className="form-group">
                                    <label><Flame size={16} /> Est. Calories Burned</label>
                                    <input type="number" name="caloriesBurned" value={formData.caloriesBurned} onChange={onChange} required readOnly className="readonly-input" />
                                    <small className="input-hint">Auto-calculated based on activity & weight</small>
                                </div>
                                <div className="form-group">
                                    <label><ChevronRight size={16} /> Difficulty</label>
                                    <select name="difficulty" value={formData.difficulty} onChange={onChange} className="custom-select">
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={() => navigate('/workouts')}>Discard</button>
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Saving...' : id ? 'Update Record' : 'Log Workout'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="preview-panel glass-card">
                    <div className="preview-header">
                        <h2>Live Preview</h2>
                        <div className="pulse-dot"></div>
                    </div>
                    
                    <div className="preview-content">
                        <div className="preview-item">
                            <span className="label">Activity</span>
                            <span className="value">{formData.exercise}</span>
                        </div>
                        <div className="preview-item">
                            <span className="label">Intensity</span>
                            <span className={`value intensity-tag ${formData.intensity.toLowerCase()}`}>{formData.intensity}</span>
                        </div>
                        <div className="preview-divider"></div>
                        <div className="preview-stats">
                            <div className="stat">
                                <span className="stat-label">Time</span>
                                <span className="stat-value">{formData.duration || '0'} <small>min</small></span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Energy</span>
                                <span className="stat-value highlight">{formData.caloriesBurned || '0'} <small>kcal</small></span>
                            </div>
                        </div>
                        {formData.sets && formData.reps && (
                            <div className="preview-strength animate-in">
                                <p>{formData.sets} Sets × {formData.reps} Reps</p>
                            </div>
                        )}
                        <div className="preview-footer">
                            <div className="difficulty-bar">
                                <div className={`fill ${formData.difficulty.toLowerCase()}`}></div>
                            </div>
                            <span className="difficulty-label">{formData.difficulty}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddWorkout;
