// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

// Import React development checker
import { StrictMode } from "react";

// Import React 18 rendering API
import { createRoot } from "react-dom/client";

// Load global styles
import "./index.css";

// Import root component
import App from "./App.jsx";

// Find root div in index.html
// Create React root
// Render App component inside StrictMode
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
