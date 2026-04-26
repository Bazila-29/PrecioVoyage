import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { ThemeContext } from '../context/ThemeContext';
import { MapPin, ArrowRight } from 'lucide-react';

export default function Home() {
  const [cities, setCities] = useState([]);
  const { activeCity, setActiveCity } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/cities').then((res) => {
      setCities(res.data);
    }).catch(console.error);
  }, []);

  const handleCitySelect = (city) => {
    setActiveCity(city);
  };

  const handleExplore = () => {
    if (activeCity) {
      navigate('/explore');
    }
  };

  return (
    <div className="relative min-h-screen pt-16 flex flex-col items-center">
      {/* Background Image Layer */}
      {activeCity && activeCity.imageUrl && (
        <motion.div 
          key={activeCity.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[-1] bg-cover bg-center"
          style={{ backgroundImage: `url(${activeCity.imageUrl})` }}
        />
      )}

      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-7xl px-4 text-center mt-12 md:mt-24">
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          Travel Smarter in <span className="text-gradient">{activeCity ? activeCity.name : 'India'}</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {activeCity ? activeCity.description : 'Avoid tourist traps and overpaying. Get AI-powered local price estimates for transport, food, shopping, and more.'}
        </motion.p>

        <motion.div 
          className="glass-panel p-6 rounded-2xl w-full max-w-4xl shadow-2xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center justify-center text-white">
            <MapPin className="mr-2 text-[var(--city-theme-color)]" /> Select Your Destination
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => handleCitySelect(city)}
                className={`p-3 rounded-xl transition-all duration-300 border ${activeCity?.id === city.id ? 'bg-[var(--city-theme-color)]/20 border-[var(--city-theme-color)] text-white' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'}`}
              >
                <div className="font-semibold">{city.name}</div>
                <div className="text-xs opacity-70 mt-1 truncate">{city.state}</div>
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleExplore}
              disabled={!activeCity}
              className={`flex items-center space-x-2 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 ${activeCity ? 'bg-[var(--city-theme-color)] text-white hover:scale-105 shadow-lg shadow-[var(--city-theme-color)]/30' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
            >
              <span>Explore Prices</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
