import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Fa6Icon from 'react-native-vector-icons/FontAwesome6';  // Using FontAwesome
import { useTheme } from '@react-navigation/native';
import { darkTheme, lightTheme } from '../Constants/theme';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { useAlert } from '../Context/AlertContext';
import { GOOGLE_SCRIPT_GetUserRoomInfo } from '../Data/api';
import { AppContext } from '../Context/AppContext';

const RoomListScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { showAlert } = useAlert();

  const { userData, roomDetails, setRoomDetails } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const currentTheme = theme === 'light' ? darkTheme : lightTheme;

  const getUserRoomInfo = async () => {
    if (!userData.userEmail) {
      console.error("No email ID provided.");
      showAlert("Error", "Email ID is required to fetch room details.");  // Show alert for error
      return;
    }
  
    setLoading(true);
    setRefreshing(true);
  
    try {
      // Make the API request to your Google Apps Script endpoint
      const response = await fetch(GOOGLE_SCRIPT_GetUserRoomInfo, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: userData.userEmail,  // Send the email ID to fetch room info
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
  
      const text = await response.text(); // Get raw response text
      try {
        const data = JSON.parse(text); // Attempt to parse the JSON response
  
        if (data.message) {
          console.log(data.message);  // Log the message (success or failure)
          
          // If it's a regular message, display it as text
          if (data.message && data.data) {
            // Regular message: show as text, not alert
            setRoomDetails(data.data);  // Set room details if available
          } else {
            // If no data, show an error alert
            showAlert("Something Went Wrong", data.message);  // Show alert with a custom title
          }
        }
  
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        showAlert("Error", "Failed to process the room data.");  // Alert for parse error
      }
    } catch (error) {
      console.error("Error fetching user room info:", error);
      showAlert("Something Went Wrong", "An error occurred while fetching room details. Please try again later.");  // Custom title for errors
    } finally {
      setLoading(false);  // Stop loading
      setRefreshing(false); // Stop refreshing
    }
  };  

  useEffect(() => {
    getUserRoomInfo();
  }, [userData]);

  const handleShowAlert = () => {
    showAlert("Join or Create a Room", "You can either join an existing room or create a new one to continue.",
      [
        {
          text: 'Join Room',
          onPress: () => navigation.navigate('JoinClassScreen'),
          bgColor: '#32cd32', // You can customize button color if needed
        },
        {
          text: 'Create Room',
          onPress: () => navigation.navigate('CreateClassScreen'),
          bgColor: '#1a73e8', // You can customize button color if needed
        },
      ]
    );
  };

  const handleRefresh = () => {
    getUserRoomInfo();  // Call the same function for refreshing
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={roomDetails}  // Use fetched data or fallback to mock data
          keyExtractor={(item) => item.uniqueCode}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: currentTheme.shadowColor }]}
              onPress={() => navigation.navigate('Home', { data: item, classroomName: item.roomName })}
            >
              <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                <View style={{ padding: 16 }}>
                  <Text style={[styles.title, { color: currentTheme.mainTextColor }]}>{item.roomName}</Text>
                  <Text style={{ color: currentTheme.textColor }}>{item.subRoomName}</Text>
                </View>
                <TouchableOpacity style={{ padding: 16, alignItems: 'flex-end', width: 50 }}>
                  <Fa6Icon name="ellipsis-vertical" size={22} color={currentTheme.mainTextColor} />
                </TouchableOpacity>
              </View>
              <Text style={{ padding: 16, color: currentTheme.mainTextColor }}>{item.ownerName}</Text>
            </TouchableOpacity>
          )}
          refreshing={refreshing} // Show pull-to-refresh indicator
          onRefresh={handleRefresh}  // Trigger refresh when pulled
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: currentTheme.subBackgroundColor }]}
          onPress={handleShowAlert}>
          <AntIcon name="plus" size={22} color={currentTheme.mainTextColor} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginTop: 10,
    marginHorizontal: 10,
    minHeight: 140,
    justifyContent: 'space-between',
    borderRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

export default RoomListScreen;
