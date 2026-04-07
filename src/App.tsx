import { useState, useEffect } from 'react';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Result from './components/Result';
import { Question, AnswerResult } from './types';

function App() {
  const [view, setView] = useState<'HOME' | 'QUIZ' | 'RESULT'>('HOME');
  const [userId, setUserId] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [answerResults, setAnswerResults] = useState<AnswerResult[]>([]);

  // Preload Dicebear Images
  useEffect(() => {
    const preloadImages = () => {
      // 這裡簡單 preload 1~100 的種子
      for (let i = 1; i <= 100; i++) {
        const img = new Image();
        img.src = `https://api.dicebear.com/8.x/pixel-art/svg?seed=${i}`;
      }
    };
    preloadImages();
  }, []);

  const handleStartGame = (id: string, fetchedQuestions: Question[]) => {
    setUserId(id);
    setQuestions(fetchedQuestions);
    setScore(0);
    setAnswerResults([]);
    setView('QUIZ');
  };

  const handleFinishGame = (finalScore: number, results: AnswerResult[]) => {
    setScore(finalScore);
    setAnswerResults(results);
    setView('RESULT');
  };

  const handlePlayAgain = () => {
    setView('HOME');
  };

  return (
    <div className="app-container">
      {view === 'HOME' && <Home onStart={handleStartGame} />}
      {view === 'QUIZ' && <Quiz userId={userId} questions={questions} onFinish={handleFinishGame} />}
      {view === 'RESULT' && <Result score={score} questions={questions} results={answerResults} onPlayAgain={handlePlayAgain} />}
    </div>
  );
}

export default App;
