import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import './styles/global.css';

// Use HashRouter for GitHub Pages to avoid 404 issues
// URLs will be: /CAMPUS-WORKING-FINAL/#/poi_id or /CAMPUS-WORKING-FINAL/#/
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        {/* POI-specific path - must come first to match before root */}
        <Route path="/:poiId" element={<App />} />
        {/* Root path - uses default data */}
        <Route path="/" element={<App />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

