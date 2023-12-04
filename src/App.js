import React, { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;

const App = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [direction, setDirection] = useState('RIGHT');
  function generateFood() {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }
  const [food, setFood] = useState(generateFood());
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection('UP');
          break;
        case 'ArrowDown':
          setDirection('DOWN');
          break;
        case 'ArrowLeft':
          setDirection('LEFT');
          break;
        case 'ArrowRight':
          setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    const moveSnake = () => {
      if (isGameOver) return;
      console.log(isGameOver);

      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
        default:
          break;
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      checkCollision(newSnake);
      setSnake(newSnake);
    };

    const checkCollision = (snake) => {
      const head = snake[0];

      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE ||
        snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setIsGameOver(true);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw snake
      ctx.fillStyle = 'green';
      snake.forEach(({ x, y }) => ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE));

      // Draw food
      ctx.fillStyle = 'red';
      ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    };

    const gameLoop = () => {
      moveSnake();
      draw();
    };

    document.addEventListener('keydown', handleKeyPress);

    const intervalId = setInterval(gameLoop, 100);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [snake, direction, food, isGameOver]);

  const restartGame = () => {
    setIsGameOver(false);
    setSnake([{ x: 5, y: 5 }]);
    setDirection('RIGHT');
    setFood(generateFood());
  };

  return (
    <div>
      <h1>{isGameOver ?
        <div>
          {'Game Over'}
          <div>
            <button onClick={restartGame}>
              Restart game
            </button>
          </div>
        </div>
        : 'Snake Game'}</h1>
      <canvas ref={canvasRef} width={GRID_SIZE * CELL_SIZE} height={GRID_SIZE * CELL_SIZE} style={{ border: '1px solid #000' }} />
    </div>
  );
};

export default App;
