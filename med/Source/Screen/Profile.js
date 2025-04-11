import {
  Alert,
  BackHandler,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
// import { colors } from "../utils/colors";
// import { fonts } from "../utils/fonts";

import { useNavigation, useRoute } from "@react-navigation/native";
import Colors from "../Components/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import FoodIcon from "../Components/FoodIcon";
import { ProfileScreenNav } from "../Data/ProfileScreenNav";

import { createShimmerPlaceHolder } from 'expo-shimmer-placeholder'
import { LinearGradient } from 'expo-linear-gradient'
import { GlobalStateContext } from "../Context/GlobalStateContext";
import Size from "../Components/Size";
import TextStyles from "../Style/TextStyles";
import { SafeAreaView } from "react-native";
import useCustomAlert from "../Components/Alerthook";
import { ThemeContext } from "../Context/ThemeContext";
const ShimmerPlaceholder = createShimmerPlaceHolder(LinearGradient)

const LoginScreen = () => {
  // const route = useRoute();
  // const { userData } = route.params;
  const { setUserData, setUserRole, setDarkMode, darkMode, fontFamilies, userData, vegMode, setVegMode } = useContext(GlobalStateContext);
  const { showAlert, AlertWrapper } = useCustomAlert();
  const { themeColors, toggleTheme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [secureEntry, setSecureEntry] = useState(true);

  const toggleVegMode = async () => {
    try {
      if (!vegMode) {
        showAlert({
          title: "Switch to Veg Mode?",
          message: "You are about to filter the shops to show only those with pure vegetarian options and kitchens. Are you sure?",
          codeMassage: { code: '200', text: '🌿 Ready for a veg-only adventure?' },
          buttons: [
            {
              icon: "fish",
              text: "Cancel",
              onPress: () => null, // No action, just close the alert
              styleColor: themeColors.diffrentColorRed
            },
            {
              icon: "leaf",
              text: "Let's Go!",
              onPress: async () => {
                try {
                  // Switch to Veg Mode and save it to AsyncStorage
                  setVegMode(prevState => {
                    const newVegMode = !prevState;
                    AsyncStorage.setItem('vegMode', JSON.stringify(newVegMode));
                    return newVegMode;
                  });
                } catch (error) {
                  // Handle any potential errors
                  console.error('Error saving veg mode:', error);
                  Alert.alert('Oops! Something went wrong.');
                }
              },
              styleColor: themeColors.diffrentColorGreen
            }
          ],
          additional: [
            { head: "Cancel", head2: "navigate:null" },
            { head: "Let's Go!", head2: "navigate:Veg" }
          ]
        });
      } else {
        setVegMode(prevState => {
          const newVegMode = !prevState;
          AsyncStorage.setItem('vegMode', JSON.stringify(newVegMode));
          return newVegMode;
        });
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const toggleDarkMode = async () => {
    toggleTheme();
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    await AsyncStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  const handleNavigation = async (screen) => {
    try {
      if (screen == 'LoginNavigationStack') {
        // AsyncStorage.setItem('token', "");
        // AsyncStorage.setItem('isLoggedIn', "");
        await AsyncStorage.clear();
        setUserRole('')
        setUserData([])
      }
      navigation.navigate(screen)
      // BackHandler.exitApp();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  if (!fontFamilies) {
    return null;
  }

  // onPress={() => navigation.navigate('IndiviualCart',

  const [userDataVisible, setUserDataVisible] = useState(false);
  const [profileNavVisible, setProfileNavVisible] = useState(false);


  useEffect(() => {
    if (userData) {
      setTimeout(() => {
        setUserDataVisible(true);
      }, 100);
    }

    if (ProfileScreenNav && ProfileScreenNav.length > 0) {
      setTimeout(() => {
        setProfileNavVisible(true);
      }, 300);
    }
  }, [userData, ProfileScreenNav]);

  const shimmerColors = [themeColors.secComponentColor, themeColors.componentColor, themeColors.secComponentColor];

  const fontstyles = TextStyles();

  return (
    <>
      {/* mt-7 // marginextra */}
      <SafeAreaView className='px-3 w-full justify-between' style={{ backgroundColor: themeColors.backGroundColor }}>
        <StatusBar hidden={false} backgroundColor={themeColors.backGroundColor} />

        {userDataVisible && <View className='px-3 first-letter:flex-row items-center pb-4'>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={24} color={themeColors.mainTextColor} />
          </TouchableOpacity>
          {/* <Text className='text-2xl font-black' style={{ color: themeColors.mainTextColor }}>{TruncatedTextComponent(storeName, 21)}</Text> */}
        </View>}


        <ShimmerPlaceholder shimmerColors={shimmerColors} visible={userDataVisible} className=' mb-3 w-full rounded-2xl overflow-hidden ' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.25, }}>
          <View className=' h-3/5 flex-row items-center'>
            <View className=' w-16 h-16 mx-3 rounded-full items-center justify-center' style={{ backgroundColor: themeColors.diffrentColorPerpleBG }}>
              <Text style={[fontstyles.h1, { marginBottom: -5, color: themeColors.diffrentColorPerple }]}>
                {userData?.name ? userData?.name.substring(0, 1) : 'U'}
              </Text>
            </View>
            <View>
              <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.blackh2, { color: themeColors.mainTextColor }]}>{userData?.name ? userData?.name : "UserName"}</Text>
              <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h4, { color: themeColors.diffrentColorOrange }]}>{userData?.name ? userData?.contactinfo : "Contact details"}</Text>
              {/* <View className=' -mt-1 flex-row items-center'>
                <Text className='underline' style={[fontstyles.h5, { color: themeColors.diffrentColorOrange }]}>View activity</Text>
                <Ionicons name='caret-forward' size={16} color={themeColors.diffrentColorOrange} />
              </View> */}
            </View>
          </View>
          <TouchableOpacity onPress={() => Linking.openURL('https://vipulsp2108.github.io/OutsIIT-/')} className=' h-2/5 flex-row p-3 items-center justify-between bg-black'>
            <View className='flex-row items-center'>
              <View className=' p-2 rounded-full' style={{ backgroundColor: 'rgba(244,230,83,0.3)' }}>
                <LinearGradient className=' p-1 rounded-full' colors={['#D79C08', '#F4E653', '#D79C08']}>
                  <Ionicons name='ribbon' size={24} color={'black'} />
                </LinearGradient>
              </View>

              {/* <LinearGradient className=' p-1 rounded-full' colors={['#D79C08', '#F4E653', '#D79C08']}> */}
              <Text className='text-[#D79C08]' style={[fontstyles.blackh2, {}]}>  Know Us</Text>
              {/* </LinearGradient> */}
            </View>
            <Ionicons name='chevron-forward' size={24} color={'#D79C08'} />
          </TouchableOpacity>
        </ShimmerPlaceholder>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} className='px-3 h-full w-full' style={{ backgroundColor: themeColors.backGroundColor }}>

        <View className=' px-2 flex-row justify-center'>
          {!userDataVisible ? <>
            <ShimmerPlaceholder onPress={() => navigation.navigate('Likes')} shimmerColors={shimmerColors} visible={userDataVisible} className='w-1/2 rounded-2xl overflow-hidden mr-3 justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.15, }}>
              <View className=' p-2 absolute left-6 top-4 rounded-full' style={{ backgroundColor: themeColors.secComponentColor }}>
                <Ionicons name='heart-outline' size={24} color={themeColors.mainTextColor} />
              </View>
              <Text numberOfLines={1} ellipsizeMode='tail' className='absolute left-6 bottom-4' style={[fontstyles.h3, { color: themeColors.mainTextColor }]}>Favourites</Text>
            </ShimmerPlaceholder>

            <ShimmerPlaceholder onPress={() => navigation.navigate('Orders')} shimmerColors={shimmerColors} visible={userDataVisible} className='w-1/2 rounded-2xl overflow-hidden justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.15, }}>
              <View className=' p-2 absolute left-6 top-4 rounded-full' style={{ backgroundColor: themeColors.secComponentColor }}>
                <Ionicons name='bag-handle-outline' size={24} color={themeColors.mainTextColor} />
              </View>
              <Text className='absolute left-6 bottom-4' style={[fontstyles.h3, { color: themeColors.mainTextColor }]}>Orders</Text>
            </ShimmerPlaceholder>
          </> : <>
            <TouchableOpacity onPress={() => navigation.navigate('Likes')} shimmerColors={shimmerColors} visible={userDataVisible} className='w-1/2 rounded-2xl overflow-hidden mr-3 justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.15, }}>
              <View className=' p-2 absolute left-6 top-4 rounded-full' style={{ backgroundColor: themeColors.secComponentColor }}>
                <Ionicons name='heart-outline' size={24} color={themeColors.mainTextColor} />
              </View>
              <Text numberOfLines={1} ellipsizeMode='tail' className='absolute left-6 bottom-4' style={[fontstyles.h3, { color: themeColors.mainTextColor }]}>Favourites</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Orders')} shimmerColors={shimmerColors} visible={userDataVisible} className='w-1/2 rounded-2xl overflow-hidden justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.15, }}>
              <View className=' p-2 absolute left-6 top-4 rounded-full' style={{ backgroundColor: themeColors.secComponentColor }}>
                <Ionicons name='bag-handle-outline' size={24} color={themeColors.mainTextColor} />
              </View>
              <Text className='absolute left-6 bottom-4' style={[fontstyles.h3, { color: themeColors.mainTextColor }]}>Orders</Text>
            </TouchableOpacity>
          </>}
        </View>

        <ShimmerPlaceholder shimmerColors={shimmerColors} visible={profileNavVisible} className='rounded-xl mt-3 w-full' style={{ backgroundColor: themeColors.componentColor }}>
          <View className='p-3 items-center flex-row justify-between'>
            <View className='flex-row items-center'>
              <View>
                <FoodIcon style={{ backgroundColor: 'black', padding: 3 }} type={"PureVeg"} size={12} padding={2} />
              </View>
              <Text style={[fontstyles.h3, { color: themeColors.mainTextColor }]}> Veg Mode</Text>
            </View>
            <TouchableOpacity onPress={toggleVegMode}>
              <Ionicons name='toggle' size={38} style={{ transform: [{ rotate: vegMode ? '0deg' : '180deg' }] }} color={vegMode ? themeColors.diffrentColorGreen : themeColors.mainTextColor} />
            </TouchableOpacity>
          </View>
        </ShimmerPlaceholder>

        <ShimmerPlaceholder shimmerColors={shimmerColors} visible={profileNavVisible} className='rounded-xl my-3 w-full' style={{ backgroundColor: themeColors.componentColor }}>
          <View className='p-3 items-center flex-row justify-between'>
            <View className='flex-row items-center'>
              <Text style={[fontstyles.h3, { color: themeColors.mainTextColor }]}> Dark Mode</Text>
            </View>
            <TouchableOpacity onPress={toggleDarkMode}>
              <Ionicons
                name='toggle' size={38} style={{ transform: [{ rotate: darkMode ? '0deg' : '180deg' }] }} color={darkMode ? themeColors.diffrentColorGreen : themeColors.mainTextColor}
              />
            </TouchableOpacity>
          </View>
        </ShimmerPlaceholder>

        {ProfileScreenNav.map((section, sectionIndex) => {
          if (userData?.role == "Buyer" && section.title == "Personal") {
            return null
          }
          return (
            <View key={sectionIndex} className=' '>
              {!profileNavVisible && <ShimmerPlaceholder shimmerColors={shimmerColors} className='mt-3 h-14 rounded-xl w-full' />}
              <ShimmerPlaceholder className='mb-3 rounded-xl' shimmerColors={shimmerColors} visible={profileNavVisible}>

                <View className='rounded-xl p-3' style={{ backgroundColor: themeColors.componentColor }}>
                  <View className=' items-center flex-row mb-3'>
                    <View className=' absolute -left-11 rounded-lg h-full w-10' style={{ backgroundColor: themeColors.diffrentColorOrange }} />
                    <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h3, { color: themeColors.mainTextColor }]}> {section.title}</Text>
                  </View>

                  {section.data.map((item, itemIndex) => {
                    return (
                      <TouchableOpacity onPress={() => item.navScreen ? handleNavigation(item.navScreen) : Linking.openURL(item.navWeb)} key={itemIndex} className='my-2 flex-row items-center justify-between'>
                        <View className='flex-row items-center'>
                          <View className='p-1 rounded-full justify-center items-center' style={{ backgroundColor: themeColors.secComponentColor }}>
                            <Ionicons name={item.iconName} size={22} color={themeColors.mainTextColor} />
                          </View>
                          <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>  {item.subtitle}</Text>
                        </View>
                        <Ionicons name='chevron-forward-outline' size={23} color={themeColors.mainTextColor} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ShimmerPlaceholder>
            </View>
          );
        })}

        {AlertWrapper()}
      </ScrollView>
    </>
  );
};

export default LoginScreen;