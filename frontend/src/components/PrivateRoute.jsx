import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return <div className="loader">Loading...</div>;

    if (!user) {
        return <Navigate to="/login" />;
    }

    // Force profile completion for new users (Must fill physical stats and goals)
    const isProfileIncomplete = !user.age || !user.weight || !user.height || 
                                !user.goals?.calories || !user.goals?.duration || !user.goals?.workouts;
    
    if (isProfileIncomplete && location.pathname !== '/profile') {
        return <Navigate to="/profile" state={{ isNewUser: true }} />;
    }

    return children;
};

export default PrivateRoute;
