const BANNER_H = Dimensions.get('window').height * 0.55;
const Gradient_H = Dimensions.get('window').height * 0.6;

import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList, Animated, Dimensions, ImageBackground, Image, BackHandler, KeyboardAvoidingView, Platform, Linking, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../Components/Colors'; // Adjust path as needed
import { API_BASE_URL, USERSDATA_ENDPOINT, ADDOUTLET_ENDPOINT, USEROUTLETS_ENDPOINT, ADDMENU_ENDPOINT } from '../Constants/Constants';
// import { ADDOUTLET_ENDPOINT, USEROUTLETS_ENDPOINT, API_BASE_URL // Adjust paths/constants
import { ListCard_Self2, ListCard_Z } from '../Components/ListCards';
import SearchBox from "../Components/SearchBox";
import ModelScreen from './ModelScreen';
import { fetchMessMenuData } from '../ScreensMessServices/helper/fetchMessMenuData';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Titles from '../Components/Titles';
import FoodIcon from '../Components/FoodIcon';
import FoodTypeIcon from '../Components/FoodTypeIcon';
import LongStarIcon from '../Components/LongStarIcon';
import { dropDown } from '../Components/dropDown';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
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
import Navbar from '../Components/Navbar';
import IDblur from './../../assets/IDblur.png';
import { Modal } from 'react-native';
import { GOOGLE_SCRIPT_GetDoctorData } from '../ScreensMedicalServices/api/api';
import * as ImagePicker from 'expo-image-picker';

