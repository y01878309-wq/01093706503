import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  Award, 
  RotateCcw,
  BookOpen,
  Send,
  HelpCircle
} from 'lucide-react';
import { TimedExam, ExamSubmission, UserAccount } from '../types';
import { formatTime } from '../utils/video';

interface ExamRunnerProps {
  exam: TimedExam;
  currentUser: UserAccount;
  onFinishExam: (submission: ExamSubmission) => void;
  onExit: () => void;
}

export const ExamRunner: React.FC<ExamRunnerProps> = ({
  exam,
  currentUser,
  onFinishExam,
  onExit
}) => {
  const totalSeconds = exam.durationMinutes * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<ExamSubmission | null>(null);

  const timerRef = useRef<any>(null);

  // Countdown timer logic
  useEffect(() => {
    if (isSubmitted) return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isSubmitted]);

  // Submit calculations
  const calculateResult = (answers: Record<string, number>): ExamSubmission => {
    let earnedPoints = 0;
    let totalPoints = 0;

    exam.questions.forEach(q => {
      totalPoints += q.points;
      if (answers[q.id] === q.correctOptionIndex) {
        earnedPoints += q.points;
      }
    });

    const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const isPassed = percentage >= exam.passingScorePercent;
    const timeSpent = totalSeconds - remainingSeconds;

    return {
      id: `sub-${Date.now()}`,
      examId: exam.id,
      examTitle: exam.title,
      studentEmail: currentUser.email,
      studentName: currentUser.name,
      selectedAnswers: answers,
      score: earnedPoints,
      totalPoints,
      percentage,
      isPassed,
      timeSpentSeconds: timeSpent,
      submittedAt: new Date().toISOString()
    };
  };

  const handleAutoSubmit = () => {
    const result = calculateResult(selectedAnswers);
    setSubmissionResult(result);
    setIsSubmitted(true);
    onFinishExam(result);
  };

  const handleManualSubmit = () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    const totalCount = exam.questions.length;
    
    if (answeredCount < totalCount) {
      if (!confirm(`لقد أجبت عن ${answeredCount} من أصل ${totalCount} أسئلة فقط. هل تريد إنهاء وتسليم الامتحان بالتأكيد؟`)) {
        return;
      }
    } else {
      if (!confirm('هل أنت متأكد من تسليم الإجابات وإنهاء الامتحان؟')) {
        return;
      }
    }

    clearInterval(timerRef.current);
    handleAutoSubmit();
  };

  const handleSelectOption = (qId: string, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const currentQ = exam.questions[currentQuestionIndex];
  const percentTimeLeft = Math.round((remainingSeconds / totalSeconds) * 100);
  const isUrgent = remainingSeconds <= 180; // Under 3 mins
  const isCritical = remainingSeconds <= 60; // Under 1 min

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 pb-20">
      
      {/* Fixed Sticky Exam Header with Timer */}
      <div className="sticky top-0 z-30 border-b border-slate-800 bg-[#0f172a]/95 backdrop-blur-md px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (isSubmitted || confirm('الخروج سيلغي جلستك الحالية. هل أنت متأكد؟')) {
                  onExit();
                }
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
            >
              <ArrowRight className="h-4 w-4" />
              <span>{isSubmitted ? 'الرجوع للمكتبة' : 'مغادرة الامتحان'}</span>
            </button>
            <div className="hidden sm:block">
              <h2 className="text-xs font-bold text-white truncate max-w-sm">{exam.title}</h2>
              <span className="text-[11px] text-slate-400 font-mono">
                {exam.subject} · {exam.grade}
              </span>
            </div>
          </div>

          {/* Countdown Timer Display */}
          {!isSubmitted ? (
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-sm font-bold shadow-inner ${
                isCritical 
                  ? 'border-rose-600 bg-rose-950/60 text-rose-300 animate-pulse'
                  : isUrgent
                  ? 'border-amber-600 bg-amber-950/60 text-amber-300'
                  : 'border-cyan-700/60 bg-slate-900 text-cyan-300'
              }`}>
                <Clock className="h-4 w-4 shrink-0" />
                <span>الوقت المتبقي: {formatTime(remainingSeconds)}</span>
              </div>

              <button
                onClick={handleManualSubmit}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 shadow transition-colors cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>تسليم الامتحان</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-800">
                تم التسليم ورصد الدرجة
              </span>
            </div>
          )}
        </div>

        {/* Progress bar of remaining time */}
        {!isSubmitted && (
          <div className="mt-2.5 -mx-4 sm:-mx-6 lg:-mx-8 h-1 bg-slate-800">
            <div
              className={`h-full transition-all duration-1000 ${
                isUrgent ? 'bg-amber-500' : 'bg-cyan-500'
              }`}
              style={{ width: `${percentTimeLeft}%` }}
            />
          </div>
        )}
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* POST-EXAM RESULTS VIEW */}
        {isSubmitted && submissionResult ? (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Score Banner */}
            <div className={`rounded-2xl border p-6 sm:p-8 text-center space-y-4 shadow-2xl ${
              submissionResult.isPassed
                ? 'border-emerald-600/80 bg-gradient-to-b from-emerald-950/40 to-slate-900'
                : 'border-amber-600/80 bg-gradient-to-b from-amber-950/40 to-slate-900'
            }`}>
              <div className="flex justify-center">
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${
                  submissionResult.isPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  <Award className="h-8 w-8" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  {submissionResult.isPassed ? 'تهانينا! لقد اجتزت الامتحان بنجاح' : 'انتهى وقت الامتحان - فرصة للمراجعة والتحسين'}
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  الطالب: {submissionResult.studentName} · النسبة: {submissionResult.percentage}%
                </p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-2">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">الدرجة النهائية</span>
                  <span className="text-lg font-bold font-mono text-cyan-400">
                    {submissionResult.score} / {submissionResult.totalPoints}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">النسبة المئوية</span>
                  <span className={`text-lg font-bold font-mono ${submissionResult.isPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
                    %{submissionResult.percentage}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">الوقت المستغرق</span>
                  <span className="text-lg font-bold font-mono text-slate-200">
                    {formatTime(submissionResult.timeSpentSeconds)}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setSelectedAnswers({});
                    setRemainingSeconds(totalSeconds);
                    setCurrentQuestionIndex(0);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-200 hover:text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>إعادة الامتحان من جديد</span>
                </button>
                <button
                  onClick={onExit}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>العودة لشروحات المادة</span>
                </button>
              </div>
            </div>

            {/* Model Answers Review */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                مراجعة نموذج الإجابة وتفسير خطوات الحل لكل سؤال:
              </h3>

              {exam.questions.map((q, idx) => {
                const studentAns = submissionResult.selectedAnswers[q.id];
                const isCorrect = studentAns === q.correctOptionIndex;

                return (
                  <div
                    key={q.id}
                    className={`rounded-xl border p-5 space-y-3 ${
                      isCorrect ? 'border-emerald-800/60 bg-emerald-950/15' : 'border-rose-900/60 bg-rose-950/15'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <span className="text-xs font-bold text-slate-100 leading-relaxed">
                          س{idx + 1}: {q.questionText}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 shrink-0">
                        {isCorrect ? `+${q.points} درجة` : '0 درجات'}
                      </span>
                    </div>

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 mr-7">
                      {q.options.map((opt, optIdx) => {
                        const isStudentChoice = studentAns === optIdx;
                        const isModelAnswer = optIdx === q.correctOptionIndex;

                        let style = 'border-slate-800 bg-slate-900 text-slate-400';
                        if (isModelAnswer) {
                          style = 'border-emerald-600 bg-emerald-950/60 text-emerald-200 font-bold';
                        } else if (isStudentChoice && !isCorrect) {
                          style = 'border-rose-600 bg-rose-950/60 text-rose-200';
                        }

                        return (
                          <div key={optIdx} className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${style}`}>
                            <span>{opt}</span>
                            {isModelAnswer && <span className="text-[10px] text-emerald-400">✓ الإجابة النموذجية</span>}
                            {isStudentChoice && !isModelAnswer && <span className="text-[10px] text-rose-400">✗ إجابتك</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="mr-7 p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <span className="text-cyan-400 font-semibold block mb-0.5">توضيح المعلم وطريقة الحل:</span>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        ) : (
          /* ACTIVE EXAM RUNNER VIEW */
          <div className="space-y-6">
            
            {/* Question Quick Navigation Palette */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs text-slate-400 font-medium">فهرس الأسئلة:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {exam.questions.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCurrent = idx === currentQuestionIndex;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-7 w-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400'
                          : isAnswered
                          ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Question Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-6 shadow-xl">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-cyan-400 font-mono">
                  السؤال {currentQuestionIndex + 1} من {exam.questions.length}
                </span>
                <span className="text-xs text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                  {currentQ.points} درجات
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentQ.questionText}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
                      className={`w-full text-right p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 ring-1 ring-cyan-500'
                          : 'border-slate-800 bg-slate-950 text-slate-200 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                          isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-xs sm:text-sm font-medium">{opt}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs font-medium text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>السؤال السابق</span>
                </button>

                {currentQuestionIndex < exam.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(exam.questions.length - 1, prev + 1))}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white shadow transition-colors cursor-pointer"
                  >
                    <span>السؤال التالي</span>
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleManualSubmit}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg transition-colors cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    <span>إنهاء وتسليم الإجابات</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
