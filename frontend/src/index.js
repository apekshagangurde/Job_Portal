// frontend/src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container); // Create a root for the React app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
