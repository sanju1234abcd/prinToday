import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

interface AdminAuthGateProps {
  children: React.ReactNode;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not logged in or not an ADMIN, deny access
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
        <p className="text-slate-600 text-center mb-6 max-w-md">
          You do not have administrative privileges to view this page. Please log in with an admin account.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 bg-brand-blue text-white rounded-xl font-bold shadow-md hover:bg-brand-navy transition"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // User is logged in and has ADMIN role
  return <>{children}</>;
};
