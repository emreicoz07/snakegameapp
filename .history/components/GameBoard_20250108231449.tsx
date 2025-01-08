import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { GRID_SIZE, CELL_SIZE, GAME_SPEED } from '@/constants/game';
import type { GameState, Direction, Position } from '@/types/game';

type Props = {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
};

export function GameBoard({ gameState, setGameState }: Props) {
  const handleDirectionChange = (newDirection: Direction) => {
    if (gameState.isGameOver) return;
    
    // Zıt yönlere geçişi engelle
    if (
      (newDirection === 'UP' && gameState.direction === 'DOWN') ||
      (newDirection === 'DOWN' && gameState.direction === 'UP') ||
      (newDirection === 'LEFT' && gameState.direction === 'RIGHT') ||
      (newDirection === 'RIGHT' && gameState.direction === 'LEFT')
    ) {
      return;
    }

    setGameState(prev => ({ ...prev, direction: newDirection }));
  };

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
    <View style={styles.container}>
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
      
      <View style={styles.controls}>
        <View style={styles.controlRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handleDirectionChange('UP')}
          >
            <Text style={styles.controlText}>↑</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.controlRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handleDirectionChange('LEFT')}
          >
            <Text style={styles.controlText}>←</Text>
          </TouchableOpacity>
          <View style={styles.controlSpacer} />
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handleDirectionChange('RIGHT')}
          >
            <Text style={styles.controlText}>→</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.controlRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handleDirectionChange('DOWN')}
          >
            <Text style={styles.controlText}>↓</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
  container: {
    alignItems: 'center',
    gap: 20,
  },
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
  controls: {
    gap: 10,
  },
  controlRow: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
  },
  controlButton: {
    width: 50,
    height: 50,
    backgroundColor: '#2196F3',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    color: 'white',
    fontSize: 24,
  },
  controlSpacer: {
    width: 50,
  },
}); 