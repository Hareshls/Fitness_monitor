import React, { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

const WorkoutRecommendation = () => {
    const { user } = useContext(AuthContext);
    const [recommendation, setRecommendation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendation = async () => {
            if (!user || !user._id) return;
            
            setLoading(true);
            try {
                const response = await API.get(`/ai/workout-recommendation/${user._id}`);
                setRecommendation(response.data.recommendation);
                setError(null);
            } catch (err) {
                console.error('Error fetching recommendation:', err);
                setError('Failed to fetch recommendations. Please update your profile with fitness goals.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendation();
    }, [user]);

    if (!user) return null;

    return (
        <div className="ai-recommendation-card">
            <div className="card-header">
                <div className="ai-badge">AI POWERED</div>
                <h2>AI Recommended Workout Today</h2>
                <p>Based on your {user.fitness_goal?.replace('_', ' ') || 'general'} goal</p>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Analyzing your fitness data...</p>
                </div>
            ) : error ? (
                <div className="error-message">
                    {error}
                </div>
            ) : (
                <ul className="workout-list">
                    {recommendation.map((exercise, index) => (
                        <li key={index} className="workout-item">
                            <span className="exercise-icon">⚡</span>
                            <span className="exercise-text">{exercise}</span>
                        </li>
                    ))}
                </ul>
            )}

            <style jsx="true">{`
                .ai-recommendation-card {
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                    color: white;
                    border-radius: 20px;
                    padding: 2rem;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
                    max-width: 500px;
                    margin: 2rem auto;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    position: relative;
                    overflow: hidden;
                }

                .ai-recommendation-card::before {
                    content: '';
                    position: absolute;
                    top: -50px;
                    right: -50px;
                    width: 150px;
                    height: 150px;
                    background: rgba(30, 215, 96, 0.1);
                    border-radius: 50%;
                    filter: blur(40px);
                }

                .card-header {
                    margin-bottom: 1.5rem;
                }

                .ai-badge {
                    display: inline-block;
                    background: #10b981;
                    color: white;
                    font-size: 0.7rem;
                    font-weight: 800;
                    padding: 0.2rem 0.6rem;
                    border-radius: 10px;
                    margin-bottom: 0.5rem;
                    letter-spacing: 1px;
                }

                h2 {
                    font-size: 1.5rem;
                    margin: 0;
                    font-weight: 700;
                    color: #f8fafc;
                }

                .card-header p {
                    color: #94a3b8;
                    font-size: 0.9rem;
                    margin-top: 0.5rem;
                }

                .workout-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .workout-item {
                    background: rgba(255, 255, 255, 0.05);
                    margin-bottom: 0.8rem;
                    padding: 1rem;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .workout-item:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateX(5px);
                    border-color: rgba(16, 185, 129, 0.3);
                }

                .exercise-icon {
                    margin-right: 1rem;
                    font-size: 1.2rem;
                    color: #10b981;
                }

                .exercise-text {
                    font-size: 1.05rem;
                    font-weight: 500;
                }

                .loading-container {
                    text-align: center;
                    padding: 2rem 0;
                }

                .spinner {
                    border: 3px solid rgba(255, 255, 255, 0.1);
                    border-top: 3px solid #10b981;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .error-message {
                    background: rgba(239, 68, 68, 0.1);
                    color: #fca5a5;
                    padding: 1rem;
                    border-radius: 10px;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    text-align: center;
                }
            `}</style>
        </div>
    );
};

export default WorkoutRecommendation;
