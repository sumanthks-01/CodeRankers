import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="admin-dashboard">
      <h2>Welcome, {user?.username}!</h2>
      <h3>Admin Dashboard</h3>

      <ul className="admin-menu">
        <li><Link to="/admin/menu">Manage Menu</Link></li>
        <li><Link to="/admin/reports">Generate Report</Link></li>
        <li><button onClick={logout} className="logout-btn">Logout</button></li>
      </ul>
    </div>
  );
};

export default AdminDashboard;