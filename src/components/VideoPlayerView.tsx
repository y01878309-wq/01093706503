import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowRight, 
  Bookmark, 
  CheckCircle2, 
  FileText, 
  Clock, 
  HelpCircle, 
  MessageSquare, 
  ListOrdered, 
  ExternalLink, 
  Plus, 
  Send, 
  Check, 
  X,
  Play,
  Share2
} from 'lucide-react';
import { StudentNote, VideoLesson, VideoComment } from '../types';
import { extractYouTubeId, formatTime } from '../utils/video';

interface VideoPlayerViewProps {
  video: VideoLesson;
  allVideos: VideoLesson[];
  onBack: () => void;
  onSelectVideo: (v: VideoLesson) => void;
  isBookmarked: boolean;
  onToggleBookmark: (videoId: string, e: React.MouseEvent) => void;
  isCompleted: boolean;
  onToggleCompleted: (videoId: string) => void;
  studentNotes: StudentNote[];
  onAddNote: (note: { videoId: string; timestampSeconds: number; formattedTime: string; content: string }) => void;
  onDeleteNote: (noteId: string) => void;
  onAddComment: (videoId: string, comment: Omit<VideoComment, 'id' | 'date'>) => void;
  onUpdateProgress: (videoId: string, seconds: number) => void;
}

