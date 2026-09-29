import React, { useState } from 'react';
import { 
  Film, 
  GraduationCap, 
  PenTool, 
  Users, 
  PlusCircle, 
  Trash2, 
  Star, 
  Search, 
  ExternalLink,
  Clock,
  Sparkles,
  KeyRound,
  Award
} from 'lucide-react';
import { VideoLesson, UserAccount, TimedExam, ExamSubmission } from '../types';
import { StudentAccessManager } from './StudentAccessManager';

interface TeacherDashboardProps {
  videos: VideoLesson[];
  users: UserAccount[];
  exams: TimedExam[];
  submissions: ExamSubmission[];
  onSelectVideo: (v: VideoLesson) => void;
  onOpenUploadModal: () => void;
  onOpenCreateExam: () => void;
  onOpenDownloadModal: () => void;
  onOpenPlayStoreGuide: () => void;
  onDeleteVideo: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onApproveUser: (userId: string) => void;
  onBlockUser: (userId: string) => void;
  onUpdateUserCode: (userId: string, newCode: string) => void;
  onAddPreApprovedUser: (newUser: Omit<UserAccount, 'id' | 'registeredAt'>) => void;
  onDeleteUser: (userId: string) => void;
  onDeleteExam: (examId: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  videos,
  users,
  exams,
  submissions,
  onSelectVideo,
  onOpenUploadModal,
  onOpenCreateExam,
  onOpenDownloadModal,
  onOpenPlayStoreGuide,
  onDeleteVideo,
  onToggleFeatured,
  onApproveUser,
  onBlockUser,
  onUpdateUserCode,
  onAddPreApprovedUser,
  onDeleteUser,
  onDeleteExam
}) => {
  const [activeSection, setActiveSection] = useState<'videos' | 'students' | 'exams'>('videos');
  const [filterType, setFilterType] = useState<'all' | 'explanation' | 'problem-solving'>('all');
  const [search, setSearch] = useState('');

  const explanationCount = videos.filter(v => v.type === 'explanation').length;
  const problemCount = videos.filter(v => v.type === 'problem-solving').length;
  const pendingStudentsCount = users.filter(u => u.role === 'student' && u.status === 'pending').length;

  const filteredVideos = videos.filter(v => {
    const matchesType = filterType === 'all' || v.type === filterType;
    const matchesSearch = !search || 
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.subject.toLowerCase().includes(search.toLowerCase()) ||
      v.unit.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <Sparkles className="h-4 w-4" />
            <span>لوحة تحكم المعلم وصانع المحتوى التعليمي</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            استوديو المعلم الشامل
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            إدارة كاملة للفيديوهات، قبول واعتماد الطلاب وأكوادهم، وإنشاء الامتحانات الموقوتة
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenPlayStoreGuide}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-cyan-700/80 bg-cyan-950/40 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:text-white hover:bg-cyan-900/60 transition-colors cursor-pointer"
            title="دليل نشر التطبيق على متجر Google Play وتوليد ملف APK"
          >
            <Clock className="h-4 w-4 hidden" />
            <span>متجر Google Play (APK)</span>
          </button>

          <button
            onClick={onOpenDownloadModal}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-750 transition-colors cursor-pointer"
            title="تحميل كود المنصة كاملاً كملف مضغوط"
          >
            <Film className="h-4 w-4 hidden" />
            <span className="font-mono text-cyan-400 font-bold">ZIP</span>
            <span>تحميل كود المنصة</span>
          </button>

          <button
            onClick={onOpenCreateExam}
            className="flex items-center justify-center gap-2 rounded-xl border border-cyan-800 bg-cyan-950/60 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-900 transition-colors cursor-pointer"
          >
            <Clock className="h-4 w-4" />
            <span>+ إنشاء امتحان موقوت</span>
          </button>

          <button
            onClick={onOpenUploadModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-cyan-500 transition-colors whitespace-nowrap cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>رفع فيديو جديد</span>
          </button>
        </div>
      </div>

      {/* Main Section Navigation Switcher */}
      <div className="flex items-center p-1.5 bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl overflow-x-auto">
        <button
          onClick={() => setActiveSection('videos')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
            activeSection === 'videos'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Film className="h-4 w-4" />
          <span>إدارة الفيديوهات والشروحات ({videos.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('students')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap relative ${
            activeSection === 'students'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <KeyRound className="h-4 w-4" />
          <span>إدارة الطلاب وأكواد الوصول</span>
          {pendingStudentsCount > 0 && (
            <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full font-mono">
              {pendingStudentsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSection('exams')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
            activeSection === 'exams'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>الامتحانات والدرجات ({exams.length})</span>
        </button>
      </div>

      {/* SECTION 1: VIDEOS MANAGEMENT */}
      {activeSection === 'videos' && (
        <div className="space-y-6">
          {/* Quantitative Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>إجمالي الفيديوهات</span>
                <Film className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {videos.length}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">دروس منشورة في المنصة</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>فيديوهات الشرح المفاهيمي</span>
                <GraduationCap className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-cyan-300 tabular-nums">
                {explanationCount}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">شروحات تأسيسية ونظرية</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>فيديوهات حل المسائل</span>
                <PenTool className="h-4 w-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-300 tabular-nums">
                {problemCount}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">حلول امتحانات وتطبيقات</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>الطلاب المشتركين</span>
                <Users className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-300 tabular-nums">
                {users.filter(u => u.role === 'student').length}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">حسابات مسجلة بجوجل</span>
            </div>
          </div>

          {/* Videos Table & Search */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg w-full sm:w-auto">
                <button
                  onClick={() => setFilterType('all')}
                  className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    filterType === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  الكل ({videos.length})
                </button>
                <button
                  onClick={() => setFilterType('explanation')}
                  className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    filterType === 'explanation' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  فيديوهات الشرح ({explanationCount})
                </button>
                <button
                  onClick={() => setFilterType('problem-solving')}
                  className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    filterType === 'problem-solving' ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  حل المسائل ({problemCount})
                </button>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="تصفية حسب العنوان أو المادة..."
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pr-9 pl-3 text-xs text-slate-200 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-medium">الدرس / الفيديو</th>
                    <th className="py-3 px-4 font-medium">النوع</th>
                    <th className="py-3 px-4 font-medium">المادة والصف</th>
                    <th className="py-3 px-4 font-medium">المدة</th>
                    <th className="py-3 px-4 font-medium">خطوات الحل</th>
                    <th className="py-3 px-4 font-medium">المميز</th>
                    <th className="py-3 px-4 font-medium text-left">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
                  {filteredVideos.length > 0 ? (
                    filteredVideos.map((vid) => (
                      <tr key={vid.id} className="hover:bg-slate-850/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3 max-w-sm">
                            <div className="relative aspect-video w-14 shrink-0 overflow-hidden rounded bg-slate-950">
                              {vid.thumbnailUrl ? (
                                <img src={vid.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full bg-slate-800" />
                              )}
                            </div>
                            <div className="truncate">
                              <button
                                onClick={() => onSelectVideo(vid)}
                                className="font-semibold text-slate-200 hover:text-cyan-400 truncate block text-right cursor-pointer"
                              >
                                {vid.title}
                              </button>
                              <span className="text-[11px] text-slate-500 truncate block">
                                {vid.unit}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          {vid.type === 'explanation' ? (
                            <span className="text-cyan-400 font-medium">شرح مفاهيم</span>
                          ) : (
                            <span className="text-amber-400 font-medium">حل مسائل</span>
                          )}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="text-slate-200 block">{vid.subject}</span>
                          <span className="text-[11px] text-slate-500">{vid.grade}</span>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-300">
                          {vid.duration}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-400">
                          {vid.solutionSteps ? `${vid.solutionSteps.length} خطوات` : '-'}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <button
                            onClick={() => onToggleFeatured(vid.id)}
                            className={`p-1.5 rounded transition-colors cursor-pointer ${
                              vid.isFeatured ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                            }`}
                            title={vid.isFeatured ? 'إلغاء التمييز' : 'تمييز في الواجهة'}
                          >
                            <Star className="h-4 w-4 fill-current" />
                          </button>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap text-left">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onSelectVideo(vid)}
                              className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors cursor-pointer"
                              title="عرض الدرس كما يراه الطالب"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`هل أنت متأكد من حذف فيديو: "${vid.title}"؟`)) {
                                  onDeleteVideo(vid.id);
                                }
                              }}
                              className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                              title="حذف الفيديو"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-xs text-slate-500">
                        لا توجد فيديوهات مطابقة لمعايير البحث.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: STUDENT ACCESS & CODES MANAGEMENT */}
      {activeSection === 'students' && (
        <StudentAccessManager
          users={users}
          onApproveUser={onApproveUser}
          onBlockUser={onBlockUser}
          onUpdateUserCode={onUpdateUserCode}
          onAddPreApprovedUser={onAddPreApprovedUser}
          onDeleteUser={onDeleteUser}
        />
      )}

      {/* SECTION 3: EXAMS & SUBMISSIONS */}
      {activeSection === 'exams' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-cyan-400" />
              <span>الامتحانات الموقوتة التي قمت بنشرها ({exams.length})</span>
            </h2>
            <button
              onClick={onOpenCreateExam}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500"
            >
              <PlusCircle className="h-4 w-4" />
              <span>إنشاء امتحان جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.map((exam) => (
              <div key={exam.id} className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cyan-400">{exam.subject}</span>
                  <div className="flex items-center gap-1 font-mono text-xs text-amber-300 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                    <Clock className="h-3.5 w-3.5" />
                    <span>مدة الامتحان: {exam.durationMinutes} دقيقة</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white">{exam.title}</h3>
                <p className="text-xs text-slate-400">{exam.unit} · {exam.grade}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <span>{exam.questions.length} أسئلة اختيار من متعدد</span>
                  <button
                    onClick={() => {
                      if (confirm(`حذف امتحان: ${exam.title}؟`)) {
                        onDeleteExam(exam.id);
                      }
                    }}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Submissions Roster */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-cyan-400" />
              <span>نتائج ودرجات الطلاب المسلمة ({submissions.length} نتيجة):</span>
            </h2>

            {submissions.length > 0 ? (
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
                    {submissions.map((sub) => (
                      <tr key={sub.id}>
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
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                لم يقم أي طالب بتسليم امتحان موقوت بعد.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
