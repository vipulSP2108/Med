import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { API_BASE_URL, COMPLAINTS_ENDPOINT } from '../Constants/Constants';
import Colors from '../Components/Colors';
import TextStyles from '../Style/TextStyles';
import { Ionicons } from '@expo/vector-icons';
import useCustomAlert from '../Components/Alerthook';
import { ThemeContext } from '../Context/ThemeContext';

const ComplaintsList = () => {
  const { userData } = useContext(GlobalStateContext);
  const { showAlert, AlertWrapper } = useCustomAlert();
const { themeColors, toggleTheme } = useContext(ThemeContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createrName, setCreaterName] = useState(userData.contactinfo); // Initialize creator name
  const [fetching, setFetching] = useState(false); // To manage fetch status

  useEffect(() => {
    if (userData && userData.contactinfo) {
      handleFetchComplaints();
    }
  }, [userData]);

  const handleFetchComplaints = async () => {
    setLoading(true);
    setFetching(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}:${COMPLAINTS_ENDPOINT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ createrName: userData.contactinfo }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Error response:', text);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.status === 'ok') {
        setComplaints(data.data);
      } else {
        setError(data.data);
      }
    } catch (error) {
      showAlert({
        title: 'Error',
        message: 'Failed to load complaints. Please try again later.',
        codeMassage: { code: '500', text: error.message },
      });
      setError('Failed to load complaints');
      console.error(error);
    } finally {
      setLoading(false);
      setFetching(false);
    }
  };

  const renderComplaint = ({ item }) => (
    <View style={[styles.complaintContainer, {    backgroundColor: themeColors.componentColor,

      borderColor: themeColors.secComponentColor,}]}>
      <Text style={[styles.complaintTitle, {    color: themeColors.mainTextColor}]}>
        Against: {item.againstName}
      </Text>
      <Text>Status: {item.status}</Text>
      <Text>Complaint: {item.complaintText}</Text>
      <Text style={styles.timestamp}>
        Created on: {new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, {    backgroundColor: themeColors.backGroundColor,}]}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {loading ? (
        <ActivityIndicator size="large" color={themeColors.diffrentColorOrange} />
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item._id}
          renderItem={renderComplaint}
        />
      )}

      {AlertWrapper()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  complaintContainer: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  complaintTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 15,
  },
  // refreshButton: {
  //   marginTop: 20,
  //   paddingVertical: 12,
  //   borderRadius: 8,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // refreshButtonText: {
  //   fontSize: 16,
  //   color: themeColors.mainTextColor,
  // },
});

export default ComplaintsList;
