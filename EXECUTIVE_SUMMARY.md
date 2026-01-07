# Swiggy Campus Wrapped 2025 - Executive Summary

## Project Overview
Built an interactive, shareable year-end summary experience that showcases campus-specific food ordering statistics for 500+ college campuses across India. Each campus receives a personalized "wrapped" experience similar to Spotify Wrapped, highlighting unique ordering patterns, favorite dishes, and memorable moments.

---

## Key Features & Capabilities

### 1. **Multi-Campus Dynamic System**
- **501 unique campus experiences** with personalized data
- Each campus has a dedicated URL route using POI IDs
- Real-time data loading with intelligent caching for performance
- Seamless user experience across all campuses simultaneously

### 2. **Interactive Experience Design**
- **8 animated screens** per campus:
  - Intro screen with campus branding
  - Favorite dish with confetti animations
  - Highest value order
  - Campus favorite restaurant
  - 12 AM craving insights
  - Max orders by a student (weekly)
  - Pizza & Biryani peak days
  - Summary outro with share functionality
- GSAP-powered smooth animations and transitions
- Background music with mute/unmute controls
- Mobile-responsive design optimized for all devices

### 3. **Statistics Displayed**
- Favorite dish of the campus
- Largest order value (group ordering insights)
- Unofficial campus favorite restaurant
- Official 12 AM craving/dish
- Maximum orders by a single student in a week
- Peak pizza orders in a single day
- Peak biryani orders in a single day
- All metrics with campus-specific one-liners and emojis

### 4. **Technical Architecture**
- **Frontend**: React 18 with Vite build system
- **Routing**: React Router with HashRouter for static hosting compatibility
- **Animations**: GSAP for professional-grade transitions
- **Data Management**: JSON-based data structure (500KB) with client-side caching
- **Deployment**: Currently on GitHub Pages with GitHub Actions CI/CD
- **Performance**: Optimized asset loading, lazy data fetching, loading states

---

## Current Status & Requirements

### Current Deployment
- **Temporary Hosting**: GitHub Pages (`https://f20230152.github.io/CAMPUS-WORKING-FINAL/`)
- **Status**: Fully functional, tested, and ready for production
- **Limitation**: Requires proper domain and hosting infrastructure for official launch

### Production Requirements
- **Custom Domain**: Branded URL (e.g., `campuswrapped.swiggy.com`)
- **Hosting Infrastructure**: 
  - Static site hosting with CDN support
  - SSL certificate for secure connections
  - High availability for concurrent user traffic
- **Scalability**: Architecture supports unlimited simultaneous users across all campuses

---

## Business Value

- **Engagement**: Shareable, viral-ready format increases brand visibility
- **Personalization**: Each campus gets unique, relatable content
- **Data Storytelling**: Transforms raw ordering data into engaging narratives
- **Mobile-First**: Optimized for in-app web view integration
- **Zero Maintenance**: Static architecture requires minimal server resources

---

## Technical Highlights

- **Single-Page Application** with client-side routing
- **Dynamic data loading** - 501 campuses from single JSON file
- **No backend required** - fully static, scalable architecture
- **GitHub Actions CI/CD** - automatic deployment on code changes
- **Cross-platform compatibility** - works on all modern browsers and devices

---

**Tech Stack**: React, Vite, GSAP, React Router, GitHub Actions  
**Development Time**: Complete end-to-end implementation  
**Ready for**: Production deployment pending hosting/domain approval

