import React from 'react';
import { CVData } from '../types';
import { Mail, Phone, MapPin, Linkedin, CheckCircle2, Camera } from 'lucide-react';

interface CVDocumentProps {
  data: CVData;
  profileImage: string | null;
  onImageClick: () => void;
}

export const CVDocument: React.FC<CVDocumentProps> = ({ data, profileImage, onImageClick }) => {
  return (
    // p-12 (approx 12mm) ensures safe area for printing since we removed html2pdf margins.
    // font-serif used for headings, font-sans for body.
    <div className="a4-page p-12 font-sans text-gray-800 leading-normal relative bg-white box-border">
      {/* Decorative Top Bar - Now visually attached to the paper edge if desired, or floating inside padding */}
      <div className="absolute top-0 left-0 w-full h-3 bg-slate-800 print:bg-slate-800"></div>

      {/* Header Section with Photo - Padding reduced (pb-6 mb-6) for tighter fit on A4 */}
      <header className="border-b border-slate-300 pb-6 mb-6 flex flex-col md:flex-row items-center md:items-start gap-8 mt-2">
        
        {/* Profile Photo Area - Interactive */}
        <div className="shrink-0 group relative cursor-pointer" onClick={onImageClick} title="Fotoğraf değiştirmek için tıklayın">
          <div className="w-36 h-36 rounded-lg overflow-hidden border-4 border-white shadow-lg bg-slate-100 relative transition-transform group-hover:scale-105 group-hover:shadow-xl print:shadow-none print:border-slate-300">
             {profileImage ? (
               <div 
                 className="w-full h-full bg-cover bg-top bg-no-repeat"
                 style={{ backgroundImage: `url(${profileImage})` }}
                 role="img"
                 aria-label={data.name}
               />
             ) : (
               <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                  <Camera size={24} className="mb-1" />
                  <span className="text-[10px] text-center font-medium leading-tight px-2">Fotoğraf<br/>Yükle</span>
               </div>
             )}
             
             {/* Hover Overlay */}
             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white no-print">
               <Camera size={20} />
             </div>
          </div>
        </div>

        {/* Header Text */}
        <div className="text-center md:text-left flex-1 pt-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase mb-2 font-serif">
            {data.name}
          </h1>
          <h2 className="text-lg text-slate-600 font-medium mb-5 font-serif">
            {data.title}
          </h2>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-6 text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <Mail size={15} className="text-blue-700 shrink-0" />
              <a href={`mailto:${data.contact.email}`} className="hover:underline text-slate-700">{data.contact.email}</a>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone size={15} className="text-blue-700 shrink-0" />
              <span className="text-slate-700">{data.contact.phone}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={15} className="text-blue-700 shrink-0" />
              <span className="text-slate-700">{data.contact.location}</span>
            </div>
            {data.contact.linkedin && (
              <div className="flex items-center gap-1.5">
                <Linkedin size={15} className="text-blue-700 shrink-0" />
                <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline text-slate-700">
                  {/* Display a cleaner version of the URL, but keep the href full */}
                  {data.contact.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        
        {/* Left Column (Main Content) - 8/12 */}
        <div className="col-span-12 md:col-span-8 space-y-9">
          
          {/* Professional Summary */}
          <section className="page-break-inside-avoid">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 mb-4 pb-1 flex items-center gap-2 font-serif">
              <span className="w-2 h-2 bg-blue-700 rounded-full inline-block"></span>
              Profesyonel Özet
            </h3>
            <p className="text-sm text-left leading-relaxed text-slate-700 font-sans">
              {data.summary}
            </p>
          </section>

          {/* Experience - Flex Layout for robustness against PDF clipping */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 mb-6 pb-1 flex items-center gap-2 page-break-inside-avoid font-serif">
              <span className="w-2 h-2 bg-blue-700 rounded-full inline-block"></span>
              Profesyonel Deneyim
            </h3>
            
            <div className="flex flex-col">
              {data.experience.map((job, index) => {
                const isLast = index === data.experience.length - 1;
                return (
                  <div key={index} className="flex group page-break-inside-avoid">
                    {/* Timeline Column */}
                    <div className="w-8 flex-none relative flex flex-col items-center">
                      {/* Continuous Line */}
                      <div className={`absolute w-[2px] bg-slate-300 left-1/2 -translate-x-1/2 z-0
                        ${index === 0 ? 'top-[8px]' : 'top-0'} 
                        ${isLast ? 'h-[8px]' : 'bottom-0'}
                      `}></div>
                      
                      {/* Dot */}
                      <div className="relative z-10 w-3 h-3 rounded-full bg-white border-[2.5px] border-slate-400 mt-1.5 shrink-0"></div>
                    </div>
                    
                    {/* Content Column */}
                    <div className={`flex-1 pl-1 ${isLast ? '' : 'pb-8'}`}>
                      <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
                        <h4 className="font-bold text-slate-900 text-[15px] font-serif">{job.role}</h4>
                        <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                          {job.period}
                        </span>
                      </div>
                      
                      <div className="text-sm text-blue-800 font-semibold mb-3">{job.company} <span className="text-slate-400 font-normal mx-1">|</span> <span className="text-slate-500 font-medium">{job.type}</span></div>
                      
                      <ul className="list-disc list-outside ml-4 space-y-1.5">
                        {job.description.map((desc, i) => (
                          <li key={i} className="text-[13px] text-slate-700 leading-normal pl-1 marker:text-slate-400">
                            {desc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Education */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 mb-6 pb-1 flex items-center gap-2 page-break-inside-avoid font-serif">
              <span className="w-2 h-2 bg-blue-700 rounded-full inline-block"></span>
              Eğitim
            </h3>
            <div className="space-y-6">
              {data.education.map((edu, index) => (
                <div key={index} className="page-break-inside-avoid">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm font-serif">{edu.institution}</h4>
                      <p className="text-sm text-slate-700 font-medium">{edu.degree}</p>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded whitespace-nowrap border border-slate-100">{edu.years}</span>
                  </div>
                  {edu.details && (
                    <p className="text-[12px] text-slate-600 mt-1.5 italic border-l-2 border-slate-200 pl-3 leading-snug">
                      {edu.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (Sidebar) - 4/12 */}
        <div className="col-span-12 md:col-span-4 space-y-8">
          
          {/* Core Skills - Updated Design for Consistency */}
          <section className="page-break-inside-avoid">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 mb-4 pb-1 font-serif">
              Uzmanlık Alanları
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.core.map((skill, index) => (
                <span key={index} className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-1 rounded shadow-sm print:shadow-none">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Tech Skills */}
          <section className="page-break-inside-avoid">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 mb-4 pb-1 font-serif">
              Teknik Yetkinlikler
            </h3>
            <ul className="space-y-2.5">
              {data.skills.technical.map((skill, index) => (
                <li key={index} className="flex items-start text-[12px] text-slate-700 group">
                  <CheckCircle2 size={14} className="text-blue-600 mr-2 mt-0.5 shrink-0 group-hover:text-blue-700 transition-colors" />
                  <span className="font-medium">{skill}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Languages */}
          <section className="page-break-inside-avoid">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 mb-4 pb-1 font-serif">
              Diller
            </h3>
            <ul className="space-y-2.5">
              {data.skills.languages.map((lang, index) => (
                <li key={index} className="text-[13px] text-slate-700 pl-3 border-l-[3px] border-blue-200">
                  {lang}
                </li>
              ))}
            </ul>
          </section>

          {/* Certificates */}
          <section className="page-break-inside-avoid">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 mb-4 pb-1 font-serif">
              Sertifikalar
            </h3>
            <ul className="space-y-1.5">
              {data.certificates.map((cert, index) => (
                <li key={index} className="text-[12px] text-slate-700 flex items-start leading-snug">
                   <span className="text-blue-400 mr-2">•</span>
                   {cert}
                </li>
              ))}
            </ul>
          </section>

          {/* Ethics / Child Safety */}
          <section className="page-break-inside-avoid">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 mb-4 pb-1 font-serif">
              Etik & Çocuk Koruma
            </h3>
            <div className="bg-blue-50/50 p-4 rounded text-[11px] text-slate-700 leading-relaxed text-left border border-blue-100 print:bg-transparent print:p-0 print:border-none">
              {data.ethics}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};