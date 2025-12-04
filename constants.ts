import { CVData } from './types';

export const INITIAL_CV_DATA: CVData = {
  name: "EKREM DEĞİRMENCİ",
  title: "Eğitim Veri Yönetimi Uzmanı & Veri Analisti",
  contact: {
    email: "ekremregister@gmail.com",
    phone: "+90 535 446 53 89",
    location: "İstanbul, Türkiye",
    nationality: "T.C."
  },
  summary: "Eğitim kurumlarında kullanılmak üzere kapsamlı ve sürdürülebilir veri yönetim sistemleri oluşturma, akademik ve idari süreçlere ilişkin verilerin toplanması, temizlenmesi, metadata düzenlemesi ve raporlanması alanlarında uzmanlaşmış veri analitiği profesyoneli. 6 yıllık deneyim boyunca Python, Power BI, Excel (ileri), SQL ve SPSS gibi araçlarla regresyon, korelasyon, karar ağaçları, K-Means ve Naive Bayes analizleri yaparak kullanıcı dostu dashboard’lar, etki analizleri ve karar destek modelleri ürettim. KVKK/GDPR uyumlu veri güvenliği protokollerini uygulama deneyimine sahibim. Hisar Okulları'nın stratejik hedeflerine katkı sağlamak üzere, eğitim politikalarının geliştirilmesi için veri temelli stratejik içgörüler üretir, veri süreçlerinde doğruluk, şeffaflık ve erişilebilirlik standartlarını esas alırım.",
  skills: {
    core: [
      "Veri Yönetimi & Metadata Organizasyonu",
      "Eğitim Veri Analitiği",
      "Regresyon & Korelasyon Analizi",
      "Karar Ağaçları & K-Means",
      "KVKK/GDPR Uyumlu Veri Saklama",
      "Karar Destek Sistemleri",
      "Süreç Analizi & KPI Raporlama"
    ],
    technical: [
      "Python (Pandas, NumPy)",
      "Microsoft Power BI (DAX, Dashboard)",
      "SQL (Sorgulama, Veri Yönetimi)",
      "SPSS (İleri İstatistik)",
      "Excel (Power Query, Pivot, VBA)",
      "Git / Versiyon Kontrolü"
    ],
    languages: [
      "Türkçe (Ana Dil)",
      "İngilizce (İleri Seviye - ODTÜ Mezunu)"
    ]
  },
  experience: [
    {
      company: "IPSOS",
      role: "Data Executive",
      period: "2022 – 2025",
      type: "Tam Zamanlı",
      description: [
        "Büyük ölçekli veri setlerinde regresyon, korelasyon ve segmentasyon analizleri gerçekleştirerek stratejik içgörüler ürettim.",
        "Python, Excel (ileri), SPSS ve Power BI kullanarak çok boyutlu performans ve araştırma raporları oluşturdum.",
        "Veri kalitesini artırmak ve metadata tutarlılığını sağlamak için otomatik kalite kontrol modelleri ve temizlik süreçleri tasarladım.",
        "Yönetim kademesi için karmaşık verileri sadeleştiren, karar alma süreçlerini hızlandıran kullanıcı dostu dashboard’lar hazırladım."
      ]
    },
    {
      company: "Girne Amerikan Üniversitesi",
      role: "Kurumsal Veri Yönetimi ve Raporlama Uzmanı",
      period: "2019 – 2022",
      type: "Tam Zamanlı",
      description: [
        "Akademik ve idari süreçlere ilişkin verilerin toplanması, temizlenmesi, saklanması ve raporlanması süreçlerini uçtan uca yönettim.",
        "Eğitim kurumuna özgü, K12 ve yükseköğretim dinamiklerine uygun veri yönetim sistemi ve metadata yapıları kurdum.",
        "Python ve SPSS kullanarak akademik performans analizleri, risk haritaları ve karar destek raporları geliştirdim.",
        "KVKK uyumlu veri güvenliği modelleri ve erişim hiyerarşileri tasarlayarak veri gizliliğini güvence altına aldım.",
        "Akademik birimlere stratejik planlama ve süreç iyileştirme için veri temelli öneriler sundum."
      ]
    },
    {
      company: "HARIBO",
      role: "İnsan Kaynakları Raporlama Stajyeri",
      period: "2017",
      type: "Staj",
      description: [
        "Puantaj, vardiya ve personel verilerinin işlenmesi, doğrulanması ve Excel tabanlı raporlama süreçlerini yürüttüm.",
        "İK süreçlerinde veri bütünlüğünü sağlamak için rutin kalite kontrolleri gerçekleştirdim."
      ]
    },
    {
      company: "Merit Park Hotel",
      role: "İnsan Kaynakları Stajyeri",
      period: "2017",
      type: "Staj",
      description: [
        "Personel veri kayıtlarının dijitalleştirilmesi, güncellenmesi ve dosya yönetimi süreçlerine destek verdim."
      ]
    }
  ],
  education: [
    {
      institution: "Girne American University",
      degree: "İşletme Yönetimi (MBA)",
      years: "Tez Dönemi",
      details: "Yönetim, organizasyon, stratejik karar alma ve süreç analizi odaklı."
    },
    {
      institution: "Orta Doğu Teknik Üniversitesi (ODTÜ)",
      degree: "Psikoloji (İngilizce)",
      years: "2011 – 2019",
      details: "Gelişimsel psikoloji, araştırma yöntemleri ve istatistiksel analiz altyapısı."
    },
    {
      institution: "Near East College",
      degree: "Fen / İngilizce Programı",
      years: "2005 – 2009"
    }
  ],
  certificates: [
    "Google Data Analytics Certificate",
    "IBM Applied Data Science",
    "Microsoft Power BI Data Analyst",
    "PwC Data‑Driven Decision Making"
  ],
  ethics: "Gelişim psikolojisi akademik altyapım ile çocuk koruma ilkelerine ve etik değerlere tam bağlılık gösteririm. Veri yönetiminde KVKK/GDPR standartlarını, şeffaflığı ve gizliliği temel prensip olarak benimserim."
};