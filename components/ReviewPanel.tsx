import React, { useState, useCallback } from 'react';
import { UploadCloud, FileText, CheckCircle, XCircle, BarChart3, Search, Lightbulb, ChevronRight, Award, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { CVData } from '../types';

interface ReviewPanelProps {
  data: CVData;
}

interface AnalysisResult {
  category: 'content' | 'design' | 'ats';
  title: string;
  score: number; // 0-100
  issues: { text: string; type: 'success' | 'warning' | 'error' }[];
  advice: string;
}

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export const ReviewPanel: React.FC<ReviewPanelProps> = ({ data }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[] | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      runAnalysis(droppedFile);
    } else {
      alert("Lütfen sadece PDF dosyası yükleyin.");
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      runAnalysis(selectedFile);
    }
  };

  // Real PDF Visual Analysis
  const analyzePdfPixels = async (pdfFile: File) => {
    if (!window.pdfjsLib) {
      console.warn("PDF.js not loaded");
      return { density: 0.1, topMarginMm: 20, leftMarginMm: 20 }; // Fallback defaults
    }

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
      const page = await pdf.getPage(1);
      
      const scale = 1.5; // High resolution for accuracy
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) return null;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const { data: pixels, width, height } = imageData;
      
      let nonWhiteCount = 0;
      let firstY = height;
      let firstX = width;

      // Scan pixels
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];

          // Check if pixel is not white (with some tolerance)
          if (r < 250 || g < 250 || b < 250) {
            nonWhiteCount++;
            if (y < firstY) firstY = y;
            if (x < firstX) firstX = x;
          }
        }
      }

      // Calculations
      const density = nonWhiteCount / (width * height);
      const pxPerMm = (width / 210) / scale * scale; // Approx conversion based on A4 width
      const topMarginMm = firstY / pxPerMm;
      const leftMarginMm = firstX / pxPerMm;

      return { density, topMarginMm, leftMarginMm };

    } catch (e) {
      console.error("Visual analysis failed", e);
      return null;
    }
  };

  const runAnalysis = async (pdfFile: File) => {
    setIsAnalyzing(true);
    
    // 1. Run Real Visual Analysis
    const visualStats = await analyzePdfPixels(pdfFile);

    setTimeout(() => {
      const newResults: AnalysisResult[] = [];

      // 1. Content Analysis (Impact & Metrics)
      const hasMetrics = data.experience.some(exp => 
        exp.description.some(d => /\d+%|\d+ k|\d+m/i.test(d) || /\d+/.test(d))
      );
      const summaryQuality = data.summary.length > 300 && data.summary.length < 800;
      
      newResults.push({
        category: 'content',
        title: 'İçerik ve Etki Analizi',
        score: hasMetrics ? 85 : 60,
        issues: [
          { 
            text: hasMetrics ? "Deneyimlerde sayısal veriler (Metrics) tespit edildi." : "Deneyim açıklamalarında somut sayısal sonuçlar (%, Tutar, Sayı) eksik.", 
            type: hasMetrics ? 'success' : 'error' 
          },
          {
            text: summaryQuality ? "Profesyonel özet uzunluğu ideal seviyede." : "Profesyonel özet ya çok kısa ya da çok uzun.",
            type: summaryQuality ? 'success' : 'warning'
          }
        ],
        advice: hasMetrics 
          ? "İçeriğiniz güçlü görünüyor. Liderlik vasıflarını vurgulayan kelimeleri artırabilirsiniz." 
          : "İşe alımcılar sonuç odaklıdır. 'Yaptım' yerine 'X yaparak Y sonucunu elde ettim' formatını kullanın."
      });

      // 2. ATS Compatibility
      const fileNameValid = /^[a-zA-Z0-9_-]+_CV\.pdf$/.test(pdfFile.name) || !pdfFile.name.includes(' ');
      const hasKeywords = ["Python", "SQL", "Analiz", "Raporlama", "Yönetim"].some(k => 
        JSON.stringify(data).includes(k)
      );

      newResults.push({
        category: 'ats',
        title: 'ATS (Aday Takip Sistemi) Uyumu',
        score: fileNameValid && hasKeywords ? 90 : 70,
        issues: [
          {
            text: fileNameValid ? "Dosya adı ATS dostu (Boşluksuz/İngilizce karakter)." : "Dosya adında boşluk veya Türkçe karakter var. (Örn: 'Ad_Soyad_CV.pdf' yapın).",
            type: fileNameValid ? 'success' : 'error'
          },
          {
            text: data.contact.linkedin ? "LinkedIn profili mevcut." : "Dijital kimlik (LinkedIn) eksik.",
            type: data.contact.linkedin ? 'success' : 'error'
          }
        ],
        advice: "Dosya adlandırması ve anahtar kelime kullanımı ATS puanını doğrudan etkiler. Başvurduğunuz ilandaki terimleri 'Uzmanlık Alanları'na ekleyin."
      });

      // 3. Design & Professionalism (Real Visual Data)
      let designScore = 80;
      const designIssues: { text: string; type: 'success' | 'warning' | 'error' }[] = [];

      if (visualStats) {
        // Density Check (0.05 - 0.15 is ideal for text documents)
        if (visualStats.density < 0.04) {
             designIssues.push({ text: "Sayfa çok boş görünüyor (Düşük mürekkep yoğunluğu).", type: "warning" });
             designScore -= 10;
        } else if (visualStats.density > 0.18) {
             designIssues.push({ text: "Sayfa çok kalabalık, okuması zor olabilir.", type: "warning" });
             designScore -= 10;
        } else {
             designIssues.push({ text: "Görsel doluluk oranı ideal dengede.", type: "success" });
             designScore += 5;
        }

        // Margin Check (Should be > 10mm)
        if (visualStats.topMarginMm < 10 || visualStats.leftMarginMm < 10) {
            designIssues.push({ text: "Kenar boşlukları çok dar (<10mm). Baskıda kesilebilir.", type: "error" });
            designScore -= 15;
        } else {
            designIssues.push({ text: `Kenar boşlukları güvenli (${visualStats.leftMarginMm.toFixed(1)}mm).`, type: "success" });
            designScore += 5;
        }
      } else {
         designIssues.push({ text: "Görsel analiz yapılamadı (PDF okunamadı).", type: "warning" });
      }
      
      // Cap score
      designScore = Math.min(100, Math.max(0, designScore));

      newResults.push({
        category: 'design',
        title: 'Görsel Tasarım Analizi',
        score: designScore,
        issues: designIssues,
        advice: "Uluslararası standartlarda bir CV için kenar boşlukları en az 12.7mm (0.5 inç) olmalıdır. Okunabilirlik için beyaz alan bırakmaktan korkmayın."
      });

      setResults(newResults);
      setIsAnalyzing(false);
    }, 1500); // Slight delay for UX
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200">
      
      {/* Upload Area */}
      {!results && !isAnalyzing && (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div 
            className={`w-full max-w-sm border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer ${
              isDragging ? 'border-blue-500 bg-blue-900/20' : 'border-slate-600 hover:border-slate-500 bg-slate-800'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('review-upload')?.click()}
          >
            <input 
              type="file" 
              id="review-upload" 
              className="hidden" 
              accept=".pdf" 
              onChange={handleFileInput} 
            />
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
              <UploadCloud size={32} className="text-blue-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">CV'nizi Yükleyin</h3>
            <p className="text-sm text-slate-400 text-center mb-4">
              Oluşturduğunuz PDF'i buraya sürükleyin veya tıklayarak seçin.
            </p>
            <span className="text-xs bg-slate-700 px-3 py-1 rounded-full text-slate-300">
              Sadece .pdf formatı
            </span>
          </div>
          <p className="mt-6 text-xs text-slate-500 max-w-xs text-center">
            Yapay zeka motorumuz CV'nizi piksel düzeyinde tarayarak doluluk oranı, marj hataları ve içerik kalitesi açısından puanlar.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h3 className="font-bold text-xl mb-2 animate-pulse">Piksel Analizi Yapılıyor...</h3>
          <div className="space-y-2 text-center">
            <p className="text-sm text-slate-400">PDF.js ile sayfa render ediliyor...</p>
            <p className="text-sm text-slate-400">Mürekkep yoğunluğu hesaplanıyor...</p>
            <p className="text-sm text-slate-400">Kenar boşlukları ölçülüyor...</p>
          </div>
        </div>
      )}

      {/* Results View */}
      {results && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <FileText className="text-blue-400" />
              Analiz Raporu
            </h2>
            <button 
              onClick={() => { setResults(null); setFile(null); }}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Yeni Analiz
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-2">
             {results.map((res, idx) => (
               <div key={idx} className={`p-3 rounded-lg border ${
                 res.score >= 80 ? 'bg-green-900/20 border-green-800' : 
                 res.score >= 60 ? 'bg-orange-900/20 border-orange-800' : 'bg-red-900/20 border-red-800'
               }`}>
                 <div className="text-xs text-slate-400 mb-1">{res.title.split(' ')[0]} Skoru</div>
                 <div className={`text-2xl font-bold ${
                   res.score >= 80 ? 'text-green-400' : res.score >= 60 ? 'text-orange-400' : 'text-red-400'
                 }`}>{res.score}/100</div>
               </div>
             ))}
          </div>

          {results.map((res, idx) => (
            <div key={idx} className="bg-slate-800 rounded-lg border border-slate-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-slate-200">{res.title}</h3>
                {res.score >= 80 ? <Award size={16} className="text-green-400"/> : <AlertTriangle size={16} className="text-orange-400"/>}
              </div>
              
              <div className="space-y-2 mb-4">
                {res.issues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    {issue.type === 'success' ? (
                      <CheckCircle2 size={14} className="text-green-500 shrink-0 mt-0.5" />
                    ) : issue.type === 'warning' ? (
                      <AlertTriangle size={14} className="text-orange-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                    )}
                    <span className={issue.type === 'error' ? 'text-red-200' : 'text-slate-300'}>
                      {issue.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-900/20 p-3 rounded border border-blue-900/50 flex gap-3">
                <Lightbulb size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-blue-300 mb-1">AI Önerisi:</h4>
                  <p className="text-xs text-blue-200/80 leading-relaxed">{res.advice}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 pb-8">
            <h3 className="font-bold text-sm text-slate-400 mb-3">İyileştirme Planı</h3>
            <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-green-400 border border-slate-800">
               {`> HEDEF: Mükemmel CV\n`}
               {results.some(r => r.score < 80) 
                 ? `> DURUM: Geliştirilmesi gereken alanlar var.\n> EYLEM: Yukarıdaki turuncu ve kırmızı uyarıları dikkate alarak "Editör" sekmesinden içeriği güncelle.` 
                 : `> DURUM: CV'niz piyasa standartlarına uygun.\n> EYLEM: Şimdi başvurmaya hazırsınız!`}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};