import { View, Text, StyleSheet } from 'react-native';

type Props = {
  score: number;
  playerName: string;
};

export function Scoreboard({ score, playerName }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.playerName}>{playerName}</Text>
      <Text style={styles.score}>Skor: {score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 