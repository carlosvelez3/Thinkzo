import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const AdminRoute: React.FC = () => {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => {}} />;
  }

  if (!hasRole('admin')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-slate-400">You don't have permission to access this area.</p>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
};

export default AdminRoute;