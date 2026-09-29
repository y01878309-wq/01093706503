import React from 'react';
import { 
  Video, 
  PlusCircle, 
  BookOpen, 
  GraduationCap, 
  PenTool, 
  LayoutDashboard, 
  Bookmark,
  Clock,
  User,
  LogOut,
  KeyRound,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { UserAccount } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentTab: 'browse' | 'explanation' | 'problem-solving' | 'exams' | 'dashboard' | 'bookmarks';
  onSelectTab: (tab: 'browse' | 'explanation' | 'problem-solving' | 'exams' | 'dashboard' | 'bookmarks') => void;
  onOpenUploadModal: () => void;
  onOpenDownloadModal: () => void;
  onOpenPlayStoreGuide: () => void;
  currentUser: UserAccount;
  onOpenGoogleAuth: () => void;
  onLogout: () => void;
  bookmarksCount: number;
  pendingApprovalsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenUploadModal,
  onOpenDownloadModal,
  onOpenPlayStoreGuide,
  currentUser,
  onOpenGoogleAuth,
  onLogout,
  bookmarksCount,
  pendingApprovalsCount
}) => {
  const isTeacher = currentUser.role === 'teacher';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0b0f17]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onSelectTab('browse')}
            className="flex items-center gap-2.5 text-right text-slate-100 hover:text-cyan-400 transition-colors cursor-pointer group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 group-hover:border-cyan-400 transition-colors">
              <Video className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                مـنصة فـاهم
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
          <button
            onClick={() => onSelectTab('browse')}
            className={`transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 py-1 ${
              currentTab === 'browse'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            المكتبة الشاملة
          </button>
          
          <button
            onClick={() => onSelectTab('explanation')}
            className={`transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 py-1 ${
              currentTab === 'explanation'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            فيديوهات الشرح
          </button>

          <button
            onClick={() => onSelectTab('problem-solving')}
            className={`transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 py-1 ${
              currentTab === 'problem-solving'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <PenTool className="h-4 w-4" />
            حل المسائل
          </button>

          {/* Timed Exams Tab */}
          <button
            onClick={() => onSelectTab('exams')}
            className={`transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 py-1 ${
              currentTab === 'exams'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Clock className="h-4 w-4 text-amber-400" />
            <span>امتحانات موقوتة</span>
          </button>

          <button
            onClick={() => onSelectTab('bookmarks')}
            className={`transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 py-1 ${
              currentTab === 'bookmarks'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            المحفوظات
            {bookmarksCount > 0 && (
              <span className="text-xs px-1.5 py-0.2 rounded bg-slate-800 text-cyan-400 font-mono">
                {bookmarksCount}
              </span>
            )}
          </button>

          {/* Teacher Studio Tab with pending badge */}
          {isTeacher && (
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 py-1 ${
                currentTab === 'dashboard'
                  ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>لوحة المعلم والأكواد</span>
              {pendingApprovalsCount > 0 && (
                <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full font-mono animate-pulse">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>
          )}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          
          {/* User Account / Google Login Pill */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenGoogleAuth}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-700/80 bg-slate-900/90 hover:bg-slate-850 transition-colors text-right cursor-pointer"
              title="التبديل أو تسجيل الدخول بحساب Google"
            >
              <div className="relative">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover border border-slate-700"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 text-xs font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                {isTeacher ? (
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-cyan-400 ring-2 ring-slate-900" />
                ) : currentUser.status === 'approved' ? (
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
                ) : (
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-slate-900" />
                )}
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-xs font-semibold text-slate-200 block truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {isTeacher ? 'المعلم (أدمن)' : currentUser.status === 'approved' ? 'طالب مفعل' : 'بانتظار الكود'}
                </span>
              </div>
            </button>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          {/* PWA Phone Install & Play Store Guide Buttons */}
          <PWAInstallButton onOpenPlayStoreGuide={onOpenPlayStoreGuide} />

          {/* Download Project ZIP Button */}
          <button
            onClick={onOpenDownloadModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-700/60 rounded-xl hover:bg-cyan-900/60 hover:text-white transition-colors cursor-pointer"
            title="تحميل كود المنصة كاملاً كملف مضغوط ZIP"
          >
            <Bookmark className="h-3.5 w-3.5 hidden" />
            <span className="text-[11px] font-mono">ZIP</span>
            <span className="hidden sm:inline">تحميل المنصة</span>
          </button>

          {/* Teacher Video Upload Button */}
          {isTeacher && (
            <button
              onClick={onOpenUploadModal}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-cyan-500 transition-colors whitespace-nowrap cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">رفع فيديو جديد</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
