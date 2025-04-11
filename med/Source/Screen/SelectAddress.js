import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { API_BASE_URL, USERSDATA_ENDPOINT } from '../Constants/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalStateContext } from '../Context/GlobalStateContext';

const UserProfile = ({ navigation }) => {
  const { userData } = useContext(GlobalStateContext);

  // Call getData function when the component mounts
  return (
    <View style={styles.container}>
      {userData ? (
        <>
          <Text style={styles.title}>User Profile</Text>
          <Text>Name: {userData.name}</Text>
          <Text>Email: {userData.contactinfo}</Text>
          <Text>Phone: {userData.phone}</Text>
          <Text>Role: {userData.role}</Text>
          <Text>Device Expo Token: {userData.DeviceEXPO}</Text>
          {/* You can display more fields if needed */}
        </>
      ) : (
        <Text>Loading user data...</Text>
      )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default UserProfile;
