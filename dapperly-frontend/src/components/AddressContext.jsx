// src/context/AddressContext.js
import React, { createContext, useContext, useState } from 'react';

// Create context
const AddressContext = createContext();

// Hook to use context
export const useAddress = () => useContext(AddressContext);

// Provider component
export const AddressProvider = ({ children }) => {
  const [address, setAddress] = useState("");

  const addAddress = (payload) => {
    setAddress(payload);
  };

  return (
    <AddressContext.Provider value={{ address, addAddress }}>
      {children}
    </AddressContext.Provider>
  );
};
