import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { GameBoard } from '@/components/GameBoard';
import { Scoreboard } from '@/components/Scoreboard';
import { GameOverModal } from '@/components/GameOverModal';
import { ThemedView } from '@/components/ThemedView';
import type { GameState } from '@/types/game';
import { INITIAL_SNAKE_POSITION } from '@/constants/game';

export default function GameScreen() {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE_POSITION,
    food: { x: 10, y: 10 }, // Başlangıç yemi pozisyonu
    direction: 'RIGHT',
    isGameOver: false,
    score: 0,
  });

  const handleRestart = () => {
    setGameState({
      snake: INITIAL_SNAKE_POSITION,
      food: { x: 10, y: 10 },
      direction: 'RIGHT',
      isGameOver: false,
      score: 0,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <Scoreboard score={gameState.score} />
        <GameBoard gameState={gameState} setGameState={setGameState} />
        <GameOverModal 
          visible={gameState.isGameOver} 
          score={gameState.score}
          onRestart={handleRestart}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
});
