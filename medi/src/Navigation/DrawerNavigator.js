// src/Navigation/DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import SettingsScreen from '../Screens/SettingsScreen';
import { useTheme } from '../Context/ThemeContext';
import { lightTheme, darkTheme } from '../Constants/theme';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { theme } = useTheme();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: currentTheme.headerBackgroundColor,
        },
        headerTintColor: currentTheme.headerTextColor,
        drawerStyle: {
          backgroundColor: currentTheme.backgroundColor,
        },
        drawerLabelStyle: {
          color: currentTheme.textColor,
        },
      }}
    >
      <Drawer.Screen name="Tabs" component={BottomTabNavigator} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
