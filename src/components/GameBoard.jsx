import { useEffect, useState } from 'react';
import { Button, Modal} from 'antd';
import Tile from './Tile';

const GRID_SIZE = 4;

function addRandomTile(grid) {
  const emptyTiles = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j].value === 0) {
        emptyTiles.push({ x: i, y: j });
      }
    }
  }
  if (emptyTiles.length > 0) {
    const { x, y } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    grid[x][y] = {
      value: Math.random() < 0.9 ? 2 : 4,
      isNew: true,
      isMerged: false
    };
  }
  return grid;
}

function generateInitialGrid() {
  const grid = Array(GRID_SIZE)
    .fill(null)
    .map(() =>
      Array(GRID_SIZE).fill(null).map(() => ({
        value: 0,
        isNew: false,
        isMerged: false
      }))
    );
  addRandomTile(grid);
  addRandomTile(grid);
  return grid;
}

function slideAndMerge(row) {
  const newRow = row.filter(tile => tile.value !== 0);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i].value === newRow[i + 1].value && !newRow[i].isMerged && !newRow[i + 1].isMerged) {
      newRow[i] = {
        value: newRow[i].value * 2,
        isNew: false,
        isMerged: true
      };
      newRow[i + 1] = {
        value: 0,
        isNew: false,
        isMerged: false
      };
    }
  }

  const filtered = newRow.filter(tile => tile.value !== 0);
  while (filtered.length < GRID_SIZE) {
    filtered.push({ value: 0, isNew: false, isMerged: false });
  }
  return filtered;
}

function hasGridChanged(oldGrid, newGrid) {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (oldGrid[i][j].value !== newGrid[i][j].value) {
        return true;
      }
    }
  }
  return false;
}

function handleMove(direction, grid, setScore) {
  let newGrid = grid.map(row => row.map(cell => ({ ...cell, isNew: false, isMerged: false })));

  const rotateLeft = (matrix) => matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
  const rotateRight = (matrix) => matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());

  let scoreDelta = 0;

  switch (direction) {
    case 'up':
      newGrid = rotateLeft(newGrid);
      newGrid = newGrid.map(row => {
        const newRow = slideAndMerge(row);
        newRow.forEach(cell => {
          if (cell.isMerged) scoreDelta += cell.value;
        });
        return newRow;
      });
      newGrid = rotateRight(newGrid);
      break;
    case 'down':
      newGrid = rotateRight(newGrid);
      newGrid = newGrid.map(row => {
        const newRow = slideAndMerge(row);
        newRow.forEach(cell => {
          if (cell.isMerged) scoreDelta += cell.value;
        });
        return newRow;
      });
      newGrid = rotateLeft(newGrid);
      break;
    case 'left':
      newGrid = newGrid.map(row => {
        const newRow = slideAndMerge(row);
        newRow.forEach(cell => {
          if (cell.isMerged) scoreDelta += cell.value;
        });
        return newRow;
      });
      break;
    case 'right':
      newGrid = newGrid.map(row => {
        const newRow = slideAndMerge(row.reverse()).reverse();
        newRow.forEach(cell => {
          if (cell.isMerged) scoreDelta += cell.value;
        });
        return newRow;
      });
      break;
    default:
      return { grid, scoreDelta: 0 };
  }

  const hasChanged = hasGridChanged(grid, newGrid);

  if (hasChanged) {
    newGrid = addRandomTile(newGrid);
    setScore(prev => prev + scoreDelta);
  }

  return { grid: newGrid, scoreDelta };
}

function hasEmptyCell(grid) {
  return grid.some(row => row.some(cell => cell.value === 0));
}

function canMerge(grid) {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const value = grid[i][j].value;
      if (
        ((i < GRID_SIZE - 1 && value === grid[i + 1][j].value) ||
         (j < GRID_SIZE - 1 && value === grid[i][j + 1].value)) &&
        value !== 0
      ) {
        return true;
      }
    }
  }
  return false;
}

function isGameOver(grid) {
  return !hasEmptyCell(grid) && !canMerge(grid);
}

function GameBoard() {
  const [grid, setGrid] = useState(generateInitialGrid());
  const [gameOver, setGameOver] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isDisabled || gameOver) return;
      let direction = '';
      switch (event.key) {
        case 'ArrowUp':
          direction = 'up';
          break;
        case 'ArrowDown':
          direction = 'down';
          break;
        case 'ArrowLeft':
          direction = 'left';
          break;
        case 'ArrowRight':
          direction = 'right';
          break;
        default:
          return;
      }

      setIsDisabled(true);
      setTimeout(() => setIsDisabled(false), 0);

      setGrid(prev => {
        const { grid: movedGrid, scoreDelta } = handleMove(direction, prev, setScore);
        if (hasGridChanged(prev, movedGrid)) {
          if (isGameOver(movedGrid)) {
            setTimeout(() => setGameOver(true), 300);
          }
        }
        return movedGrid;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDisabled, gameOver]);

  function resetGame() {
    setGrid(generateInitialGrid());
    setGameOver(false);
    setScore(0);
  }

  return (
    <div
      style={{
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        backgroundColor: '#f0f2f5',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        width: '90vw',
        maxWidth: '500px',
        margin: 'auto'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: '20px'
        }}
      >
        <h2>2048</h2>
        <h3>Score: {score}</h3>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '20px',
          position: 'relative'
        }}
      >
        <div
          style={{
            width: '100%',
            aspectRatio: '1/1',
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gap: '10px',
            padding: '10px',
            filter: gameOver ? 'blur(3px)' : 'none',
            pointerEvents: gameOver ? 'none' : 'auto'
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Tile
                key={`${rowIndex}-${colIndex}-${cell.value}-${cell.isNew}-${cell.isMerged}`}
                value={cell.value}
                isNew={cell.isNew}
                isMerged={cell.isMerged}
              />
            ))
          )}
        </div>
        {gameOver && (
			<Modal
				title="Game Over"
				open={gameOver}
				centered
				onCancel={() => setGameOver(false)}
				footer={null} 
				closable={true} 
				>
				<p style={{ 
					fontSize: '18px', 
					textAlign: 'center',
					padding: '20px 20px' 
					}}>
						Your score: {score}
				</p>
			</Modal>

        )}
      </div>
      <Button
        onClick={resetGame}
        type="primary"
        style={{
          display: 'flex',
          fontSize: '24px',
          marginBottom: '40px',
          padding: '20px 20px 25px 20px'
        }}
      >
        Reset Game
      </Button>
    </div>
  );
}

export default GameBoard;