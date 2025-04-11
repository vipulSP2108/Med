import React, { useRef, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, ADDOUTLET_ENDPOINT, USEROUTLETS_ENDPOINT } from '../Constants/Constants';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, StatusBar, Dimensions, FlatList, Alert, Keyboard, Linking, Button } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Ionicons from "react-native-vector-icons/Ionicons";
import Colors from '../Components/Colors';
import { ImageBackground } from 'react-native';


import { LinearGradient } from "expo-linear-gradient";
import ManageCategoriesScreen from './EditRestorent';
import TextStyles from '../Style/TextStyles';
import useCustomAlert from '../Components/Alerthook';
import { ThemeContext } from '../Context/ThemeContext';

const menuTypes = ['Beverage', 'Dessert', 'General', 'Coffee', 'Printing', 'Indian', 'Grocery', 'Healthy Food', 'Fast Food', 'Stationery', 'Cuisine', 'Laundry Services', 'Bakery'];

const weekDays = [
    { label: 'Sunday', value: 'Su' },
    { label: 'Monday', value: 'Mo' },
    { label: 'Tuesday', value: 'Tu' },
    { label: 'Wednesday', value: 'We' },
    { label: 'Thursday', value: 'Th' },
    { label: 'Friday', value: 'Fr' },
    { label: 'Saturday', value: 'Sa' },
    { label: 'None', value: 'No' },
];

