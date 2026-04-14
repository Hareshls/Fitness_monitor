import React, { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { Flame, Clock, Dumbbell, TrendingUp, Footprints, Heart, Moon, Plus } from 'lucide-react';
import WorkoutRecommendation from '../components/WorkoutRecommendation';
import './Dashboard.css';

const Dashboard = () => {
    const [workouts, setWorkouts] = useState([]);
    const [metrics, setMetrics] = useState({
        steps: 0,
        heartRate: 0,
        sleepHours: 0,
        waterIntake: 0
    });
    const [isEditingMetrics, setIsEditingMetrics] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch workouts
                const workRes = await API.get('/workouts');
                if (Array.isArray(workRes.data)) {
                    setWorkouts(workRes.data);
                }

                // Fetch today's metrics
                const today = new Date().toISOString().split('T')[0];
                const metricRes = await API.get(`/metrics/${today}`);
                if (metricRes.data) {
                    setMetrics(metricRes.data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const handleUpdateMetrics = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/metrics', metrics);
            setMetrics(res.data);
            setIsEditingMetrics(false);
        } catch (err) {
            console.error(err);
        }
    };

    const totalCalories = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    const totalWorkouts = workouts.length;

    // Goal targets from user data or defaults
    const goals = user?.goals || {
        calories: 3000,
        duration: 180,
        workouts: 5,
        steps: 10000
    };

    const progress = {
        calories: Math.min((totalCalories / goals.calories) * 100, 100),
        duration: Math.min((totalDuration / goals.duration) * 100, 100),
        workouts: Math.min((totalWorkouts / goals.workouts) * 100, 100),
        steps: Math.min((metrics.steps / goals.steps) * 100, 100)
    };

    // Calculate last 7 days activity
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        const dayWorkouts = workouts.filter(w => {
            const wDate = new Date(w.date);
            return wDate.getDate() === d.getDate() &&
                wDate.getMonth() === d.getMonth() &&
                wDate.getFullYear() === d.getFullYear();
        });
        const dayCals = dayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
        return { dayName, cals: dayCals };
    }).reverse();

    return (
        <div className="dashboard container fade-in">
            <header className="dashboard-header">
                <h1>Hello, <span>{user?.name ? user.name.split(' ')[0] : 'User'}</span> 👋</h1>
            </header>

            <div className="stats-grid">
                <div className="stat-card glass-card">
                    <div className="stat-icon cal-icon">
                        <Flame size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{totalCalories}</h3>
                        <p>Calories Burned</p>
                    </div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon dur-icon">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{totalDuration}</h3>
                        <p>Total Minutes</p>
                    </div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon work-icon">
                        <Dumbbell size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{totalWorkouts}</h3>
                        <p>Workouts Done</p>
                    </div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon trend-icon">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Active</h3>
                        <p>Current Status</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-layout-v2">
                <div className="main-content-area">
                    {/* Health Metrics Section */}
                    <section className="health-section">
                        <div className="section-header">
                            <h2>Health Today</h2>
                            <button className="btn-small-ghost" onClick={() => setIsEditingMetrics(!isEditingMetrics)}>
                                <Plus size={16} /> Update
                            </button>
                        </div>

                        {isEditingMetrics ? (
                            <form className="metrics-form glass-card" onSubmit={handleUpdateMetrics}>
                                <div className="metrics-input-grid">
                                    <div className="metric-input">
                                        <label>Steps</label>
                                        <input type="number" value={metrics.steps} onChange={e => setMetrics({...metrics, steps: parseInt(e.target.value) || 0})} />
                                    </div>
                                    <div className="metric-input">
                                        <label>Heart Rate</label>
                                        <input type="number" value={metrics.heartRate} onChange={e => setMetrics({...metrics, heartRate: parseInt(e.target.value) || 0})} />
                                    </div>
                                    <div className="metric-input">
                                        <label>Sleep (hrs)</label>
                                        <input type="number" step="0.5" value={metrics.sleepHours} onChange={e => setMetrics({...metrics, sleepHours: parseFloat(e.target.value) || 0})} />
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-primary-small">Save</button>
                                    <button type="button" className="btn-ghost-small" onClick={() => setIsEditingMetrics(false)}>Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <div className="health-grid">
                                <div className="health-card glass-card">
                                    <div className="health-icon steps">
                                        <Footprints size={20} />
                                    </div>
                                    <div className="health-info">
                                        <span>Steps</span>
                                        <h4>{metrics.steps.toLocaleString()}</h4>
                                    </div>
                                </div>
                                <div className="health-card glass-card">
                                    <div className="health-icon pulse">
                                        <Heart size={20} />
                                    </div>
                                    <div className="health-info">
                                        <span>Heart Rate</span>
                                        <h4>{metrics.heartRate} <span>BPM</span></h4>
                                    </div>
                                </div>
                                <div className="health-card glass-card">
                                    <div className="health-icon sleep">
                                        <Moon size={20} />
                                    </div>
                                    <div className="health-info">
                                        <span>Sleep</span>
                                        <h4>{metrics.sleepHours} <span>Hrs</span></h4>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="ai-training-section">
                        <div className="section-header">
                            <h2>AI Training</h2>
                        </div>
                        <WorkoutRecommendation />
                    </section>

                    <section className="goals-section">
                        <div className="section-header">
                            <h2>Weekly Goals</h2>
                        </div>
                        <div className="progress-grid-v2">
                            <div className="progress-item glass-card">
                                <div className="progress-header">
                                    <span>Calories</span>
                                    <span>{Math.round(progress.calories)}%</span>
                                </div>
                                <div className="progress-bar-container">
                                    <div className="progress-bar-fill cal" style={{width: `${progress.calories}%`}}></div>
                                </div>
                                <p>{totalCalories} / {goals.calories} kcal</p>
                            </div>
                            <div className="progress-item glass-card">
                                <div className="progress-header">
                                    <span>Duration</span>
                                    <span>{Math.round(progress.duration)}%</span>
                                </div>
                                <div className="progress-bar-container">
                                    <div className="progress-bar-fill dur" style={{width: `${progress.duration}%`}}></div>
                                </div>
                                <p>{totalDuration} / {goals.duration} min</p>
                            </div>
                            <div className="progress-item glass-card">
                                <div className="progress-header">
                                    <span>Steps</span>
                                    <span>{Math.round(progress.steps)}%</span>
                                </div>
                                <div className="progress-bar-container">
                                    <div className="progress-bar-fill steps" style={{width: `${progress.steps}%`}}></div>
                                </div>
                                <p>{metrics.steps} / {goals.steps} steps</p>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="side-content-area">
                    <section className="status-chart-section">
                        <div className="section-header">
                            <h2>Activity Status</h2>
                        </div>
                        <div className="chart-card glass-card">
                            <div className="bar-chart">
                                {last7Days.map((day, i) => (
                                    <div key={i} className="bar-wrapper">
                                        <div className="bar-fill" style={{height: `${Math.min((day.cals / 1000) * 100 + 10, 100)}%`}}></div>
                                        <span>{day.dayName}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="chart-label">Calories Burned (7 Days)</p>
                        </div>
                    </section>

                    <section className="recent-activity-section">
                        <div className="section-header">
                            <h2>Recent Activity</h2>
                            <button className="btn-link" onClick={() => window.location.href = '/workouts'}>View All</button>
                        </div>
                        <div className="activity-stack">
                            {workouts.slice(0, 4).map((workout) => (
                                <div key={workout._id} className="activity-list-item glass-card">
                                    <div className="activity-type-dot" data-type={workout.workoutType.toLowerCase()}></div>
                                    <div className="activity-info">
                                        <h4>{workout.exercise || workout.workoutType}</h4>
                                        <p>{new Date(workout.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="activity-values">
                                        <span>{workout.duration}m</span>
                                        <span>{workout.caloriesBurned}k</span>
                                    </div>
                                </div>
                            ))}
                            {workouts.length === 0 && <p className="empty-msg">No recent activity.</p>}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
