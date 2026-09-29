import React, { useState } from 'react';
import { Smartphone, Download, CheckCircle2, Store } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  onOpenPlayStoreGuide: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  onOpenPlayStoreGuide
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        {/* If installable (Android / Chrome) */}
        {isInstallable && !isInstalled && (
          <button
            onClick={install}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer animate-pulse"
            title="تثبيت المنصة كتطبيق مستقل على هاتفك"
          >
            <Smartphone className="h-4 w-4" />
            <span>تثبيت التطبيق على الهاتف</span>
          </button>
        )}

        {/* If iOS Safari */}
        {isIOS && !isInstalled && (
          <button
            onClick={() => setShowIOSGuide(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 hover:text-white text-xs font-medium cursor-pointer"
          >
            <Smartphone className="h-4 w-4 text-cyan-400" />
            <span>تثبيت على الآيفون</span>
          </button>
        )}

        {/* Play Store Guide Button */}
        <button
          onClick={onOpenPlayStoreGuide}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700/80 bg-slate-800/90 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          title="دليل نشر التطبيق على متجر Google Play"
        >
          <Store className="h-3.5 w-3.5 text-cyan-400" />
          <span className="hidden sm:inline">متجر بلاي</span>
        </button>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-[#0f172a] p-6 text-slate-100 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-cyan-400" />
              <span>طريقة تثبيت التطبيق على الآيفون:</span>
            </h3>
            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside pr-1 leading-relaxed">
              <li>اضغط على زر <strong>المشاركة (Share)</strong> في شريط متصفح Safari بالأسفل.</li>
              <li>مرر للأسفل واضغط على <strong>«إضافة إلى الصفحة الرئيسية (Add to Home Screen)»</strong>.</li>
              <li>اضغط <strong>إضافة (Add)</strong>، وسيظهر تطبيق المنصة فوراً على شاشة هاتفك!</li>
            </ol>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              تم، إغلاق
            </button>
          </div>
        </div>
      )}
    </>
  );
};
