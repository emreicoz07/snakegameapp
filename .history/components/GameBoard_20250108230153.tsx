import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { GRID_SIZE, CELL_SIZE, GAME_SPEED } from '@/constants/game';
import type { GameState, Direction, Position } from '@/types/game';

type Props = {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
};

export function GameBoard({ gameState, setGameState }: Props) {
  const panGesture = Gesture.Pan()
    .onStart(() => {
      if (gameState.isGameOver) return;
    })
    .onUpdate((event) => {
      if (gameState.isGameOver) return;
      
      const { translationX, translationY } = event;
      let newDirection: Direction = gameState.direction;

      if (Math.abs(translationX) > Math.abs(translationY)) {
        if (translationX > 0 && gameState.direction !== 'LEFT') {
          newDirection = 'RIGHT';
        }
        else if (translationX < 0 && gameState.direction !== 'RIGHT') {
          newDirection = 'LEFT';
        }
      }
      else {
        if (translationY > 0 && gameState.direction !== 'UP') {
          newDirection = 'DOWN';
        }
        else if (translationY < 0 && gameState.direction !== 'DOWN') {
          newDirection = 'UP';
        }
      }

      if (newDirection !== gameState.direction) {
        setGameState(prev => ({ ...prev, direction: newDirection }));
      }
    });

  useEffect(() => {
    if (gameState.isGameOver) return;

    const gameLoop = setInterval(() => {
      setGameState(prevState => {
        const newSnake = [...prevState.snake];
        const head = { ...newSnake[0] };

        switch (prevState.direction) {
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
        }

        if (isCollision(head, newSnake)) {
          clearInterval(gameLoop);
          return { ...prevState, isGameOver: true };
        }

        if (head.x === prevState.food.x && head.y === prevState.food.y) {
          newSnake.unshift(head);
          return {
            ...prevState,
            snake: newSnake,
            food: generateFood(newSnake),
            score: prevState.score + 1,
          };
        }

        newSnake.unshift(head);
        newSnake.pop();

        return { ...prevState, snake: newSnake };
      });
    }, GAME_SPEED);

    return () => clearInterval(gameLoop);
  }, [gameState.isGameOver]);

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
  if (
    head.x < 0 ||
    head.x >= GRID_SIZE ||
    head.y < 0 ||
    head.y >= GRID_SIZE
  ) {
    return true;
  }

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