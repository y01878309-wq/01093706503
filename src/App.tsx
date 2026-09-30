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
  durationMinutes?: number; // وقت الامتحان بالدقائق
  questions?: Question[];
}

interface UserAccount {
  email: string;
  pass: string;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('');
  const [passInput, setPassInput] = useState<string>('');
  const [codeInput, setCodeInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  const ADMIN_EMAIL = 'y01878309@gmail.com';
  
  const [usersAccounts, setUsersAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('platform_users_farag');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentSection, setCurrentSection] = useState<Section>('videos');

  const [contents, setContents] = useState<ExamItem[]>(() => {
    const saved = localStorage.getItem('platform_contents_farag');
    return saved ? JSON.parse(saved) : [
      { id: 1, section: 'videos', title: 'مراجعة باب التنسيق الهرموني', description: 'https://youtu.be/t2MV5U4KnKm?si=nANL5lpT-iguRuV5' },
      { 
        id: 2, 
        section: 'exams', 
        title: 'امتحان الفيزياء التجريبي - الفصل الأول', 
        description: 'اختبر معلوماتك في الفصل الأول مع تصحيح فوري.',
        durationMinutes: 10,
        questions: [
          {
            id: 1,
            questionText: 'وحدة قياس الشحنة الكهربية هي:',
            options: ['أمبير', 'فولت', 'كولوم', 'اوم'],
            correctAnswer: 2
          },
          {
            id: 2,
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

  // حفظ الامتحانات التي تم حلها بواسطة الطالب الحالي لمنع تكرارها
  const [submittedExams, setSubmittedExams] = useState<{ [userEmail: string]: number[] }>(() => {
    const saved = localStorage.getItem('platform_submitted_exams_farag');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('platform_users_farag', JSON.stringify(usersAccounts));
  }, [usersAccounts]);

  useEffect(() => {
    localStorage.setItem('platform_contents_farag', JSON.stringify(contents));
  }, [contents]);

  useEffect(() => {
    localStorage.setItem('platform_submitted_exams_farag', JSON.stringify(submittedExams));
  }, [submittedExams]);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDuration, setNewDuration] = useState<number>(10);
  const [newTargetSection, setNewTargetSection] = useState<Section>('videos');
  
  const [examQText, setExamQText] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt4, setOpt4] = useState('');
  const [correctOptIdx, setCorrectOptIdx] = useState<number>(0);
  const [tempQuestions, setTempQuestions] = useState<Question[]>([]);

  const [activeExam, setActiveExam] = useState<ExamItem | null>(null);
  const [activeMedia, setActiveMedia] = useState<ExamItem | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);
  const [examScore, setExamScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0); // الوقت المتبقي بالثواني

  const [leaderboard, setLeaderboard] = useState<{ id: number; rank: number; name: string; score: string; details: string }[]>(() => {
    const saved = localStorage.getItem('platform_leaderboard_farag');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('platform_leaderboard_farag', JSON.stringify(leaderboard));
  }, [leaderboard]);

  // عداد الوقت التنازلي للامتحان
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeExam && !isExamSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam(true); // تسليم تلقائي عند انتهاء الوقت
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeExam, isExamSubmitted, timeLeft]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passInput.trim();
    const cleanCode = codeInput.trim();

    if (!cleanEmail.includes('@gmail.com')) {
      setErrorMsg('الرجاء إدخال بريد إلكتروني صحيح (Gmail).');
      return;
    }

    if (cleanEmail === ADMIN_EMAIL) {
      setIsAuthenticated(true);
      setErrorMsg('');
      return;
    }

    if (cleanCode !== '78') {
      setErrorMsg('رمز المنصة غير صحيح! رمز المنصة هو 78');
      return;
    }

    const existingUser = usersAccounts.find(u => u.email === cleanEmail);
    if (existingUser) {
      if (existingUser.pass !== cleanPass) {
        setErrorMsg('كلمة السر غير صحيحة لهذا البريد!');
        return;
      }
    } else {
      setUsersAccounts([...usersAccounts, { email: cleanEmail, pass: cleanPass }]);
    }

    setIsAuthenticated(true);
    setErrorMsg('');
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
        durationMinutes: newTargetSection === 'exams' ? Number(newDuration) : undefined,
        questions: newTargetSection === 'exams' ? tempQuestions : undefined
      };
      setContents([newItem, ...contents]);
      setNewTitle('');
      setNewDesc('');
      setTempQuestions([]);
      alert('تم نشر المحتوى بنجاح على المنصة!');
    }
  };

