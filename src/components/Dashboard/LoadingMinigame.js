import React, { useState, useEffect, useRef } from 'react';
import './LoadingMinigame.css';

const LoadingMinigame = ({ onComplete, loadingProgress = 0 }) => {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 80 }); // Positions 0-100
  const [enemies, setEnemies] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const gameAreaRef = useRef(null);
  
  // Game configuration
  const playerSize = 20;
  const enemySize = 16;
  const baseEnemySpeed = 0.5;

  // Start a new game
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setLives(3);
    setPlayerPosition({ x: 50, y: 80 });
    setEnemies([]);
    setGameOver(false);
    setGameTime(0);
  };

  // Handle keyboard controls
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const handleKeyDown = (e) => {
      const step = 3; // Movement step size
      
      // Movement keys
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setPlayerPosition(prev => ({
          ...prev,
          x: Math.max(0, prev.x - step)
        }));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setPlayerPosition(prev => ({
          ...prev,
          x: Math.min(100, prev.x + step)
        }));
      } else if (e.key === 'ArrowUp' || e.key === 'w') {
        setPlayerPosition(prev => ({
          ...prev,
          y: Math.max(0, prev.y - step)
        }));
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        setPlayerPosition(prev => ({
          ...prev,
          y: Math.min(100, prev.y + step)
        }));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver]);
  
  // Handle mouse/touch movement
  useEffect(() => {
    if (!gameStarted || !gameAreaRef.current || gameOver) return;
    
    const handleMouseMove = (e) => {
      if (!gameAreaRef.current) return;
      
      const gameArea = gameAreaRef.current.getBoundingClientRect();
      const relativeX = e.clientX - gameArea.left;
      const relativeY = e.clientY - gameArea.top;
      const percentX = (relativeX / gameArea.width) * 100;
      const percentY = (relativeY / gameArea.height) * 100;
      
      setPlayerPosition({
        x: Math.max(0, Math.min(100, percentX)),
        y: Math.max(0, Math.min(100, percentY))
      });
    };
    
    const handleTouchMove = (e) => {
      if (!e.touches[0] || !gameAreaRef.current) return;
      
      const gameArea = gameAreaRef.current.getBoundingClientRect();
      const relativeX = e.touches[0].clientX - gameArea.left;
      const relativeY = e.touches[0].clientY - gameArea.top;
      const percentX = (relativeX / gameArea.width) * 100;
      const percentY = (relativeY / gameArea.height) * 100;
      
      setPlayerPosition({
        x: Math.max(0, Math.min(100, percentX)),
        y: Math.max(0, Math.min(100, percentY))
      });
      
      // Prevent scrolling while playing
      e.preventDefault();
    };
    
    if (gameAreaRef.current) {
      gameAreaRef.current.addEventListener('mousemove', handleMouseMove);
      gameAreaRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
    
    return () => {
      if (gameAreaRef.current) {
        gameAreaRef.current.removeEventListener('mousemove', handleMouseMove);
        gameAreaRef.current.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [gameStarted, gameOver]);
  
  // Generate enemies
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const spawnInterval = setInterval(() => {
      // Random probability to generate enemy
      if (Math.random() < 0.9) {
        // Spawn position - can come from top, left or right
        const position = Math.random();
        let x, y;
        
        if (position < 0.6) {
          // Spawn from top
          x = Math.random() * 100;
          y = -5;
        } else if (position < 0.8) {
          // Spawn from left
          x = -5;
          y = Math.random() * 80; // Not too low
        } else {
          // Spawn from right
          x = 105;
          y = Math.random() * 80; // Not too low
        }
        
        // Enemy types:
        // 0 - Basic enemy, straight pattern
        // 1 - Zigzag enemy 
        // 2 - Circular enemy
        // 3 - Homing enemy (follows player slowly)
        // 4 - Splitter enemy (splits into two smaller enemies)
        // 5 - Fast enemy (high speed but predictable)
        const type = Math.floor(Math.random() * 6);
        
        // Color based on enemy type
        const colors = ['#f08', '#0f8', '#0ff', '#f80', '#f0f', '#08f'];
        
        const newEnemy = {
          id: `enemy-${Date.now()}-${Math.random()}`,
          x,
          y,
          type,
          speed: baseEnemySpeed * (type === 5 ? 2.5 : 1), // Fast enemy is faster
          size: enemySize * (type === 4 ? 1.3 : 1), // Splitter is bigger
          color: colors[type],
          angle: Math.random() * 2 * Math.PI, // For circular movement
          lifetime: 0, // Track how long enemy has lived
          hasSplit: false // Track if splitter has already split
        };
        
        setEnemies(prev => [...prev, newEnemy]);
      }
    }, 800);
    
    return () => clearInterval(spawnInterval);
  }, [gameStarted, gameOver]);
  
  // Game loop for updates
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const gameLoop = setInterval(() => {
      // Increment game time (used for score)
      setGameTime(prevTime => prevTime + 1);
      
      // Update enemies
      setEnemies(prev => 
        prev.map(enemy => {
          // Update lifetime
          enemy.lifetime += 1;
          
          // Calculate new position based on enemy type
          let xSpeed = 0;
          let ySpeed = 0;
          
          switch(enemy.type) {
            case 0: // Basic - straight line towards bottom
              if (enemy.x < 0) {
                xSpeed = enemy.speed; // Moving right
                ySpeed = enemy.speed * 0.5;
              } else if (enemy.x > 100) {
                xSpeed = -enemy.speed; // Moving left
                ySpeed = enemy.speed * 0.5;
              } else if (enemy.y < 0) {
                ySpeed = enemy.speed; // Moving down
              } else {
                // Normal movement from top to bottom
                ySpeed = enemy.speed;
              }
              break;
            case 1: // Zigzag pattern
              if (enemy.x < 0) {
                xSpeed = enemy.speed * 1.5; // Moving right faster
                ySpeed = enemy.speed * 0.5;
              } else if (enemy.x > 100) {
                xSpeed = -enemy.speed * 1.5; // Moving left faster
                ySpeed = enemy.speed * 0.5;
              } else if (enemy.y < 0) {
                ySpeed = enemy.speed;
                xSpeed = Math.sin(enemy.lifetime * 0.1) * enemy.speed * 2;
              } else {
                ySpeed = enemy.speed;
                xSpeed = Math.sin(enemy.lifetime * 0.1) * enemy.speed * 2;
              }
              break;
            case 2: // Circular pattern
              enemy.angle += 0.05;
              if (enemy.x < 0 || enemy.x > 100 || enemy.y < 0) {
                // If outside boundaries, move toward center first
                const centerX = 50;
                const centerY = 40;
                const dx = centerX - enemy.x;
                const dy = centerY - enemy.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                xSpeed = (dx / dist) * enemy.speed;
                ySpeed = (dy / dist) * enemy.speed;
              } else {
                // Circular motion around current position
                const circleRadius = 15;
                const centerX = enemy.x + Math.cos(enemy.angle) * circleRadius;
                const centerY = enemy.y + Math.sin(enemy.angle) * circleRadius;
                xSpeed = (centerX - enemy.x) * 0.1;
                ySpeed = (centerY - enemy.y) * 0.1 + enemy.speed * 0.3; // Slow descent
              }
              break;
            case 3: // Homing enemy - follows player
              {
                const dx = playerPosition.x - enemy.x;
                const dy = playerPosition.y - enemy.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                xSpeed = (dx / dist) * enemy.speed * 0.8;
                ySpeed = (dy / dist) * enemy.speed * 0.8;
              }
              break;
            case 4: // Splitter - splits into two smaller enemies after a time
              if (enemy.lifetime > 60 && !enemy.hasSplit && enemy.y > 20) {
                // Time to split
                enemy.hasSplit = true;
                
                // Create two new smaller enemies
                const splitEnemies = [
                  {
                    id: `enemy-${Date.now()}-${Math.random()}-split1`,
                    x: enemy.x - 5,
                    y: enemy.y,
                    type: 1, // Zigzag
                    speed: enemy.speed * 1.2,
                    size: enemy.size * 0.6,
                    color: enemy.color,
                    angle: Math.random() * 2 * Math.PI,
                    lifetime: 0,
                    hasSplit: true // Can't split again
                  },
                  {
                    id: `enemy-${Date.now()}-${Math.random()}-split2`,
                    x: enemy.x + 5,
                    y: enemy.y,
                    type: 2, // Circular
                    speed: enemy.speed * 1.2,
                    size: enemy.size * 0.6,
                    color: enemy.color,
                    angle: Math.random() * 2 * Math.PI,
                    lifetime: 0,
                    hasSplit: true // Can't split again
                  }
                ];
                
                // Add the split enemies
                setEnemies(currentEnemies => [...currentEnemies, ...splitEnemies]);
                
                // Mark this enemy for deletion
                return null;
              }
              
              // Normal movement for splitter before splitting
              if (enemy.x < 0) {
                xSpeed = enemy.speed;
              } else if (enemy.x > 100) {
                xSpeed = -enemy.speed;
              } else if (enemy.y < 0) {
                ySpeed = enemy.speed;
              } else {
                ySpeed = enemy.speed * 0.7;
                xSpeed = Math.sin(enemy.lifetime * 0.05) * enemy.speed;
              }
              break;
            case 5: // Fast enemy - quick and direct
              {
                // Start with a direct path to player
                const dx = playerPosition.x - enemy.x;
                const dy = playerPosition.y - enemy.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // Initial targeting, then keep that direction
                if (enemy.lifetime < 10) {
                  enemy.targetX = dx / dist;
                  enemy.targetY = dy / dist;
                }
                
                // Move in the set direction
                xSpeed = (enemy.targetX || 0) * enemy.speed;
                ySpeed = (enemy.targetY || 0) * enemy.speed;
                
                // Ensure it's moving toward the playing field if spawned outside
                if (enemy.x < 0) xSpeed = Math.abs(xSpeed);
                if (enemy.x > 100) xSpeed = -Math.abs(xSpeed);
                if (enemy.y < 0) ySpeed = Math.abs(ySpeed);
              }
              break;
            default:
              // Default fall-through
              ySpeed = enemy.speed;
          }
          
          // Calculate new position
          const newX = enemy.x + xSpeed;
          const newY = enemy.y + ySpeed;
          
          // Return updated enemy
          return {
            ...enemy,
            x: newX,
            y: newY
          };
        })
        .filter(enemy => enemy !== null) // Remove null enemies (splitters that were destroyed)
      );
      
      // Check collisions
      checkCollisions();
      
      // Remove enemies that are off-screen
      setEnemies(prev => prev.filter(enemy => 
        enemy.y < 105 && enemy.y > -10 && 
        enemy.x > -10 && enemy.x < 110
      ));
      
      // Increment score for time survived
      if (gameTime % 30 === 0) { // Every ~0.5 seconds
        setScore(prev => prev + 10);
      }
      
    }, 16); // ~60 FPS
    
    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, playerPosition, gameTime]);
  
  // Collision detection
  const checkCollisions = () => {
    // Check for collisions between player and enemies
    enemies.forEach(enemy => {
      const dx = enemy.x - playerPosition.x;
      const dy = enemy.y - playerPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < (enemy.size + playerSize) / 4) {
        // Collision!
        setEnemies(prev => prev.filter(e => e.id !== enemy.id));
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameOver(true);
          }
          return newLives;
        });
      }
    });
  };
  
  // End game when loading is complete
  useEffect(() => {
    if (loadingProgress >= 100 && onComplete) {
      setGameStarted(false);
      onComplete();
    }
  }, [loadingProgress, onComplete]);
  
  return (
    <div className="loading-minigame">
      <h2 className="game-title">
        {gameStarted ? (gameOver ? 'GAME OVER' : 'SPACE DODGER') : 'LOADING...'}
      </h2>
      
      <div className="game-stats">
        <span className="score">Score: {score}</span>
        <span className="lives">
          Lives: {[...Array(lives)].map((_, i) => (
            <span key={i} className="life-icon">❤️</span>
          ))}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="progress-container">
        <div 
          className="progress-bar"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>
      
      {!gameStarted && !gameOver && (
        <div className="game-intro">
          <p>While you wait, enjoy a quick game of Space Dodger!</p>
          <button
            className="start-button"
            onClick={startGame}
          >
            START GAME
          </button>
        </div>
      )}
      
      {gameOver && (
        <div className="game-over-screen">
          <p>Final Score: {score}</p>
          <button
            className="restart-button"
            onClick={startGame}
          >
            PLAY AGAIN
          </button>
        </div>
      )}
      
      {gameStarted && (
        <div
          ref={gameAreaRef}
          className="game-area"
        >
          {/* Player ship */}
          <div
            className="player-ship"
            style={{
              left: `calc(${playerPosition.x}% - ${playerSize / 2}px)`,
              top: `calc(${playerPosition.y}% - ${playerSize / 2}px)`,
              width: `${playerSize}px`,
              height: `${playerSize}px`
            }}
          />
          
          {/* Enemies */}
          {enemies.map(enemy => (
            <div
              key={enemy.id}
              className={`enemy enemy-type-${enemy.type}`}
              style={{
                left: `calc(${enemy.x}% - ${enemy.size / 2}px)`,
                top: `calc(${enemy.y}% - ${enemy.size / 2}px)`,
                width: `${enemy.size}px`,
                height: `${enemy.size}px`,
                backgroundColor: enemy.color,
                boxShadow: `0 0 8px ${enemy.color}`
              }}
            />
          ))}
          
          {/* Instructions */}
          <div className="game-instructions">
            Move: Mouse/Arrow Keys | Avoid the enemy patterns!
          </div>
        </div>
      )}
      
      <div className="loading-status">
        Loading data... {loadingProgress.toFixed(0)}%
      </div>
    </div>
  );
};

export default LoadingMinigame;