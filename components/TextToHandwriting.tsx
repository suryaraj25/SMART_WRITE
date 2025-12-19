import React, { useState, useRef } from 'react';
import { Download, FileDown, Type, PenLine } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const FONTS = [
  { name: 'Caveat', label: 'Casual' },
  { name: 'Dancing Script', label: 'Elegant' },
  { name: 'Indie Flower', label: 'Playful' },
  { name: 'Sacramento', label: 'Formal' },
  { name: 'Shadows Into Light', label: 'Marker' },
];

const COLORS = [
  { name: 'Blue', value: '#1e3a8a' },
  { name: 'Black', value: '#1f2937' },
  { name: 'Red', value: '#991b1b' },
  { name: 'Green', value: '#166534' },
];

const TextToHandwriting: React.FC = () => {
  const [text, setText] = useState("Type your text here to convert it into realistic handwriting...");
  const [selectedFont, setSelectedFont] = useState(FONTS[0].name);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [fontSize, setFontSize] = useState(24);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    if (!previewRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(previewRef.current, { scale: 2 });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "handwritten-note.png";
      link.click();
    } catch (err) {
      console.error(err);
      alert("Failed to generate image.");
    }
    setIsDownloading(false);
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(previewRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save("handwritten-note.pdf");
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF.");
    }
    setIsDownloading(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <PenLine className="text-blue-600" size={20} />
              Style Settings
            </h3>
            
            {/* Font Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-500 mb-2">Handwriting Style</label>
              <div className="grid grid-cols-1 gap-2">
                {FONTS.map((font) => (
                  <button
                    key={font.name}
                    onClick={() => setSelectedFont(font.name)}
                    className={`px-3 py-2 text-left rounded-lg text-lg transition-all border ${
                      selectedFont === font.name 
                        ? 'bg-blue-50 border-blue-500 text-blue-800' 
                        : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100'
                    }`}
                    style={{ fontFamily: font.name }}
                  >
                    {font.label} Style
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-500 mb-2">Ink Color</label>
              <div className="flex gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      selectedColor === color.value ? 'border-slate-400 ring-2 ring-blue-300' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-500 mb-2">
                Size: {fontSize}px
              </label>
              <input 
                type="range" 
                min="16" 
                max="48" 
                value={fontSize} 
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                <Download size={18} />
                Download as Image
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors font-medium"
              >
                <FileDown size={18} />
                Download as PDF
              </button>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> You can adjust the font size to fit more text on the page or make it easier to read.
            </p>
          </div>
        </div>

        {/* Editor & Preview */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-t-2xl border-x border-t border-slate-200 shadow-sm">
             <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
               <Type size={16} className="text-blue-500"/>
               Text Input
             </label>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 border border-slate-200 rounded-b-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y min-h-[100px] mb-4 text-slate-700"
            placeholder="Type content here..."
          />

          <div className="relative overflow-hidden rounded-xl border border-slate-300 shadow-lg bg-white">
            <div 
              ref={previewRef}
              id="handwriting-preview"
              className="w-full min-h-[800px] p-12 bg-white paper-lines"
              style={{
                fontFamily: selectedFont,
                color: selectedColor,
                fontSize: `${fontSize}px`,
              }}
            >
              {text.split('\n').map((line, i) => (
                <div key={i} style={{ minHeight: '2rem' }}>{line}</div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TextToHandwriting;