import React, { useState, useEffect } from 'react';

type Section = 'videos' | 'exams' | 'solutions' | 'pdfs' | 'leaderboard' | 'adminPanel';

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: number;
}

interface ExamItem {
  id: number;
  section: Section;
  title: string;
  description: string;
  questions?: Question[];
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  const ADMIN_EMAIL = 'y01878309@gmail.com';
  
  const [allowedStudents, setAllowedStudents] = useState<string[]>(() => {
    const saved = localStorage.getItem('allowed_students_farag');
    return saved ? JSON.parse(saved) : ['student1@gmail.com', 'mohammedfarag692@gmail.com'];
  });

  const [newStudentEmail, setNewStudentEmail] = useState<string>('');
  const [currentSection, setCurrentSection] = useState<Section>('videos');

  // المحتوى مع امتحان تجريبي جاهز بأسئلة واختيارات حقيقية
  const [contents, setContents] = useState<ExamItem[]>(() => {
    const saved = localStorage.getItem('platform_contents_farag');
    return saved ? JSON.parse(saved) : [
      { id: 1, section: 'videos', title: 'مقدمة في المنهج التعليمي', description: 'شرح تفصيلي لأهم أساسيات المنهج.' },
      { 
        id: 2, 
        section: 'exams', 
        title: 'امتحان الفيزياء التجريبي - الفصل الأول', 
        description: 'اختبر معلوماتك في الفصل الأول مع تصحيح فوري.',
        questions: [
          {
            id: 1,
            questionType: 'mcq',
            questionText: 'وحدة قياس الشحنة الكهربية هي:',
            options: ['أمبير', 'فولت', 'كولوم', 'اوم'],
            correctAnswer: 2
          },
          {
            id: 2,
            questionType: 'mcq',
            questionText: 'العوامل التي يتوقف عليها مقاومة موصل هي:',
            options: ['طول الموصل فقط', 'مساحة الصليب فقط', 'نوع المواد ودرجة الحرارة', 'جميع ما سبق'],
            correctAnswer: 3
          }
        ]
      },
      { id: 3, section: 'solutions', title: 'حل نموذج الاسترشادي', description: 'الخطوات الكاملة للحل النموذجي.' },
      { id: 4, section: 'pdfs', title: 'ملخص قوانين الفيزياء - الفصل الأول', description: 'ملف PDF شامل لأهم قوانين واشتقاقات المنهج.' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('allowed_students_farag', JSON.stringify(allowedStudents));
  }, [allowedStudents]);

  useEffect(() => {
    localStorage.setItem('platform_contents_farag', JSON.stringify(contents));
  }, [contents]);

  // حقول إضافة محتوى جديد للأدمن
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTargetSection, setNewTargetSection] = useState<Section>('videos');
  
  // حقول إضافة امتحان بأسئلة
  const [examQText, setExamQText] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt4, setOpt4] = useState('');
  const [correctOptIdx, setCorrectOptIdx] = useState<number>(0);
  const [tempQuestions, setTempQuestions] = useState<Question[]>([]);

