export interface Question {
  id: number;
  question: string;
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface AnswerResult {
  questionId: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface QuizResult {
  userId: string;
  score: number;
}
