import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { User, Shield, LogOut, MapPin, Trash2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [savedCities, setSavedCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setLoading(true);
    api.get('/user/saved-cities')
      .then(res => setSavedCities(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      try {
        await api.delete('/user/delete');
        logout();
        navigate('/');
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto w-full relative z-10">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold flex items-center">
          <User className="mr-4 h-12 w-12 text-[var(--city-theme-color)]" /> 
          Welcome, {user.name.split(' ')[0]}
        </h1>
        <p className="text-gray-400 mt-3 text-lg">Your personalized tourism assistant dashboard.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 rounded-3xl lg:col-span-1 border border-white/5 h-fit sticky top-24"
        >
          <div className="flex flex-col items-center text-center">
            <div className="h-24 w-24 bg-gray-800 rounded-full flex items-center justify-center mb-6 border-2 border-[var(--city-theme-color)] overflow-hidden">
              <User className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-gray-400 text-sm mb-8">{user.email}</p>
            
            <div className="w-full space-y-4">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition border border-white/10"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>

              <button 
                onClick={handleDeleteAccount}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition text-sm"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Content */}
        <div className="lg:col-span-3 space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Shield className="mr-3 h-6 w-6 text-[var(--city-theme-color)]" /> 
              Member Privileges
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "AI-Powered Souvenir Pricing",
                "Distance-based Fare Calculation",
                "Travel Saathi AI Assistant",
                "Community Price Contributions"
              ].map(item => (
                <div key={item} className="flex items-center space-x-3 text-gray-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--city-theme-color)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white px-2">Saved Destinations</h3>
            {loading ? (
              <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[var(--city-theme-color)]" /></div>
            ) : savedCities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {savedCities.map(city => (
                  <motion.div 
                    key={city.id}
                    whileHover={{ y: -5 }}
                    onClick={() => navigate(`/city/${city.id}`)}
                    className="glass-panel group rounded-3xl overflow-hidden border border-white/5 cursor-pointer"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img src={city.imageUrl} alt={city.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-4 left-6">
                        <h4 className="text-2xl font-bold text-white">{city.name}</h4>
                        <div className="flex items-center text-white/60 text-sm mt-1">
                          <MapPin size={14} className="mr-1" />
                          {city.state}
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-6 bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center">
                <div className="bg-white/5 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin size={32} className="text-gray-600" />
                </div>
                <h4 className="text-xl font-medium text-white mb-2">No saved cities yet</h4>
                <p className="text-gray-500 max-w-sm mx-auto mb-8">Save cities to quickly access local price guides and fare calculators.</p>
                <button onClick={() => navigate('/')} className="px-8 py-3 rounded-xl bg-[var(--city-theme-color)] text-white font-bold hover:opacity-90 transition shadow-lg shadow-[var(--city-theme-color)]/20">
                  Discover India
                </button>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
