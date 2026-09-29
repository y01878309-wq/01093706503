import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, 
  PenTool, 
  Sparkles, 
  SlidersHorizontal, 
  PlusCircle, 
  Layers,
  BookOpen,
  CheckCircle2,
  Clock,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { 
  VideoLesson, 
  StudentNote, 
  VideoComment, 
  TimedExam, 
  ExamSubmission, 
  UserAccount 
} from './types';
import { 
  loadVideos, 
  saveVideos, 
  loadProgress, 
  saveProgress, 
  loadNotes, 
  saveNotes,
  loadExams,
  saveExams,
  loadSubmissions,
  saveSubmissions,
  loadUsers,
  saveUsers,
  loadCurrentUser,
  saveCurrentUser
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SubjectBar } from './components/SubjectBar';
import { VideoCard } from './components/VideoCard';
import { VideoPlayerView } from './components/VideoPlayerView';
import { VideoUploadModal } from './components/VideoUploadModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { BookmarksView } from './components/BookmarksView';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { AccessGateScreen } from './components/AccessGateScreen';
import { ExamRunner } from './components/ExamRunner';
import { ExamCreateModal } from './components/ExamCreateModal';
import { ExamsListView } from './components/ExamsListView';
import { DownloadExportModal } from './components/DownloadExportModal';
import { PlayStoreGuideModal } from './components/PlayStoreGuideModal';
import { usePWAInstall } from './hooks/usePWAInstall';

