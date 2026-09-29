import { INITIAL_VIDEOS } from '../data/initialData';
import { 
  StudentNote, 
  UserProgress, 
  VideoLesson, 
  TimedExam, 
  ExamSubmission, 
  UserAccount 
} from '../types';

const STORAGE_KEYS = {
  VIDEOS: 'fahem_platform_videos_v1',
  PROGRESS: 'fahem_platform_progress_v1',
  NOTES: 'fahem_platform_notes_v1',
  EXAMS: 'fahem_platform_exams_v1',
  SUBMISSIONS: 'fahem_platform_submissions_v1',
  USERS: 'fahem_platform_users_v1',
  CURRENT_USER: 'fahem_platform_current_user_v1'
};

/* ==================== Initial Seed Data ==================== */

export const INITIAL_EXAMS: TimedExam[] = [
  {
    id: 'exam-phys-01',
    title: 'امتحان موقوت: قوانين كيرشوف والدوائر المعقدة وتوزيع الجهود',
    subject: 'الفيزياء',
    grade: 'الصف الثالث الثانوي',
    unit: 'الوحدة الأولى: الكهربية التيارية',
    durationMinutes: 25, // تحديد الوقت بالدقائق
    passingScorePercent: 60,
    instructions: 'الامتحان محدد بوقت إجباري (25 دقيقة). سيتم تسليم الإجابات تلقائياً عند انتهاء الوقت. تأكد من مراجعة إشارات كيرشوف قبل التأكيد.',
    createdAt: '2026-09-20',
    isPublished: true,
    questions: [
      {
        id: 'eq-1',
        questionText: 'في دائرة كيرشوف المغلقة، إذا كانت القوة الدافعة للبطارية 18V ومقاومتها الداخلية 0.5Ω ويمر بها تيار 4A في اتجاه تفريغ، فإن فرق الجهد بين طرفي البطارية يساوي:',
        options: ['16 Volt', '20 Volt', '18 Volt', '14 Volt'],
        correctOptionIndex: 0,
        explanation: 'في حالة التفريغ: V = V_B - I·r = 18 - (4 × 0.5) = 18 - 2 = 16 Volt.',
        points: 5
      },
      {
        id: 'eq-2',
        questionText: 'ينص قانون كيرشوف الأول على حفظ أي من الكميات الفيزيائية التالية؟',
        options: ['حفظ الشحنة الكهربية', 'حفظ كمية التحرك', 'حفظ الطاقة الميكانيكية', 'حفظ المجال المغناطيسي'],
        correctOptionIndex: 0,
        explanation: 'قانون كيرشوف الأول (قانون العقدة) مبني أساساً على مبدأ حفظ الشحنة الكهربائية (Σ I_in = Σ I_out).',
        points: 5
      },
      {
        id: 'eq-3',
        questionText: 'إذا تفرع تيار 6A عند عقدة إلى فرعين: مقاومة 6Ω ومقاومة 3Ω، فإن شدة التيار المار في المقاومة 3Ω تساوي:',
        options: ['4 A', '2 A', '3 A', '1.5 A'],
        correctOptionIndex: 0,
        explanation: 'الجهد متساوٍ على التوازي. نسبة المقاومات 6:3 أي 2:1، إذن نسبة التيارات عكسية 1:2. تيار المقاومة 3Ω = 6 × (6 / (6+3)) = 4A.',
        points: 5
      },
      {
        id: 'eq-4',
        questionText: 'إذا تحركنا في مسار مغلق عكس اتجاه التيار عبر مقاومة قيمتها R، فإن التغير في الجهد (ΔV) يحسب بإشارة:',
        options: ['موجبة (+ I·R)', 'سالبة (- I·R)', 'منعدمة (0)', 'موجبة فقط إذا كانت المقاومة متغيرة'],
        correctOptionIndex: 0,
        explanation: 'عند التحرك عكس اتجاه سريان التيار، ننتقل من نقطة جهد منخفض إلى جهد أعلى، وبالتالي يكون التغير موجباً (+ I·R).',
        points: 5
      }
    ]
  },
  {
    id: 'exam-math-01',
    title: 'امتحان تفاضل موقوت: الاشتقاق وقاعدة السلسلة والمعدلات الزمنية',
    subject: 'الرياضيات',
    grade: 'الصف الثالث الثانوي',
    unit: 'الوحدة الأولى: التفاضل والتكامل',
    durationMinutes: 30, // 30 دقيقة
    passingScorePercent: 60,
    instructions: 'احسب بدقة خطوات الاشتقاق. مسموح باستخدام الورقة والقلم والآلة الحاسبة. سينتهي الامتحان تلقائياً بمرور 30 دقيقة.',
    createdAt: '2026-09-22',
    isPublished: true,
    questions: [
      {
        id: 'mq-1',
        questionText: 'إذا كانت ص = جا²(س) + جتا²(س)، فإن دص / دس تساوي:',
        options: ['0', '1', '2 جا(س) جتا(س)', 'جا(2س)'],
        correctOptionIndex: 0,
        explanation: 'المتطابقة الشهيرة: جا²(س) + جتا²(س) = 1 (دالة ثابتة)، ومشتقة أي دالة ثابتة تساوي صفراً.',
        points: 5
      },
      {
        id: 'mq-2',
        questionText: 'معدل تغير حجم مكعب بالنسبة لطول ضلعه عندما يكون طول الضلع يساوي 4 سم هو:',
        options: ['48 سم²', '64 سم²', '16 سم²', '12 سم²'],
        correctOptionIndex: 0,
        explanation: 'حجم المكعب V = x³. معدل التغير بالنسبة لطول الضلع dV/dx = 3x². عندما x = 4: dV/dx = 3(16) = 48 سم².',
        points: 5
      },
      {
        id: 'mq-3',
        questionText: 'ميل المماس للمنحنى ص = س² - ٤س + ٣ عند النقطة (٣ ، ٠) يساوي:',
        options: ['2', '-2', '3', '0'],
        correctOptionIndex: 0,
        explanation: "ميل المماس = ص' = 2س - 4. عند س = 3: الميل = 2(3) - 4 = 2.",
        points: 5
      }
    ]
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-teacher-main',
    name: 'المعلم المشرف (أنت)',
    email: 'y01878309@gmail.com', // Active teacher user
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    role: 'teacher',
    status: 'approved',
    accessCode: 'MASTER-2026',
    registeredAt: '2026-09-01',
    approvedAt: '2026-09-01',
    notes: 'حساب المعلم وصاحب المنصة الأساسي'
  },
  {
    id: 'user-student-01',
    name: 'عمر خالد المنشاوي',
    email: 'omar.khaled.eg@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    role: 'student',
    status: 'approved',
    accessCode: 'FAHEM-7821',
    registeredAt: '2026-09-24',
    approvedAt: '2026-09-24',
    phone: '01012345678',
    notes: 'طالب في الصف الثالث الثانوي - مجموعة السبت'
  },
  {
    id: 'user-student-02',
    name: 'مريم إبراهيم عبد الله',
    email: 'mariam.ibrahim.eg@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    role: 'student',
    status: 'pending', // Pending approval by teacher!
    accessCode: 'FAHEM-9304',
    registeredAt: '2026-09-28',
    phone: '01198765432',
    notes: 'سجلت حديثاً بحساب جوجل وتنتظر اعتماد المعلم أو إدخال الكود'
  }
];

