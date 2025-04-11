// src/Context/AppContext.js
import React, { createContext, useState } from 'react';

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [userData, setUserData] = useState({userEmail: '12'});
  const [roomDetails, setRoomDetails] = useState([]);

  return (
    <AppContext.Provider value={{ userData, setUserData, roomDetails, setRoomDetails }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
