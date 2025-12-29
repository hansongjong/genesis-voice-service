import { Link, useNavigate } from 'react-router-dom';
import { Mic, User, LogOut } from 'lucide-react';
import { auth } from '../lib/api';

export default function Navbar() {
  const navigate = useNavigate();
  const user = auth.getUser();
  const isLoggedIn = auth.isLoggedIn();

  const handleLogout = () => {
    auth.logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Mic className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Genesis Voice</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Demo
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            <Link to="/api-docs" className="text-gray-600 hover:text-gray-900 transition-colors">
              API
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <User className="w-4 h-4" />
                  {user?.name || 'Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
