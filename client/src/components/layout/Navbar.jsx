import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { MdDashboard, MdExplore, MdBookmark, MdPerson, MdLogout, MdAdminPanelSettings } from 'react-icons/md';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = isAdmin
    ? [
        { to: '/admin', label: 'Admin Dashboard', icon: MdAdminPanelSettings },
        { to: '/admin/opportunities', label: 'Manage Opportunities', icon: MdExplore },
      ]
    : [
        { to: '/dashboard', label: 'Dashboard', icon: MdDashboard },
        { to: '/explore', label: 'Explore', icon: MdExplore },
        { to: '/saved', label: 'Saved', icon: MdBookmark },
        { to: '/profile', label: 'Profile', icon: MdPerson },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/'} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">
              Opportunity<span className="text-orange-500">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(to)
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-700 font-semibold text-sm">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors ml-2"
                    title="Logout"
                  >
                    <MdLogout size={16} />
                    <span className="hidden lg:block">Logout</span>
                  </button>
                </div>
                {/* Mobile hamburger */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                >
                  {mobileMenuOpen ? <HiX size={20} /> : <HiMenu size={20} />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm py-2 px-4"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isAuthenticated && mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1 animate-fade-in">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(to) ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-2">
              <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600">
                <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-700 font-semibold text-xs">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                {user?.name}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 w-full hover:bg-red-50 rounded-lg"
              >
                <MdLogout size={18} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
