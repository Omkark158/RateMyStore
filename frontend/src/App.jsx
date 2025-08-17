import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';
import Signup from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home'; 

import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Role-based protected routes */}
          <Route
            path="/user"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner"
            element={
              <ProtectedRoute role="store_owner">
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      {/* Toasts */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#374151', color: '#fff' },
          success: { duration: 3000, theme: { primary: '#10b981', secondary: '#fff' } },
          error: { duration: 4000, theme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </div>
  );
}

export default App;
