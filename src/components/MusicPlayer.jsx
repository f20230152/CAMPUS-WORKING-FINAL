import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { getAudioGenerator } from '../utils/audioGenerator';
import styles from '../styles/MusicPlayer.module.css';

function MusicPlayer({ currentScreen, isPlaying, onPlayStateChange }) {
  const audioGeneratorRef = useRef(null);
  const [volume, setVolume] = useState(0.4); // Default volume at 40%
  const [isMuted, setIsMuted] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Initialize audio generator
  useEffect(() => {
    audioGeneratorRef.current = getAudioGenerator();
    
    return () => {
      if (audioGeneratorRef.current) {
        audioGeneratorRef.current.stopMusic();
      }
    };
  }, []);

  // Handle initial user interaction for autoplay
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasUserInteracted && audioGeneratorRef.current) {
        setHasUserInteracted(true);
        // Resume audio context first, then start music
        audioGeneratorRef.current.resume().then(() => {
          if (isPlaying && audioGeneratorRef.current) {
            audioGeneratorRef.current.startMusic();
          }
        }).catch(err => {
          console.error('Failed to resume audio context:', err);
          // Try starting music anyway (might work without Web Audio API)
          if (isPlaying && audioGeneratorRef.current) {
            audioGeneratorRef.current.startMusic();
          }
        });
      }
    };

    // Listen for any user interaction
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction);
      });
    };
  }, [hasUserInteracted, isPlaying]);

  // Keep music playing - only sync volume with screen changes
  useEffect(() => {
    if (!audioGeneratorRef.current || !hasUserInteracted) return;

    // Always ensure music is playing (never pause)
    if (!audioGeneratorRef.current.isPlaying) {
      audioGeneratorRef.current.startMusic();
    }

    // Add subtle volume variations based on screen type
    const targetVolume = isMuted ? 0 : volume;
    let screenVolume = targetVolume;

    if (currentScreen === 0) {
      // Intro - start with lower volume, build up
      screenVolume = targetVolume * 0.7;
    } else if (currentScreen >= 1 && currentScreen <= 7) {
      // Stat screens - normal volume with slight variations
      const variation = 0.85 + (Math.random() * 0.15); // 85-100% of volume
      screenVolume = targetVolume * variation;
    } else {
      // Outro - maintain energy
      screenVolume = targetVolume;
    }

    // Animate volume
    const volumeObj = { value: audioGeneratorRef.current.musicGain ? audioGeneratorRef.current.musicGain.gain.value : targetVolume };
    gsap.to(volumeObj, {
      value: screenVolume,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        if (audioGeneratorRef.current) {
          audioGeneratorRef.current.setMusicVolume(volumeObj.value);
        }
      }
    });
  }, [currentScreen, volume, hasUserInteracted, isMuted]);

  // Handle volume changes
  useEffect(() => {
    if (audioGeneratorRef.current) {
      const targetVolume = isMuted ? 0 : volume;
      audioGeneratorRef.current.setMusicVolume(targetVolume);
    }
  }, [volume, isMuted]);

  const toggleMute = (e) => {
    e.stopPropagation(); // Prevent triggering screen touch handler
    setIsMuted(!isMuted);
  };

  const handleControlsClick = (e) => {
    e.stopPropagation(); // Prevent triggering screen touch handler
  };

  return (
    <div className={styles.musicControls} onClick={handleControlsClick} onTouchStart={handleControlsClick}>
      <button
        className={styles.muteButton}
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}

export default MusicPlayer;

