import React, { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { Flame, Clock, Dumbbell, TrendingUp } from 'lucide-react';
import WorkoutRecommendation from '../components/WorkoutRecommendation';
import './Dashboard.css';

const Dashboard = () => {
    const [workouts, setWorkouts] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const res = await API.get('/workouts');
                if (Array.isArray(res.data)) {
                    setWorkouts(res.data);
                } else {
                    console.error('Expected an array for workouts, got:', res.data);
                    setWorkouts([]);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchWorkouts();
    }, []);

    const totalCalories = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    const totalWorkouts = workouts.length;

    // Goal targets from user data or defaults
    const goals = user?.goals || {
        calories: 3000,
        duration: 180,
        workouts: 5
    };

    const progress = {
        calories: Math.min((totalCalories / goals.calories) * 100, 100),
        duration: Math.min((totalDuration / goals.duration) * 100, 100),
        workouts: Math.min((totalWorkouts / goals.workouts) * 100, 100)
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
                <p>Welcome back! Here's your fitness overview.</p>
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

            <section className="ai-section fade-in">
                <div className="section-header">
                    <h2>Your AI Personal Trainer</h2>
                    <p>Tailored recommendations based on your profile</p>
                </div>
                <WorkoutRecommendation />
            </section>

            <div className="dashboard-main-grid">
                <div className="left-col">
                    <section className="progress-section">
                        <div className="section-header">
                            <h2>Weekly Goal Progress</h2>
                            <span className="goal-status">Keep pushing!</span>
                        </div>
                        <div className="progress-grid">
                            <div className="progress-card glass-card">
                                <div className="progress-info">
                                    <span>Weekly Calories</span>
                                    <span>{Math.round(progress.calories)}%</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div className="progress-bar-fill cal-fill" style={{ width: `${progress.calories}%` }}></div>
                                </div>
                                <p className="progress-target">{totalCalories} / {goals.calories} kcal</p>
                            </div>

                            <div className="progress-card glass-card">
                                <div className="progress-info">
                                    <span>Weekly Time</span>
                                    <span>{Math.round(progress.duration)}%</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div className="progress-bar-fill dur-fill" style={{ width: `${progress.duration}%` }}></div>
                                </div>
                                <p className="progress-target">{totalDuration} / {goals.duration} min</p>
                            </div>

                            <div className="progress-card glass-card">
                                <div className="progress-info">
                                    <span>Weekly Total</span>
                                    <span>{Math.round(progress.workouts)}%</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div className="progress-bar-fill work-fill" style={{ width: `${progress.workouts}%` }}></div>
                                </div>
                                <p className="progress-target">{totalWorkouts} / {goals.workouts} workouts</p>
                            </div>
                        </div>
                    </section>

                    <section className="recent-section">
                        <div className="section-header">
                            <h2>Recent Activities</h2>
                            <button className="btn-secondary" onClick={() => window.location.href = '/workouts'}>View All</button>
                        </div>

                        <div className="workout-list">
                            {workouts.slice(0, 3).map((workout) => (
                                <div key={workout._id} className="workout-item glass-card">
                                    <div className="workout-type-icon">
                                        {workout.workoutType === 'Cardio' && '🏃'}
                                        {workout.workoutType === 'Strength' && '💪'}
                                        {workout.workoutType === 'Yoga' && '🧘'}
                                        {workout.workoutType === 'HIIT' && '⚡'}
                                        {workout.workoutType === 'Other' && '🎯'}
                                    </div>
                                    <div className="workout-details">
                                        <h4>{workout.workoutType}</h4>
                                        <p>{new Date(workout.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="workout-stats">
                                        <span>{workout.duration} min</span>
                                        <span>{workout.caloriesBurned} kcal</span>
                                    </div>
                                </div>
                            ))}
                            {workouts.length === 0 && <p className="no-data">No workouts found. Start tracking now!</p>}
                        </div>
                    </section>
                </div>

                <div className="right-col">
                    <section className="activity-chart-section glass-card">
                        <h2>Activity Status</h2>
                        <div className="chart-container">
                            {last7Days.map((day, i) => (
                                <div key={i} className="chart-bar-wrapper">
                                    <div
                                        className="chart-bar"
                                        style={{ height: `${Math.min((day.cals / 1000) * 100 + 10, 100)}%` }}
                                        title={`${day.cals} kcal`}
                                    ></div>
                                    <span className="chart-day">{day.dayName}</span>
                                </div>
                            ))}
                        </div>
                        <div className="chart-legend">
                            <p>Daily Calories Burned (Last 7 Days)</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
