import { Audio } from 'expo-av';

class SoundService {
  private sounds: {
    eat?: Audio.Sound;
    gameOver?: Audio.Sound;
    move?: Audio.Sound;
  } = {};

  private isLoaded = false;

  async loadSounds() {
    if (this.isLoaded) return;

    try {
      console.log('Loading sounds...');
      
      // Gerçek ses dosyalarını yükle
      const [eatSound, gameOverSound, moveSound] = await Promise.all([
        Audio.Sound.createAsync(require('../assets/sounds/eat.mp3')),
        Audio.Sound.createAsync(require('../assets/sounds/game-over.mp3')),
        Audio.Sound.createAsync(require('../assets/sounds/move.mp3'))
      ]);

      // Ses seviyelerini ayarla
      await Promise.all([
        eatSound.sound.setVolumeAsync(0.5),
        gameOverSound.sound.setVolumeAsync(0.7),
        moveSound.sound.setVolumeAsync(0.3)
      ]);

      this.sounds = {
        eat: eatSound.sound,
        gameOver: gameOverSound.sound,
        move: moveSound.sound
      };

      this.isLoaded = true;
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
        await sound.stopAsync(); // Önceki sesi durdur
        await sound.setPositionAsync(0); // Başa sar
        await sound.playAsync(); // Yeni sesi çal
        console.log(`${type} sound played successfully`);
      } else {
        console.warn(`${type} sound not found`);
      }
    } catch (error) {
      console.error(`Error playing ${type} sound:`, error);
    }
  }

  async unloadSounds() {
    if (!this.isLoaded) return;

    try {
      await Promise.all(
        Object.values(this.sounds).map(sound => sound?.unloadAsync())
      );
      this.sounds = {};
      this.isLoaded = false;
      console.log('Sounds unloaded successfully');
    } catch (error) {
      console.error('Error unloading sounds:', error);
    }
  }
}

export const soundService = new SoundService();