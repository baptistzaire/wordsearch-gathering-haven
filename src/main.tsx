import { Buffer } from 'buffer';
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Make Buffer available globally
globalThis.Buffer = Buffer;

createRoot(document.getElementById("root")!).render(<App />);