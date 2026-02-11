import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Workouts from './pages/Workouts';
import AddWorkout from './pages/AddWorkout';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import './index.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />

                    <Route path="/workouts" element={
                        <PrivateRoute>
                            <Workouts />
                        </PrivateRoute>
                    } />

                    <Route path="/add-workout" element={
                        <PrivateRoute>
                            <AddWorkout />
                        </PrivateRoute>
                    } />

                    <Route path="/edit-workout/:id" element={
                        <PrivateRoute>
                            <AddWorkout />
                        </PrivateRoute>
                    } />

                    <Route path="/profile" element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
