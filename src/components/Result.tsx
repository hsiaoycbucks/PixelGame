import { useState } from 'react';
import { Question, AnswerResult } from '../types';

interface ResultProps {
  score: number;
  questions: Question[];
  results: AnswerResult[];
  onPlayAgain: () => void;
}

export default function Result({ score, questions, results, onPlayAgain }: ResultProps) {
  const thresholdStr = import.meta.env.VITE_PASS_THRESHOLD;
  const passThreshold = thresholdStr ? parseInt(thresholdStr, 10) : 3;

  const isPassed = score >= passThreshold;
  const total = questions.length;

  const [showReview, setShowReview] = useState(false);

  // 檢查結果是否存在，若 GAS 沒更新或部署，results 可能會是 undefined
  const hasResults = results && Array.isArray(results) && results.length > 0;

  return (
    <div className="pixel-box" style={{ maxWidth: '600px' }}>
      {!showReview ? (
        <>
          <h1 className="pixel-title" style={{ color: isPassed ? '#4CAF50' : '#e52521' }}>
            {isPassed ? 'GAME CLEAR!' : 'GAME OVER'}
          </h1>

          <div style={{ margin: '30px 0', fontSize: '24px' }}>
            Your Score: <br /><br />
            <span style={{ fontSize: '40px', color: '#ffcc00' }}>{score}</span> / {total}
          </div>

          <p style={{ marginBottom: '40px', lineHeight: '1.5' }}>
            {isPassed
              ? '恭喜過關！您的成績已記錄。'
              : `需要答對至少 ${passThreshold} 題才能過關。請再試一次！`}
          </p>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button className="pixel-btn" onClick={() => setShowReview(true)}>
              查看解析
            </button>
            <button className="pixel-btn" onClick={onPlayAgain}>
              PLAY AGAIN
            </button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'left' }}>
          <h2 className="pixel-title" style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>答題回顧</h2>

          <div style={{ maxHeight: '60vh', overflowY: 'auto', marginBottom: '20px', paddingRight: '10px' }}>
            {!hasResults ? (
              <div style={{ textAlign: 'center', color: '#e52521', padding: '20px' }}>
                <p>⚠️ 找不到答題紀錄。</p>
                <p style={{ fontSize: '14px', color: '#666' }}>請確認 Google Apps Script 已經「重新部署」為「新版本」，並將最新的 Web App URL 填入 .env 中。</p>
              </div>
            ) : (
              questions.map((q, index) => {
                // 使用 String() 強制轉型，避免數字 vs 字串的比對錯誤
                const res = results.find(r => String(r.questionId) === String(q.id));
                if (!res) return null;

                const isCorrect = res.isCorrect;
                return (
                  <div key={q.id} style={{
                    marginBottom: '20px',
                    padding: '15px',
                    backgroundColor: isCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(229, 37, 33, 0.1)',
                    border: `2px solid ${isCorrect ? '#4CAF50' : '#e52521'}`,
                    borderRadius: '8px'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '10px', lineHeight: '1.4' }}>
                      Q{index + 1}: {q.question}
                    </div>
                    <div style={{ marginBottom: '5px' }}>
                      你的答案: <span style={{ color: isCorrect ? '#4CAF50' : '#e52521', fontWeight: 'bold' }}>{res.userAnswer} ({q[res.userAnswer as 'A' | 'B' | 'C' | 'D']})</span>
                      {isCorrect ? ' ✔' : ' ✘'}
                    </div>
                    {!isCorrect && (
                      <div>
                        正確答案: <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>{res.correctAnswer} ({q[res.correctAnswer as 'A' | 'B' | 'C' | 'D']})</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button className="pixel-btn" onClick={() => setShowReview(false)}>返回分數</button>
          </div>
        </div>
      )}
    </div>
  );
}
