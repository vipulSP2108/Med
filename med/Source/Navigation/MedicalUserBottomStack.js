// Commented code is for designing of bottom Navigatior like insIIT

import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, Dimensions, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../Components/Colors';

import Likes from '../Screen/Like';
import OrderHistory from '../Screen/OrderHistory';
import HomeSeller from '../Screen/HomeSeller';
import { useContext } from 'react';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import OrderHistorySeller from '../Screen/OrderHistorySeller';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import ToastNotification from '../Components/ToastNotification';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Error from '../Components/Error';
import { ThemeContext } from '../Context/ThemeContext';
import TextStyles from '../Style/TextStyles';
import { StatusBar } from 'react-native';
import MedicalOrders from '../ScreensMedicalServices/MedicalOrders';
import MedicalHomeScreen from '../ScreensMedicalServices/MedicalHomeScreen';

const Tab = createBottomTabNavigator();
export default function MedicalUserBottomStack() {
    const navigation = useNavigation();
    // const { userData } = useContext(GlobalStateContext);
    const { userRole } = useContext(GlobalStateContext);
    const [showToast, setShowToast] = useState(false);
    const { themeColors, toggleTheme } = useContext(ThemeContext);
    const fontstyles = TextStyles();
    const [lastOffset, setLastOffset] = useState(0); // Store last scroll position
    const [isTabBarVisible, setIsTabBarVisible] = useState(true); // Track if tab bar should be visible
    const [isRoleDefined, setIsRoleDefined] = useState(false);
    // const [userRole, setUserRole] = useState(null);

    // useEffect(() => {
    //   if (userData.role) {
    //     setUserRole(userData.role);
    //     setIsRoleDefined(true);
    //   }
    // }, [userData]);

    useEffect(() => {
        if (userRole) {
            // setUserRole(userData.role);
            setIsRoleDefined(true);
        }
    }, [userRole]);

    if (!isRoleDefined) {
        return <ActivityIndicator />;
        // return <Error />;
    }

    const handleScroll = (event) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        console.log(currentOffset)
        // If scrolling down, hide the tab bar
        if (currentOffset > lastOffset && currentOffset > 50) {  // Scrolling down
            setIsTabBarVisible(false);
        } else if (currentOffset < lastOffset) {  // Scrolling up
            setIsTabBarVisible(true);
        }
        setLastOffset(currentOffset);
    };

    return (
        <>
            <StatusBar
                barStyle={themeColors.backGroundColor == "#1C1C1E" ? 'light-content' : 'dark-content'}
                backgroundColor={themeColors.statusBarColor}
            />
            {showToast &&
                <View className=' absolute w-full h-full z-40'>
                    <TouchableOpacity className=' w-full h-full z-30' onPress={() => { setShowToast(false) }}
                    // style={{backgroundColor: 'rgba(355, 355, 355, 0.07)'}} 
                    />
                    <View className='absolute pl-3 z-40 rounded-2xl mt-3 mr-4 flex-1 top-0 right-0 w-[43%] overflow-hidden' style={{ backgroundColor: themeColors.secComponentColor }}>
                        <View style={{ backgroundColor: themeColors.shadowcolor }}>
                            <TouchableOpacity onPress={() => { setShowToast(false); navigation.navigate('Profile'); }} numberOfLines={1} ellipsizeMode='tail' className=' flex flex-row gap-2 font-black text-base py-3' style={{ color: themeColors.mainTextColor }}>
                                <Ionicons name='person' color={themeColors.mainTextColor} size={21} />
                                <Text numberOfLines={1} ellipsizeMode='tail' className='font-black text-base' style={{ color: themeColors.mainTextColor }}>Profile</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity onPress={() => { setShowToast(false); navigation.navigate('Insights'); }} numberOfLines={1} ellipsizeMode='tail' className='font-black text-base py-3' style={{ color: themeColors.mainTextColor }}>
                <Text numberOfLines={1} ellipsizeMode='tail' className='font-black text-base' style={{ color: themeColors.mainTextColor }}>InSights</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setShowToast(false); navigation.navigate('YettoUpdate'); }} numberOfLines={1} ellipsizeMode='tail' className='font-black text-base py-3' style={{ color: themeColors.mainTextColor }}>
                <Text numberOfLines={1} ellipsizeMode='tail' className='font-black text-base' style={{ color: themeColors.mainTextColor }}>Wallet</Text>
              </TouchableOpacity> */}
                            <TouchableOpacity onPress={() => { setShowToast(false); userRole == 'Seller' ? navigation.navigate('HistorySeller') : navigation.navigate('History') }} numberOfLines={1} ellipsizeMode='tail' className='flex flex-row gap-2 font-black text-base py-3' style={{ color: themeColors.mainTextColor }}>
                                <Ionicons name='time' color={themeColors.mainTextColor} size={21} />
                                <Text numberOfLines={1} ellipsizeMode='tail' className='font-black text-base' style={{ color: themeColors.mainTextColor }}>History</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setShowToast(false); }} numberOfLines={1} ellipsizeMode='tail' className='flex flex-row gap-2 font-black text-base py-3' style={{ color: themeColors.mainTextColor }}>
                                <Ionicons name='close-circle' color={themeColors.mainTextColor} size={21} />
                                <Text numberOfLines={1} ellipsizeMode='tail' className='font-black text-base' style={{ color: themeColors.mainTextColor }}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        // height: Dimensions.get('window').height * 0.08,
                        backgroundColor: themeColors.bottomNav,
                    },
                    tabBarIcon: ({ focused }) => {
                        let iconName;
                        // let backgroundColor = focused ? "#4A4356" : "transparent";
                        let IconColor = focused ? themeColors.diffrentColorOrange : themeColors.textColor;

                        if (route.name === 'MedicalHomeScreen') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'MedicalOrders') {
                            iconName = focused ? 'bag-handle-sharp' : 'bag-handle-outline';
                        }

                        // style={[styles.container, { backgroundColor }]}
                        return (
                            <View >
                                {isTabBarVisible && (
                                    <View style={{ overflow: 'hidden' }}>
                                        <View style={{ position: 'absolute', top: 0, marginTop: -6, backgroundColor: 'white', height: 6, width: 6 }} />
                                        <Ionicons name={iconName} size={24} style={{ color: IconColor }} />
                                    </View>
                                )}
                            </View>
                        );
                    },
                })}
            >

                <Tab.Screen name="MedicalHomeScreen" component={MedicalHomeScreen} />
                <Tab.Screen
                    options={{

                        headerRight: () => (
                            <TouchableOpacity onPress={() => setShowToast(!showToast)} className='px-4'>
                                <Ionicons name="ellipsis-vertical-outline" size={24} color={themeColors.mainTextColor} />
                            </TouchableOpacity>
                        ),

                        headerShown: true,
                        headerTitle: 'Appointment History',
                        headerTitleAlign: 'center',
                        headerStyle: {
                            backgroundColor: themeColors.bottomNav, //'black'
                        },
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 20,
                            color: themeColors.mainTextColor,
                            textAlign: 'center', // Center the title
                        },
                        headerTintColor: themeColors.mainTextColor, //themeColors.diffrentColorOrange,
                    }}
                    name="MedicalOrders"
                    component={MedicalOrders}
                />
            </Tab.Navigator>
        </>
    );
}