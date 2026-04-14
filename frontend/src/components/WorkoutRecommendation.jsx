import React, { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { Zap } from 'lucide-react';

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
                <div className="ai-badge">
                    <span>AI</span>
                    <span>POWERED</span>
                </div>
                <div className="header-text">
                    <h2>Today's Plan</h2>
                </div>
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
                        <li key={index} className="workout-item" style={{ animationDelay: `${index * 0.1}s` }}>
                            <span className="exercise-icon"><Zap size={24} fill="currentColor" /></span>
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
                    padding: 2.5rem;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
                    max-width: 600px;
                    width: 100%;
                    margin: 2rem auto;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    position: relative;
                    overflow: hidden;
                    box-sizing: border-box;
                }

                .ai-recommendation-card::before {
                    content: '';
                    position: absolute;
                    top: -50px;
                    right: -50px;
                    width: 150px;
                    height: 150px;
                    background: rgba(16, 185, 129, 0.15);
                    border-radius: 50%;
                    filter: blur(40px);
                }

                .card-header {
                    margin-bottom: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                }

                .header-text {
                    display: flex;
                    flex-direction: column;
                }

                .ai-badge {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: #10b981;
                    color: white;
                    font-size: 0.65rem;
                    font-weight: 800;
                    padding: 0.6rem 0.5rem;
                    border-radius: 10px;
                    line-height: 1.2;
                    text-align: center;
                    width: 60px;
                    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
                }

                h2 {
                    font-size: 1.8rem;
                    margin: 0;
                    font-weight: 900;
                    color: #fff;
                    line-height: 1.1;
                    letter-spacing: -0.5px;
                }

                .goal-label {
                    color: #94a3b8;
                    font-size: 0.85rem;
                    text-align: right;
                    line-height: 1.4;
                    font-weight: 500;
                    opacity: 0.8;
                }

                .workout-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .workout-item {
                    background: rgba(255, 255, 255, 0.03);
                    padding: 1.25rem 1.5rem;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    animation: slideIn 0.5s ease-out forwards;
                    opacity: 0;
                    width: 100%;
                    box-sizing: border-box;
                    gap: 0.5rem;
                }

                @keyframes slideIn {
                    from { transform: translateX(-20px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                .workout-item:hover {
                    background: rgba(255, 255, 255, 0.08);
                    transform: translateX(10px);
                    border-color: rgba(16, 185, 129, 0.4);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                }

                .exercise-icon {
                    flex-shrink: 0;
                    margin-right: 0.75rem;
                    font-size: 0; 
                    color: #10b981;
                    filter: drop-shadow(0 0 5px rgba(16, 185, 129, 0.5));
                }

                .exercise-text {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #f1f5f9;
                    line-height: 1.4;
                    overflow-wrap: break-word;
                    word-wrap: break-word;
                    flex: 1;
                }

                .loading-container {
                    text-align: center;
                    padding: 3rem 0;
                }

                .spinner {
                    border: 3px solid rgba(255, 255, 255, 0.05);
                    border-top: 3px solid #10b981;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1.5rem;
                    box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .error-message {
                    background: rgba(239, 68, 68, 0.05);
                    color: #fca5a5;
                    padding: 1.5rem;
                    border-radius: 12px;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    text-align: center;
                    font-weight: 500;
                }

                /* Mobile Responsiveness */
                @media (max-width: 640px) {
                    .ai-recommendation-card {
                        padding: 1.5rem;
                        margin: 1.5rem auto;
                        border-radius: 16px;
                    }

                    .card-header {
                        grid-template-columns: 1fr;
                        gap: 0.75rem;
                        align-items: flex-start;
                        margin-bottom: 2rem;
                    }

                    .header-text {
                        width: 100%;
                    }

                    .goal-label {
                        text-align: left;
                        max-width: none;
                        margin-top: 0.5rem;
                        font-size: 0.8rem;
                        opacity: 0.7;
                    }

                    h2 {
                        font-size: 1.5rem;
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                    }

                    .exercise-text {
                        font-size: 1rem;
                    }

                    .workout-item {
                        padding: 1rem;
                    }
                }

                @media (max-width: 480px) {
                    .ai-recommendation-card {
                        padding: 1.25rem;
                    }

                    h2 {
                        font-size: 1.3rem;
                    }

                    .ai-badge {
                        width: 55px;
                        padding: 0.5rem 0.4rem;
                        font-size: 0.6rem;
                    }

                    .workout-item {
                        padding: 0.85rem;
                        gap: 0.75rem;
                    }

                    .exercise-text {
                        font-size: 0.95rem;
                    }

                    .workout-item:hover {
                        transform: translateX(4px);
                    }
                }

                @media (max-width: 360px) {
                    h2 {
                        font-size: 1.15rem;
                    }

                    .ai-recommendation-card {
                        padding: 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default WorkoutRecommendation;
