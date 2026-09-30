import React, { useState } from 'react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState('videos');
  const [allowedStudents, setAllowedStudents] = useState<string[]>([]);
  const [newStudent, setNewStudent] = useState('');

  const adminEmail = 'y01878309@gmail.com';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === adminEmail || allowedStudents.includes(cleanEmail)) {
      setIsLoggedIn(true);
    } else {
      alert('هذا البريد غير مفعل. تواصل عبر الواتساب لتفعيله.');
    }
  };

  const addStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudent) {
      setAllowedStudents([...allowedStudents, newStudent.trim().toLowerCase()]);
      setNewStudent('');
      alert('تم إضافة الطالب بنجاح!');
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ backgroundColor: '#0b0f19', color: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Cairo, sans-serif', direction: 'rtl', padding: '20px' }}>
        <div style={{ backgroundColor: '#161e2e', padding: '25px', borderRadius: '12px', width: '100%', maxWidth: '380px', border: '1px solid #1e293b', textAlign: 'center' }}>
          <h2 style={{ color: '#38bdf8', marginBottom: '15px', fontSize: '20px' }}>منصة فاهم التعليمية</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="email" 
              placeholder="أدخل بريدك الإلكتروني" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', textAlign: 'center' }}
            />
            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>
              دخول
            </button>
          </form>
          <a href="https://wa.me/201093706503?text=ازيك يا مستر يوسف، عاوز أقدم طلب انضمام للمنصة وده الإيميل بتاعي:" target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '10px', backgroundColor: '#25d366', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>
            💬 تواصل عبر الواتساب (01093706503)
          </a>
        </div>
      </div>
    );
  }

  const isAdmin = email.trim().toLowerCase() === adminEmail;

  return (
    <div style={{ backgroundColor: '#0b0f19', color: '#fff', minHeight: '100vh', fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#161e2e', borderBottom: '1px solid #1e293b' }}>
        <h1 style={{ fontSize: '14px', color: '#38bdf8', margin: 0 }}>{isAdmin ? 'لوحة الأدمن (يوسف فرج)' : 'منصة فاهم'}</h1>
        <button onClick={() => setIsLoggedIn(false)} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>خروج</button>
      </header>

      <nav style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '12px', backgroundColor: '#111827', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('videos')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', backgroundColor: activeTab === 'videos' ? '#3b82f6' : '#1f2937', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>الفيديوهات</button>
        <button onClick={() => setActiveTab('exams')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', backgroundColor: activeTab === 'exams' ? '#3b82f6' : '#1f2937', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>الامتحانات</button>
  <button onClick={() => setActiveTab('leaderboard')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', backgroundColor: activeTab === 'leaderboard' ? '#3b82f6' : '#1f2937', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>التقييم والترتيب</button>
        {isAdmin && <button onClick={() => setActiveTab('admin')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', backgroundColor: activeTab === 'admin' ? '#3b82f6' : '#1f2937', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>إدارة الطلاب</button>}
      </nav>

      <main style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
        {activeTab === 'videos' && <div><h3>الفيديوهات والشرح</h3><p style={{ color: '#94a3b8', fontSize: '13px' }}>جاري إضافة الحصص قريباً...</p></div>}
        {activeTab === 'exams' && <div><h3>الامتحانات</h3><p style={{ color: '#94a3b8', fontSize: '13px' }}>لا توجد امتحانات متاحة حالياً.</p></div>}
        {activeTab === 'leaderboard' && <div><h3>ترتيب الطلاب</h3><div style={{ backgroundColor: '#161e2e', padding: '30px', textAlign: 'center', borderRadius: '8px', color: '#94a3b8' }}>لا توجد نتائج مسجلة حتى الآن ⏳</div></div>}
        {activeTab === 'admin' && isAdmin && (
          <div>
            <h3>إدارة الطلاب المقبولين</h3>
            <form onSubmit={addStudent} style={{ display: 'flex', gap: '10px', marginTop: '10px', marginBottom: '15px' }}>
              <input type="email" placeholder="أدخل إيميل الطالب" value={newStudent} onChange={(e) => setNewStudent(e.target.value)} required style={{ flex: 1, padding: '8px', borderRadius: '6px', backgroundColor: '#0b0f19', color: '#fff', border: '1px solid #334155' }} />
              <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>إضافة</button>
            </form>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>عدد الإيميلات المفعلة: {allowedStudents.length}</p>
          </div>
        )}
      </main>
    </div>
  );
}
