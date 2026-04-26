import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import PriceCard from '../components/PriceCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ArrowLeft, Heart, Info, PlusCircle, Car, Bus, Train, Plane, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CityExplorer() {
  const { activeCity } = useContext(ThemeContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prices, setPrices] = useState({});
  const [cities, setCities] = useState([]);
  const [cityDetails, setCityDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  
  // Local Calc
  const [localDist, setLocalDist] = useState(10);
  const [localVehicle, setLocalVehicle] = useState('Auto');
  const [localFare, setLocalFare] = useState(0);

  // Intercity Calc
  const [destCityId, setDestCityId] = useState('');
  const [interMode, setInterMode] = useState('Cab');
  const [interResult, setInterResult] = useState(null);

  // Community Price
  const [showModal, setShowModal] = useState(false);
  const [comForm, setComForm] = useState({ itemName: '', price: '', category: 'Shopping' });

  useEffect(() => {
    if (!activeCity) {
      navigate('/');
      return;
    }

    setLoading(true);
    Promise.all([
      api.get(`/prices/${activeCity.id}`),
      api.get('/cities'),
      api.get(`/city/${activeCity.id}`),
      user ? api.get('/user/saved-cities') : Promise.resolve({ data: [] })
    ]).then(([priceRes, cityRes, detailRes, savedRes]) => {
      setPrices(priceRes.data);
      setCities(cityRes.data.filter(c => c.id !== activeCity.id));
      setCityDetails(detailRes.data);
      if (user) {
        setIsSaved(savedRes.data.some(c => c.id === activeCity.id));
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, [activeCity, navigate, user]);

  useEffect(() => {
    if (prices['Transport']) {
      const v = prices['Transport'].find(p => p.name.includes(localVehicle));
      if (v) {
        const fare = (v.baseFare || 0) + (localDist * (v.perKmFare || 10));
        setLocalFare(Math.round(fare));
      }
    }
  }, [localDist, localVehicle, prices]);

  const handleSaveToggle = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    try {
      const res = await api.post('/user/save-city', { cityId: activeCity.id });
      setIsSaved(res.data.saved);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateIntercity = async () => {
    if (!destCityId) return;
    try {
      const res = await api.post('/predict/intercity', {
        fromCityId: activeCity.id,
        toCityId: destCityId,
        mode: interMode
      });
      setInterResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommunitySubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth');
      return;
    }
    try {
      await api.post('/prices/community', {
        itemName: comForm.itemName,
        pricePaid: comForm.price,
        cityId: activeCity.id,
        categoryId: activeCity.id // placeholder
      });
      setShowModal(false);
      alert('Thank you for contributing!');
    } catch (err) {
      console.error(err);
    }
  };

  if (!activeCity) return null;

  const getFilteredItems = (items) => {
    if (!searchTerm) return items;
    return items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Destinations
        </button>
        <button 
          onClick={handleSaveToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition ${isSaved ? 'bg-[var(--city-theme-color)] text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
        >
          <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
          {isSaved ? 'Saved' : 'Save City'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-8">
        <div className="flex-grow">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 flex items-center">
            <MapPin className="h-10 w-10 mr-4 text-[var(--city-theme-color)]" />
            {activeCity.name}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">{activeCity.description}</p>
        </div>

        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-black/40 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--city-theme-color)] transition"
            placeholder="Search prices or items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--city-theme-color)]"></div>
        </div>
      ) : (
        <div className="space-y-16">
          
          {/* Top Places Section */}
          {cityDetails?.places?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex items-center gap-4">
                <Camera className="text-[var(--city-theme-color)]" />
                <h2 className="text-3xl font-bold">Top Places to Visit</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cityDetails.places.map((place, idx) => (
                  <motion.div 
                    key={place.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-panel group rounded-3xl overflow-hidden border border-white/5 bg-white/5"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-4 left-6 right-4">
                        <h4 className="text-xl font-bold text-white mb-1">{place.name}</h4>
                        <p className="text-xs text-white/70 line-clamp-2">{place.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Calculators Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Local Calculator */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Car size={120} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Local Fare Calculator</h3>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-4">
                    <label className="text-gray-400">Distance (KM)</label>
                    <span className="text-[var(--city-theme-color)] font-bold">{localDist} km</span>
                  </div>
                  <input 
                    type="range" min="1" max="100" step="1"
                    className="w-full accent-[var(--city-theme-color)]"
                    value={localDist}
                    onChange={(e) => setLocalDist(parseInt(e.target.value))}
                  />
                </div>
                <div className="flex gap-4">
                  {['Auto', 'Cab', 'E-Rickshaw'].map(v => (
                    <button 
                      key={v}
                      onClick={() => setLocalVehicle(v)}
                      className={`flex-grow py-3 rounded-xl border transition ${localVehicle === v ? 'bg-[var(--city-theme-color)]/20 border-[var(--city-theme-color)] text-white' : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/20'}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                  <span className="text-gray-400">Estimated Fare</span>
                  <span className="text-4xl font-bold text-white">₹{localFare}</span>
                </div>
              </div>
            </motion.div>

            {/* Intercity Calculator */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Plane size={120} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Intercity Fare Finder</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Destination City</label>
                  <select 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--city-theme-color)] transition"
                    value={destCityId}
                    onChange={(e) => setDestCityId(e.target.value)}
                  >
                    <option value="">Select city...</option>
                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[{id: 'Bus', icon: Bus}, {id: 'Train', icon: Train}, {id: 'Cab', icon: Car}, {id: 'Flight', icon: Plane}].map(m => (
                    <button 
                      key={m.id}
                      onClick={() => setInterMode(m.id)}
                      className={`flex flex-col items-center py-3 rounded-xl border transition ${interMode === m.id ? 'bg-[var(--city-theme-color)]/20 border-[var(--city-theme-color)] text-white' : 'bg-black/20 border-white/5 text-gray-400'}`}
                    >
                      <m.icon size={20} className="mb-1" />
                      <span className="text-[10px]">{m.id}</span>
                    </button>
                  ))}
                </div>
                <button 
                  onClick={calculateIntercity}
                  disabled={!destCityId}
                  className="w-full py-3 bg-[var(--city-theme-color)] text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Calculate Intercity Fare
                </button>
                {interResult && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-500">Distance</div>
                      <div className="text-lg font-bold">{interResult.distanceKm} km</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-wider text-gray-500">Est. Fare</div>
                      <div className="text-3xl font-bold text-[var(--city-theme-color)]">₹{interResult.estimatedFare}</div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Price Sections */}
          <div className="space-y-16">
            {Object.entries(prices).map(([category, items]) => {
              const filtered = getFilteredItems(items);
              if (filtered.length === 0) return null;

              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <h2 className="text-3xl font-bold text-white">{category}</h2>
                      <div className="ml-6 h-px w-24 bg-gradient-to-r from-[var(--city-theme-color)] to-transparent"></div>
                    </div>
                    {category === 'Shopping' && (
                      <button 
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 text-[var(--city-theme-color)] hover:text-white transition text-sm font-medium"
                      >
                        <PlusCircle size={18} /> Contribute Price
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.map(item => (
                      <PriceCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Community Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel p-8 rounded-3xl w-full max-w-md relative z-10 border border-white/10"
            >
              <h3 className="text-2xl font-bold mb-6">Contribute Local Price</h3>
              <form onSubmit={handleCommunitySubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Item Name</label>
                  <input 
                    type="text" required
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--city-theme-color)]"
                    placeholder="e.g. Kashmiri Shawl"
                    value={comForm.itemName}
                    onChange={e => setComForm({...comForm, itemName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Price Paid (₹)</label>
                  <input 
                    type="number" required
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--city-theme-color)]"
                    placeholder="e.g. 1500"
                    value={comForm.price}
                    onChange={e => setComForm({...comForm, price: e.target.value})}
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-grow py-3 text-gray-400 font-bold">Cancel</button>
                  <button type="submit" className="flex-grow py-3 bg-[var(--city-theme-color)] text-white rounded-xl font-bold">Submit</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
