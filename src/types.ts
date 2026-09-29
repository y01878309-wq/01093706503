export type VideoType = 'explanation' | 'problem-solving' | 'exam-solution';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'genius';

export interface TimestampChapter {
  id: string;
  timeSeconds: number;
  formattedTime: string;
  title: string;
}

export interface SolutionStep {
  stepNumber: number;
  title: string;
  explanation: string;
  formulaOrWork?: string;
  tip?: string;
}

export interface Attachment {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'image';
  url: string;
  size?: string;
}

export interface PracticeQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface VideoComment {
  id: string;
  author: string;
  role: 'student' | 'teacher';
  avatar?: string;
  date: string;
  text: string;
  timestampSeconds?: number;
  reply?: string;
}

export interface VideoLesson {
  id: string;
  title: string;
  type: VideoType;
  subject: string;
  subjectId: string;
  grade: string;
  unit: string;
  videoSourceType: 'youtube' | 'url' | 'upload';
  videoUrl: string; // YouTube ID or URL or blob
  thumbnailUrl?: string;
  duration: string;
  durationSeconds: number;
  difficulty: DifficultyLevel;
  description: string;
  instructor: {
    name: string;
    title: string;
    avatar?: string;
  };
  timestamps: TimestampChapter[];
  keyTakeaways: string[];
  solutionSteps?: SolutionStep[];
  attachments?: Attachment[];
  practiceQuestions?: PracticeQuestion[];
  comments?: VideoComment[];
  viewsCount: number;
  likesCount: number;
  createdAt: string;
  isFeatured?: boolean;
}

export interface StudentNote {
  id: string;
  videoId: string;
  timestampSeconds: number;
  formattedTime: string;
  content: string;
  createdAt: string;
}

export interface UserProgress {
  completedVideoIds: string[];
  bookmarkedVideoIds: string[];
  videoProgress: Record<string, number>; // videoId -> seconds watched
}

/* ==================== Timed Exams Types ==================== */

export interface ExamQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  points: number;
}

export interface TimedExam {
  id: string;
  title: string;
  subject: string;
  grade: string;
  unit: string;
  durationMinutes: number; // Duration set by teacher "علي مزاجه"
  passingScorePercent: number; // e.g., 60%
  instructions: string;
  questions: ExamQuestion[];
  createdAt: string;
  isPublished: boolean;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  examTitle: string;
  studentEmail: string;
  studentName: string;
  selectedAnswers: Record<string, number>; // questionId -> optionIndex
  score: number;
  totalPoints: number;
  percentage: number;
  isPassed: boolean;
  timeSpentSeconds: number;
  submittedAt: string;
}

/* ==================== User & Student Access Management ==================== */

export type StudentAccessStatus = 'approved' | 'pending' | 'blocked';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'teacher' | 'student';
  status: StudentAccessStatus;
  accessCode: string; // Secret code or password provided by teacher
  registeredAt: string;
  approvedAt?: string;
  phone?: string;
  notes?: string;
}

