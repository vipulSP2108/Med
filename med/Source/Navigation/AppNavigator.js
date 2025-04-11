import React, { Profiler, useContext, useEffect, useState } from 'react'
import { DarkTheme, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Details from '../Screen/Details';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SelectAddress from '../Screen/SelectAddress';
import Profile from '../Screen/Profile';
import Colors from '../Components/Colors';
import IndiviualCart from '../Screen/IndiviualCart';
import SignupScreen from '../Screen/SignupScreen';
import LoginScreen from '../Screen/LoginScreen';
import RoleSelection from '../Screen/RoleSelection';
import StaterScreen from '../Screen/StaterScreen';
import ModalScreen from '../Screen/ModelScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrderHistory from '../Screen/OrderHistory';
import YettoUpdate from '../Screen/YettoUpdate';
import DetailView from '../Screen/ItemDetails';
import OutletHomeScreen from '../Screen/OutletHomeScreen';
import BuyerBottomNavigator from './BuyerBottomNavigator';
import Insights from '../Screen/Insights';
import EditRestorent from '../Screen/EditRestorent';
import EditMain from '../Screen/EditMain';
import SplashScreen from '../Screen/SplashScreen';
import OtpScreen from '../Screen/OtpScreen';
import Complaint from '../Screen/Complaint';
import History from '../Screen/History';
import OrderHistorySeller from '../Screen/OrderHistorySeller';
import HistorySeller from '../Screen/HistorySeller';
import ForgotScreen from '../Screen/ForgotScreen';
import ForgotScreen_EnterPassword from '../Screen/ForgotScreenOtp';
import useCustomAlert from '../Components/Alerthook';
import ComplaintsList from '../Screen/ComplaintsList';
import ComplaintOfOutlet from '../Screen/ComplaintOfOutlet';
import { ThemeContext } from '../Context/ThemeContext';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import HeaderRightIcons from '../Components/HeaderRightIcons';
import CustomBackButton from '../Components/CustomBackButton';
import MessHomeScreen from '../ScreensMessServices/MessHomeScreen';
import OutletUserBottomStack from './OutletUserBottomStack';
import MessUserBottomStack from './MessUserBottomStack';
import MedicalUserBottomStack from './MedicalUserBottomStack';
import MessMenu from '../ScreensMessServices/MessMenu';
import TextStyles from '../Style/TextStyles';
import MenuSample from '../ScreensMessServices/MenuSample';
import MedicalHomeScreen from '../ScreensMedicalServices/MedicalHomeScreen';
import DoctorsScreen from '../ScreensMedicalServices/DoctorsScreen';
import DoctorDetailsScreen from '../ScreensMedicalServices/DoctorDetailsScreen';
import MessBookingScreen from '../ScreensMessServices/MessBookingScreen';
import BusHomeScreen from '../ScreensBusServices/BusHomeScreen';
import SplitfareBotttomStack from './SplitfareBotttomStack';
import CreateRide from '../ScreensSplitfareServices/CeateRide';
import SplitfareOrders from '../ScreensSplitfareServices/SplitfareOrders';
import SplitfareRides from '../ScreensSplitfareServices/SplitfareRides';
import SplitfareRideDetails from '../ScreensSplitfareServices/SplitfareRideDetails';
import LaundryHomeScreen from '../ScreenLaundryServices/LaundryHomeScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
    // const navigation = useNavigation();
    const [isLoggedInValue, setisLoggedInValue] = useState(false)
    // const { setUserData, fontFamilies, userData } = useContext(GlobalStateContext);

    const handle_isLoggedIn = async () => {
        const isLoggedInData = await AsyncStorage.getItem('isLoggedIn');
        setisLoggedInValue(isLoggedInData);
        console.log(isLoggedInValue, isLoggedInData, "App")
    }

    useEffect(() => {
        handle_isLoggedIn();
    }, [isLoggedInValue]);

    const [showToast, setShowToast] = useState(false);

    const LoginNavigationStack = () => {
        const { themeColors, toggleTheme } = useContext(ThemeContext);
        return (
            <Stack.Navigator screenOptions={{
                cardStyle: { backgroundColor: '#1C1C1E' },
                headerShown: false
            }}  >
                {/* <Stack.Screen
                name="StaterScreen"
                component={StaterScreen}
            /> */}
                <Stack.Screen
                    name="RoleSelection"
                    component={RoleSelection}
                />
                <Stack.Screen
                    name="SignupScreen"
                    component={SignupScreen}
                />
                <Stack.Screen
                    name="OtpScreen"
                    component={OtpScreen}
                />
                <Stack.Screen
                    name="ForgotScreen"
                    component={ForgotScreen}
                />
                <Stack.Screen
                    name="ForgotScreen_EnterPassword"
                    component={ForgotScreen_EnterPassword}
                />
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                />

                <Stack.Screen
                    name="BuyerNavigationStack"
                    options={{ headerShown: false }}
                    component={BuyerNavigationStack}
                />
            </Stack.Navigator>
        )
    }

    const SplitfareNavigationStack = () => {
        const { themeColors, toggleTheme } = useContext(ThemeContext);
        const fontstyles = TextStyles();
        return (
            <Stack.Navigator screenOptions={{
                cardStyle: { backgroundColor: '#1C1C1E' },
                headerShown: false
            }}>
                <Stack.Screen
                    // SplitfareHomeScreen
                    name="SplitfareMainScreen"
                    options={{ headerShown: false }}
                    component={SplitfareBotttomStack}
                />
                <Stack.Screen
                    name="SplitfareRides"
                    options={{ headerShown: false }}
                    component={SplitfareRides}
                />
                <Stack.Screen
                    name="SplitfarCreateRide"
                    options={{ headerShown: false }}
                    component={CreateRide}
                />
                {/* <Stack.Screen
                    name="SplitfareOrders"
                    options={{ headerShown: false }}
                    component={SplitfareOrders}
                /> */}
                <Stack.Screen
                    name="SplitfareRideDetails"
                    options={{ headerShown: false }}
                    component={SplitfareRideDetails}
                />
                <Stack.Screen
                    name="BuyerNavigationStack"
                    options={{ headerShown: false }}
                    component={BuyerNavigationStack}
                />
            </Stack.Navigator>
        )
    }

    const MessUserNavigationStack = () => {
        const { themeColors, toggleTheme } = useContext(ThemeContext);
        const fontstyles = TextStyles();
        return (
            <Stack.Navigator screenOptions={{
                cardStyle: { backgroundColor: '#1C1C1E' },
                headerShown: false
            }}>
                <Stack.Screen
                    name="MessMainScreen"
                    options={{ headerShown: false }}
                    component={MessUserBottomStack}
                />
                <Stack.Screen
                    name="MenuSample"
                    options={{ headerShown: false }}
                    component={MenuSample}
                />
                <Stack.Screen
                    name="MessMenu"
                    options={{
                        headerStyle: {
                            backgroundColor: themeColors.backGroundColor,
                        },
                        headerShown: true,
                        title: '',
                        headerTintColor: themeColors.mainTextColor,
                        headerLeft: () =>
                            <View className=' flex-row'>
                                <View className=' mt-1'>
                                    <CustomBackButton />
                                </View>
                                <Text style={[fontstyles.h5_bold, { color: themeColors.mainTextColor, fontSize: 26 }]}>Mess Menu</Text>
                            </View>,
                        headerRight: () => <HeaderRightIcons />
                    }}
                    component={MessMenu}
                />
                <Stack.Screen
                    name="MessHomeScreen"
                    options={{ headerShown: false }}
                    component={MessHomeScreen}
                />
                <Stack.Screen
                    name="BuyerNavigationStack"
                    options={{ headerShown: false }}
                    component={BuyerNavigationStack}
                />
                <Stack.Screen
                    name="MessBookingScreen"
                    options={{
                        headerStyle: {
                            backgroundColor: themeColors.backGroundColor,
                        },
                        headerShown: true,
                        title: '',
                        headerLeft: () =>
                            <View className=' flex-row'>
                                <View className=' mt-1'>
                                    <CustomBackButton />
                                </View>
                                <Text style={[fontstyles.h5_bold, { color: themeColors.mainTextColor, fontSize: 26 }]}>Mess Booking</Text>
                            </View>,
                    }}
                    component={MessBookingScreen}
                />
            </Stack.Navigator>
        )
    }


    const MedicalUserNavigationStack = () => {
        const { themeColors, toggleTheme } = useContext(ThemeContext);
        const fontstyles = TextStyles();
        return (
            <Stack.Navigator screenOptions={{
                cardStyle: { backgroundColor: '#1C1C1E' },
                headerShown: false
            }}>
                <Stack.Screen
                    name="MedicalMainScreen"
                    options={{ headerShown: false }}
                    component={MedicalUserBottomStack}
                />
                <Stack.Screen
                    name="MessHomeScreen"
                    options={{ headerShown: false }}
                    component={MedicalHomeScreen}
                />
                <Stack.Screen
                    name="DoctorDetails"
                    options={{ headerShown: false }}
                    component={DoctorDetailsScreen}
                />
                <Stack.Screen
                    name="DoctorsScreen"
                    options={{ headerShown: false }}
                    // options={{
                    //     headerLeft: () => <TouchableOpacity onPress={() => navigation.goBack()} className='px-4'><Ionicons name="chevron-back-outline" size={24} color={themeColors.mainTextColor} /></TouchableOpacity>,
                    //     // headerRight: () => (
                    //     //   <TouchableOpacity onPress={() => setShowToast(!showToast)} className='px-4'>
                    //     //     <Ionicons name="ellipsis-vertical-outline" size={24} color={themeColors.mainTextColor} />
                    //     //   </TouchableOpacity>
                    //     // ),
                    //     // header: () => <Text style={[fontstyles.blackh2, { backgroundColor: themeColors.bottomNav, color: themeColors.mainTextColor }]} className=' p-2 text-center'>Your Favorites</Text>,
                    //     headerShown: true,
                    //     headerTitle: 'Doctors',
                    //     headerTitleAlign: 'center',
                    //     headerStyle: {
                    //       backgroundColor: themeColors.diffrentColorPerple, //'black'
                    //     },
                    //     headerTitleStyle: {
                    //       color: themeColors.mainTextColor,
                    //       fontWeight: '900',
                    //     },
                    //   }}
                    component={DoctorsScreen}
                />
                <Stack.Screen
                    name="BuyerNavigationStack"
                    options={{ headerShown: false }}
                    component={BuyerNavigationStack}
                />
            </Stack.Navigator>
        )
    }


    const BusUserNavigationStack = () => {
        const { themeColors, toggleTheme } = useContext(ThemeContext);
        const fontstyles = TextStyles();
        return (
            <Stack.Navigator screenOptions={{
                cardStyle: { backgroundColor: '#1C1C1E' },
                headerShown: false
            }}>
                <Stack.Screen
                    name="BusNavigationStack"
                    options={{ headerShown: false }}
                    component={BusHomeScreen}
                />
                <Stack.Screen
                    name="BuyerNavigationStack"
                    options={{ headerShown: false }}
                    component={BuyerNavigationStack}
                />
            </Stack.Navigator>
        )
    }

    const LaundryUserNavigationStack = () => {
        const { themeColors, toggleTheme } = useContext(ThemeContext);
        const fontstyles = TextStyles();
        return (
            <Stack.Navigator screenOptions={{
                cardStyle: { backgroundColor: '#1C1C1E' },
                headerShown: false
            }}>
                <Stack.Screen
                    name="LaundryHomeScreen"
                    options={{ headerShown: false }}
                    component={LaundryHomeScreen}
                />
                <Stack.Screen
                    name="BuyerNavigationStack"
                    options={{ headerShown: false }}
                    component={BuyerNavigationStack}
                />
            </Stack.Navigator>
        )
    }

    const OutletUserNavigationStack = () => {
        const { themeColors, toggleTheme } = useContext(ThemeContext);
        const fontstyles = TextStyles();
        return (
            <Stack.Navigator screenOptions={{
                cardStyle: { backgroundColor: '#1C1C1E' },
                headerShown: false
            }}>
                <Stack.Screen
                    name="OutletHomeScreen"
                    options={{ headerShown: false }}
                    component={OutletUserBottomStack}
                />
                <Stack.Screen
                    name="BuyerNavigationStack"
                    options={{ headerShown: false }}
                    component={BuyerNavigationStack}
                />
            </Stack.Navigator>
        )
    }


    const BuyerNavigationStack = () => {
        const { themeColors, toggleTheme } = useContext(ThemeContext);
        return (
            <Stack.Navigator screenOptions={{
                cardStyle: { backgroundColor: '#1C1C1E' },
                headerShown: false
            }}>
                <Stack.Screen
                    name="HomeScreen"
                    options={{ headerShown: false }}
                    component={BuyerBottomNavigator}
                />
                {/* <Stack.Screen
                    name="OutletHomeScreen"
                    options={{ headerShown: false }}
                    component={OutletHomeScreen}
                /> */}
                <Stack.Screen
                    name="OutletUserNavigationStack"
                    options={{ headerShown: false }}
                    component={OutletUserNavigationStack}
                />
                <Stack.Screen
                    name="MessUserNavigationStack"
                    options={{ headerShown: false }}
                    component={MessUserNavigationStack}
                />
                <Stack.Screen
                    name="SplitfareNavigationStack"
                    options={{ headerShown: false }}
                    component={SplitfareNavigationStack}
                />
                <Stack.Screen
                    name="MedicalUserNavigationStack"
                    options={{ headerShown: false }}
                    component={MedicalUserNavigationStack}
                />
                <Stack.Screen
                    name="BusUserNavigationStack"
                    options={{ headerShown: false }}
                    component={BusUserNavigationStack}
                />
                <Stack.Screen
                    name="LaundryUserNavigationStack"
                    // options={{ headerShown: false }}
                    options={{
                        headerLeft: () => null,
                        headerShown: true,
                        headerTitle: 'Laundry Facility',
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
                        headerTintColor: themeColors.mainTextColor,
                    }}
                    component={LaundryUserNavigationStack}
                />
                <Stack.Screen
                    name="Details"
                    options={{
                        headerStyle: {
                            backgroundColor: themeColors.backGroundColor,
                        },
                        headerShown: true,
                        title: '',
                        headerTintColor: themeColors.mainTextColor,
                        headerLeft: () => <CustomBackButton />,
                        headerRight: () => <HeaderRightIcons />
                    }}
                    component={Details}
                />
                <Stack.Screen
                    name="DetailView"
                    component={DetailView}
                />
                <Stack.Screen
                    name="OrderHistory"
                    component={OrderHistory}
                />
                <Stack.Screen
                    options={({ route }) => ({
                        headerLeft: () => <CustomBackButton />,
                        headerStyle: {
                            backgroundColor: themeColors.backGroundColor,
                        },
                        headerShown: true,
                        title: route.params?.item?.name || '', // Default to an empty string if storeName is not provided
                        headerTintColor: themeColors.mainTextColor,
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 20,
                            color: themeColors.mainTextColor,
                            textAlign: 'center', // Center the title
                        },
                    })}
                    name="IndiviualCart"
                    component={IndiviualCart}
                />
                <Stack.Screen
                    name="SelectAddress"
                    options={{ headerShown: true, title: 'Select Your Location' }}
                    component={SelectAddress}
                />
                <Stack.Screen
                    name="Profile"
                    component={Profile}
                />
                <Stack.Screen
                    name="ComplaintsList"
                    component={ComplaintsList}
                />
                <Stack.Screen
                    name="ComplaintOfOutlet"
                    component={ComplaintOfOutlet}
                />
                <Stack.Screen
                    name="ModalScreen"
                    component={ModalScreen}
                />
                <Stack.Screen
                    name="YettoUpdate"
                    component={YettoUpdate}
                />
                <Stack.Screen
                    options={{
                        headerShown: true,
                        title: 'Order History',
                        headerStyle: {
                            backgroundColor: themeColors.backGroundColor,
                        },
                        headerTintColor: themeColors.mainTextColor,
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 20,
                            color: themeColors.mainTextColor,
                            textAlign: 'center', // Center the title
                        },
                    }}
                    name="HistorySeller"
                    component={HistorySeller}
                />
                <Stack.Screen
                    options={{
                        headerShown: true,
                        title: 'Order History',
                        headerStyle: {
                            backgroundColor: themeColors.subbackGroundColor,
                        },
                        headerTintColor: themeColors.mainTextColor,
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 20,
                            color: themeColors.mainTextColor,
                            textAlign: 'center', // Center the title
                        },
                    }}
                    name="History"
                    component={History}
                />
                <Stack.Screen
                    name="EditRestorent"
                    component={EditRestorent}
                />
                <Stack.Screen
                    name="ComplaintScreen"
                    component={Complaint}
                />
                <Stack.Screen
                    name="EditMain"
                    component={EditMain}
                />
                <Stack.Screen
                    name="Insights"
                    component={Insights}
                    options={{
                        headerLeft: () => <CustomBackButton />,
                        headerRight: () =>
                            <TouchableOpacity className='px-4'>
                                <Ionicons name="ellipsis-vertical-outline" size={24} color={themeColors.mainTextColor} />
                            </TouchableOpacity>
                        ,
                        headerShown: true,
                        headerTitle: 'Insights',
                        headerTitleAlign: 'center',
                        headerStyle: {
                            // height: 65,
                            backgroundColor: themeColors.backGroundColor, //'black'
                        },
                        headerTitleStyle: {
                            fontWeight: '900',
                            fontSize: 24,
                        },
                        headerTintColor: themeColors.mainTextColor, //themeColors.diffrentColorOrange,
                    }}
                />
                <Stack.Screen
                    name="LoginNavigationStack"
                    component={LoginNavigationStack}
                />
            </Stack.Navigator>
        )
    }

    const [isSplashVisible, setIsSplashVisible] = useState(true);

    useEffect(() => {
        // Show splash screen for at least 3 seconds
        const timer = setTimeout(() => {
            setIsSplashVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    //   const navigation = useNavigation();

    const { showAlert, AlertWrapper } = useCustomAlert();

    return (
        <NavigationContainer theme={DarkTheme}>
            {/* {showToast &&
                <View className=' absolute w-full h-full z-40'>
                    <TouchableOpacity className=' w-full h-full z-30' onPress={() => { setShowToast(false) }}
                    // style={{backgroundColor: 'rgba(355, 355, 355, 0.07)'}} 
                    />
                    <View className='absolute pl-3 z-40 rounded-xl mt-12 mr-2 flex-1 top-0 right-0 w-[43%]' style={{ backgroundColor: themeColors.secComponentColor }}>
                        <TouchableOpacity onPress={() => { setShowToast(false); navigation.navigate('Profile'); }} numberOfLines={1} ellipsizeMode='tail' className='font-black text-base py-3' style={{ color: themeColors.mainTextColor }}>
                            <Text numberOfLines={1} ellipsizeMode='tail' className='font-black text-base' style={{ color: themeColors.mainTextColor }}>Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setShowToast(false); navigation.navigate('Insights'); }} numberOfLines={1} ellipsizeMode='tail' className='font-black text-base py-3' style={{ color: themeColors.mainTextColor }}>
                            <Text numberOfLines={1} ellipsizeMode='tail' className='font-black text-base' style={{ color: themeColors.mainTextColor }}>InSights</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setShowToast(false); navigation.navigate('YettoUpdate'); }} numberOfLines={1} ellipsizeMode='tail' className='font-black text-base py-3' style={{ color: themeColors.mainTextColor }}>
                            <Text numberOfLines={1} ellipsizeMode='tail' className='font-black text-base' style={{ color: themeColors.mainTextColor }}>Wallet</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setShowToast(false); navigation.navigate('History') }} numberOfLines={1} ellipsizeMode='tail' className='font-black text-base py-3' style={{ color: themeColors.mainTextColor }}>
                            <Text numberOfLines={1} ellipsizeMode='tail' className='font-black text-base' style={{ color: themeColors.mainTextColor }}>History</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setShowToast(false); }} numberOfLines={1} ellipsizeMode='tail' className='font-black text-base py-3' style={{ color: themeColors.mainTextColor }}>
                            <Text numberOfLines={1} ellipsizeMode='tail' className='font-black text-base' style={{ color: themeColors.mainTextColor }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            } */}
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isSplashVisible ? (
                    <Stack.Screen name='Splash' component={SplashScreen} />
                ) : isLoggedInValue ? (
                    <Stack.Screen name='BuyerNavigationStack' component={BuyerNavigationStack} />
                ) : (
                    <>
                        <Stack.Screen name='StarterScreen' component={StaterScreen} />
                        <Stack.Screen name='LoginNavigationStack' component={LoginNavigationStack} />
                    </>
                )}

            </Stack.Navigator>
            {AlertWrapper()}
        </NavigationContainer>
    );
}