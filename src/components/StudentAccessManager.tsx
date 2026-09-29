import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  KeyRound, 
  ShieldAlert, 
  Plus, 
  Copy, 
  Check, 
  MessageCircle, 
  Search, 
  Sparkles,
  Lock,
  Unlock,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { UserAccount } from '../types';

interface StudentAccessManagerProps {
  users: UserAccount[];
  onApproveUser: (userId: string) => void;
  onBlockUser: (userId: string) => void;
  onUpdateUserCode: (userId: string, newCode: string) => void;
  onAddPreApprovedUser: (newUser: Omit<UserAccount, 'id' | 'registeredAt'>) => void;
  onDeleteUser: (userId: string) => void;
}

export const StudentAccessManager: React.FC<StudentAccessManagerProps> = ({
  users,
  onApproveUser,
  onBlockUser,
  onUpdateUserCode,
  onAddPreApprovedUser,
  onDeleteUser
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'blocked'>('all');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Pre-approval modal or inline form state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentCode, setNewStudentCode] = useState(`FAHEM-${Math.floor(1000 + Math.random() * 9000)}`);
  const [newStudentNotes, setNewStudentNotes] = useState('');

  // Editing code inline
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [customCodeInput, setCustomCodeInput] = useState('');

  const students = users.filter(u => u.role === 'student');
  const pendingStudents = students.filter(s => s.status === 'pending');
  const approvedStudents = students.filter(s => s.status === 'approved');

  const filteredStudents = students.filter(s => {
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchesSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.accessCode.toLowerCase().includes(search.toLowerCase()) ||
      (s.phone && s.phone.includes(search));
    return matchesStatus && matchesSearch;
  });

  const handleCopyCode = (user: UserAccount) => {
    const message = `مرحباً يا ${user.name}، تم قبولك في منصة فاهم التعليمية.\nكود تفعيل حسابك هو: ${user.accessCode}\nرابط المنصة: ${window.location.origin}`;
    navigator.clipboard.writeText(message);
    setCopiedCodeId(user.id);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  const handlePreApproveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentEmail.trim()) return;

    onAddPreApprovedUser({
      name: newStudentName.trim(),
      email: newStudentEmail.trim().toLowerCase(),
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80`,
      role: 'student',
      status: 'approved',
      accessCode: newStudentCode.trim() || `FAHEM-${Math.floor(1000 + Math.random() * 9000)}`,
      approvedAt: new Date().toISOString().split('T')[0],
      phone: newStudentPhone.trim() || undefined,
      notes: newStudentNotes.trim() || 'تمت الإضافة والاعتماد المسبق بواسطة المعلم'
    });

    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentPhone('');
    setNewStudentNotes('');
    setNewStudentCode(`FAHEM-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsAddingNew(false);
  };

  const handleSaveEditedCode = (userId: string) => {
    if (!customCodeInput.trim()) return;
    onUpdateUserCode(userId, customCodeInput.trim());
    setEditingUserId(null);
    setCustomCodeInput('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <KeyRound className="h-4 w-4" />
            <span>نظام التحكم في قبول الطلاب وإصدار الأكواد</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            إدارة صلاحيات دخول الطلاب وكلمات السر
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            تحكم في من يدخل المنصة بحساب Google، اعتمد طلبات الانضمام، وأرسل أكواد التفعيل للطلاب
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-cyan-500 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة طالب مسبقاً بالإيميل والكود</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>إجمالي الطلاب المسجلين</span>
            <Users className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {students.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">حسابات Google مسجلة</span>
        </div>

        <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-4">
          <div className="flex items-center justify-between text-amber-400 text-xs mb-2">
            <span>طلبات في انتظار الموافقة والكود</span>
            <ShieldAlert className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300 tabular-nums">
            {pendingStudents.length}
          </div>
          <span className="text-[11px] text-amber-400/80 mt-1 block">يحتاجون إلى كود التفعيل أو الاعتماد</span>
        </div>

        <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4">
          <div className="flex items-center justify-between text-emerald-400 text-xs mb-2">
            <span>الطلاب المفعلين والمصرح لهم</span>
            <UserCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300 tabular-nums">
            {approvedStudents.length}
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">يمكنهم مشاهدة الدروس وأداء الامتحانات</span>
        </div>
      </div>

      {/* Pre-Approval Form Drawer */}
      {isAddingNew && (
        <form onSubmit={handlePreApproveSubmit} className="rounded-2xl border border-cyan-800/80 bg-slate-900/90 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              إضافة طالب مسبقاً وتعيين كلمة سر / كود دخول خاص به:
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              إغلاق
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 block">اسم الطالب بالكامل: *</label>
              <input
                type="text"
                required
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="مثال: يوسف أحمد رضوان"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 block">بريد Google للطالب: *</label>
              <input
                type="email"
                required
                value={newStudentEmail}
                onChange={(e) => setNewStudentEmail(e.target.value)}
                placeholder="student@gmail.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs font-mono text-slate-100 focus:border-cyan-500 focus:outline-none direction-ltr text-right"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 block">كود التفعيل / كلمة السر: *</label>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  required
                  value={newStudentCode}
                  onChange={(e) => setNewStudentCode(e.target.value)}
                  placeholder="FAHEM-2026"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs font-mono text-cyan-300 focus:border-cyan-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setNewStudentCode(`FAHEM-${Math.floor(1000 + Math.random() * 9000)}`)}
                  className="p-2 rounded bg-slate-800 text-slate-400 hover:text-white"
                  title="توليد كود عشوائي"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-300 block">رقم الواتساب (اختياري):</label>
              <input
                type="tel"
                value={newStudentPhone}
                onChange={(e) => setNewStudentPhone(e.target.value)}
                placeholder="01012345678"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs font-mono text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white"
            >
              حفظ واعتماد الطالب فوراً
            </button>
          </div>
        </form>
      )}

      {/* Pending Approvals Spotlight Section */}
      {pendingStudents.length > 0 && (
        <div className="rounded-2xl border border-amber-800/80 bg-amber-950/20 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-400" />
              <h3 className="text-sm font-bold text-amber-300">
                طلبات انضمام عاجلة في انتظار موافقتك ({pendingStudents.length} طلاب)
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              يمكنك الموافقة بضغطة زر واحدة أو إرسال الكود له
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingStudents.map((student) => (
              <div
                key={student.id}
                className="rounded-xl border border-amber-900/60 bg-slate-900/90 p-4 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={student.avatar}
                      alt=""
                      className="h-10 w-10 rounded-full border border-amber-700/60 object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{student.name}</h4>
                      <span className="text-[11px] text-slate-400 font-mono block">
                        {student.email}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                    بانتظار الكود
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                  <span className="text-slate-400 text-[11px]">كود تفعيل هذا الطالب:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-amber-300 font-mono font-bold">
                      {student.accessCode}
                    </code>
                    <button
                      onClick={() => handleCopyCode(student)}
                      className="text-slate-400 hover:text-white p-1"
                      title="نسخ كود التفعيل ورسالة الترحيب"
                    >
                      {copiedCodeId === student.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onApproveUser(student.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors cursor-pointer"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>موافقة وتفعيل فوري ✓</span>
                  </button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `مرحباً ${student.name}، تم قبولك في منصة فاهم التعليمية.\nكود تفعيل حسابك هو: ${student.accessCode}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg border border-emerald-800 bg-emerald-950/40 text-emerald-300 hover:text-white text-xs font-medium cursor-pointer"
                    title="إرسال الكود للطالب عبر واتساب"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>إرسال واتساب</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Students Roster Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-4">
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg w-full sm:w-auto">
            <button
              onClick={() => setFilterStatus('all')}
              className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterStatus === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              الكل ({students.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterStatus === 'pending' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              قيد الانتظار ({pendingStudents.length})
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterStatus === 'approved' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              المعتمدين ({approvedStudents.length})
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم، الإيميل، أو الكود..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pr-9 pl-3 text-xs text-slate-200 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-medium">اسم الطالب</th>
                <th className="py-3 px-4 font-medium">بريد Google</th>
                <th className="py-3 px-4 font-medium">حالة الدخول</th>
                <th className="py-3 px-4 font-medium">كود التفعيل / كلمة السر</th>
                <th className="py-3 px-4 font-medium">تاريخ التسجيل</th>
                <th className="py-3 px-4 font-medium text-left">إجراءات التحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={st.avatar} alt="" className="h-8 w-8 rounded-full border border-slate-700 object-cover" />
                        <div>
                          <span className="font-semibold text-slate-200 block">{st.name}</span>
                          {st.phone && <span className="text-[10px] text-slate-500 font-mono">{st.phone}</span>}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">
                      {st.email}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {st.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                          <UserCheck className="h-3.5 w-3.5" />
                          <span>معتمد ومفعل</span>
                        </span>
                      ) : st.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                          <ShieldAlert className="h-3.5 w-3.5" />
                          <span>قيد الانتظار</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
                          <Lock className="h-3.5 w-3.5" />
                          <span>محظور</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {editingUserId === st.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={customCodeInput}
                            onChange={(e) => setCustomCodeInput(e.target.value)}
                            placeholder="أدخل كود جديد"
                            className="w-28 rounded bg-slate-950 border border-cyan-500 px-2 py-1 text-xs font-mono text-cyan-300"
                          />
                          <button
                            onClick={() => handleSaveEditedCode(st.id)}
                            className="p-1 rounded bg-cyan-600 text-white"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <code className="text-cyan-300 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-semibold">
                            {st.accessCode}
                          </code>
                          <button
                            onClick={() => {
                              setEditingUserId(st.id);
                              setCustomCodeInput(st.accessCode);
                            }}
                            className="text-[11px] text-slate-400 hover:text-cyan-400"
                            title="تعديل الكود"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleCopyCode(st)}
                            className="p-1 text-slate-500 hover:text-slate-300"
                            title="نسخ رسالة الكود"
                          >
                            {copiedCodeId === st.id ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                      {st.registeredAt}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-left">
                      <div className="flex items-center justify-end gap-2">
                        {st.status !== 'approved' ? (
                          <button
                            onClick={() => onApproveUser(st.id)}
                            className="px-2.5 py-1 rounded bg-emerald-600/30 border border-emerald-600/50 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                          >
                            موافقة وتفعيل
                          </button>
                        ) : (
                          <button
                            onClick={() => onBlockUser(st.id)}
                            className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-800 transition-colors cursor-pointer"
                          >
                            إلغاء التفعيل
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm(`حذف حساب الطالب: ${st.name} نهائياً؟`)) {
                              onDeleteUser(st.id);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                          title="حذف الطالب"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-xs text-slate-500">
                    لا يوجد طلاب مطابقين لمعايير التصفية.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
