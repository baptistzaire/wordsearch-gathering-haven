import { Buffer } from 'buffer';
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure Buffer is available globally before any other imports
window.Buffer = Buffer;
globalThis.Buffer = Buffer;

createRoot(document.getElementById("root")!).render(<App />);