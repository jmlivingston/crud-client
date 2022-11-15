import '@picocss/pico/css/pico.min.css'
import 'bootstrap/dist/css/bootstrap-grid.min.css'
import 'bootstrap/dist/css/bootstrap-utilities.min.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// import PicoExample from './PicoExample'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {/* <PicoExample /> */}
  </React.StrictMode>
)
