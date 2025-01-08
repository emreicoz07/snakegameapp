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

      console.log('Loading sounds...');
      
      await Promise.all([
        eatSound.loadAsync(require('../assets/sounds/eat.mp3'))
          .then(() => console.log('Eat sound loaded'))
          .catch(err => console.error('Error loading eat sound:', err)),
          
        gameOverSound.loadAsync(require('../assets/sounds/game-over.mp3'))
          .then(() => console.log('Game over sound loaded'))
          .catch(err => console.error('Error loading game over sound:', err)),
          
        moveSound.loadAsync(require('../assets/sounds/move.mp3'))
          .then(() => console.log('Move sound loaded'))
          .catch(err => console.error('Error loading move sound:', err))
      ]);

      this.sounds = {
        eat: eatSound,
        gameOver: gameOverSound,
        move: moveSound,
      };
      
      console.log('All sounds loaded successfully');
    } catch (error) {
      console.error('Error in loadSounds:', error);
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