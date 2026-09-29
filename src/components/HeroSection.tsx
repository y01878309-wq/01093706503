import React from 'react';
import { Search, GraduationCap, PenTool, Sparkles, X } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedType: 'all' | 'explanation' | 'problem-solving';
  onSelectType: (t: 'all' | 'explanation' | 'problem-solving') => void;
  totalVideosCount: number;
  explanationsCount: number;
  problemsCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onSelectType,
  totalVideosCount,
  explanationsCount,
  problemsCount
}) => {
  return (
    <div className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900/80 via-[#0b0f17] to-[#0b0f17] pt-8 pb-12">
      {/* Subtle radial glow */}
      <div className="absolute top-0 right-1/4 -z-10 h-72 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-12 left-1/3 -z-10 h-64 w-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Copy & Controls */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            {/* Context line with typographic separator */}
            <div className="flex items-center gap-2 text-xs font-medium text-cyan-400">
              <Sparkles className="h-4 w-4" />
              <span>منصة المعلم والطلاب الذكية</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">فيديوهات شرح مركزة ومسائل امتحانات محلولة خطوة بخطوة</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white text-balance leading-tight">
              تعلم المفهوم.. <br className="hidden sm:inline" />
              ثم أتقن <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">حل أصعب المسائل</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
              منصة متخصصة تتيح للمعلمين رفع وتنظيم حصص الشرح النظري وفيديوهات حل التمارين ونماذج الامتحانات، مصحوبة بخطوات الحل النموذجية، المذكرات، وبنك أسئلة تفاعلي.
            </p>

            {/* Interactive Search Input */}
            <div className="relative max-w-xl">
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث عن درس، قانون، مسألة، كيرشوف، اشتقاق، أكسدة..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-3 pr-11 pl-10 text-sm text-slate-100 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Segmented Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-400 ml-1">تصفية حسب المحتوى:</span>
              
              <button
                onClick={() => onSelectType('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedType === 'all'
                    ? 'bg-slate-100 text-slate-900 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>جميع الفيديوهات</span>
                <span className="text-[11px] opacity-75 font-mono">({totalVideosCount})</span>
              </button>

              <button
                onClick={() => onSelectType('explanation')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedType === 'explanation'
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                <span>فيديوهات الشرح والمفاهيم</span>
                <span className="text-[11px] opacity-75 font-mono">({explanationsCount})</span>
              </button>

              <button
                onClick={() => onSelectType('problem-solving')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedType === 'problem-solving'
                    ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <PenTool className="h-3.5 w-3.5" />
                <span>حل التمارين والمسائل</span>
                <span className="text-[11px] opacity-75 font-mono">({problemsCount})</span>
              </button>
            </div>
          </div>

          {/* Visual Showcase Frame */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl group">
              <img
                src="/src/assets/images/hero_education_platform_1790682800091.jpg"
                alt="بيئة تعليمية لشروحات وحلول المسائل"
                className="w-full h-64 sm:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <div className="absolute bottom-4 right-4 left-4 p-3 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">منهجية الفهم ثم الحل</h2>
                  <p className="text-xs text-slate-400 mt-0.5">مشاهدة الشرح مدعومة بخطوات الحل والمسائل المرتبطة</p>
                </div>
                <div className="text-left text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/50">
                  HD 1080p
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
