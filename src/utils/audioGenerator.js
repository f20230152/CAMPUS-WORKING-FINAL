// Audio generator for Swiggy Wrapped theme
// Loads and plays background music from audio file and sound effects

class AudioGenerator {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.isPlaying = false;
    this.backgroundMusic = null;
    this.musicSource = null;
    this.audioContextInitialized = false;
    this.userInteracted = false;
    this.pendingPlay = false;
    // Preload audio but don't initialize context until user interaction
    this.loadBackgroundMusic();
  }

  initAudioContext() {
    // Only initialize after user interaction
    if (this.audioContextInitialized || !this.userInteracted) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.4; // Master volume

      // Separate gain nodes for music and sound effects
      this.musicGain = this.audioContext.createGain();
      this.sfxGain = this.audioContext.createGain();
      this.musicGain.gain.value = 0.6;
      this.sfxGain.gain.value = 0.8;
      
      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.audioContextInitialized = true;
      console.log('Audio context initialized after user interaction');
    } catch (error) {
      console.error('Audio context initialization failed:', error);
    }
  }

  // Load background music file (preload only, no autoplay)
  loadBackgroundMusic() {
    try {
      // Try to load MPEG first, fallback to OGG
      // Use BASE_URL for GitHub Pages compatibility
      const baseUrl = import.meta.env.BASE_URL || '/';
      const musicPath = `${baseUrl}music/background-music.mpeg`;
      this.backgroundMusic = new Audio(musicPath);
      
      // CRITICAL: iOS requirements
      this.backgroundMusic.loop = true;
      this.backgroundMusic.preload = 'auto';
      this.backgroundMusic.volume = 0.4;
      this.backgroundMusic.playsInline = true; // iOS requirement
      this.backgroundMusic.setAttribute('playsinline', 'true'); // iOS requirement
      this.backgroundMusic.setAttribute('webkit-playsinline', 'true'); // iOS legacy
      // NO autoplay - playback only after user interaction
      
      // Handle audio element load success
      this.backgroundMusic.addEventListener('loadeddata', () => {
        console.log('Background music file loaded successfully (preloaded)');
        // Don't connect to Web Audio API until user interaction
      });

      // Handle audio element errors
      this.backgroundMusic.addEventListener('error', (e) => {
        console.error('Failed to load MPEG:', this.backgroundMusic.error);
        console.warn('Trying OGG fallback');
        try {
          const baseUrl = import.meta.env.BASE_URL || '/';
          const oggPath = `${baseUrl}music/background-music.ogg`;
          this.backgroundMusic = new Audio(oggPath);
          this.backgroundMusic.loop = true;
          this.backgroundMusic.preload = 'auto';
          this.backgroundMusic.volume = 0.4;
          this.backgroundMusic.playsInline = true;
          this.backgroundMusic.setAttribute('playsinline', 'true');
          this.backgroundMusic.setAttribute('webkit-playsinline', 'true');
          
          this.backgroundMusic.addEventListener('loadeddata', () => {
            console.log('OGG fallback loaded successfully (preloaded)');
          });
        } catch (oggError) {
          console.error('Failed to load OGG fallback:', oggError);
        }
      });
    } catch (error) {
      console.error('Failed to initialize background music:', error);
    }
  }

  // Connect audio element to Web Audio API (only once)
  connectToWebAudio() {
    if (this.musicSource || !this.audioContext || !this.backgroundMusic) {
      return;
    }

    try {
      // Only connect if audio is ready
      if (this.backgroundMusic.readyState >= 2) {
        this.musicSource = this.audioContext.createMediaElementSource(this.backgroundMusic);
        this.musicSource.connect(this.musicGain);
        console.log('Background music connected to Web Audio API');
      }
    } catch (error) {
      console.warn('Could not connect to Web Audio API, using direct audio playback:', error);
      // Will fall back to using audio element's volume property
    }
  }

  // Start playing background music (only after user interaction)
  startMusic() {
    if (!this.backgroundMusic) {
      console.warn('Background music not loaded');
      return;
    }
    
    if (this.isPlaying) {
      return;
    }
    
    // CRITICAL: Only play after user interaction
    if (!this.userInteracted) {
      console.log('Audio playback deferred until user interaction');
      this.pendingPlay = true;
      return;
    }
    
    try {
      // Initialize audio context if not already done (after user interaction)
      if (!this.audioContextInitialized) {
        this.initAudioContext();
      }
      
      // Ensure audio context is running
      if (this.audioContext) {
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume().then(() => {
            console.log('Audio context resumed');
            this.tryConnectAndPlay();
          }).catch(err => {
            console.error('Error resuming audio context:', err);
            // Try playing directly without Web Audio API
            this.playDirectly();
          });
        } else if (this.audioContext.state === 'running') {
          this.tryConnectAndPlay();
        } else {
          // Context not ready, try direct playback
          this.playDirectly();
        }
      } else {
        // Fallback: play directly without Web Audio API
        this.playDirectly();
      }
    } catch (error) {
      console.error('Error starting music:', error);
      this.isPlaying = false;
    }
  }

  tryConnectAndPlay() {
    // Try to connect to Web Audio API if not already connected
    this.connectToWebAudio();
    
    // Play the music
    this.isPlaying = true;
    const playPromise = this.backgroundMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log('Background music started playing');
      }).catch(error => {
        console.error('Error playing background music:', error);
        this.isPlaying = false;
      });
    }
  }

  playDirectly() {
    // Play directly without Web Audio API (fallback)
    this.isPlaying = true;
    const playPromise = this.backgroundMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log('Background music started playing (direct)');
      }).catch(error => {
        console.error('Error playing background music:', error);
        this.isPlaying = false;
      });
    }
  }

  pauseMusic() {
    if (this.backgroundMusic && this.isPlaying) {
      this.backgroundMusic.pause();
      this.isPlaying = false;
    }
  }

  stopMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.isPlaying = false;
    }
  }

  // Sound Effects - Disabled (only background music is used)
  playSoundEffect(type, options = {}) {
    // Sound effects disabled - only background music plays
    return;
  }

  // Set volume
  setVolume(volume) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  // Set music volume
  setMusicVolume(volume) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    
    // Use Web Audio API if connected
    if (this.musicGain && this.musicSource) {
      this.musicGain.gain.value = clampedVolume;
    } 
    // Fallback to direct audio element volume
    else if (this.backgroundMusic) {
      this.backgroundMusic.volume = clampedVolume;
    }
  }

  // Set SFX volume
  setSFXVolume(volume) {
    if (this.sfxGain) {
      this.sfxGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  // Resume audio context (required after user interaction)
  // This must be called on first user gesture (touchstart/click)
  resume() {
    // Mark that user has interacted
    this.userInteracted = true;
    
    // Initialize audio context if not already done
    if (!this.audioContextInitialized) {
      this.initAudioContext();
    }
    
    if (this.audioContext) {
      if (this.audioContext.state === 'suspended') {
        return this.audioContext.resume().then(() => {
          console.log('Audio context resumed after user interaction');
          // If there was a pending play request, start music now
          if (this.pendingPlay) {
            this.pendingPlay = false;
            this.startMusic();
          }
          return Promise.resolve();
        }).catch(err => {
          console.error('Error resuming audio context:', err);
          // Still try to play directly if Web Audio fails
          if (this.pendingPlay) {
            this.pendingPlay = false;
            this.playDirectly();
          }
          return Promise.reject(err);
        });
      } else if (this.audioContext.state === 'running') {
        // Context already running, start music if pending
        if (this.pendingPlay) {
          this.pendingPlay = false;
          this.startMusic();
        }
        return Promise.resolve();
      }
    }
    
    // If no audio context, try direct playback
    if (this.pendingPlay) {
      this.pendingPlay = false;
      this.playDirectly();
    }
    
    return Promise.resolve();
  }
}

// Export singleton instance - ensures audio state persists across screen transitions
let audioGeneratorInstance = null;

export const getAudioGenerator = () => {
  if (!audioGeneratorInstance) {
    audioGeneratorInstance = new AudioGenerator();
    console.log('Audio generator singleton created');
  }
  return audioGeneratorInstance;
};

// Ensure audio state persists - prevent garbage collection
if (typeof window !== 'undefined') {
  // Keep reference to prevent GC
  window.__audioGeneratorInstance = () => audioGeneratorInstance;
}

export default AudioGenerator;

