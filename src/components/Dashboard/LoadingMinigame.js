import React, { useState, useEffect, useRef } from 'react';

const LoadingMinigame = ({ onComplete, loadingProgress = 0 }) => {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // 10 second game
  const [playerPosition, setPlayerPosition] = useState(50); // 0-100 position on x-axis
  const [obstacles, setObstacles] = useState([]);
  const [collectibles, setCollectibles] = useState([]);
  const [gameProgress, setGameProgress] = useState(0);
  const gameAreaRef = useRef(null);
  
  // Game settings
  const playerSize = 20;
  const obstacleSize = 15;
  const collectibleSize = 12;
  const gameSpeed = 3;
  
  // Handle keyboard controls
  useEffect(() => {
    if (!gameStarted) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setPlayerPosition(prev => Math.max(0, prev - 5));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setPlayerPosition(prev => Math.min(100, prev + 5));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted]);
  
  // Handle mouse/touch controls
  useEffect(() => {
    if (!gameStarted || !gameAreaRef.current) return;
    
    const handleMouseMove = (e) => {
      const gameArea = gameAreaRef.current.getBoundingClientRect();
      const relativeX = e.clientX - gameArea.left;
      const percentX = (relativeX / gameArea.width) * 100;
      setPlayerPosition(Math.max(0, Math.min(100, percentX)));
    };
    
    const handleTouchMove = (e) => {
      if (!e.touches[0]) return;
      
      const gameArea = gameAreaRef.current.getBoundingClientRect();
      const relativeX = e.touches[0].clientX - gameArea.left;
      const percentX = (relativeX / gameArea.width) * 100;
      setPlayerPosition(Math.max(0, Math.min(100, percentX)));
      
      // Prevent scrolling while playing
      e.preventDefault();
    };
    
    gameAreaRef.current.addEventListener('mousemove', handleMouseMove);
    gameAreaRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      if (gameAreaRef.current) {
        gameAreaRef.current.removeEventListener('mousemove', handleMouseMove);
        gameAreaRef.current.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [gameStarted]);
  
  // Game timer
  useEffect(() => {
    if (!gameStarted) return;
    
    if (timeLeft <= 0) {
      // End game when timer runs out
      setGameStarted(false);
      return;
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 0.1);
      setGameProgress(prev => Math.min(100, prev + 1));
    }, 100);
    
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted]);
  
  // Spawn obstacles and collectibles
  useEffect(() => {
    if (!gameStarted) return;
    
    const spawnInterval = setInterval(() => {
      // Spawn obstacle
      if (Math.random() < 0.3) {
        const newObstacle = {
          id: Date.now() + 'o',
          x: Math.random() * 100,
          y: 0
        };
        setObstacles(prev => [...prev, newObstacle]);
      }
      
      // Spawn collectible
      if (Math.random() < 0.2) {
        const newCollectible = {
          id: Date.now() + 'c',
          x: Math.random() * 100,
          y: 0
        };
        setCollectibles(prev => [...prev, newCollectible]);
      }
    }, 600);
    
    return () => clearInterval(spawnInterval);
  }, [gameStarted]);
  
  // Move obstacles and collectibles, detect collisions
  useEffect(() => {
    if (!gameStarted) return;
    
    const gameInterval = setInterval(() => {
      // Move obstacles
      setObstacles(prev => 
        prev
          .map(obstacle => ({ ...obstacle, y: obstacle.y + gameSpeed }))
          .filter(obstacle => {
            // Check for collision with player
            const collision = 
              obstacle.y >= 75 && obstacle.y <= 85 &&
              Math.abs(obstacle.x - playerPosition) < (playerSize + obstacleSize) / 2;
            
            if (collision) {
              // Player hit an obstacle
              setScore(prev => Math.max(0, prev - 5));
            }
            
            // Keep in game area if no collision and not past bottom
            return !collision && obstacle.y < 100;
          })
      );
      
      // Move collectibles
      setCollectibles(prev => 
        prev
          .map(collectible => ({ ...collectible, y: collectible.y + gameSpeed }))
          .filter(collectible => {
            // Check for collision with player
            const collision = 
              collectible.y >= 75 && collectible.y <= 85 &&
              Math.abs(collectible.x - playerPosition) < (playerSize + collectibleSize) / 2;
            
            if (collision) {
              // Player collected a point
              setScore(prev => prev + 10);
            }
            
            // Keep in game area if no collision and not past bottom
            return !collision && collectible.y < 100;
          })
      );
    }, 50);
    
    return () => clearInterval(gameInterval);
  }, [gameStarted, playerPosition]);
  
  // End game when loading is complete
  useEffect(() => {
    if (loadingProgress >= 100 && onComplete) {
      setGameStarted(false);
      onComplete();
    }
  }, [loadingProgress, onComplete]);
  
  // Render the mini-game
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4" style={{ 
        color: 'var(--neon-primary)', 
        textShadow: '0 0 10px var(--neon-primary)'
      }}>
        {gameStarted ? 'DEFEND THE CAMPUS' : 'LOADING...'}
      </h2>
      
      <div className="flex justify-between w-full mb-2">
        <span style={{ color: 'var(--neon-green)' }}>
          Score: {score}
        </span>
        <span style={{ color: 'var(--neon-blue)' }}>
          Time: {Math.max(0, Math.floor(timeLeft))}s
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-3 bg-black bg-opacity-30 rounded-full mb-4 overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{ 
            width: `${loadingProgress}%`, 
            backgroundColor: 'var(--neon-primary)',
            boxShadow: '0 0 10px var(--neon-primary)'
          }}
        />
      </div>
      
      {!gameStarted && (
        <div className="mt-4 text-center">
          <p className="mb-4 text-white">
            While you wait, play a quick game!
          </p>
          <button
            onClick={() => {
              setGameStarted(true);
              setScore(0);
              setTimeLeft(10);
              setObstacles([]);
              setCollectibles([]);
            }}
            className="px-4 py-2 rounded hover:bg-opacity-20 transition-all duration-300"
            style={{
              background: 'none',
              border: '2px solid var(--neon-primary)',
              color: 'var(--neon-primary)',
              boxShadow: '0 0 10px var(--neon-primary)',
            }}
          >
            START GAME
          </button>
        </div>
      )}
      
      {gameStarted && (
        <div
          ref={gameAreaRef}
          className="relative w-full h-64 rounded-lg overflow-hidden cursor-none"
          style={{
            border: '2px solid var(--neon-primary)',
            backgroundImage: 
              'linear-gradient(0deg, rgba(5, 5, 25, 0.9), rgba(10, 10, 30, 0.8)), repeating-linear-gradient(45deg, rgba(0, 255, 255, 0.05), rgba(0, 255, 255, 0.05) 2px, transparent 2px, transparent 10px)',
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
          }}
        >
          {/* Player ship */}
          <div
            style={{
              position: 'absolute',
              left: `calc(${playerPosition}% - ${playerSize / 2}px)`,
              bottom: '20px',
              width: `${playerSize}px`,
              height: `${playerSize}px`,
              backgroundColor: 'var(--neon-primary)',
              borderRadius: '50% 50% 0 0',
              transform: 'rotate(-45deg)',
              boxShadow: '0 0 10px var(--neon-primary)',
              transition: 'left 0.1s ease',
              zIndex: 10
            }}
          />
          
          {/* Render obstacles */}
          {obstacles.map(obstacle => (
            <div
              key={obstacle.id}
              style={{
                position: 'absolute',
                left: `calc(${obstacle.x}% - ${obstacleSize / 2}px)`,
                top: `${obstacle.y}%`,
                width: `${obstacleSize}px`,
                height: `${obstacleSize}px`,
                backgroundColor: 'var(--neon-red)',
                boxShadow: '0 0 8px var(--neon-red)',
                borderRadius: '2px',
                zIndex: 5
              }}
            />
          ))}
          
          {/* Render collectibles */}
          {collectibles.map(collectible => (
            <div
              key={collectible.id}
              style={{
                position: 'absolute',
                left: `calc(${collectible.x}% - ${collectibleSize / 2}px)`,
                top: `${collectible.y}%`,
                width: `${collectibleSize}px`,
                height: `${collectibleSize}px`,
                backgroundColor: 'var(--neon-green)',
                boxShadow: '0 0 8px var(--neon-green)',
                borderRadius: '50%',
                zIndex: 5
              }}
            />
          ))}
          
          {/* Instructions */}
          <div
            className="text-xs text-white text-opacity-70 whitespace-nowrap"
            style={{
              position: 'absolute',
              bottom: '5px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            Move: Mouse / Arrow Keys / Touch
          </div>
        </div>
      )}
      
      <div className="mt-2 text-sm" style={{ color: 'var(--neon-blue)', opacity: 0.8 }}>
        Loading data... {loadingProgress}%
      </div>
    </div>
  );
};

export default LoadingMinigame;