import React, { useState, useEffect } from 'react';
import { AlertTriangle, Copy, CheckCircle2, Bug, Zap, Search, RefreshCw, ExternalLink, ShieldCheck, BrainCircuit } from 'lucide-react';
import { CVData } from '../types';

interface DebuggerPanelProps {
  data: CVData;
}

export const DebuggerPanel: React.FC<DebuggerPanelProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [report, setReport] = useState<any[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearchOnline = (query: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

  const handleGenerateResearchPrompt = (item: any) => {
    const researchPrompt = `Act as a Senior Frontend Engineer. I am building a CV Generator using React, Tailwind CSS, and html2pdf.js.
    
I have encountered a specific issue regarding "${item.issue}".
Description: ${item.desc}

Technical Stack & Constraints:
- Framework: React 18 with TypeScript.
- Styling: Tailwind CSS (using arbitrary values for print precision).
- PDF Engine: html2pdf.js (client-side rendering).
- Layout Strategy: Manual pagination with fixed A4 dimensions (210mm x 297mm).
- Common Pitfall: Canvas splitting, CSS flexbox in print media, and margin collapsing.

Please provide a robust technical solution, code snippets, or CSS hacks to resolve this specific issue while maintaining the "Pixel-Perfect A4" requirement.`;
    
    setGeneratedPrompt(researchPrompt);
  };

  // Heuristic Analysis Engine
  const runHeuristicAnalysis = () => {
    setAnalyzing(true);
    setAnalysisDone(false);

    setTimeout(() => {
        const findings = [];
        let promptBuilder = "Sistemi analiz et ve aşağıdaki sorunları çöz:\n\n";

        // 1. Content Length Analysis (Overflow Risk)
        const summaryLen = data.summary.length;
        if (summaryLen > 600) {
            findings.push({
                id: 'overflow-risk',
                issue: "Yüksek Taşma Riski (Özet)",
                detected: true,
                desc: `Özet alanı ${summaryLen} karakter. 600 karakter üzeri metinler 3. sayfa riskini artırır.`,
                query: "resume summary optimum length html2pdf overflow",
                severity: "high"
            });
            promptBuilder += "- **Özet Kısaltma:** Özet metni çok uzun, görsel taşmayı önlemek için %15 oranında kısalt.\n";
        }

        // 2. ATS Analysis (Contact Info)
        if (!data.contact.linkedin) {
            findings.push({
                id: 'ats-linkedin',
                issue: "ATS Eksikliği (LinkedIn)",
                detected: true,
                desc: "LinkedIn profili bulunamadı. Dijital ATS sistemleri LinkedIn linki arar.",
                query: "ATS resume linkedin requirement optimization",
                severity: "medium"
            });
            promptBuilder += "- **ATS Optimizasyonu:** LinkedIn profili eksik, placeholder bir link ekle.\n";
        }

        // 3. Layout Balance (Skills)
        const techSkillsCount = data.skills.technical.length;
        if (techSkillsCount > 10) {
             findings.push({
                id: 'layout-balance',
                issue: "Sağ Sütun Dengesizliği",
                detected: true,
                desc: `${techSkillsCount} adet teknik yetkinlik var. Bu sağ sütunu aşağı iterek sayfa 2 düzenini bozabilir.`,
                query: "resume skills section best practices visual balance",
                severity: "medium"
            });
            promptBuilder += "- **Düzen Dengesi:** Teknik yetkinlik listesi çok uzun, en önemli 8 maddeye indir.\n";
        }

        // 4. Page 3 Phantom Check (General Spacing)
        const certCount = data.certificates.length;
        if (certCount > 5) {
             findings.push({
                id: 'phantom-page',
                issue: "Sayfa 3 Riski (Sertifikalar)",
                detected: true,
                desc: "Sertifika listesi uzun. 'space-y' değerleri sıkılaştırılmazsa 3. sayfa oluşabilir.",
                query: "css print media page break avoidance strategies html2pdf",
                severity: "high"
            });
            promptBuilder += "- **Sıkılaştırma:** Sertifika listesindeki dikey boşlukları (space-y-1) olarak ayarla.\n";
        } else {
             findings.push({
                id: 'phantom-page-ok',
                issue: "Sayfa Yapısı (Güvenli)",
                detected: false,
                desc: "İçerik yoğunluğu A4 sınırları içerisinde görünüyor.",
                query: "",
                severity: "low"
            });
        }

        promptBuilder += "\nBu düzeltmeleri yaparken 'Uluslararası A4 (p-12 margin)' standardını koru.";

        setReport(findings);
        setGeneratedPrompt(promptBuilder);
        setAnalyzing(false);
        setAnalysisDone(true);
    }, 1500);
  };

  // Run analysis on mount or data change (optional, but manual trigger is better for UX)
  // useEffect(() => { runHeuristicAnalysis(); }, [data]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 mb-6">
        <div className="flex items-center justify-between mb-3">
           <div className="flex items-center gap-2">
            <ShieldCheck className="text-blue-400" size={20} />
            <h3 className="font-bold text-slate-200">AI Diagnostik</h3>
           </div>
           <button 
             onClick={runHeuristicAnalysis}
             className="text-xs bg-slate-700 hover:bg-slate-600 text-blue-300 px-3 py-1.5 rounded flex items-center gap-2 transition-all shadow-sm border border-slate-600"
             disabled={analyzing}
           >
             {analyzing ? <RefreshCw className="animate-spin" size={12}/> : <Search size={12}/>}
             {analyzing ? "Taranıyor..." : "Analiz Et"}
           </button>
        </div>

        {analyzing && (
            <div className="text-xs text-slate-400 italic text-center py-6 flex flex-col items-center gap-2">
                <LoaderIcon />
                <span>İçerik yoğunluğu ve ATS kriterleri hesaplanıyor...</span>
            </div>
        )}

        {!analyzing && analysisDone && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {report.map((item) => (
                <div key={item.id} className={`text-xs p-3 rounded border shadow-sm ${
                    item.detected 
                        ? item.severity === 'high' ? 'bg-red-900/20 border-red-800/50' : 'bg-orange-900/20 border-orange-800/50'
                        : 'bg-green-900/20 border-green-800/50'
                }`}>
                <div className="flex justify-between items-center mb-1">
                    <span className={`font-bold flex items-center gap-2 ${
                        item.detected 
                            ? item.severity === 'high' ? 'text-red-300' : 'text-orange-300'
                            : 'text-green-300'
                    }`}>
                    {item.issue}
                    </span>
                    {item.detected ? <AlertTriangle size={14} className={item.severity === 'high' ? "text-red-400" : "text-orange-400"}/> : <CheckCircle2 size={14} className="text-green-400"/>}
                </div>
                <p className="text-slate-300 leading-snug mb-3 opacity-90">{item.desc}</p>
                
                {item.detected && (
                    <div className="flex gap-2 mt-2 border-t border-slate-700/50 pt-2">
                        <button 
                            onClick={() => handleSearchOnline(item.query)}
                            className="flex-1 flex items-center justify-center gap-1.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded border border-slate-700 transition-colors"
                        >
                            <ExternalLink size={10} />
                            Google'da Ara
                        </button>
                        <button 
                            onClick={() => handleGenerateResearchPrompt(item)}
                            className="flex-1 flex items-center justify-center gap-1.5 text-[10px] bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 py-1.5 rounded border border-blue-800/50 transition-colors"
                        >
                            <BrainCircuit size={10} />
                            AI Çözüm Mimarı
                        </button>
                    </div>
                )}
                </div>
            ))}
            </div>
        )}

        {!analyzing && !analysisDone && (
            <div className="text-xs text-slate-500 text-center py-4">
                CV verisini ATS ve Tasarım açısından kontrol etmek için "Analiz Et" butonuna basın.
            </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="text-yellow-400" size={20} />
          <h3 className="font-bold text-slate-200">AI Prompt Çıktısı</h3>
        </div>
        <p className="text-xs text-slate-400 mb-2">
          Hata tespiti veya araştırma için üretilen prompt:
        </p>
        
        <div className="relative flex-1">
          <textarea 
            className="w-full h-full bg-slate-900 text-slate-300 text-xs p-3 rounded border border-slate-700 font-mono resize-none focus:outline-none focus:border-blue-500 shadow-inner"
            value={generatedPrompt || "Analiz sonrası buraya prompt gelecek..."}
            readOnly
          />
          {generatedPrompt && (
              <button 
                onClick={handleCopy}
                className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-md shadow-lg transition-all flex items-center gap-2 text-xs font-bold border border-blue-500"
              >
                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                {copied ? "Kopyalandı" : "Kopyala"}
              </button>
          )}
        </div>
      </div>
    </div>
  );
};

const LoaderIcon = () => (
    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);