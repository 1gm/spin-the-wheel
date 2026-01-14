import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';

// Get base path from Vite's import.meta.env.BASE_URL
const basePath = import.meta.env.BASE_URL;

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter basename={basePath}>
            <App />
        </BrowserRouter>
    </StrictMode>
);
