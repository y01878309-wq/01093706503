import React from 'react';
import { Bookmark, ArrowRight, BookOpen } from 'lucide-react';
import { VideoLesson } from '../types';
import { VideoCard } from './VideoCard';

interface BookmarksViewProps {
  bookmarkedVideos: VideoLesson[];
  onSelectVideo: (v: VideoLesson) => void;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  completedVideoIds: string[];
  onBackToBrowse: () => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarkedVideos,
  onSelectVideo,
  onToggleBookmark,
  completedVideoIds,
  onBackToBrowse
}) => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToBrowse}
            className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="الرجوع للتصفح"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-cyan-400 fill-current" />
              <span>المسائل والشروحات المحفوظة للمراجعة</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              مجموعتك المخصصة من التمارين الصعبة والشروحات للرجوع إليها قبل الامتحانات
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-800/40">
          {bookmarkedVideos.length} محفوظات
        </span>
      </div>

      {bookmarkedVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onSelect={onSelectVideo}
              isBookmarked={true}
              onToggleBookmark={onToggleBookmark}
              isCompleted={completedVideoIds.includes(video.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8 space-y-4 max-w-md mx-auto">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400 mx-auto">
            <Bookmark className="h-6 w-6" />
          </div>
          <h2 className="text-base font-semibold text-slate-200">
            لم تقم بحفظ أي مسائل أو شروحات بعد
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            عند تصفحك للمكتبة أو أثناء مشاهدة فيديو، اضغط على أيقونة حفظ المسألة لتظهر هنا لمراجعتها في أي وقت.
          </p>
          <button
            onClick={onBackToBrowse}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors cursor-pointer"
          >
            <BookOpen className="h-4 w-4" />
            <span>تصفح المكتبة الآن</span>
          </button>
        </div>
      )}
    </div>
  );
};
