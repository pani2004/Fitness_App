
export class ElevenLabsTTS {
  private apiKey: string;
  private voiceId: string = '21m00Tcm4TlvDq8ikWAM'; 
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private isPaused: boolean = false;
  private pauseTime: number = 0;
  private startTime: number = 0;
  private audioBuffer: AudioBuffer | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  async speak(text: string, options?: {
    voiceId?: string;
    onEnd?: () => void;
    onError?: (error: Error) => void;
  }): Promise<void> {
    try {
      console.log('🎙️ ElevenLabs TTS: Generating audio...');
      console.log('📝 Text length:', text.length, 'characters');

      const voiceId = options?.voiceId || this.voiceId;

      // Call ElevenLabs API
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey,
          },
          body: JSON.stringify({
            text: text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`ElevenLabs API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      console.log('✅ Audio generated, loading...');

      // Get audio data
      const audioData = await response.arrayBuffer();
      
      if (!this.audioContext) {
        throw new Error('AudioContext not initialized');
      }

      // Decode audio
      this.audioBuffer = await this.audioContext.decodeAudioData(audioData);
      console.log('✅ Audio decoded, duration:', this.audioBuffer.duration.toFixed(2), 'seconds');

      // Play audio
      this.playBuffer(options?.onEnd, options?.onError);

    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      if (options?.onError) {
        options.onError(error as Error);
      }
      throw error;
    }
  }

  private playBuffer(onEnd?: () => void, onError?: (error: Error) => void): void {
    if (!this.audioContext || !this.audioBuffer) {
      console.error(' No audio context or buffer');
      return;
    }

    // Stop any current playback
    this.stop();

    // Create source
    this.currentSource = this.audioContext.createBufferSource();
    this.currentSource.buffer = this.audioBuffer;
    this.currentSource.connect(this.audioContext.destination);

    // Set up end callback
    this.currentSource.onended = () => {
      console.log('🏁 Audio playback finished');
      if (!this.isPaused && onEnd) {
        onEnd();
      }
    };

    // Start playback
    this.currentSource.start(0, this.pauseTime);
    this.startTime = this.audioContext.currentTime - this.pauseTime;
    this.isPaused = false;

    console.log('🔊 Playing audio...');
  }

  pause(): void {
    if (this.currentSource && this.audioContext && !this.isPaused) {
      console.log(' Pausing audio');
      this.pauseTime = this.audioContext.currentTime - this.startTime;
      this.currentSource.stop();
      this.isPaused = true;
    }
  }

  resume(onEnd?: () => void, onError?: (error: Error) => void): void {
    if (this.isPaused && this.audioBuffer) {
      console.log(' Resuming audio');
      this.playBuffer(onEnd, onError);
    }
  }

  stop(): void {
    if (this.currentSource) {
      console.log(' Stopping audio');
      try {
        this.currentSource.stop();
      } catch (e) {
      }
      this.currentSource = null;
    }
    this.pauseTime = 0;
    this.isPaused = false;
    this.audioBuffer = null;
  }

  isPlaying(): boolean {
    return this.currentSource !== null && !this.isPaused;
  }

  isPausedState(): boolean {
    return this.isPaused;
  }
  static getAvailableVoices() {
    return [
      { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Calm, young female' },
      { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', description: 'Strong, young female' },
      { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Soft, young female' },
      { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', description: 'Well-rounded, young male' },
      { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', description: 'Emotional, young female' },
      { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', description: 'Deep, young male' },
      { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', description: 'Crisp, middle-aged male' },
      { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'Deep, middle-aged male' },
      { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', description: 'Raspy, young male' },
    ];
  }
}

// Singleton instance
let elevenLabsInstance: ElevenLabsTTS | null = null;

export function getElevenLabsInstance(apiKey?: string): ElevenLabsTTS {
  if (!elevenLabsInstance) {
    if (!apiKey) {
      throw new Error('ElevenLabs API key is required for first initialization');
    }
    elevenLabsInstance = new ElevenLabsTTS(apiKey);
  }
  return elevenLabsInstance;
}
