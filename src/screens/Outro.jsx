import React from 'react';
import styles from '../styles/Outro.module.css';

function Outro({ campusData, onReplay }) {
  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${campusData.college_name} Campus Wrapped`,
          text: `Check out ${campusData.college_name}'s Campus Wrapped!`,
          url: url
        });
      } catch (err) {
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Show feedback if needed
    });
  };

  const formatCurrency = (value) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  return (
    <div className={styles.outro}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.label}>SWIGGY CAMPUS WRAPPED</div>
          <div className={styles.titleRow}>
            <h1 className={styles.mainTitle}>{campusData.college_name.toUpperCase()}</h1>
            <div className={styles.trophyIcon}>🏆</div>
          </div>
        </div>

        {/* Metric Tiles Grid */}
        <div className={styles.metricsGrid}>
          {/* Tile 1 - Full width */}
          <div className={`${styles.metricTile} ${styles.spanTwoColumns} ${styles.centeredTile}`}>
            <div className={styles.tileLabel}>FAVOURITE DISH</div>
            <div className={styles.tileValue}>{campusData.stats.favourite_dish.toUpperCase()} 🍛</div>
          </div>

          {/* Tile 2 */}
          <div className={styles.metricTile}>
            <div className={styles.tileLabel}>12 AM CRAVING</div>
            <div className={styles.tileValue}>{campusData.stats.official_12am_craving.toUpperCase()} 🍔</div>
          </div>

          {/* Tile 3 */}
          <div className={styles.metricTile}>
            <div className={styles.tileLabel}>CAMPUS FAVOURITE RESTAURANT</div>
            <div className={styles.tileValue}>
              {campusData.stats.unofficial_favorite_restaurant}
              <span className={styles.tileEmoji}>👑</span>
            </div>
          </div>

          {/* Tile 4 */}
          <div className={styles.metricTile}>
            <div className={styles.tileLabel}>HIGHEST SPEND ORDER</div>
            <div className={styles.tileValue}>{formatCurrency(campusData.stats.largest_order_value)} 💰</div>
          </div>

          {/* Tile 5 */}
          <div className={styles.metricTile}>
            <div className={styles.tileLabel}>MAX ORDERS BY A STUDENT (WEEK)</div>
            <div className={styles.tileValue}>{campusData.stats.max_orders_in_a_week} 📦</div>
          </div>

          {/* Tile 6 */}
          <div className={styles.metricTile}>
            <div className={styles.tileLabel}>MAX PIZZAS IN A DAY</div>
            <div className={styles.tileValue}>{campusData.stats.max_pizzas_single_day} 🍕</div>
          </div>

          {/* Tile 7 */}
          <div className={styles.metricTile}>
            <div className={styles.tileLabel}>MAX BIRYANI-S IN A DAY</div>
            <div className={styles.tileValue}>{campusData.stats.max_biryanis_single_day} 🍗🍚</div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          Swiggy • Campus Wrapped 2025
        </div>
      </div>

      {/* Swiggy Logo - Bottom Center - Same as intro screen */}
      <img 
        src={`${import.meta.env.BASE_URL}assets/logos/swiggy-logo.png`}
        alt="Swiggy" 
        className={styles.logo}
      />

      {/* Share CTA Button - Outside Card */}
      <button 
        className={styles.shareButton}
        onClick={handleShare}
      >
        Share
        <span className={styles.shareIcon}>↗</span>
      </button>
    </div>
  );
}

export default Outro;
