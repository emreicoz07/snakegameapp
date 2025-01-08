import React from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type Props = {
  visible: boolean;
  score: number;
  onRestart: () => void;
};

export function GameOverModal({ visible, score, onRestart }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <ThemedView style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText style={styles.title}>Game Over!</ThemedText>
          <ThemedText style={styles.score}>Score: {score}</ThemedText>
          <TouchableOpacity style={styles.button} onPress={onRestart}>
            <ThemedText style={styles.buttonText}>Play Again</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 