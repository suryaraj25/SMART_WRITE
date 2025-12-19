import React from 'react';
import { HistoryItem } from '../types';
import { Clock, ChevronRight } from 'lucide-react';

interface HistoryListProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ items, onSelect }) => {
  if (items.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 mb-20">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Clock className="text-blue-500" />
        Recent Activity
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="group flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all text-left"
          >
            <div className="h-24 w-full bg-slate-100 overflow-hidden relative">
              <img 
                src={item.imageUrl} 
                alt="History thumbnail" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                {new Date(item.timestamp).toLocaleDateString()}
              </div>
            </div>
            <div className="p-3">
              <p className="text-slate-800 font-medium text-sm line-clamp-2 mb-2">
                {item.transcribedText}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                  {item.detectedLanguage}
                </span>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;