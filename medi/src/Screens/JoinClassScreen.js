import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const JoinClassScreen = () => {
  const [classCode, setClassCode] = useState('');

  const isValidCode = classCode.length >= 6 && classCode.length <= 8 && /^[a-zA-Z0-9]+$/.test(classCode);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Join class</Text>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Image 
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' }} // Replace with real profile image URL
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.userName}>Vipul Patil</Text>
          <Text style={styles.userEmail}>vipul.patil@iitgn.ac.in</Text>
          <Text style={styles.switchText}>Switch account</Text>
        </View>
      </View>

      {/* Input */}
      <Text style={styles.label}>Class code</Text>
      <TextInput 
        style={styles.input} 
        value={classCode} 
        onChangeText={setClassCode} 
        placeholder="Enter class code" 
        placeholderTextColor="#999"
      />

      {/* Info Text */}
      <Text style={styles.infoText}>
        To sign in with a class code:
      </Text>
      <Text style={styles.bulletPoint}>• Use an authorised account</Text>
      <Text style={styles.bulletPoint}>• Use a class code with 6–8 letters or numbers and no spaces or symbols</Text>

      {/* Join Button */}
      <TouchableOpacity 
        style={[styles.button, isValidCode ? styles.buttonActive : styles.buttonDisabled]}
        disabled={!isValidCode}
      >
        <Text style={styles.buttonText}>Join</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#ccc',
    fontSize: 14,
  },
  switchText: {
    color: '#1e88e5',
    fontSize: 14,
    marginTop: 4,
  },
  label: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 12,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoText: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 10,
  },
  bulletPoint: {
    color: '#aaa',
    fontSize: 14,
    marginLeft: 10,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonActive: {
    backgroundColor: '#1e88e5',
  },
  buttonDisabled: {
    backgroundColor: '#444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JoinClassScreen;
