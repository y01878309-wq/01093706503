import React, { useState } from 'react';

type Section = 'videos' | 'exams' | 'solutions' | 'pdfs' | 'leaderboard' | 'adminPanel';

interface ContentItem {
  id: number;
  section: Section;
  title: string;
  description: string;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  const ADMIN_EMAIL = 'y01878309@gmail.com';
  
  const [allowedStudents, setAllowedStudents] = useState<string[]>([
    'student1@gmail.com'
  ]);

  const [newStudentEmail, setNewStudentEmail] = useState<string>('');
  const [currentSection, setCurrentSection] = useState<Section>('videos');

  const [contents] = useState<ContentItem[]>([
    { id: 1, section: 'videos', title: 'مقدمة في المنهج التعليمي', description: 'شرح تفصيلي لأهم أساسيات المنهج.' },
    { id: 2, section: 'exams', title: 'امتحان الفيزياء التجريبي - الفصل الأول', description: 'اختبر معلوماتك في الفصل الأول.' },
    { id: 3, section: 'solutions', title: 'حل نموذج الاسترشادي', description: 'الخطوات الكاملة للحل النموذجي.' },
    { id: 4, section: 'pdfs', title: 'ملخص قوانين الفيزياء - الفصل الأول', description: 'ملف PDF شامل لأهم قوانين واشتقاقات المنهج.' },
  ]);

  const [leaderboard] = useState<{ id: number; rank: number; name: string; score: string; details: string }[]>([]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();

    if (cleanEmail === ADMIN_EMAIL || allowedStudents.includes(cleanEmail)) {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('عذراً، هذا البريد غير مفعل. تواصل عبر الواتساب لتفعيل حسابك.');
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const emailToAdd = newStudentEmail.trim().toLowerCase();
    if (emailToAdd && !allowedStudents.includes(emailToAdd)) {
      setAllowedStudents([...allowedStudents, emailToAdd]);
      setNewStudentEmail('');
      alert('تم إضافة الطالب بنجاح وأصبح بإمكانه الدخول!');
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
            href="https://wa.me/201093706503?text=ازيك يا مستر يوسف، عاوز أقدم طلب انضمام للمنصة وده الإيميل بتاعي:" 
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

  const isAdmin = emailInput.trim().toLowerCase() === ADMIN_EMAIL;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#fff', fontFamily: 'Cairo, sans-serif', direction: 'rtl', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', backgroundColor: '#161e2e', borderBottom: '1px solid #1e293b' }}>
        <h1 style={{ fontSize: '15px', margin: 0, color: '#3b82f6' }}>
          {isAdmin ? 'لوحة تحكم الأدمن (يوسف فرج)' : 'منصة فاهم التعليمية'}
        </h1>
        <button 
          onClick={() => setIsAuthenticated(false)}
          style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
        >
          خروج
        </button>
      </header>

      <nav style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '15px', backgroundColor: '#111827', flexWrap: 'wrap', borderBottom: '1px solid #1e293b' }}>
        {[
          { key: 'videos', label: '🎥 الفيديوهات' },
          { key: 'exams', label: '📝 الامتحانات' },
          { key: 'solutions', label: '💡 الحل' },
          { key: 'pdfs', label: '📁 ملفات PDF' },
          { key: 'leaderboard', label: '🏆 التقييم والترتيب' },
          ...(isAdmin ? [{ key: 'adminPanel', label: '⚙️ إدارة الطلاب' }] : [])
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

      <main style={{ padding: '20px', maxWidth: '800px', width: '100%', margin: '0 auto', boxSizing: 'border-box', flex: 1 }}>
        {currentSection === 'leaderboard' ? (
          <div>
            <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#f8fafc' }}>ترتيب الطلاب الأوائل</h2>
            {leaderboard.length === 0 ? (
              <div style={{ backgroundColor: '#161e2e', padding: '40px', borderRadius: '10px', textAlign: 'center', border: '1px solid #1e293b', color: '#94a3b8' }}>
                <p style={{ fontSize: '15px', margin: 0 }}>لا توجد نتائج مسجلة حتى الآن. سيتم عرض ترتيب الطلاب هنا فور انتهاء أول اختبار! ⏳</p>
              </div>
            ) : null}
          </div>
        ) : currentSection === 'adminPanel' && isAdmin ? (
          <div>
            <h2 style={{ borderBottom: '2px solid #1e293b', paddingBottom: '10px', marginBottom: '15px', fontSize: '16px', color: '#38bdf8' }}>
              إدارة وقبول إيميلات الطلاب
            </h2>
            <div style={{ backgroundColor: '#161e2e', padding: '20px', borderRadius: '10px', border: '1px solid #1e293b', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', marginBottom: '10px', color: '#60a5fa' }}>إضافة إيميل طالب جديد لتفعيل دخوله:</h3>
              <form onSubmit={handleAddStudent} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input 
                  type="email" 
                  placeholder="student@gmail.com" 
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  required
                  style={{ flex: 1, minWidth: '220px', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', fontSize: '13px' }}
                />
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                  تفعيل وإضافة
                </button>
              </form>
            </div>

            <div style={{ backgroundColor: '#161e2e', padding: '20px', borderRadius: '10px', border: '1px solid #1e293b' }}>
              <h3 style={{ fontSize: '14px', marginBottom: '10px', color: '#94a3b8' }}>الإيميلات المفعلة حالياً ({allowedStudents.length}):</h3>
              <ul style={{ margin: 0, paddingRight: '20px', color: '#cbd5e1', fontSize: '13px' }}>
                {allowedStudents.map((mail, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>{mail}</li>
                ))}
              </ul>
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
