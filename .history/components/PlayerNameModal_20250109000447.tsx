import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';

type Props = {
  visible: boolean;
  onSubmit: (playerName: string) => void;
};

export function PlayerNameModal({ visible, onSubmit }: Props) {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = () => {
    if (playerName.trim()) {
      onSubmit(playerName.trim());
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Hoş Geldiniz!</Text>
          <Text style={styles.subtitle}>Oyuna başlamadan önce adınızı girin</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Adınız"
            value={playerName}
            onChangeText={setPlayerName}
            autoFocus={Platform.OS !== 'ios'} // iOS'ta otomatik fokus kapatıldı
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
          
          <TouchableOpacity
            style={[
              styles.button,
              !playerName.trim() && styles.buttonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!playerName.trim()}
          >
            <Text style={styles.buttonText}>Başla</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 