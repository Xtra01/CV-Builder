import React from 'react';
import { CVData } from '../types';
import { Mail, Phone, MapPin, Linkedin, CheckCircle2, Camera } from 'lucide-react';

interface CVDocumentProps {
  data: CVData;
  profileImage: string | null;
  onImageClick: () => void;
  isPrinting: boolean; // Controls the layout mode (Preview vs PDF Generation)
}

// Internal component for a single job item to reduce code duplication
const JobItem = ({ job }: { job: any }) => (
  <div className="flex group atom-record mb-5 last:mb-0"> {/* mb-6 -> mb-5 for space saving */}
    {/* Segmented Timeline Graphic */}
    <div className="w-8 flex-none relative flex flex-col items-center">
      {/* Line starts from dot center (top-2) and ends at the bottom of the content block. 
          The parent div has mb-5, creating a physical gap between this line and the next one. */}
      <div className="absolute w-[2px] bg-slate-300 left-1/2 -translate-x-1/2 top-[8px] bottom-0 z-0"></div>
      <div className="relative z-10 w-3 h-3 rounded-full bg-white border-[2.5px] border-slate-400 mt-1.5 shrink-0"></div>
    </div>
    
    <div className="flex-1 pl-3 pb-2">
      <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
        <h4 className="font-bold text-slate-900 text-[15px] font-serif">{job.role}</h4>
        <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 whitespace-nowrap">
          {job.period}
        </span>
      </div>
      
      <div className="text-sm text-blue-800 font-semibold mb-3">
        {job.company} <span className="text-slate-400 font-normal mx-1">|</span> <span className="text-slate-500 font-medium">{job.type}</span>
      </div>
      
      <ul className="list-disc list-outside ml-4 space-y-1"> {/* space-y-1.5 -> space-y-1 for tighter vertical rhythm */}
        {job.description.map((desc: string, i: number) => (
          <li key={i} className="text-[13px] text-slate-700 leading-normal pl-1 marker:text-slate-400">
            {desc}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// Internal component for section headers
const SectionHeader = ({ title }: { title: string }) => (
  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 mb-6 pb-1 flex items-center gap-2 font-serif">
    <span className="w-2 h-2 bg-blue-700 rounded-full inline-block"></span>
    {title}
  </h3>
);

const SidebarHeader = ({ title }: { title: string }) => (
  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 mb-6 pb-1 font-serif">
    {title}
  </h3>
);

export const CVDocument: React.FC<CVDocumentProps> = ({ data, profileImage, onImageClick, isPrinting }) => {
  // SPLIT LOGIC:
  // Page 1: Summary, First 2 Jobs (Most recent), Core Skills, Technical Skills, Languages
  // Page 2: Remaining Jobs (Internships), Education, Certificates, Ethics
  
  const page1Jobs = data.experience.slice(0, 2);
  const page2Jobs = data.experience.slice(2);

  // Layout Classes based on Mode
  // If Printing: No gaps, no background color, no rounded corners. Just pure white A4 blocks.
  // Updated p-12 (International Standard approx 1.25 inch / 48px)
  const containerClass = isPrinting 
    ? "flex flex-col items-center bg-white" 
    : "flex flex-col gap-8 items-center bg-slate-800/50 pt-8 pb-8";

  const pageClass = isPrinting
    ? "a4-page p-12 font-sans text-gray-800 leading-normal bg-white relative shrink-0 w-full min-h-[297mm]" // Force strict min-height for PDF engine to respect page size
    : "a4-page p-12 font-sans text-gray-800 leading-normal bg-white relative shadow-2xl shrink-0";

  return (
    <div className={containerClass}>
      
      {/* ================= PAGE 1 ================= */}
      <div className={pageClass}>
        
        {/* Decorative Top Bar */}
        <div className="absolute top-0 left-0 w-full h-3 bg-slate-900 print:bg-slate-900"></div>

        {/* Header */}
        <header className="border-b border-slate-300 pb-6 mb-6 flex flex-col md:flex-row items-center md:items-start gap-8 mt-4">
          <div className="shrink-0 group relative cursor-pointer" onClick={isPrinting ? undefined : onImageClick} title={isPrinting ? "" : "Fotoğraf değiştirmek için tıklayın"}>
            <div className="w-36 h-36 rounded-lg overflow-hidden border-4 border-white shadow-lg bg-slate-100 relative transition-transform group-hover:scale-105 print:shadow-none print:border-slate-300">
               {profileImage ? (
                 <div 
                   className="w-full h-full bg-cover bg-top bg-no-repeat"
                   style={{ backgroundImage: `url(${profileImage})` }}
                 />
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                    <Camera size={24} className="mb-1" />
                    <span className="text-[10px] text-center font-medium leading-tight px-2">Fotoğraf<br/>Yükle</span>
                 </div>
               )}
            </div>
          </div>

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
                <span className="text-slate-700">{data.contact.email}</span>
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
                    {data.contact.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6 h-full">
          {/* P1 Left Column */}
          <div className="col-span-8 flex flex-col gap-5"> {/* gap-6 -> gap-5 */}
            <section>
              <SectionHeader title="Profesyonel Özet" />
              <p className="text-sm text-left leading-relaxed text-slate-700 font-sans">
                {data.summary}
              </p>
            </section>

            <section>
              <SectionHeader title="Profesyonel Deneyim" />
              <div className="flex flex-col">
                {page1Jobs.map((job, index) => (
                  <JobItem key={index} job={job} />
                ))}
              </div>
            </section>
          </div>

          {/* P1 Right Column */}
          <div className="col-span-4 flex flex-col gap-5"> {/* gap-5 reduced from 6 */}
            <section>
              <SidebarHeader title="Uzmanlık Alanları" />
              <div className="flex flex-wrap gap-2">
                {data.skills.core.map((skill, index) => (
                  <span key={index} className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <SidebarHeader title="Teknik Yetkinlikler" />
              <ul className="space-y-0.5">
                {data.skills.technical.map((skill, index) => (
                  <li key={index} className="flex items-start text-[12px] text-slate-700 group leading-tight">
                    <CheckCircle2 size={14} className="text-blue-600 mr-2 mt-0.5 shrink-0" />
                    <span className="font-medium">{skill}</span>
                  </li>
                ))}
              </ul>
            </section>
             
             <section>
              <SidebarHeader title="Diller" />
              <ul className="space-y-0.5">
                {data.skills.languages.map((lang, index) => (
                  <li key={index} className="text-[13px] text-slate-700 pl-3 border-l-[3px] border-blue-200 leading-tight">
                    {lang}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>

      {/* CRITICAL: Explicit Page Break for HTML2PDF */}
      {isPrinting && <div className="html2pdf__page-break"></div>}

      {/* ================= PAGE 2 ================= */}
      <div className={pageClass}>
         {/* Decorative Top Bar (Repeated for consistency) */}
         <div className="absolute top-0 left-0 w-full h-3 bg-slate-900 print:bg-slate-900"></div>
         
         {/* Page 2 Top Spacer - Optimized to mt-10 for vertical efficiency */}
         <div className="mt-10 grid grid-cols-12 gap-6">
            
            {/* P2 Left Column */}
            <div className="col-span-8 flex flex-col gap-5"> {/* gap-6 -> gap-5 */}
              
              {/* Remaining Jobs with Header for Alignment */}
              <section>
                 {/* Visual header to align with "Sertifikalar" on the right */}
                 <SectionHeader title="Profesyonel Deneyim (Devamı)" />
                 <div className="flex flex-col">
                  {page2Jobs.map((job, index) => (
                    <JobItem key={index} job={job} />
                  ))}
                </div>
              </section>

              <section>
                <SectionHeader title="Eğitim" />
                <div className="space-y-6">
                  {data.education.map((edu, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm font-serif">{edu.institution}</h4>
                          <p className="text-sm text-slate-700 font-medium">{edu.degree}</p>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded whitespace-nowrap border border-slate-100">
                          {edu.years}
                        </span>
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

            {/* P2 Right Column */}
            <div className="col-span-4 flex flex-col gap-5"> {/* gap-5 reduced from 6 */}
               <section>
                <SidebarHeader title="Sertifikalar" />
                <ul className="space-y-0.5">
                  {data.certificates.map((cert, index) => (
                    <li key={index} className="text-[12px] text-slate-700 flex items-start leading-tight">
                       <span className="text-blue-400 mr-2">•</span>
                       {cert}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <SidebarHeader title="Etik & Çocuk Koruma" />
                <div className="bg-blue-50/50 p-4 rounded text-[11px] text-slate-700 leading-relaxed text-left border border-blue-100">
                  {data.ethics}
                </div>
              </section>
            </div>

         </div>
      </div>

    </div>
  );
};