  const handleStartExam = (exam: ExamItem) => {
    const userExams = submittedExams[emailInput] || [];
    if (emailInput !== ADMIN_EMAIL && userExams.includes(exam.id)) {
      alert('⚠️ لقد قمت بحل هذا الامتحان من قبل ولا يمكنك دخوله مره أخرى!');
      return;
    }
    setActiveExam(exam);
    setIsExamSubmitted(false);
    setUserAnswers({});
    setTimeLeft((exam.durationMinutes || 10) * 60); // تحويل الدقائق إلى ثواني
  };

  const handleOptionSelect = (qId: number, optIdx: number) => {
    if (isExamSubmitted) return;
    setUserAnswers({ ...userAnswers, [qId]: optIdx });
  };

  const handleSubmitExam = (isTimeout: boolean = false) => {
    if (!activeExam || !activeExam.questions || isExamSubmitted) return;
    
    let score = 0;
    activeExam.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    setExamScore(score);
    setIsExamSubmitted(true);

    if (isTimeout) {
      alert('⏰ انتهى وقت الامتحان المحدد! تم تسليم إجاباتك تلقائياً.');
    }

    // تسجيل الامتحان أنه تم حله لهذا الطالب لمنع تكراره
    if (emailInput !== ADMIN_EMAIL) {
      const userExams = submittedExams[emailInput] || [];
      setSubmittedExams({
        ...submittedExams,
        [emailInput]: [...userExams, activeExam.id]
      });

      const studentName = emailInput.split('@')[0];
      const newEntry = {
        id: Date.now(),
        rank: leaderboard.length + 1,
        name: studentName,
        score: `${score} / ${activeExam.questions.length}`,
        details: activeExam.title
      };
      setLeaderboard([newEntry, ...leaderboard]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('embed/')) return url;
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('watch?v=')) {
      const videoId = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Cairo, sans-serif', padding: '20px', direction: 'rtl' }}>
        <div style={{ backgroundColor: '#161e2e', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', textAlign: 'center', border: '1px solid #1e293b' }}>
          <h2 style={{ marginBottom: '10px', fontSize: '22px', color: '#3b82f6' }}>منصة فاهم التعليمية</h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>سجل ببريدك الإلكتروني، كلمة المرور، ورمز المنصة (78).</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="email" 
              placeholder="بريدك الإلكتروني (Gmail)" 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', outline: 'none', textAlign: 'center', fontSize: '13px', boxSizing: 'border-box' }}
            />
            <input 
              type="password" 
              placeholder="كلمة السر الخاصة بك" 
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              required
              style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', outline: 'none', textAlign: 'center', fontSize: '13px', boxSizing: 'border-box' }}
            />
            <input 
              type="password" 
              placeholder="رمز المنصة (78)" 
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              required
              style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', outline: 'none', textAlign: 'center', fontSize: '13px', boxSizing: 'border-box' }}
            />

            {errorMsg && <p style={{ color: '#ef4444', fontSize: '12px', margin: 0 }}>{errorMsg}</p>}
            
            <button 
              type="submit" 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#0284c7', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginTop: '5px' }}
            >
              تسجيل الدخول / إنشاء حساب 🚀
            </button>
          </form>

          <a 
            href="https://wa.me/201093706503?text=ازيك يا مستر يوسف، محتاج استفسار بخصوص منصة فاهم التعليمية" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ display: 'block', padding: '10px', marginTop: '15px', backgroundColor: '#25d366', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px' }}
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
          onClick={() => { setIsAuthenticated(false); setActiveExam(null); setActiveMedia(null); }}
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
            onClick={() => { setCurrentSection(tab.key as Section); setActiveExam(null); setActiveMedia(null); }}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <button 
                onClick={() => { setActiveExam(null); setIsExamSubmitted(false); setUserAnswers({}); }}
                style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
              >
                ⬅ العودة لقائمة الامتحانات
              </button>
              
              {!isExamSubmitted && (
                <div style={{ backgroundColor: '#1e293b', padding: '6px 12px', borderRadius: '8px', border: '1px solid #ef4444', color: '#f87171', fontWeight: 'bold', fontSize: '13px' }}>
                  ⏳ الوقت المتبقي: {formatTime(timeLeft)}
                </div>
              )}
            </div>

            <h2 style={{ color: '#60a5fa', marginBottom: '10px', fontSize: '18px' }}>{activeExam.title}</h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>{activeExam.description}</p>

            {isExamSubmitted && (
              <div style={{ backgroundColor: '#065f46', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>🎉 نتيجة الامتحان</h3>
                <p style={{ fontSize: '15px', margin: 0 }}>لقد حصلت على {examScore} من {activeExam.questions?.length || 0} (تم تسجيل محاولتك ولن تكرر)</p>
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
                        if (optIdx === q.correctAnswer) btnBg = '#059669';
                        else if (userAnswers[q.id] === optIdx) btnBg = '#dc2626';
                      } else if (userAnswers[q.id] === optIdx) {
                        btnBg = '#2563eb';
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
                onClick={() => handleSubmitExam(false)}
                style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', marginTop: '10px' }}
              >
                تسليم الإجابات ومعرفة النتيجة ✅
              </button>
            )}
          </div>
        ) : activeMedia ? (
          <div style={{ backgroundColor: '#161e2e', padding: '25px', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <button 
              onClick={() => setActiveMedia(null)}
              style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginBottom: '20px', fontSize: '12px' }}
            >
              ⬅ العودة لقائمة القسم
            </button>

            <h2 style={{ color: '#60a5fa', marginBottom: '10px', fontSize: '18px' }}>{activeMedia.title}</h2>
            
            {activeMedia.description.includes('http') ? (
              <div>
                {activeMedia.description.includes('youtu') ? (
                  <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0, marginBottom: '15px' }}>
                    <iframe 
                      src={getEmbedUrl(activeMedia.description)} 
                      title={activeMedia.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '8px', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : null}
                <a 
                  href={activeMedia.description} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ display: 'inline-block', padding: '10px 16px', backgroundColor: '#2563eb', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', marginBottom: '15px' }}
                >
                  🔗 فتح الرابط في نافذة خارجية
                </a>
              </div>
            ) : (
              <p style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap', backgroundColor: '#0b0f19', padding: '15px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                {activeMedia.description}
              </p>
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
              <h3 style={{ fontSize: '15px', marginBottom: '12px', color: '#60a5fa' }}>✍ إضافة محتوى أو امتحان جديد بالأسئلة:</h3>
              <form onSubmit={handleAddContent} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>اختر القسم:</label>
                  <select 
                    value={newTargetSection} 
                    onChange={(e) => setNewTargetSection(e.target.value as Section)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', fontSize: '13px' }}
                  >
                    <option value="videos">الفيديوهات</option>
                    <option value="exams">الامتحانات (بأسئلة وإجابات ووقت محدد)</option>
                    <option value="solutions">الحل</option>
                    <option value="pdfs">ملفات PDF</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>عنوان المحتوى / الامتحان:</label>
                  <input 
                    type="text" 
                    placeholder="مثال: امتحان الفيزياء الفصل الأول" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                {newTargetSection === 'exams' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>وقت الامتحان (بالدقائق):</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="120"
                      value={newDuration}
                      onChange={(e) => setNewDuration(Number(e.target.value))}
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>وصف الامتحان أو رابط الفيديو:</label>
                  <textarea 
                    placeholder="ضع التفاصيل أو الرابط هنا..." 
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
                contents.filter(item => item.section === currentSection).map(item => {
                  const userExams = submittedExams[emailInput] || [];
                  const isDone = emailInput !== ADMIN_EMAIL && item.section === 'exams' && userExams.includes(item.id);

                  return (
                    <div key={item.id} style={{ backgroundColor: '#161e2e', border: '1px solid #1e293b', borderRadius: '10px', padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#60a5fa' }}>{item.title}</h3>
                        <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '12px' }}>
                          {item.description}
                          {item.durationMinutes && <span style={{ display: 'block', color: '#38bdf8', marginTop: '4px' }}>⏱ وقت الامتحان: {item.durationMinutes} دقائق</span>}
                        </p>
                      </div>

                      {item.section === 'exams' ? (
                        <button 
                          onClick={() => handleStartExam(item)}
                          style={{ 
                            backgroundColor: isDone ? '#475569' : '#10b981', 
                            color: '#fff', 
                            border: 'none', 
                            padding: '8px 12px', 
                            borderRadius: '6px', 
                            cursor: isDone ? 'not-allowed' : 'pointer', 
                            fontSize: '12px', 
                            fontWeight: 'bold' 
                          }}
                        >
                          {isDone ? '✅ تم الحل مسبقاً' : 'ابدأ الامتحان الآن 📝'}
                        </button>
                      ) : (
                        <button 
                          onClick={() => setActiveMedia(item)}
                          style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                        >
                          عرض المحتوى ⬅
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
