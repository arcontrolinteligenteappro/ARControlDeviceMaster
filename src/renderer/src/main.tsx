// src/renderer/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Assuming Tailwind CSS entry point is index.css
import App from './App';
import './i18n'; // Import i18n configuration

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Fatal: Could not find the root element to mount React.");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
