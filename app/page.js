'use client';

import { useState, useRef, useEffect } from 'react';

export default function MobileArenaTargeting() {
  const [targets, setTargets] = useState([]);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [touchLog, setTouchLog] = useState([]);
  const canvasRef = useRef(null);

  const generateTarget = () => {
    const size = 40 + Math.random() * 40;
    return {
      id: Date.now() + Math.random(),
      x: Math.random() * (window.innerWidth - size),
      y: Math.random() * (window.innerHeight - size - 150),
      size,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    };
  };

  const startGame = () => {
    setScore(0);
    setMisses(0);
    setTimeLeft(30);
    setGameActive(true);
    setTouchLog([]);
    setTargets([generateTarget(), generateTarget(), generateTarget()]);
  };

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [gameActive, timeLeft]);

  const handleTargetHit = (targetId, event) => {
    if (!gameActive) return;

    event.preventDefault();
    event.stopPropagation();

    const touch = event.touches?.[0] || event.changedTouches?.[0] || event;
    const log = {
      time: new Date().toLocaleTimeString(),
      type: 'HIT',
      x: Math.round(touch.clientX),
      y: Math.round(touch.clientY),
    };

    setTouchLog(prev => [log, ...prev].slice(0, 10));
    setScore(s => s + 1);
    setTargets(prev => {
      const newTargets = prev.filter(t => t.id !== targetId);
      return [...newTargets, generateTarget()];
    });
  };

  const handleMiss = (event) => {
    if (!gameActive) return;

    const touch = event.touches?.[0] || event.changedTouches?.[0] || event;
    const log = {
      time: new Date().toLocaleTimeString(),
      type: 'MISS',
      x: Math.round(touch.clientX),
      y: Math.round(touch.clientY),
    };

    setTouchLog(prev => [log, ...prev].slice(0, 10));
    setMisses(m => m + 1);
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        fontSize: '14px',
      }}>
        <div>Score: <strong>{score}</strong></div>
        <div>Misses: <strong>{misses}</strong></div>
        <div>Time: <strong>{timeLeft}s</strong></div>
        <div>Accuracy: <strong>{score + misses > 0 ? Math.round(score / (score + misses) * 100) : 0}%</strong></div>
      </div>

      {/* Game Arena */}
      <div
        onTouchStart={handleMiss}
        onClick={handleMiss}
        style={{
          position: 'absolute',
          top: 50,
          left: 0,
          right: 0,
          bottom: 150,
          touchAction: 'none',
        }}
      >
        {gameActive && targets.map(target => (
          <div
            key={target.id}
            onTouchStart={(e) => handleTargetHit(target.id, e)}
            onClick={(e) => handleTargetHit(target.id, e)}
            style={{
              position: 'absolute',
              left: target.x,
              top: target.y,
              width: target.size,
              height: target.size,
              borderRadius: '50%',
              background: target.color,
              border: '3px solid white',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              transition: 'transform 0.1s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            🎯
          </div>
        ))}

        {!gameActive && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'white',
          }}>
            <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
              {timeLeft === 30 ? '🎯 Mobile Arena Targeting' : '🎮 Game Over!'}
            </h1>
            {timeLeft === 0 && (
              <div style={{ marginBottom: '20px', fontSize: '18px' }}>
                <div>Final Score: <strong>{score}</strong></div>
                <div>Accuracy: <strong>{score + misses > 0 ? Math.round(score / (score + misses) * 100) : 0}%</strong></div>
              </div>
            )}
            <button
              onClick={startGame}
              style={{
                padding: '15px 40px',
                fontSize: '20px',
                background: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#667eea',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              }}
            >
              {timeLeft === 30 ? 'Start Game' : 'Play Again'}
            </button>
          </div>
        )}
      </div>

      {/* Touch Log */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 150,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        overflowY: 'auto',
        fontSize: '12px',
        zIndex: 100,
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Touch Log:</div>
        {touchLog.map((log, i) => (
          <div key={i} style={{
            padding: '3px 0',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            color: log.type === 'HIT' ? '#4ade80' : '#f87171',
          }}>
            {log.time} - <strong>{log.type}</strong> at ({log.x}, {log.y})
          </div>
        ))}
        {touchLog.length === 0 && (
          <div style={{ color: '#999', fontStyle: 'italic' }}>
            Tap targets to start logging interactions...
          </div>
        )}
      </div>
    </div>
  );
}
