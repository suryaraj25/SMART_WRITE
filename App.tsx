import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import ResultDisplay from './components/ResultDisplay';
import HistoryList from './components/HistoryList';
import TextToHandwriting from './components/TextToHandwriting';
import { analyzeHandwriting, fileToBase64 } from './services/geminiService';
import { AppState, AppMode, RecognitionResult, HistoryItem } from './types';
import { Sparkles, ScanText, PenTool } from 'lucide-react';

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>(AppMode.SCAN);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('smartwrite_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history");
      }
    }
  }, []);

  const saveToHistory = (res: RecognitionResult, imgUrl: string) => {
    const newItem: HistoryItem = {
      ...res,
      id: Date.now().toString(),
      timestamp: Date.now(),
      imageUrl: imgUrl,
    };
    const newHistory = [newItem, ...history].slice(0, 10); // Keep last 10
    setHistory(newHistory);
    localStorage.setItem('smartwrite_history', JSON.stringify(newHistory));
  };

  const handleFileSelect = async (file: File) => {
    try {
      setError(null);
      setAppState(AppState.ANALYZING);
      
      const objectUrl = URL.createObjectURL(file);
      setCurrentImage(objectUrl);

      const base64Data = await fileToBase64(file);
      const recognitionResult = await analyzeHandwriting(base64Data, file.type);
      
      setResult(recognitionResult);
      saveToHistory(recognitionResult, objectUrl);
      setAppState(AppState.SUCCESS);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
      setAppState(AppState.ERROR);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setCurrentImage(item.imageUrl);
    setResult(item);
    setAppState(AppState.SUCCESS);
    setAppMode(AppMode.SCAN); // Ensure we switch back to scan mode to see result
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetApp = () => {
    setAppState(AppState.IDLE);
    setResult(null);
    setCurrentImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 inline-flex">
            <button
              onClick={() => setAppMode(AppMode.SCAN)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                appMode === AppMode.SCAN 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ScanText size={18} />
              Scan Handwriting
            </button>
            <button
              onClick={() => setAppMode(AppMode.WRITE)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                appMode === AppMode.WRITE 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <PenTool size={18} />
              Text to Handwriting
            </button>
          </div>
        </div>

        {/* --- SCAN MODE CONTENT --- */}
        {appMode === AppMode.SCAN && (
          <div className="animate-fade-in">
            {/* Hero Section - Only show when IDLE */}
            {appState === AppState.IDLE && (
              <div className="text-center max-w-3xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
                  <Sparkles size={16} />
                  <span>AI-Powered Text Recognition</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6 tracking-tight">
                  Convert Handwritten Notes to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Digital Text</span>
                </h1>
                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Upload an image of any handwritten note. Our advanced AI will instantly detect the language and transcribe it into editable text.
                </p>
              </div>
            )}

            <div className="flex flex-col items-center">
              {appState === AppState.IDLE || appState === AppState.ANALYZING || appState === AppState.ERROR ? (
                <div className="w-full">
                  <UploadZone 
                    onFileSelect={handleFileSelect} 
                    isProcessing={appState === AppState.ANALYZING} 
                  />
                  
                  {appState === AppState.ERROR && (
                    <div className="max-w-xl mx-auto mt-6 text-center">
                      <p className="text-red-600 bg-red-50 px-4 py-2 rounded-lg inline-block border border-red-100">
                        {error}
                      </p>
                      <button 
                        onClick={resetApp} 
                        className="block mx-auto mt-4 text-sm text-blue-600 hover:underline"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Results View */}
              {appState === AppState.SUCCESS && result && currentImage && (
                <ResultDisplay 
                  result={result} 
                  imageUrl={currentImage} 
                  onReset={resetApp} 
                />
              )}

              {/* History Section */}
              <HistoryList items={history} onSelect={handleHistorySelect} />
            </div>
          </div>
        )}

        {/* --- WRITE MODE CONTENT --- */}
        {appMode === AppMode.WRITE && (
           <TextToHandwriting />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Smart Write Portal. Powered by Google Gemini AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;