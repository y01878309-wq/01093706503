import React, { useState } from 'react';
import { 
  Clock, 
  HelpCircle, 
  Play, 
  Plus, 
  Award, 
  CheckCircle2, 
  Trash2, 
  Users, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { TimedExam, ExamSubmission, UserAccount } from '../types';

interface ExamsListViewProps {
  exams: TimedExam[];
  submissions: ExamSubmission[];
  currentUser: UserAccount;
  onStartExam: (exam: TimedExam) => void;
  onOpenCreateExam: () => void;
  onDeleteExam: (examId: string) => void;
}

export const ExamsListView: React.FC<ExamsListViewProps> = ({
  exams,
  submissions,
  currentUser,
  onStartExam,
  onOpenCreateExam,
  onDeleteExam
}) => {
  const [selectedSubject, setSelectedSubject] = useState('all');

  const subjects = Array.from(new Set(exams.map(e => e.subject)));
  const isTeacher = currentUser.role === 'teacher';

  const filteredExams = exams.filter(e => {
    return selectedSubject === 'all' || e.subject === selectedSubject;
  });

  // Find user's past submission for an exam
  const getUserSubmission = (examId: string) => {
    return submissions
      .filter(s => s.examId === examId && s.studentEmail === currentUser.email)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0];
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <Clock className="h-4 w-4" />
            <span>نظام الامتحانات والاختبارات التفاعلية الموقوتة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            امتحانات موقوتة بتوقيت يحدده المعلم
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            اختبر سرعة استيعابك وحل المسائل تحت ضغط وقت الامتحان الحقيقي، مع تسليم تلقائي وتصحيح نموذجي فوري
          </p>
        </div>

        {isTeacher && (
          <button
            onClick={onOpenCreateExam}
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-cyan-500 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>+ إنشاء امتحان وتحديد الوقت</span>
          </button>
        )}
      </div>

      {/* Subject Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedSubject('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            selectedSubject === 'all'
              ? 'bg-cyan-500 text-slate-950 font-bold'
              : 'border border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
          }`}
        >
          جميع المواد ({exams.length})
        </button>
        {subjects.map(sub => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedSubject === sub
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'border border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => {
          const pastSub = getUserSubmission(exam.id);
          const totalPoints = exam.questions.reduce((sum, q) => sum + q.points, 0);

          return (
            <div
              key={exam.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col justify-between space-y-5 hover:border-slate-700 transition-all duration-200 group"
            >
              <div className="space-y-3">
                {/* Meta line */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-cyan-400">{exam.subject}</span>
                  <div className="flex items-center gap-1.5 font-mono text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/50">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{exam.durationMinutes} دقيقة</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                  {exam.title}
                </h3>

                {/* Unit / Grade */}
                <p className="text-xs text-slate-400">
                  {exam.unit} · {exam.grade}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
                  <span>{exam.questions.length} أسئلة</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>{totalPoints} درجة</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>النجاح: %{exam.passingScorePercent}</span>
                </div>

                {/* Previous Attempt if student took it */}
                {pastSub && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-slate-300">آخر محاولة لك:</span>
                    </div>
                    <span className={`font-mono font-bold ${pastSub.isPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
                      %{pastSub.percentage} ({pastSub.score}/{pastSub.totalPoints})
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onStartExam(exam)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>{pastSub ? 'إعادة خوض الامتحان' : 'بدء الامتحان الموقوت'}</span>
                </button>

                {isTeacher && (
                  <button
                    onClick={() => {
                      if (confirm(`حذف هذا الامتحان: "${exam.title}"؟`)) {
                        onDeleteExam(exam.id);
                      }
                    }}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-rose-400 hover:border-rose-900 transition-colors cursor-pointer"
                    title="حذف الامتحان"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Teacher: Recent Submissions Roster */}
      {isTeacher && submissions.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-cyan-400" />
              <span>سجل درجات الطلاب في الامتحانات الموقوتة:</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">{submissions.length} نتيجة مرصودة</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">اسم الطالب</th>
                  <th className="py-2.5 px-3">الامتحان</th>
                  <th className="py-2.5 px-3">الدرجة</th>
                  <th className="py-2.5 px-3">النسبة</th>
                  <th className="py-2.5 px-3">الحالة</th>
                  <th className="py-2.5 px-3">تاريخ التسليم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {submissions.slice(0, 10).map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-sans font-semibold text-slate-200">
                      {sub.studentName}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-300">
                      {sub.examTitle}
                    </td>
                    <td className="py-2.5 px-3 text-cyan-300 font-bold">
                      {sub.score} / {sub.totalPoints}
                    </td>
                    <td className="py-2.5 px-3 text-white">
                      %{sub.percentage}
                    </td>
                    <td className="py-2.5 px-3">
                      {sub.isPassed ? (
                        <span className="text-emerald-400 font-sans font-medium">ناجح ✓</span>
                      ) : (
                        <span className="text-amber-400 font-sans font-medium">يحتاج مراجعة</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                      {new Date(sub.submittedAt).toLocaleDateString('ar-EG')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