/* ==================== Storage Getters & Setters ==================== */

export function loadVideos(): VideoLesson[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VIDEOS);
    if (!raw) {
      saveVideos(INITIAL_VIDEOS);
      return INITIAL_VIDEOS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_VIDEOS;
  } catch (e) {
    console.error('Failed to load videos from storage', e);
    return INITIAL_VIDEOS;
  }
}

export function saveVideos(videos: VideoLesson[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
  } catch (e) {
    console.error('Failed to save videos to storage', e);
  }
}

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!raw) {
      return {
        completedVideoIds: [],
        bookmarkedVideoIds: [],
        videoProgress: {}
      };
    }
    return JSON.parse(raw);
  } catch (e) {
    return {
      completedVideoIds: [],
      bookmarkedVideoIds: [],
      videoProgress: {}
    };
  }
}

export function saveProgress(progress: UserProgress) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress to storage', e);
  }
}

export function loadNotes(): StudentNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveNotes(notes: StudentNote[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save notes to storage', e);
  }
}

/* ==================== Exams Storage ==================== */

export function loadExams(): TimedExam[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXAMS);
    if (!raw) {
      saveExams(INITIAL_EXAMS);
      return INITIAL_EXAMS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_EXAMS;
  } catch (e) {
    return INITIAL_EXAMS;
  }
}

export function saveExams(exams: TimedExam[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  } catch (e) {
    console.error('Failed to save exams to storage', e);
  }
}

export function loadSubmissions(): ExamSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveSubmissions(submissions: ExamSubmission[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  } catch (e) {
    console.error('Failed to save submissions to storage', e);
  }
}

/* ==================== Users & Access Management Storage ==================== */

export function loadUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      saveUsers(INITIAL_USERS);
      return INITIAL_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_USERS;
  } catch (e) {
    return INITIAL_USERS;
  }
}

export function saveUsers(users: UserAccount[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users to storage', e);
  }
}

export function loadCurrentUser(): UserAccount {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      // Default to Teacher mode for the owner/developer
      const teacher = INITIAL_USERS[0];
      saveCurrentUser(teacher);
      return teacher;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_USERS[0];
  }
}

export function saveCurrentUser(user: UserAccount | null) {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
  } catch (e) {
    console.error('Failed to save current user', e);
  }
}
