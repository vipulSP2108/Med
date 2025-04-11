// src/Screens/HomeScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAlert } from '../Context/AlertContext';
import { lightTheme, darkTheme } from '../Constants/theme';
import { useNavigation, useTheme } from '@react-navigation/native';

const HomeScreen = ({route}) => {
  const navigation = useNavigation();

  const { showAlert } = useAlert();
  const { theme } = useTheme();

  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  const handleShowAlert = () => {
    showAlert("Join or Create a Room", "You can either join an existing room or create a new one to continue.",
      [
        {
          text: 'Join Room',
          onPress: () => console.log('Join Room Pressed'),
          bgColor: '#32cd32', // You can customize button color if needed
        },
        {
          text: 'Create Room',
          onPress: () => console.log('Create Room Pressed'),
          bgColor: '#1a73e8', // You can customize button color if needed
        },
      ]
    );
  };


  return (
    <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
      <Text style={[styles.text, { color: currentTheme.color }]}>Home Screen</Text>
      <Button title="Show Alert" onPress={handleShowAlert} />


      <Button
        title="Go to Notifications"
        onPress={() => navigation.navigate('Notifications')}
      />
      <Button
        title="Go to Messages"
        onPress={() => navigation.navigate('Messages')}
      />
      <Button
        title="Go to Messages"
        onPress={() => navigation.navigate('Settings')}
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

export default HomeScreen;
