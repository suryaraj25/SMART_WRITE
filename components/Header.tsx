import React from 'react';
import { PenTool, Layers } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-blue-100 shadow-sm backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <PenTool size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-blue-900 tracking-tight leading-none">
                Smart Write
              </span>
              <span className="text-xs text-blue-500 font-medium">
                AI Handwriting Portal
              </span>
            </div>
          </div>

          {/* Right Actions - Purely decorative for this portal since no login */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
              How it works
            </a>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full hover:bg-blue-100 transition-colors border border-blue-200">
              <Layers size={16} />
              Portal Access
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;