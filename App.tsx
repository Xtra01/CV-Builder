import React, { useRef, useState } from 'react';
import { CVDocument } from './components/CVDocument';
import { INITIAL_CV_DATA } from './constants';
import { Printer, Download, AlertCircle, FileText, Upload, ImagePlus } from 'lucide-react';
import { CVData } from './types';

function App() {
  const [cvData] = useState<CVData>(INITIAL_CV_DATA);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePrint = () => {
    window.print();
  };

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

  const handleDownloadPDF = () => {
    const element = printRef.current;
    if (!element) return;

    // @ts-ignore
    if (typeof html2pdf === 'undefined') {
      alert("PDF oluşturucu kütüphane henüz yüklenmedi. Lütfen sayfayı yenileyip tekrar deneyin.");
      return;
    }

    const opt = {
      // 10mm margin to prevent content being cut off at the edge of the printer/page
      margin: 10, 
      filename: 'Ekrem_Degirmenci_CV.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, // High resolution
        useCORS: true, 
        scrollY: 0,
        letterRendering: true,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      // Strict CSS mode to respect 'break-inside-avoid' classes
      pagebreak: { mode: ['css', 'legacy'] }
    };

    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  const handleWordExport = () => {
      const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
      const footer = "</body></html>";
      
      const sourceHTML = printRef.current?.innerHTML || "";
      const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(header + sourceHTML + footer);
      
      const fileDownload = document.createElement("a");
      document.body.appendChild(fileDownload);
      fileDownload.href = source;
      fileDownload.download = 'cv-ekrem-degirmenci.doc';
      fileDownload.click();
      document.body.removeChild(fileDownload);
  };

  return (
    <div className="min-h-screen bg-slate-800 flex flex-col md:flex-row font-sans">
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Sidebar Controls */}
      <div className="w-full md:w-80 bg-slate-900 text-white p-6 flex flex-col no-print shrink-0 z-10 shadow-2xl">
        <h1 className="text-2xl font-bold mb-2 text-blue-400">CV Oluşturucu</h1>
        <p className="text-slate-400 text-sm mb-6">Hisar Okulları Veri Yönetimi Uzmanı pozisyonu için optimize edilmiştir.</p>

        <div className="space-y-4">
          
          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Profil Fotoğrafı</h3>
            <button 
              onClick={triggerFileInput}
              className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-blue-300 py-2 px-3 rounded transition-all text-sm font-medium border border-slate-600 border-dashed"
            >
              <ImagePlus size={16} />
              {profileImage ? "Fotoğrafı Değiştir" : "Fotoğraf Yükle"}
            </button>
          </div>

          <button 
            onClick={handleDownloadPDF}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-lg transition-all font-semibold shadow-lg shadow-blue-900/50"
          >
            <Download size={20} />
            PDF Olarak İndir
          </button>

          <button 
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 py-3 px-4 rounded-lg transition-all font-medium border border-slate-600"
          >
            <Printer size={20} />
            Yazdır / PDF Kaydet
          </button>

          <button 
             onClick={handleWordExport}
             className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 py-3 px-4 rounded-lg transition-all font-medium border border-slate-600"
          >
            <FileText size={20} />
            MS Word (.doc) İndir
          </button>
        </div>

        <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="flex items-start gap-3 mb-2">
            <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <h3 className="font-semibold text-amber-400 text-sm">Düzen İpuçları</h3>
          </div>
          <ul className="text-xs text-slate-400 space-y-2 list-disc ml-4">
             <li>PDF alırken maddelerin bölünmesini engellemek için "Akıllı Sayfa Ayrımı" (Smart Page Breaks) aktiftir.</li>
             <li>Kenarlarda 10mm güvenli yazdırma boşluğu otomatik bırakılır.</li>
          </ul>
        </div>
        
        <div className="mt-auto pt-6 text-xs text-slate-500 text-center">
           Kullanıcı: Ekrem Değirmenci<br/>
           Hedef: Hisar Okulları
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 overflow-y-auto bg-slate-700 p-4 md:p-8 flex justify-center items-start print-reset">
        {/* Paper Container - Ensure no external margins affect PDF generation */}
        <div className="shadow-2xl print:shadow-none print:w-full print:m-0">
           <div ref={printRef}>
              <CVDocument 
                data={cvData} 
                profileImage={profileImage} 
                onImageClick={triggerFileInput}
              />
           </div>
        </div>
      </div>

    </div>
  );
}

export default App;