import React from 'react';
import { 
  Sparkles, 
  Atom, 
  Compass, 
  FlaskConical, 
  Dna, 
  Code, 
  BookMarked 
} from 'lucide-react';

interface SubjectBarProps {
  subjects: string[];
  selectedSubject: string;
  onSelectSubject: (subject: string) => void;
  videoCountsBySubject: Record<string, number>;
}

export const SubjectBar: React.FC<SubjectBarProps> = ({
  subjects,
  selectedSubject,
  onSelectSubject,
  videoCountsBySubject
}) => {
  const getSubjectIcon = (name: string) => {
    switch (name) {
      case 'الفيزياء': return <Atom className="h-4 w-4" />;
      case 'الرياضيات': return <Compass className="h-4 w-4" />;
      case 'الكيمياء': return <FlaskConical className="h-4 w-4" />;
      case 'الأحياء': return <Dna className="h-4 w-4" />;
      case 'البرمجة': 
      case 'البرمجة وعلوم الحاسب': return <Code className="h-4 w-4" />;
      default: return <BookMarked className="h-4 w-4" />;
    }
  };

  return (
    <div className="border-b border-slate-800 bg-[#0f172a]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap ml-2">
            المواد:
          </span>

          {/* All Subjects Option */}
          <button
            onClick={() => onSelectSubject('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              selectedSubject === 'all'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 bg-slate-900/60 border border-slate-800'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>جميع المواد</span>
          </button>

          {/* Individual Subjects */}
          {subjects.map((sub) => {
            const count = videoCountsBySubject[sub] || 0;
            const isSelected = selectedSubject === sub;

            return (
              <button
                key={sub}
                onClick={() => onSelectSubject(sub)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80 bg-slate-900/60 border border-slate-800'
                }`}
              >
                {getSubjectIcon(sub)}
                <span>{sub}</span>
                {count > 0 && (
                  <span className={`text-[10px] font-mono px-1 rounded ${
                    isSelected ? 'bg-slate-950/20 text-slate-900' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
