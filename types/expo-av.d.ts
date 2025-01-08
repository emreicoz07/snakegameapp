declare module 'expo-av' {
  export namespace Audio {
    export class Sound {
      static createAsync(
        source: any,
        initialStatus?: any,
        onPlaybackStatusUpdate?: Function,
        downloadFirst?: boolean
      ): Promise<{ sound: Sound; status: any }>;

      loadAsync(
        source: any,
        initialStatus?: any,
        downloadFirst?: boolean
      ): Promise<void>;

      unloadAsync(): Promise<void>;
      playAsync(): Promise<void>;
      replayAsync(): Promise<void>;
      pauseAsync(): Promise<void>;
      stopAsync(): Promise<void>;
      setVolumeAsync(volume: number): Promise<void>;
    }
  }
} 