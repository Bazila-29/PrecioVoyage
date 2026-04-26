import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CityExplorer from './pages/CityExplorer';
import ImagePredictor from './pages/ImagePredictor';
import Chatbot from './pages/Chatbot';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="flex flex-col min-h-screen w-full relative">
      {/* Background layer */}
      <div className="fixed inset-0 z-[-1] transition-colors duration-1000" style={{ backgroundColor: 'var(--background)' }}>
        {/* Subtle radial gradient for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--city-theme-color)]/20 via-transparent to-transparent opacity-50 transition-colors duration-1000"></div>
      </div>

      <Navbar />
      
      <main className="flex-grow flex flex-col relative z-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<CityExplorer />} />
          <Route path="/predict" element={<ProtectedRoute><ImagePredictor /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
