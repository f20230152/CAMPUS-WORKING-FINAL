import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from '../styles/StatScreen.module.css';

function StatScreen({ data }) {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const valueRef = useRef(null);
  const subtitleRef = useRef(null);
  const illustrationRef = useRef(null);
  const logoRef = useRef(null);
  const statType = data?.statType || '';

  useEffect(() => {
    // Ensure refs are available
    if (!titleRef.current || !valueRef.current) {
      return;
    }

    const tl = gsap.timeline();

    // Initial state - only hide if element exists
    const elementsToHide = [titleRef.current, valueRef.current].filter(Boolean);
    if (logoRef.current) {
      gsap.set(logoRef.current, { opacity: 0 });
    }
    // Keep subtitle visible for favourite_dish and 12am_craving screens
    if (subtitleRef.current && statType === 'favourite_dish') {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        if (subtitleRef.current) {
          gsap.set(subtitleRef.current, { opacity: 1, y: 0, visibility: 'visible', display: 'block' });
          subtitleRef.current.style.opacity = '1';
          subtitleRef.current.style.visibility = 'visible';
          subtitleRef.current.style.display = 'block';
          subtitleRef.current.style.transform = 'translateY(0)';
        }
      }, 0);
    } else if (subtitleRef.current && statType === '12am_craving') {
      // Force visibility for 12am_craving subtitle
      setTimeout(() => {
        if (subtitleRef.current) {
          gsap.set(subtitleRef.current, { 
            opacity: 1, 
            y: 0, 
            visibility: 'visible', 
            display: 'block'
          });
          subtitleRef.current.style.opacity = '1';
          subtitleRef.current.style.visibility = 'visible';
          subtitleRef.current.style.display = 'block';
          subtitleRef.current.style.color = '#FFFFFF';
          subtitleRef.current.style.transform = 'translateY(0)';
        }
      }, 0);
    } else if (subtitleRef.current) {
      gsap.set(subtitleRef.current, { opacity: 0, y: 10 });
    }
    if (illustrationRef.current) elementsToHide.push(illustrationRef.current);
    if (elementsToHide.length > 0) {
      gsap.set(elementsToHide, { opacity: 0 });
    }

    // Animate title first
    tl.to(titleRef.current, {
      opacity: 1,
      y: -20,
      duration: 0.6,
      ease: 'power3.out'
    });

    // Animate based on stat type
    if (statType === 'favourite_dish') {
      // Start biryani emoji rain immediately when screen loads
      // Use a small delay to ensure container is ready
      setTimeout(() => {
        createBiryaniConfetti();
      }, 50);
      
      // Dish name scales up - React manages the content via JSX children
      // Never set textContent for this statType, only animate the container
      // Don't manipulate DOM - React handles the content
      tl.to(valueRef.current, {
        opacity: 1,
        scale: 0.5,
        duration: 0.4
      }, '-=0.5')
      .to(valueRef.current, {
        scale: 1.15,
        duration: 0.6,
        ease: 'back.out(1.7)'
      })
      .to(valueRef.current, {
        scale: 1,
        duration: 0.3
      }, '-=0.2');

      // No floating emoji for favourite_dish - removed as per request

      // Subtitle - force visibility for favourite_dish
      if (subtitleRef.current && data.subtitle && statType === 'favourite_dish') {
        // Force subtitle to be visible immediately - multiple methods
        const subtitleEl = subtitleRef.current;
        gsap.set(subtitleEl, { opacity: 1, y: 0, visibility: 'visible', display: 'block' });
        // Set inline styles directly - these override everything
        subtitleEl.style.opacity = '1';
        subtitleEl.style.visibility = 'visible';
        subtitleEl.style.display = 'block';
        subtitleEl.style.transform = 'translateY(0)';
        
        // Multiple fallbacks to ensure visibility
        setTimeout(() => {
          if (subtitleEl) {
            subtitleEl.style.opacity = '1';
            subtitleEl.style.visibility = 'visible';
            subtitleEl.style.display = 'block';
          }
        }, 50);
        setTimeout(() => {
          if (subtitleEl) {
            subtitleEl.style.opacity = '1';
            subtitleEl.style.visibility = 'visible';
            subtitleEl.style.display = 'block';
          }
        }, 500);
      } else if (subtitleRef.current && data.subtitle) {
        // For other screens, animate normally
        gsap.set(subtitleRef.current, { opacity: 0, y: 10 });
        tl.to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.3');
      }
      
      // Fallback: ensure subtitle is always visible after a short delay
      if (subtitleRef.current && data.subtitle) {
        setTimeout(() => {
          if (subtitleRef.current) {
            gsap.set(subtitleRef.current, { opacity: 1, y: 0, visibility: 'visible', display: 'block' });
            subtitleRef.current.style.opacity = '1';
            subtitleRef.current.style.visibility = 'visible';
            subtitleRef.current.style.display = 'block';
            subtitleRef.current.style.transform = 'translateY(0)';
          }
        }, 200);
      }

      // Logo animation - same as intro screen
      if (logoRef.current) {
        tl.to(logoRef.current, {
          opacity: 0.7,
          duration: 0.6,
          ease: 'back.out(1.2)'
        }, '-=0.2');
      }
    } else if (statType === 'largest_order_value') {
      // Rupee counter ticking - show number first, then complete sentence with smooth transition
      const finalValue = data.value;
      const obj = { value: 0 };
      const countUpDuration = 1.5;
      
      // Start with proper scale and opacity
      tl.to(valueRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3
      });
      
      // First, count up just the number - keep scale consistent
      let lastTickValue = 0;
      tl.to(obj, {
        value: finalValue,
        duration: countUpDuration,
        ease: 'power2.out',
        onUpdate: () => {
          if (valueRef.current) {
            const currentValue = Math.floor(obj.value);
            valueRef.current.textContent = `₹${currentValue.toLocaleString('en-IN')}`;
            
            // Track value changes
            if (currentValue !== lastTickValue && currentValue % 1000 === 0) {
              lastTickValue = currentValue;
            }
          }
        }
      }, '-=0.3')
      // Smoothly transition to full sentence - fade out old, fade in new
      .to(valueRef.current, {
        opacity: 0.3,
        duration: 0.2,
        ease: 'power1.in'
      })
      .call(() => {
        if (valueRef.current) {
          valueRef.current.textContent = `₹${Math.floor(finalValue).toLocaleString('en-IN')} ka bhookh hai.`;
        }
      })
      .to(valueRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power1.out'
      });

      // Subtitle appears AFTER count-up completes
      if (subtitleRef.current && data.subtitle) {
        tl.to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.1');
      }

      // Logo animation - same as intro screen
      if (logoRef.current) {
        tl.to(logoRef.current, {
          opacity: 0.7,
          duration: 0.6,
          ease: 'back.out(1.2)'
        }, '-=0.2');
      }
    } else if (statType === 'restaurant') {
      // Restaurant name with crown emoji on next line (no building icon)
      tl.to(valueRef.current, {
        opacity: 1,
        y: 20,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.4');

      // Subtitle animation (if exists)
      if (subtitleRef.current && data.subtitle) {
        tl.to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.2');
      }

      // Logo animation - same as intro screen
      if (logoRef.current) {
        tl.to(logoRef.current, {
          opacity: 0.7,
          duration: 0.6,
          ease: 'back.out(1.2)'
        }, '-=0.2');
      }
    } else if (statType === '12am_craving') {
      // Clock animation (simulated with darkening)
      tl.to(containerRef.current, {
        filter: 'brightness(0.7)',
        duration: 0.5
      }, '-=0.2');
      
      // No floating emoji for 12am_craving - removed as per request
      
      // Dish name
      tl.to(valueRef.current, {
        opacity: 1,
        scale: 0.8,
        duration: 0.4
      }, '-=0.8')
      .to(valueRef.current, {
        scale: 1.1,
        duration: 0.5,
        ease: 'back.out(1.7)'
      })
      .to(valueRef.current, {
        scale: 1,
        duration: 0.3
      }, '-=0.2');

      // Subtitle animation (if exists) - ensure visible for 12am_craving
      if (subtitleRef.current && data.subtitle) {
        // Force visibility for 12am_craving
        gsap.set(subtitleRef.current, {
          opacity: 1,
          visibility: 'visible',
          display: 'block',
          color: '#FFFFFF'
        });
        subtitleRef.current.style.opacity = '1';
        subtitleRef.current.style.visibility = 'visible';
        subtitleRef.current.style.display = 'block';
        subtitleRef.current.style.color = '#FFFFFF';
        tl.to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.2');
      }

      // Logo animation - same as intro screen
      if (logoRef.current) {
        tl.to(logoRef.current, {
          opacity: 0.7,
          duration: 0.6,
          ease: 'back.out(1.2)'
        }, '-=0.2');
      }
    } else if (statType === 'max_orders') {
      // Orders count up - show number first, then complete sentence with smooth transition
      const finalValue = data.value;
      const obj = { value: 0 };
      const countUpDuration = 1.5;
      
      // Start with proper scale and opacity
      tl.to(valueRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3
      });
      
      // First, count up just the number - keep scale consistent
      let lastTickValue = 0;
      tl.to(obj, {
        value: finalValue,
        duration: countUpDuration,
        ease: 'power2.out',
        onUpdate: () => {
          if (valueRef.current) {
            const currentValue = Math.floor(obj.value);
            valueRef.current.textContent = currentValue;
            
            // Track value changes
            if (currentValue !== lastTickValue && currentValue % 5 === 0) {
              lastTickValue = currentValue;
            }
          }
        }
      }, '-=0.3')
      // Smoothly transition to full sentence - fade out old, fade in new
      .to(valueRef.current, {
        opacity: 0.3,
        duration: 0.2,
        ease: 'power1.in'
      })
      .call(() => {
        if (valueRef.current) {
          valueRef.current.textContent = Math.floor(finalValue) + ' orders in a week.';
          // Trigger confetti from corners when text appears
          createCornerConfetti();
        }
      })
      .to(valueRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power1.out'
      });

      // Subtitle appears AFTER count-up
      if (subtitleRef.current && data.subtitle) {
        tl.to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.1');
      }

      // Logo animation - same as intro screen
      if (logoRef.current) {
        tl.to(logoRef.current, {
          opacity: 0.7,
          duration: 0.6,
          ease: 'back.out(1.2)'
        }, '-=0.2');
      }
    } else if (statType === 'pizzas') {
      // Pizza count up - show number first, then complete sentence with smooth transition
      const finalValue = data.value;
      const obj = { value: 0 };
      const countUpDuration = 1.5;
      
      // Start with proper scale and opacity
      tl.to(valueRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3
      });
      
      // First, count up just the number - keep scale consistent
      let lastTickValue = 0;
      tl.to(obj, {
        value: finalValue,
        duration: countUpDuration,
        ease: 'power2.out',
        onUpdate: () => {
          if (valueRef.current) {
            const currentValue = Math.floor(obj.value);
            valueRef.current.textContent = currentValue;
            
            // Track value changes
            if (currentValue !== lastTickValue && currentValue % 10 === 0) {
              lastTickValue = currentValue;
            }
          }
        }
      }, '-=0.3')
      // Smoothly transition to full sentence - fade out old, fade in new
      .to(valueRef.current, {
        opacity: 0.3,
        duration: 0.2,
        ease: 'power1.in'
      })
      .call(() => {
        if (valueRef.current) {
          valueRef.current.textContent = Math.floor(finalValue) + ' pizzas ordered';
          // Trigger pizza emoji rain from all sides when text appears
          setTimeout(() => {
            createPizzaRain();
          }, 50);
        }
      })
      .to(valueRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power1.out'
      });

      // Remove illustration animation - pizzas will rain instead
      // No rotating pizza emoji

      // Subtitle animation (if exists)
      if (subtitleRef.current && data.subtitle) {
        tl.to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.2');
      }

      // Logo animation - same as intro screen
      if (logoRef.current) {
        tl.to(logoRef.current, {
          opacity: 0.7,
          duration: 0.6,
          ease: 'back.out(1.2)'
        }, '-=0.2');
      }
    } else if (statType === 'biryanis') {
      // Biryani count up - show number first, then complete sentence with smooth transition
      const finalValue = data.value;
      const obj = { value: 0 };
      const countUpDuration = 1.5;
      
      // Start with proper scale and opacity
      tl.to(valueRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3
      });
      
      // First, count up just the number - keep scale consistent
      let lastTickValue = 0;
      tl.to(obj, {
        value: finalValue,
        duration: countUpDuration,
        ease: 'power2.out',
        onUpdate: () => {
          if (valueRef.current) {
            const currentValue = Math.floor(obj.value);
            valueRef.current.textContent = currentValue;
            
            // Track value changes
            if (currentValue !== lastTickValue && currentValue % 20 === 0) {
              lastTickValue = currentValue;
            }
          }
        }
      }, '-=0.3')
      // Smoothly transition to full sentence - fade out old, fade in new
      .to(valueRef.current, {
        opacity: 0.3,
        duration: 0.2,
        ease: 'power1.in'
      })
      .call(() => {
        if (valueRef.current) {
          valueRef.current.textContent = Math.floor(finalValue) + ' plates in a day';
          // Trigger biryani emoji rain from all sides when text appears
          setTimeout(() => {
            createBiryaniRain();
          }, 50);
        }
      })
      .to(valueRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power1.out'
      });

      // Remove illustration animation - biryanis will rain instead
      // No rotating center biryani emoji
      // No biryani confetti from top

      // Subtitle animation (if exists)
      if (subtitleRef.current && data.subtitle) {
        tl.to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.2');
      }

      // Logo animation - same as intro screen
      if (logoRef.current) {
        tl.to(logoRef.current, {
          opacity: 0.7,
          duration: 0.6,
          ease: 'back.out(1.2)'
        }, '-=0.2');
      }
    }

    // Cleanup function to clear textContent when component unmounts or data changes
    return () => {
      // Only clear textContent, don't touch innerHTML for React-managed content
      const usesTextContent = ['largest_order_value', 'max_orders', 'pizzas', 'biryanis'].includes(statType);
      
      if (valueRef.current && usesTextContent) {
        valueRef.current.textContent = '';
      }
      // Don't clear subtitle - React manages it
      // Kill any running GSAP animations
      if (tl) {
        tl.kill();
      }
    };
  }, [data, statType]);

  if (!data || !data.title) {
    return (
      <div className={styles.statScreen} style={{ background: 'linear-gradient(135deg, #FEF0E3 0%, #FFE5D4 50%, #FFD4C4 100%)' }}>
        <div className={styles.title}>Loading...</div>
      </div>
    );
  }
  
  if (!statType) {
    return (
      <div className={styles.statScreen} style={{ background: 'linear-gradient(135deg, #FEF0E3 0%, #FFE5D4 50%, #FFD4C4 100%)' }}>
        <div className={styles.title}>Invalid screen</div>
      </div>
    );
  }

  const createConfetti = () => {
    const colors = ['#F25700', '#FF6B35', '#FF8C42', '#FFA07A', '#FFD4C4'];
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = styles.confetti;
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      containerRef.current?.appendChild(confetti);
      setTimeout(() => confetti.remove(), 2000);
    }
  };

  const createBiryaniConfetti = () => {
    // Create 100 small food emojis raining across the screen for favourite_dish screen - all kinds of dishes
    const emojis = ['🍛', '🍚', '🍕', '🍔', '🌮', '🌯', '🥙', '🥗', '🍜', '🍝', '🍲', '🍱', '🍣', '🍤', '🍗', '🍖', '🥘', '🍳', '🥟', '🍢', '🍡', '🥠', '🍩', '🍪', '🥧', '🍰', '🧁', '🍫', '🍬', '🍭', '🌭', '🥪', '🍟', '🌽', '🥐', '🥖', '🥨', '🧀', '🥚', '🥓', '🥞', '🧇', '🥯', '🥖', '🥨']; // All kinds of food emojis for favourite dish screen
    if (!containerRef.current) {
      // Retry after a short delay if container isn't ready
      setTimeout(() => createBiryaniConfetti(), 100);
      return;
    }
    
    // Append to body or a fixed container to ensure visibility above everything
    const confettiContainer = document.body;
    
    for (let i = 0; i < 100; i++) {
      const emoji = document.createElement('div');
      emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      emoji.className = styles.biryaniConfetti;
      
      // Calculate position relative to viewport
      const leftPercent = Math.random() * 100;
      emoji.style.left = leftPercent + '%';
      emoji.style.top = '-50px';
      emoji.style.animationDelay = (Math.random() * 2) + 's'; // Staggered start
      
      // Append to body for proper z-index stacking
      confettiContainer.appendChild(emoji);
      
      // Remove after animation completes
      setTimeout(() => {
        if (emoji.parentNode) {
          emoji.remove();
        }
      }, 6000);
    }
  };

  const createCornerConfetti = () => {
    // Create confetti from right and left lower corners
    const colors = ['#F25700', '#FF6B35', '#FF8C42', '#FFA07A', '#FFD4C4', '#FFD700', '#FF69B4', '#00CED1'];
    const confettiCount = 30; // 30 from each corner = 60 total
    
    if (!containerRef.current) return;
    
    // Left lower corner confetti
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = '0%';
      confetti.style.bottom = '0%';
      confetti.style.width = '12px';
      confetti.style.height = '12px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = '50%';
      confetti.style.zIndex = '1000';
      confetti.style.pointerEvents = 'none';
      
      // Random angle and distance
      const angle = Math.random() * 90 + 45; // 45-135 degrees (upward and rightward)
      const distance = 200 + Math.random() * 300;
      const radians = (angle * Math.PI) / 180;
      const x = Math.cos(radians) * distance;
      const y = -Math.sin(radians) * distance;
      
      confetti.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random() * 720}deg)`;
      confetti.style.opacity = '0.9';
      confetti.style.transition = 'all 1.5s ease-out';
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        confetti.style.opacity = '0';
        confetti.style.transform += ` scale(0)`;
      }, 100);
      
      setTimeout(() => confetti.remove(), 1600);
    }
    
    // Right lower corner confetti
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.right = '0%';
      confetti.style.bottom = '0%';
      confetti.style.width = '12px';
      confetti.style.height = '12px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = '50%';
      confetti.style.zIndex = '1000';
      confetti.style.pointerEvents = 'none';
      
      // Random angle and distance (upward and leftward)
      const angle = Math.random() * 90 + 45; // 45-135 degrees (but from right, so 135-225 from right)
      const distance = 200 + Math.random() * 300;
      const radians = ((180 - angle) * Math.PI) / 180; // Flip for right side
      const x = Math.cos(radians) * distance;
      const y = -Math.sin(radians) * distance;
      
      confetti.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random() * 720}deg)`;
      confetti.style.opacity = '0.9';
      confetti.style.transition = 'all 1.5s ease-out';
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        confetti.style.opacity = '0';
        confetti.style.transform += ` scale(0)`;
      }, 100);
      
      setTimeout(() => confetti.remove(), 1600);
    }
  };

  const createPizzaRain = () => {
    // Create pizza emojis raining and popping from all sides of the screen
    const pizzaEmoji = '🍕';
    const pizzaCount = 50; // Total pizzas from all sides
    
    // Pizza from top (raining down)
    for (let i = 0; i < Math.floor(pizzaCount / 4); i++) {
      setTimeout(() => {
        const pizza = document.createElement('div');
        pizza.textContent = pizzaEmoji;
        pizza.style.position = 'fixed';
        pizza.style.fontSize = '30px';
        pizza.style.left = Math.random() * 100 + '%';
        pizza.style.top = '-50px';
        pizza.style.zIndex = '1000';
        pizza.style.pointerEvents = 'none';
        pizza.style.opacity = '0.9';
        pizza.style.transform = 'translate(0, 0) rotate(0deg)';
        pizza.style.transition = 'all 3s ease-in';
        
        document.body.appendChild(pizza);
        
        // Force reflow, then animate
        requestAnimationFrame(() => {
          const endX = (Math.random() - 0.5) * 200;
          const endY = window.innerHeight + 100;
          const rotation = Math.random() * 720;
          pizza.style.transform = `translate(${endX}px, ${endY}px) rotate(${rotation}deg)`;
        });
        
        setTimeout(() => {
          pizza.style.opacity = '0';
          pizza.style.transform += ` scale(0)`;
        }, 2800);
        
        setTimeout(() => pizza.remove(), 3100);
      }, i * 50);
    }
    
    // Pizza from bottom (popping up)
    for (let i = 0; i < Math.floor(pizzaCount / 4); i++) {
      setTimeout(() => {
        const pizza = document.createElement('div');
        pizza.textContent = pizzaEmoji;
        pizza.style.position = 'fixed';
        pizza.style.fontSize = '30px';
        pizza.style.left = Math.random() * 100 + '%';
        pizza.style.bottom = '-50px';
        pizza.style.zIndex = '1000';
        pizza.style.pointerEvents = 'none';
        pizza.style.opacity = '0.9';
        pizza.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
        pizza.style.transition = 'all 2.5s ease-out';
        
        document.body.appendChild(pizza);
        
        // Force reflow, then animate
        requestAnimationFrame(() => {
          const endX = (Math.random() - 0.5) * 200;
          const endY = -(window.innerHeight + 100);
          const rotation = Math.random() * 720;
          pizza.style.transform = `translate(${endX}px, ${endY}px) rotate(${rotation}deg) scale(1.5)`;
        });
        
        setTimeout(() => {
          pizza.style.opacity = '0';
          pizza.style.transform += ` scale(0)`;
        }, 2300);
        
        setTimeout(() => pizza.remove(), 2600);
      }, i * 50);
    }
    
    // Pizza from left side
    for (let i = 0; i < Math.floor(pizzaCount / 4); i++) {
      setTimeout(() => {
        const pizza = document.createElement('div');
        pizza.textContent = pizzaEmoji;
        pizza.style.position = 'fixed';
        pizza.style.fontSize = '30px';
        pizza.style.left = '-50px';
        pizza.style.top = Math.random() * 100 + '%';
        pizza.style.zIndex = '1000';
        pizza.style.pointerEvents = 'none';
        pizza.style.opacity = '0.9';
        pizza.style.transform = 'translate(0, 0) rotate(0deg)';
        pizza.style.transition = 'all 2.8s ease-in-out';
        
        document.body.appendChild(pizza);
        
        // Force reflow, then animate
        requestAnimationFrame(() => {
          const endX = window.innerWidth + 100;
          const endY = (Math.random() - 0.5) * 200;
          const rotation = Math.random() * 720;
          pizza.style.transform = `translate(${endX}px, ${endY}px) rotate(${rotation}deg)`;
        });
        
        setTimeout(() => {
          pizza.style.opacity = '0';
          pizza.style.transform += ` scale(0)`;
        }, 2600);
        
        setTimeout(() => pizza.remove(), 2900);
      }, i * 50);
    }
    
    // Pizza from right side
    for (let i = 0; i < Math.floor(pizzaCount / 4); i++) {
      setTimeout(() => {
        const pizza = document.createElement('div');
        pizza.textContent = pizzaEmoji;
        pizza.style.position = 'fixed';
        pizza.style.fontSize = '30px';
        pizza.style.right = '-50px';
        pizza.style.top = Math.random() * 100 + '%';
        pizza.style.zIndex = '1000';
        pizza.style.pointerEvents = 'none';
        pizza.style.opacity = '0.9';
        pizza.style.transform = 'translate(0, 0) rotate(0deg)';
        pizza.style.transition = 'all 2.8s ease-in-out';
        
        document.body.appendChild(pizza);
        
        // Force reflow, then animate
        requestAnimationFrame(() => {
          const endX = -(window.innerWidth + 100);
          const endY = (Math.random() - 0.5) * 200;
          const rotation = Math.random() * 720;
          pizza.style.transform = `translate(${endX}px, ${endY}px) rotate(${rotation}deg)`;
        });
        
        setTimeout(() => {
          pizza.style.opacity = '0';
          pizza.style.transform += ` scale(0)`;
        }, 2600);
        
        setTimeout(() => pizza.remove(), 2900);
      }, i * 50);
    }
  };

  const createBiryaniRain = () => {
    // Create biryani emojis raining and popping from all sides of the screen
    const biryaniEmojis = ['🍛', '🍚']; // Biryani and rice emojis for biryani screen
    const biryaniCount = 50; // Total biryanis from all sides
    
    // Biryani from top (raining down)
    for (let i = 0; i < Math.floor(biryaniCount / 4); i++) {
      setTimeout(() => {
        const biryani = document.createElement('div');
        biryani.textContent = biryaniEmojis[Math.floor(Math.random() * biryaniEmojis.length)];
        biryani.style.position = 'fixed';
        biryani.style.fontSize = '30px';
        biryani.style.left = Math.random() * 100 + '%';
        biryani.style.top = '-50px';
        biryani.style.zIndex = '1000';
        biryani.style.pointerEvents = 'none';
        biryani.style.opacity = '0.9';
        biryani.style.transform = 'translate(0, 0) rotate(0deg)';
        biryani.style.transition = 'all 3s ease-in';
        
        document.body.appendChild(biryani);
        
        // Force reflow, then animate
        requestAnimationFrame(() => {
          const endX = (Math.random() - 0.5) * 200;
          const endY = window.innerHeight + 100;
          const rotation = Math.random() * 720;
          biryani.style.transform = `translate(${endX}px, ${endY}px) rotate(${rotation}deg)`;
        });
        
        setTimeout(() => {
          biryani.style.opacity = '0';
          biryani.style.transform += ` scale(0)`;
        }, 2800);
        
        setTimeout(() => biryani.remove(), 3100);
      }, i * 50);
    }
    
    // Biryani from bottom (popping up)
    for (let i = 0; i < Math.floor(biryaniCount / 4); i++) {
      setTimeout(() => {
        const biryani = document.createElement('div');
        biryani.textContent = biryaniEmojis[Math.floor(Math.random() * biryaniEmojis.length)];
        biryani.style.position = 'fixed';
        biryani.style.fontSize = '30px';
        biryani.style.left = Math.random() * 100 + '%';
        biryani.style.bottom = '-50px';
        biryani.style.zIndex = '1000';
        biryani.style.pointerEvents = 'none';
        biryani.style.opacity = '0.9';
        biryani.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
        biryani.style.transition = 'all 2.5s ease-out';
        
        document.body.appendChild(biryani);
        
        // Force reflow, then animate
        requestAnimationFrame(() => {
          const endX = (Math.random() - 0.5) * 200;
          const endY = -(window.innerHeight + 100);
          const rotation = Math.random() * 720;
          biryani.style.transform = `translate(${endX}px, ${endY}px) rotate(${rotation}deg) scale(1.5)`;
        });
        
        setTimeout(() => {
          biryani.style.opacity = '0';
          biryani.style.transform += ` scale(0)`;
        }, 2300);
        
        setTimeout(() => biryani.remove(), 2600);
      }, i * 50);
    }
    
    // Biryani from left side
    for (let i = 0; i < Math.floor(biryaniCount / 4); i++) {
      setTimeout(() => {
        const biryani = document.createElement('div');
        biryani.textContent = biryaniEmojis[Math.floor(Math.random() * biryaniEmojis.length)];
        biryani.style.position = 'fixed';
        biryani.style.fontSize = '30px';
        biryani.style.left = '-50px';
        biryani.style.top = Math.random() * 100 + '%';
        biryani.style.zIndex = '1000';
        biryani.style.pointerEvents = 'none';
        biryani.style.opacity = '0.9';
        biryani.style.transform = 'translate(0, 0) rotate(0deg)';
        biryani.style.transition = 'all 2.8s ease-in-out';
        
        document.body.appendChild(biryani);
        
        // Force reflow, then animate
        requestAnimationFrame(() => {
          const endX = window.innerWidth + 100;
          const endY = (Math.random() - 0.5) * 200;
          const rotation = Math.random() * 720;
          biryani.style.transform = `translate(${endX}px, ${endY}px) rotate(${rotation}deg)`;
        });
        
        setTimeout(() => {
          biryani.style.opacity = '0';
          biryani.style.transform += ` scale(0)`;
        }, 2600);
        
        setTimeout(() => biryani.remove(), 2900);
      }, i * 50);
    }
    
    // Biryani from right side
    for (let i = 0; i < Math.floor(biryaniCount / 4); i++) {
      setTimeout(() => {
        const biryani = document.createElement('div');
        biryani.textContent = biryaniEmojis[Math.floor(Math.random() * biryaniEmojis.length)];
        biryani.style.position = 'fixed';
        biryani.style.fontSize = '30px';
        biryani.style.right = '-50px';
        biryani.style.top = Math.random() * 100 + '%';
        biryani.style.zIndex = '1000';
        biryani.style.pointerEvents = 'none';
        biryani.style.opacity = '0.9';
        biryani.style.transform = 'translate(0, 0) rotate(0deg)';
        biryani.style.transition = 'all 2.8s ease-in-out';
        
        document.body.appendChild(biryani);
        
        // Force reflow, then animate
        requestAnimationFrame(() => {
          const endX = -(window.innerWidth + 100);
          const endY = (Math.random() - 0.5) * 200;
          const rotation = Math.random() * 720;
          biryani.style.transform = `translate(${endX}px, ${endY}px) rotate(${rotation}deg)`;
        });
        
        setTimeout(() => {
          biryani.style.opacity = '0';
          biryani.style.transform += ` scale(0)`;
        }, 2600);
        
        setTimeout(() => biryani.remove(), 2900);
      }, i * 50);
    }
  };

  const getBackgroundGradient = () => {
    switch (statType) {
      case 'favourite_dish':
        return 'linear-gradient(135deg, #FEF0E3 0%, #FFE5D4 50%, #FFD4C4 100%)';
      case 'largest_order_value':
        // Adjusted to complement the darker orange title (#D04500) and vibrant value text
        return 'linear-gradient(135deg, #FFF5EB 0%, #FFE5D4 30%, #FFD4C4 70%, #FFB88C 100%)';
      case 'restaurant':
        return 'linear-gradient(135deg, #FEF0E3 0%, #FFE5D4 50%, #FFD4C4 100%)';
      case '12am_craving':
        return 'linear-gradient(135deg, #2C1810 0%, #3D2415 50%, #2C1810 100%)';
      case 'max_orders':
        // Adjusted to complement the orange font colors
        return 'linear-gradient(135deg, #FFF5EB 0%, #FFE5D4 30%, #FFD4C4 70%, #FFB88C 100%)';
      case 'pizzas':
        return 'linear-gradient(135deg, #FFE5D4 0%, #FFD4C4 50%, #FFA07A 100%)';
      case 'biryanis':
        return 'linear-gradient(135deg, #FEF0E3 0%, #FFE5D4 50%, #FFD4C4 100%)';
      default:
        return 'linear-gradient(135deg, #FEF0E3 0%, #FFE5D4 50%, #FFD4C4 100%)';
    }
  };

  const getEmoji = () => {
    switch (statType) {
      case 'favourite_dish':
        return '🍚';
      case '12am_craving':
        return '🍔';
      case 'pizzas':
        return '🍕';
      case 'biryanis':
        return '🍚';
      case 'restaurant':
        return '👑';
      default:
        return '';
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={styles.statScreen}
      style={{ background: getBackgroundGradient() }}
      data-stat-type={statType}
    >
      <div className={styles.floatingFood}></div>
      <div className={styles.floatingFood}></div>
      <div className={styles.floatingFood}></div>
      <div className={styles.floatingFood}></div>
      {/* Moon removed - no longer needed */}
      
      <div 
        ref={titleRef} 
        className={styles.title}
        style={statType === '12am_craving' ? { 
          textAlign: 'left', 
          color: '#FFFFFF',
          paddingLeft: '20px',
          alignSelf: 'flex-start',
          width: '100%'
        } : {}}
      >
        {data.title}
      </div>

      <div 
        ref={valueRef} 
        className={styles.value}
      >
        {statType === 'favourite_dish' && (
          <>
            {String(data.value).toUpperCase()}
          </>
        )}
        {statType === 'largest_order_value' && null}
        {statType === '12am_craving' && (
          <>
            {String(data.value).toUpperCase()} enters the chat
          </>
        )}
        {statType === 'restaurant' && (
          <>
            {data.value}
            <br />
            {getEmoji()}
          </>
        )}
        {statType === 'max_orders' && null}
        {statType === 'pizzas' && null}
        {statType === 'biryanis' && null}
      </div>

      {/* No floating emoji for 12am_craving - removed as per request */}


      {data.subtitle && (
        <div 
          ref={subtitleRef} 
          className={styles.subtitle}
          style={{ 
            opacity: statType === 'favourite_dish' ? 1 : (statType === '12am_craving' ? 1 : 0),
            visibility: statType === 'favourite_dish' ? 'visible' : (statType === '12am_craving' ? 'visible' : 'hidden'),
            display: 'block',
            color: statType === '12am_craving' ? '#FFFFFF' : '#D04500',
            backgroundColor: statType === '12am_craving' ? 'transparent' : 'rgba(255, 255, 255, 0.3)',
            padding: '12px 24px',
            borderRadius: '8px',
            marginTop: statType === '12am_craving' ? '-50px' : '10px',
            position: 'relative',
            zIndex: 200
          }}
        >
          {statType === '12am_craving' ? 'Hunger doesn\'t respect curfew' : data.subtitle}
        </div>
      )}

      {/* Swiggy Logo - Bottom Center - Same as intro screen */}
      <img 
        ref={logoRef}
        src={`${import.meta.env.BASE_URL}assets/logos/swiggy-logo.png`}
        alt="Swiggy" 
        className={styles.logo}
      />
    </div>
  );
}

export default StatScreen;



