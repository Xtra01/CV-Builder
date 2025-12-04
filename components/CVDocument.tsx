import React from 'react';
import { CVData } from '../types';
import { Mail, Phone, MapPin, Globe, CheckCircle2 } from 'lucide-react';

interface CVDocumentProps {
  data: CVData;
}

export const CVDocument: React.FC<CVDocumentProps> = ({ data }) => {
  return (
    <div className="a4-page p-10 md:p-12 font-sans text-gray-800 leading-normal relative overflow-hidden">
      {/* Decorative Top Bar */}
      <div className="absolute top-0 left-0 w-full h-3 bg-slate-800 print:bg-slate-800"></div>

      {/* Header Section */}
      <header className="border-b-2 border-slate-200 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight uppercase mb-2">
          {data.name}
        </h1>
        <h2 className="text-xl text-slate-600 font-medium mb-4">
          {data.title}
        </h2>
        
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1.5">
            <Mail size={14} className="text-blue-600" />
            <a href={`mailto:${data.contact.email}`} className="hover:underline">{data.contact.email}</a>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone size={14} className="text-blue-600" />
            <span>{data.contact.phone}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-blue-600" />
            <span>{data.contact.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe size={14} className="text-blue-600" />
            <span>{data.contact.nationality}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column (Main Content) - 7/12 */}
        <div className="col-span-8 space-y-6">
          
          {/* Professional Summary */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 mb-3 pb-1">
              Profesyonel Özet
            </h3>
            <p className="text-sm text-justify leading-relaxed text-slate-700">
              {data.summary}
            </p>
          </section>

          {/* Experience */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 mb-4 pb-1">
              Profesyonel Deneyim
            </h3>
            <div className="space-y-5">
              {data.experience.map((job, index) => (
                <div key={index} className="relative pl-4 border-l-2 border-slate-100">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-slate-900">{job.role}</h4>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                      {job.period}
                    </span>
                  </div>
                  <div className="text-sm text-blue-700 font-medium mb-2">{job.company} <span className="text-slate-400 font-normal mx-1">|</span> {job.type}</div>
                  <ul className="list-disc list-outside ml-4 space-y-1">
                    {job.description.map((desc, i) => (
                      <li key={i} className="text-sm text-slate-700 leading-snug pl-1">
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 mb-4 pb-1">
              Eğitim
            </h3>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900">{edu.institution}</h4>
                      <p className="text-sm text-slate-700">{edu.degree}</p>
                    </div>
                    <span className="text-xs text-slate-500 whitespace-nowrap">{edu.years}</span>
                  </div>
                  {edu.details && (
                    <p className="text-xs text-slate-600 mt-1 italic">
                      {edu.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (Sidebar) - 4/12 */}
        <div className="col-span-4 space-y-6">
          
          {/* Core Skills */}
          <section className="bg-slate-50 p-4 rounded-lg print:bg-transparent print:p-0">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 mb-3 pb-1">
              Uzmanlık Alanları
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.core.map((skill, index) => (
                <span key={index} className="text-xs font-medium text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded print:border-none print:px-0 print:bg-transparent print:block print:w-full print:mb-1">
                  • {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Tech Skills */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 mb-3 pb-1">
              Teknik Yetkinlikler
            </h3>
            <ul className="space-y-2">
              {data.skills.technical.map((skill, index) => (
                <li key={index} className="flex items-start text-xs text-slate-700">
                  <CheckCircle2 size={12} className="text-blue-600 mr-2 mt-0.5 shrink-0" />
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Languages */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 mb-3 pb-1">
              Diller
            </h3>
            <ul className="space-y-1">
              {data.skills.languages.map((lang, index) => (
                <li key={index} className="text-sm text-slate-700 border-l-2 border-blue-500 pl-2">
                  {lang}
                </li>
              ))}
            </ul>
          </section>

          {/* Certificates */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 mb-3 pb-1">
              Sertifikalar
            </h3>
            <ul className="space-y-1.5">
              {data.certificates.map((cert, index) => (
                <li key={index} className="text-xs text-slate-700">
                  {cert}
                </li>
              ))}
            </ul>
          </section>

          {/* Ethics / Child Safety */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 mb-3 pb-1">
              Etik & Çocuk Koruma
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed text-justify">
              {data.ethics}
            </p>
          </section>

        </div>
      </div>
      
      {/* Footer / ATS hint */}
      <div className="mt-12 pt-4 border-t border-slate-200 flex justify-between text-[10px] text-slate-400">
        <span>CV - {data.name}</span>
        <span>ATS-Compliant Format</span>
      </div>
    </div>
  );
};