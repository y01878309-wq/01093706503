import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Link as LinkIcon, 
  Film, 
  GraduationCap, 
  PenTool, 
  Clock, 
  ListOrdered, 
  FileText, 
  Plus, 
  Trash2, 
  Check, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { DifficultyLevel, VideoLesson, VideoType, TimestampChapter, SolutionStep } from '../types';
import { extractYouTubeId, formatTime, parseTimestampLines } from '../utils/video';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveVideo: (newVideo: VideoLesson) => void;
  existingSubjects: string[];
}

export const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isOpen,
  onClose,
  onSaveVideo,
  existingSubjects
}) => {
  if (!isOpen) return null;

  // Source selection: 'file' or 'link'
  const [sourceMode, setSourceMode] = useState<'link' | 'file'>('link');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileBlobUrl, setFileBlobUrl] = useState<string>('');
  
  // Basic info
  const [title, setTitle] = useState('');
  const [type, setType] = useState<VideoType>('explanation');
  const [subject, setSubject] = useState(existingSubjects[0] || 'الفيزياء');
  const [customSubject, setCustomSubject] = useState('');
  const [isAddingNewSubject, setIsAddingNewSubject] = useState(false);
  const [grade, setGrade] = useState('الثانوية العامة (الصف الثالث الثانوي)');
  const [unit, setUnit] = useState('الوحدة الأولى: المفاهيم والتطبيقات');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [description, setDescription] = useState('');
  const [instructorName, setInstructorName] = useState('أ. المعلم المتميز');
  const [instructorTitle, setInstructorTitle] = useState('مدرس المادة ومعد المذكرات');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState('15:00');
  const [durationSeconds, setDurationSeconds] = useState(900);

  // Advanced builders
  const [rawTimestampsText, setRawTimestampsText] = useState('00:00 - المقدمة والهدف\n03:20 - الفكرة الأساسية\n08:45 - التطبيق العملي');
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>(['فهم أساس القانون بدقة', 'مراعاة الإشارات والتحويلات الهندسية']);
  const [newTakeaway, setNewTakeaway] = useState('');

  // Solution Steps (especially for problem solving)
  const [solutionSteps, setSolutionSteps] = useState<SolutionStep[]>([
    {
      stepNumber: 1,
      title: 'استخراج المعطيات وتحديد المطلوب',
      explanation: 'قراءة نص المسألة بعناية وتفريغ المعطيات مع توحيد وحدات القياس.',
      formulaOrWork: 'v = 0, a = 9.8 m/s², t = 3s'
    },
    {
      stepNumber: 2,
      title: 'اختيار وتطبيق القانون الرياضي المناسب',
      explanation: 'التعويض في معادلة الحركة المناسبة للوصول إلى الناتج النهائي.',
      formulaOrWork: 'd = v_i · t + ½ a t²'
    }
  ]);

  // Attachments
  const [pdfTitle, setPdfTitle] = useState('مذكرة الشرح وحلول المسائل PDF');
  const [pdfUrl, setPdfUrl] = useState('#');

  // Interactive Question
  const [hasQuiz, setHasQuiz] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState('ما هي الوحدة الفيزيائية الصحيحة في هذا القانون؟');
  const [quizOption1, setQuizOption1] = useState('جول (Joule)');
  const [quizOption2, setQuizOption2] = useState('واط (Watt)');
  const [quizOption3, setQuizOption3] = useState('نيوتن (Newton)');
  const [quizOption4, setQuizOption4] = useState('فولت (Volt)');
  const [quizCorrectIndex, setQuizCorrectIndex] = useState(0);
  const [quizExplanation, setQuizExplanation] = useState('لأن الشغل أو الطاقة تقاس دائماً بوحدة الجول في النظام الدولي.');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setFileBlobUrl(url);

      // Auto detect title from filename
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName);
      }

      // Try detecting duration from video tag
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.src = url;
      tempVideo.onloadedmetadata = () => {
        const secs = Math.floor(tempVideo.duration);
        setDurationSeconds(secs);
        setDuration(formatTime(secs));
      };
    }
  };

  // Auto detect YouTube thumbnail if user enters YouTube URL
  const handleUrlChange = (val: string) => {
    setVideoUrl(val);
    const ytId = extractYouTubeId(val);
    if (ytId && !thumbnailUrl) {
      setThumbnailUrl(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
    }
  };

  const handleAddTakeaway = () => {
    if (newTakeaway.trim()) {
      setKeyTakeaways([...keyTakeaways, newTakeaway.trim()]);
      setNewTakeaway('');
    }
  };

  const handleRemoveTakeaway = (index: number) => {
    setKeyTakeaways(keyTakeaways.filter((_, i) => i !== index));
  };

  const handleAddStep = () => {
    const nextStepNum = solutionSteps.length + 1;
    setSolutionSteps([
      ...solutionSteps,
      {
        stepNumber: nextStepNum,
        title: `الخطوة ${nextStepNum}: تفصيل الحسابات`,
        explanation: 'شرح الخطوة للمتعلم وطريقة الوصول للناتج.',
        formulaOrWork: ''
      }
    ]);
  };

  const handleUpdateStep = (index: number, field: keyof SolutionStep, value: any) => {
    const updated = [...solutionSteps];
    updated[index] = { ...updated[index], [field]: value };
    setSolutionSteps(updated);
  };

  const handleRemoveStep = (index: number) => {
    const filtered = solutionSteps.filter((_, i) => i !== index);
    const renumbered = filtered.map((step, idx) => ({ ...step, stepNumber: idx + 1 }));
    setSolutionSteps(renumbered);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalVideoUrl = sourceMode === 'file' ? fileBlobUrl : videoUrl.trim();
    if (!finalVideoUrl) {
      alert('يرجى تحديد ملف فيديو أو إدخال رابط يوتيوب/فيديو صحيح.');
      return;
    }

    if (!title.trim()) {
      alert('يرجى كتابة عنوان الدرس.');
      return;
    }

    const finalSubject = isAddingNewSubject && customSubject.trim() ? customSubject.trim() : subject;
    const finalSubjectId = finalSubject.toLowerCase().replace(/\s+/g, '-');

    // Parse timestamps
    const timestamps = parseTimestampLines(rawTimestampsText);

    // Optional quiz question
    const practiceQuestions = hasQuiz ? [
      {
        id: `q-${Date.now()}`,
        questionText: quizQuestion,
        options: [quizOption1, quizOption2, quizOption3, quizOption4],
        correctOptionIndex: quizCorrectIndex,
        explanation: quizExplanation
      }
    ] : [];

    // Optional attachment
    const attachments = pdfTitle.trim() ? [
      {
        id: `att-${Date.now()}`,
        title: pdfTitle.trim(),
        type: 'pdf' as const,
        url: pdfUrl.trim() || '#',
        size: '2.1 MB'
      }
    ] : [];

    const newLesson: VideoLesson = {
      id: `lesson-${Date.now()}`,
      title: title.trim(),
      type,
      subject: finalSubject,
      subjectId: finalSubjectId,
      grade: grade.trim(),
      unit: unit.trim(),
      videoSourceType: sourceMode === 'file' ? 'upload' : (extractYouTubeId(finalVideoUrl) ? 'youtube' : 'url'),
      videoUrl: finalVideoUrl,
      thumbnailUrl: thumbnailUrl.trim() || (type === 'explanation' ? '/src/assets/images/hero_education_platform_1790682800091.jpg' : '/src/assets/images/course_math_solutions_1790682815626.jpg'),
      duration,
      durationSeconds,
      difficulty,
      description: description.trim() || `فيديو ${type === 'explanation' ? 'شرح مفصل' : 'حل تمارين ومسائل'} في مادة ${finalSubject}`,
      instructor: {
        name: instructorName.trim(),
        title: instructorTitle.trim()
      },
      timestamps,
      keyTakeaways: keyTakeaways.filter(Boolean),
      solutionSteps: type === 'problem-solving' || solutionSteps.length > 0 ? solutionSteps : undefined,
      attachments,
      practiceQuestions,
      comments: [],
      viewsCount: 1,
      likesCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      isFeatured: false
    };

    onSaveVideo(newLesson);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-800 bg-[#0f172a] shadow-2xl text-slate-100 overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <Film className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">إضافة ونشر فيديو تعليمي جديد</h2>
              <p className="text-xs text-slate-400 mt-0.5">ارفع شروحاتك النظرية أو حلول التمارين مع خطوات الحل والمذكرات</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* 1. Video Source Picker */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">1. مصدر الفيديو:</span>
              
              {/* Source Mode Toggle */}
              <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => setSourceMode('link')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    sourceMode === 'link' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  <span>رابط يوتيوب / ويب</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSourceMode('file')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    sourceMode === 'file' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>رفع ملف من جهازك</span>
                </button>
              </div>
            </div>

            {sourceMode === 'link' ? (
              <div className="space-y-2">
                <input
                  type="url"
                  required={sourceMode === 'link'}
                  value={videoUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... أو رابط مباشر لمقطع MP4"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400">
                  يدعم فيديوهات يوتيوب العادية، روابط المشاركة القصيرة (youtu.be)، أو روابط ملفات MP4 المباشرة.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl bg-slate-900/60 hover:bg-slate-900 cursor-pointer transition-colors text-center"
                >
                  <Upload className="h-8 w-8 text-cyan-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-200">
                    {uploadedFile ? uploadedFile.name : 'انقر لاختيار ملف فيديو من جهازك'}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    يدعم MP4, WebM, MOV (تشغيل محلي سلس فوراً)
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* 2. Video Classification: Type & Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Video Type: Explanation vs Problem-Solving */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-200 block">
                2. نوع المحتوى التعليمي:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('explanation')}
                  className={`p-3 rounded-xl border text-right transition-colors cursor-pointer flex flex-col justify-between ${
                    type === 'explanation'
                      ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                      : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <GraduationCap className={`h-5 w-5 ${type === 'explanation' ? 'text-cyan-400' : 'text-slate-400'}`} />
                    {type === 'explanation' && <Check className="h-4 w-4 text-cyan-400" />}
                  </div>
                  <span className="text-xs font-bold block">فيديو شرح مفاهيم</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">تأسيس نظري، خرائط ذهنية وقوانين</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('problem-solving')}
                  className={`p-3 rounded-xl border text-right transition-colors cursor-pointer flex flex-col justify-between ${
                    type === 'problem-solving'
                      ? 'border-amber-500 bg-amber-950/40 text-amber-200'
                      : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <PenTool className={`h-5 w-5 ${type === 'problem-solving' ? 'text-amber-400' : 'text-slate-400'}`} />
                    {type === 'problem-solving' && <Check className="h-4 w-4 text-amber-400" />}
                  </div>
                  <span className="text-xs font-bold block">حل تمارين ومسائل</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">مسائل امتحانات وخطوات حل نموذجية</span>
                </button>
              </div>
            </div>

            {/* Subject Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200">
                  المادة الدراسية:
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingNewSubject(!isAddingNewSubject)}
                  className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                >
                  {isAddingNewSubject ? 'اختيار من القائمة' : '+ مادة جديدة'}
                </button>
              </div>

              {isAddingNewSubject ? (
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="اسم المادة الجديدة (مثال: الجيولوجيا، الإحصاء)..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              ) : (
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                >
                  {existingSubjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                  <option value="الفيزياء">الفيزياء</option>
                  <option value="الرياضيات">الرياضيات</option>
                  <option value="الكيمياء">الكيمياء</option>
                  <option value="الأحياء">الأحياء</option>
                  <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
                  <option value="البرمجة">البرمجة وعلوم الحاسب</option>
                </select>
              )}
            </div>

          </div>

          {/* 3. Title & Core Details */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 block">
                عنوان الدرس أو المسألة: *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: شرح قانون أوم للدائرة المغلقة بالتفصيل، أو حل 10 مسائل وزارية صعبة..."
                className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 block">الصف الدراسي:</label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="الصف الثالث الثانوي..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 block">الوحدة أو الباب:</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="الوحدة الأولى: الكهربية..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 block">مستوى الصعوبة:</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="easy">مستوى أساسي (سهل)</option>
                  <option value="medium">مستوى متوسط</option>
                  <option value="hard">مستوى متقدم (امتحانات)</option>
                  <option value="genius">مسائل تفوق وأولمبياد</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 block">
                وصف الدرس والنقاط المستفادة:
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="نبذة عما يتعلمه الطالب في هذا الفيديو وكيفية الاستفادة منه في الامتحان..."
                className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 4. Instructor & Meta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-300 block">اسم المعلم:</label>
              <input
                type="text"
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 block">مدة الفيديو التقديرية (دقيقة:ثانية):</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="24:15"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 block">رابط صورة الغلاف (اختياري):</label>
              <input
                type="text"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="رابط صورة مخصصة أو يترك افتراضياً"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 5. Video Chapters / Timestamps */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-2">
            <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span>فهرس وتوقيتات الفيديو (سطر لكل مقطع):</span>
              <span className="text-[11px] text-cyan-400 font-normal">صيغة: 00:00 - اسم المقطع</span>
            </label>
            <textarea
              rows={3}
              value={rawTimestampsText}
              onChange={(e) => setRawTimestampsText(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-xs font-mono text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* 6. Step-by-Step Solution Breakdown (Crucial for problem solving) */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ListOrdered className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-semibold text-slate-200">
                  خطوات الحل النموذجية الموثقة (تظهر بجانب الفيديو):
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddStep}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-700 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>إضافة خطوة</span>
              </button>
            </div>

            <div className="space-y-3">
              {solutionSteps.map((step, idx) => (
                <div key={idx} className="rounded-lg border border-slate-800 bg-slate-900 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-cyan-400">
                      الخطوة {step.stepNumber}:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => handleUpdateStep(idx, 'title', e.target.value)}
                    placeholder="عنوان الخطوة (مثال: تطبيق قانون كيرشوف الأول على العقدة)..."
                    className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                  <textarea
                    rows={1}
                    value={step.explanation}
                    onChange={(e) => handleUpdateStep(idx, 'explanation', e.target.value)}
                    placeholder="شرح الخطوة..."
                    className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={step.formulaOrWork || ''}
                    onChange={(e) => handleUpdateStep(idx, 'formulaOrWork', e.target.value)}
                    placeholder="القانون أو التعويض الرياضي (اختياري)..."
                    className="w-full rounded border border-slate-700 bg-slate-950 p-1.5 text-xs font-mono text-cyan-300 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 7. Key Takeaways */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-3">
            <label className="text-xs font-semibold text-slate-200 block">
              القوانين الذهبية وأهم الملاحظات في هذا الدرس:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTakeaway}
                onChange={(e) => setNewTakeaway(e.target.value)}
                placeholder="أضف ملاحظة أو قانون مهم..."
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTakeaway}
                className="px-3 py-2 rounded-lg bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700 border border-slate-700 cursor-pointer"
              >
                إضافة
              </button>
            </div>
            <div className="space-y-1.5">
              {keyTakeaways.map((takeaway, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-900 text-xs text-slate-300">
                  <span>• {takeaway}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTakeaway(i)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 8. Attachment PDF */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-3">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-cyan-400" />
              مذكرة وملف حلول PDF مرفق:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={pdfTitle}
                onChange={(e) => setPdfTitle(e.target.value)}
                placeholder="عنوان المذكرة المرفقة..."
                className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
              <input
                type="text"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="رابط تحميل المذكرة (PDF)..."
                className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 9. Interactive Practice Quiz */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-semibold text-slate-200">
                  إرفاق سؤال تدريبي تفاعلي لاختبار فهم الطالب:
                </span>
              </div>
              <input
                type="checkbox"
                checked={hasQuiz}
                onChange={(e) => setHasQuiz(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0 cursor-pointer h-4 w-4"
              />
            </div>

            {hasQuiz && (
              <div className="space-y-3 pt-2">
                <input
                  type="text"
                  value={quizQuestion}
                  onChange={(e) => setQuizQuestion(e.target.value)}
                  placeholder="نص السؤال التدريبي..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOpt"
                      checked={quizCorrectIndex === 0}
                      onChange={() => setQuizCorrectIndex(0)}
                    />
                    <input
                      type="text"
                      value={quizOption1}
                      onChange={(e) => setQuizOption1(e.target.value)}
                      placeholder="الخيار أ"
                      className="w-full rounded border border-slate-700 bg-slate-900 p-1.5 text-xs text-slate-100"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOpt"
                      checked={quizCorrectIndex === 1}
                      onChange={() => setQuizCorrectIndex(1)}
                    />
                    <input
                      type="text"
                      value={quizOption2}
                      onChange={(e) => setQuizOption2(e.target.value)}
                      placeholder="الخيار ب"
                      className="w-full rounded border border-slate-700 bg-slate-900 p-1.5 text-xs text-slate-100"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOpt"
                      checked={quizCorrectIndex === 2}
                      onChange={() => setQuizCorrectIndex(2)}
                    />
                    <input
                      type="text"
                      value={quizOption3}
                      onChange={(e) => setQuizOption3(e.target.value)}
                      placeholder="الخيار ج"
                      className="w-full rounded border border-slate-700 bg-slate-900 p-1.5 text-xs text-slate-100"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOpt"
                      checked={quizCorrectIndex === 3}
                      onChange={() => setQuizCorrectIndex(3)}
                    />
                    <input
                      type="text"
                      value={quizOption4}
                      onChange={(e) => setQuizOption4(e.target.value)}
                      placeholder="الخيار د"
                      className="w-full rounded border border-slate-700 bg-slate-900 p-1.5 text-xs text-slate-100"
                    />
                  </div>
                </div>
                <input
                  type="text"
                  value={quizExplanation}
                  onChange={(e) => setQuizExplanation(e.target.value)}
                  placeholder="توضيح الإجابة الصحيحة للطلاب..."
                  className="w-full rounded border border-slate-700 bg-slate-900 p-1.5 text-xs text-slate-100"
                />
              </div>
            )}
          </div>

          {/* Form Actions Footer */}
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
              <span>نشر الفيديو في المنصة الآن</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
