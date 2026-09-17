export interface StudentUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  school: string;
  student_class: string; // 'Class 9', 'Class 10', 'Class 11', 'Class 12'
  target_exam: string; // 'JEE Advanced 2027', 'NEET-UG 2027', 'CBSE 12th Board', etc.
  stream: string; // 'PCM', 'PCB', 'PCMB', 'Foundation'
  stars: number;
  streak_days: number;
  last_login_date: string;
  last_spin_date: string;
  login_history?: string[];
  study_invites?: string[];
  accepted_buddies?: string[];
  modules_completed: number;
  doubts_solved: number;
  upvotes_received: number;
  quiz_accuracy_pct: number;
  rating_score: number;
  bio: string;
}

export type QuestionDifficulty = 'Foundation' | 'Intermediate' | 'Tough';

export interface QuizQuestion {
  q: string;
  options: string[];
  ans: number;
  difficulty?: QuestionDifficulty;
  explanation?: string;
  stars_bonus?: number;
}

export interface CodePlaygroundData {
  language: 'python' | 'cpp' | 'java' | 'javascript' | 'sql';
  default_code: string;
  expected_output: string;
  hints: string[];
  explanation: string;
}

export interface LearningModule {
  id: string;
  title: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology' | 'Class 10 Foundation' | 'Coding & Tech Skills';
  grade_level: string;
  difficulty: string;
  duration_mins: number;
  star_reward: number;
  description: string;
  thumbnail: string;
  quiz_data: QuizQuestion[];
  code_playground?: CodePlaygroundData;
}

export interface StoreItem {
  id: string;
  name: string;
  category: 'Exam Essentials' | 'Study Aids' | 'Desk Stationary' | 'Apparel';
  star_cost: number;
  stock: number;
  description: string;
  image_url: string;
  badge?: string;
}

export interface StoreOrder {
  id: string;
  user_id: string;
  item_id: string;
  item_name: string;
  star_cost: number;
  recipient_name: string;
  shipping_address: string;
  city: string;
  pincode: string;
  status: 'Confirmed' | 'Processing' | 'Delivered';
  ordered_at: string;
}

export interface DoubtAnswer {
  id: string;
  doubt_id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  author_class: string;
  author_rating: number;
  content: string;
  created_at: string;
  upvotes: number;
  is_accepted: boolean;
}

export interface Doubt {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  author_class: string;
  author_exam: string;
  author_rating: number;
  title: string;
  description: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology' | 'Class 10 Foundation';
  difficulty?: QuestionDifficulty;
  bounty_stars: number;
  created_at: string;
  status: 'open' | 'solved';
  upvotes: number;
  accepted_answer_id?: string;
  answers: DoubtAnswer[];
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface AIConceptExtraction {
  title: string;
  summary: string[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isError?: boolean;
  rawPrompt?: string;
}
