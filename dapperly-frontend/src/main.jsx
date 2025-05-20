// src/App.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // <-- Use Router
import AppRoutes from './routes';
import { CartProvider } from './components/CartContext';
import { AuthProvider } from './components/AuthContext'; // <-- AuthProvider
import { AddressProvider } from './components/AddressContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <CartProvider>
          <AddressProvider>
          <AppRoutes />
          </AddressProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
