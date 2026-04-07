import { useState } from 'react';
import axios from 'axios';
import { Question } from '../types';

interface HomeProps {
  onStart: (id: string, questions: Question[]) => void;
}

export default function Home({ onStart }: HomeProps) {
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startGame = async () => {
    if (!id.trim()) {
      setError('請輸入 ID!');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const url = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
      const count = import.meta.env.VITE_QUESTION_COUNT || 5;
      
      const res = await axios.get(`${url}?action=getQuestions&count=${count}`);
      if (res.data && res.data.success) {
        onStart(id, res.data.questions);
      } else {
        setError('取得題目失敗，請檢查網路或設定。');
      }
    } catch (err: any) {
      console.error(err);
      setError('發生錯誤，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pixel-box">
      <h1 className="pixel-title">Pixel Quiz<br/>Adventure</h1>
      
      <p style={{marginBottom: '20px'}}>請輸入您的挑戰 ID</p>
      
      <input 
        type="text" 
        className="pixel-input" 
        value={id} 
        onChange={(e) => setId(e.target.value)} 
        placeholder="Enter ID..."
        disabled={loading}
      />
      
      {error && <p style={{color: 'var(--primary-color)', marginBottom: '15px'}}>{error}</p>}
      
      <button 
        className="pixel-btn" 
        onClick={startGame}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'START GAME'}
      </button>
    </div>
  );
}
