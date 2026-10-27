import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CurrencyProvider } from './context/CurrencyContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <WishlistProvider>
          <CurrencyProvider>
            <App />
          </CurrencyProvider>
        </WishlistProvider>
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
);
