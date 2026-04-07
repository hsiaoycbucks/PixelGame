export interface Question {
  id: number;
  question: string;
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface QuizResult {
  userId: string;
  score: number;
}
