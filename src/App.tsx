import { useState, useEffect } from 'react';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Result from './components/Result';
import { Question } from './types';

function App() {
  const [view, setView] = useState<'HOME' | 'QUIZ' | 'RESULT'>('HOME');
  const [userId, setUserId] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Preload Dicebear Images
  useEffect(() => {
    const preloadImages = () => {
      // 這裡簡單 preload 1~100 的種子
      for(let i=1; i<=100; i++){
        const img = new Image();
        img.src = `https://api.dicebear.com/8.x/pixel-art/svg?seed=${i}`;
      }
    };
    preloadImages();
  }, []);

  const handleStartGame = (id: string, fetchedQuestions: Question[]) => {
    setUserId(id);
    setQuestions(fetchedQuestions);
    setTotalQuestions(fetchedQuestions.length);
    setScore(0);
    setView('QUIZ');
  };

  const handleFinishGame = (finalScore: number) => {
    setScore(finalScore);
    setView('RESULT');
  };

  const handlePlayAgain = () => {
    setView('HOME');
  };

  return (
    <div className="app-container">
      {view === 'HOME' && <Home onStart={handleStartGame} />}
      {view === 'QUIZ' && <Quiz userId={userId} questions={questions} onFinish={handleFinishGame} />}
      {view === 'RESULT' && <Result score={score} total={totalQuestions} onPlayAgain={handlePlayAgain} />}
    </div>
  );
}

export default App;
