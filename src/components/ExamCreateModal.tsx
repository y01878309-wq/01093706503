import React, { useState } from 'react';
import { X, Clock, HelpCircle, Plus, Trash2, Check, Sparkles, BookOpen } from 'lucide-react';
import { TimedExam, ExamQuestion } from '../types';

interface ExamCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExam: (newExam: TimedExam) => void;
  existingSubjects: string[];
}

export const ExamCreateModal: React.FC<ExamCreateModalProps> = ({
  isOpen,
  onClose,
  onSaveExam,
  existingSubjects
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(existingSubjects[0] || 'الفيزياء');
  const [grade, setGrade] = useState('الثانوية العامة (الصف الثالث الثانوي)');
  const [unit, setUnit] = useState('الوحدة الأولى: الكهربية وقوانين كيرشوف');
  
  // Custom duration chosen by teacher "علي مزاجه"
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [passingPercent, setPassingPercent] = useState<number>(60);
  const [instructions, setInstructions] = useState('امتحان محدد بوقت إجباري. سيتم تسليم الإجابات تلقائياً عند انتهاء الوقت المحدد.');

  const [questions, setQuestions] = useState<ExamQuestion[]>([
    {
      id: 'eq-new-1',
      questionText: 'في قانون كيرشوف للجهود، ما هو مجموع الفروق الجهدية في أي مسار مغلق؟',
      options: ['يساوي صفراً دائماً', 'يساوي القوة الدافعة للبطارية فقط', 'يساوي المقاومة المكافئة', 'يساوي شدة التيار'],
      correctOptionIndex: 0,
      explanation: 'قانون كيرشوف الثاني ينص على أن المجموع الجبري للفروق الجهدية في أي مسار مغلق يساوي صفراً (حفظ الطاقة).',
      points: 5
    }
  ]);

  const handleAddQuestion = () => {
    const nextQ: ExamQuestion = {
      id: `eq-new-${Date.now()}-${questions.length + 1}`,
      questionText: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      explanation: '',
      points: 5
    };
    setQuestions([...questions, nextQ]);
  };

  const handleUpdateQuestion = (index: number, field: keyof ExamQuestion, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleUpdateOption = (qIndex: number, optIndex: number, text: string) => {
    const updated = [...questions];
    const newOptions = [...updated[qIndex].options];
    newOptions[optIndex] = text;
    updated[qIndex].options = newOptions;
    setQuestions(updated);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) {
      alert('يجب أن يحتوي الامتحان على سؤال واحد على الأقل.');
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('يرجى إدخال عنوان الامتحان.');
      return;
    }

    if (durationMinutes <= 0) {
      alert('يرجى تحديد مدة صحيحة للامتحان بالدقائق.');
      return;
    }

    // Verify all questions have text
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].questionText.trim()) {
        alert(`يرجى كتابة نص السؤال رقم ${i + 1}.`);
        return;
      }
    }

    const newExam: TimedExam = {
      id: `exam-${Date.now()}`,
      title: title.trim(),
      subject,
      grade,
      unit,
      durationMinutes,
      passingScorePercent: passingPercent,
      instructions,
      questions,
      createdAt: new Date().toISOString().split('T')[0],
      isPublished: true
    };

    onSaveExam(newExam);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-800 bg-[#0f172a] shadow-2xl text-slate-100 overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">إنشاء امتحان جديد وتحديد الوقت</h2>
              <p className="text-xs text-slate-400 mt-0.5">حدد مدة الامتحان بالدقائق التي تناسبك وأضف الأسئلة ونموذج الإجابة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Exam Core Information */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 block">
                عنوان الامتحان: *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: امتحان شامل على قوانين كيرشوف ومسائل الدوائر الكهربية..."
                className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 block">المادة الدراسية:</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                >
                  {existingSubjects.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                  <option value="الفيزياء">الفيزياء</option>
                  <option value="الرياضيات">الرياضيات</option>
                  <option value="الكيمياء">الكيمياء</option>
                  <option value="الأحياء">الأحياء</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 block">الصف الدراسي:</label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 block">الوحدة أو الباب:</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* DURATION SETTING ON TEACHER'S TERMS ("علي مزاجي") */}
          <div className="rounded-xl border border-cyan-800/60 bg-gradient-to-r from-cyan-950/30 to-slate-900/80 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-cyan-400" />
                <h3 className="text-xs font-bold text-white">
                  تحديد وقت الامتحان (بالدقائق على مزاجك):
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold font-mono text-cyan-300">
                  {durationMinutes} دقيقة
                </span>
                <span className="text-xs text-slate-400">
                  ({Math.floor(durationMinutes * 60)} ثانية)
                </span>
              </div>
            </div>

            {/* Slider & Quick Presets */}
            <div className="space-y-3">
              <input
                type="range"
                min="5"
                max="180"
                step="5"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />

              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-slate-400 text-[11px]">خيارات سريعة:</span>
                {[10, 15, 20, 25, 30, 45, 60, 90, 120].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={`px-2.5 py-1 rounded-lg border font-mono transition-colors cursor-pointer ${
                      durationMinutes === mins
                        ? 'border-cyan-500 bg-cyan-600 text-white font-bold'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mins} د
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 block">نسبة النجاح المطلوبة (%):</label>
                <input
                  type="number"
                  min="30"
                  max="100"
                  value={passingPercent}
                  onChange={(e) => setPassingPercent(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs font-mono text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 block">تعليمات الامتحان للطلاب:</label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Questions Builder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-cyan-400" />
                أسئلة الامتحان ({questions.length} أسئلة):
              </h3>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="flex items-center gap-1 text-xs text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 px-3 py-1.5 rounded-lg hover:bg-cyan-900 cursor-pointer font-medium"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>إضافة سؤال جديد</span>
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((q, qIdx) => (
                <div key={q.id} className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400">
                      السؤال {qIdx + 1}:
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <span>الدرجة:</span>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={q.points}
                          onChange={(e) => handleUpdateQuestion(qIdx, 'points', Number(e.target.value))}
                          className="w-14 rounded bg-slate-950 border border-slate-800 px-1.5 py-0.5 text-xs text-center font-mono text-cyan-300"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="حذف هذا السؤال"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    required
                    value={q.questionText}
                    onChange={(e) => handleUpdateQuestion(qIdx, 'questionText', e.target.value)}
                    placeholder="نص السؤال (مثال: احسب شدة التيار المار في الفرع الأوسط إذا كان...)..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                  />

                  {/* 4 Options with Radio to select correct one */}
                  <div className="space-y-2">
                    <span className="text-[11px] text-slate-400 block">
                      الخيارات (اختر الدائرة بجانب الإجابة الصحيحة):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = q.correctOptionIndex === optIdx;

                        return (
                          <div
                            key={optIdx}
                            className={`flex items-center gap-2 p-2 rounded-lg border ${
                              isCorrect ? 'border-emerald-600 bg-emerald-950/20' : 'border-slate-800 bg-slate-950'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`correct-${q.id}`}
                              checked={isCorrect}
                              onChange={() => handleUpdateQuestion(qIdx, 'correctOptionIndex', optIdx)}
                              className="accent-emerald-500 cursor-pointer"
                            />
                            <input
                              type="text"
                              required
                              value={opt}
                              onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                              placeholder={`الخيار ${String.fromCharCode(65 + optIdx)}`}
                              className="w-full bg-transparent text-xs text-slate-200 focus:outline-none"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Explanation for model answer */}
                  <div className="pt-1">
                    <input
                      type="text"
                      value={q.explanation}
                      onChange={(e) => handleUpdateQuestion(qIdx, 'explanation', e.target.value)}
                      placeholder="تفسير الحل وطريقة الحساب (تظهر للطالب بعد تسليم الامتحان)..."
                      className="w-full rounded border border-slate-800 bg-slate-950 p-2 text-xs text-slate-300 placeholder:text-slate-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="sticky bottom-0 -mx-6 -mb-6 p-4 border-t border-slate-800 bg-[#0f172a] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-700 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-2 text-xs font-semibold text-white hover:bg-cyan-500 shadow-md transition-colors cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>نشر الامتحان الموقوت للطلاب الآن</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
