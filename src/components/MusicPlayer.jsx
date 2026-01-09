import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { getAudioGenerator } from '../utils/audioGenerator';
import styles from '../styles/MusicPlayer.module.css';

function MusicPlayer({ currentScreen, isPlaying, onPlayStateChange }) {
  const audioGeneratorRef = useRef(null);
  const [volume, setVolume] = useState(0.4); // Default volume at 40%
  const [isMuted, setIsMuted] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);

  // Initialize audio generator
  useEffect(() => {
    audioGeneratorRef.current = getAudioGenerator();
    
    return () => {
      if (audioGeneratorRef.current) {
        audioGeneratorRef.current.stopMusic();
      }
    };
  }, []);

  // Handle initial user interaction for audio unlock (iOS requirement)
  useEffect(() => {
    const handleFirstInteraction = (e) => {
      if (!hasUserInteracted && audioGeneratorRef.current) {
        setHasUserInteracted(true);
        
        // Detect iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        
        // Mark user interaction immediately
        audioGeneratorRef.current.userInteracted = true;
        
        if (isIOS) {
          // iOS: Play immediately, synchronously with user event
          audioGeneratorRef.current.resume().then(() => {
            if (isPlaying && audioGeneratorRef.current) {
              audioGeneratorRef.current.startMusic();
            }
          }).catch(err => {
            console.error('Failed to start audio on iOS:', err);
            // Try anyway
            if (isPlaying && audioGeneratorRef.current) {
              try {
                audioGeneratorRef.current.startMusic();
              } catch (playErr) {
                console.warn('Audio playback blocked on iOS');
                setAudioBlocked(true);
                setTimeout(() => setAudioBlocked(false), 5000);
              }
            }
          });
        } else {
          // Non-iOS: Resume AudioContext on first user gesture
          audioGeneratorRef.current.resume().then(() => {
            setTimeout(() => {
              if (isPlaying && audioGeneratorRef.current) {
                audioGeneratorRef.current.startMusic();
              }
            }, 100);
          }).catch(err => {
            console.error('Failed to resume audio context:', err);
            setTimeout(() => {
              if (isPlaying && audioGeneratorRef.current) {
                try {
                  audioGeneratorRef.current.startMusic();
                } catch (playErr) {
                  console.warn('Audio playback may be blocked by browser policy');
                  setAudioBlocked(true);
                  setTimeout(() => setAudioBlocked(false), 5000);
                }
              }
            }, 100);
          });
        }
      }
    };

    // Listen for user interaction - touchstart is critical for iOS
    // Use capture phase to ensure we catch it early
    const events = ['touchstart', 'click', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, { 
        once: true, 
        passive: false, // Allow preventDefault if needed
        capture: true // Capture in capture phase for iOS
      });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction, { capture: true });
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
    <>
      {/* Fallback visual cue if audio is blocked */}
      {audioBlocked && (
        <div className={styles.audioBlockedWarning}>
          <span>🔇</span>
          <span>Tap to enable audio</span>
        </div>
      )}
      <div className={styles.musicControls} onClick={handleControlsClick} onTouchStart={handleControlsClick}>
        <button
          className={styles.muteButton}
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>
    </>
  );
}

export default MusicPlayer;

