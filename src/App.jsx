import React, { useState, useEffect, useMemo, useRef } from 'react';
import campusData from './data/campus.json';
import Intro from './screens/Intro';
import StatScreen from './screens/StatScreen';
import Outro from './screens/Outro';
import MusicPlayer from './components/MusicPlayer';
import { getAudioGenerator } from './utils/audioGenerator';
import styles from './styles/App.module.css';

const SCREEN_DURATIONS = {
  intro: 4000,
  stat: 5500,
  outro: 4000
};

function App() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const lastTapTimeRef = useRef(0);
  const lastTapScreenRef = useRef(0);

  const screens = useMemo(() => [
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
      subtitle: 'One order. Infinite courage.',
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
      subtitle: 'Consistency is key.',
      statType: 'max_orders' 
    }},
    { type: 'stat', component: StatScreen, data: { 
      title: 'One day.', 
      value: campusData.stats.max_pizzas_single_day, 
      subtitle: 'The oven never rested.',
      statType: 'pizzas' 
    }},
    { type: 'stat', component: StatScreen, data: { 
      title: 'Biryani domination:', 
      value: campusData.stats.max_biryanis_single_day, 
      subtitle: 'History was cooked',
      statType: 'biryanis' 
    }},
    { type: 'outro', component: Outro }
  ], []);

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

  return (
    <div className={styles.app} onClick={handleScreenTouch} onTouchEnd={handleScreenTouch} onTouchStart={(e) => {
      // Only preventDefault if not passive
      if (e.cancelable) {
        e.preventDefault();
      }
    }}>
      {CurrentScreen && (
        <CurrentScreen 
          key={`screen-${currentScreen}`}
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