export default function EditScreen({ route, navigation }) {
    const { outlet } = route.params;
    const [editingOutlet, setEditingOutlet] = useState(outlet || {
        name: '', shopkeeperName: '', upiId: '', image: '', details: '', location: '', type: 'Veg',
        featured: false,
        openingTime: '',
        closingTime: '',
        offDays: [],
        menuType: [],
        leaveDay: 'None',
        Lic: '',
    });
const { themeColors, toggleTheme } = useContext(ThemeContext);
    // console.log(editingOutlet)

    const { showAlert, AlertWrapper } = useCustomAlert();

    const handleChange = (field, value) => {
        setEditingOutlet({ ...editingOutlet, [field]: value });
    };

    // -------------------- For Auto Submit/ without save button use this ---------------------

    const handleSaveOutlet = async () => {
        let missingFields = [];

        if (!editingOutlet.name) missingFields.push("Outlet Name");
        if (!editingOutlet.shopkeeperName) missingFields.push("Shopkeeper Name");
        if (!editingOutlet.upiId) missingFields.push("UPI ID");
        if (!editingOutlet.details) missingFields.push("Details");
        if (!editingOutlet.location) missingFields.push("Location");
        if (editingOutlet.featured === undefined) missingFields.push("Featured");
        if (!editingOutlet.openingTime) missingFields.push("Opening Time");
        if (!editingOutlet.closingTime) missingFields.push("Closing Time");
        if (!editingOutlet.offDays) missingFields.push("Off Days");
        if (!editingOutlet.Lic) missingFields.push("Lic");
        // if (!editingOutlet.leaveDay) missingFields.push("Leave Day");

        if (missingFields.length > 0) {
            showAlert({
                title: "Missing Information",
                message: `Please fill in the following fields:\n${missingFields.join(", ")}`,
                codeMassage: { code: '201', text: '😅 Oops! Looks like something’s missing!' },
            });
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");
            const outletData = { ...editingOutlet, token };
            // console.log(token)

            const response = await fetch(`${API_BASE_URL}:${ADDOUTLET_ENDPOINT}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(outletData)
            });

            const data = await response.json();
            if (data.status === "ok") {
                Alert.alert("Outlet saved successfully");
                navigation.goBack(); // Go back to the home screen
            } else {
                Alert.alert(data.data);
            }
        } catch (error) {
            console.error("Error saving outlet:", error);
        }
    };

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [timePickerKey, setTimePickerKey] = useState(null);
    const [isDateSelectorVisible, setDateSelectorVisibility] = useState(false);

    // const handleChange = (key, value) => {
    //     setStoreDetails(prevState => ({
    //         ...prevState,
    //         [key]: value
    //     }));
    // };

    const handleOffDaysToggle = (type) => {
        setEditingOutlet(prevState => {
            let updatedOffDays;
            if (type === 'None') {
                updatedOffDays = ['None'];
            } else {
                if (prevState.offDays.includes(type)) {
                    updatedOffDays = prevState.offDays.filter(item => item !== type);
                } else {
                    updatedOffDays = [...prevState.offDays.filter(item => item !== 'None'), type];
                }
            }
            return { ...prevState, offDays: updatedOffDays };
        });
    };

    const handleMenuTypeToggle = (type) => {
        setEditingOutlet(prevState => {
            const updatedMenuType = prevState.menuType.includes(type)
                ? prevState.menuType.filter(item => item !== type)
                : [...prevState.menuType, type];
            return { ...prevState, menuType: updatedMenuType };
        });
    };

    const showDatePicker = (key) => {
        setTimePickerKey(key);
        setDatePickerVisibility(true);
    };

    const showDateSelector = () => {
        setDateSelectorVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
        setTimePickerKey(null);
    };

    const hideDateSelector = () => {
        setDateSelectorVisibility(false);
    };

    const handleConfirm = (date) => {
        const formattedTime = moment(date).format('hh:mm a');
        if (timePickerKey) {
            handleChange(timePickerKey, formattedTime);
        }
        hideDatePicker();
    };

    const handleDateConfirm = (date) => {
        const formattedDate = moment(date).format('MMMM D, YYYY');
        handleChange('leaveDay', formattedDate);
        hideDateSelector();
    };

    const [storeDetailsOffDays, setStoreDetailsOffDays] = useState({
        offDays: [],
    });

    const [openDropdown, setOpenDropdown] = useState(false);

    const toggleDropdown = () => {
        setOpenDropdown(prevState => !prevState);
    };

    const scrollViewRef = useRef(null);

    const handleDropdownPress = () => {
        toggleDropdown();
        setTimeout(() => {
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: 1200, animated: true });
            }
        }, 10); // Adjust the timeout as needed
    };

    const inputRefs = useRef({});
    const [focusedInput, setFocusedInput] = useState(null);

    const focusInput = (fieldName) => {
        if (inputRefs.current[fieldName]) {
            inputRefs.current[fieldName].focus();
        }
    };

    const handleBlur = (fieldName) => {
        setFocusedInput(null);
    };

    const handleFocus = (fieldName) => {
        setFocusedInput(fieldName);
    };

    const fontstyles = TextStyles();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <StatusBar backgroundColor={'transparent'} />
            <View className=' w-full justify-between' style={{ backgroundColor: themeColors.backGroundColor }}>
                <ImageBackground
                    source={editingOutlet.image ?
                        { uri: editingOutlet.image, method: 'POST', headers: { Pragma: 'no-cache' } } :
                        require('./../../assets/store.jpg')}
                    defaultSource={require('./../../assets/store.jpg')}
                    // className=''

                    alt="Logo"
                >
                    <View className=' py-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                        <View
                            // style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }} 
                            className='flex-row items-center px-3'>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Ionicons name="arrow-back-outline" size={24} color={themeColors.mainTextColor} />
                            </TouchableOpacity>
                        </View>

                        <View className='w-full px-3 items-center rounded-2xl overflow-hidden' style={{ height: Dimensions.get('window').height * 0.25 }}>
                            {/* <View className='w-full rounded-3xl items-center justify-center p-2' style={{ backgroundColor: themeColors.backGroundColor }}> */}
                            <Text className='mb-1' style={[fontstyles.h1, { color: themeColors.mainTextColor }]}>{editingOutlet.name}</Text>
                            <View className='flex-row justify-center items-center mb-3'>
                                <View className='flex-row justify-center items-center'>
                                    {editingOutlet.type === "PureVeg" && <Ionicons name="leaf" size={16} color={themeColors.diffrentColorGreen} />}
                                    <Text className='ml-1' style={[fontstyles.h5, { marginBottom: -4, color: themeColors.textColor }]}>{editingOutlet.type} </Text>
                                </View>
                                {editingOutlet.menuType.map((item, index) => (
                                    <View key={index} className=' flex-row items-center'>
                                        {/* {console.log(item)} */}
                                        <Ionicons name="ellipse" size={5} color={themeColors.textColor} />
                                        <Text className='ml-1' style={[fontstyles.h5, { marginBottom: -4, color: themeColors.textColor }]}> {item} </Text>
                                    </View>
                                ))}
                            </View>

                            <View className='flex-row justify-center items-center rounded-full py-1 px-2 mb-5' style={{ backgroundColor: themeColors.diffrentColorPerple }}>
                                <Ionicons name="navigate-circle" size={24} color={themeColors.diffrentColorPerpleBG} />
                                <Text className='mx-1' style={[fontstyles.number, { color: themeColors.mainTextColor }]}>{editingOutlet.location} </Text>
                            </View>
                            {/* <LinearGradient
                                    start={{ x: 0.0, y: 0.01 }} end={{ x: 0.01, y: 0.8 }}
                                    // colors={[Shopstatus.color[0], Shopstatus.color[1]]}
                                    className=' rounded-2xl px-5 justify-center' style={{ backgroundColor: themeColors.secComponentColor, height: Dimensions.get('window').height * 0.13 }}> */}
                            <Text className='text-center' style={[fontstyles.h4, { color: themeColors.mainTextColor }]}>
                                {editingOutlet.openingTime} to {editingOutlet.closingTime}
                            </Text>
                            <Text className='text-center' style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>
                                OffDays: {editingOutlet.offDays.join(', ')}
                            </Text>
                            {/* </LinearGradient> */}
                            {/* </View> */}
                        </View>
                    </View>
                </ImageBackground>
            </View>

            <ScrollView
                ref={scrollViewRef}
                className='px-3 h-full w-full'
                style={{ backgroundColor: themeColors.backGroundColor }}
                keyboardShouldPersistTaps='handled'
            >
                {/* <ManageCategoriesScreen
                    editingOutlet={editingOutlet}
                    setEditingOutlet={setEditingOutlet}
                // onSelectCategory={setSelectedCategory}
                /> */}

                <View className='mt-3 px-2 flex-row justify-center'>
                    <TouchableOpacity onPress={() => navigation.navigate('YettoUpdate')} className='w-1/2 rounded-2xl overflow-hidden mr-3 justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.15 }}>
                        <View className='p-2 absolute left-6 top-4 rounded-full' style={{ backgroundColor: themeColors.secComponentColor }}>
                            <Ionicons name='pricetags-outline' size={24} color={themeColors.mainTextColor} />
                        </View>
                        <Text numberOfLines={1} ellipsizeMode='tail' className='absolute left-6 bottom-4' style={[fontstyles.h3, { color: themeColors.mainTextColor }]}>Add Offers</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        //create-outline
                        onPress={() => navigation.navigate('EditRestorent', { outlet: outlet })}
                        className='w-1/2 rounded-2xl overflow-hidden justify-between'
                        style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.15 }}
                    >
                        <View className='p-2 absolute left-6 top-4 rounded-full' style={{ backgroundColor: themeColors.secComponentColor }}>
                            <Ionicons name='duplicate-outline' size={24} color={themeColors.mainTextColor} />
                        </View>
                        <Text className='absolute left-6 bottom-4' style={[fontstyles.h3, { color: themeColors.mainTextColor }]}>Add Menu</Text>
                    </TouchableOpacity>
                </View>

                <View className='rounded-xl mt-3 w-full' style={{ backgroundColor: themeColors.componentColor }}>
                    <View className='p-3 items-center flex-row justify-between'>
                        <View className='flex-row items-center'>
                            <Text style={[fontstyles.h3, { marginBottom: -4, color: themeColors.mainTextColor }]}>Featured</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleChange('featured', !editingOutlet.featured)}>
                            {/* {console.log(editingOutlet.featured)} */}
                            <Ionicons
                                name='toggle'
                                size={38}
                                style={{ transform: [{ rotate: editingOutlet.featured ? '0deg' : '180deg' }] }}
                                color={editingOutlet.featured ? themeColors.diffrentColorGreen : themeColors.mainTextColor}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className='mt-3 rounded-xl overflow-hidden'>
                    <View className='rounded-xl p-3 ' style={{ backgroundColor: themeColors.componentColor }}>
                        <View className=' flex-row items-center justify-between'>
                            <View className=' flex-row justify-between'>
                                <TouchableOpacity
                                    onPress={() => handleChange('type', 'PureVeg')}
                                    style={{ backgroundColor: editingOutlet.type === 'PureVeg' ? themeColors.diffrentColorGreen : themeColors.backGroundColor }}
                                    className=' w-[35%] p-3 rounded-l-lg items-center'
                                >
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { marginTop: -2, color: themeColors.mainTextColor }]}>Pure Veg</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleChange('type', 'Mixed')}
                                    style={{ backgroundColor: editingOutlet.type === 'Mixed' ? themeColors.diffrentColorPerple : themeColors.backGroundColor }}
                                    className=' w-[30%] p-3 items-center'
                                >
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { marginTop: -2, color: themeColors.mainTextColor }]}>Mixed</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleChange('type', 'NonVeg')}
                                    style={{ backgroundColor: editingOutlet.type === 'NonVeg' ? themeColors.diffrentColorRed : themeColors.backGroundColor }}
                                    className=' w-[35%] p-3 rounded-r-lg items-center'
                                >
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { marginTop: -2, color: themeColors.mainTextColor }]}>Non Veg</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                <View className='mt-3 rounded-xl overflow-hidden'>
                    <View className='rounded-xl p-3' style={{ backgroundColor: themeColors.componentColor }}>
                        <View className='items-center flex-row mb-3'>
                            <View className='absolute -left-11 rounded-lg h-full w-10' style={{ backgroundColor: themeColors.diffrentColorOrange }} />
                            <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h3, { marginBottom: -4, color: themeColors.mainTextColor }]}> Shopkeeper Information</Text>
                        </View>
                        <View className='my-2 flex-row items-center justify-between'>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { marginBottom: -4, color: themeColors.mainTextColor }]}>Shopkeeper Name</Text>
                            <View className='flex-row'>
                                <TextInput
                                    ref={ref => inputRefs.current['shopkeeperName'] = ref}
                                    style={{ color: themeColors.mainTextColor }}
                                    className='font-black text-base underline mr-2 text-right'
                                    value={editingOutlet.shopkeeperName}
                                    onChangeText={(value) => handleChange('shopkeeperName', value)}
                                    placeholder='Your Name'
                                    placeholderTextColor={themeColors.textColor}
                                    onFocus={() => handleFocus('shopkeeperName')}
                                    onBlur={() => handleBlur('shopkeeperName')}
                                />

                                {focusedInput === 'shopkeeperName' ? (
                                    <TouchableOpacity onPress={() => inputRefs.current['shopkeeperName'].blur()}>
                                        <Ionicons name="checkmark-done" size={22} color={themeColors.mainTextColor} />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => focusInput('shopkeeperName')}>
                                        <Ionicons name="pencil-sharp" size={22} color={themeColors.mainTextColor} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                        <View className='my-2 flex-row items-center justify-between'>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { marginBottom: -4, color: themeColors.mainTextColor }]}>UPI ID</Text>
                            <View className='flex-row'>
                                <TextInput
                                    ref={ref => inputRefs.current['upiId'] = ref}
                                    style={{ color: themeColors.mainTextColor }}
                                    className='font-black text-base underline mr-2 text-right'
                                    value={editingOutlet.upiId}
                                    onChangeText={(value) => handleChange('upiId', value)}
                                    placeholder='upi@123'
                                    placeholderTextColor={themeColors.textColor}
                                    onFocus={() => handleFocus('upiId')}
                                    onBlur={() => handleBlur('upiId')}
                                />

                                {focusedInput === 'upiId' ? (
                                    <TouchableOpacity onPress={() => { inputRefs.current['upiId'].blur(), handleSaveOutlet }}>
                                        <Ionicons name="checkmark-done" size={22} color={themeColors.mainTextColor} />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => focusInput('upiId')}>
                                        <Ionicons name="pencil-sharp" size={22} color={themeColors.mainTextColor} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                </View>

                <View className='mt-3 rounded-xl overflow-hidden'>
                    <View className='rounded-xl p-3' style={{ backgroundColor: themeColors.componentColor }}>
                        <View className='items-center flex-row mb-3'>
                            <View className='absolute -left-11 rounded-lg h-full w-10' style={{ backgroundColor: themeColors.diffrentColorOrange }} />
                            <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h3, { marginBottom: -4, color: themeColors.mainTextColor }]}> Store Information</Text>
                        </View>

                        <View className='my-2 flex-row items-center justify-between'>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { marginBottom: -4, color: themeColors.mainTextColor }]}>Lic. No. (fissai)</Text>
                            <View className='flex-row'>
                                <TextInput
                                    ref={ref => inputRefs.current['Lic'] = ref}
                                    style={{ color: themeColors.mainTextColor }}
                                    className='font-black text-base underline mr-2 text-right'
                                    value={editingOutlet.Lic}
                                    inputMode='numeric'
                                    placeholder='Lic'
                                    placeholderTextColor={themeColors.textColor}
                                    onChangeText={(value) => handleChange('Lic', value)}
                                    onFocus={() => handleFocus('Lic')}
                                    onBlur={() => handleBlur('Lic')}
                                />
                                {focusedInput === 'Lic' ? (
                                    <TouchableOpacity onPress={() => inputRefs.current['Lic'].blur()}>
                                        <Ionicons name="checkmark-done" size={22} color={themeColors.mainTextColor} />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => focusInput('Lic')}>
                                        <Ionicons name="pencil-sharp" size={22} color={themeColors.mainTextColor} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                        <View className='my-2 flex-row items-center justify-between'>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { marginBottom: -4, color: themeColors.mainTextColor }]}>Store Name</Text>
                            <View className='flex-row'>
                                <TextInput
                                    ref={ref => inputRefs.current['name'] = ref}
                                    style={{ color: themeColors.mainTextColor }}
                                    className='font-black text-base underline mr-2 text-right'
                                    value={editingOutlet.name}
                                    placeholder='Store Name'
                                    placeholderTextColor={themeColors.textColor}
                                    onChangeText={(value) => handleChange('name', value)}
                                    onFocus={() => handleFocus('name')}
                                    onBlur={() => handleBlur('name')}
                                />
                                {focusedInput === 'name' ? (
                                    <TouchableOpacity onPress={() => inputRefs.current['name'].blur()}>
                                        <Ionicons name="checkmark-done" size={22} color={themeColors.mainTextColor} />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => focusInput('name')}>
                                        <Ionicons name="pencil-sharp" size={22} color={themeColors.mainTextColor} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                        <View className='my-2 flex-row items-center justify-between'>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { marginBottom: -4, color: themeColors.mainTextColor }]}>Location</Text>
                            <View className='flex-row'>
                                <TextInput
                                    ref={ref => inputRefs.current['location'] = ref}
                                    style={{ color: themeColors.mainTextColor }}
                                    className='font-black text-base underline mr-2 text-right'
                                    value={editingOutlet.location}
                                    placeholder='Location, Landmark'
                                    placeholderTextColor={themeColors.textColor}
                                    onChangeText={(value) => handleChange('location', value)}
                                    onFocus={() => handleFocus('location')}
                                    onBlur={() => handleBlur('location')}
                                />

                                {focusedInput === 'location' ? (
                                    <TouchableOpacity onPress={() => inputRefs.current['location'].blur()}>
                                        <Ionicons name="checkmark-done" size={22} color={themeColors.mainTextColor} />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => focusInput('location')}>
                                        <Ionicons name="pencil-sharp" size={22} color={themeColors.mainTextColor} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        <View className='my-2'>
                            <View className='flex-row justify-between'>
                                <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { marginBottom: -4, color: themeColors.mainTextColor }]}>
                                    Additional Details
                                </Text>
                                {focusedInput === 'details' ? (
                                    <TouchableOpacity onPress={() => inputRefs.current['details'].blur()}>
                                        <Ionicons name="checkmark-done" size={22} color={themeColors.mainTextColor} />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => focusInput('details')}>
                                        <Ionicons name="pencil-sharp" size={22} color={themeColors.mainTextColor} />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <TextInput
                                ref={ref => inputRefs.current['details'] = ref}
                                style={{ color: themeColors.mainTextColor, flex: 1 }}
                                className='font-black text-base underline mr-2'
                                value={editingOutlet.details}
                                onChangeText={(value) => handleChange('details', value)}
                                multiline={true}
                                placeholder={`Describe your store (e.g., products, specialties, atmosphere)`}
                                placeholderTextColor={themeColors.textColor}
                                // numberOfLines={4}
                                onFocus={() => handleFocus('details')}
                                onBlur={() => handleBlur('details')}
                            />


                        </View>
                        {/* <View className='my-2'>
                            <View className='flex-row justify-between'>
                                <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { marginBottom: -4, color: themeColors.mainTextColor }]}>
                                    Image (Optional)
                                </Text>
                                {focusedInput === 'image' ? (
                                    <TouchableOpacity onPress={() => inputRefs.current['image'].blur()}>
                                        <Ionicons name="checkmark-done" size={22} color={themeColors.mainTextColor} />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => focusInput('image')}>
                                        <Ionicons name="pencil-sharp" size={22} color={themeColors.mainTextColor} />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <TextInput
                                ref={ref => inputRefs.current['image'] = ref}
                                style={{ color: themeColors.mainTextColor, flex: 1 }}
                                className='font-black text-base underline mr-2'
                                value={editingOutlet.image}
                                onChangeText={(value) => handleChange('image', value)}
                                placeholder={`Enter Image URL (web link only, \n e.g., https://example.com/image.jpg)`}
                                placeholderTextColor={themeColors.textColor}
                                multiline={true}
                                // numberOfLines={3}
                                onFocus={() => handleFocus('image')}
                                onBlur={() => handleBlur('image')}
                            />
                        </View> */}
                    </View>
                </View>

                <View className='mt-3 rounded-xl'>
                    <View className='rounded-xl p-3 overflow-hidden' style={{ backgroundColor: themeColors.componentColor }}>
                        <View className='items-center flex-row mb-3'>
                            <View className='absolute z-0 -left-11 rounded-lg h-full w-10' style={{ backgroundColor: themeColors.diffrentColorOrange }} />
                            <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h3, { marginBottom: -4, color: themeColors.mainTextColor }]}> Operating Period</Text>
                        </View>

                        <View className='my-1 flex-row items-center justify-between'>
                            <View className='w-[43%]'>
                                <Text style={[fontstyles.h5, { marginBottom: 0, color: themeColors.mainTextColor }]} className=' mb-3'>Opening Time</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        Keyboard.dismiss();
                                        showDatePicker('openingTime');
                                    }}
                                >
                                    <TextInput
                                        className='rounded-md p-3'
                                        style={[fontstyles.number, { borderWidth: 1, borderColor: themeColors.mainTextColor, color: themeColors.mainTextColor }]}
                                        value={editingOutlet.openingTime}
                                        editable={false}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text style={[fontstyles.boldh2, { color: themeColors.mainTextColor }]} className='top-3'>to</Text>
                            <View className='w-[43%]'>
                                <Text style={[fontstyles.h5, { marginBottom: 0, color: themeColors.mainTextColor }]} className=' mb-1'>Closing Time</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        Keyboard.dismiss();
                                        showDatePicker('closingTime');
                                    }}
                                >
                                    <TextInput
                                        className='rounded-md p-3'
                                        style={[fontstyles.number, { borderWidth: 1, borderColor: themeColors.mainTextColor, color: themeColors.mainTextColor }]}
                                        value={editingOutlet.closingTime}
                                        editable={false}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className='my-1 flex-1'>
                            <Text numberOfLines={1} ellipsizeMode='tail' className='mb-6' style={[fontstyles.h5, { marginBottom: 0, color: themeColors.mainTextColor }]}>Leave Days</Text>


                            <TouchableOpacity
                                className='p-3 font-black flex-row items-center justify-between text-base rounded-md'
                                style={{ borderWidth: 1, borderColor: themeColors.mainTextColor, color: themeColors.mainTextColor }}
                                onPress={() => {
                                    Keyboard.dismiss();
                                    showDateSelector();
                                }}
                            >
                                <Text
                                    className='flex-row justify-between rounded-md'
                                    style={[fontstyles.number, { color: themeColors.mainTextColor }]}
                                >
                                    {editingOutlet.leaveDay}
                                </Text>
                                {editingOutlet.leaveDay !== 'None' &&
                                    <Ionicons
                                        onPress={() => handleChange('leaveDay', 'None')}
                                        name="close"
                                        size={20}
                                        color={themeColors.mainTextColor}
                                    />
                                }
                            </TouchableOpacity>
                        </View>

                        <View className='flex-row flex-wrap pt-3 justify-between'>
                            {weekDays.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleOffDaysToggle(item.label)}
                                    className='w-9 h-9 rounded-full items-center justify-center'
                                    style={{
                                        backgroundColor: editingOutlet.offDays.includes(item.label)
                                            ? themeColors.diffrentColorOrange
                                            : themeColors.backGroundColor
                                    }}
                                >
                                    <Text style={[fontstyles.h4, { color: themeColors.mainTextColor }]}>
                                        {item.value}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                <View className='mt-3 rounded-xl overflow-hidden'>
                    <View className='rounded-xl p-3 ' style={{ backgroundColor: themeColors.componentColor }}>
                        <View className='items-center flex-row mb-3'>
                            <View className='absolute -left-11 rounded-lg h-full w-10' style={{ backgroundColor: themeColors.diffrentColorOrange }} />
                            <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h3, { marginBottom: -4, color: themeColors.mainTextColor }]}> Your Cusines</Text>
                        </View>
                        <View className='my-1'>

                            <TouchableOpacity
                                className='p-3 font-black flex-row items-center justify-between text-base rounded-md'
                                style={{ borderWidth: 1, borderColor: themeColors.mainTextColor, color: themeColors.mainTextColor }}
                                onPress={() => {
                                    Keyboard.dismiss();
                                    handleDropdownPress();
                                }}
                            >
                                <Text
                                    className='flex-row justify-between rounded-md'
                                    style={[fontstyles.h5, { marginBottom: -4, color: themeColors.mainTextColor }]}
                                >
                                    {editingOutlet.menuType.length > 0 ? editingOutlet.menuType.join(', ') : 'Select Menu Type'}
                                </Text>
                                <Ionicons
                                    name={openDropdown ? "close" : "chevron-down"}
                                    size={20}
                                    color={themeColors.mainTextColor}
                                />
                            </TouchableOpacity>

                            {openDropdown && (
                                <View className='overflow-hidden font-black mt-2 text-base rounded-md' style={{ borderWidth: 1, borderColor: themeColors.mainTextColor, color: themeColors.mainTextColor }}>
                                    {menuTypes.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={{
                                                padding: 10,
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                overflow: 'hidden',
                                                // backgroundColor: storeDetailsOffDays.offDays.includes(item) ? themeColors.backGroundColor : 'transparent',
                                                // borderBottomWidth: 1,
                                                // borderBottomColor: '#ccc',
                                            }}

                                            onPress={() => {
                                                handleMenuTypeToggle(item);
                                                if (item === 'None') {
                                                    toggleDropdown(); // If not want to close on None
                                                }
                                            }}
                                        >
                                            <Text
                                                className=' overflow-hidden flex-row justify-between rounded-md'
                                                style={[fontstyles.h5, { color: editingOutlet.menuType.includes(item) ? themeColors.mainTextColor : themeColors.textColor }]}
                                            >{item}
                                            </Text>
                                            {editingOutlet.menuType.includes(item) && (
                                                <Ionicons name="checkmark-outline" size={20} color={themeColors.diffrentColorGreen} />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                    <TouchableOpacity
                                        style={styles.doneButton}
                                        onPress={toggleDropdown}
                                    >
                                        <Text style={[fontstyles.h5, { marginTop: -2, color: themeColors.mainTextColor }]}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </View>


                <View className='mt-3 rounded-xl overflow-hidden'>
                    <View className='rounded-xl p-3 ' style={{ backgroundColor: themeColors.componentColor }}>
                        <View className='items-center flex-row mb-3'>
                            <View className='absolute -left-11 rounded-lg h-full w-10' style={{ backgroundColor: themeColors.diffrentColorOrange }} />
                            <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h3, { marginBottom: -4, color: themeColors.mainTextColor }]}> Share Images</Text>
                        </View>
                        <View className='my-1'>
                            {/* Description Text */}
                            <Text style={[fontstyles.h6, { lineHeight: 20, fontSize: 18, color: themeColors.mainTextColor, marginBottom: 10 }]}>
                                To help us integrate your outlet into our platform, please send images of your menu items and outlet. Click the button below to share the images with us via email.
                            </Text>

                            {/* Button for Email */}
                            <TouchableOpacity
                            className=' p-3 items-center rounded-md'
                                onPress={() => {
                                    const email = 'vipulapatil21@gmail.com';  // Replace with actual email
                                    const subject = 'Images of Outlet and Menu';
                                    const body = 'Hi, please add this images of outlet and menu to our outlet: ';
                                    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                                    Linking.openURL(url);
                                }}
                                style={{backgroundColor: themeColors.diffrentColorPerpleBG}}  // Customize button color
                            >
                                <Text className=' -mt-2' style={[fontstyles.h1, {fontSize: 20}]}>Share Images</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="time"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />

                <DateTimePickerModal
                    isVisible={isDateSelectorVisible}
                    mode="date"
                    onConfirm={handleDateConfirm}
                    onCancel={hideDateSelector}
                />


                <TouchableOpacity onPress={handleSaveOutlet} style={{ backgroundColor: themeColors.diffrentColorOrange }} className='my-3 rounded-xl overflow-hidden'>
                    {/* <ImageBackground
                        source={{
                            uri: editingOutlet.image,
                            method: 'POST',
                            headers: {
                                Pragma: 'no-cache',
                            },
                        }}
                        defaultSource={require('./../../assets/store.jpg')}
                        alt="Logo"
                    > */}
                    <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.0)' }} className='items-center justify-center p-3' >
                        <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.blackh2, { paddingBottom: 4, color: themeColors.mainTextColor }]}>SAVE</Text>
                    </View>
                    {/* </ImageBackground> */}
                </TouchableOpacity>
                {AlertWrapper()}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    // container: { flex: 1, padding: 20 },
    textInput: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 },
    // saveButton: { backgroundColor: 'blue', padding: 10, alignItems: 'center' },
    // saveButtonText: { color: 'white', fontWeight: 'bold' },
    doneButton: {
        padding: 10,
        backgroundColor: '#007BFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        margin: 10,
    },
    // doneButtonText: {
    //     color: '#fff',
    //     fontSize: 16,
    // },
});