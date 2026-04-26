import React from 'react';
import { motion } from 'framer-motion';

export default function PriceCard({ item }) {
  // item: { id, name, min, max, avg }
  
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="glass-panel p-4 rounded-xl flex flex-col justify-between"
    >
      <h3 className="text-lg font-semibold text-gray-100 mb-2 truncate" title={item.name}>
        {item.name}
      </h3>
      
      <div className="flex flex-col space-y-2 mt-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Min:</span>
          <span className="font-mono text-green-400">₹{item.min}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Avg (Fair):</span>
          <span className="font-mono text-blue-400 font-bold">₹{item.avg}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Max (Tourist):</span>
          <span className="font-mono text-red-400">₹{item.max}</span>
        </div>
      </div>
      
      <div className="mt-4 w-full bg-gray-800 rounded-full h-2 overflow-hidden flex relative">
        {/* Simple visual indicator of the range */}
        <div className="absolute top-0 bottom-0 left-0 bg-green-500/50 w-1/3"></div>
        <div className="absolute top-0 bottom-0 left-1/3 bg-blue-500/50 w-1/3"></div>
        <div className="absolute top-0 bottom-0 left-2/3 bg-red-500/50 w-1/3"></div>
      </div>
    </motion.div>
  );
}
