import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import './styles/global.css';

/**
 * Swiggy WebView Fix
 * - Swiggy strips #/poiId
 * - It keeps ?campus=poiId
 * - We convert query → hash BEFORE React Router loads
 */
(function syncQueryToHash() {
  const params = new URLSearchParams(window.location.search);
  const campusId = params.get('campus');

  if (campusId && (!window.location.hash || window.location.hash === '#/')) {
    window.location.replace(
      window.location.pathname + '#/' + campusId
    );
  }
})();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        {/* POI-specific route */}
        <Route path="/:poiId" element={<App />} />
        {/* Default / sample */}
        <Route path="/" element={<App />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
