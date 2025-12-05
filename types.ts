export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  type: string;
  location?: string;
  description: string[];
}

export interface Education {
  institution: string;
  degree: string;
  years: string;
  details?: string;
}

export interface CVData {
  name: string;
  title: string;
  contact: ContactInfo;
  summary: string;
  skills: {
    core: string[];
    technical: string[];
    languages: string[];
  };
  experience: Experience[];
  education: Education[];
  certificates: string[];
  ethics: string;
}