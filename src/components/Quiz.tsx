import { useState, useMemo } from 'react';
import { Question, AnswerResult } from '../types';

interface QuizProps {
  userId: string;
  questions: Question[];
  onFinish: (score: number, results: AnswerResult[]) => void;
}

export default function Quiz({ userId, questions, onFinish }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{questionId: number, answer: string}[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const currentQ = questions[currentIndex];
  // 使用問題的 id 作為圖片 seed，確保同題目圖一樣，或是加上一個位移增加隨機感
  const seed = currentQ ? currentQ.id : currentIndex + 1;

  const shuffledOptions = useMemo(() => {
    if (!currentQ) return [];
    const options = ['A', 'B', 'C', 'D'];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  }, [currentIndex, currentQ]);

  const handleSelect = async (optionKey: string) => {
    if (submitting) return; // 避免連點
    
    const newAnswers = [...answers, { questionId: currentQ.id, answer: optionKey }];
    
    if (currentIndex < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentIndex(currentIndex + 1);
    } else {
      // 最後一題
      setSubmitting(true);
      setAnswers(newAnswers);
      
      try {
        const url = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
        // GAS 常遇 CORS 問題，若使用 axios 建議用字串傳遞或設定 Content-Type
        // 這裡採用 fetch 配合 text/plain 或 POST x-www-form-urlencoded
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify({
            action: 'submitAnswers',
            userId: userId,
            answers: newAnswers
          })
        });
        
        const data = await response.json();
        if (data.success) {
          onFinish(data.score, data.results);
        } else {
          alert('成績計算失敗: ' + data.error);
          setSubmitting(false);
        }
      } catch (err) {
        console.error(err);
        alert('網路錯誤，無法傳送成績');
        setSubmitting(false);
      }
    }
  };

  if (!currentQ) return <div className="pixel-box">沒有題目</div>;

  return (
    <div className="pixel-box">
      {submitting ? (
        <div>
          <h2 className="loading">Calculating...</h2>
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            Level {currentIndex + 1} / {questions.length}
          </div>
          <img 
            className="dicebear-img" 
            src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${seed}`} 
            alt="Boss Image" 
          />
          <div className="question-text">
            {currentQ.question}
          </div>
          <div className="options-grid">
            {shuffledOptions.map(opt => (
              <button 
                key={opt}
                className="pixel-btn"
                onClick={() => handleSelect(opt)}
                style={{ textAlign: 'left', textTransform: 'none' }}
              >
                {currentQ[opt as 'A'|'B'|'C'|'D']}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
