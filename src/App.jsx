import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import defaultCampusData from './data/campus.json';
import Intro from './screens/Intro';
import StatScreen from './screens/StatScreen';
import Outro from './screens/Outro';
import MusicPlayer from './components/MusicPlayer';
import { getAudioGenerator } from './utils/audioGenerator';
import { loadPoiData } from './utils/loadPoiData';
import styles from './styles/App.module.css';

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

  // Extract POI ID from URL - handle both pathname and query string (for 404 redirects)
  const getPoiIdFromUrl = () => {
    // First try from React Router params
    if (paramPoiId) {
      return paramPoiId;
    }
    
    // If not in params, check pathname directly
    const pathname = window.location.pathname;
    const basePath = import.meta.env.BASE_URL || '/';
    let cleanPath = pathname;
    
    // Remove base path
    if (basePath !== '/') {
      cleanPath = pathname.replace(basePath, '/');
    }
    
    // Extract from pathname
    const segments = cleanPath.split('/').filter(s => s && s !== 'CAMPUS-WORKING-FINAL' && s !== 'index.html');
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      if (lastSegment && lastSegment !== '') {
        return lastSegment;
      }
    }
    
    // If not in pathname, check query string (for 404 redirects)
    const search = window.location.search;
    if (search && search.startsWith('?/')) {
      const queryPath = search.slice(2).split('&')[0]; // Get path from query, ignore other params
      const querySegments = queryPath.split('/').filter(s => s);
      if (querySegments.length > 0) {
        return querySegments[querySegments.length - 1];
      }
    }
    
    return null;
  };

  const poiId = getPoiIdFromUrl();

  // Debug: Log POI ID on mount and changes
  useEffect(() => {
    console.log('=== App Component ===');
    console.log('POI ID from useParams:', paramPoiId);
    console.log('POI ID extracted:', poiId);
    console.log('Full URL:', window.location.href);
    console.log('Pathname:', window.location.pathname);
    console.log('Search:', window.location.search);
    console.log('Base URL:', import.meta.env.BASE_URL);
  }, [poiId, paramPoiId]);

  // Load POI data when component mounts or POI ID changes
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      console.log('Loading data for POI ID:', poiId);
      console.log('Current URL:', window.location.href);
      console.log('Current pathname:', window.location.pathname);
      
      try {
        if (poiId && poiId.trim() !== '') {
          console.log('Fetching POI data for:', poiId.trim());
          const data = await loadPoiData(poiId.trim());
          console.log('Successfully loaded data for:', data.college_name);
          setCampusData(data);
        } else {
          console.log('No POI ID provided, using default data');
          // Use default data if no POI ID
          setCampusData(defaultCampusData);
        }
      } catch (error) {
        console.error('Error loading campus data:', error);
        setCampusData(defaultCampusData);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [poiId]);

  const screens = useMemo(() => {
    if (isLoading) return []; // Return empty while loading
    
    return [
    { type: 'intro', component: Intro },
    { type: 'stat', component: StatScreen, data: { 
      title: 'Your campus runs on', 
      value: campusData.stats.favourite_dish, 
      subtitle: 'When in doubt, order a Biryani!',
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
      // Start audio immediately
      const audioGenerator = getAudioGenerator();
      audioGenerator.resume().then(() => {
        audioGenerator.startMusic();
      }).catch(err => {
        console.error('Error starting audio:', err);
        audioGenerator.startMusic();
      });
      
      // Always go forward from intro
      if (currentScreen < screens.length - 1) {
        setCurrentScreen(prev => prev + 1);
        setIsMusicPlaying(true);
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

  return (
    <div className={styles.app} onClick={handleScreenTouch} onTouchEnd={handleScreenTouch} onTouchStart={(e) => {
      // Only preventDefault if not passive
      if (e.cancelable) {
        e.preventDefault();
      }
    }}>
      {CurrentScreen && (
        <CurrentScreen 
          key={`screen-${currentScreen}-${poiId || 'default'}`}
          data={screenData}
          campusData={campusData}
          onReplay={handleReplay}
        />
      )}
      <MusicPlayer 
        currentScreen={currentScreen}
        isPlaying={isMusicPlaying}
        onPlayStateChange={setIsMusicPlaying}
      />
    </div>
  );
}

export default App;

