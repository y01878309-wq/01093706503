import React from 'react';
import { Play, Bookmark, Clock, CheckCircle2, GraduationCap, PenTool } from 'lucide-react';
import { VideoLesson } from '../types';

interface VideoCardProps {
  video: VideoLesson;
  onSelect: (video: VideoLesson) => void;
  isBookmarked: boolean;
  onToggleBookmark: (videoId: string, e: React.MouseEvent) => void;
  isCompleted: boolean;
  progressSeconds?: number;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onSelect,
  isBookmarked,
  onToggleBookmark,
  isCompleted,
  progressSeconds = 0
}) => {
  const percent = video.durationSeconds > 0 
    ? Math.min(100, Math.round((progressSeconds / video.durationSeconds) * 100))
    : 0;

  const isExplanation = video.type === 'explanation';

  const difficultyLabels = {
    easy: 'مستوى أساسي',
    medium: 'مستوى متوسط',
    hard: 'مستوى متقدم',
    genius: 'مسألة تفوق'
  };

  return (
    <article 
      onClick={() => onSelect(video)}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition-all duration-200 cursor-pointer"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
            {isExplanation ? (
              <GraduationCap className="h-12 w-12 text-cyan-500/40" />
            ) : (
              <PenTool className="h-12 w-12 text-amber-500/40" />
            )}
          </div>
        )}

        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Type Kicker in Corner */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 rounded bg-slate-950/80 backdrop-blur-md px-2 py-1 text-[11px] font-medium border border-slate-700/60">
          {isExplanation ? (
            <>
              <GraduationCap className="h-3 w-3 text-cyan-400" />
              <span className="text-cyan-300">شرح مفاهيم</span>
            </>
          ) : (
            <>
              <PenTool className="h-3 w-3 text-amber-400" />
              <span className="text-amber-300">حل تمارين</span>
            </>
          )}
        </div>

        {/* Bookmark Button */}
        <button
          onClick={(e) => onToggleBookmark(video.id, e)}
          className={`absolute top-2.5 left-2.5 p-1.5 rounded-lg backdrop-blur-md transition-colors cursor-pointer ${
            isBookmarked
              ? 'bg-cyan-500 text-slate-950'
              : 'bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
          title={isBookmarked ? 'إزالة من المحفوظات' : 'حفظ للمراجعة لاحقاً'}
        >
          <Bookmark className="h-3.5 w-3.5 fill-current" />
        </button>

        {/* Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-slate-950 shadow-lg transform group-hover:scale-110 transition-transform">
            <Play className="h-5 w-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/85 px-1.5 py-0.5 text-[11px] font-mono text-slate-200">
          <Clock className="h-3 w-3 text-slate-400" />
          <span>{video.duration}</span>
        </div>

        {/* Completed Indicator */}
        {isCompleted && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-black/80 px-2 py-0.5 rounded">
            <CheckCircle2 className="h-3 w-3" />
            <span>مكتمل</span>
          </div>
        )}

        {/* Progress Bar */}
        {percent > 0 && !isCompleted && (
          <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-800">
            <div 
              className="h-full bg-cyan-500 transition-all duration-300" 
              style={{ width: `${percent}%` }}
            />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-4 justify-between">
        <div>
          {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span className="font-medium text-cyan-400">{video.subject}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="truncate max-w-[140px]">{video.grade}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{difficultyLabels[video.difficulty]}</span>
          </div>

          {/* Title */}
          <h2 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
            {video.title}
          </h2>

          {/* Unit / Chapter */}
          <p className="mt-1 text-xs text-slate-400 line-clamp-1">
            {video.unit}
          </p>
        </div>

        {/* Footer: Instructor & Stats */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="truncate">{video.instructor.name}</span>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            {video.solutionSteps && video.solutionSteps.length > 0 && (
              <span>{video.solutionSteps.length} خطوات حل</span>
            )}
            {video.practiceQuestions && video.practiceQuestions.length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span>{video.practiceQuestions.length} تدريبات</span>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
