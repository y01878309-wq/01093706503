import React, { useState } from 'react';
import { ShieldAlert, KeyRound, CheckCircle2, MessageCircle, LogOut, ArrowRight } from 'lucide-react';
import { UserAccount } from '../types';

interface AccessGateScreenProps {
  currentUser: UserAccount;
  onActivateWithCode: (code: string) => boolean;
  onLogout: () => void;
  onSwitchToTeacherDemo: () => void;
}

export const AccessGateScreen: React.FC<AccessGateScreenProps> = ({
  currentUser,
  onActivateWithCode,
  onLogout,
  onSwitchToTeacherDemo
}) => {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!code.trim()) {
      setErrorMessage('يرجى إدخال كود التفعيل أو كلمة السر');
      return;
    }

    const success = onActivateWithCode(code.trim());
    if (success) {
      setIsSuccess(true);
    } else {
      setErrorMessage('الكود أو كلمة السر غير صحيحة. يرجى مراجعة المعلم للحصول على الكود المعتمد لحسابك.');
    }
  };

  const whatsappMessage = encodeURIComponent(
    `مرحباً يا أستاذنا، أنا الطالب: ${currentUser.name} (${currentUser.email})، قمت بتسجيل الدخول في المنصة وأنتظر تفعيل حسابي أو إرسال كود الوصول.`
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-amber-900/60 bg-gradient-to-b from-slate-900 via-[#0f172a] to-slate-950 p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6">
        
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              حسابك في انتظار تفعيل المعلم
            </h1>
            <p className="text-xs text-slate-400">
              مرحباً <strong className="text-slate-200">{currentUser.name}</strong> ({currentUser.email})
            </p>
          </div>
        </div>

        {/* Informational Box */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2 text-xs text-slate-300 leading-relaxed">
          <p>
            حفاظاً على حقوق المحتوى التعليمي والامتحانات الموقوتة، يتطلب النظام <strong className="text-cyan-400">موافقة المعلم المشرف</strong> أو إدخال <strong className="text-amber-400">كود التفعيل / كلمة السر</strong> التي يرسلها لك المعلم لتفعيل اشتراكك فوراً.
          </p>
          <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5 border-t border-slate-800">
            <span>💡 كودك المسجل في النظام:</span>
            <code className="text-amber-300 font-mono font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {currentUser.accessCode}
            </code>
            <span className="text-slate-500 text-[10px]">(إذا قام المعلم باعتماده، أدخله بالأسفل)</span>
          </div>
        </div>

        {/* Enter Code / Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="h-4 w-4 text-cyan-400" />
                أدخل كود التفعيل أو كلمة السر الخاصة بك:
              </span>
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setErrorMessage('');
              }}
              placeholder={`أدخل الكود مثل: ${currentUser.accessCode}`}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 px-4 text-center font-mono text-sm tracking-wider text-cyan-300 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-xs text-rose-300">
              {errorMessage}
            </div>
          )}

          {isSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>تم تفعيل حسابك بنجاح! جاري فتح المنصة...</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <KeyRound className="h-4 w-4" />
            <span>تفعيل الحساب والبدء في المذاكرة</span>
          </button>
        </form>

        {/* Contact Teacher CTA */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <div className="text-center text-xs text-slate-400">
            لم تتلق الكود بعد؟ تواصل مع المعلم فوراً:
          </div>
          
          <a
            href={`https://wa.me/?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl border border-emerald-800/60 bg-emerald-950/30 hover:bg-emerald-900/40 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="h-4 w-4 text-emerald-400" />
            <span>إرسال رسالة للمعلم عبر واتساب للحصول على الكود</span>
          </a>

          {/* Quick Demo Switcher & Logout */}
          <div className="flex items-center justify-between pt-2 text-xs">
            <button
              onClick={onSwitchToTeacherDemo}
              className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer text-[11px]"
            >
              <span>التبديل لحساب المعلم لمعاينة إدارة الأكواد والاعتماد</span>
              <ArrowRight className="h-3 w-3" />
            </button>

            <button
              onClick={onLogout}
              className="text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer text-[11px]"
            >
              <LogOut className="h-3 w-3" />
              <span>تسجيل خروج</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
