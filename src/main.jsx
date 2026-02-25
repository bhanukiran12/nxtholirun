// ============================================================
// main.jsx – React entry point
// StrictMode is intentionally disabled to prevent the RAF
// game loop from running twice in development.
// ============================================================

import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);
