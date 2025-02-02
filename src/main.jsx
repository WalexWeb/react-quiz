import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LazyMotion, domAnimation } from 'framer-motion'
import App from './app/App.jsx'
import './index.scss'
import './fonts/Bastionkontrastaltc.otf'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LazyMotion features={domAnimation}>
    <App />
    </LazyMotion>
  </StrictMode>,
)