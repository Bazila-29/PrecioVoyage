import React from 'react';
import { Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-auto py-8 glass-panel relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Compass className="h-6 w-6 text-[var(--city-theme-color)]" />
          <span className="text-lg font-semibold text-gray-200">PrecioVoyage</span>
        </div>
        <div className="text-gray-400 text-sm">
          © {new Date().getFullYear()} PrecioVoyage. All rights reserved. Built for smarter travel.
        </div>
      </div>
    </footer>
  );
}
