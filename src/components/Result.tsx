interface ResultProps {
  score: number;
  total: number;
  onPlayAgain: () => void;
}

export default function Result({ score, total, onPlayAgain }: ResultProps) {
  const thresholdStr = import.meta.env.VITE_PASS_THRESHOLD;
  const passThreshold = thresholdStr ? parseInt(thresholdStr, 10) : 3;

  const isPassed = score >= passThreshold;

  return (
    <div className="pixel-box">
      <h1 className="pixel-title" style={{ color: isPassed ? '#4CAF50' : '#e52521' }}>
        {isPassed ? 'GAME CLEAR!' : 'GAME OVER'}
      </h1>
      
      <div style={{ margin: '30px 0', fontSize: '24px' }}>
        Your Score: <br/><br/>
        <span style={{ fontSize: '40px', color: '#ffcc00' }}>{score}</span> / {total}
      </div>
      
      <p style={{ marginBottom: '40px', lineHeight: '1.5' }}>
        {isPassed 
          ? '恭喜過關！您的成績已記錄。' 
          : `需要答對至少 ${passThreshold} 題才能過關。請再試一次！`}
      </p>

      <button className="pixel-btn" onClick={onPlayAgain}>
        PLAY AGAIN
      </button>
    </div>
  );
}
