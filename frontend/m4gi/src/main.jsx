import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './utils/Auth.jsx'
import { NotificationProvider } from './utils/NotificationContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <NotificationProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NotificationProvider>
  </AuthProvider>
) 
