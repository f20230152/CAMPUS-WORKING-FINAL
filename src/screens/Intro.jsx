import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from '../styles/Intro.module.css';

function Intro({ campusData }) {
  const containerRef = useRef(null);
  const presentsRef = useRef(null);
  const titleRef = useRef(null);
  const ctaRef = useRef(null);
  const logoRef = useRef(null);
  
  // Refs for food vectors
  const vector1Ref = useRef(null);
  const vector2Ref = useRef(null);
  const vector3Ref = useRef(null);
  const vector4Ref = useRef(null);
  const vector5Ref = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Initial state - all elements hidden
    gsap.set([
      presentsRef.current, 
      titleRef.current, 
      ctaRef.current, 
      logoRef.current,
      vector1Ref.current,
      vector2Ref.current,
      vector3Ref.current,
      vector4Ref.current,
      vector5Ref.current
    ], { opacity: 0 });

    // Animate "Swiggy Presents" - fade in from top
    tl.to(presentsRef.current, {
      opacity: 0.8,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    });

    // Animate main title - fade in and slight scale
    tl.to(titleRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.3');

    // Animate CTA text - fade in with full opacity for visibility
    tl.to(ctaRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.4');

    // Animate logo - fade in (scale already set in CSS)
    tl.to(logoRef.current, {
      opacity: 0.7,
      duration: 0.6,
      ease: 'back.out(1.2)'
    }, '-=0.2');

    // Animate food vectors - subtle fade in
    tl.to([
      vector1Ref.current,
      vector2Ref.current,
      vector3Ref.current,
      vector4Ref.current,
      vector5Ref.current
    ], {
      opacity: 1,
      duration: 1,
      ease: 'power1.out'
    }, '-=0.8');

    // Start subtle movement animations for vectors
    startVectorAnimations();
  }, []);

  const startVectorAnimations = () => {
    // Top-left vector - subtle drift
    gsap.to(vector1Ref.current, {
      x: '+=4',
      y: '+=3',
      duration: 8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    // Top-right vector - subtle drift
    gsap.to(vector2Ref.current, {
      x: '-=5',
      y: '+=2',
      duration: 10,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    // Bottom-left vector - subtle drift
    gsap.to(vector3Ref.current, {
      x: '+=3',
      y: '-=4',
      duration: 9,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    // Bottom-right vector - subtle drift
    gsap.to(vector4Ref.current, {
      x: '-=4',
      y: '-=3',
      duration: 11,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    // Center edge vector - very subtle movement
    gsap.to(vector5Ref.current, {
      x: '+=2',
      y: '+=2',
      duration: 12,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });
  };

  return (
    <div ref={containerRef} className={styles.intro}>
      {/* Food emoji illustrations in fixed zones */}
      <div ref={vector1Ref} className={`${styles.vectorTopLeft} ${styles.emojiVector}`}>
        🍚
      </div>
      <div ref={vector2Ref} className={`${styles.vectorTopRight} ${styles.emojiVector}`}>
        🍔
      </div>
      <div ref={vector3Ref} className={`${styles.vectorBottomLeft} ${styles.emojiVector}`}>
        🍕
      </div>
      <div ref={vector4Ref} className={`${styles.vectorBottomRight} ${styles.emojiVector}`}>
        <img 
          src={`${import.meta.env.BASE_URL}assets/vectors/food_04.svg`}
          alt="" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
      <div ref={vector5Ref} className={`${styles.vectorCenterEdge} ${styles.emojiVector}`}>
        <img 
          src={`${import.meta.env.BASE_URL}assets/vectors/food_05.svg`}
          alt="" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* Hero Text Structure - Center Aligned */}
      <div className={styles.heroContent}>
        <div ref={presentsRef} className={styles.presents}>
          Swiggy Presents
        </div>
        
        <h1 ref={titleRef} className={styles.title}>
          {campusData.college_name}
          <span className={styles.wrappedYear}> 2025 WRAPPED</span>
        </h1>
        
        <div ref={ctaRef} className={styles.cta}>
          tap anywhere to continue →
        </div>
      </div>

      {/* Swiggy Logo - Bottom Center */}
      <img 
        ref={logoRef}
        src={`${import.meta.env.BASE_URL}assets/logos/swiggy-logo.png`}
        alt="Swiggy" 
        className={styles.logo}
      />
    </div>
  );
}

export default Intro;
