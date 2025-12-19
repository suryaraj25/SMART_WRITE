import React, { useState } from 'react';
import { Copy, Check, RefreshCw, Languages, FileText, ArrowRight } from 'lucide-react';
import { RecognitionResult } from '../types';
import { translateText } from '../services/geminiService';

interface ResultDisplayProps {
  result: RecognitionResult;
  imageUrl: string;
  onReset: () => void;
}

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese", 
  "Chinese", "Japanese", "Korean", "Hindi", "Tamil", "Arabic", "Russian"
];

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, imageUrl, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [displayText, setDisplayText] = useState(result.transcribedText);
  const [targetLang, setTargetLang] = useState(result.detectedLanguage);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTranslate = async () => {
    if (targetLang === result.detectedLanguage && displayText === result.transcribedText) return;
    
    setIsTranslating(true);
    try {
      const translated = await translateText(displayText, targetLang);
      setDisplayText(translated);
    } catch (error) {
      alert("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Source Image Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <FileText size={18} className="text-blue-500" />
              Original Handwriting
            </h3>
          </div>
          <div className="relative flex-grow bg-slate-100 flex items-center justify-center p-4 group overflow-hidden">
            <img 
              src={imageUrl} 
              alt="Uploaded handwriting" 
              className="max-h-[400px] w-auto object-contain rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Result Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-blue-100 overflow-hidden flex flex-col h-full relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
          
          <div className="p-4 border-b border-slate-100 flex flex-col gap-4 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <Languages size={18} className="text-blue-600" />
                Smart Write Analysis
              </h3>
              <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      result.confidenceScore > 80 ? 'bg-green-100 text-green-700' : 
                      result.confidenceScore > 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                      {result.confidenceScore}% Confidence
                  </span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {result.detectedLanguage}
                  </span>
              </div>
            </div>

            {/* Translation Controls */}
            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
               <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Translate to:</span>
               <select 
                 value={targetLang}
                 onChange={(e) => setTargetLang(e.target.value)}
                 className="bg-white text-sm border-slate-300 rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"
               >
                 {LANGUAGES.map(lang => (
                   <option key={lang} value={lang}>{lang}</option>
                 ))}
               </select>
               <button 
                 onClick={handleTranslate}
                 disabled={isTranslating}
                 className="ml-auto text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1"
               >
                 {isTranslating ? 'Translating...' : <>Translate <ArrowRight size={12}/></>}
               </button>
            </div>
          </div>

          <div className="flex-grow p-6">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {displayText === result.transcribedText ? 'Recognized Text' : `Translated to ${targetLang}`}
            </label>
            <div className="w-full min-h-[200px] p-4 bg-slate-50 rounded-xl text-slate-800 text-lg leading-relaxed font-medium font-serif border-l-4 border-blue-500 whitespace-pre-wrap">
              {displayText}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors text-sm font-medium shadow-sm"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
            <button 
              onClick={onReset}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-md shadow-blue-200"
            >
              <RefreshCw size={16} />
              New Scan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultDisplay;