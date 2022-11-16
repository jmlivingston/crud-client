import '@picocss/pico/css/pico.min.css'
import 'bootstrap/dist/css/bootstrap-grid.min.css'
import 'bootstrap/dist/css/bootstrap-utilities.min.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './appInsights'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