export default function App() {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  // Core Data State
  const [videos, setVideos] = useState<VideoLesson[]>(() => loadVideos());
  const [progress, setProgress] = useState(() => loadProgress());
  const [notes, setNotes] = useState<StudentNote[]>(() => loadNotes());
  const [exams, setExams] = useState<TimedExam[]>(() => loadExams());
  const [submissions, setSubmissions] = useState<ExamSubmission[]>(() => loadSubmissions());
  const [users, setUsers] = useState<UserAccount[]>(() => loadUsers());
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => loadCurrentUser());

  // Views & Modals State
  const [currentTab, setCurrentTab] = useState<'browse' | 'explanation' | 'problem-solving' | 'exams' | 'dashboard' | 'bookmarks'>('browse');
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson | null>(null);
  const [activeExam, setActiveExam] = useState<TimedExam | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isExamCreateModalOpen, setIsExamCreateModalOpen] = useState(false);
  const [isGoogleAuthModalOpen, setIsGoogleAuthModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isPlayStoreGuideOpen, setIsPlayStoreGuideOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard' | 'genius'>('all');
  const [groupByUnit, setGroupByUnit] = useState(false);

  // Storage Synchronization
  useEffect(() => { saveVideos(videos); }, [videos]);
  useEffect(() => { saveProgress(progress); }, [progress]);
  useEffect(() => { saveNotes(notes); }, [notes]);
  useEffect(() => { saveExams(exams); }, [exams]);
  useEffect(() => { saveSubmissions(submissions); }, [submissions]);
  useEffect(() => { saveUsers(users); }, [users]);
  useEffect(() => { saveCurrentUser(currentUser); }, [currentUser]);

  // Dynamic Subjects List from videos
  const subjectsList = useMemo(() => {
    return Array.from(new Set(videos.map(v => v.subject))).filter(Boolean);
  }, [videos]);

  // Video counts by subject
  const videoCountsBySubject = useMemo(() => {
    const counts: Record<string, number> = {};
    videos.forEach(v => {
      counts[v.subject] = (counts[v.subject] || 0) + 1;
    });
    return counts;
  }, [videos]);

  // Count pending students for teacher notification
  const pendingStudentsCount = useMemo(() => {
    return users.filter(u => u.role === 'student' && u.status === 'pending').length;
  }, [users]);

  // ==================== User & Auth Handlers ====================

  const handleLoginSuccess = (user: UserAccount) => {
    // Add user to state if new
    const existingIndex = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    if (existingIndex === -1) {
      setUsers(prev => [user, ...prev]);
      setCurrentUser(user);
    } else {
      const existing = users[existingIndex];
      setCurrentUser(existing);
    }
    // If teacher, can view dashboard or browse
    if (user.role === 'teacher') {
      setCurrentTab('browse');
    }
  };

  const handleLogout = () => {
    // Switch to sample pending student to demonstrate the security gate, or open login modal
    setIsGoogleAuthModalOpen(true);
  };

  const handleActivateWithCode = (enteredCode: string): boolean => {
    const trimmed = enteredCode.trim();
    // Validate if matching current user's assigned code or master teacher code
    if (
      trimmed === currentUser.accessCode ||
      trimmed === 'MASTER-2026' ||
      trimmed.toLowerCase() === 'fahem'
    ) {
      const updatedUser: UserAccount = {
        ...currentUser,
        status: 'approved',
        approvedAt: new Date().toISOString().split('T')[0]
      };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
      return true;
    }
    return false;
  };

  const handleApproveUser = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          status: 'approved',
          approvedAt: new Date().toISOString().split('T')[0]
        };
      }
      return u;
    }));
    // If the approved user is the currently logged in student, update state immediately
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({
        ...prev,
        status: 'approved',
        approvedAt: new Date().toISOString().split('T')[0]
      }));
    }
  };

  const handleBlockUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'blocked' } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, status: 'blocked' }));
    }
  };

  const handleUpdateUserCode = (userId: string, newCode: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, accessCode: newCode } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, accessCode: newCode }));
    }
  };

  const handleAddPreApprovedUser = (userData: Omit<UserAccount, 'id' | 'registeredAt'>) => {
    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      ...userData,
      registeredAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [newUser, ...prev]);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  // ==================== Exam Handlers ====================

  const handleStartExam = (exam: TimedExam) => {
    setActiveExam(exam);
  };

  const handleFinishExam = (submission: ExamSubmission) => {
    setSubmissions(prev => [submission, ...prev]);
  };

  const handleSaveExam = (newExam: TimedExam) => {
    setExams(prev => [newExam, ...prev]);
    // Also redirect to view the exams list
    setCurrentTab('exams');
  };

  const handleDeleteExam = (examId: string) => {
    setExams(prev => prev.filter(e => e.id !== examId));
  };

  // ==================== Video Handlers ====================

  const handleToggleBookmark = (videoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setProgress(prev => {
      const isMarked = prev.bookmarkedVideoIds.includes(videoId);
      const nextBookmarks = isMarked
        ? prev.bookmarkedVideoIds.filter(id => id !== videoId)
        : [...prev.bookmarkedVideoIds, videoId];
      return { ...prev, bookmarkedVideoIds: nextBookmarks };
    });
  };

  const handleToggleCompleted = (videoId: string) => {
    setProgress(prev => {
      const isDone = prev.completedVideoIds.includes(videoId);
      const nextCompleted = isDone
        ? prev.completedVideoIds.filter(id => id !== videoId)
        : [...prev.completedVideoIds, videoId];
      return { ...prev, completedVideoIds: nextCompleted };
    });
  };

  const handleUpdateProgressSeconds = (videoId: string, seconds: number) => {
    setProgress(prev => ({
      ...prev,
      videoProgress: {
        ...prev.videoProgress,
        [videoId]: seconds
      }
    }));
  };

  const handleAddVideo = (newVideo: VideoLesson) => {
    setVideos(prev => [newVideo, ...prev]);
    setSelectedVideo(newVideo);
  };

  const handleDeleteVideo = (videoId: string) => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
    if (selectedVideo?.id === videoId) {
      setSelectedVideo(null);
    }
  };

  const handleToggleFeatured = (videoId: string) => {
    setVideos(prev => prev.map(v => v.id === videoId ? { ...v, isFeatured: !v.isFeatured } : v));
  };

  const handleAddNote = (newNote: { videoId: string; timestampSeconds: number; formattedTime: string; content: string }) => {
    const created: StudentNote = {
      id: `note-${Date.now()}`,
      ...newNote,
      createdAt: new Date().toISOString()
    };
    setNotes(prev => [created, ...prev]);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };

  const handleAddComment = (videoId: string, commentData: Omit<VideoComment, 'id' | 'date'>) => {
    const newComment: VideoComment = {
      id: `comm-${Date.now()}`,
      ...commentData,
      date: 'الآن'
    };
    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        return {
          ...v,
          comments: [newComment, ...(v.comments || [])]
        };
      }
      return v;
    }));
    if (selectedVideo && selectedVideo.id === videoId) {
      setSelectedVideo({
        ...selectedVideo,
        comments: [newComment, ...(selectedVideo.comments || [])]
      });
    }
  };

  // ==================== Filtered Catalog ====================

  const filteredVideos = useMemo(() => {
    return videos.filter(v => {
      if (currentTab === 'explanation' && v.type !== 'explanation') return false;
      if (currentTab === 'problem-solving' && v.type !== 'problem-solving') return false;
      if (selectedSubject !== 'all' && v.subject !== selectedSubject) return false;
      if (selectedDifficulty !== 'all' && v.difficulty !== selectedDifficulty) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = v.title.toLowerCase().includes(q);
        const matchesSubject = v.subject.toLowerCase().includes(q);
        const matchesUnit = v.unit.toLowerCase().includes(q);
        const matchesInstructor = v.instructor.name.toLowerCase().includes(q);
        const matchesTakeaways = v.keyTakeaways?.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSubject && !matchesUnit && !matchesInstructor && !matchesTakeaways) {
          return false;
        }
      }

      return true;
    });
  }, [videos, currentTab, selectedSubject, selectedDifficulty, searchQuery]);

  const groupedVideos = useMemo(() => {
    const groups: Record<string, VideoLesson[]> = {};
    filteredVideos.forEach(v => {
      const key = `${v.subject} - ${v.unit}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(v);
    });
    return groups;
  }, [filteredVideos]);

  const bookmarkedVideos = useMemo(() => {
    return videos.filter(v => progress.bookmarkedVideoIds.includes(v.id));
  }, [videos, progress.bookmarkedVideoIds]);

  const explanationsCount = videos.filter(v => v.type === 'explanation').length;
  const problemsCount = videos.filter(v => v.type === 'problem-solving').length;

  // Check if student access gate is active (student signed in with Google, but waiting for approval/code)
  const isStudentPending = currentUser.role === 'student' && currentUser.status !== 'approved';

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans">
      
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setSelectedVideo(null);
          setActiveExam(null);
          setCurrentTab(tab);
        }}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
        onOpenPlayStoreGuide={() => setIsPlayStoreGuideOpen(true)}
        currentUser={currentUser}
        onOpenGoogleAuth={() => setIsGoogleAuthModalOpen(true)}
        onLogout={handleLogout}
        bookmarksCount={progress.bookmarkedVideoIds.length}
        pendingApprovalsCount={pendingStudentsCount}
      />

      {/* RENDER MAIN CONTENT */}
      <main className="flex-1">
        
        {/* CASE 1: Student is signed in with Google, but NOT approved yet! (Teacher Approval Gate) */}
        {isStudentPending ? (
          <AccessGateScreen
            currentUser={currentUser}
            onActivateWithCode={handleActivateWithCode}
            onLogout={handleLogout}
            onSwitchToTeacherDemo={() => {
              const teacher = users.find(u => u.role === 'teacher') || users[0];
              setCurrentUser(teacher);
            }}
          />
        ) : activeExam ? (
          /* CASE 2: Student is taking a Timed Exam */
          <ExamRunner
            exam={activeExam}
            currentUser={currentUser}
            onFinishExam={handleFinishExam}
            onExit={() => setActiveExam(null)}
          />
        ) : selectedVideo ? (
          /* CASE 3: Single Video Theater Mode Player */
          <VideoPlayerView
            video={selectedVideo}
            allVideos={videos}
            onBack={() => setSelectedVideo(null)}
            onSelectVideo={(v) => setSelectedVideo(v)}
            isBookmarked={progress.bookmarkedVideoIds.includes(selectedVideo.id)}
            onToggleBookmark={handleToggleBookmark}
            isCompleted={progress.completedVideoIds.includes(selectedVideo.id)}
            onToggleCompleted={handleToggleCompleted}
            studentNotes={notes}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
            onAddComment={handleAddComment}
            onUpdateProgress={handleUpdateProgressSeconds}
          />
        ) : currentTab === 'dashboard' ? (
          /* CASE 4: Teacher / Creator Studio Dashboard (Videos + Student Access Codes + Timed Exams) */
          <TeacherDashboard
            videos={videos}
            users={users}
            exams={exams}
            submissions={submissions}
            onSelectVideo={(v) => setSelectedVideo(v)}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onOpenCreateExam={() => setIsExamCreateModalOpen(true)}
            onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
            onOpenPlayStoreGuide={() => setIsPlayStoreGuideOpen(true)}
            onDeleteVideo={handleDeleteVideo}
            onToggleFeatured={handleToggleFeatured}
            onApproveUser={handleApproveUser}
            onBlockUser={handleBlockUser}
            onUpdateUserCode={handleUpdateUserCode}
            onAddPreApprovedUser={handleAddPreApprovedUser}
            onDeleteUser={handleDeleteUser}
            onDeleteExam={handleDeleteExam}
          />
        ) : currentTab === 'exams' ? (
          /* CASE 5: Timed Exams Catalog */
          <ExamsListView
            exams={exams}
            submissions={submissions}
            currentUser={currentUser}
            onStartExam={handleStartExam}
            onOpenCreateExam={() => setIsExamCreateModalOpen(true)}
            onDeleteExam={handleDeleteExam}
          />
        ) : currentTab === 'bookmarks' ? (
          /* CASE 6: Bookmarked Questions & Lessons */
          <BookmarksView
            bookmarkedVideos={bookmarkedVideos}
            onSelectVideo={(v) => setSelectedVideo(v)}
            onToggleBookmark={handleToggleBookmark}
            completedVideoIds={progress.completedVideoIds}
            onBackToBrowse={() => setCurrentTab('browse')}
          />
        ) : (
          /* CASE 7: Library Catalog (Browse, Explanation, Problem Solving) */
          <>
            {/* Hero Section */}
            <HeroSection
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedType={currentTab === 'explanation' ? 'explanation' : currentTab === 'problem-solving' ? 'problem-solving' : 'all'}
              onSelectType={(type) => {
                if (type === 'explanation') setCurrentTab('explanation');
                else if (type === 'problem-solving') setCurrentTab('problem-solving');
                else setCurrentTab('browse');
              }}
              totalVideosCount={videos.length}
              explanationsCount={explanationsCount}
              problemsCount={problemsCount}
            />

            {/* Subjects Filter Bar */}
            <SubjectBar
              subjects={subjectsList}
              selectedSubject={selectedSubject}
              onSelectSubject={setSelectedSubject}
              videoCountsBySubject={videoCountsBySubject}
            />

            {/* Content Area */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
              
              {/* Secondary Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                
                {/* Result count & active track label */}
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">
                    {currentTab === 'explanation'
                      ? 'فيديوهات الشرح المفاهيمي'
                      : currentTab === 'problem-solving'
                      ? 'حل التمارين والمسائل'
                      : 'جميع الفيديوهات التعليمية'}
                  </span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="font-mono text-cyan-400">
                    {filteredVideos.length} فيديو متوفر
                  </span>
                  {progress.completedVideoIds.length > 0 && (
                    <>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-emerald-400 font-mono">
                        {progress.completedVideoIds.length} مكتمل
                      </span>
                    </>
                  )}
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-3">
                  {/* Difficulty selector */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
                    <span>المستوى:</span>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                      className="rounded-lg border border-slate-800 bg-slate-900 py-1.5 px-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="all">الكل</option>
                      <option value="easy">مستوى أساسي</option>
                      <option value="medium">متوسط</option>
                      <option value="hard">متقدم (امتحانات)</option>
                      <option value="genius">مسائل تفوق</option>
                    </select>
                  </div>

                  {/* Group by Unit Toggle */}
                  <button
                    onClick={() => setGroupByUnit(!groupByUnit)}
                    className={`flex items-center gap-1.5 rounded-lg border py-1.5 px-3 text-xs transition-colors cursor-pointer ${
                      groupByUnit
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>تقسيم حسب الأبواب</span>
                  </button>
                </div>
              </div>

              {/* Videos Grid */}
              {filteredVideos.length > 0 ? (
                groupByUnit ? (
                  <div className="space-y-8">
                    {Object.entries(groupedVideos).map(([unitKey, unitVideos]) => (
                      <div key={unitKey} className="space-y-4">
                        <div className="flex items-center gap-2 border-r-2 border-cyan-400 pr-3">
                          <h2 className="text-sm font-bold text-white">
                            {unitKey}
                          </h2>
                          <span className="text-xs font-mono text-slate-400">
                            ({unitVideos.length} فيديو)
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {unitVideos.map((video) => (
                            <VideoCard
                              key={video.id}
                              video={video}
                              onSelect={(v) => setSelectedVideo(v)}
                              isBookmarked={progress.bookmarkedVideoIds.includes(video.id)}
                              onToggleBookmark={handleToggleBookmark}
                              isCompleted={progress.completedVideoIds.includes(video.id)}
                              progressSeconds={progress.videoProgress[video.id]}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVideos.map((video) => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        onSelect={(v) => setSelectedVideo(v)}
                        isBookmarked={progress.bookmarkedVideoIds.includes(video.id)}
                        onToggleBookmark={handleToggleBookmark}
                        isCompleted={progress.completedVideoIds.includes(video.id)}
                        progressSeconds={progress.videoProgress[video.id]}
                      />
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-20 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8 space-y-4 max-w-md mx-auto">
                  <BookOpen className="h-10 w-10 text-slate-500 mx-auto" />
                  <h2 className="text-base font-semibold text-slate-200">
                    لم يتم العثور على فيديوهات مطابقة
                  </h2>
                  <p className="text-xs text-slate-400">
                    جرب البحث بكلمة أخرى أو أعد تعيين الفلاتر.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSubject('all');
                      setSelectedDifficulty('all');
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-slate-300 hover:text-white cursor-pointer"
                  >
                    إعادة ضبط الفلاتر
                  </button>
                </div>
              )}

            </div>
          </>
        )}
      </main>

      {/* Video Upload Modal */}
      <VideoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSaveVideo={handleAddVideo}
        existingSubjects={subjectsList}
      />

      {/* Timed Exam Create Modal */}
      <ExamCreateModal
        isOpen={isExamCreateModalOpen}
        onClose={() => setIsExamCreateModalOpen(false)}
        onSaveExam={handleSaveExam}
        existingSubjects={subjectsList}
      />

      {/* Google Authentication Dialog */}
      <GoogleAuthModal
        isOpen={isGoogleAuthModalOpen}
        onClose={() => setIsGoogleAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        allUsers={users}
      />

      {/* Download & Export Project Modal */}
      <DownloadExportModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        videos={videos}
        exams={exams}
        users={users}
        submissions={submissions}
        onImportData={(imported) => {
          if (imported.videos) setVideos(imported.videos);
          if (imported.exams) setExams(imported.exams);
          if (imported.users) setUsers(imported.users);
          if (imported.submissions) setSubmissions(imported.submissions);
        }}
      />

      {/* Google Play Store & PWA Publishing Guide Modal */}
      <PlayStoreGuideModal
        isOpen={isPlayStoreGuideOpen}
        onClose={() => setIsPlayStoreGuideOpen(false)}
        onTriggerInstall={install}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
      />

      {/* Domain-Native Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090d14] text-slate-400 text-xs py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-tight">منصة فاهم التعليمية</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>نظام الشروحات، حلول المسائل، والامتحانات الموقوتة بالدقيقة</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
            <span>{videos.length} فيديو</span>
            <span aria-hidden="true">·</span>
            <span>{exams.length} امتحانات موقوتة</span>
            <span aria-hidden="true">·</span>
            <span>دخول Google محمي بأكواد المعلم</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
