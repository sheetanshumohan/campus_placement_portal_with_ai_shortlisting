import React, { useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white shadow-sm border-b border-gray-100 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
            Campus Portal
          </Link>
          <nav className="flex gap-4 items-center">
            {user ? (
              <>
                <div className="text-sm font-medium text-gray-500 mr-4 flex items-center gap-2">
                  <UserIcon size={18} />
                  {user.name} ({user.role})
                </div>
                {user.role === 'Student' && <Link to="/student" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition">Student Panel</Link>}
                {user.role === 'Recruiter' && <Link to="/recruiter" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition">Recruiter Panel</Link>}
                {user.role === 'TPO' && <Link to="/tpo" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition">TPO Dashboard</Link>}
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-500 transition rounded-full hover:bg-red-50"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition">Sign In</Link>
                <Link to="/register" className="ml-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-full shadow-md shadow-blue-200 transition transform hover:-translate-y-0.5">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-100 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Campus Placement Portal with AI Shortlisting.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
