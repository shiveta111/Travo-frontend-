
  // import { createRoot } from "react-dom/client";
  // import App from "./app/App.tsx";
  // import "./styles/index.css";

  // createRoot(document.getElementById("root")!).render(<App />);
  

  import React from 'react';
import ReactDOM from 'react-dom/client';  

// import App from './App';
import App from "./app/App.tsx";
import "./styles/index.css";

import {
  AuthProvider
} from './auth/AuthContext';


ReactDOM.createRoot(
  document.getElementById('root')
).render(

  <AuthProvider>

    <App />

  </AuthProvider>

);