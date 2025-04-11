const GOOGLE_SCRIPT_getMessByEmail = 'https://script.google.com/macros/s/AKfycbwJvhigXUpyiYP3xjGD9TQbAdRkt6WevZ2ob2XymcwfeR_ejWsGEVhgW8vSGQBD0AV7wA/exec'

import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { ThemeContext } from '../Context/ThemeContext';
import TextStyles from '../Style/TextStyles';
import Titles from '../Components/Titles';
import Colors from '../Components/Colors';
import Navbar from '../Components/Navbar';
import { useState } from 'react';
import useCustomAlert from '../Components/Alerthook';
import { fetchMessMenuData, fetchSpecialData } from './helper/fetchMessMenuData';

export default function MessHomeScreen() {
  const navigation = useNavigation();
  const { themeColors, toggleTheme } = useContext(ThemeContext);
  const fontstyles = TextStyles();
  const { showAlert, AlertWrapper } = useCustomAlert();

  const { messMealData, setMessMealData, specialMessData, setSpecialMessData, userData, userMess } = useContext(GlobalStateContext);
  // const [userMess, setUserMess] = useState('');

  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  const timeSlots = {
    breakfastWeekends: { start: 8 * 60, end: 10 * 60 }, // 08:00 AM to 10:00 AM
    breakfast: { start: 7 * 60 + 30, end: 9 * 60 + 30 }, // 07:30 AM to 09:30 AM
    lunch: { start: 12 * 60 + 15, end: 14 * 60 + 15 }, // 12:15 PM to 02:15 PM
    snacks: { start: 16 * 60 + 30, end: 18 * 60 }, // 04:30 PM to 06:00 PM
    dinner: { start: 19 * 60 + 30, end: 21 * 60 + 30 }, // 07:30 PM to 09:30 PM
  };

  useEffect(() => {
    fetchSpecialData(setSpecialMessData);
    fetchMessMenuData(setMessMealData); // Fetch data when component mounts
  }, []);


  const [isSpecialMenu, setIsSpecialMenu] = useState(false);
  const [isShowContent, setIsShowContent] = useState(false);

  useEffect(() => {
    if (!specialMessData || !specialMessData.MealType || !specialMessData.Date) return;

    const today = new Date();
    const specialDate = new Date(specialMessData?.Date);

    if ((specialMessData?.MealType?.toLowerCase() == currentMeal?.toLowerCase())
      &&
      (today.setHours(0, 0, 0, 0) == specialDate.setHours(0, 0, 0, 0))) {
      setIsSpecialMenu(true);
    }
    
    if(specialMessData.content.toLowerCase() == 'on'){
      setIsShowContent(true);
    }
  }, [specialMessData]);

  const currentDay = new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase();

  const getCurrentMeal = () => {
    if ((currentDay == 'sunday' || currentDay == 'saturday') && currentTimeInMinutes >= 0 && currentTimeInMinutes <= timeSlots.breakfastWeekends.end) {
      return 'BreakfastWeekends';
    } else if (currentTimeInMinutes >= 0 && currentTimeInMinutes <= timeSlots.breakfast.end) {
      return 'Breakfast';
    } else if (currentTimeInMinutes >= timeSlots.breakfast.end && currentTimeInMinutes <= timeSlots.lunch.end) {
      return 'Lunch';
    } else if (currentTimeInMinutes >= timeSlots.lunch.end && currentTimeInMinutes <= timeSlots.snacks.end) {
      return 'Snacks';
    } else if (currentTimeInMinutes >= timeSlots.snacks.end && currentTimeInMinutes <= timeSlots.dinner.end) {
      return 'Dinner';
    } else {
      return 'Next Day Breakfast'; // Show next day breakfast menu after dinner time
    }
  };

  const getCurrentMealTime = (currentMeal) => {
    if (currentMeal == 'BreakfastWeekends') {
      return '08:00 AM to 10:00 AM';
    } else if (currentMeal == 'Breakfast') {
      return '07:30 AM to 09:30 AM';
    } else if (currentMeal == 'Lunch') {
      return '12:15 PM to 02:15 PM';
    } else if (currentMeal == 'Snacks') {
      return '04:30 PM to 06:00 PM';
    } else if (currentMeal == 'Dinner') {
      return '07:30 PM to 09:30 PM';
    }
  }
  const currentMeal = getCurrentMeal();



  let menuForToday;
  switch (currentMeal) {
    case 'BreakfastWeekends':
      menuForToday = messMealData?.breakfast_data[currentDay.charAt(0).toUpperCase() + currentDay.slice(1)];
      break;
    case 'Breakfast':
      menuForToday = messMealData?.breakfast_data[currentDay.charAt(0).toUpperCase() + currentDay.slice(1)];
      break;
    case 'Lunch':
      menuForToday = messMealData?.lunch_data[currentDay.charAt(0).toUpperCase() + currentDay.slice(1)];
      break;
    case 'Snacks':
      menuForToday = messMealData?.snacks_data[currentDay.charAt(0).toUpperCase() + currentDay.slice(1)];
      break;
    case 'Dinner':
      menuForToday = messMealData?.dinner_data[currentDay.charAt(0).toUpperCase() + currentDay.slice(1)];
      break;
    case 'Next Day Breakfast':
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1); // Go to the next day
      const nextDayString = nextDay.toLocaleString('en-us', { weekday: 'long' });
      menuForToday = messMealData?.breakfast_data[nextDayString];
      break;
    default:
      menuForToday = null;
  }

  function convertDayToNumber(day) {
    const days = {
      "Monday": 0,
      "Tuesday": 1,
      "Wednesday": 2,
      "Thursday": 3,
      "Friday": 4,
      "Saturday": 5,
      "Sunday": 6
    };

    return days[day];
  }

  const today = new Date();
  const day = today.getDate();
  // console.log("Today's day as integer:", Math.ceil(1 / 7) % 2);

  let menuitem;
  if (Math.ceil(day / 7) % 2 == 1) {
    menuitem = 0;
  } else {
    menuitem = 1;
  }

  return (
    <View className=' h-full' style={{ backgroundColor: themeColors.backGroundColor }}>
      <Navbar />

      <View className=' py-7 justify-center'>
        <View className='px-4 mb-1 flex items-start justify-center'>
          {/* TextStyles.TextStyles.h1,  */}
          {/* {console.log(height)} */}
          <Text style={[fontstyles.entryUpper, { color: themeColors.mainTextColor }]}>Discover the </Text>
          <View className='flex-row'>
            <Text style={[fontstyles.h1, { color: themeColors.mainTextColor }]}>menu for</Text>
            <Text style={[fontstyles.h1, { color: themeColors.diffrentColorOrange }]}> {currentDay.charAt(0).toUpperCase() + currentDay.slice(1)}</Text>
          </View>
        </View>
      </View>

      <Titles title={"Whats in Mess"} width={60} />

      {/* {console.log(isSpecialMenu, specialMessData['backGroundImage'])} */}
      {/* <TouchableOpacity className='mb-2 drop-shadow-2xl' style={[{ backgroundColor: themeColors.shadowcolor, elevation: 5 }]}> */}
      <ImageBackground
        source={{
          uri: 
            isSpecialMenu ?
              specialMessData?.backGroundImage == '' ? 'https://example.com/default-image.jpg' : specialMessData?.backGroundImage
              :
              'https://example.com/default-image.jpg' //fallback
        }}
        style={{
          height: 250,
          // flex: 1, // Ensures the image covers the whole area
          borderRadius: 16, // Optional rounded corners for the image
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: themeColors.componentColor,
          elevation: 2
        }}
        imageStyle={{
          borderRadius: 16, // Rounded corners for the image itself
        }}
        resizeMode="cover" // Ensures the image covers the area without distorting
        className='rounded-2xl mt-3 mb-5 mx-3 p-3'
      >
        <TouchableOpacity
          // style={{ backgroundColor: themeColors.componentColor, elevation: 2 }}
          onPress={() => {
            menuForToday ? navigation.navigate("MenuSample", {
              defaultMealType: currentMeal == 'BreakfastWeekends' ? 'breakfast' : currentMeal.toLowerCase(),
              defaultDay: convertDayToNumber(currentDay.charAt(0).toUpperCase() + currentDay.slice(1))
            }) : fetchMessMenuData(setMessMealData);
          }}
          className=' items-center justify-center text-center'>

          {menuForToday ? (
            isSpecialMenu ?
              ( isShowContent ?
                <>
                  <Text style={[fontstyles.boldh2, { color: specialMessData.titleColor != '' ? specialMessData.titleColor : themeColors.mainTextColor }]}>{`${isSpecialMenu ? (specialMessData.Title == '' ? 'Special' : specialMessData.Title) : currentMeal}`}</Text>
                  <Text style={[fontstyles.numberbigger, { marginTop: -6, marginBottom: 0, color: specialMessData.titleColor != '' ? specialMessData.titleColor : themeColors.diffrentColorPerple }]}>{`${getCurrentMealTime(currentMeal)}`}</Text>
                  <View className='items-center justify-center'>
                    {Object.keys(specialMessData)
                      .filter(key => {
                        // Define which keys you want to remove
                        const keysToRemove = [
                          'titleColor',
                          'contentColor',
                          'content',
                          'Title',
                          'backGroundImage',
                          'Date',
                          'NonVegTimeings (24 hours format)',
                          'MealType'  // Add other keys you want to remove here
                        ];
                        return !keysToRemove.includes(key); // Filter out the keys to remove
                      })
                      .map((key) => (
                        <View key={key}>
                          <Text style={[fontstyles.h5_5, { color: specialMessData.contentColor != '' ? specialMessData.contentColor : themeColors.textColor }]}>
                            {/* {key}:  */}
                            {specialMessData[key]}
                          </Text>
                        </View>
                      ))
                    }
                  </View>
                </>
                :
                null
              )
              :
              (
                <>
                  <Text style={[fontstyles.boldh2, { color: themeColors.mainTextColor }]}>{`${isSpecialMenu ? "Special" : currentMeal}`}</Text>
                  <Text style={[fontstyles.numberbigger, { marginTop: -6, marginBottom: 10, color: themeColors.diffrentColorPerple }]}>{`${getCurrentMealTime(currentMeal)}`}</Text>
                  <View className=' items-center justify-center'>
                    {Object.keys(menuForToday).map((key) => (
                      <View>
                        {/* {console.log(menuForToday)} */}
                        <Text style={[fontstyles.h5_5, { color: themeColors.textColor }]} key={key}>
                          {menuForToday[key].includes('/') ? menuForToday[key]?.split('/')[menuitem] : menuForToday[key]}
                        </Text>
                      </View>
                    ))}
                  </View>
                </>)
          ) : (
            <Text style={[fontstyles.h5_5, { color: themeColors.textColor }]}>No menu available</Text>
          )}

        </TouchableOpacity>
      </ImageBackground>

      {(messMealData && userMess) && (
        <>
          <Titles title={"Book your Meal"} width={60} />

          <View className='flex-row py-4 justify-between mx-7'>
            {/* Full Meal Button */}
            <TouchableOpacity
              className='w-[44%] p-3 items-center justify-center rounded-lg'
              style={{ backgroundColor: themeColors.diffrentColorGreen }}
              onPress={() => navigation.navigate('YettoUpdate')}
            >
              <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor, fontSize: 20, marginBottom: -3 }]}>Full Meal</Text>
            </TouchableOpacity>

            {/* Non-Veg Button */}
            <TouchableOpacity
              className='w-[44%] p-3 items-center justify-center rounded-lg'
              style={{ backgroundColor: themeColors.diffrentColorRed }}
              onPress={() => {
                const formattedDay = currentDay.charAt(0).toUpperCase() + currentDay.slice(1);
                const { price_data, dinner_data } = messMealData || {};
                const dayData = price_data?.[formattedDay];
                const menuItem = dinner_data?.[formattedDay]?.['Non-veg'];

                // Check if menuItem is empty or blank
                if (!menuItem || menuItem.trim() === '') {
                  // alert('There is no non-veg today.');
                  showAlert({
                    title: "Non-Veg Unavailable",
                    message: "There is no Non-Veg option available today. Please check back tomorrow.",
                    codeMassage: { code: '404', text: '🚫 No Non-Veg today!' },
                  });
                  return; // Prevent navigation if menuItem is blank
                }

                navigation.navigate('MessBookingScreen', {
                  priceData: dayData,
                  menuItem: menuItem,
                  availableSlots: ['07:30 PM - 08:00 PM', '08:00 PM - 08:30 PM', '08:30 PM - 09:00 PM'], // '09:00 PM - 09:30 PM'
                  availableUntil: specialMessData['NonVegTimeings (24 hours format)'], // 24 hours
                  availableMess: ['Mohani', 'Jaiswal', 'Rgouras'],
                  userMess: userMess
                });
              }}
            >
              <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor, fontSize: 20, marginBottom: -3 }]}>Non Veg</Text>
            </TouchableOpacity>
          </View>
        </>
      )
        // : (
        //   <Text>Loading...</Text> // Fallback loading state
        // )
      }

      {AlertWrapper()}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
})