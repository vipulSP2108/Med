const BANNER_H = Dimensions.get('window').height * 0.55;
const Gradient_H = Dimensions.get('window').height * 0.5;

import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList, Animated, Dimensions, ImageBackground, Image, BackHandler, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../Components/Colors'; // Adjust path as needed
import { API_BASE_URL, USERSDATA_ENDPOINT, ADDOUTLET_ENDPOINT, USEROUTLETS_ENDPOINT, ADDMENU_ENDPOINT } from '../Constants/Constants';
// import { ADDOUTLET_ENDPOINT, USEROUTLETS_ENDPOINT, API_BASE_URL // Adjust paths/constants
import { ListCard_Self2, ListCard_Z } from '../Components/ListCards';
import SearchBox from "../Components/SearchBox";
import ModelScreen from './ModelScreen';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Titles from '../Components/Titles';
import FoodIcon from '../Components/FoodIcon';
import FoodTypeIcon from '../Components/FoodTypeIcon';
import LongStarIcon from '../Components/LongStarIcon';
import { dropDown } from '../Components/dropDown';
import { useFocusEffect } from '@react-navigation/native';
import Details_Seller from '../Components/Details_Seller';
import TruncatedTextComponent from '../Components/TruncatedTextComponent';
import ToastNotification from '../Components/ToastNotification';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import Size from '../Components/Size';
import TextStyles from '../Style/TextStyles';
import { StatusBar } from 'react-native';
import UpModelScreen from './UpModelScreen';
import MenuSellerFlatlist from '../Components/MenuSellerFlatlist';
import useCustomAlert from '../Components/Alerthook';
import { ThemeContext } from '../Context/ThemeContext';

export default function HomeSeller({ navigation }) {
  const { themeColors, toggleTheme } = useContext(ThemeContext);
  const [type, settype] = useState('');
  const { show, hide, RenderModel } = ModelScreen();
  const { fontsLoaded, fontFamilies } = useContext(GlobalStateContext);
  const { showAlert, AlertWrapper } = useCustomAlert();

  if (!fontFamilies) {
    return null;
  }
  // fontFamily: fontFamilies.bold,
  const { show_UpModelScreen, hide_UpModelScreen, RenderModel_UpModelScreen } = UpModelScreen();

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handle_hardwareBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handle_hardwareBackPress);
      };
    }, [])
  );

  const handle_hardwareBackPress = () => {
    showAlert({
      title: "Are You Sure?",
      message: "You're about to exit the app. Are you sure you want to leave all this deliciousness behind?",
      codeMassage: { code: '200', text: '🚪Leaving already? Don’t forget to save!' },
      buttons: [
        { icon: 'enter', text: "No, Stay", onPress: () => navigation.navigate('Home'), styleColor: themeColors.diffrentColorRed },
        { icon: 'exit', text: "Yes, Exit", onPress: () => BackHandler.exitApp(), styleColor: themeColors.diffrentColorGreen }
      ],
      additional: [
        { head: "No, Stay", head2: "navigate:null" },
        { head: "Yes, Exit", head2: "navigate:exitApp" }
      ]
    });
    return true;
  }
  const scrollA = useRef(new Animated.Value(0)).current;


  const [showToast, setShowToast] = useState(false);

  const fontstyles = TextStyles();


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#yourPreferredColor' }}
    >
      <View className={`bodyContainer w-full flex`} style={{ backgroundColor: themeColors.subbackGroundColor }}>
        <StatusBar
          barStyle={themeColors.backGroundColor == "#1C1C1E" ? 'light-content' : 'dark-content'}
          backgroundColor={themeColors.statusBarColor}
        />

        <LinearGradient
          // Button Linear Gradient
          // colors={[themeColors.subbackGroundColor, themeColors.backGroundColor, themeColors.secComponentColor]}
          colors={[themeColors.subbackGroundColor, themeColors.subbackGroundColor, themeColors.backGroundColor, themeColors.secComponentColor, themeColors.secComponentColor]}
          className='bodyBGContainer absolute w-full rounded-b-lg' style={{ height: Gradient_H, backgroundColor: themeColors.componentColor }} />
        {/* <LinearGradient
            // Button Linear Gradient
            colors={["black", "black", themeColors.backGroundColor, themeColors.componentColor, themeColors.secComponentColor]} className='bodyBGContainer absolute w-full rounded-b-lg' style={{ height: Dimensions.get('window').height * 0.5, backgroundColor: themeColors.componentColor }}
          /> */}
        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollA } } }],
            { useNativeDriver: true },
          )}
          scrollEventThrottle={16}
          keyboardDismissMode='on-drag'
        >
          <View className='staticContainer flex w-1/2 ' >
            <Animated.View style={[styles.banner(scrollA)]}>
              {/* ---------------------- Added ---------------------- */}


              {/* ---------------------- Added ---------------------- */}
            </Animated.View>
          </View>

          <View className=' h-[600px]' style={[styles.verticalScrollContainer, { backgroundColor: themeColors.backGroundColor }]}>

            <View className='mx-4 pt-6 overflow-hidden' style={{ height: Dimensions.get('window').height * 0.08 }}>
              <Titles title={"Your Offerings"} width={80} />
            </View>

          </View>

        </Animated.ScrollView>
        {AlertWrapper()}
        {RenderModel({ type: { type } })}
        {RenderModel_UpModelScreen()}
        {showToast && (
          <ToastNotification
            title="Success!"
            description="Status updated successfully."
            showToast={showToast}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  foodItemCollectionContainer: {
    marginHorizontal: Dimensions.get('window').width * 0.07,
    // marginTop: Dimensions.get('window').height * 0.02,
    gap: Dimensions.get('window').width * 0.04,
    // backgroundColor: 'white',
    borderRadius: 18,
  },
  verticalScrollContainer: {
    // marginTop: Dimensions.get('window').height * 0.1,
    // minHeight: Dimensions.get('window').height * 3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    // backgroundColor: 'white',
  },

  banner: scrollA => ({
    height: BANNER_H,
    backGroundColor: 'red',
    width: '200%',
    transform: [
      {
        translateY: scrollA.interpolate({
          inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H],
          outputRange: [-0, 0, BANNER_H * 0.95, -BANNER_H * 0.5], // BANNER_H * 0.99 => BANNER_H * 0.85
        }),
      },
      // {
      //   scale: scrollA.interpolate({
      //     inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H + 1],
      //     outputRange: [2, 1, 0.5, 0.5],
      //   }),
      // },
    ],
  }),
});