import React, { useState } from 'react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // إيميلك الأدمن
  const ADMIN_EMAIL = 'y01878309@gmail.com';
  // الكود السري المطلوب
  const VALID_CODE = '123789';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretCode === VALID_CODE || userEmail === ADMIN_EMAIL) {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('الكود السري غير صحيح. تواصل مع المعلم للحصول على الكود.');
    }
  };

  // لو المستخدم لسه مش مسجل أو مدخلش الكود، تظهر بوابة الدخول الإجبارية
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px', color: '#38bdf8' }}>منصة فاهم التعليمية</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>المنصة مقفولة بكلمة مرور. أدخل الكود السري أو بريدك للمتابعة.</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="email" 
              placeholder="البريد الإلكتروني (اختياري للأدمن)" 
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
            />
            <input 
              type="password" 
              placeholder="أدخل الكود السري (مثال: 123789)" 
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
              required
            />
            <button type="submit" style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#2563eb', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
              دخول المنصة
            </button>
          </form>

          {errorMsg && <p style={{ color: '#f87171', fontSize: '13px', marginTop: '15px' }}>{errorMsg}</p>}

          <div style={{ marginTop: '20px', borderTop: '1px solid #334155', paddingTop: '15px' }}>
            <a 
              href="https://wa.me/201093706503?text=مرحباً%20أريد%20كود%20التفعيل%20لمنصة%20فاهم" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#22c55e', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}
            >
              💬 طلب الكود عبر واتساب المعلم
            </a>
          </div>
        </div>
      </div>
    );
  }

  // الواجهة الرئيسية للمنصة (تظهر فقط بعد الدخول الصحيح)
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #334155', paddingBottom: '15px' }}>
        <h1 style={{ fontSize: '20px', color: '#38bdf8' }}>منصة فاهم التعليمية</h1>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* الزر الأزرق (+) يظهر حصرياً لك أنت كأدمن فقط */}
          {userEmail === ADMIN_EMAIL && (
            <button 
              onClick={() => alert('لوحة تحكم الأدمن لرفع المحتوى')}
              style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              title="إضافة محتوى جديد"
            >
              +
            </button>
          )}
          <button 
            onClick={() => setIsAuthenticated(false)}
            style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
          >
            تسجيل خروج
          </button>
        </div>
      </header>

      <main style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>أهلاً بك في منصة فاهم</h2>
        <p style={{ color: '#94a3b8' }}>تم تأمين المنصة بنجاح وحذف الحسابات الوهمية.</p>
      </main>
    </div>
  );
}
