// App.js
import React from 'react';
import AppNavigator from './src/Navigation/AppNavigator';
import AppContextProvider from './src/Context/AppContext';
import { ThemeProvider } from './src/Context/ThemeContext';
import { AlertProvider } from './src/Context/AlertContext';

export default function App() {
  return (
    <AppContextProvider>

      <ThemeProvider>
        <AlertProvider>
          <AppNavigator />
        </AlertProvider>
      </ThemeProvider>

    </AppContextProvider>
  );
}
