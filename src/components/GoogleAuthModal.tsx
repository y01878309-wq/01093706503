import React, { useState } from 'react';
import { X, CheckCircle, ShieldAlert, Sparkles, User, Mail } from 'lucide-react';
import { UserAccount } from '../types';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  allUsers: UserAccount[];
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  allUsers
}) => {
  if (!isOpen) return null;

  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [phone, setPhone] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Quick switch demo accounts
  const teacherUser = allUsers.find(u => u.role === 'teacher') || allUsers[0];
  const approvedStudent = allUsers.find(u => u.role === 'student' && u.status === 'approved');
  const pendingStudent = allUsers.find(u => u.role === 'student' && u.status === 'pending');

  const handleSelectExisting = (user: UserAccount) => {
    onLoginSuccess(user);
    onClose();
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customName.trim()) return;

    // Check if user already exists
    const existing = allUsers.find(u => u.email.toLowerCase() === customEmail.trim().toLowerCase());
    if (existing) {
      onLoginSuccess(existing);
      onClose();
      return;
    }

    // New Google Sign-In user: created as 'pending' unless teacher email!
    const isTeacher = customEmail.trim().toLowerCase() === 'y01878309@gmail.com';
    const randomCode = `FAHEM-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: customName.trim(),
      email: customEmail.trim().toLowerCase(),
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80`,
      role: isTeacher ? 'teacher' : 'student',
      status: isTeacher ? 'approved' : 'pending', // Teacher approved immediately, student needs teacher approval or code!
      accessCode: randomCode,
      registeredAt: new Date().toISOString().split('T')[0],
      phone: phone.trim() || undefined,
      notes: 'مسجل جديد بحساب جوجل'
    };

    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-[#0f172a] shadow-2xl text-slate-100 overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            {/* Google Logo SVG */}
            <div className="h-7 w-7 rounded-full bg-white p-1 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.15z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.92H1.21v3.15C3.25 21.43 7.31 24 12 24z" />
                <path fill="#FBBC05" d="M5.32 14.28c-.24-.72-.37-1.49-.37-2.28s.13-1.56.37-2.28V6.57H1.21C.44 8.11 0 9.99 0 12s.44 3.89 1.21 5.43l4.11-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.57 1.21 6.57l4.11 3.15c.94-2.82 3.58-4.97 6.68-4.97z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">تسجيل الدخول باستخدام Google</h2>
              <p className="text-[11px] text-slate-400">للوصول للشروحات وحلول المسائل والامتحانات الموقوتة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Quick Profiles Switcher */}
          {!isCustomMode ? (
            <div className="space-y-4">
              <span className="text-xs text-slate-300 font-semibold block">
                اختر الحساب المسجل أو سجل بحساب جديد:
              </span>

              {/* Teacher Account */}
              {teacherUser && (
                <button
                  type="button"
                  onClick={() => handleSelectExisting(teacherUser)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-cyan-800/60 bg-cyan-950/30 hover:bg-cyan-900/40 text-right transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={teacherUser.avatar}
                      alt=""
                      className="h-10 w-10 rounded-full border border-cyan-500/40 object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                          {teacherUser.name}
                        </span>
                        <span className="text-[10px] bg-cyan-500 text-slate-950 px-1.5 py-0.2 rounded font-semibold">
                          معلم / أدمن
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        {teacherUser.email}
                      </span>
                    </div>
                  </div>
                  <CheckCircle className="h-4 w-4 text-cyan-400 opacity-0 group-hover:opacity-100" />
                </button>
              )}

              {/* Sample Approved Student */}
              {approvedStudent && (
                <button
                  type="button"
                  onClick={() => handleSelectExisting(approvedStudent)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-850 text-right transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={approvedStudent.avatar}
                      alt=""
                      className="h-10 w-10 rounded-full border border-slate-700 object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white group-hover:text-cyan-300">
                          {approvedStudent.name}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-medium">
                          (طالب معتمد ومفعل)
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        {approvedStudent.email}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    كود: {approvedStudent.accessCode}
                  </span>
                </button>
              )}

              {/* Sample Pending Student (Demonstrates the Teacher Approval Gate!) */}
              {pendingStudent && (
                <button
                  type="button"
                  onClick={() => handleSelectExisting(pendingStudent)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-amber-900/40 bg-amber-950/20 hover:bg-amber-900/30 text-right transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={pendingStudent.avatar}
                      alt=""
                      className="h-10 w-10 rounded-full border border-amber-700/50 object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white group-hover:text-amber-300">
                          {pendingStudent.name}
                        </span>
                        <span className="text-[10px] text-amber-400 font-medium">
                          (قيد انتظار موافقة المعلم)
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        {pendingStudent.email}
                      </span>
                    </div>
                  </div>
                  <ShieldAlert className="h-4 w-4 text-amber-400" />
                </button>
              )}

              {/* Button to enter custom Google account */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsCustomMode(true)}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-850 hover:bg-slate-800 text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="h-4 w-4 text-cyan-400" />
                  <span>تسجيل الدخول بحساب Google آخر جديد</span>
                </button>
              </div>
            </div>
          ) : (
            /* Custom Google Email Form */
            <form onSubmit={handleCustomGoogleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">
                  الاسم بالكامل (كما يظهر في Google): *
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="مثال: يوسف أحمد رضوان"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pr-9 pl-3 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">
                  بريد Google الإلكتروني (@gmail.com): *
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="student.name@gmail.com"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pr-9 pl-3 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none direction-ltr text-right"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 block">
                  رقم الواتساب للتواصل وإرسال الكود (اختياري):
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010XXXXXXXX"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs font-mono text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="rounded-lg bg-slate-900/80 p-3 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                💡 <strong className="text-slate-300">ملاحظة أمان المنصة:</strong> عند دخولك لأول مرة، سيتم إرسال طلبك للمعلم لاعتماده أو إرسال كلمة سر وكود التفعيل لك لفتح كامل محتوى المنصة والامتحانات.
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCustomMode(false)}
                  className="flex-1 py-2 px-3 rounded-lg border border-slate-700 bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  رجوع
                </button>
                <button
                  type="submit"
                  className="flex-2 py-2 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  متابعة وتسجيل الدخول
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
