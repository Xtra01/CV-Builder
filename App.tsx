import React, { useRef, useState } from 'react';
import { CVDocument } from './components/CVDocument';
import { INITIAL_CV_DATA } from './constants';
import { Printer, Download, Eye, AlertCircle } from 'lucide-react';
import { CVData } from './types';

function App() {
  const [cvData] = useState<CVData>(INITIAL_CV_DATA);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  // We can't robustly generate Word docs client-side with this level of styling.
  // We offer a text/html download or just instruct PDF use.
  const handleWordExport = () => {
      const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
      const footer = "</body></html>";
      
      // Basic extraction of text for Word
      // Note: This won't preserve the Tailwind layout perfectly in Word, as Word requires specific XML or very basic inline CSS.
      // This is a "Best Effort" plain version for editing.
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
      
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 bg-slate-900 text-white p-6 flex flex-col no-print shrink-0 z-10 shadow-2xl">
        <h1 className="text-2xl font-bold mb-2 text-blue-400">CV Oluşturucu</h1>
        <p className="text-slate-400 text-sm mb-8">Hisar Okulları Veri Yönetimi Uzmanı pozisyonu için optimize edilmiştir.</p>

        <div className="space-y-4">
          <button 
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-lg transition-all font-semibold shadow-lg shadow-blue-900/50"
          >
            <Printer size={20} />
            PDF Olarak Kaydet
          </button>

          <button 
             onClick={handleWordExport}
             className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 py-3 px-4 rounded-lg transition-all font-medium border border-slate-600"
          >
            <Download size={20} />
            MS Word (.doc) İndir
          </button>
        </div>

        <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="flex items-start gap-3 mb-2">
            <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <h3 className="font-semibold text-amber-400 text-sm">ATS İpuçları</h3>
          </div>
          <ul className="text-xs text-slate-400 space-y-2 list-disc ml-4">
            <li>PDF formatı görsel bütünlüğü en iyi koruyan formattır.</li>
            <li>İçerik, ilan metnindeki "Python", "Veri Yönetimi", "KVKK" gibi anahtar kelimelerle zenginleştirilmiştir.</li>
            <li>Standart fontlar ve başlıklar kullanılmıştır.</li>
          </ul>
        </div>
        
        <div className="mt-auto pt-6 text-xs text-slate-500 text-center">
           Kullanıcı: Ekrem Değirmenci<br/>
           Hedef: Hisar Okulları
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 overflow-y-auto bg-slate-700 p-4 md:p-8 flex justify-center items-start">
        {/* Paper Container */}
        <div className="shadow-2xl print:shadow-none print:w-full">
           {/* 
              We wrap the component in a div ref for possible HTML extraction 
              and to apply specific print classes 
           */}
           <div ref={printRef}>
              <CVDocument data={cvData} />
           </div>
        </div>
      </div>

    </div>
  );
}

export default App;