  // حالة الامتحان الحالي للطلاب
  const [activeExam, setActiveExam] = useState<ExamItem | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);
  const [examScore, setExamScore] = useState<number>(0);

  const [leaderboard, setLeaderboard] = useState<{ id: number; rank: number; name: string; score: string; details: string }[]>(() => {
    const saved = localStorage.getItem('platform_leaderboard_farag');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('platform_leaderboard_farag', JSON.stringify(leaderboard));
  }, [leaderboard]);

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
      const updated = [...allowedStudents, emailToAdd];
      setAllowedStudents(updated);
      setNewStudentEmail('');
      alert('تم إضافة الطالب بنجاح!');
    }
  };

  const handleAddQuestionToTemp = () => {
    if (examQText && opt1 && opt2) {
      const newQ: Question = {
        id: Date.now(),
        questionText: examQText,
        options: [opt1, opt2, opt3, opt4].filter(Boolean),
        correctAnswer: Number(correctOptIdx)
      };
      setTempQuestions([...tempQuestions, newQ]);
      setExamQText('');
      setOpt1('');
      setOpt2('');
      setOpt3('');
      setOpt4('');
      alert('تم إضافة السؤال بنجاح إلى الامتحان الجديد!');
    } else {
      alert('الرجاء كتابة السؤال واختيارين على الأقل.');
    }
  };

  const handleAddContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle && newDesc) {
      const newItem: ExamItem = {
        id: Date.now(),
        section: newTargetSection,
        title: newTitle,
        description: newDesc,
        questions: newTargetSection === 'exams' ? tempQuestions : undefined
      };
      setContents([newItem, ...contents]);
      setNewTitle('');
      setNewDesc('');
      setTempQuestions([]);
      alert('تم نشر المحتوى بنجاح على المنصة!');
    }
  };

  const handleOptionSelect = (qId: number, optIdx: number) => {
    if (isExamSubmitted) return;
    setUserAnswers({ ...userAnswers, [qId]: optIdx });
  };

  const handleSubmitExam = () => {
    if (!activeExam || !activeExam.questions) return;
    let score = 0;
    activeExam.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    setExamScore(score);
    setIsExamSubmitted(true);

    // تسجيل النتيجة في لوحة التقييم
    const studentName = emailInput.split('@')[0];
    const newEntry = {
      id: Date.now(),
      rank: leaderboard.length + 1,
      name: studentName,
      score: `${score} / ${activeExam.questions.length}`,
      details: activeExam.title
    };
    setLeaderboard([newEntry, ...leaderboard]);
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
            💬 تواصل مع المسؤول عبر واتساب (01093706503)
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
          onClick={() => { setIsAuthenticated(false); setActiveExam(null); }}
          style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
        >
          خروج
        </button>
      </header>

      <nav style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '12px', backgroundColor: '#111827', flexWrap: 'wrap', borderBottom: '1px solid #1e293b' }}>
        {[
          { key: 'videos', label: '🎥 الفيديوهات' },
          { key: 'exams', label: '📝 الامتحانات' },
          { key: 'solutions', label: '💡 الحل' },
          { key: 'pdfs', label: '📁 ملفات PDF' },
          { key: 'leaderboard', label: '🏆 التقييم والترتيب' },
          ...(isAdmin ? [{ key: 'adminPanel', label: '⚙️ لوحة التحكم والإضافة' }] : [])
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setCurrentSection(tab.key as Section); setActiveExam(null); }}
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
        {activeExam ? (
          <div style={{ backgroundColor: '#161e2e', padding: '25px', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <button 
              onClick={() => { setActiveExam(null); setIsExamSubmitted(false); setUserAnswers({}); }}
              style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginBottom: '20px', fontSize: '12px' }}
            >
              ⬅ العودة لقائمة الامتحانات
            </button>

            <h2 style={{ color: '#60a5fa', marginBottom: '10px', fontSize: '18px' }}>{activeExam.title}</h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>{activeExam.description}</p>

            {isExamSubmitted && (
              <div style={{ backgroundColor: '#065f46', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>🎉 نتيجة الامتحان</h3>
                <p style={{ fontSize: '15px', margin: 0 }}>لقد حصلت على {examScore} من {activeExam.questions?.length || 0}</p>
              </div>
            )}

            {activeExam.questions && activeExam.questions.length > 0 ? (
              activeExam.questions.map((q, qIndex) => (
                <div key={q.id} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#0b0f19', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '10px' }}>{qIndex + 1}. {q.questionText}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {q.options.map((opt, optIdx) => {
                      let btnBg = '#1f2937';
                      if (isExamSubmitted) {
                        if (optIdx === q.correctAnswer) btnBg = '#059669'; // صح أخضر
                        else if (userAnswers[q.id] === optIdx) btnBg = '#dc2626'; // خطأ أحمر
                      } else if (userAnswers[q.id] === optIdx) {
                        btnBg = '#2563eb'; // اختيار المستخدم الأزرق
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleOptionSelect(q.id, optIdx)}
                          style={{
                            padding: '10px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: btnBg,
                            color: '#fff',
                            textAlign: 'right',
                            cursor: isExamSubmitted ? 'default' : 'pointer',
                            fontSize: '13px'
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '13px' }}>لا توجد أسئلة مضافة لهذا الامتحان حالياً.</p>
            )}

            {!isExamSubmitted && activeExam.questions && activeExam.questions.length > 0 && (
              <button 
                onClick={handleSubmitExam}
                style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', marginTop: '10px' }}
              >
                تسليم الإجابات ومعرفة النتيجة ✅
              </button>
            )}
          </div>
        ) : currentSection === 'leaderboard' ? (
          <div>
            <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#f8fafc' }}>ترتيب الطلاب الأوائل</h2>
            {leaderboard.length === 0 ? (
              <div style={{ backgroundColor: '#161e2e', padding: '40px', borderRadius: '10px', textAlign: 'center', border: '1px solid #1e293b', color: '#94a3b8' }}>
                <p style={{ fontSize: '15px', margin: 0 }}>لا توجد نتائج مسجلة حتى الآن. سيتم عرض ترتيب الطلاب هنا فور انتهاء أول اختبار! ⏳</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {leaderboard.map((item, idx) => (
                  <div key={item.id} style={{ backgroundColor: '#161e2e', padding: '12px 15px', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ color: '#3b82f6', fontWeight: 'bold', marginLeft: '10px' }}>#{idx + 1}</span>
                      <span style={{ fontSize: '14px' }}>{item.name}</span>
                      <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8' }}>{item.details}</span>
                    </div>
                    <div style={{ backgroundColor: '#1e293b', padding: '5px 10px', borderRadius: '6px', color: '#10b981', fontWeight: 'bold', fontSize: '13px' }}>
                      {item.score}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : currentSection === 'adminPanel' && isAdmin ? (
          <div>
            <h2 style={{ borderBottom: '2px solid #1e293b', paddingBottom: '10px', marginBottom: '15px', fontSize: '16px', color: '#38bdf8' }}>
              لوحة تحكم الأدمن وإضافة المحتوى
            </h2>

            <div style={{ backgroundColor: '#161e2e', padding: '20px', borderRadius: '10px', border: '1px solid #1e293b', marginBottom: '25px' }}>
              <h3 style={{ fontSize: '15px', marginBottom: '12px', color: '#60a5fa' }}>✍️️ إضافة محتوى أو امتحان جديد بالأسئلة:</h3>
              <form onSubmit={handleAddContent} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>اختر القسم:</label>
                  <select 
                    value={newTargetSection} 
                    onChange={(e) => setNewTargetSection(e.target.value as Section)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', fontSize: '13px' }}
                  >
                    <option value="videos">الفيديوهات</option>
                    <option value="exams">الامتحانات (بأسئلة وإجابات)</option>
                    <option value="solutions">الحل</option>
                    <option value="pdfs">ملفات PDF</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>عنوان المحتوى / الامتحان:</label>
                  <input 
                    type="text" 
                    placeholder="مثال: امتحان الفيزياء - الفصل الثاني" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>وصف المحتوى:</label>
                  <textarea 
                    placeholder="تفاصيل المحتوى..." 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    required
                    rows={2}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', fontSize: '13px', boxSizing: 'border-box', fontFamily: 'Cairo' }}
                  />
                </div>

                {newTargetSection === 'exams' && (
                  <div style={{ backgroundColor: '#0b0f19', padding: '15px', borderRadius: '8px', border: '1px dashed #334155', marginTop: '5px' }}>
                    <h4 style={{ color: '#38bdf8', fontSize: '13px', margin: '0 0 10px 0' }}>إضافة أسئلة لـ هذا الامتحان ({tempQuestions.length} أسئلة مضافة حتى الآن)</h4>
                    
                    <input 
                      type="text" 
                      placeholder="نص السؤال..." 
                      value={examQText} 
                      onChange={(e) => setExamQText(e.target.value)}
                      style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '6px', backgroundColor: '#161e2e', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                    />
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <input type="text" placeholder="الاختيار الأول" value={opt1} onChange={(e) => setOpt1(e.target.value)} style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#161e2e', border: '1px solid #334155', color: '#fff', fontSize: '12px' }} />
                      <input type="text" placeholder="الاختيار الثاني" value={opt2} onChange={(e) => setOpt2(e.target.value)} style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#161e2e', border: '1px solid #334155', color: '#fff', fontSize: '12px' }} />
                      <input type="text" placeholder="الاختيار الثالث (اختياري)" value={opt3} onChange={(e) => setOpt3(e.target.value)} style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#161e2e', border: '1px solid #334155', color: '#fff', fontSize: '12px' }} />
                      <input type="text" placeholder="الاختيار الرابع (اختياري)" value={opt4} onChange={(e) => setOpt4(e.target.value)} style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#161e2e', border: '1px solid #334155', color: '#fff', fontSize: '12px' }} />
                    </div>

                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>رقم الإجابة الصحيحة (0 للأول، 1 للثاني، وهكذا):</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="3" 
                      value={correctOptIdx} 
                      onChange={(e) => setCorrectOptIdx(Number(e.target.value))}
                      style={{ width: '80px', padding: '6px', marginBottom: '10px', borderRadius: '6px', backgroundColor: '#161e2e', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                    />

                    <button 
                      type="button" 
                      onClick={handleAddQuestionToTemp}
                      style={{ display: 'block', width: '100%', padding: '8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
                    >
                      ➕ إضافة هذا السؤال للامتحان
                    </button>
                  </div>
                )}

                <button type="submit" style={{ padding: '12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginTop: '10px' }}>
                  نشر المحتوى النهائي على المنصة 🚀
                </button>
              </form>
            </div>

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
              {contents.filter(item => item.section === currentSection).length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>لا يوجد محتوى مضاف في هذا القسم حتى الآن.</p>
              ) : (
                contents.filter(item => item.section === currentSection).map(item => (
                  <div key={item.id} style={{ backgroundColor: '#161e2e', border: '1px solid #1e293b', borderRadius: '10px', padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#60a5fa' }}>{item.title}</h3>
                      <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '12px', whiteSpace: 'pre-wrap' }}>{item.description}</p>
                    </div>
                    {item.section === 'exams' ? (
                      <button 
                        onClick={() => setActiveExam(item)}
                        style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                      >
                        ابدأ الامتحان الآن 📝
                      </button>
                    ) : (
                      <button style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                        عرض المحتوى ⬅
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
