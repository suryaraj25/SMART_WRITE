import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, FileWarning } from 'lucide-react';
import { SUPPORTED_FILE_TYPES, MAX_FILE_SIZE_MB } from '../constants';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const validateAndPassFile = (file: File) => {
    setErrorMsg(null);
    if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
      setErrorMsg("Unsupported file format. Please use JPG, PNG, or WEBP.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`File size exceeds ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPassFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`
          relative group cursor-pointer 
          flex flex-col items-center justify-center 
          w-full h-64 rounded-3xl border-2 border-dashed 
          transition-all duration-300 ease-in-out
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
            : 'border-blue-200 bg-white hover:border-blue-400 hover:shadow-lg'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={SUPPORTED_FILE_TYPES.join(',')}
          onChange={handleFileInput}
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center text-center p-6">
          <div className={`
            p-4 rounded-full mb-4 transition-colors
            ${isDragOver ? 'bg-blue-200 text-blue-700' : 'bg-blue-50 text-blue-500 group-hover:bg-blue-100 group-hover:text-blue-600'}
          `}>
            {isProcessing ? (
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : (
              <UploadCloud size={32} />
            )}
          </div>
          
          <h3 className="text-xl font-semibold text-blue-900 mb-2">
            {isProcessing ? 'Processing Image...' : 'Click or Drag Image Here'}
          </h3>
          <p className="text-sm text-slate-500 max-w-xs">
            Upload any handwritten note in any language. 
            Supported formats: JPG, PNG.
          </p>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl">
           <div className={`absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-blue-400 rounded-tl-2xl transition-all duration-500 ${isDragOver ? 'opacity-100' : 'opacity-0'}`}></div>
           <div className={`absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-blue-400 rounded-br-2xl transition-all duration-500 ${isDragOver ? 'opacity-100' : 'opacity-0'}`}></div>
        </div>
      </div>

      {errorMsg && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm animate-fade-in">
          <FileWarning size={16} />
          {errorMsg}
        </div>
      )}
    </div>
  );
};

export default UploadZone;