
import { Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Provider } from 'react-native-paper';
import { getUser } from './data/userStorage'; 
import HomeLayout from './home/layout'; 
import Login from './login'; 

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); 

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await getUser();
      setIsLoggedIn(!!user);
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsLoggedIn(false);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (isLoggedIn === null) {
    
    return null;
  }

  return (
    <Provider>
      {isLoggedIn ? (
        <HomeLayout onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </Provider>
  );
}