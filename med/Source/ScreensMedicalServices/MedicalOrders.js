import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, RefreshControl, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { ThemeContext } from '../Context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { GOOGLE_SCRIPT_getHistory } from './api/api';
import { GOOGLE_SCRIPT_cancelAppointment } from './api/api';

export default function MedicalOrders() {
  const { themeColors, toggleTheme } = useContext(ThemeContext);
  const { doctorData, userData } = useContext(GlobalStateContext);

  const [MedicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modelloading, setModelLoading] = useState(false);

  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const getHistory = async () => {
    if (!userData.contactinfo || !doctorData) {
      console.error("User data or doctor data is not provided");
      return;
    }

    setLoading(true);
    setError(null);

    const userEmail = userData.contactinfo;
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' });
    const todayDate = formattedDate.replaceAll(",", "");
    const doctorNames = doctorData.map((doctorInit) => doctorInit.DoctorName);

    try {
      const response = await fetch(GOOGLE_SCRIPT_getHistory, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: userEmail,
          todayDate: todayDate,
          doctorNames: doctorNames,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const text = await response.text();
      try {
        const data = JSON.parse(text);
        const medhistory = data.userAppointments;

        function parseDate(appointment) {
          const currentYear = new Date().getFullYear();
          const fullDateStr = `${appointment.date} ${currentYear} ${appointment.time}`;
          return new Date(fullDateStr);
        }

        const enrichedHistory = medhistory.map((item) => {
          const doctor = doctorData.find((doc) => doc.DoctorName === item.doctor);
          return {
            ...item,
            doctorImage: doctor?.doctorImage,
            doctorSpecialization: doctor?.Specialization,
            doctorExperience: doctor?.experience,
            doctorResults: doctor?.results,
          };
        });

        const sortedHistory = [...enrichedHistory].sort((a, b) => parseDate(a) - parseDate(b));
        setMedicalHistory(sortedHistory);
      } catch (parseError) {
        throw new Error('Error parsing JSON response');
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching history:", error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    getHistory();
  }, [doctorData, userData]);

  const onRefresh = () => {
    setRefreshing(true);
    getHistory();
  };

  // Handle modal open
  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true); // Show the modal
  };

  // Handle appointment cancellation
  const confirmCancellation = async () => {
    setModelLoading(true)
    const userEmail = userData.contactinfo;

    console.log("Appointment canceled:", selectedAppointment);

    try {
      const response = await fetch(GOOGLE_SCRIPT_cancelAppointment, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          row: selectedAppointment.row,
          col: selectedAppointment.col,
          doctorName: selectedAppointment.doctor,
          userEmail: userEmail,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const text = await response.text();
      try {
        const data = JSON.parse(text);

        if (data.message) {
          Alert.alert("Success", data.message); // Show success message
        } else {
          Alert.alert("Error", data.error); // Show error message if any
        }

      } catch (parseError) {
        Alert.alert("Error", "Error parsing the response.");
        throw new Error('Error parsing JSON response');
      }
    } catch (error) {
      setError(error.message);
      console.error("Error during cancellation:", error);
    }

    setModelLoading(false)
    // Refresh the medical history list after cancellation
    getHistory();
    setModalVisible(false); // Close modal after cancellation
  };


  // Close modal if touched outside
  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: themeColors.backGroundColor }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[themeColors.diffrentColorPerple]} />}
    >
      <View style={{ padding: 10 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={{ color: 'red' }}>{error}</Text>
        ) : (
          <View>
            {MedicalHistory.length == 0 && <Text className=' text-center items-center justify-center w-full'>No Appointment Scheduled</Text>}
            <FlatList
              data={MedicalHistory}
              keyExtractor={(item, index) => `${item.doctor}-${item.date}-${index}`}
              renderItem={({ item }) => (
                <View style={{ marginBottom: 20, borderRadius: 10, overflow: 'hidden', shadowColor: 'black', elevation: 2 }}>
                  <View style={{ backgroundColor: themeColors.diffrentColorPerpleBG, padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      source={{ uri: item.doctorImage || 'https://campus.iitgn.ac.in/facility/img/security.png' }}
                      style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: themeColors.mainTextColor }}>{item.doctor}</Text>
                      <Text style={{ color: themeColors.textColor }}>{item.doctorSpecialization}</Text>
                    </View>
                    <TouchableOpacity style={{ marginRight: 10 }}>
                      <View style={{ backgroundColor: themeColors.diffrentColorPerple }} className="p-2 bg-black rounded-full">
                        <Ionicons name="chatbubble-outline" size={18} color={themeColors.backGroundColor} />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleCancelAppointment(item)}>
                      <View style={{ backgroundColor: themeColors.backGroundColor }} className="p-2 bg-black rounded-full">
                        <Ionicons name="arrow-forward" size={18} color={themeColors.diffrentColorPerple} />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View className="px-3 py-2 flex-row items-center" style={{ backgroundColor: themeColors.backGroundColor }}>
                    <Ionicons name={"time-outline"} size={18} color={themeColors.textColor} />
                    <Text className="ml-1" style={{ color: themeColors.textColor }}>
                      {item.date}, {item.time.split(':')[0]}:{item.time.split(':')[1]}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        )}
      </View>

      {/* Modal for Appointment Cancellation */}
      {selectedAppointment && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <TouchableWithoutFeedback>
                <View style={{ backgroundColor: themeColors.backGroundColor, padding: 20, borderRadius: 10, width: '80%' }}>
                  <Text style={{ color: themeColors.mainTextColor, fontSize: 18 }}>Do you want to cancel the appointment with {selectedAppointment.doctor}?</Text>
                  <Text style={{ color: themeColors.textColor, marginVertical: 10 }}>
                    On {selectedAppointment.date} at {selectedAppointment.time}
                  </Text>
                  {modelloading ?
                    <ActivityIndicator size="large" color="#0000ff" />
                    :
                    <View className="flex-row items-center justify-center" style={{ width: '100%' }}>
                      <TouchableOpacity
                        onPress={confirmCancellation}
                        style={{
                          backgroundColor: themeColors.diffrentColorPerple,
                          padding: 10,
                          borderRadius: 5,
                          width: '43%',
                          marginRight: 10,
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ color: themeColors.backGroundColor }}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        style={{
                          backgroundColor: themeColors.diffrentColorPerple,
                          padding: 10,
                          borderRadius: 5,
                          width: '43%',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ color: themeColors.backGroundColor }}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  }
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </ScrollView>
  );
}
