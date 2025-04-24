import React, { useState, useEffect, useRef } from 'react';
import './LoadingMinigame.css';

const LoadingMinigame = ({ onComplete, loadingProgress = 0 }) => {
  // Estado del juego
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 80 }); // Posiciones 0-100
  const [bullets, setBullets] = useState([]);
  const [enemyBullets, setEnemyBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [lastShot, setLastShot] = useState(0);
  const gameAreaRef = useRef(null);
  
  // Configuración del juego
  const playerSize = 20;
  const bulletSize = 6;
  const enemyBulletSize = 8;
  const enemySize = 20;
  const bulletSpeed = 2;
  const enemyBulletSpeed = 1.5;
  const enemySpeed = 0.5;
  const shotCooldown = 200; // ms entre disparos

  // Iniciar nuevo juego
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setLives(3);
    setPlayerPosition({ x: 50, y: 80 });
    setBullets([]);
    setEnemyBullets([]);
    setEnemies([]);
    setGameOver(false);
  };

  // Manejar controles de teclado
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const handleKeyDown = (e) => {
      const step = 3; // Tamaño del paso de movimiento
      
      // Teclas de movimiento
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
      
      // Disparar con espacio
      if (e.key === ' ' || e.key === 'z' || e.key === 'j') {
        shootBullet();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver]);
  
  // Manejar movimiento del ratón/táctil
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
      
      // Prevenir desplazamiento mientras se juega
      e.preventDefault();
    };
    
    const handleClick = () => {
      shootBullet();
    };
    
    if (gameAreaRef.current) {
      gameAreaRef.current.addEventListener('mousemove', handleMouseMove);
      gameAreaRef.current.addEventListener('click', handleClick);
      gameAreaRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
    
    return () => {
      if (gameAreaRef.current) {
        gameAreaRef.current.removeEventListener('mousemove', handleMouseMove);
        gameAreaRef.current.removeEventListener('click', handleClick);
        gameAreaRef.current.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [gameStarted, gameOver]);
  
  // Disparar bala del jugador
  const shootBullet = () => {
    const now = Date.now();
    if (now - lastShot < shotCooldown) return; // Aplicar enfriamiento
    
    setLastShot(now);
    
    // Crear nueva bala - usando la posición exacta del jugador
    const newBullet = {
      id: `bullet-${Date.now()}-${Math.random()}`,
      x: playerPosition.x,
      y: playerPosition.y,
      speed: bulletSpeed
    };
    
    setBullets(prev => [...prev, newBullet]);
  };
  
  // Generar enemigos
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const spawnInterval = setInterval(() => {
      // Probabilidad aleatoria de generar enemigo
      if (Math.random() < 0.2) {
        const newEnemy = {
          id: `enemy-${Date.now()}-${Math.random()}`,
          x: Math.random() * 100, // Posición X aleatoria
          y: -5, // Empezar ligeramente por encima del área visible
          health: 2, // Toma 2 golpes para destruir
          lastShot: 0,
          pattern: Math.floor(Math.random() * 3) // Patrón de movimiento aleatorio
        };
        
        setEnemies(prev => [...prev, newEnemy]);
      }
    }, 1000);
    
    return () => clearInterval(spawnInterval);
  }, [gameStarted, gameOver]);
  
  // Bucle de actualización del juego
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const gameLoop = setInterval(() => {
      // Actualizar balas
      setBullets(prev => 
        prev
          .map(bullet => ({
            ...bullet,
            y: bullet.y - bullet.speed // Mover hacia arriba
          }))
          .filter(bullet => bullet.y > -5) // Eliminar balas que salieron de la pantalla
      );
      
      // Actualizar balas enemigas
      setEnemyBullets(prev => 
        prev
          .map(bullet => ({
            ...bullet,
            y: bullet.y + enemyBulletSpeed, // Mover hacia abajo
            x: bullet.x + (bullet.xSpeed || 0) // Movimiento horizontal opcional
          }))
          .filter(bullet => bullet.y < 105) // Eliminar balas que salieron de la pantalla
      );
      
      // Actualizar enemigos
      setEnemies(prev => 
        prev.map(enemy => {
          // Determinar patrón de movimiento
          let xChange = 0;
          
          switch(enemy.pattern) {
            case 0: // Recto hacia abajo
              break;
            case 1: // Zigzag
              xChange = Math.sin(Date.now() / 500 + enemy.id.charCodeAt(0)) * 1;
              break;
            case 2: // Círculo
              xChange = Math.cos(Date.now() / 1000 + enemy.id.charCodeAt(0)) * 0.8;
              break;
            default:
              break;
          }
          
          // Probabilidad de que el enemigo dispare
          const shouldShoot = Math.random() < 0.02 && Date.now() - enemy.lastShot > 1000;
          
          if (shouldShoot) {
            // Crear bala enemiga
            const newBullet = {
              id: `enemy-bullet-${Date.now()}-${Math.random()}`,
              x: enemy.x,
              y: enemy.y + 5, // Empezar ligeramente debajo del enemigo
              xSpeed: (Math.random() - 0.5) * 0.8 // Deriva horizontal aleatoria
            };
            
            setEnemyBullets(bullets => [...bullets, newBullet]);
            
            // Actualizar tiempo del último disparo
            enemy.lastShot = Date.now();
          }
          
          return {
            ...enemy,
            y: enemy.y + enemySpeed, // Mover hacia abajo
            x: Math.min(100, Math.max(0, enemy.x + xChange)) // Mantener dentro de los límites
          };
        })
      );
      
      // Comprobar colisiones y actualizar estado
      checkCollisions();
      
      // Eliminar enemigos que salieron de la pantalla
      setEnemies(prev => prev.filter(enemy => enemy.y < 105));
      
    }, 16); // Aproximadamente 60 FPS
    
    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, playerPosition]);
  
  // Detección de colisiones
  const checkCollisions = () => {
    // Comprobar balas del jugador golpeando enemigos
    bullets.forEach(bullet => {
      enemies.forEach(enemy => {
        const dx = bullet.x - enemy.x;
        const dy = bullet.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < (bulletSize + enemySize) / 2) {
          // ¡Impacto!
          enemy.health--;
          
          // Eliminar la bala
          setBullets(prev => prev.filter(b => b.id !== bullet.id));
          
          // Si la salud del enemigo es cero, eliminarlo y aumentar puntuación
          if (enemy.health <= 0) {
            setEnemies(prev => prev.filter(e => e.id !== enemy.id));
            setScore(prev => prev + 100);
          }
        }
      });
    });
    
    // Comprobar balas enemigas golpeando al jugador
    enemyBullets.forEach(bullet => {
      const dx = bullet.x - playerPosition.x;
      const dy = bullet.y - playerPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < (enemyBulletSize + playerSize) / 2) {
        // ¡Jugador impactado!
        setEnemyBullets(prev => prev.filter(b => b.id !== bullet.id));
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameOver(true);
          }
          return newLives;
        });
      }
    });
    
    // Comprobar enemigos colisionando con el jugador
    enemies.forEach(enemy => {
      const dx = enemy.x - playerPosition.x;
      const dy = enemy.y - playerPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < (enemySize + playerSize) / 2) {
        // ¡Colisión directa!
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
  
  // Finalizar juego cuando la carga esté completa
  useEffect(() => {
    if (loadingProgress >= 100 && onComplete) {
      setGameStarted(false);
      onComplete();
    }
  }, [loadingProgress, onComplete]);
  
  // Renderizar el mini-juego
  return (
    <div className="loading-minigame">
      <h2 className="game-title">
        {gameStarted ? (gameOver ? 'FIN DEL JUEGO' : 'DEFENSOR ESPACIAL') : 'CARGANDO...'}
      </h2>
      
      <div className="game-stats">
        <span className="score">Puntos: {score}</span>
        <span className="lives">
          Vidas: {[...Array(lives)].map((_, i) => (
            <span key={i} className="life-icon">❤️</span>
          ))}
        </span>
      </div>
      
      {/* Barra de progreso */}
      <div className="progress-container">
        <div 
          className="progress-bar"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>
      
      {!gameStarted && !gameOver && (
        <div className="game-intro">
          <p>¡Mientras esperas, juega una partida rápida!</p>
          <button
            className="start-button"
            onClick={startGame}
          >
            INICIAR JUEGO
          </button>
        </div>
      )}
      
      {gameOver && (
        <div className="game-over-screen">
          <p>Puntuación Final: {score}</p>
          <button
            className="restart-button"
            onClick={startGame}
          >
            JUGAR DE NUEVO
          </button>
        </div>
      )}
      
      {gameStarted && (
        <div
          ref={gameAreaRef}
          className="game-area"
        >
          {/* Nave del jugador */}
          <div
            className="player-ship"
            style={{
              left: `calc(${playerPosition.x}% - ${playerSize / 2}px)`,
              top: `calc(${playerPosition.y}% - ${playerSize / 2}px)`,
              width: `${playerSize}px`,
              height: `${playerSize}px`
            }}
          />
          
          {/* Balas del jugador */}
          {bullets.map(bullet => (
            <div
              key={bullet.id}
              className="player-bullet"
              style={{
                left: `calc(${bullet.x}% - ${bulletSize / 2}px)`,
                top: `calc(${bullet.y}% - ${bulletSize / 2}px)`,
                width: `${bulletSize}px`,
                height: `${bulletSize}px`
              }}
            />
          ))}
          
          {/* Balas enemigas */}
          {enemyBullets.map(bullet => (
            <div
              key={bullet.id}
              className="enemy-bullet"
              style={{
                left: `calc(${bullet.x}% - ${enemyBulletSize / 2}px)`,
                top: `calc(${bullet.y}% - ${enemyBulletSize / 2}px)`,
                width: `${enemyBulletSize}px`,
                height: `${enemyBulletSize}px`
              }}
            />
          ))}
          
          {/* Enemigos */}
          {enemies.map(enemy => (
            <div
              key={enemy.id}
              className={`enemy enemy-type-${enemy.pattern}`}
              style={{
                left: `calc(${enemy.x}% - ${enemySize / 2}px)`,
                top: `calc(${enemy.y}% - ${enemySize / 2}px)`,
                width: `${enemySize}px`,
                height: `${enemySize}px`
              }}
            />
          ))}
          
          {/* Instrucciones */}
          <div className="game-instructions">
            Mover: Ratón/Flechas | Disparar: Clic/Espacio
          </div>
        </div>
      )}
      
      <div className="loading-status">
        Cargando datos... {loadingProgress.toFixed(0)}%
      </div>
    </div>
  );
};

export default LoadingMinigame;