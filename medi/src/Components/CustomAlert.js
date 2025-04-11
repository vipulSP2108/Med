// src/components/CustomAlert.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Keyboard } from 'react-native';
import { useTheme } from '../Context/ThemeContext';  // Assuming you have a theme context
import { darkTheme, lightTheme } from '../Constants/theme';

const CustomAlert = ({ alertConfig, hideAlert }) => {
  const { theme } = useTheme();  // Get the current theme
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  // Handle dismissing the modal when tapping outside
  const handleDismiss = () => {
    hideAlert();
    Keyboard.dismiss();  // Optional: dismiss the keyboard if it's open
  };

  return (
    <Modal transparent visible={alertConfig.visible} animationType="fade">
      <TouchableWithoutFeedback onPress={handleDismiss}>
        <View style={[styles.overlay, { backgroundColor: currentTheme.overlayColor }]}>
          <TouchableWithoutFeedback>
            <View style={[styles.alertBox, { backgroundColor: currentTheme.backgroundColor }]}>
              {/* Title */}
              {alertConfig.title && (
                <Text style={[styles.title, { color: currentTheme.mainTextColor }]}>{alertConfig.title}</Text>
              )}

              {/* Message */}
              {alertConfig.message && (
                <Text style={[styles.message, { color: currentTheme.textColor }]}>{alertConfig.message}</Text>
              )}

              {/* Buttons */}
              {alertConfig.buttons && alertConfig.buttons.length > 0 && (
                <View style={styles.differentColorGreen}>
                  {alertConfig.buttons.map((button, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        button.onPress && button.onPress();
                        hideAlert();
                      }}
                      style={[styles.button, { backgroundColor: button.bgColor || currentTheme.primary }]}  // Use button.bgColor if provided, otherwise fall back to currentTheme.primary
                    >
                      <Text style={[styles.buttonText, { color: currentTheme.buttonText }]}>
                        {button.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  alertBox: {
    padding: 20,
    borderRadius: 10,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomAlert;
