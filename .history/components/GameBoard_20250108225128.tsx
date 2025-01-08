import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { GRID_SIZE, CELL_SIZE, GAME_SPEED } from '@/constants/game';
import type { GameState, Direction, Position } from '@/types/game';

type Props = {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
};

export function GameBoard({ gameState, setGameState }: Props) {
  const panGesture = Gesture.Pan()
    .onEnd((event) => {
      const { translationX, translationY } = event;
      let newDirection: Direction = gameState.direction;

      if (Math.abs(translationX) > Math.abs(translationY)) {
        newDirection = translationX > 0 ? 'RIGHT' : 'LEFT';
      } else {
        newDirection = translationY > 0 ? 'DOWN' : 'UP';
      }

      setGameState(prev => ({ ...prev, direction: newDirection }));
    });

  useEffect(() => {
    if (gameState.isGameOver) return;

    const gameLoop = setInterval(() => {
      moveSnake();
    }, GAME_SPEED);

    return () => clearInterval(gameLoop);
  }, [gameState]);

  const moveSnake = useCallback(() => {
    setGameState(prev => {
      const head = { ...prev.snake[0] };
      
      switch (prev.direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Collision detection
      if (isCollision(head, prev.snake)) {
        return { ...prev, isGameOver: true };
      }

      const newSnake = [head, ...prev.snake];
      
      // Food collision check
      if (head.x === prev.food.x && head.y === prev.food.y) {
        return {
          ...prev,
          snake: newSnake,
          food: generateFood(newSnake),
          score: prev.score + 10,
        };
      }

      newSnake.pop();
      return { ...prev, snake: newSnake };
    });
  }, []);

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.board}>
        {gameState.snake.map((segment, index) => (
          <View
            key={index}
            style={[
              styles.cell,
              styles.snake,
              {
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
              },
            ]}
          />
        ))}
        <View
          style={[
            styles.cell,
            styles.food,
            {
              left: gameState.food.x * CELL_SIZE,
              top: gameState.food.y * CELL_SIZE,
            },
          ]}
        />
      </View>
    </GestureDetector>
  );
}

function generateFood(snake: Position[]): Position {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
  return food;
}

function isCollision(head: Position, snake: Position[]): boolean {
  // Duvarlarla çarpışma kontrolü
  if (
    head.x < 0 ||
    head.x >= GRID_SIZE ||
    head.y < 0 ||
    head.y >= GRID_SIZE
  ) {
    return true;
  }

  // Yılanın kendisiyle çarpışma kontrolü (baş hariç)
  return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

const styles = StyleSheet.create({
  board: {
    width: GRID_SIZE * CELL_SIZE,
    height: GRID_SIZE * CELL_SIZE,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'relative',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    position: 'absolute',
  },
  snake: {
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  food: {
    backgroundColor: '#F44336',
    borderRadius: CELL_SIZE / 2,
  },
}); 