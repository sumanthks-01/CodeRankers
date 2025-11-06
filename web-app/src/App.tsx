import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import EmployeeHome from './components/EmployeeHome';
import ManageMenu from './components/ManageMenu';
import Reports from './components/Reports';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !user?.is_staff) {
    return <Navigate to="/employee" />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  console.log('App Routes - isAuthenticated:', isAuthenticated, 'user:', user);
  
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
            <Navigate to={user?.is_staff ? "/admin" : "/employee"} replace /> : 
            <Login />
        } 
      />
      <Route 
        path="/signup" 
        element={
          isAuthenticated ? 
            <Navigate to={user?.is_staff ? "/admin" : "/employee"} replace /> : 
            <Signup />
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/menu" 
        element={
          <ProtectedRoute adminOnly>
            <ManageMenu />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/reports" 
        element={
          <ProtectedRoute adminOnly>
            <Reports />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/employee" 
        element={
          <ProtectedRoute>
            <EmployeeHome />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/" 
        element={
          <Navigate to={isAuthenticated ? (user?.is_staff ? "/admin" : "/employee") : "/login"} replace />
        } 
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;