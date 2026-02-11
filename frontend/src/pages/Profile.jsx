import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import { User, Mail, Calendar, Target, Save, X, Edit2 } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        goals: {
            calories: user?.goals?.calories || 3000,
            duration: user?.goals?.duration || 180,
            workouts: user?.goals?.workouts || 5
        }
    });

    const handleSave = async () => {
        try {
            const res = await API.put('/auth/profile', formData);
            updateUser(res.data);
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update profile', err);
            alert(err.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <div className="profile-page container fade-in">
            <div className="profile-card glass-card">
                <div className="profile-header">
                    <div className="avatar">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    {isEditing ? (
                        <input
                            type="text"
                            className="edit-name-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    ) : (
                        <h2>{user?.name || 'User'}</h2>
                    )}
                    <p className="member-since">Fitness Champion</p>
                </div>

                <div className="profile-info">
                    <div className="info-item">
                        <Mail className="icon" size={20} />
                        <div>
                            <label>Email Address</label>
                            <p>{user?.email || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="goals-section">
                        <h3><Target size={20} /> Weekly Targets</h3>
                        <div className="goals-grid">
                            <div className="goal-input-group">
                                <label>Calories (kcal)</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={formData.goals.calories}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            goals: { ...formData.goals, calories: parseInt(e.target.value) || 0 }
                                        })}
                                    />
                                ) : (
                                    <p>{user?.goals?.calories || 3000}</p>
                                )}
                            </div>
                            <div className="goal-input-group">
                                <label>Duration (min)</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={formData.goals.duration}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            goals: { ...formData.goals, duration: parseInt(e.target.value) || 0 }
                                        })}
                                    />
                                ) : (
                                    <p>{user?.goals?.duration || 180}</p>
                                )}
                            </div>
                            <div className="goal-input-group">
                                <label>Workouts</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={formData.goals.workouts}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            goals: { ...formData.goals, workouts: parseInt(e.target.value) || 0 }
                                        })}
                                    />
                                ) : (
                                    <p>{user?.goals?.workouts || 5}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-actions">
                    {isEditing ? (
                        <>
                            <button className="btn-primary" onClick={handleSave}>
                                <Save size={18} /> Save Goals
                            </button>
                            <button className="btn-secondary" onClick={() => setIsEditing(false)}>
                                <X size={18} /> Cancel
                            </button>
                        </>
                    ) : (
                        <button className="btn-primary" onClick={() => setIsEditing(true)}>
                            <Edit2 size={18} /> Edit Targets
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
