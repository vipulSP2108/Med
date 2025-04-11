import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const CreateClassScreen = () => {
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [room, setRoom] = useState('');
  const [subject, setSubject] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Class</Text>

      <Text style={styles.label}>Class name (required)</Text>
      <TextInput 
        style={styles.input} 
        value={className} 
        onChangeText={setClassName} 
        placeholder="Enter class name" 
        placeholderTextColor="#999"
      />

      <TextInput 
        style={styles.input} 
        value={section} 
        onChangeText={setSection} 
        placeholder="Section"
        placeholderTextColor="#999"
      />

      <TextInput 
        style={styles.input} 
        value={room} 
        onChangeText={setRoom} 
        placeholder="Room"
        placeholderTextColor="#999"
      />

      <TextInput 
        style={styles.input} 
        value={subject} 
        onChangeText={setSubject} 
        placeholder="Subject"
        placeholderTextColor="#999"
      />

      <TouchableOpacity 
        style={[styles.button, className ? styles.buttonActive : styles.buttonDisabled]}
        disabled={!className}
      >
        <Text style={styles.buttonText}>Create</Text>
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
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
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

export default CreateClassScreen;
