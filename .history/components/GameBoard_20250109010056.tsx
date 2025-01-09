import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, Dimensions } from 'react-native';
import { GRID_SIZE, CELL_SIZE, BASE_SPEED, SPEED_INCREMENT } from '@/constants/game';
import type { GameState, Direction, Position } from '@/types/game';
import { soundService } from '@/services/sound';
import { Joystick } from './Joystick';

type Props = {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
};

export function GameBoard({ gameState, setGameState }: Props) {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  
  const scale = useMemo(() => {
    const maxGameWidth = GRID_SIZE * CELL_SIZE;
    const padding = 32;
    const maxHeight = screenHeight - 300;
    
    const scaleByWidth = (screenWidth - padding) / maxGameWidth;
    const scaleByHeight = maxHeight / maxGameWidth;
    
    return Math.min(1, Math.min(scaleByWidth, scaleByHeight));
  }, [screenWidth, screenHeight]);

  // Ölçeklendirilmiş hücre boyutu
  const scaledCellSize = CELL_SIZE * scale;

  // Oyun alanı boyutları
  const gameWidth = GRID_SIZE * scaledCellSize;
  const gameHeight = GRID_SIZE * scaledCellSize;

  // Pozisyon hesaplama fonksiyonu
  const getPosition = (pos: Position) => ({
    left: pos.x * scaledCellSize,
    top: pos.y * scaledCellSize,
    width: scaledCellSize,
    height: scaledCellSize,
  });

  useEffect(() => {
    const initSounds = async () => {
      console.log('Initializing sounds...');
      try {
        await soundService.loadSounds();
        console.log('Sounds initialized successfully');
      } catch (error) {
        console.error('Error initializing sounds:', error);
      }
    };

    initSounds();

    return () => {
      soundService.unloadSounds().catch(error => {
        console.error('Error unloading sounds:', error);
      });
    };
  }, []);

  const playSoundEffect = async (type: 'eat' | 'gameOver' | 'move') => {
    try {
      if (!soundService.isLoaded) {
        console.log('Reloading sounds...');
        await soundService.loadSounds();
      }
      await soundService.playSound(type);
    } catch (error) {
      console.error(`Error playing ${type} sound:`, error);
    }
  };

  const handleDirectionChange = async (newDirection: Direction) => {
    if (gameState.isGameOver) return;
    
    if (
      (newDirection === 'UP' && gameState.direction === 'DOWN') ||
      (newDirection === 'DOWN' && gameState.direction === 'UP') ||
      (newDirection === 'LEFT' && gameState.direction === 'RIGHT') ||
      (newDirection === 'RIGHT' && gameState.direction === 'LEFT')
    ) {
      return;
    }

    await playSoundEffect('move');
    setGameState(prev => ({ ...prev, direction: newDirection }));
  };

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (gameState.isGameOver) return;

        event.preventDefault();

        switch (event.key.toLowerCase()) {
          case 'arrowup':
          case 'w':
            handleDirectionChange('UP');
            break;
          case 'arrowdown':
          case 's':
            handleDirectionChange('DOWN');
            break;
          case 'arrowleft':
          case 'a':
            handleDirectionChange('LEFT');
            break;
          case 'arrowright':
          case 'd':
            handleDirectionChange('RIGHT');
            break;
        }
      };

      window.addEventListener('keyup', handleKeyPress);
      return () => window.removeEventListener('keyup', handleKeyPress);
    }
  }, [gameState.isGameOver, handleDirectionChange]);

  useEffect(() => {
    if (gameState.isGameOver) return;

    const currentSpeed = Math.max(
      BASE_SPEED - (gameState.snake.length - 3) * SPEED_INCREMENT,
      100
    );

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
          playSoundEffect('gameOver');
          clearInterval(gameLoop);
          return { ...prevState, isGameOver: true };
        }

        if (head.x === prevState.food.x && head.y === prevState.food.y) {
          playSoundEffect('eat');
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
    }, currentSpeed);

    return () => clearInterval(gameLoop);
  }, [gameState.isGameOver, gameState.snake.length]);

  return (
    <View style={styles.container}>
      <View style={[styles.gameBoard, { width: gameWidth, height: gameHeight }]}>
        {gameState.snake.map((segment, index) => (
          <View
            key={`${segment.x}-${segment.y}`}
            style={[
              styles.cell,
              styles.snake,
              getPosition(segment),
            ]}
          />
        ))}
        <View
          style={[
            styles.cell,
            styles.food,
            getPosition(gameState.food),
          ]}
        />
      </View>

      {Platform.OS !== 'web' && (
        <Joystick onDirectionChange={handleDirectionChange} />
      )}
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  gameBoard: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'relative',
    marginTop: -40,
  },
  cell: {
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
    marginTop: 20,
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