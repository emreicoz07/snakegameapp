import { Audio } from 'expo-av';

class SoundService {
  private sounds: {
    eat?: Audio.Sound;
    gameOver?: Audio.Sound;
    move?: Audio.Sound;
  } = {};

  async loadSounds() {
    try {
      const eatSound = new Audio.Sound();
      const gameOverSound = new Audio.Sound();
      const moveSound = new Audio.Sound();

      await Promise.all([
        eatSound.loadAsync(require('../assets/sounds/eat.mp3')),
        gameOverSound.loadAsync(require('../assets/sounds/game-over.mp3')),
        moveSound.loadAsync(require('../assets/sounds/move.mp3'))
      ]);

      // Ses seviyelerini ayarla
      await Promise.all([
        eatSound.setVolumeAsync(0.5),
        gameOverSound.setVolumeAsync(0.7),
        moveSound.setVolumeAsync(0.3)
      ]);

      this.sounds = {
        eat: eatSound,
        gameOver: gameOverSound,
        move: moveSound
      };

      console.log('All sounds loaded successfully');
    } catch (error) {
      console.error('Error loading sounds:', error);
    }
  }

  async playSound(type: 'eat' | 'gameOver' | 'move') {
    try {
      console.log(`Playing ${type} sound...`);
      const sound = this.sounds[type];
      if (sound) {
        await sound.replayAsync();
        console.log(`${type} sound played successfully`);
      } else {
        console.warn(`${type} sound not found`);
      }
    } catch (error) {
      console.error(`Error playing ${type} sound:`, error);
    }
  }

  async unloadSounds() {
    try {
      await Promise.all(
        Object.values(this.sounds).map(sound => sound?.unloadAsync())
      );
    } catch (error) {
      console.error('Error unloading sounds:', error);
    }
  }
}

export const soundService = new SoundService();