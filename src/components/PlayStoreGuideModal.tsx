import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  ExternalLink, 
  Copy, 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  Store, 
  Layers, 
  UploadCloud, 
  Sparkles,
  Download,
  ShieldCheck
} from 'lucide-react';

interface PlayStoreGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerInstall: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
}

export const PlayStoreGuideModal: React.FC<PlayStoreGuideModalProps> = ({
  isOpen,
  onClose,
  onTriggerInstall,
  isInstallable,
  isInstalled
}) => {
  if (!isOpen) return null;

  const [copiedUrl, setCopiedUrl] = useState(false);
  const appUrl = window.location.origin;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl border border-cyan-800/80 bg-[#0f172a] shadow-2xl text-slate-100 overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                دليل تشغيل المنصة كتطبيق ونشرها على متجر Google Play
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                طريقة التثبيت المباشر على الهاتف + خطوات تحويل المنصة لملف APK/AAB لمتجر بلاي
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* METHOD 1: INSTANT INSTALL ON PHONE (5 SECONDS) */}
          <div className="rounded-2xl border border-emerald-600/60 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 p-5 space-y-3 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>1. الطريقة الفورية: تثبيت المنصة كتطبيق على هاتفك الآن (بدون أي برامج!)</span>
                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.2 rounded-full">
                      أسرع طريقة
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    المنصة مجهزة بتقنية <strong>Progressive Web App (PWA)</strong> الرسمية من Google. يمكنك أنت وطلابك تثبيتها فوراً لتفتح كأيقونة تطبيق مستقل على شاشة الهاتف بدون شريط المتصفح:
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-300 block">📱 لهواتف أندرويد (Android):</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  افتح الرابط في متصفح Chrome، ثم اضغط على زر <strong>«تثبيت التطبيق»</strong> بالأسفل، أو من قائمة خيارات المتصفح (⋮) اضغط على <strong>«إضافة إلى الشاشة الرئيسية»</strong> أو <strong>«تثبيت التطبيق»</strong>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="font-bold text-cyan-300 block">🍏 لهواتف آيفون (iPhone / iPad):</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  افتح الرابط في Safari، اضغط على زر <strong>مشاركة (Share)</strong> بالأسفل، ثم اختر <strong>«إضافة إلى الصفحة الرئيسية (Add to Home Screen)»</strong>.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onTriggerInstall}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>{isInstalled ? 'التطبيق مثبت بالفعل على جهازك ✓' : 'اضغط هنا لتثبيت التطبيق على جهازك الآن'}</span>
              </button>
            </div>
          </div>

          {/* METHOD 2: PUBLISHING TO GOOGLE PLAY STORE */}
          <div className="rounded-2xl border border-cyan-800/80 bg-slate-900/90 p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Store className="h-5 w-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                2. خطوات نشر التطبيق على متجر جوجل بلاي (Google Play Store):
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              تحويل المنصة إلى ملف أندرويد <strong>(AAB / APK)</strong> جاهز للرفع على متجر جوجل بلاي يتم في 3 خطوات بسيطة ومجانية تماماً عن طريق أداة جوجل ومايكروسوفت الرسمية <strong>PWABuilder</strong>:
            </p>

            {/* Step 1 */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400">
                  الخطوة الأولى: نسخ رابط المنصة المباشر
                </span>
                <span className="text-[10px] text-slate-500 font-mono">الرابط الخاص بك</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="flex-1 rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs font-mono text-cyan-300 direction-ltr text-right"
                />
                <button
                  onClick={handleCopyUrl}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition-colors cursor-pointer shrink-0"
                >
                  {copiedUrl ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedUrl ? 'تم النسخ ✓' : 'نسخ الرابط'}</span>
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400">
                  الخطوة الثانية: توليد ملف الأندرويد (.aab / .apk) عبر PWABuilder
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">أداة مجانية 100%</span>
              </div>
              <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside pr-1 leading-relaxed">
                <li>افتح موقع <strong>PWABuilder</strong> (<a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-mono">pwabuilder.com</a>).</li>
                <li>ألصق رابط المنصة واضغط على <strong>Start</strong>.</li>
                <li>سيقوم بفحص الـ Manifest والأيقونات المجهزة في المنصة تلقائياً (النتيجة ستكون 100% نجاح).</li>
                <li>اضغط على <strong>«Package For Stores»</strong> واختر <strong>«Android (Google Play)»</strong>.</li>
                <li>اضغط <strong>Generate Package</strong>، وسيقوم بتحميل ملف مضغوط يحتوي على ملف <strong>`app-release.aab`</strong> و <strong>`assetlinks.json`</strong>!</li>
              </ol>

              <div className="pt-1">
                <a
                  href={`https://www.pwabuilder.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline"
                >
                  <span>فتح موقع PWABuilder الآن</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <span className="text-xs font-bold text-cyan-400 block">
                الخطوة الثالثة: الرفع على حساب Google Play Console
              </span>
              <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>ادخل إلى حسابك في <a href="https://play.google.com/console" target="_blank" rel="noreferrer" className="text-cyan-400 underline">Google Play Console</a> واضغط على <strong>«إنشاء تطبيق / Create App»</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>اكتب اسم التطبيق (مثال: <strong>منصة فاهم التعليمية</strong>) واختر لغة التطبيق والفئة (التعليم / Education).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>في قسم <strong>App Bundle</strong>، ارفع ملف <code className="text-cyan-300 font-mono">.aab</code> الذي قمت بتنزيله من الخطوة الثانية.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>اضغط على <strong>«إرسال للمراجعة / Send for Review»</strong>، وخلال أيام قليلة سيكون تطبيقك متاحاً لجميع الطلاب للتحميل المباشر من متجر Google Play!</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>المنصة متوافقة 100% مع معايير Google PWA & Play Store</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            فهمت، حسناً
          </button>
        </div>

      </div>
    </div>
  );
};
