// src/Screens/SettingsScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { darkTheme, lightTheme } from '../Constants/theme';

const SettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Text style={[styles.text, { color: currentTheme.color }]}>Settings Screen</Text>
      <Button
        title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        onPress={toggleTheme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});

export default SettingsScreen;
