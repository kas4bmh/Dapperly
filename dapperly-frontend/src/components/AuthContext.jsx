import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize token from localStorage if present
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loggedInUser, setLoggedInUser] = useState(()=>JSON.parse(localStorage.getItem("loggedInUser")));

  // isAuthenticated is true if token exists
  const isAuthenticated = !!token;

  // Persist token changes to localStorage
  useEffect(() => {
    if (token) 
      localStorage.setItem('token', token);
    else 
      localStorage.removeItem('token');
    if(loggedInUser)
      localStorage.setItem("loggedInUser",JSON.stringify(loggedInUser))
    else
    localStorage.removeItem("loggedInUser");
    
  }, [token,loggedInUser]);

  // Login now accepts token
  const login = (data) => {
    setToken(data.bearer);
    setLoggedInUser(data.loggedInUser);   
  };

  const logout = () => {
    setToken(null);
    setLoggedInUser(null);
  };

  return (
    <AuthContext.Provider value={{ token,loggedInUser,isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
