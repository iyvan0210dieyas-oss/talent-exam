export type QuizQuestion = {
  id: string;
  text: string;
  type: 'mcq' | 'text';
  options?: string[];
  answer: string | string[];
  aiEval?: boolean;
};

export type User = {
  name: string;
  email: string;
  course: string;
};

export type Submission = {
  id: string;
  user: User;
  attempt: number;
  answers: Record<string, string>;
  score: number;
  penalty: number;
  finalScore: number;
  totalQuestions: number;
  timestamp: string;
};

export type View =
  | 'welcome'
  | 'studentLogin'
  | 'adminLogin'
  | 'instructions'
  | 'quiz'
  | 'results'
  | 'admin';

export type Course = 'BCA 1' | 'BCA 2' | 'BBA 1' | 'BBA 2' | 'BBA 3' | 'MBA 1' | 'MBA 2' | 'MCA 1A' | 'MCA 1B';
