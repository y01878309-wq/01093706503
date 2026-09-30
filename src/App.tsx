import React, { useState } from 'react';

// الأقسام الأساسية للمنصة
type Section = 'videos' | 'exams' | 'solutions' | 'leaderboard';

interface ContentItem {
  id: number;
  section: Section;
  title: string;
  description: string;
  link?: string;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  // الإيميل المعتمد للأدمن والكود السري
  const ADMIN_EMAIL = 'y01878309@gmail.com';
  const SECRET_CODE = '123789';

  // قائمة الإيميلات أو الأكواد المسموح لها بالدخول (يمكنك إضافتها هنا)
  const allowedEmails = [ADMIN_EMAIL];

  const [currentSection, setCurrentSection] = useState<Section>('videos');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // بيانات المحتوى التجريبية للأقسام
  const [contents, setContents] = useState<ContentItem[]>([
    { id: 1, section: 'videos', title: 'مقدمة في المنهج التعليمي', description: 'شرح تفصيلي لأهم أساسيات المنهج.', link: '#' },
    { id: 2, section: 'exams', title: 'امتحان الشامل رقم 1', description: 'اختبر معلوماتك في الفصل الأول.', link: '#' },
    { id: 3, section: 'solutions', title: 'حل نموذج الاسترصادي', description: 'الخطوات الكاملة للحل النموذجي.', link: '#' },
    { id: 4, section: 'leaderboard', title: 'لوحة الشرف والتقييمات', description: 'أوائل الطلاب والمميزين هذا الأسبوع.', link: '#' },
  ]);

  // حقول إضافة محتوى جديد للأدمن
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLink, setNewLink] = useState('');
  const [targetSection, setTargetSection] = useState<Section>('videos');

  // دالة تسجيل الدخول
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim().toLowerCase();

    if (trimmed === SECRET_CODE || allowedEmails.includes(trimmed)) {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('البريد الإلكتروني أو الكود السري غير صحيح.');
    }
  };

  // هل المستخدم الحالي هو الأدمن الأساسي؟
  const isAdmin = inputVal.trim().toLowerCase() === ADMIN_EMAIL || inputVal.trim() === SECRET_CODE;

  // إضافة عنصر جديد
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ContentItem = {
      id: Date.now(),
      section: targetSection,
      title: newTitle,
      description: newDesc,
      link: newLink || '#'
    };

    setContents([newItem, ...contents]);
    setNewTitle('');
    setNewDesc('');
    setNewLink('');
    setShowAddModal(false);
  };

  // إذا لم يتم تسجيل الدخول، اعرض بوابة الحماية
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Cairo, sans-serif', padding: '20px' }}>
        <div style={{ backgroundColor: '#161e2e', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px', fontSize: '22px', color: '#3b82f6' }}>منصة فاهم التعليمية</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>المنصة مقفولة. أدخل البريد الإلكتروني أو الكود السري للمتابعة.</p>
          
          <form onSubmit={handleLogin}>
            <input 
              type="text" 
              placeholder="البريد الإلكتروني أو الكود السري" 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', marginBottom: '15px', outline: 'none', textAlign: 'center' }}
            />
            {errorMsg && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '15px' }}>{errorMsg}</p>}
            <button 
              type="submit" 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' }}
            >
              دخول المنصة
            </button>
          </form>
        </div>
      </div>
    );
  }

  // واجهة المنصة بعد الدخول بنجاح
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#fff', fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
      {/* شريط العلوى */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', backgroundColor: '#161e2e', borderBottom: '1px solid #1e293b' }}>
        <h1 style={{ fontSize: '20px', margin: 0, color: '#3b82f6' }}>منصة فاهم التعليمية</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* زرار الأدمن يظهر فقط لصاحب الصلاحية */}
          {isAdmin && (
            <button 
              onClick={() => setShowAddModal(true)}
              style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}
              title="إضافة محتوى جديد"
            >
              +
            </button>
          )}
          <button 
            onClick={() => setIsAuthenticated(false)}
            style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            تسجيل خروج
          </button>
        </div>
      </header>

      {/* شريط التنقل بين الأقسام */}
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '15px', padding: '20px', backgroundColor: '#111827', flexWrap: 'wrap' }}>
        {[
          { key: 'videos', label: '🎥 الفيديوهات والشرح' },
          { key: 'exams', label: '📝 الامتحانات' },
          { key: 'solutions', label: '💡 الحل والتدريبات' },
          { key: 'leaderboard', label: '🏆 التقييم والترتيب' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCurrentSection(tab.key as Section)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: currentSection === tab.key ? '#3b82f6' : '#1f2937',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* محتوى القسم الحالي */}
      <main style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ borderBottom: '2px solid #1e293b', paddingBottom: '10px', marginBottom: '20px', textTransform: 'capitalize' }}>
          {currentSection === 'videos' && 'قسم الفيديوهات والشرح'}
          {currentSection === 'exams' && 'قسم الامتحانات والاختبارات'}
          {currentSection === 'solutions' && 'قسم الحل والتدريبات'}
          {currentSection === 'leaderboard' && 'قسم التقييم والترتيب'}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {contents.filter(item => item.section === currentSection).length === 0 ? (
            <p style={{ color: '#94a3b8' }}>لا يوجد محتوى مضاف في هذا القسم حالياً.</p>
          ) : (
            contents
              .filter(item => item.section === currentSection)
              .map(item => (
                <div key={item.id} style={{ backgroundColor: '#161e2e', border: '1px solid #1e293b', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#60a5fa' }}>{item.title}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '15px' }}>{item.description}</p>
                  {item.link && item.link !== '#' && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
                      عرض المحتوى ⬅
                    </a>
                  )}
                </div>
              ))
          )}
        </div>
      </main>

      {/* نافذة إضافة محتوى (تظهر فقط للأدمن عند الضغط على زر +) */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#161e2e', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '450px', border: '1px solid #334155' }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#3b82f6' }}>إضافة محتوى جديد للمنصة</h3>
            
            <form onSubmit={handleAddItem}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', color: '#cbd5e1' }}>اختر القسم:</label>
                <select 
                  value={targetSection} 
                  onChange={(e) => setTargetSection(e.target.value as Section)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff' }}
                >
                  <option value="videos">الفيديوهات والشرح</option>
                  <option value="exams">الامتحانات</option>
                  <option value="solutions">الحل والتدريبات</option>
                  <option value="leaderboard">التقييم والترتيب</option>
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', color: '#cbd5e1' }}>عنوان المحتوى:</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  placeholder="مثال: الدرس الأول - الفيزياء" 
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', color: '#cbd5e1' }}>وصف مختصر:</label>
                <textarea 
                  value={newDesc} 
                  onChange={(e) => setNewDesc(e.target.value)} 
                  placeholder="تفاصيل عن الدرس أو الامتحان..." 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', height: '80px' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', color: '#cbd5e1' }}>رابط الفيديو أو الملف (اختياري):</label>
                <input 
                  type="text" 
                  value={newLink} 
                  onChange={(e) => setNewLink(e.target.value)} 
                  placeholder="https://..." 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="submit" 
                  style={{ flex: 1, padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  إضافة
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  style={{ flex: 1, padding: '10px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
