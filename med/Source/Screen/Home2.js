import { View, Text, StatusBar, Platform, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Modal, TextInput, Alert, BackHandler } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext';
import { KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TextStyles from '../Style/TextStyles';
import Navbar from '../Components/Navbar';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useEffect } from 'react';
import { ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';
import useCustomAlert from '../Components/Alerthook';
import { fetchMessMenuData } from '../ScreensMessServices/helper/fetchMessMenuData';
import { GOOGLE_SCRIPT_GetDoctorData } from '../ScreensMedicalServices/api/api';

export default function Home2({ route }) {
    const { handleScroll } = route?.params;
    const { themeColors, toggleTheme } = useContext(ThemeContext);
    const navigation = useNavigation();
    const [imageUrl, setImageUrl] = useState("")
    const fontstyles = TextStyles();

    useEffect(() => {
        fetchMessMenuData(setMessMealData); // Fetch data when component mounts
    }, []);

    useEffect(() => {
        fetch(GOOGLE_SCRIPT_GetDoctorData)
            .then(response => response.json())
            .then(data => setDoctorData(data))
            .catch(error => console.error('Error fetching doctors:', error));
    }, []);

    const [modalVisible, setModalVisible] = useState(false);
    const [link, setLink] = useState('');
    const [storedLink, setStoredLink] = useState(null);
    const { showAlert, AlertWrapper } = useCustomAlert();

    const { fontsLoaded, userData, doctorData, setDoctorData, fontFamilies, setMessMealData } = useContext(GlobalStateContext);

    if (!fontFamilies) {
        return null;
    }

    const getGoogleDriveImageUrl = (driveUrl) => {
        if (!driveUrl || typeof driveUrl !== 'string') {
            // console.error('Invalid input: The drive URL must be a valid string.');
            return '';
        }

        // Extract the file ID from the Google Drive URL
        const match = driveUrl.match(/d\/(.*?)(\/|$)/);
        if (match && match[1]) {
            const fileId = match[1];
            // Return the direct URL for image
            return `https://drive.google.com/uc?export=view&id=${fileId}`;
        } else {
            console.error('Invalid Google Drive URL');
            return '';
        }
    };

    useEffect(() => {
        setImageUrl(getGoogleDriveImageUrl(storedLink))
    }, [storedLink])

    // Save the link to AsyncStorage
    const saveLink = async () => {
        if (!link) {
            Alert.alert('Error', 'Please provide a valid Google Drive link.');
            return;
        }
        try {
            await AsyncStorage.setItem('googleDriveLink', link);
            setStoredLink(link);
            setModalVisible(false); // Close the modal after saving the link
            Alert.alert('Success', 'Your link has been saved.');
        } catch (error) {
            console.error('Failed to save the link', error);
        }
    };

    // Load saved link on mount
    useEffect(() => {
        const loadLink = async () => {
            try {
                const savedLink = await AsyncStorage.getItem('googleDriveLink');
                if (savedLink !== null) {
                    setStoredLink(savedLink);
                }
            } catch (error) {
                console.error('Failed to load the saved link', error);
            }
        };

        loadLink();
    }, []);

    const handleLinkChange = (newLink) => {
        setLink(newLink);
    };

    const options = [
        {
            id: 1,
            label: 'Bus & Schedule',
            icon: 'bus-outline',
            route: null, // Add navigation route if needed
            giveWidth: 'w-[70px]',
            onPress: () => { } // Add specific onPress function for this item

        },
        {
            id: 2,
            label: 'Healthcare & Appointment',
            icon: 'medkit-outline',
            route: 'MedicalUserNavigationStack', // Add specific route for this item
            giveWidth: 'w-[85px]',
            onPress: (navigation) => navigation.navigate('MedicalUserNavigationStack')
            // onPress={() => Linking.openURL('https://hcrs.iitgn.ac.in/slotbooking/')} 

        },
        {
            id: 3,
            label: 'Dinning & Reservation',
            icon: 'restaurant-outline',
            route: 'MessUserNavigationStack', // Add specific route for this item
            giveWidth: 'w-[75px]',
            onPress: (navigation) => navigation.navigate('MessUserNavigationStack')
        },
        {
            id: 4,
            label: 'Outlet & Order',
            icon: 'storefront-outline',
            route: 'OutletUserNavigationStack', // Add specific route for this item
            giveWidth: 'w-[70px]',
            onPress: (navigation, handleScroll) => navigation.navigate('OutletUserNavigationStack', { handleScroll })
        }
    ];

    const tools = [
      { label: "Bus & Schedule", icon: "bus-outline", onPress: () => Linking.openURL('https://campus.iitgn.ac.in/facility/document/Bus_Schedule_01-01-2025.pdf')},
      { label: "Laundry & Schedule", icon: "logo-ionic", onPress: () => Linking.openURL('https://campus.iitgn.ac.in/facility/#f10') },
      { label: "Maintenance", icon: "construct-outline", onPress: () => Linking.openURL('http://maintenance.iitgn.ac.in') },
      { label: "Outlet & Order", icon: "storefront-outline", onPress: () => Linking.openURL('https://campus.iitgn.ac.in/facility/#f7') },
      { label: "Healthcare & Appointment", icon: "medkit-outline", onPress: () => Linking.openURL('https://hcrs.iitgn.ac.in/slotbooking/')},
    ];

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1, backgroundColor: '#yourPreferredColor' }}
        >
            <ScrollView>
                <View className={`bodyContainer w-full flex`} style={{ backgroundColor: themeColors.subbackGroundColor }}>
                    <StatusBar
                        barStyle={themeColors.backGroundColor == "#1C1C1E" ? 'light-content' : 'dark-content'}
                        backgroundColor={themeColors.backGroundColor}
                    />
                </View>

                <View style={[styles.verticalScrollContainer, { backgroundColor: themeColors.backGroundColor }]}>

                    <Navbar />

                    <View className=' pt-8 justify-center'>
                        <View className='px-4 mb-1 flex items-start justify-center'>
                            {/* TextStyles.TextStyles.h1,  */}
                            {/* {console.log(height)} */}
                            <Text style={[fontstyles.entryUpper, { color: themeColors.mainTextColor }]}>Everything you need, </Text>
                            <View className='flex-row'>
                                <Text style={[fontstyles.h1, { color: themeColors.mainTextColor }]}>all in </Text>
                                <Text style={[fontstyles.h1, { color: themeColors.diffrentColorOrange }]}>one place!</Text>
                            </View>
                        </View>
                    </View>

                    <View className=' px-3'>
                        {/* <View className=' w-full items-center'>
                        <View style={{ backgroundColor: themeColors.textColor }} className='h-[5px] mt-2 rounded-full w-10 overflow-hidden' />
                    </View> */}

                        {/* <View style={{ backgroundColor: themeColors.componentColor }} className=' h-32 mt-4 rounded-lg'></View> */}
                        <View className='mt-4'>
                            <View className='bg-white h-[210px] w-[335px] rounded-xl self-center overflow-hidden'>
                                {imageUrl == '' ?
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(true)}
                                    >
                                        <ImageBackground
                                            source={require('./../../assets/IDblur.png')}
                                            defaultSource={require('./../../assets/IDblur.png')}
                                            className='h-full w-full'
                                            alt="Logo"
                                            resizeMode='cover'
                                        >
                                        </ImageBackground>
                                    </TouchableOpacity>
                                    :
                                    <Image
                                        source={{ uri: imageUrl }}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                }
                            </View>
                        </View>

                        <View style={{ backgroundColor: themeColors.componentColor }} className=' mt-3 mb-4 py-2 px-3 rounded-lg flex-row'>
                            <Text style={[fontstyles.h5_5, { color: themeColors.mainTextColor }]} className='-mt-[2px] w-[47%]'>{userData.name}</Text>
                            <Text style={{ color: themeColors.secComponentColor }} className=' mr-2'>|</Text>
                            <Text style={[fontstyles.h5_5, { color: themeColors.mainTextColor }]} className=' -mt-[2px]' >{userData.contactinfo}</Text>
                        </View>

                        {/* <View style={{ backgroundColor: themeColors.secComponentColor }} className=' h-12 mt-4 rounded-lg'></View> */}

                        <View className='pt-5 w-full flex-row justify-between'>
                            {options.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => item.onPress(navigation, item.handleScroll)}
                                    className={`${item.giveWidth} items-center`}
                                >
                                    <View
                                        style={{ backgroundColor: themeColors.diffrentColorPerple, borderRadius: 23 }}
                                        className='w-[57px] h-[57px] items-center justify-center'
                                    >
                                        <Ionicons color={'white'} name={item.icon} size={28} />
                                    </View>
                                    <Text
                                        className='mt-2 flex-wrap pt-2 text-center'
                                        style={[fontstyles.h5_5, { lineHeight: 14, color: themeColors.mainTextColor }]}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                    </View>

                    <View style={{ backgroundColor: themeColors.componentColor }} className='mt-5 py-3 px-4 flex-row justify-between'>
                        <TouchableOpacity style={{ backgroundColor: themeColors.backGroundColor }} className=' w-[47.5%] rounded-lg items-center flex-row py-2 px-3'>
                            <Ionicons color={themeColors.mainTextColor} name={'bus'} size={26} />
                            <View>
                                <Text className='pt-2 mt-1 ml-2 flex-wrap' style={[fontstyles.h5, { lineHeight: 14, color: themeColors.mainTextColor }]}>Bus &</Text>
                                <Text className='pt-2 mt-1 ml-2 flex-wrap' style={[fontstyles.h5, { lineHeight: 14, color: themeColors.mainTextColor }]}>Schedule</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: themeColors.backGroundColor }} className=' w-[47.5%] rounded-lg items-center flex-row py-2 px-3'>
                            <Ionicons color={themeColors.mainTextColor} name={'car-sport'} size={26} />
                            <View>
                                <Text className='pt-2 mt-1 ml-2 flex-wrap' style={[fontstyles.h5, { lineHeight: 14, color: themeColors.mainTextColor }]}>Bing</Text>
                                <Text className='pt-2 mt-1 ml-2 flex-wrap' style={[fontstyles.h5, { lineHeight: 14, color: themeColors.mainTextColor }]}>Bang</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View className="py-3 px-3">
                        <Text style={[fontstyles.h5_bold, { color: themeColors.mainTextColor }]} className='uppercase'>
                            Free Tools
                        </Text>

                        <View className="flex-row flex-wrap gap-3 mt-2 justify-between">
                            {tools.map((tool, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={tool.onPress}
                                    // onPress={() => navigation.navigate('OutletUserNavigationStack', { handleScroll: handleScroll })}
                                    className="w-[20%] items-center" // Each tool takes 1/4th of the width
                                >
                                    <View style={{ backgroundColor: themeColors.diffrentColorPerple, borderRadius: 23 }} className="w-[57px] h-[57px] items-center justify-center">
                                        <Ionicons color={'white'} name={tool.icon} size={28} />
                                    </View>
                                    <Text className="mt-2 flex-wrap pt-2 text-center" style={[fontstyles.h5_5, { lineHeight: 14, color: themeColors.mainTextColor }]}>
                                        {tool.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>


                    {/* <View style={{ backgroundColor: themeColors.componentColor }} className="mt-5 py-3 pl-3">
                        <Text style={[fontstyles.h5_bold, { color: themeColors.mainTextColor }]} className=' uppercase '>Free Tools</Text>

                        <ScrollView horizontal={true} scrollEnabled={true} showsHorizontalScrollIndicator={false} className="flex-row gap-3 mt-2">
                            {tools.map((tool, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={tool.onPress}
                                    // onPress={() => navigation.navigate('OutletUserNavigationStack', { handleScroll: handleScroll })}
                                    className={`w-[70px] items-center ${index == tools.length - 1 && 'mr-3'}`}
                                >
                                    <View style={{ backgroundColor: themeColors.diffrentColorPerple, borderRadius: 23 }} className="w-[57px] h-[57px] items-center justify-center">
                                        <Ionicons color={'white'} name={tool.icon} size={28} />
                                    </View>
                                    <Text className="mt-2 flex-wrap pt-2 text-center" style={[fontstyles.h5_5, { lineHeight: 14, color: themeColors.mainTextColor }]}>
                                        {tool.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View> */}

                    {/* <View style={{ backgroundColor: themeColors.backGroundColor }} className='py-3 px-3 flex-row justify-between'>
                        <View style={{ backgroundColor: themeColors.componentColor }} className=' w-[47.5%] rounded-lg items-center flex-row py-2 px-3'>
                            <Ionicons color={themeColors.mainTextColor} name={'heart'} size={26} />
                            <View>
                                <Text className='pt-2 mt-1 ml-2 flex-wrap' style={[fontstyles.h5, { lineHeight: 14, color: themeColors.mainTextColor }]}>Outlets</Text>
                                <Text className='pt-2 mt-1 ml-2 flex-wrap' style={[fontstyles.h5, { lineHeight: 14, color: themeColors.mainTextColor }]}>Liked Items</Text>
                            </View>
                        </View>
                        <View style={{ backgroundColor: themeColors.componentColor }} className=' w-[47.5%] rounded-lg items-center flex-row py-2 px-3'>
                            <Ionicons color={themeColors.mainTextColor} name={'bag-handle'} size={26} />
                            <View>
                                <Text className='pt-2 mt-1 ml-2 flex-wrap' style={[fontstyles.h5, { lineHeight: 14, color: themeColors.mainTextColor }]}>Ongoing</Text>
                                <Text className='pt-2 mt-1 ml-2 flex-wrap' style={[fontstyles.h5, { lineHeight: 14, color: themeColors.mainTextColor }]}>Orders</Text>
                            </View>
                        </View>
                    </View> */}
                </View>

                {/* <View className='mb-5 '>
                    <View className='bg-white h-[210px] w-[340px] rounded-xl self-center overflow-hidden'>
                        {imageUrl == '' ?
                            <TouchableOpacity
                                onPress={() => setModalVisible(true)}
                            >
                                <ImageBackground
                                    source={require('./../../assets/IDblur.png')}
                                    defaultSource={require('./../../assets/IDblur.png')}
                                    className='h-full w-full'
                                    alt="Logo"
                                    resizeMode='cover'
                                >
                                </ImageBackground>
                            </TouchableOpacity>
                            :
                            <Image
                                source={{ uri: imageUrl }}
                                style={{ width: '100%', height: '100%' }}
                            />
                        }
                    </View>
                </View> */}

                {AlertWrapper()}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)} // Close modal if back button is pressed
                >
                    <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        style={styles.modalBackground}>
                        <View style={{ backgroundColor: themeColors.subbackGroundColor }} className=' p-4 rounded-xl'>
                            <Text style={[fontstyles.boldh2, { color: themeColors.mainTextColor }]} className=' text-center'>Google Drive Link Instructions</Text>

                            <Text style={[fontstyles.h7, { lineHeight: 14, color: themeColors.mainTextColor }]} className=' mt-2 pt-3'>
                                Please follow the steps below to get the shareable link:
                            </Text>
                            <Text style={[fontstyles.h6, { lineHeight: 14, color: themeColors.textColor }]} className=' pt-2'>
                                1. Go to your Google Drive and find your ID card image.
                                {'\n'}2. Click the 3 dots next to the image and select "Share".
                                {'\n'}3. Ensure "Anyone with the link" option is selected.
                                {'\n'}4. Click "Copy Link".
                                {'\n'}5. Paste the link below.
                            </Text>

                            <Text className=' my-3 pt-2' style={[fontstyles.h6, { lineHeight: 14, color: themeColors.diffrentColorRed }]}>
                                Note: This link is stored in your device's local storage (AsyncStorage) and is completely safe to share here. Your data will not be shared externally, and if you log out, you will need to provide the link again.
                            </Text>

                            <TextInput
                                className=' border-2 mt-3'
                                style={[{ borderColor: themeColors.textColor, color: themeColors.mainTextColor }]}
                                multiline
                                placeholderTextColor={themeColors.mainTextColor}
                                value={link}
                                onChangeText={handleLinkChange}
                                placeholder="Paste Google Drive image link here"
                            />

                            <View className=' flex-row justify-between mt-3'>
                                <TouchableOpacity
                                    className=' w-[43%] items-center justify-center p-2 rounded-lg'
                                    style={[fontstyles.h5_bold, { backgroundColor: themeColors.diffrentColorOrange }]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={[fontstyles.h5_bold, { color: 'white' }]}>Close</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className=' w-[43%] items-center justify-center p-3 rounded-lg'
                                    style={[fontstyles.h5_bold, { backgroundColor: themeColors.diffrentColorGreen }]}
                                    onPress={saveLink}
                                >
                                    <Text style={[fontstyles.h5_bold, { color: 'white' }]}>Save</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </TouchableOpacity>
                </Modal>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    savedLink: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    modalBackground: {
        padding: 8,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay background
    },
    verticalScrollContainer: {
        // marginTop: Dimensions.get('window').height * 0.1,
        // minHeight: Dimensions.get('window').height * 3,
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        flex: 1,
        // backgroundColor: 'white',
    },
});