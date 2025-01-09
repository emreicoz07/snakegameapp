import { Audio } from 'expo-av';
import { Platform } from 'react-native';

class SoundService {
  private sounds: {
    eat?: Audio.Sound;
    gameOver?: Audio.Sound;
    move?: Audio.Sound;
  } = {};

  private _isLoaded = false;
  private audioElements: { [key: string]: globalThis.HTMLAudioElement } = {};

  get isLoaded(): boolean {
    return this._isLoaded;
  }

  async loadSounds() {
    if (this._isLoaded) return;

    try {
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
        const loadSound = async (source: any) => {
          try {
            const { sound } = await Audio.Sound.createAsync(source, {
              shouldPlay: false,
              volume: 1.0,
            });
            return sound;
          } catch (error) {
            console.warn('Failed to load sound:', error);
            return undefined;
          }
        };

        // Her sesi ayrı ayrı yükle
        const [eatSound, gameOverSound, moveSound] = await Promise.all([
          loadSound(require('../assets/sounds/eat.mp3')),
          loadSound(require('../assets/sounds/game-over.mp3')),
          loadSound(require('../assets/sounds/move.mp3')),
        ]);

        this.sounds = {
          eat: eatSound,
          gameOver: gameOverSound,
          move: moveSound,
        };
      }

      this._isLoaded = true;
    } catch (error) {
      console.warn('Error loading sounds:', error);
      // Ses yüklenemese bile uygulamanın çalışmasına devam et
      this._isLoaded = false;
    }
  }

  async playSound(type: 'eat' | 'gameOver' | 'move') {
    try {
      if (!this._isLoaded) {
        console.warn('Sounds not loaded yet');
        return;
      }

      if (Platform.OS === 'web') {
        const audio = this.audioElements[type];
        if (audio) {
          audio.currentTime = 0;
          await audio.play();
        }
      } else {
        const sound = this.sounds[type];
        if (sound) {
          try {
            // Sesi durdurmak yerine direkt olarak baştan çalalım
            await sound.replayAsync().catch(() => {});
          } catch (error) {
            console.warn(`Failed to play ${type} sound:`, error);
          }
        }
      }
    } catch (error) {
      console.warn(`Error playing ${type} sound:`, error);
    }
  }

  async unloadSounds() {
    if (!this._isLoaded) return;

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
      
      this._isLoaded = false;
      console.log('Sounds unloaded successfully');
    } catch (error) {
      console.error('Error unloading sounds:', error);
    }
  }
}

export const soundService = new SoundService();