import React, { useState, useRef, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { UploadCloud, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';

export default function ImagePredictor() {
  const { activeCity } = useContext(ThemeContext);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith('image/')) {
      setFile(dropped);
      setPreview(URL.createObjectURL(dropped));
      setResult(null);
      setError('');
    } else {
      setError('Please drop a valid image file.');
    }
  };

  const handlePredict = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('image', file);
    if (activeCity) {
      formData.append('cityId', activeCity.id);
    }

    try {
      // In a real scenario, the backend would use the image and city data
      const res = await api.post('/predict/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-4xl mx-auto w-full relative z-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Price Predictor</h1>
        <p className="text-gray-400">Upload a photo of a souvenir, handicraft, or item to estimate its fair local price.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <motion.div 
          className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-white/20 hover:border-[var(--city-theme-color)] transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          whileHover={{ scale: 1.01 }}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-64 object-contain rounded-lg" />
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <UploadCloud className="h-16 w-16 mb-4 text-[var(--city-theme-color)] opacity-80" />
              <p className="text-lg font-medium text-white mb-1">Click or drag image here</p>
              <p className="text-sm">Supports JPG, PNG, WEBP</p>
            </div>
          )}
        </motion.div>

        {/* Results Section */}
        <div className="flex flex-col">
          <button
            onClick={handlePredict}
            disabled={!file || loading}
            className={`w-full py-4 rounded-xl font-bold text-lg mb-6 transition ${file && !loading ? 'bg-[var(--city-theme-color)] text-white hover:opacity-90 shadow-lg' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
          >
            {loading ? 'Analyzing with AI...' : 'Predict Fair Price'}
          </button>

          {error && (
            <div className="bg-red-500/20 text-red-300 p-4 rounded-xl flex items-start mb-6">
              <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 rounded-2xl flex-grow flex flex-col"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-[var(--city-theme-color)]/20 p-3 rounded-lg">
                  <ImageIcon className="h-6 w-6 text-[var(--city-theme-color)]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{result.item_name}</h3>
                  <p className="text-sm text-gray-400">Confidence: {(result.prediction_confidence * 100).toFixed(0)}%</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-xl flex justify-between items-center">
                  <span className="text-gray-400">Local Price Range</span>
                  <span className="font-mono text-lg">{result.local_price_range}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-xl flex justify-between items-center">
                  <span className="text-gray-400">Tourist Estimate</span>
                  <span className="font-mono text-lg text-red-400">{result.tourist_price_estimate}</span>
                </div>
                <div className="bg-[var(--city-theme-color)]/20 p-4 rounded-xl flex justify-between items-center border border-[var(--city-theme-color)]/30">
                  <span className="text-[var(--city-theme-color)] font-medium">Fair Bargain Price</span>
                  <span className="font-mono text-2xl font-bold text-white">{result.fair_bargain_price}</span>
                </div>
              </div>
              
              {result.is_mock && (
                <p className="text-xs text-yellow-500 mt-4 text-center">Using fallback mock data.</p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
