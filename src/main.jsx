import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "../src/index.css"
import { ToastContainer } from 'react-toastify'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
    <BrowserRouter basename="/predesalud_front">
      <ToastContainer position='top-left'/>
      <App/>
    </BrowserRouter>,
)
