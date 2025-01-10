import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export function Scoreboard({ score = 0 }) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.score}>Score: {score}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 