import React, { useState } from 'react';

type Section = 'videos' | 'exams' | 'solutions' | 'pdfs' | 'leaderboard';

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: number;
}

interface ContentItem {
  id: number;
  section: Section;
  title: string;
  description: string;
  link?: string;
  questions?: Question[];
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  const ADMIN_EMAIL = 'y01878309@gmail.com';
  // قائمة الطلاب المقبولين (يمكنك إضافة أي إيميل هنا ليتمكن من الدخول)
  const allowedStudents = ['student1@gmail.com', 'student2@gmail.com'];

  const [currentSection, setCurrentSection] = useState<Section>('videos');

  // بيانات المنصة الأساسية
  const [contents] = useState<ContentItem[]>([
    { id: 1, section: 'videos', title: 'مقدمة في المنهج التعليمي', description: 'شرح تفصيلي لأهم أساسيات المنهج.', link: '#' },
    { 
      id: 2, 
      section: 'exams', 
      title: 'امتحان الفيزياء التجريبي - الفصل الأول', 
      description: 'اختبر معلوماتك في الفصل الأول.',
      questions: [
        {
          id: 1,
          questionText: 'ما هي وحدة قياس الشدة الكهربائية؟',
          options: ['فولت', 'أمبير', 'اوم', 'جول'],
          correctAnswer: 1
        }
      ]
    },
    { id: 3, section: 'solutions', title: 'حل نموذج الاسترشادي', description: 'الخطوات الكاملة للحل النموذجي.', link: '#' },
    { id: 4, section: 'pdfs', title: 'ملخص قوانين الفيزياء - الفصل الأول', description: 'ملف PDF شامل لأهم قوانين واشتقاقات المنهج.', link: '#' },
  ]);

  const [students] = useState([
    { id: 1, rank: 1, name: 'أحمد البهي', score: 51, details: 'أكمل 2 اختبار' },
    { id: 2, rank: 2, name: 'محمد مبارك', score: 49, details: 'أكمل 2 اختبار' },
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();

    if (cleanEmail === ADMIN_EMAIL) {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else if (allowedStudents.includes(cleanEmail)) {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('عذراً، هذا البريد غير مفعل. تواصل عبر الواتساب لتفعيل حسابك.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Cairo, sans-serif', padding: '20px', direction: 'rtl' }}>
        <div style={{ backgroundColor: '#161e2e', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', textAlign: 'center', border: '1px solid #1e293b' }}>
          <h2 style={{ marginBottom: '10px', fontSize: '22px', color: '#3b82f6' }}>منصة فاهم التعليمية</h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>أدخل بريدك الإلكتروني (Gmail) للمتابعة.</p>
          
          <form onSubmit={handleLogin}>
            <input 
              type="email" 
              placeholder="example@gmail.com" 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', marginBottom: '15px', outline: 'none', textAlign: 'center', fontSize: '14px' }}
            />
            {errorMsg && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '15px' }}>{errorMsg}</p>}
            
            <button 
              type="submit" 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#0284c7', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginBottom: '12px' }}
            >
              تسجيل الدخول
            </button>
          </form>

          <a 
            href="https://wa.me/20101878309?text=ازيك يا مستر يوسف، عاوز أقدم طلب انضمام للمنصة وده الإيميل بتاعي:" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ display: 'block', padding: '10px', backgroundColor: '#25d366', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}
          >
            💬 تواصل مع المسؤول عبر واتساب
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#fff', fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', backgroundColor: '#161e2e', borderBottom: '1px solid #1e293b' }}>
        <h1 style={{ fontSize: '16px', margin: 0, color: '#3b82f6' }}>
          {emailInput.trim().toLowerCase() === ADMIN_EMAIL ? 'لوحة تحكم الأدمن (يوسف فرج)' : 'منصة فاهم التعليمية'}
        </h1>
        <button 
          onClick={() => setIsAuthenticated(false)}
          style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
        >
          خروج
        </button>
      </header>

      <nav style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '15px', backgroundColor: '#111827', flexWrap: 'wrap' }}>
        {[
          { key: 'videos', label: '🎥 الفيديوهات' },
          { key: 'exams', label: '📝 الامتحانات' },
          { key: 'solutions', label: '💡 الحل' },
          { key: 'pdfs', label: '📁 ملفات PDF' },
          { key: 'leaderboard', label: '🏆 التقييم' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCurrentSection(tab.key as Section)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: currentSection === tab.key ? '#3b82f6' : '#1f2937',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '12px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        {currentSection === 'leaderboard' ? (
          <div>
            <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#f8fafc' }}>ترتيب الطلاب</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {students.map((st) => (
                <div key={st.id} style={{ backgroundColor: '#161e2e', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #1e293b' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#fff' }}>{st.rank}. {st.name}</h4>
                    <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>{st.details}</p>
                  </div>
                  <span style={{ fontSize: '18px' }}>🏆</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2 style={{ borderBottom: '2px solid #1e293b', paddingBottom: '10px', marginBottom: '15px', fontSize: '16px', color: '#38bdf8' }}>
              {currentSection === 'videos' && 'قسم الفيديوهات والشرح'}
              {currentSection === 'exams' && 'قسم الامتحانات والاختبارات'}
              {currentSection === 'solutions' && 'قسم الحل والتدريبات'}
              {currentSection === 'pdfs' && 'قسم ملفات الـ PDF'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '15px' }}>
              {contents.filter(item => item.section === currentSection).map(item => (
                <div key={item.id} style={{ backgroundColor: '#161e2e', border: '1px solid #1e293b', borderRadius: '10px', padding: '15px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#60a5fa' }}>{item.title}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '12px' }}>{item.description}</p>
                  <button style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                    عرض المحتوى ⬅
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
