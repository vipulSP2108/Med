const GOOGLE_SCRIPT_reserveNonVegMeal = 'https://script.google.com/macros/s/AKfycby1tz0YjH0mEMIVSvtredfR5lrk5vPPHeQ_E-o3VhnHqF0J0W7yxjB4AsO4OB0ggUypVQ/exec'

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StatusBar, ScrollView, SafeAreaView, Dimensions, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../Context/ThemeContext';
import TextStyles from '../Style/TextStyles';
import useCustomAlert from '../Components/Alerthook';
import { LinearGradient } from 'expo-linear-gradient';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { useNavigation } from '@react-navigation/native';

const MessBookingScreen = ({ route }) => {
    const { priceData, menuItem, userMess, availableSlots, availableUntil, availableMess } = route.params;
    const { userData } = useContext(GlobalStateContext);

    const { themeColors, toggleTheme } = useContext(ThemeContext);
    const fontstyles = TextStyles();
    const [selectedMess, setSelectedMess] = useState(); //availableMess[0]
    const [selectedTime, setSelectedTime] = useState();
    // const [userMess, setUserMess] = useState('');
    const [isAvailable, setIsAvailable] = useState(false);
    const [price, setPrice] = useState(100);
    const [loading, setLoading] = useState(false);
    const [massage, setMassage] = useState('');  // Text message input from the user
    const [parcelActive, setparcelActive] = useState(false);
    const { showAlert, AlertWrapper } = useCustomAlert();

    const navigation = useNavigation();
    // useEffect(() => {
    //     getMessByEmail(userData);
    //     // console.log('useeff')
    // }, [])
    // userData

    useEffect(() => {
        if (userMess == selectedMess?.toUpperCase()) {
            setPrice(priceData['Non-vegDiscontPrice']);
        } else {
            setPrice(priceData['Non-vegPrice']);
        }
    }, [selectedMess]);

    const checkAvailability = () => {
        const currentDate = new Date();
        const currentDay = new Date(currentDate.setHours(0, 0, 0, 0));  // Start of today at 12:00 AM
        const sixPM = new Date(currentDay.setHours(availableUntil, 0, 0, 0));  // Set to 10:00 PM

        if (new Date() < sixPM) {
            setIsAvailable(true);
            return true
        } else {
            setIsAvailable(false);
            showAlert({
                title: "Booking Time Restricted",
                // message: "Bookings are only available today before 8 PM only.", // Please select a valid time.
                message: `Bookings are only available today before ${availableUntil} only.`, // Please select a valid time.
                codeMassage: { code: '400', text: '⏳ Sorry! Book before 6 PM.' },
            });
            return false
        }
    }

    useEffect(() => {
        checkAvailability();
    }, [])

    const reserveNonVegMeal = async () => {
        setLoading(true)
        try {
            const response = await fetch(GOOGLE_SCRIPT_reserveNonVegMeal, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // price, selectedTime, selectedMess, massage, parcelActive, userData.contactinfo
                body: JSON.stringify({
                    userinfo: userData.contactinfo,
                    price: price,
                    selectedTime: selectedTime,
                    selectedMess: selectedMess,
                    massage: massage,
                    parcelActive: parcelActive,
                    menuItem: menuItem,
                }),
            });

            if (!response.ok) {
                console.error(`Server error: response`);
            }

            try {
                const text = await response.text();
                const data = JSON.parse(text); // Attempt to parse the JSON response
                // console.log(data)
                if (data.status == 500) {
                    showAlert({
                        title: "Booking Failed",
                        message: data.message, // Please select a valid time.
                        codeMassage: { code: '400', text: '⚡ Issue got from Server’s' },
                    });
                } else if (data.status == 300) {
                    showAlert({
                        title: "Already Booked",
                        message: "You have already booked a meal from this mess for today. Multiple bookings are not allowed.",
                        codeMassage: { code: '400', text: '📅 One booking per day!' },
                    });
                }
                else {
                    if (data.status == 201) {
                        Alert.alert('🍗 Non-Veg booked!', "Your Non-Veg meal has been successfully booked in the mess. \n Discount applied!")
                        // ✅ Discount applied!
                        navigation.navigate('MessOrders')
                    }
                    if (data.status == 202) {
                        Alert.alert('🍗 Non-Veg booked!', "Your Non-Veg meal has been successfully booked in the mess. \n No discount applied.")
                        // ❌ No discount.
                        navigation.navigate('MessOrders')
                    }
                }
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
            }
        } catch (error) {
            console.error("Error fetching available slots:", error);
        }
        finally {
            setLoading(false);  // Stop loading once data is fetched or error occurs
        }
    };


    const PlaceOrder = () => {
        if (!checkAvailability()) {
            showAlert({
                title: "Booking Time Restricted",
                message: "Bookings are only available today before 6 PM only.", // Please select a valid time.
                codeMassage: { code: '400', text: '⏳ Sorry! Book before 6 PM.' },
            });
            return;
        }
        // console.log(selectedTime, selectedMess)
        if (!selectedTime && !selectedMess) {
            showAlert({
                title: "Selection Required",
                message: "Please select a time slot and enter a message to proceed.",
                codeMassage: { code: '400', text: '⏰ Pick a slot & add a note!' },
            });
            return;
        }
        // console.log(price, selectedTime, selectedMess, massage, parcelActive, userData.contactinfo)
        // Alert.alert('Hi', 'succrsss')
        reserveNonVegMeal();
    }

    const messWidth = 100 / availableMess.length - 2

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.backGroundColor }}>
            {loading && (
                <View style={{ backgroundColor: themeColors.backGroundColor, opacity: 0.90 }} className='h-full w-full items-center justify-center absolute z-50 pb-24'>
                    <ActivityIndicator size={70} color={themeColors.diffrentColorOrange} />
                </View>
            )}
            <StatusBar backgroundColor={themeColors.backGroundColor} />
            <ScrollView>
                <View className='p-3' style={{ backgroundColor: themeColors.backGroundColor }}>
                    {/* Header */}
                    <View className=' mb-4 pt-3 pb-2 rounded-xl overflow-hidden' style={{ backgroundColor: themeColors.componentColor }}>
                        <View className='px-3 pt-2 pb-2 flex-row' >
                            <Ionicons name="business-outline" size={20} color={themeColors.mainTextColor} />
                            <View className=' ml-3 flex-row' style={{ marginTop: -2 }}>
                                <Text style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>Select Your </Text>
                                <Text style={[fontstyles.numberbigger, { marginTop: 3, color: themeColors.mainTextColor }]}>Mess</Text>
                            </View>
                        </View>
                        <View className='px-3 flex-row justify-between' >
                            {/* {console.log(availableMess)} */}
                            {availableMess.map((mess, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => setSelectedMess(mess)}
                                    className={`items-center justify-center py-2 rounded-md`}
                                    style={{
                                        width: `${messWidth}%`,
                                        backgroundColor: selectedMess === mess ? themeColors.diffrentColorOrange : themeColors.secComponentColor, // backGroundColor
                                    }}
                                >
                                    <Text style={[fontstyles.h5_bold, { fontSize: 18, marginBottom: -3, color: selectedMess === mess ? themeColors.componentColor : themeColors.textColor }]}>
                                        {mess}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text className=' px-4' numberOfLines={1} ellipsizeMode='clip' style={{ color: themeColors.secComponentColor }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>
                        <View className='flex-row px-3 pt-2' >
                            <Ionicons name="document-text-outline" size={20} color={themeColors.mainTextColor} />
                            <View className=' ml-3'>
                                <View className='flex-row'>
                                    <Text style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>Note for the Oprator </Text>
                                    {/* <Text className='font-black text-base' style={{ color: themeColors.mainTextColor }}>₹{totalPrice}</Text> */}
                                </View>
                                <TextInput
                                    className='font-medium text-sm'
                                    style={[{ fontSize: 14, color: themeColors.textColor }]}
                                    value={massage}
                                    multiline={true}
                                    onChangeText={(text) => setMassage(text)}
                                    placeholder="Write your Massage"
                                    placeholderTextColor={themeColors.textColor}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Menu */}
                    <View style={{ backgroundColor: themeColors.componentColor }} className=' py-3 rounded-xl overflow-hidden'>
                        <View className=' pl-3 overflow-hidden' style={{ backgroundColor: themeColors.componentColor }}>
                            <View className='flex-row w-full'>
                                <View className=' w-3/12'>
                                    <ImageBackground
                                        source={
                                            // item?.image ?
                                            // { uri: item?.image, method: 'POST', headers: { Pragma: 'no-cache' } } :
                                            require('./../../assets/menu.jpg')}
                                        defaultSource={require('./../../assets/menu.jpg')}
                                        resizeMode="cover"
                                        alt="Logo"
                                        className='w-full h-20 border-2 rounded-lg overflow-hidden border-slate-950'
                                        style={{ borderWidth: 2, borderColor: themeColors.secComponentColor }}
                                    >
                                        <LinearGradient
                                            start={{ x: 0.0, y: 0.45 }} end={{ x: 0.4, y: 1.3 }}
                                            className='  h-full w-full'
                                            colors={['transparent', themeColors.backGroundColor]}
                                        >
                                        </LinearGradient>

                                    </ImageBackground>

                                </View>
                                <View className=' w-9/12 px-3'>
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.blackh2, { fontSize: 22, color: themeColors.mainTextColor }]}>{menuItem}</Text>
                                    {/* <Text className=' ' >{selectedMess}</Text> */}
                                    <View className='mt-1 flex-row items-center mb-3'>
                                        <View className='flex-row justify-center items-center mr-1'>
                                            <Text style={[fontstyles.h6, { color: themeColors.textColor }]}>{selectedMess?.toUpperCase()} </Text>
                                            {selectedTime && selectedMess && <Ionicons style={{ marginTop: 6 }} name="ellipse" size={5} color={themeColors.textColor} />}
                                            <Text style={[fontstyles.h6, { color: themeColors.textColor }]}> {selectedTime}</Text>
                                        </View>
                                    </View>
                                    <View className='flex-1 justify-end w-full mb-1'>
                                        <View className=' items-end flex-row justify-between'>
                                            <Text style={[fontstyles.numberbigger, { color: themeColors.mainTextColor }]}>
                                                ₹{price}
                                            </Text>

                                            {(userMess != 'Not Found' && price != priceData['Non-vegDiscontPrice']) &&
                                                <View className=' flex-row ml-2'>
                                                    <Text style={[fontstyles.number, { color: themeColors.mainTextColor }]}>
                                                        *₹
                                                    </Text>
                                                    {/* {console.log(userMess)} */}
                                                    <Text style={[fontstyles.h6, { marginBottom: -4, color: themeColors.mainTextColor }]}>
                                                        {priceData['Non-vegDiscontPrice']} at {userMess} Mess!
                                                        {/* {userMess.charAt(0).toUpperCase() + userMess.slice(1).toLowerCase()}  */}
                                                    </Text>
                                                </View>
                                            }
                                        </View>
                                        {/*  */}
                                    </View>
                                </View>
                            </View>
                            {(userMess == 'Not Found') &&
                                <View className=' flex-row ml-2'>
                                    <Text style={[fontstyles.h5_5, { lineHeight: 15, paddingTop: 10, color: themeColors.diffrentColorRed }]}>
                                    You have not allocated any mess in the data. Please coordinate team if you have allocated a mess*
                                    </Text>
                                </View>
                            }
                        </View>
                    </View>

                    <View className=' mt-4 rounded-xl overflow-hidden' style={{ backgroundColor: themeColors.componentColor }}>
                        <View className='px-3 pt-4 pb-2 flex-row' >
                            <Ionicons name="timer-outline" size={20} color={themeColors.mainTextColor} />
                            <View className=' ml-3 flex-row' style={{ marginTop: -2 }}>
                                <Text style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>Select Your </Text>
                                <Text style={[fontstyles.numberbigger, { marginTop: 3, color: themeColors.mainTextColor }]}>Time Slot</Text>
                            </View>
                        </View>
                        <View className='px-3 justify-between' >
                            {/* flex-row */}
                            {availableSlots.map((slot, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => setSelectedTime(slot)}
                                    style={{
                                        marginVertical: 5,
                                        padding: 7,
                                        backgroundColor: selectedTime === slot ? themeColors.diffrentColorOrange : themeColors.secComponentColor,
                                        borderRadius: 5,
                                    }}
                                >
                                    <Text className=' text-center' style={[fontstyles.numberbigger, { color: selectedTime === slot ? themeColors.componentColor : themeColors.textColor }]}>
                                        {slot}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {/* <Text className=' px-4' numberOfLines={1} ellipsizeMode='clip' style={{ color: themeColors.secComponentColor }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text> */}
                        {/* <View className=' mx-4' style={{ height: 1, backgroundColor: themeColors.secComponentColor}} /> */}
                        {/* <View className='flex-row px-3 items-center justify-between'>
                            <View className=' flex-row'>
                                <Ionicons name="restaurant-outline" size={20} color={themeColors.mainTextColor} />
                                <Text className=' ml-3' style={[fontstyles.h5, { marginTop: -2, color: themeColors.mainTextColor }]}>Do you want Parcel?</Text>
                            </View>
                            <TouchableOpacity onPress={() => setparcelActive(!parcelActive)}>
                                <Ionicons
                                    name='toggle' size={34} style={{ transform: [{ rotate: parcelActive ? '0deg' : '180deg' }] }} color={parcelActive ? isAvailable ? themeColors.diffrentColorGreen : themeColors.diffrentColorRed : themeColors.mainTextColor}
                                />
                            </TouchableOpacity>
                        </View> */}
                        <Text className=' px-4' numberOfLines={1} ellipsizeMode='clip' style={{ color: themeColors.secComponentColor }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>
                        <View className='px-3 pb-4 pt-3'>
                            <View className='flex-row' >
                                <Ionicons name="receipt-outline" size={20} color={themeColors.mainTextColor} />
                                <View className=' ml-3' style={{ marginTop: -4 }}>
                                    <View className='flex-row'>
                                        <Text style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>Total Bill </Text>
                                        <Text style={[fontstyles.numberbigger, { marginTop: 2, color: themeColors.mainTextColor }]}>₹{price}</Text>
                                    </View>
                                    <Text style={[fontstyles.h5_5, { color: themeColors.textColor }]}>Incl. taxes, charges & discount</Text>
                                </View>
                            </View>
                            <View className='absolute top-3 right-3 items-end'>
                                <Ionicons name="chevron-forward-outline" size={24} color={themeColors.mainTextColor} />
                            </View>
                        </View>
                    </View>

                    <View className='mt-4 mb-24'>
                        <Text className=' tracking-[3]' style={[fontstyles.number, { fontSize: 15, color: themeColors.textColor }]}>CANCELLATION POLICY</Text>
                        <Text className='mt-3' style={[fontstyles.h5_5, { lineHeight: 20, color: themeColors.textColor }]}>
                            Help us reduce food waste by avoiding cancellations after placing your order. A 100% cancellation fee will be applied.
                        </Text>
                    </View>

                </View>

                {AlertWrapper()}
            </ScrollView>

            <View className=' p-5 rounded-t-2xl flex-row items-center w-full justify-between' style={{ backgroundColor: themeColors.componentColor }}>
                {price &&
                    <View>
                        <View className=' flex-row'>
                            <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor }]}>₹{price?.toFixed(2)}</Text>
                        </View>
                        <Text className='font-medium text-base' style={[fontstyles.number, { color: themeColors.textColor }]}>TOTAL</Text>
                    </View>
                }
                <TouchableOpacity
                    onPress={() => PlaceOrder()}
                    className="p-3 flex-row justify-center items-center rounded-lg"
                    style={{
                        backgroundColor: isAvailable ? themeColors.diffrentColorGreen : themeColors.diffrentColorRed,
                        width: Dimensions.get('window').width * 0.53
                    }}
                >
                    <Text style={[fontstyles.number, { fontSize: 18, color: themeColors.mainTextColor }]}>
                        {isAvailable ? 'Reserve' : 'InAvailable'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default MessBookingScreen;