export default function Home({ route }) {
  const { handleScroll } = route?.params;
  const { themeColors, toggleTheme } = useContext(ThemeContext);
  const [type, settype] = useState('');
  const { show, hide, RenderModel } = ModelScreen();
  const { fontsLoaded, userData, doctorData, setDoctorData, fontFamilies, setMessMealData } = useContext(GlobalStateContext);
  const { showAlert, AlertWrapper } = useCustomAlert();
  const navigation = useNavigation();

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

  useEffect(() => {
    fetchMessMenuData(setMessMealData); // Fetch data when component mounts
  }, []);

  useEffect(() => {
    fetch(GOOGLE_SCRIPT_GetDoctorData)
      .then(response => response.json())
      .then(data => setDoctorData(data))
      .catch(error => console.error('Error fetching doctors:', error));
  }, []);
  
  const [link, setLink] = useState('');
  const [storedLink, setStoredLink] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    if (storedLink?.includes("file:/")) {
      setImageUrl(storedLink)
    } else {
      setImageUrl(getGoogleDriveImageUrl(storedLink))
    }

  }, [storedLink])

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

  const uploadFromGallery = async () => {
    // Request permission to access the media library (photos)
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      // Alert the user if the permission is not granted
      Alert.alert(
        'Permission Required',
        'We need permission to access your photos to upload an image.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Launch image picker if permission is granted
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Limit to images
      allowsEditing: false, // You can set it to true if you want to allow editing
      aspect: [4, 3], // Aspect ratio for the picked image
      quality: 1, // High-quality image
    });

    if (!result.canceled) {
      // Handle the selected image
      console.log('image set from gallery'); // For example, log the image URI
      // Here you can upload the image URI to your server or AsyncStorage
      setLink(result.assets[0].uri); // Save the image URI to the state (or handle it accordingly)
    } else {
      console.log('Image selection canceled');
    }
  };

  const handleLinkChange = (newLink) => {
    setLink(newLink);
  };

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



              {/* <View className=' mb-5 mx-3 p-3 '>
            <View className=' bg-white h-[220px] w-[340px] rounded-xl self-center overflow-hidden '>
              <View className=' h-[25%] w-full bg-[#184BAA] items-end justify-center p-2'>

                <Text className=' text-white font-black text-sm'>Indian Institute Of Technology Gandhinagar</Text>
                <View className=' absolute h-[62px] w-[62px] p-[2px] rounded-full bg-white left-1 top-6 '>
                  <ImageBackground
                    source={{ uri: 'https://vipulsp2108.github.io/OutsIIT-/images/image4.png', method: 'POST', headers: { Pragma: 'no-cache' } }}
                    defaultSource={require('./../../assets/menu.jpg')}
                    className=' h-full w-full'
                    alt="Logo"
                    resizeMode='cover'
                  ></ImageBackground>
                </View>
              </View>
              <View className=' flex-1 w-full flex-row'>
                <View className=' w-[30%] items-end justify-center'>
                  <View className='bg-[#0A184C] h-[75px] w-[70px]' />
                </View>
                <View className=' h-full  justify-center p-4'>
                  <Text className=' font-medium'>Last Name Middle</Text>
                  <Text className=' font-medium'>Student Degree</Text>
                  <Text className=' font-medium'>Roll No: xxxxxxxx</Text>
                  <Text className=' font-medium'>Valid upto: DD-MM-YYYY</Text>
                </View>
                <View className='  absolute bottom-[60px] -right-16'>
                  <Text style={{transform: [{ rotate: '90deg' }]}} className=' w-40 text-2xl font-semibold text-[#184BAA]'>IITGN Student</Text>
                </View>
              </View>
            </View>
          </View> */}


              {/*  */}

              <View className='mb-5 mx-3 p-3'>
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
                    <TouchableOpacity
                      // onLongPress={}
                      onLongPress={() => setModalVisible(true)}
                    >
                      <Image
                        source={{ uri: imageUrl }}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </TouchableOpacity>
                  }
                </View>
              </View>
              {/* ---------------------- Added ---------------------- */}
            </Animated.View>
          </View>

          <View style={[styles.verticalScrollContainer, { backgroundColor: themeColors.backGroundColor }]}>

            <View className=' px-3'>
              <View className=' w-full items-center'>
                <View style={{ backgroundColor: themeColors.textColor }} className='h-[5px] mt-2 rounded-full w-10 overflow-hidden' />
              </View>

              {/* <View style={{ backgroundColor: themeColors.componentColor }} className=' h-32 mt-4 rounded-lg'></View> */}

              <View style={{ backgroundColor: themeColors.componentColor }} className=' mt-3 mb-4 py-2 px-3 rounded-lg flex-row'>
                <Text style={[fontstyles.h5_5, { color: themeColors.mainTextColor }]} className='-mt-[2px] w-[47%]'>{userData.name}</Text>
                <Text style={{ color: themeColors.secComponentColor }} className=' mr-2'>|</Text>
                <Text style={[fontstyles.h5_5, { color: themeColors.mainTextColor }]} className=' -mt-[2px]' >{userData.contactinfo}</Text>
              </View>
              {/* <View style={{ backgroundColor: themeColors.secComponentColor }} className=' h-12 mt-4 rounded-lg'></View> */}


              <View className=' pt-5 w-full flex-row justify-between'>

                <TouchableOpacity
                  onPress={() => navigation.navigate('LaundryUserNavigationStack')}
                  className=' w-[70px] items-center'
                >
                  <View style={{ backgroundColor: themeColors.diffrentColorPerple, borderRadius: 23 }} className=' w-[57px] h-[57px] items-center justify-center'>
                    <Ionicons color={'white'} name={'logo-ionic'} size={28} />
                  </View>
                  <Text className=' flex-wrap pt-2 text-center' style={[fontstyles.h5_5, { lineHeight: 14, color: themeColors.mainTextColor }]}>Laundry & Schedule</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('MedicalUserNavigationStack')}
                  // onPress={() => Linking.openURL('https://hcrs.iitgn.ac.in/slotbooking/')} 
                  className=' w-[85px] items-center'
                >
                  <View style={{ backgroundColor: themeColors.diffrentColorPerple, borderRadius: 23 }} className=' w-[57px] h-[57px] items-center justify-center'>
                    <Ionicons color={'white'} name={'medkit-outline'} size={28} />
                  </View>
                  <Text className=' flex-wrap pt-2 text-center' style={[fontstyles.h5_5, { lineHeight: 14, color: themeColors.mainTextColor }]}>Healthcare & Appointment</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('MessUserNavigationStack')}
                  className=' w-[75px] items-center'>
                  <View
                    style={{ backgroundColor: themeColors.diffrentColorPerple, borderRadius: 23 }} className=' w-[57px] h-[57px] items-center justify-center'>
                    <Ionicons color={'white'} name={'restaurant-outline'} size={28} />
                  </View>
                  <Text className=' flex-wrap pt-2 text-center' style={[fontstyles.h5_5, { lineHeight: 14, color: themeColors.mainTextColor }]}>Dinning & Reservation</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('OutletUserNavigationStack', { handleScroll: handleScroll })}
                  className=' w-[70px] items-center'>
                  <View style={{ backgroundColor: themeColors.diffrentColorPerple, borderRadius: 23 }} className=' w-[57px] h-[57px] items-center justify-center'>
                    <Ionicons color={'white'} name={'storefront-outline'} size={28} />
                  </View>
                  <Text className=' flex-wrap pt-2 text-center' style={[fontstyles.h5_5, { lineHeight: 14, color: themeColors.mainTextColor }]}>Outlet & Order</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ backgroundColor: themeColors.componentColor }} className='mt-5 py-3 px-4 flex-row justify-between mb-14'>
              <TouchableOpacity onPress={() => navigation.navigate('BusUserNavigationStack')} style={{ backgroundColor: themeColors.backGroundColor }} className=' w-[47.5%] rounded-lg items-center flex-row py-2 px-3'>
                <Ionicons color={themeColors.mainTextColor} name={'bus'} size={26} />
                <View>
                  <Text className='pt-2 mt-1 ml-2 flex-wrap' style={[fontstyles.h5, { lineHeight: 14, color: themeColors.mainTextColor }]}>Bus &</Text>
                  <Text className='pt-2 mt-1 ml-2 flex-wrap' style={[fontstyles.h5, { lineHeight: 14, color: themeColors.mainTextColor }]}>Schedule</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('SplitfareNavigationStack')}
                style={{ backgroundColor: themeColors.backGroundColor }} className=' w-[47.5%] rounded-lg items-center flex-row py-2 px-3'
              >
                <Ionicons color={themeColors.mainTextColor} name={'car-sport'} size={26} />
                <View>
                  <Text className='pt-2 mt-1 ml-2 flex-wrap' style={[fontstyles.h5, { lineHeight: 14, color: themeColors.mainTextColor }]}>Ride Fair</Text>
                  <Text className='pt-2 mt-1 ml-2 flex-wrap' style={[fontstyles.h5, { lineHeight: 14, color: themeColors.mainTextColor }]}>Splitter</Text>
                </View>
              </TouchableOpacity>
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


        <Modal
          // animationType="slide"
          // transparent={true}
          transparent
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)} // Close modal if back button is pressed
        >
          <View className='w-full h-full justify-center p-3' style={{backgroundColor: 'rgba(0, 0, 0, 0.5)',}}>
            <TouchableOpacity style={{  flex: 1}} onPress={() => setModalVisible(false)} />
            <View className=' absolute self-center' >
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

                <Text style={[fontstyles.boldh2, { color: themeColors.mainTextColor }]} className=' mt-3 text-center'>Or Upload from Gallery</Text>

                <Text style={[fontstyles.h7, { lineHeight: 14, color: themeColors.mainTextColor }]} className=' mt-2 pt-3'>
                  To upload an image from your gallery, please grant permission to access storage and select the image you'd like to upload
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

                <View className=' flex-row justify-between pt-5 gap-2'>
                  <TouchableOpacity
                    className=' flex-1 items-center justify-center p-2 rounded-lg'
                    style={[fontstyles.h5_bold, { backgroundColor: themeColors.diffrentColorOrange }]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={[fontstyles.h5_bold, { color: 'white' }]}>Close</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className=' flex-1  items-center justify-center p-3 rounded-lg'
                    style={[fontstyles.h5_bold, { backgroundColor: themeColors.diffrentColorPerple }]}
                    onPress={uploadFromGallery}
                  >
                    <Text style={[fontstyles.h5_bold, { color: 'white' }]}>Upload</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className=' flex-1 items-center justify-center p-3 rounded-lg'
                    style={[fontstyles.h5_bold, { backgroundColor: themeColors.diffrentColorGreen }]}
                    onPress={saveLink}
                  >
                    <Text style={[fontstyles.h5_bold, { color: 'white' }]}>Save</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </View>
        </Modal>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  savedLink: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  modalBackground: {
    padding: 8,
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay background
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    width: '80%',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  steps: {
    fontSize: 14,
    marginBottom: 20,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  safeNotice: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  closeButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },


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