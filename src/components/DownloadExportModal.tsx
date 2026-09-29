import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileArchive, 
  Database, 
  Upload, 
  Check, 
  ExternalLink, 
  Terminal, 
  FolderArchive,
  Sparkles,
  Info
} from 'lucide-react';
import { VideoLesson, TimedExam, UserAccount, ExamSubmission } from '../types';

interface DownloadExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos: VideoLesson[];
  exams: TimedExam[];
  users: UserAccount[];
  submissions: ExamSubmission[];
  onImportData: (importedData: any) => void;
}

export const DownloadExportModal: React.FC<DownloadExportModalProps> = ({
  isOpen,
  onClose,
  videos,
  exams,
  users,
  submissions,
  onImportData
}) => {
  if (!isOpen) return null;

  const [copiedScript, setCopiedScript] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Export full JSON database
  const handleExportJSON = () => {
    const fullBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      platform: 'منصة فاهم التعليمية',
      videos,
      exams,
      users,
      submissions
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `fahem-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON backup
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.videos || parsed.exams || parsed.users) {
          onImportData(parsed);
          setImportStatus('تم استيراد البيانات وتحديث المنصة بنجاح! ✓');
          setTimeout(() => setImportStatus(null), 4000);
        } else {
          alert('ملف النسخة الاحتياطية غير صالح.');
        }
      } catch (err) {
        alert('حدث خطأ أثناء قراءة ملف JSON.');
      }
    };
    reader.readAsText(file);
  };

  const terminalCommand = 'npm install && npm run dev';

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(terminalCommand);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-800 bg-[#0f172a] shadow-2xl text-slate-100 overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">مركز تحميل وتصدير ملفات المنصة</h2>
              <p className="text-xs text-slate-400 mt-0.5">نزّل الكود المصدري كاملاً بصيغة ZIP لتشغيله أو رفعه على أي استضافة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* PRIMARY OPTION: DOWNLOAD COMPLETE PROJECT ZIP */}
          <div className="rounded-2xl border border-cyan-600/60 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 p-6 space-y-4 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shrink-0">
                  <FileArchive className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    تحميل المشروع بالكامل كملف مضغوط (ZIP)
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    يحتوي الملف على الكود المصدري الكامل للمنصة، التصميم، جميع المكونات، الصور، الإعدادات، وملف التعليمات <code className="text-cyan-400 font-mono">README.md</code>.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-800 shrink-0">
                2.3 MB
              </span>
            </div>

            {/* Direct Download Button */}
            <div className="pt-2">
              <a
                href="/fahem-educational-platform.zip"
                download="fahem-educational-platform.zip"
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-xl transition-all cursor-pointer group"
              >
                <Download className="h-5 w-5 transform group-hover:-translate-y-0.5 transition-transform" />
                <span>تحميل ملف المنصة المضغوط الآن (fahem-educational-platform.zip)</span>
              </a>
            </div>
          </div>

          {/* HOW TO RUN LOCALLY GUIDE */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <span>خطوات تشغيل المنصة على جهازك بعد تحميلها:</span>
            </h4>

            <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside pr-2 leading-relaxed">
              <li>قم بفك ضغط ملف <code className="text-cyan-400 font-mono">fahem-educational-platform.zip</code> في أي مجلد تريده.</li>
              <li>تأكد من تثبيت برنامج <strong>Node.js</strong> على جهازك من الموقع الرسمي (<a href="https://nodejs.org" target="_blank" rel="noreferrer" className="text-cyan-400 underline">nodejs.org</a>).</li>
              <li>افتح مجلد المشروع في برنامج <strong>VS Code</strong> أو موجه الأوامر (Terminal / CMD).</li>
              <li>
                قم بنسخ وتشغيل الأمر التالي لتثبيت الحزم وبدء التشغيل:
                <div className="mt-1.5 flex items-center justify-between rounded-lg bg-slate-950 p-2.5 border border-slate-800 font-mono text-xs text-cyan-300">
                  <span>{terminalCommand}</span>
                  <button
                    onClick={handleCopyCommand}
                    className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900 text-[11px] cursor-pointer"
                  >
                    {copiedScript ? 'تم النسخ ✓' : 'نسخ الأمر'}
                  </button>
                </div>
              </li>
            </ol>
          </div>

          {/* SECONDARY OPTION: EXPORT & IMPORT DATABASE (JSON) */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-slate-200">
                  تصدير أو استيراد قاعدة بيانات المنصة (JSON):
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {videos.length} فيديوهات · {exams.length} امتحانات · {users.length} حسابات
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              يمكنك تنزيل نسخة احتياطية من جميع الفيديوهات، والأسئلة، والامتحانات، وأكواد تفعيل الطلاب المسجلة عندك، أو استيرادها في أي جهاز آخر.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleExportJSON}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                <Download className="h-4 w-4 text-cyan-400" />
                <span>تصدير نسخة احتياطية (JSON)</span>
              </button>

              <label className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer">
                <Upload className="h-4 w-4 text-amber-400" />
                <span>استيراد بيانات من ملف JSON</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>

            {importStatus && (
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300">
                {importStatus}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            جاهز للاستخدام والتطوير المحلي أو الرفع المباشر
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
