import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export default function Auth() {
  const [mode, setMode] = useState('login'); // login, signup, reset
  const [formData, setFormData] = useState({ name: '', email: '', password: '', newPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.post('/auth/login', { email: formData.email, password: formData.password });
        login(res.data.user, res.data.token);
        navigate('/dashboard');
      } else if (mode === 'signup') {
        const res = await api.post('/auth/register', { name: formData.name, email: formData.email, password: formData.password });
        login(res.data.user, res.data.token);
        navigate('/dashboard');
      } else if (mode === 'reset') {
        await api.post('/auth/reset-password', { email: formData.email, newPassword: formData.newPassword });
        setSuccess('Password updated! You can now sign in.');
        setMode('login');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex justify-center items-center relative z-10 w-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 rounded-2xl w-full max-w-md shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--city-theme-color)] transition"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--city-theme-color)] transition"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {mode !== 'reset' ? (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--city-theme-color)] transition pr-12"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[38px] text-gray-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          ) : (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--city-theme-color)] transition pr-12"
                value={formData.newPassword}
                onChange={e => setFormData({...formData, newPassword: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[38px] text-gray-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold transition ${loading ? 'bg-gray-600 text-gray-400' : 'bg-[var(--city-theme-color)] text-white hover:opacity-90'}`}
          >
            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Reset Password')}
          </button>
        </form>

        <div className="mt-6 space-y-4 text-center">
          <p className="text-gray-400 text-sm">
            {mode === 'login' ? (
              <>
                Don't have an account? 
                <button onClick={() => setMode('signup')} className="text-[var(--city-theme-color)] hover:underline ml-1 font-medium">Sign Up</button>
              </>
            ) : (
              <>
                Already have an account? 
                <button onClick={() => setMode('login')} className="text-[var(--city-theme-color)] hover:underline ml-1 font-medium">Sign In</button>
              </>
            )}
          </p>
          
          {mode === 'login' && (
            <button 
              onClick={() => setMode('reset')}
              className="text-gray-400 text-xs hover:text-white hover:underline"
            >
              Forgot Password?
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
