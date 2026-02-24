import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const container = document.getElementById('root');

if (container) {
    try {
        createRoot(container).render(
            <StrictMode>
                <App />
            </StrictMode>,
        )
    } catch (e) {
        console.error("Critical Render Error", e);
        container.innerHTML = `<div style="color: white; padding: 20px; font-family: monospace;">
            <h1>[ KERNEL PANIC ]</h1>
            <p>${e instanceof Error ? e.message : 'Unknown fatal error during initialization.'}</p>
        </div>`;
    }
}