import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext(null);

export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', rate: 1.0, label: 'INR (₹)' },
  USD: { code: 'USD', symbol: '$', rate: 0.012, label: 'USD ($)' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.011, label: 'EUR (€)' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.0095, label: 'GBP (£)' },
  AED: { code: 'AED', symbol: 'AED ', rate: 0.044, label: 'AED (د.إ)' },
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState('INR');

  useEffect(() => {
    const saved = localStorage.getItem('wanderly_currency');
    if (saved && CURRENCIES[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (code) => {
    if (CURRENCIES[code]) {
      setCurrencyState(code);
      localStorage.setItem('wanderly_currency', code);
    }
  };

  const formatPrice = (inrAmount) => {
    const curr = CURRENCIES[currency] || CURRENCIES.INR;
    const converted = (Number(inrAmount) || 0) * curr.rate;

    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(converted);
    }

    return `${curr.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        currencyConfig: CURRENCIES[currency],
        availableCurrencies: Object.values(CURRENCIES),
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};
