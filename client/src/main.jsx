import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import SocketProviderWrapper from './Zustand/socketProviderWrapper.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <SocketProviderWrapper>
      <App />
      </SocketProviderWrapper>
    </BrowserRouter>

  </StrictMode>
)
