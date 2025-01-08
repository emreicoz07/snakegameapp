import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { GameBoard } from '@/components/GameBoard';
import { Scoreboard } from '@/components/Scoreboard';
import { GameOverModal } from '@/components/GameOverModal';
import { PlayerNameModal } from '@/components/PlayerNameModal';
import { ThemedView } from '@/components/ThemedView';
import type { GameState } from '@/types/game';
import { INITIAL_SNAKE_POSITION } from '@/constants/game';

export default function GameScreen() {
  const [showNameModal, setShowNameModal] = useState(true);
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE_POSITION,
    food: { x: 10, y: 10 },
    direction: 'RIGHT',
    isGameOver: false,
    score: 0,
    isPlaying: false,
    playerName: '',
  });

  const handleNameSubmit = (name: string) => {
    setGameState(prev => ({ ...prev, playerName: name }));
    setShowNameModal(false);
  };

  const handleRestart = () => {
    setGameState({
      snake: INITIAL_SNAKE_POSITION,
      food: { x: 10, y: 10 },
      direction: 'RIGHT',
      isGameOver: false,
      score: 0,
      isPlaying: false,
      playerName: gameState.playerName,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <Scoreboard score={gameState.score} playerName={gameState.playerName} />
        <GameBoard gameState={gameState} setGameState={setGameState} />
        <GameOverModal 
          visible={gameState.isGameOver} 
          score={gameState.score}
          playerName={gameState.playerName}
          onRestart={handleRestart}
        />
        <PlayerNameModal
          visible={showNameModal}
          onSubmit={handleNameSubmit}
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
