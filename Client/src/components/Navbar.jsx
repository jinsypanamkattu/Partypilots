// File: src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, token } = useSelector((state) => state.auth);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3 p-3">
        <span className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-teal-400 via-cyan-500 to-green-400 bg-clip-text text-transparent drop-shadow-lg">
    Party<span className="bg-gradient-to-r from-teal-500 to-green-500 bg-clip-text text-transparent">Pilot</span>
</span>
<i className="fas fa-calendar-check text-3xl bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent drop-shadow-lg"></i>

        </div>





        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-blue-600 font-medium">Home</Link>
          <Link to="/events" className="text-gray-600 hover:text-blue-600 transition duration-300">Events</Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600 transition duration-300">About</Link>
          <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition duration-300">Contact</Link>
          {token && (
            <>
              {user?.role === 'admin' && (
                <Link
                  to="/dashboard/admin"
                  className="text-gray-600 hover:text-blue-600 transition duration-300"
                >
                  Admin Dashboard
                </Link>
              )}
              {user?.role === 'organizer' && (
                <Link
                  to="/dashboard/organizer"
                  className="text-gray-600 hover:text-green-600 transition duration-300"
                >
                  Dashboard
                </Link>
              )}
            </>
          )}

          {token && (
            <Link to="/profile" className="text-gray-600 hover:text-blue-600 transition duration-300">Profile</Link>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {token ? (
            <>
              {/* Profile Image & Name */}
      <div className="flex items-center space-x-2">
        {user?.profileImage && (
          <img
            src={user.profileImage}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 shadow-sm"
          />
        )}
        <span className="text-green-600 font-medium">
          Welcome, {user?.name || 'User'}!
        </span>
      </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 transition duration-300">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">Sign Up</Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <i className="fas fa-bars text-xl"></i>
        </button>
      </nav>

      <div className={`md:hidden bg-white px-4 py-3 shadow-md ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col space-y-3">
          <Link to="/" className="text-blue-600 font-medium py-2">Home</Link>
          <Link to="/events" className="text-gray-600 hover:text-blue-600 transition duration-300 py-2">Events</Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600 transition duration-300 py-2">About</Link>
          <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition duration-300 py-2">Contact</Link>
          {token && (user?.role === 'admin' || user?.role === 'organizer') && (
            <Link to="/dashboard/admin" className="text-gray-600 hover:text-blue-600 transition duration-300 py-2">Dashboard</Link>
          )}
          {token && (
            <Link to="/profile" className="text-gray-600 hover:text-blue-600 transition duration-300 py-2">Profile</Link>
          )}
          {token ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
            >
              Logout
            </button>
          ) : (
            <div className="flex space-x-4 pt-2">
              <Link to="/login" className="text-gray-600 hover:text-blue-600 transition duration-300">Login</Link>
              <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

