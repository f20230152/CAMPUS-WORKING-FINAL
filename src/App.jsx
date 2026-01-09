import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import defaultCampusData from './data/campus.json';
import Intro from './screens/Intro';
import StatScreen from './screens/StatScreen';
import Outro from './screens/Outro';
import MusicPlayer from './components/MusicPlayer';
import { getAudioGenerator } from './utils/audioGenerator';
import { loadPoiData } from './utils/loadPoiData';
import { getPoiIdFromShortCode } from './utils/shortLinkLookup';
import styles from './styles/App.module.css';

// Design dimensions (iPhone 12/13 standard)
const DESIGN_WIDTH = 390;
const DESIGN_HEIGHT = 844;

const SCREEN_DURATIONS = {
  intro: 4000,
  stat: 5500,
  outro: 4000
};

function App() {
  const { poiId: paramPoiId } = useParams(); // Get POI ID from URL params
  const [campusData, setCampusData] = useState(defaultCampusData);
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const lastTapTimeRef = useRef(0);
  const lastTapScreenRef = useRef(0);
  const [scale, setScale] = useState(1);
  const stageRef = useRef(null);

  // Get POI ID from React Router params (HashRouter)
  const poiId = paramPoiId || null;

  // Calculate and apply scale for Stage container
  useEffect(() => {
    const calculateScale = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      const scaleX = viewportWidth / DESIGN_WIDTH;
      const scaleY = viewportHeight / DESIGN_HEIGHT;
      const newScale = Math.min(scaleX, scaleY);
      
      setScale(newScale);
      
      // Set CSS variable and transform with centering
      if (stageRef.current) {
        stageRef.current.style.setProperty('--scale', newScale);
        stageRef.current.style.transform = `translate(-50%, -50%) scale(${newScale})`;
      }
    };
    
    calculateScale();
    window.addEventListener('resize', calculateScale);
    window.addEventListener('orientationchange', calculateScale);
    
    return () => {
      window.removeEventListener('resize', calculateScale);
      window.removeEventListener('orientationchange', calculateScale);
    };
  }, []);

  // POI ID tracking (removed debug logs for production)

  // Load POI data when component mounts or POI ID changes
  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts
    
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        let data;
        let actualPoiId = poiId;
        
        if (poiId && poiId.trim() !== '') {
          // Check if it's a short code (try to look it up)
          const resolvedPoiId = await getPoiIdFromShortCode(poiId.trim());
          
          if (resolvedPoiId) {
            actualPoiId = resolvedPoiId;
          } else {
            // Not a short code, use as-is (might be a full POI ID)
            actualPoiId = poiId.trim();
          }
          
          data = await loadPoiData(actualPoiId);
        } else {
          data = defaultCampusData;
        }
        
        // Only update state if component is still mounted
        if (isMounted) {
          setCampusData(data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading campus data:', error);
        if (isMounted) {
          setCampusData(defaultCampusData);
          setIsLoading(false);
        }
      }
    };

    loadData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [poiId]);

  const screens = useMemo(() => {
    if (isLoading) return []; // Return empty while loading
    
    return [
    { type: 'intro', component: Intro },
    { type: 'stat', component: StatScreen, data: { 
      title: 'Your campus runs on', 
      value: campusData.stats.favourite_dish, 
      subtitle: `When in doubt, order a ${campusData.stats.favourite_dish}!`,
      statType: 'favourite_dish' 
    }},
    { type: 'stat', component: StatScreen, data: { 
      title: 'Someone at ' + campusData.college_name + ' said:', 
      value: campusData.stats.largest_order_value, 
      subtitle: 'When group ordering got serious',
      statType: 'largest_order_value', 
      format: 'currency' 
    }},
    { type: 'stat', component: StatScreen, data: { 
      title: 'The unofficial mess of ' + campusData.college_name + ':', 
      value: campusData.stats.unofficial_favorite_restaurant, 
      subtitle: 'Loyalty stronger than attendance.',
      statType: 'restaurant' 
    }},
    { type: 'stat', component: StatScreen, data: { 
      title: 'At 12:00 AM…', 
      value: campusData.stats.official_12am_craving, 
      subtitle: 'Hunger doesn\'t respect curfew',
      statType: '12am_craving' 
    }},
    { type: 'stat', component: StatScreen, data: { 
      title: 'One student.', 
      value: campusData.stats.max_orders_in_a_week, 
      subtitle: 'Swiggy was basically a roommate',
      statType: 'max_orders' 
    }},
    { type: 'stat', component: StatScreen, data: { 
      title: 'One day.', 
      value: campusData.stats.max_pizzas_single_day, 
      subtitle: 'Hostel party confirmed',
      statType: 'pizzas' 
    }},
    { type: 'stat', component: StatScreen, data: { 
      title: 'Biryani domination:', 
      value: campusData.stats.max_biryanis_single_day, 
      subtitle: 'Mess food took the day off',
      statType: 'biryanis' 
    }},
    { type: 'outro', component: Outro }
    ];
  }, [campusData, isLoading]);

  // No auto-advance - all navigation is manual via tap zones

  const handleReplay = () => {
    setCurrentScreen(0);
    setIsMusicPlaying(true);
  };

  // Handle tap on left side (go back) or right side (go forward)
  const handleScreenTouch = (e) => {
    // Don't proceed if clicking on interactive elements
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('[role="button"]')) {
      return;
    }
    
    // Debounce: prevent rapid taps (300ms cooldown)
    const now = Date.now();
    if (now - lastTapTimeRef.current < 300) {
      return;
    }
    
    // Prevent duplicate navigation to same screen
    if (lastTapScreenRef.current === currentScreen && now - lastTapTimeRef.current < 500) {
      return;
    }
    
    lastTapTimeRef.current = now;
    lastTapScreenRef.current = currentScreen;
    
    const screen = screens[currentScreen];
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Get click/touch coordinates
    let clickX = 0;
    if (e.type === 'touchstart' || e.type === 'touchend') {
      const touch = e.touches?.[0] || e.changedTouches?.[0];
      clickX = touch?.clientX || 0;
    } else {
      clickX = e.clientX || 0;
    }
    
    // Validate coordinates
    if (clickX === 0 && e.type !== 'click') {
      return; // Invalid touch event
    }
    
    const screenWidth = rect.width;
    const isLeftSide = clickX < screenWidth / 2;
    
    // Special handling for intro screen - any tap starts audio and goes forward
    if (screen.type === 'intro') {
      // CRITICAL: Resume AudioContext on first user interaction (iOS requirement)
      const audioGenerator = getAudioGenerator();
      
      // Mark user interaction immediately
      audioGenerator.userInteracted = true;
      
      // For iOS, play directly without delay
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      if (isIOS) {
        // iOS: Play immediately on user interaction (synchronously)
        audioGenerator.resume().then(() => {
          // startMusic() will handle iOS-specific playback
          audioGenerator.startMusic();
          setIsMusicPlaying(true);
        }).catch(err => {
          console.error('Error on iOS audio:', err);
          // Try direct play anyway
          try {
            audioGenerator.startMusic();
            setIsMusicPlaying(true);
          } catch (fallbackErr) {
            console.warn('Audio playback blocked on iOS');
          }
        });
      } else {
        // Non-iOS: Resume audio context and start music
        audioGenerator.resume().then(() => {
          setTimeout(() => {
            audioGenerator.startMusic();
            setIsMusicPlaying(true);
          }, 100);
        }).catch(err => {
          console.error('Error resuming audio context:', err);
          setTimeout(() => {
            try {
              audioGenerator.startMusic();
              setIsMusicPlaying(true);
            } catch (fallbackErr) {
              console.warn('Audio playback blocked');
            }
          }, 100);
        });
      }
      
      // Always go forward from intro
      if (currentScreen < screens.length - 1) {
        setCurrentScreen(prev => prev + 1);
      }
      return;
    }
    
    // For other screens: left = back, right = forward
    if (isLeftSide) {
      // Go to previous screen
      if (currentScreen > 0) {
        setCurrentScreen(prev => prev - 1);
      }
    } else {
      // Go to next screen
      if (currentScreen < screens.length - 1) {
        setCurrentScreen(prev => prev + 1);
      }
    }
  };

  const CurrentScreen = screens[currentScreen]?.component;
  const screenData = screens[currentScreen]?.data || {};

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className={styles.app} style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FEF0E3 0%, #FFE5D4 50%, #FFD4C4 100%)'
      }}>
        <div style={{ 
          color: '#fe5200', 
          fontSize: '24px', 
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          Loading Campus Wrapped...
        </div>
      </div>
    );
  }

  // Handle back button click - redirect to Swiggy deep link
  const handleBackClick = (e) => {
    e.stopPropagation(); // Prevent triggering screen navigation
    e.preventDefault(); // Prevent default behavior
    window.location.href = 'swiggy://restaurantList';
  };

  return (
    <div className={styles.app} onClick={handleScreenTouch} onTouchEnd={handleScreenTouch} onTouchStart={(e) => {
      // Only preventDefault if not passive
      if (e.cancelable) {
        e.preventDefault();
      }
    }}>
      {/* Back button */}
      <button 
        className={styles.backButton}
        onClick={handleBackClick}
        onTouchEnd={handleBackClick}
        aria-label="Back to Swiggy"
      >
        <svg 
          className={styles.backButtonIcon}
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>

      {/* Left arrow indicator */}
      <div className={`${styles.arrowIndicator} ${styles.arrowIndicatorLeft}`}>
        <svg 
          className={styles.arrowIcon}
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </div>

      {/* Right arrow indicator */}
      <div className={`${styles.arrowIndicator} ${styles.arrowIndicatorRight}`}>
        <svg 
          className={styles.arrowIcon}
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </div>

      <div className={styles.stage} ref={stageRef}>
        {CurrentScreen && (
          <CurrentScreen 
            key={`screen-${currentScreen}-${poiId || 'default'}`}
            data={screenData}
            campusData={campusData}
            onReplay={handleReplay}
          />
        )}
      </div>
      <MusicPlayer 
        currentScreen={currentScreen}
        isPlaying={isMusicPlaying}
        onPlayStateChange={setIsMusicPlaying}
      />
    </div>
  );
}

export default App;

