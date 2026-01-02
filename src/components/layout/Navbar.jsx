import React from 'react';
import { LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ title }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 text-blue-700">
          <LayoutDashboard className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">{user?.name}</span>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;