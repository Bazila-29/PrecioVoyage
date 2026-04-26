import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Compass, User as UserIcon, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Compass className="h-8 w-8 text-[var(--city-theme-color)]" />
            </motion.div>
            <span className="text-xl font-bold text-gradient">PrecioVoyage</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
            <Link to="/explore" className="text-gray-300 hover:text-white transition">City Explorer</Link>
            <Link to="/predict" className="text-gray-300 hover:text-white transition">Image Predictor</Link>
            <Link to="/chat" className="text-gray-300 hover:text-white transition">Travel Saathi</Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white flex items-center space-x-1">
                  <UserIcon className="h-5 w-5" />
                  <span className="hidden sm:block">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link to="/auth" className="px-4 py-2 rounded-full bg-[var(--city-theme-color)] text-white font-medium hover:opacity-90 transition">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
