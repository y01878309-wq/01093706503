import React, { useState, useEffect } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [visitedEmails, setVisitedEmails] = useState([]);

  // 1. تحميل بيانات المستخدم والبريد المسجل مسبقاً من localStorage عند فتح المنصة
  useEffect(() => {
    const savedUser = localStorage.getItem('fahem_user_email');
    if (savedUser) {
      setUser(savedUser);
    }

    // تحميل قائمة الإيميلات اللي دخلت المنصة قبل كده
    const savedEmails = JSON.parse(localStorage.getItem('fahem_visited_emails') || '[]');
    setVisitedEmails(savedEmails);

    // تحديث عناوين محركات البحث (SEO) بالأسماء الثلاثة
    document.title = "منصة فاهم التعليمية | فروج | farag1.vercel.app";
    
    // إضافة الـ Meta Tags للأسماء والكلمات المفتاحية ديناميكياً
    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "منصة فاهم التعليمية - فروج - farag1.vercel.app المنصة التعليمية الخاصة بالأستاذ يوسف فرج لتقديم الشرح والامتحانات.";
  }, []);

  // دالة تسجيل الدخول وحفظ الإيميل والترحيب به
  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert('من فضلك ادخل بريد إلكتروني صحيح');
      return;
    }

    // حفظ المستخدم في الـ localStorage عشان ميسجلش تاني كل ما يفتح
    localStorage.setItem('fahem_user_email', email);
    setUser(email);

    // رسالة ترحيبية مخصصة
    setWelcomeMessage(`أهلاً بك يا بطل في منصة فاهم التعليمية! سعيد جداً بوجودك معنا.`);

    // حفظ الإيميل في قائمة الزوار لتتبع من دخل المنصة
    const updatedEmails = [...visitedEmails, { email, time: new Date().toLocaleString() }];
    setVisitedEmails(updatedEmails);
    localStorage.setItem('fahem_visited_emails', JSON.stringify(updatedEmails));
  };

  // زر تسجيل الخروج لو حابب تجرب من تاني
  const handleLogout = () => {
    localStorage.removeItem('fahem_user_email');
    setUser(null);
    setEmail('');
    setWelcomeMessage('');
  };

  return (
    <div style={{ fontFamily: 'Cairo, Tahoma, sans-serif', direction: 'rtl', padding: '20px', background: '#f4f6f9', minHeight: '100vh' }}>
      
      {/* الهيدر أو رأس الصفحة */}
      <header style={{ background: '#2c3e50', color: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' }}>
        <h1>منصة فاهم التعليمية (فروج)</h1>
        <p style={{ fontSize: '14px', color: '#bdc3c7' }}>farag1.vercel.app</p>
      </header>

      {/* لو المستخدم لسه مَسجّلش دخول */}
      {!user ? (
        <div style={{ maxWidth: '400px', margin: '50px auto', background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px' }}>تسجيل الدخول للمنصة</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="email" 
              placeholder="اكتب البريد الإلكتروني (Gmail) هنا..." 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px', boxSizing: 'border-box' }}
              required
            />
            <button 
              type="submit" 
              style={{ width: '100%', padding: '12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
              دخول المنصة
            </button>
          </form>
        </div>
      ) : (
        /* لو المستخدم مسجل دخول بالفعل */
        <div>
          {/* رسالة الترحيب */}
          <div style={{ background: '#d4edda', color: '#155724', padding: '20px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px', border: '1px solid #c3e6cb' }}>
            <h3>{welcomeMessage || `أهلاً بك مجدداً يا قهرمان (${user})! 🚀`}</h3>
          </div>

          {/* محتوى المنصة الرئيسي */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <h2>محتوى الشرح والامتحانات</h2>
            <p>أهلاً بك في لوحة تحكم الطالب. يمكنك متابعة الدروس والامتحانات الخاصة بك من هنا.</p>
          </div>

          {/* لوحة تحكم المدير (لعرض الإيميلات اللي دخلت المنصة) */}
          <div style={{ background: '#fff3cd', color: '#856404', padding: '20px', borderRadius: '8px', border: '1px solid #ffeeba' }}>
            <h3>لوحة المتابعة (خاصة بك لمعرفة من دخل):</h3>
            <p>إجمالي عدد الطلاب الذين سجلوا دخولهم: <strong>{visitedEmails.length}</strong></p>
            <ul style={{ maxHeight: '150px', overflowY: 'auto', paddingRight: '20px' }}>
              {visitedEmails.map((item, index) => (
                <li key5={index} style={{ marginBottom: '5px' }}>
                  {item.email} — <span style={{ fontSize: '12px', color: '#666' }}>({item.time})</span>
                </li>
              ))}
            </ul>
          </div>

          {/* زر خروج للتجربة */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              onClick={handleLogout}
              style={{ padding: '8px 15px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              تسجيل الخروج (للتجربة)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
