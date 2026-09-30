import React, { useState, useEffect } from 'react';

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
  questions?: Question[]; // للامتحانات التفاعلية جوه المنصة
}

interface StudentRank {
  id: number;
  rank: number;
  name: string;
  score: number;
  details: string;
  avatar?: string;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  const ADMIN_EMAIL = 'y01878309@gmail.com';
  const SECRET_CODE = '123789';

  const [allowedEmails, setAllowedEmails] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fahem_global_allowed_emails');
      return saved ? JSON.parse(saved) : [ADMIN_EMAIL];
    } catch {
      return [ADMIN_EMAIL];
    }
  });

  const [newEmailInput, setNewEmailInput] = useState<string>('');
  const [currentSection, setCurrentSection] = useState<Section>('videos');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEmailManager, setShowEmailManager] = useState<boolean>(false);

  // حالات فتح الامتحان التفاعلي للطالب
  const [activeExam, setActiveExam] = useState<ContentItem | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [examScore, setExamScore] = useState<number>(0);

  const [contents, setContents] = useState<ContentItem[]>([
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
        },
        {
          id: 2,
          questionText: 'قانون أوم يربط بين:',
          options: ['القدرة والزمن', 'الجهد واليار المقاومة', 'السرعة والكتلة', 'الطاقة والتردد'],
          correctAnswer: 1
        }
      ]
    },
    { id: 3, section: 'solutions', title: 'حل نموذج الاسترصادي', description: 'الخطوات الكاملة للحل النموذجي.', link: '#' },
    { id: 4, section: 'pdfs', title: 'ملخص قوانين الفيزياء - الفصل الأول', description: 'ملف PDF شامل لأهم قوانين واشتقاقات المنهج.', link: '#' },
  ]);

  const [students, setStudents] = useState<StudentRank[]>([
    { id: 1, rank: 1, name: 'أحمد البهي محمود البهي عيد', score: 51, details: 'أكمل 2 اختبار · الصف الثاني الثانوي' },
    { id: 2, rank: 2, name: 'استاذ بودى', score: 51, details: 'أكمل 2 اختبار · الصف الثاني الثانوي' },
    { id: 3, rank: 3, name: 'محمد مبارك', score: 49, details: 'أكمل 2 اختبار · الصف الثاني الثانوي' },
    { id: 4, rank: 4, name: 'ملك محى', score: 49, details: 'أكمل 2 اختبار · الصف الثاني الثانوي' },
    { id: 5, rank: 5, name: 'Mahmoudelshenawy', score: 48, details: 'أكمل 2 اختبار · الصف الثاني الثانوي' },
    { id: 6, rank: 6, name: 'ليلى محمد احمد عيد', score: 47, details: 'أكمل 2 اختبار · الصف الثاني الثانوي' },
    { id: 7, rank: 7, name: 'امل وليد مصطفى', score: 47, details: 'أكمل 2 اختبار · الصف الثاني الثانوي' },
  ]);

  // حقول إضافة المحتوى العام
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLink, setNewLink] = useState('');
  const [targetSection, setTargetSection] = useState<Section>('videos');

  // حقول إنشاء الأسئلة (للأدمن عند إضافة امتحان)
  const [builderQuestions, setBuilderQuestions] = useState<Question[]>([]);
  const [qText, setQText] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt4, setOpt4] = useState('');
  const [correctOptIndex, setCorrectOptIndex] = useState<number>(0);

  useEffect(() => {
    try {
      localStorage.setItem('fahem_global_allowed_emails', JSON.stringify(allowedEmails));
    } catch (e) {
      console.error(e);
    }
  }, [allowedEmails]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim().toLowerCase();

    if (trimmed === SECRET_CODE || trimmed === ADMIN_EMAIL || allowedEmails.includes(trimmed)) {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('البريد الإلكتروني غير مسموح له بالدخول. يرجى مراجعة الأدمن.');
    }
  };

  const trimmedInput = inputVal.trim().toLowerCase();
  const isAdmin = trimmedInput === ADMIN_EMAIL || trimmedInput === SECRET_CODE;

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const emailToAdd = newEmailInput.trim().toLowerCase();
    if (emailToAdd && !allowedEmails.includes(emailToAdd)) {
      const updated = [...allowedEmails, emailToAdd];
      setAllowedEmails(updated);
      setNewEmailInput('');
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    if (emailToRemove === ADMIN_EMAIL) return;
    const updated = allowedEmails.filter(e => e !== emailToRemove);
    setAllowedEmails(updated);
  };

  // إضافة سؤال مؤقت لقائمة بناء الامتحان
  const handleAddQuestionToBuilder = () => {
    if (!qText.trim() || !opt1.trim() || !opt2.trim()) return;
    const newQ: Question = {
      id: Date.now(),
      questionText: qText,
      options: [opt1, opt2, opt3, opt4].filter(o => o.trim() !== ''),
      correctAnswer: correctOptIndex
    };
    setBuilderQuestions([...builderQuestions, newQ]);
    setQText('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setOpt4('');
    setCorrectOptIndex(0);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ContentItem = {
      id: Date.now(),
      section: targetSection,
      title: newTitle,
      description: newDesc,
      link: targetSection !== 'exams' ? (newLink || '#') : undefined,
      questions: targetSection === 'exams' ? builderQuestions : undefined
    };

    setContents([newItem, ...contents]);
    setNewTitle('');
    setNewDesc('');
    setNewLink('');
    setBuilderQuestions([]);
    setShowAddModal(false);
  };

  // تفاعل الطالب مع الامتحان
  const handleStartExam = (exam: ContentItem) => {
    setActiveExam(exam);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setExamSubmitted(false);
    setExamScore(0);
  };

  const handleSelectOption = (qId: number, optIndex: number) => {
    setSelectedAnswers({ ...selectedAnswers, [qId]: optIndex });
  };

  const handleSubmitExam = () => {
    if (!activeExam || !activeExam.questions) return;
    let score = 0;
    activeExam.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score += 10; // كل سؤال بـ 10 درجات مثلاً
      }
    });
    setExamScore(score);
    setExamSubmitted(true);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Cairo, sans-serif', padding: '20px' }}>
        <div style={{ backgroundColor: '#161e2e', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px', fontSize: '22px', color: '#3b82f6' }}>منصة فاهم التعليمية</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>أدخل البريد الإلكتروني المعتمد أو الكود السري للمتابعة.</p>
          
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
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
            >
              دخول المنصة
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#fff', fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#161e2e', borderBottom: '1px solid #1e293b', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ fontSize: '18px', margin: 0, color: '#3b82f6' }}>منصة فاهم التعليمية</h1>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {isAdmin && (
            <>
              <button 
                onClick={() => setShowEmailManager(true)}
                style={{ backgroundColor: '#0ea5e9', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
              >
                📧 إدارة الإيميلات
              </button>
              <button 
                onClick={() => { setBuilderQuestions([]); setShowAddModal(true); }}
                style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '50%', width: '38px', height: '38px', fontSize: '18px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                title="إضافة محتوى جديد"
              >
                +
              </button>
            </>
          )}
          <button 
            onClick={() => setIsAuthenticated(false)}
            style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
          >
            خروج
          </button>
        </div>
      </header>

      {/* شريط التنقل بين الأقسام */}
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
            onClick={() => { setCurrentSection(tab.key as Section); setActiveExam(null); }}
            style={{
              padding: '8px 12px',
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
        {activeExam ? (
          /* واجهة حل الامتحان للتلميذ */
          <div style={{ backgroundColor: '#161e2e', padding: '25px', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', margin: 0, color: '#3b82f6' }}>{activeExam.title}</h2>
              <button 
                onClick={() => setActiveExam(null)}
                style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
              >
                ⬅ العودة للأقسام
              </button>
            </div>

            {!examSubmitted ? (
              <div>
                {activeExam.questions && activeExam.questions.length > 0 ? (
                  <div>
                    <div style={{ marginBottom: '15px', color: '#94a3b8', fontSize: '13px' }}>
                      السؤال {currentQuestionIndex + 1} من {activeExam.questions.length}
                    </div>
                    <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#f8fafc' }}>
                      {activeExam.questions[currentQuestionIndex].questionText}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                      {activeExam.questions[currentQuestionIndex].options.map((opt, idx) => {
                        const qId = activeExam.questions![currentQuestionIndex].id;
                        const isSelected = selectedAnswers[qId] === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectOption(qId, idx)}
                            style={{
                              padding: '12px 15px',
                              textAlign: 'right',
                              borderRadius: '8px',
                              border: isSelected ? '2px solid #3b82f6' : '1px solid #334155',
                              backgroundColor: isSelected ? '#1d4ed8' : '#0b0f19',
                              color: '#fff',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            {idx + 1}. {opt}
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <button
                        disabled={currentQuestionIndex === 0}
                        onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                        style={{ padding: '8px 16px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentQuestionIndex === 0 ? 0.5 : 1 }}
                      >
                        السابق
                      </button>

                      {currentQuestionIndex < activeExam.questions.length - 1 ? (
                        <button
                          onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                          style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          التالي
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmitExam}
                          style={{ padding: '8px 20px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          إرسال الامتحان 🏁
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <p style={{ color: '#94a3b8' }}>لا توجد أسئلة مضافة في هذا الامتحان بعد.</p>
                )}
              </div>
            ) : (
              /* نتيجة الامتحان */
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <h3 style={{ fontSize: '24px', color: '#10b981', marginBottom: '10px' }}>لقد أتممت الامتحان بنجاح! 🎉</h3>
                <p style={{ fontSize: '18px', color: '#f8fafc', marginBottom: '20px' }}>
                  درجتك النهائية هي: <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{examScore}</span> من إجمالي الدرجات.
                </p>
                <button
                  onClick={() => setActiveExam(null)}
                  style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  العودة لقائمة الامتحانات
                </button>
              </div>
            )}
          </div>
        ) : currentSection === 'leaderboard' ? (
          <div>
            <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#f8fafc', fontWeight: 'bold' }}>ترتيب الطلاب</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {students.map((student) => (
                <div 
                  key={student.id} 
                  style={{ 
                    backgroundColor: '#161e2e', 
                    borderRadius: '12px', 
                    padding: '16px 20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    border: student.rank <= 3 ? '1px solid #38bdf8' : '1px solid #1e293b',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ textAlign: 'center', minWidth: '45px' }}>
                      <span style={{ display: 'block', fontSize: '20px', fontWeight: 'bold', color: '#f8fafc' }}>
                        {student.rank <= 3 ? student.score : student.rank}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {student.rank <= 3 ? 'نقطة' : ''}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#334155', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                        <svg style={{ width: '28px', height: '28px', fill: '#94a3b8' }} viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#f1f5f9' }}>{student.name}</h4>
                        <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{student.details}</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'left' }}>
                    {student.rank === 1 && <span style={{ fontSize: '24px' }} title="المركز الأول">🏆</span>}
                    {student.rank === 2 && <span style={{ fontSize: '24px' }} title="المركز الثاني">🥈</span>}
                    {student.rank === 3 && <span style={{ fontSize: '24px' }} title="المركز الثالث">🥉</span>}
                    {student.rank > 3 && <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#64748b' }}>{student.rank}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2 style={{ borderBottom: '2px solid #1e293b', paddingBottom: '10px', marginBottom: '20px', fontSize: '18px' }}>
              {currentSection === 'videos' && 'قسم الفيديوهات والشرح'}
              {currentSection === 'exams' && 'قسم الامتحانات والاختبارات التفاعلية'}
              {currentSection === 'solutions' && 'قسم الحل والتدريبات'}
              {currentSection === 'pdfs' && 'قسم ملفات الـ PDF والملخصات'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {contents.filter(item => item.section === currentSection).length === 0 ? (
                <p style={{ color: '#94a3b8' }}>لا يوجد محتوى مضاف في هذا القسم حالياً.</p>
              ) : (
                contents
                  .filter(item => item.section === currentSection)
                  .map(item => (
                    <div key={item.id} style={{ backgroundColor: '#161e2e', border: '1px solid #1e293b', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                      <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: currentSection === 'pdfs' ? '#f43f5e' : currentSection === 'exams' ? '#10b981' : '#60a5fa' }}>
                        {currentSection === 'pdfs' ? '📄 ' : currentSection === 'exams' ? '📝 ' : ''}{item.title}
                      </h3>
                      <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '15px' }}>{item.description}</p>
                      
                      {currentSection === 'exams' ? (
                        <button 
                          onClick={() => handleStartExam(item)}
                          style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                        >
                          ابدأ الامتحان الآن ✍
                        </button>
                      ) : (
                        item.link && item.link !== '#' && (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
                            {currentSection === 'pdfs' ? 'تحميل أو عرض الملف ⬇' : 'عرض المحتوى ⬅'}
                          </a>
                        )
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* نافذة إدارة إيميلات الطلاب */}
      {showEmailManager && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#161e2e', padding: '25px', borderRadius: '12px', width: '100%', maxWidth: '400px', border: '1px solid #334155' }}>
            <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#0ea5e9', fontSize: '18px' }}>إدارة البريد الإلكتروني للطلاب</h3>
            <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '15px' }}>أضف إيميلات الطلاب المسموح لهم بالدخول:</p>
            
            <form onSubmit={handleAddEmail} style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
              <input 
                type="email" 
                value={newEmailInput} 
                onChange={(e) => setNewEmailInput(e.target.value)} 
                placeholder="student@gmail.com" 
                required
                style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', fontSize: '13px' }}
              />
              <button 
                type="submit" 
                style={{ padding: '8px 12px', backgroundColor: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
              >
                إضافة
              </button>
            </form>

            <div style={{ maxHeight: '140px', overflowY: 'auto', marginBottom: '15px', border: '1px solid #334155', borderRadius: '6px', padding: '8px' }}>
              {allowedEmails.map((email) => (
                <div key={email} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #1f2937' }}>
                  <span style={{ fontSize: '12px', color: '#cbd5e1' }}>{email} {email === ADMIN_EMAIL && '(أدمن)'}</span>
                  {email !== ADMIN_EMAIL && (
                    <button 
                      onClick={() => handleRemoveEmail(email)}
                      style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}
                    >
                      حذف
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button 
              type="button" 
              onClick={() => setShowEmailManager(false)}
              style={{ width: '100%', padding: '8px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* نافذة إضافة محتوى أو امتحان جديد */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px', overflowY: 'auto' }}>
          <div style={{ backgroundColor: '#161e2e', padding: '25px', borderRadius: '12px', width: '100%', maxWidth: '450px', border: '1px solid #334155', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#3b82f6', fontSize: '18px' }}>إضافة محتوى أو امتحان جديد</h3>
            
            <form onSubmit={handleAddItem}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#cbd5e1' }}>اختر القسم:</label>
                <select 
                  value={targetSection} 
                  onChange={(e) => setTargetSection(e.target.value as Section)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', fontSize: '13px' }}
                >
                  <option value="videos">الفيديوهات والشرح</option>
                  <option value="exams">الامتحانات (اختبار تفاعلي)</option>
                  <option value="solutions">الحل والتدريبات</option>
                  <option value="pdfs">ملفات PDF والملخصات</option>
                </select>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#cbd5e1' }}>عنوان الاختبار أو المحتوى:</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  placeholder="مثال: امتحان الفصل الثاني - فيزياء" 
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#cbd5e1' }}>وصف مختصر:</label>
                <textarea 
                  value={newDesc} 
                  onChange={(e) => setNewDesc(e.target.value)} 
                  placeholder="تفاصيل عن الاختبار..." 
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', fontSize: '13px', height: '50px' }}
                />
              </div>

              {/* إذا كان القسم المختار "امتحانات"، نعرض منشئ الأسئلة الداخلي */}
              {targetSection === 'exams' ? (
                <div style={{ backgroundColor: '#111827', padding: '12px', borderRadius: '8px', marginBottom: '15px', border: '1px dashed #374151' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#10b981' }}>منشئ الأسئلة التفاعلية داخل المنصة</h4>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="نص السؤال..." 
                      value={qText}
                      onChange={(e) => setQText(e.target.value)}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', fontSize: '12px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                    <input type="text" placeholder="الاختيار 1" value={opt1} onChange={(e) => setOpt1(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', fontSize: '12px' }} />
                    <input type="text" placeholder="الاختيار 2" value={opt2} onChange={(e) => setOpt2(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', fontSize: '12px' }} />
                    <input type="text" placeholder="الاختيار 3 (اختياري)" value={opt3} onChange={(e) => setOpt3(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', fontSize: '12px' }} />
                    <input type="text" placeholder="الاختيار 4 (اختياري)" value={opt4} onChange={(e) => setOpt4(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', fontSize: '12px' }} />
                  </div>

                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>حدد رقم الإجابة الصحيحة:</label>
                    <select 
                      value={correctOptIndex} 
                      onChange={(e) => setCorrectOptIndex(Number(e.target.value))}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', fontSize: '12px' }}
                    >
                      <option value={0}>الاختيار الأول</option>
                      <option value={1}>الاختيار الثاني</option>
                      <option value={2}>الاختيار الثالث</option>
                      <option value={3}>الاختيار الرابع</option>
                    </select>
                  </div>

                  <button 
                    type="button" 
                    onClick={handleAddQuestionToBuilder}
                    style={{ width: '100%', padding: '6px', backgroundColor: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
                  >
                    ➕ أضف هذا السؤال للاختبار
                  </button>

                  <p style={{ fontSize: '11px', color: '#38bdf8', marginTop: '8px', marginBottom: 0 }}>
                    عدد الأسئلة المضافة حالياً: {builderQuestions.length} سؤال
                  </p>
                </div>
              ) : (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#cbd5e1' }}>رابط المحتوى أو الملف (اختياري):</label>
                  <input 
                    type="text" 
                    value={newLink} 
                    onChange={(e) => setNewLink(e.target.value)} 
                    placeholder="https://..." 
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0b0f19', color: '#fff', fontSize: '13px' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  type="submit" 
                  style={{ flex: 1, padding: '9px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
                >
                  حفظ ونشر الامتحان
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  style={{ flex: 1, padding: '9px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
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
