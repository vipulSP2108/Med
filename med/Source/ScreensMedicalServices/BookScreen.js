const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxV41iU6TljMTkSd87gmdzmHfa0u02GbJjngv8seVghU51mIrhIzEUvVQajqWlZqtrg/exec'
// 'https://script.google.com/macros/s/AKfycbyg-JnXqu7zVpwE1aPM4fd9ntkHecOY0UQBtBHvGMhiGGLjxGYAocWGbOQPh6CtIFJR/exec'

import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { ThemeContext } from '../Context/ThemeContext';

const BookScreen = () => {
  const { themeColors, toggleTheme } = useContext(ThemeContext);
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [doctorName, setDoctorName] = useState('');

  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!date || !slot || !doctorName) {
      Alert.alert('Error', 'Please enter both a date, doctorName and a slot.');
      return;
    }

    setIsLoading(true); // Show loading spinner

    try {
      // Send data to the Google Apps Script using fetch
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: date,
          slot: slot,
          doctorName: doctorName,
        }),
      });

      // Check if the response is OK (status code 200)
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Try parsing the response text as JSON
      const text = await response.text(); // Get raw response text
      try {
        const data = JSON.parse(text); // Attempt to parse the JSON response
        setResponseMessage(data.message);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        setResponseMessage('Unexpected response from server.');
      }

    } catch (error) {
      console.error('Error posting to Google Sheets:', error);
      setResponseMessage('Failed to add the slot. Please try again.');
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };



  return (
    <View style={[styles.container, { backgroundColor: themeColors.backGroundColor }]}>
      <Text style={[styles.header, { color: themeColors.mainTextColor }]}>Book a Time Slot</Text>

      <TextInput
        style={[styles.input, { backgroundColor: themeColors.componentColor, color: themeColors.mainTextColor }]}
        placeholder="Enter Date (e.g., Mon Mar 4 2025)"
        value={date}
        onChangeText={setDate}
        placeholderTextColor={themeColors.textColor}
      />

      <TextInput
        style={[styles.input, { backgroundColor: themeColors.componentColor, color: themeColors.mainTextColor }]}
        placeholder="Enter Slot (e.g., 12:00)"
        value={slot}
        onChangeText={setSlot}
        placeholderTextColor={themeColors.textColor}
      />

      <TextInput
        style={[styles.input, { backgroundColor: themeColors.componentColor, color: themeColors.mainTextColor }]}
        placeholder="DoctorA"
        value={doctorName}
        onChangeText={setDoctorName}
        placeholderTextColor={themeColors.textColor}
      />

      <Button
        title={isLoading ? 'Booking...' : 'Submit'}
        onPress={handleSubmit}
        disabled={isLoading}
        color={themeColors.diffrentColorGreen}
      />

      {responseMessage ? (
        <Text style={[styles.responseMessage, { color: themeColors.diffrentColorGreen }]}>
          {responseMessage}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    width: '80%',
    borderRadius: 5,
  },
  responseMessage: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default BookScreen;