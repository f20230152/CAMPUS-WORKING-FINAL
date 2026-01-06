import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import './styles/global.css';

// Get base path for GitHub Pages
const basePath = import.meta.env.BASE_URL || '/';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basePath}>
      <Routes>
        {/* Root path - uses default data */}
        <Route path="/" element={<App />} />
        {/* POI-specific path - loads data based on POI ID */}
        <Route path="/:poiId" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

