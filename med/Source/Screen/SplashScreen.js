import { View, Text, ScrollView, Image, Dimensions, StatusBar } from 'react-native';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { StyleSheet } from 'react-native';
import Colors from '../Components/Colors';
import { loadingScreenTxt } from '../Data/loadingScreenTxt';
import TextStyles from '../Style/TextStyles';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { ThemeContext } from '../Context/ThemeContext';
import { API_BASE_URL, USERSDATA_ENDPOINT } from '../Constants/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useCustomAlert from '../Components/Alerthook';

export default function SplashScreen() {
  const { showAlert, AlertWrapper } = useCustomAlert();
  const circleTop = useSharedValue(0);
  const circleBottom = useSharedValue(0);
  const { themeColors, toggleTheme } = useContext(ThemeContext);
  const { fontFamilies, setUserData } = useContext(GlobalStateContext);

  const getData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log(token)
      // http://192.168.1.3:5001/userdata
      const response = await fetch(`${API_BASE_URL}:${USERSDATA_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = await response.json();
      console.log("in Splash", data.data)
      if (data.data == 'token expired') {
        showAlert({
          title: "Session Expired",
          message: "Your session has expired. Please log in again to continue.",
          codeMassage: { code: '401', text: '⏳Time’s up! Please log back in.' },
          buttons: [
            { icon: 'open', text: "Login Back", onPress: () => navigation.navigate('LoginNavigationStack'), styleColor: themeColors.diffrentColorGreen }
          ],
          additional: [
            { head: "Login Back", head2: "navigate:LoginNavigationStack" }
          ]
        });
      }
      setUserData(data.data)
    } catch (error) {
      showAlert({
        title: "Oops! Something Went Wrong",
        message: "There was an issue fetching the data. Please try again.",
        codeMassage: { code: '500', text: '⚡ Error fetching data. Hang tight!' },
        buttons: [
          {
            icon: 'refresh-circle',
            text: "Refresh app",
            onPress: () => {
              DevSettings.reload()
              console.log("Refreshing app...");
            },
            styleColor: themeColors.diffrentColorGreen
          }
        ],
        additional: [
          { head: "Refresh app", head2: "Refresh app" }
        ]
      });
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Reset animation values
      circleTop.value = 0;
      circleBottom.value = 0;

      // Trigger animations
      setTimeout(() => circleTop.value = withSpring(circleTop.value + 47), 100);
      setTimeout(() => circleBottom.value = withSpring(circleBottom.value + 47), 300);

    }, [])
  );


  if (!fontFamilies) {
    return null;
  }

  const [loadingMessage, setLoadingMessage] = useState('');

  useEffect(() => {
    const updateMessage = () => {
      const randomIndex = Math.floor(Math.random() * loadingScreenTxt.length);
      setLoadingMessage(loadingScreenTxt[randomIndex]);
    };
    updateMessage();
    const intervalId = setInterval(updateMessage, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const fontstyles = TextStyles();
  return (
    <View style={{ backgroundColor: themeColors.subbackGroundColor }} className='p-2 h-full w-full items-center justify-center'>
      <StatusBar hidden />
      <Animated.View style={{ padding: circleTop, backgroundColor: themeColors.componentColor }} className='items-center justify-center rounded-full'>
        <Animated.View style={{ padding: circleBottom, backgroundColor: themeColors.secComponentColor }} className='items-center justify-center rounded-full'>
          <Image
            source={require("./../../assets/store.jpg")}
            className='w-28 h-28 rounded-full'
            alt="Logo"
          />
        </Animated.View>
      </Animated.View>
      <Text className='text-center pt-3' style={[fontstyles.h1, { color: themeColors.mainTextColor }]}>Namaskar !!!</Text>
      <Text className='text-center' style={[fontstyles.h4, { color: themeColors.textColor }]}>{loadingMessage}</Text>

      {AlertWrapper()}
    </View>
  );
}