export const VideoPlayerView: React.FC<VideoPlayerViewProps> = ({
  video,
  allVideos,
  onBack,
  onSelectVideo,
  isBookmarked,
  onToggleBookmark,
  isCompleted,
  onToggleCompleted,
  studentNotes,
  onAddNote,
  onDeleteNote,
  onAddComment,
  onUpdateProgress
}) => {
  const [activeTab, setActiveTab] = useState<'steps' | 'timestamps' | 'quiz' | 'notes' | 'discussion'>('steps');
  const [currentSeconds, setCurrentSeconds] = useState<number>(0);
  const [newNoteText, setNewNoteText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [commenterName, setCommenterName] = useState('طالب فاهم');
  const [includeTimestampInComment, setIncludeTimestampInComment] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const youtubeId = extractYouTubeId(video.videoUrl);
  const isYouTube = video.videoSourceType === 'youtube' || Boolean(youtubeId);

  // Filter notes specific to this video
  const currentVideoNotes = studentNotes.filter(n => n.videoId === video.id);

  // Related videos in the same subject/unit
  const relatedVideos = allVideos
    .filter(v => v.id !== video.id && (v.subjectId === video.subjectId || v.unit === video.unit))
    .slice(0, 4);

  // Jump to specific timestamp
  const handleSeek = (seconds: number) => {
    setCurrentSeconds(seconds);
    if (!isYouTube && videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
    } else if (isYouTube && iframeRef.current) {
      // Seek youtube iframe by reloading with start parameter
      const baseUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&start=${Math.floor(seconds)}`;
      iframeRef.current.src = baseUrl;
    }
  };

  // Video time update for HTML5 video
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = Math.floor(videoRef.current.currentTime);
      setCurrentSeconds(time);
      onUpdateProgress(video.id, time);
    }
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote({
      videoId: video.id,
      timestampSeconds: currentSeconds,
      formattedTime: formatTime(currentSeconds),
      content: newNoteText.trim()
    });
    setNewNoteText('');
  };

  const handleCreateComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(video.id, {
      author: commenterName.trim() || 'طالب فاهم',
      role: 'student',
      text: newCommentText.trim(),
      timestampSeconds: includeTimestampInComment ? currentSeconds : undefined
    });
    setNewCommentText('');
  };

  const handleSelectQuizAnswer = (qId: string, optionIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    setShowExplanation(prev => ({ ...prev, [qId]: true }));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Auto-switch default tab if no steps exist
  useEffect(() => {
    if (video.type === 'explanation' && (!video.solutionSteps || video.solutionSteps.length === 0)) {
      setActiveTab('timestamps');
    } else {
      setActiveTab('steps');
    }
  }, [video.id]);

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 pb-20">
      {/* Top Header & Breadcrumbs */}
      <div className="border-b border-slate-800 bg-slate-900/80 px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowRight className="h-4 w-4" />
              <span>العودة للمكتبة</span>
            </button>

            {/* Breadcrumbs */}
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
              <span className="text-cyan-400 font-medium">{video.subject}</span>
              <span aria-hidden="true" className="text-slate-600">/</span>
              <span className="truncate max-w-[200px]">{video.unit}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="نسخ رابط الدرس"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copiedLink ? 'تم النسخ' : 'مشاركة'}</span>
            </button>

            <button
              onClick={(e) => onToggleBookmark(video.id, e)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'border border-slate-700/80 bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5 fill-current" />
              <span>{isBookmarked ? 'محفوظ' : 'حفظ المسألة'}</span>
            </button>

            <button
              onClick={() => onToggleCompleted(video.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'border border-slate-700/80 bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{isCompleted ? 'تم الإنجاز ✓' : 'تحديد كمكتمل'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Stage: Player & Info (Col 8) */}
          <div className="lg:col-span-8 flex flex-col space-y-6">
            
            {/* The Video Container */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-2xl">
              {isYouTube && youtubeId ? (
                <iframe
                  ref={iframeRef}
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&enablejsapi=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              ) : (
                <video
                  ref={videoRef}
                  src={video.videoUrl}
                  controls
                  onTimeUpdate={handleTimeUpdate}
                  poster={video.thumbnailUrl}
                  className="h-full w-full object-contain"
                >
                  متصفحك لا يدعم تشغيل هذا الفيديو.
                </video>
              )}
            </div>

            {/* Video Title and Primary Details */}
            <div className="flex flex-col space-y-3">
              {/* Unboxed Metadata Line */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-cyan-400">{video.subject}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{video.grade}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="h-3 w-3 text-slate-400" />
                  {video.duration}
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{video.type === 'explanation' ? 'فيديو شرح مفاهيم' : 'حل تمارين ومسائل'}</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {video.title}
              </h1>

              {/* Instructor Lockup */}
              <div className="flex items-center justify-between py-2 border-y border-slate-800 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400 text-sm">
                    {video.instructor.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-200">{video.instructor.name}</h2>
                    <p className="text-slate-400 text-[11px]">{video.instructor.title}</p>
                  </div>
                </div>
                <div className="text-slate-400 font-mono text-[11px]">
                  {video.viewsCount.toLocaleString('ar-EG')} مشاهدة
                </div>
              </div>

              {/* Description & Key Takeaways */}
              <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 space-y-3">
                <p className="text-sm text-slate-300 leading-relaxed">
                  {video.description}
                </p>

                {video.keyTakeaways && video.keyTakeaways.length > 0 && (
                  <div className="pt-3 border-t border-slate-800/80">
                    <h2 className="text-xs font-semibold text-cyan-400 mb-2">
                      أهم القوانين والنقاط الذهبية في هذا الدرس:
                    </h2>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {video.keyTakeaways.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-cyan-500 font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Attachments Section */}
            {video.attachments && video.attachments.length > 0 && (
              <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
                <h2 className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-cyan-400" />
                  المذكرات وملفات الحلول المرفقة:
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {video.attachments.map((att) => (
                    <a
                      key={att.id}
                      href={att.url}
                      download
                      onClick={(e) => {
                        if (att.url === '#') {
                          e.preventDefault();
                          alert('تم حفظ مذكرة الدرس في جلسة المذاكرة');
                        }
                      }}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900/90 hover:border-cyan-500/50 transition-colors text-xs text-slate-200 group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="h-4 w-4 text-cyan-400 shrink-0" />
                        <span className="truncate group-hover:text-cyan-300 font-medium">{att.title}</span>
                      </div>
                      {att.size && (
                        <span className="text-[11px] text-slate-500 font-mono shrink-0 mr-2">
                          {att.size}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Interactive Learning Deck (Col 4) */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            
            {/* Segmented Control Tabs */}
            <div className="flex items-center p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto">
              {video.solutionSteps && video.solutionSteps.length > 0 && (
                <button
                  onClick={() => setActiveTab('steps')}
                  className={`flex-1 min-w-[70px] py-1.5 px-2 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === 'steps'
                      ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ListOrdered className="h-3.5 w-3.5" />
                  <span>خطوات الحل</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('timestamps')}
                className={`flex-1 min-w-[70px] py-1.5 px-2 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                  activeTab === 'timestamps'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>الفهرس</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex-1 min-w-[70px] py-1.5 px-2 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                  activeTab === 'quiz'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>تدرب</span>
                {video.practiceQuestions && video.practiceQuestions.length > 0 && (
                  <span className="font-mono text-[10px]">({video.practiceQuestions.length})</span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 min-w-[70px] py-1.5 px-2 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                  activeTab === 'notes'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>ملاحظاتي</span>
                {currentVideoNotes.length > 0 && (
                  <span className="font-mono text-[10px]">({currentVideoNotes.length})</span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('discussion')}
                className={`flex-1 min-w-[70px] py-1.5 px-2 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                  activeTab === 'discussion'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>الأسئلة</span>
              </button>
            </div>

            {/* Tab 1: Step-by-Step Solution Breakdown */}
            {activeTab === 'steps' && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <h2 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <ListOrdered className="h-4 w-4 text-cyan-400" />
                    خطوات الحل النموذجية الموثقة:
                  </h2>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {video.solutionSteps?.length || 0} مراحل
                  </span>
                </div>

                {video.solutionSteps && video.solutionSteps.length > 0 ? (
                  <div className="space-y-3.5">
                    {video.solutionSteps.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="rounded-lg border border-slate-800/90 bg-slate-900/90 p-3.5 space-y-2 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 text-xs font-mono font-bold">
                            {step.stepNumber}
                          </span>
                          <h3 className="text-xs font-semibold text-slate-100">
                            {step.title}
                          </h3>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed pr-7">
                          {step.explanation}
                        </p>

                        {step.formulaOrWork && (
                          <div className="mr-7 rounded bg-slate-950 p-2 border border-slate-800 text-xs font-mono text-cyan-300 whitespace-pre-wrap direction-ltr text-left">
                            {step.formulaOrWork}
                          </div>
                        )}

                        {step.tip && (
                          <div className="mr-7 text-[11px] text-amber-300/90 bg-amber-950/30 p-2 rounded border border-amber-900/40">
                            💡 {step.tip}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-slate-400">
                    هذا الفيديو عبارة عن شرح مفاهيم ونظري. يمكنك تصفح الفهرس أو الملاحظات.
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Timestamps / Interactive Chapters */}
            {activeTab === 'timestamps' && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <h2 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-cyan-400" />
                    فهرس الدقائق (انقر للانتقال):
                  </h2>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {video.timestamps?.length || 0} فصول
                  </span>
                </div>

                <div className="space-y-1.5">
                  {video.timestamps && video.timestamps.length > 0 ? (
                    video.timestamps.map((chapter) => (
                      <button
                        key={chapter.id}
                        onClick={() => handleSeek(chapter.timeSeconds)}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg border border-transparent hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800/80 transition-colors text-right cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Play className="h-3 w-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          <span className="text-xs text-slate-200 group-hover:text-cyan-300 font-medium truncate">
                            {chapter.title}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-cyan-400/90 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 shrink-0 mr-2">
                          {chapter.formattedTime}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400">
                      لا توجد فصول مخصصة لهذا الفيديو حالياً.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Interactive Practice / Quiz */}
            {activeTab === 'quiz' && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <h2 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4 text-cyan-400" />
                    تدرب بنفسك واختبر فهمك للدرس:
                  </h2>
                </div>

                {video.practiceQuestions && video.practiceQuestions.length > 0 ? (
                  <div className="space-y-4">
                    {video.practiceQuestions.map((q, qIndex) => {
                      const selectedAnswer = quizAnswers[q.id];
                      const isAnswered = selectedAnswer !== undefined;
                      const isCorrect = selectedAnswer === q.correctOptionIndex;

                      return (
                        <div key={q.id} className="rounded-lg border border-slate-800 bg-slate-900/90 p-3.5 space-y-3">
                          <div className="text-xs font-semibold text-slate-100 leading-relaxed">
                            <span className="text-cyan-400 ml-1.5">س{qIndex + 1}:</span>
                            {q.questionText}
                          </div>

                          <div className="space-y-2">
                            {q.options.map((option, optIdx) => {
                              let optionStyle = 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700';
                              
                              if (isAnswered) {
                                if (optIdx === q.correctOptionIndex) {
                                  optionStyle = 'border-emerald-600 bg-emerald-950/40 text-emerald-200 font-semibold';
                                } else if (optIdx === selectedAnswer) {
                                  optionStyle = 'border-rose-600 bg-rose-950/40 text-rose-200';
                                } else {
                                  optionStyle = 'border-slate-850 bg-slate-950/50 text-slate-500 opacity-60';
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  disabled={isAnswered}
                                  onClick={() => handleSelectQuizAnswer(q.id, optIdx)}
                                  className={`w-full text-right p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between cursor-pointer ${optionStyle}`}
                                >
                                  <span>{option}</span>
                                  {isAnswered && optIdx === q.correctOptionIndex && (
                                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                                  )}
                                  {isAnswered && optIdx === selectedAnswer && !isCorrect && (
                                    <X className="h-4 w-4 text-rose-400 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {showExplanation[q.id] && (
                            <div className={`p-2.5 rounded text-xs leading-relaxed border ${
                              isCorrect 
                                ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' 
                                : 'bg-amber-950/20 border-amber-800/40 text-amber-300'
                            }`}>
                              <span className="font-semibold block mb-1">
                                {isCorrect ? 'إجابة صحيحة! أحسنت' : 'توضيح الحل:'}
                              </span>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-slate-400">
                    لم تتم إضافة أسئلة تدريب تفاعلية لهذا الدرس بعد.
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Student Timestamped Notes */}
            {activeTab === 'notes' && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <h2 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-cyan-400" />
                    ملاحظاتك ومسودتك الشخصية:
                  </h2>
                </div>

                {/* Add new note form */}
                <form onSubmit={handleCreateNote} className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>تدوين ملاحظة عند التوقيت الحالي:</span>
                    <button
                      type="button"
                      onClick={() => handleSeek(currentSeconds)}
                      className="font-mono text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
                    >
                      {formatTime(currentSeconds)}
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="اكتب ملاحظتك (مثال: فكرة القانون ده بتيجي في اختر كتير، ركز في التحويلات)..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!newNoteText.trim()}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-cyan-600 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>حفظ الملاحظة</span>
                  </button>
                </form>

                {/* Notes List */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  {currentVideoNotes.length > 0 ? (
                    currentVideoNotes.map((note) => (
                      <div
                        key={note.id}
                        className="rounded-lg border border-slate-800 bg-slate-900/90 p-3 space-y-1.5 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => handleSeek(note.timestampSeconds)}
                            className="font-mono text-[11px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Clock className="h-3 w-3" />
                            {note.formattedTime}
                          </button>
                          <button
                            onClick={() => onDeleteNote(note.id)}
                            className="text-slate-500 hover:text-rose-400 text-xs p-1 cursor-pointer"
                            title="حذف الملاحظة"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {note.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-500">
                      لا توجد ملاحظات مدونة لك في هذا الفيديو بعد.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 5: Discussion & Q&A */}
            {activeTab === 'discussion' && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <h2 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4 text-cyan-400" />
                    استفسارات الطلاب ونقاشات الدرس:
                  </h2>
                </div>

                {/* Add Comment Form */}
                <form onSubmit={handleCreateComment} className="space-y-2">
                  <input
                    type="text"
                    value={commenterName}
                    onChange={(e) => setCommenterName(e.target.value)}
                    placeholder="اسمك أو لقبك..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                  <textarea
                    rows={2}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="اكتب استفسارك للمعلم أو زملائك..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeTimestampInComment}
                        onChange={(e) => setIncludeTimestampInComment(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
                      />
                      <span>ربط بالساعة الحالية ({formatTime(currentSeconds)})</span>
                    </label>
                    <button
                      type="submit"
                      disabled={!newCommentText.trim()}
                      className="flex items-center gap-1 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <Send className="h-3 w-3" />
                      <span>إرسال</span>
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                  {video.comments && video.comments.length > 0 ? (
                    video.comments.map((comment) => (
                      <div key={comment.id} className="rounded-lg border border-slate-800 bg-slate-900/90 p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-200">{comment.author}</span>
                          <div className="flex items-center gap-2">
                            {comment.timestampSeconds !== undefined && (
                              <button
                                onClick={() => handleSeek(comment.timestampSeconds!)}
                                className="font-mono text-[10px] text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 hover:underline"
                              >
                                {formatTime(comment.timestampSeconds)}
                              </button>
                            )}
                            <span className="text-[10px] text-slate-500">{comment.date}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {comment.text}
                        </p>
                        {comment.reply && (
                          <div className="mt-2 rounded bg-cyan-950/30 border border-cyan-900/50 p-2 text-xs text-cyan-200 space-y-0.5">
                            <span className="font-semibold text-[11px] text-cyan-400 block">رد المعلم:</span>
                            <p>{comment.reply}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-500">
                      كن أول من يطرح سؤالاً في هذا الدرس!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Related Lessons in this playlist */}
            {relatedVideos.length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
                <h2 className="text-xs font-semibold text-slate-300">
                  فيديوهات أخرى في نفس الوحدة:
                </h2>
                <div className="space-y-2">
                  {relatedVideos.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectVideo(rel)}
                      className="flex items-center gap-3 p-2 rounded-lg border border-slate-800/80 bg-slate-900 hover:bg-slate-800/80 transition-colors cursor-pointer group"
                    >
                      <div className="relative aspect-video w-20 shrink-0 overflow-hidden rounded bg-slate-950">
                        {rel.thumbnailUrl ? (
                          <img
                            src={rel.thumbnailUrl}
                            alt={rel.title}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="h-full w-full bg-slate-800" />
                        )}
                        <span className="absolute bottom-0.5 left-0.5 bg-black/80 px-1 py-0.2 text-[9px] font-mono text-slate-300 rounded">
                          {rel.duration}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-cyan-400 block font-medium">
                          {rel.type === 'explanation' ? 'شرح' : 'حل مسائل'}
                        </span>
                        <h4 className="text-xs font-medium text-slate-200 group-hover:text-cyan-300 truncate">
                          {rel.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
