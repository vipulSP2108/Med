import { View, Text, FlatList, ActivityIndicator, StatusBar, ScrollView, StyleSheet, Dimensions, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { GOOGLE_SCRIPT_getFullMessHistory, GOOGLE_SCRIPT_getTodayMessHistory } from './helper/fetchMessMenuData';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../Context/ThemeContext';
import TextStyles from '../Style/TextStyles';
import { Ionicons } from '@expo/vector-icons';
import BounceText from '../Components/BounceText';

export default function MessOrders() {
  const { userData } = useContext(GlobalStateContext);
  const navigation = useNavigation();
  const { themeColors } = useContext(ThemeContext);
  const fontstyles = TextStyles();

  // const [messFullHistory, setMessFullHistory] = useState(
  //   [{ "Date": "2025-03-30T18:30:00.000Z", "Massage": "", "Mess": "Jaiswal", "Parcel": false, "Price": 100, "Slot": "07:30 PM - 08:00 PM" }, { "Date": "2025-03-30T18:30:00.000Z", "Massage": "", "Mess": "Mohani", "Parcel": true, "Price": 100, "Slot": "07:30 PM - 08:00 PM" }, { "Date": "2025-03-09T18:30:00.000Z", "Massage": "", "Mess": "Rgouras", "Parcel": false, "Price": 60, "Slot": "08:00 PM - 08:30 PM" },]
  // );

  const [messFullHistory, setMessFullHistory] = useState([]);

  const [messTodayHistory, setMessTodayHistory] = useState([]);
  const [formattedDate, setFormattedDate] = useState('');

  // Separate loading states
  const [loadingToday, setLoadingToday] = useState(false);
  const [loadingFull, setLoadingFull] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [swiped, setSwiped] = useState(true);

  // Format the current date to match the date format in the sheet
  useEffect(() => {
    const selectDate = new Date();

    const formatted = selectDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    // Remove the comma from the formatted string
    const formattedWithoutCommas = formatted.replace(/,/g, '');
    setFormattedDate(formattedWithoutCommas); // Update the state
  }, []);

  // console.log(messFullHistory)
  
  const fetchMessHistory = async () => {
    setLoadingToday(true); // Set loading to true for Today data

    try {
      const response = await fetch(GOOGLE_SCRIPT_getTodayMessHistory, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: userData.contactinfo,
          date: formattedDate,
        }),
      });

      if (!response.ok) {
        console.error(`Server error: ${response.status}`);
        setLoadingToday(false);
        return;
      }

      const text = await response.text(); // Get raw response text

      try {
        const data = JSON.parse(text); // Attempt to parse the JSON response
        setMessTodayHistory(data);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
    } finally {
      setLoadingToday(false); // Set loading to false after fetching is complete
    }
  };

  useEffect(() => {
    if (!userData.contactinfo) {
      console.error('userData is not Provided');
      return;
    }

    fetchMessHistory();  // Call the function to fetch the mess history
  }, [formattedDate, userData.contactinfo]);

  const fetchMessFullHistory = async () => {
    setLoadingFull(true); // Set loading to true for Full History data

    try {
      const response = await fetch(GOOGLE_SCRIPT_getFullMessHistory, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: userData.contactinfo,
        }),
      });

      if (!response.ok) {
        console.error(`Server error: ${response.status}`);
        setLoadingFull(false);
        return;
      }

      const text = await response.text(); // Get raw response text

      try {
        const data = JSON.parse(text); // Attempt to parse the JSON response
        setMessFullHistory(data);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
    } finally {
      setLoadingFull(false); // Set loading to false after fetching is complete
    }
  };

  useEffect(() => {
    if (!userData.contactinfo) {
      console.error('userData is not Provided');
      return;
    }
    fetchMessFullHistory();  // Call the function to fetch the full mess history
  }, [userData.contactinfo]);

  const onRefresh = () => {
    setSwiped(false);
    setRefreshing(true);
    fetchMessHistory();
    fetchMessFullHistory();
    setRefreshing(false);
  };

  return (
    <View className='h-full w-full' style={{ backgroundColor: themeColors.backGroundColor }}>
      <ScrollView
        // style={{ backgroundColor: themeColors.backGroundColor, flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[themeColors.diffrentColorPerple]} />}
      >
        <StatusBar barStyle={themeColors.backGroundColor === "#1C1C1E" ? 'light-content' : 'dark-content'} backgroundColor={themeColors.bottomNav} />

        <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor, textAlign: 'center', marginTop: 10, marginBottom: 10 }]}>
          Today's Orders
        </Text>

        {loadingToday && (
          <View style={{ backgroundColor: themeColors.backGroundColor, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={themeColors.primary} />
          </View>
        )}

        {messTodayHistory.message && (
          <Text
            className='flex items-center justify-center text-center mt-3'
            style={[fontstyles.h5_bold, { color: themeColors.diffrentColorOrange }]}>
            No record found for date: {formattedDate}
          </Text>
        )}

        {messTodayHistory.length > 0 && !loadingToday && (
          <FlatList
            data={messTodayHistory}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              const formattedItemDate = new Date(item.Date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              }).replace(/,/g, ''); // Remove commas for consistent format

              return (
                <View className={`drop-shadow-2xl rounded-xl overflow-hidden p-3 mx-2 mt-2 ${index == messTodayHistory.length - 1 && 'mb-5'}`} style={[{ backgroundColor: themeColors.shadowcolor, elevation: 10, }]}>
                  <View className='flex-row justify-between'>
                    <View>
                      <View className='flex-row items-center'>
                        <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor }]}>{item.Mess}</Text>
                      </View>
                      <Text style={[fontstyles.h4, { color: themeColors.textColor }]}>{formattedItemDate}</Text>
                    </View>
                    <View className='items-end'>

                      <Text style={[fontstyles.number, { fontSize: 16, color: themeColors.diffrentColorOrange }]}>{item.Slot}</Text>
                      <View className='  mt-[1px] flex-row '>
                        <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor, fontSize: 22 }]}>Total:  </Text>
                        <Text style={[fontstyles.number, { fontSize: 14, color: themeColors.mainTextColor, marginTop: 4 }]}>₹ {item.Price}</Text>
                      </View>
                    </View>
                  </View>

                  <View className='flex-row justify-between'>
                    <View className=' flex-row items-center justify-center'>
                      <Text style={[fontstyles.h3, { color: themeColors.diffrentColorPerple }]}>
                        {item.Parcel ? 'Parcel:' : 'Dine in:'}
                      </Text>
                      <Text className=' ml-2' style={[fontstyles.h1, { color: themeColors.textColor, fontSize: 22, }]} >
                        {item.Item}
                      </Text>
                    </View>
                    <Text style={[fontstyles.number, { fontSize: 15, color: themeColors.mainTextColor }]} className='text-white'>

                    </Text>
                  </View>

                  <View className=' mt-3 flex-row '>
                    <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor, fontSize: 22 }]}>Total Amount:  </Text>
                    <Text style={[fontstyles.number, { fontSize: 14, color: themeColors.mainTextColor, marginTop: 4 }]}>₹ {item.Price}</Text>
                  </View>
                  <View className=' mb-3 flex-row flex-wrap'>
                    <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor, fontSize: 20 }]}>Massage:  </Text>
                    <Text style={[fontstyles.h6, { paddingTop: 10, fontSize: 20, color: themeColors.mainTextColor, lineHeight: 18 }]}>{item.Massage.length == 0 ? 'No massage' : item.Massage}</Text>
                  </View>
                </View>
              );
            }}
          />
        )}

        <Text numberOfLines={1} ellipsizeMode='clip' className=' mt-10' style={{ color: themeColors.textColor }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>

        <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor, textAlign: 'center', marginTop: 10, marginBottom: 10 }]}>
          Full History
        </Text>

        {loadingFull && (
          <View style={{ backgroundColor: themeColors.backGroundColor, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={themeColors.primary} />
          </View>
        )}

        {messFullHistory.message && (
          <Text
            className='flex items-center justify-center text-center mt-3'
            style={[fontstyles.h5_bold, { color: themeColors.diffrentColorOrange }]}>
            No record found for full history.
          </Text>
        )}

        {messFullHistory.length > 0 && !loadingFull && (
          <FlatList
            data={messFullHistory}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              const formattedItemDate = new Date(item.Date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              }).replace(/,/g, ''); // Remove commas for consistent format

              if(formattedItemDate == formattedDate){
                return null
              }
              
              return (
                <View className={`drop-shadow-2xl rounded-xl overflow-hidden p-3 mx-2 mb-2 ${index == 0 && 'mt-2'}`} style={[styles.grayscale, { backgroundColor: themeColors.shadowcolor, elevation: 10, }]}>

                  <View className='flex-row justify-between'>
                    <View>
                      <View className='flex-row items-center'>
                        <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor }]}>{item.Mess}</Text>
                      </View>
                      <Text style={[fontstyles.h4, { color: themeColors.textColor }]}>{formattedItemDate}</Text>
                    </View>
                    <View className='items-end'>

                      <Text style={[fontstyles.number, { fontSize: 16, color: themeColors.diffrentColorOrange }]}>{item.Slot}</Text>
                      <View className='  mt-[1px] flex-row '>
                        <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor, fontSize: 22 }]}>Total:  </Text>
                        <Text style={[fontstyles.number, { fontSize: 14, color: themeColors.mainTextColor, marginTop: 4 }]}>₹ {item.Price}</Text>
                      </View>
                    </View>
                  </View>

                  <View className='flex-row justify-between'>
                    <View className=' flex-row items-center justify-center'>
                      <Text style={[fontstyles.h3, { color: themeColors.diffrentColorPerple }]}>
                        {item.Parcel ? 'Parcel:' : 'Dine in:'}
                      </Text>
                      <Text className=' ml-2' style={[fontstyles.h1, { color: themeColors.textColor, fontSize: 22, }]} >
                        {item.Item}
                      </Text>
                    </View>
                    <Text style={[fontstyles.number, { fontSize: 15, color: themeColors.mainTextColor }]} className='text-white'>

                    </Text>
                  </View>

                  <View className=' mt-3 flex-row '>
                    <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor, fontSize: 22 }]}>Total Amount:  </Text>
                    <Text style={[fontstyles.number, { fontSize: 14, color: themeColors.mainTextColor, marginTop: 4 }]}>₹ {item.Price}</Text>
                  </View>
                  <View className=' mb-3 flex-row flex-wrap'>
                    <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor, fontSize: 20 }]}>Massage:  </Text>
                    <Text style={[fontstyles.h6, { paddingTop: 10, fontSize: 20, color: themeColors.mainTextColor, lineHeight: 18 }]}>{item.Massage.length == 0 ? 'No massage' : item.Massage}</Text>
                  </View>
                </View>
              );
            }}
          />
        )}
      </ScrollView>

      {swiped && <BounceText />}
    </View>
  );
}


const styles = StyleSheet.create({
  orderContainer: {
    marginVertical: 7,
    padding: 15,
    borderRadius: 8,
    // borderWidth: 1,
  },
  grayscale: {
    filter: 'grayscale(100%)',  // For web CSS approach
    // On React Native, you might need an image filter library or use a more creative workaround.
  },
})

