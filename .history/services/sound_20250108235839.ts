import { Audio } from 'expo-av';
import { Platform } from 'react-native';

class SoundService {
  private sounds: {
    eat?: Audio.Sound;
    gameOver?: Audio.Sound;
    move?: Audio.Sound;
  } = {};

  private isLoaded = false;
  private audioElements: { [key: string]: globalThis.HTMLAudioElement } = {};

  async loadSounds() {
    if (this.isLoaded) return;

    try {
      console.log('Loading sounds...');
      
      if (Platform.OS === 'web') {
        // Web için HTML5 Audio kullan
        const eatSound = require('../assets/sounds/eat.mp3');
        const gameOverSound = require('../assets/sounds/game-over.mp3');
        const moveSound = require('../assets/sounds/move.mp3');

        console.log('Sound files:', { eatSound, gameOverSound, moveSound });

        this.audioElements = {
          eat: new globalThis.Audio(eatSound),
          gameOver: new globalThis.Audio(gameOverSound),
          move: new globalThis.Audio(moveSound)
        };

        // Ses seviyelerini ayarla
        this.audioElements.eat.volume = 0.5;
        this.audioElements.gameOver.volume = 0.7;
        this.audioElements.move.volume = 0.3;
      } else {
        // Native platformlar için expo-av kullan
        try {
          const [eatSound, gameOverSound, moveSound] = await Promise.all([
            Audio.Sound.createAsync(require('../assets/sounds/eat.mp3')),
            Audio.Sound.createAsync(require('../assets/sounds/game-over.mp3')),
            Audio.Sound.createAsync(require('../assets/sounds/move.mp3'))
          ]);

          console.log('Native sounds loaded:', { eatSound, gameOverSound, moveSound });

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
        } catch (error) {
          console.error('Error loading native sounds:', error);
          throw error;
        }
      }

      this.isLoaded = true;
      console.log('All sounds loaded successfully');
    } catch (error) {
      console.error('Error loading sounds:', error);
      this.isLoaded = false;
      throw error;
    }
  }

  async playSound(type: 'eat' | 'gameOver' | 'move') {
    try {
      console.log(`Playing ${type} sound...`);
      
      if (Platform.OS === 'web') {
        // Web için HTML5 Audio kullan
        const audio = this.audioElements[type];
        if (audio) {
          audio.currentTime = 0; // Sesi başa sar
          await audio.play();
          console.log(`${type} sound played successfully`);
        } else {
          console.warn(`${type} sound not found`);
        }
      } else {
        // Native platformlar için expo-av kullan
        const sound = this.sounds[type];
        if (sound) {
          await sound.stopAsync();
          await sound.replayAsync(); // setPositionAsync yerine replayAsync kullan
          console.log(`${type} sound played successfully`);
        } else {
          console.warn(`${type} sound not found`);
        }
      }
    } catch (error) {
      console.error(`Error playing ${type} sound:`, error);
    }
  }

  async unloadSounds() {
    if (!this.isLoaded) return;

    try {
      if (Platform.OS === 'web') {
        // Web için ses elementlerini temizle
        Object.values(this.audioElements).forEach(audio => {
          audio.pause();
          audio.src = '';
        });
        this.audioElements = {};
      } else {
        // Native platformlar için expo-av unload
        await Promise.all(
          Object.values(this.sounds).map(sound => sound?.unloadAsync())
        );
        this.sounds = {};
      }
      
      this.isLoaded = false;
      console.log('Sounds unloaded successfully');
    } catch (error) {
      console.error('Error unloading sounds:', error);
    }
  }
}

export const soundService = new SoundService();