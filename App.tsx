import React, { useRef, useState } from 'react';
import { CVDocument } from './components/CVDocument';
import { INITIAL_CV_DATA } from './constants';
import { Download, AlertCircle, FileText, ImagePlus, Loader2, PenTool, Bug, Eye, Printer, ImageIcon } from 'lucide-react';
import { CVData } from './types';
import { DebuggerPanel } from './components/DebuggerPanel';
import { ReviewPanel } from './components/ReviewPanel';

// Define window interface to avoid TypeScript errors with external library
declare global {
  interface Window {
    html2pdf: any;
    html2canvas: any;
  }
}

function App() {
  const [cvData] = useState<CVData>(INITIAL_CV_DATA);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'debug' | 'review'>('editor');
  
  // State for loading indicator
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  // We use a separate ref for the hidden print version
  const hiddenPrintRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Helper: Pre-load images
  const waitForImages = async (container: HTMLElement) => {
    const images = Array.from(container.querySelectorAll('img'));
    const bgImages = Array.from(container.querySelectorAll<HTMLElement>('[style*="background-image"]'));
    
    const promises = images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve; 
      });
    });

    bgImages.forEach(div => {
        const bg = div.style.backgroundImage;
        if (bg) {
            const src = bg.replace(/url\((['"])?(.*?)\1\)/gi, '$2');
            if (src) {
                promises.push(new Promise((resolve) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = resolve;
                    img.onerror = resolve;
                }));
            }
        }
    });

    return Promise.all(promises);
  };

  // Option 1: Standard PDF via html2pdf (Shadow Clone)
  const handleDownloadPDF = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
        const element = hiddenPrintRef.current;
        if (!element || typeof window.html2pdf === 'undefined') {
          throw new Error("PDF Motoru hazır değil.");
        }

        await waitForImages(element);
        await new Promise(resolve => setTimeout(resolve, 500));

        const opt = {
          margin: 0,
          filename: 'Ekrem_Degirmenci_CV.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          enableLinks: true,
          html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollY: 0, logging: false, windowWidth: 794 },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        await window.html2pdf().set(opt).from(element).save();
    } catch (error: any) {
        alert(`Hata: ${error.message}`);
    } finally {
        setIsGenerating(false);
    }
  };

  // Option 2: High-Res Image (PNG) - EXACTLY what you see
  const handleDownloadImage = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
        const element = hiddenPrintRef.current;
        if (!element || typeof window.html2canvas === 'undefined') throw new Error("Canvas motoru hatası.");

        await waitForImages(element);
        const canvas = await window.html2canvas(element, { scale: 2, useCORS: true, scrollY: 0 });
        
        const link = document.createElement('a');
        link.download = 'Ekrem_Degirmenci_CV.png';
        link.href = canvas.toDataURL("image/png");
        link.click();
    } catch (error: any) {
        alert("Resim oluşturulamadı: " + error.message);
    } finally {
        setIsGenerating(false);
    }
  };

  // Option 3: Native Browser Print - Robust Fallback
  const handleNativePrint = () => {
      window.print();
  };

  return (
    <div className="min-h-screen bg-slate-800 flex flex-col md:flex-row font-sans">
      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

      {/* SHADOW CLONE (Always Rendered for PDF/Image Export) */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={hiddenPrintRef} style={{ width: '210mm' }}>
            <CVDocument data={cvData} profileImage={profileImage} onImageClick={() => {}} isPrinting={true} />
        </div>
      </div>

      {/* Sidebar Controls */}
      <div className="w-full md:w-80 bg-slate-900 text-white p-4 flex flex-col no-print shrink-0 z-10 shadow-2xl h-screen sticky top-0 overflow-hidden sidebar">
        <h1 className="text-2xl font-bold mb-4 text-blue-400 px-2">CV Builder v2.0</h1>
        
        <div className="flex p-1 bg-slate-800 rounded-lg mb-6 mx-2">
          <button onClick={() => setActiveTab('editor')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${activeTab === 'editor' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}><PenTool size={14} /> Editör</button>
          <button onClick={() => setActiveTab('debug')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${activeTab === 'debug' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}><Bug size={14} /> Hata</button>
          <button onClick={() => setActiveTab('review')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${activeTab === 'review' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}><Eye size={14} /> İncele</button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {activeTab === 'editor' ? (
            <div className="space-y-3">
              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Profil Fotoğrafı</h3>
                <button onClick={triggerFileInput} className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-blue-300 py-2 px-3 rounded transition-all text-sm font-medium border border-slate-600 border-dashed"><ImagePlus size={16} /> {profileImage ? "Değiştir" : "Yükle"}</button>
              </div>

              <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">İndirme Seçenekleri</label>
                  
                  <button onClick={handleDownloadPDF} disabled={isGenerating} className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg transition-all">
                    {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                    PDF Oluştur (Standart)
                  </button>

                  <button onClick={handleDownloadImage} disabled={isGenerating} className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg transition-all">
                    <ImageIcon size={18} />
                    Resim Olarak İndir (PNG)
                  </button>

                  <button onClick={handleNativePrint} className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium border border-slate-600 transition-all">
                    <Printer size={18} />
                    Tarayıcı ile Yazdır (Sistem)
                  </button>
              </div>

              <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle size={16} className="text-blue-400 shrink-0 mt-0.5" />
                  <h3 className="font-semibold text-blue-400 text-xs">Hangisini Seçmeliyim?</h3>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <strong>Resim (PNG):</strong> Gördüğünüzün birebir aynısını verir. Kayma yapmaz. <br/>
                  <strong>Sistem Yazdır:</strong> En güvenilir PDF yöntemidir.
                </p>
              </div>
            </div>
          ) : activeTab === 'debug' ? (
            <DebuggerPanel data={cvData} />
          ) : (
            <ReviewPanel data={cvData} />
          )}
        </div>
      </div>

      {/* Main Interactive Preview */}
      <div className="flex-1 bg-slate-800 overflow-auto flex justify-center items-start print-reset pt-8 pb-20">
          <CVDocument data={cvData} profileImage={profileImage} onImageClick={triggerFileInput} isPrinting={false} />
      </div>

    </div>
  );
}

export default App;