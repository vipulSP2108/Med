import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, Image, FlatList, TouchableOpacity, Dimensions, ScrollView, Animated, BackHandler, Alert, StatusBar, KeyboardAvoidingView, Platform, NativeModules, DevSettings } from 'react-native';
import { useFocusEffect, useNavigation, useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import SlideContainor from "../Components/SlideContainor";
// import { mockCampusMenu } from "../Data/mockCampusMenu";
import PopularMenuContainor from "../Components/PopularMenuContainor";
import Titles from "../Components/Titles";
import Colors from "../Components/Colors";
import TruncatedTextComponent from "../Components/TruncatedTextComponent";
// import PopUpLang from "../Components/PopUpLang";
import SearchBox from "../Components/SearchBox";
import { LinearGradient } from 'expo-linear-gradient';
import { FirstStoreComponent } from '../Components/CartMainContainor';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import ModelScreen from './ModelScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, USERSDATA_ENDPOINT } from '../Constants/Constants';
import Model from './Model';
import Like from './Like';
import { avalableLanguages } from '../Data/avalableLanguages';
import LangContent from '../Components/RenderLangContent';
import UpModelScreen from './UpModelScreen';
import { ListCard_Self2, ListCard_Z } from '../Components/ListCards';
import Size from '../Components/Size';
import TextStyles from '../Style/TextStyles';
import { SafeAreaView } from 'react-native';
import useShopStatus from '../Components/useShopStatus';
import useCustomAlert from '../Components/Alerthook';
import { ThemeContext } from '../Context/ThemeContext';

const { height } = Dimensions.get('window');
const BANNER_H = height * 0.84;

const OutletHomeScreen = () => {
  // {route} const { handleScroll } = route.params;

  // const { Openmodal, setOpenmodal, renderModal } = PopUpLang(); /// Error Why
  const navigation = useNavigation();
  const { show, hide, RenderModel } = ModelScreen();
  const { show_UpModelScreen, hide_UpModelScreen, RenderModel_UpModelScreen } = UpModelScreen();
  const { themeColors, toggleTheme } = useContext(ThemeContext);
  const { segregatedDataList, setSegregatedDataList, fontFamilies, userData, outletsNEW, CartItems, cartItemsNEW, setCartItemsNEW, campusShops, setcampusShops, popularMenu, setPopularMenu } = useContext(GlobalStateContext);

  const { showAlert, AlertWrapper } = useCustomAlert();

  const scrollA = useRef(new Animated.Value(0)).current;
  // const [campusShops, setcampusShops] = useState([]);
  const [campusMenu, setcampusMenu] = useState([]);

  const [type, settype] = useState('');

  const flatListRef = useRef(null);

  const navToPage = (page) => {
    navigation.navigate(page);
  };


  //  useFocusEffect(
  //     React.useCallback(() => {
  //       BackHandler.addEventListener('hardwareBackPress', () => navigation.navigate('HomeScreen'))

  //       return () => {
  //         BackHandler.removeEventListener('hardwareBackPress', () => navigation.navigate('HomeScreen'))
  //       }
  //     }, [])
  //   );

  useEffect(() => {
    fetchFeatures();
    
  }, []);

  // const getData = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem("token");
  //     console.log(token)
  //     // http://192.168.1.3:5001/userdata
  //     const response = await fetch(`${API_BASE_URL}:${USERSDATA_ENDPOINT}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ token: token })
  //     });

  //     if (!response.ok) {
  //       throw new Error('Network response was not ok ' + response.statusText);
  //     }

  //     const data = await response.json();
  //     console.log("/userdata in Home", data.data)
  //     if (data.data == 'token expired') {
  //       showAlert({
  //         title: "Session Expired",
  //         message: "Your session has expired. Please log in again to continue.",
  //         codeMassage: { code: '401', text: '⏳Time’s up! Please log back in.' },
  //         buttons: [
  //           { icon: 'open', text: "Login Back", onPress: () => navigation.navigate('LoginNavigationStack'), styleColor: themeColors.diffrentColorGreen }
  //         ],
  //         additional: [
  //           { head: "Login Back", head2: "navigate:LoginNavigationStack" }
  //         ]
  //       });
  //     }
  //     setUserData(data.data)
  //   } catch (error) {
  //     showAlert({
  //       title: "Oops! Something Went Wrong",
  //       message: "There was an issue fetching the data. Please try again.",
  //       codeMassage: { code: '500', text: '⚡ Error fetching data. Hang tight!' },
  //       buttons: [
  //         {
  //           icon: 'refresh-circle',
  //           text: "Refresh app",
  //           onPress: () => {
  //             DevSettings.reload()
  //             console.log("Refreshing app...");
  //           },
  //           styleColor: themeColors.diffrentColorGreen
  //         }
  //       ],
  //       additional: [
  //         { head: "Refresh app", head2: "Refresh app" }
  //       ]
  //     });
  //     console.error('Error fetching data:', error);
  //   }
  // };
  // useEffect(() => {
  //   getData();
  // }, []);

  if (!fontFamilies) {
    return null;
  }

  const fetchFeatures = async () => {
    setcampusMenu(segregatedDataList)
  };

  const featuredData = outletsNEW ? outletsNEW.filter(item => item.featured === true) : [];

  useEffect(() => {
    if (outletsNEW) {
      const popularmenu = outletsNEW.map(outlet => ({
        name: outlet.name,
        items: outlet.menu.flatMap((menuItem, categoryIndex) =>
          menuItem.items.filter(item => item.featured === true)
            .map(item => ({
              item: item.item,
              price: item.price,
              image: item.image,
              category: menuItem.title,
              categoryIndex: categoryIndex
            }))
        )
      }));

      const flattenedMenu = popularmenu.flatMap(outlet =>
        outlet.items.map(item => ({
          item: item.item,
          image: item.image,
          price: item.price,
          storeName: outlet.name,
          category: item.category,
          categoryIndex: item.categoryIndex
        }))
      );

      setPopularMenu(flattenedMenu);
    }
  }, [outletsNEW]);


  const viewabilityMenuConfig = {
    itemVisiblePercentThreshold: 50
  };

  const fontstyles = TextStyles();

  const [height, setHeight] = useState(null);

  const handleLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setHeight(height);
  };

  const sortedOutlets = outletsNEW.map(item => {
    const Shopstatus = useShopStatus(item.openingTime, item.closingTime, item.offDays, item.leaveDay);
    return { ...item, shopStatus: Shopstatus.state };
  }).sort((a, b) => {
    // Sort by shop status, you can customize this logic if needed
    const statusOrder = ['open', 'closingSoon', 'openingSoon', 'closed'];
    return statusOrder.indexOf(a.shopStatus) - statusOrder.indexOf(b.shopStatus);
  });

  const renderItem = ({ item, index }) => (
    <View key={`${index}_${item.id}`} style={item.shopStatus.includes('closed') ? styles.grayscale : null}>
      <ListCard_Self2
        themeColors={themeColors}
        item={item}
        index={index}
        shopStatus={item.shopStatus}
      />
    </View>
  );

  const scrollHandleres = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollA } } }],
    { useNativeDriver: true }
  );

  return (
    // <KeyboardAvoidingView
    //               behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    //               style={{ flex: 1, backgroundColor: '#yourPreferredColor' }}
    //           >
    <SafeAreaView>

      <StatusBar
        barStyle={themeColors.backGroundColor == "#1C1C1E" ? 'light-content' : 'dark-content'}
        // backgroundColor={'black'} 
        backgroundColor={themeColors.statusBarColor}
      />

      <View className={`bodyContainer w-full flex`} style={{ backgroundColor: themeColors.secComponentColor }}>
        <LinearGradient
          // Button Linear Gradient
          colors={[themeColors.subbackGroundColor, themeColors.subbackGroundColor, themeColors.backGroundColor, themeColors.secComponentColor, themeColors.secComponentColor]} className='bodyBGContainer absolute w-full rounded-b-lg' style={{ height: Dimensions.get('window').height * 0.64, backgroundColor: themeColors.componentColor }} />
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          // onScroll={handleScroll}
          onScroll={
            Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollA } } }],
              { useNativeDriver: true }
            )
          }
          scrollEventTxhrottle={16}
          keyboardDismissMode='on-drag'
        >
          <View className='staticContainer align-middle flex w-1/2' >
            <Animated.View style={[styles.banner(scrollA)]}>
              {/* mt-7 // marginextra */}
              <View className='searchBodyContainer flex-row justify-between pt-2' style={{ marginHorizontal: Dimensions.get('window').width * 0.03 }}>
                <TouchableOpacity activeOpacity={1} onPress={() => navToPage('SelectAddress')} className='address flex-row gap-2 items-center w-9/12'>
                  <View>
                    <Ionicons color={themeColors.diffrentColorOrange} name="earth" size={30} className='searchIcon' style={{ textAlign: 'center', textAlignVertical: 'center', marginTop: 7 }} />
                  </View>
                  <View>
                    <View className=' flex-row'>
                      {/* {console.log(userData.name)} */}
                      <Text ellipsizeMode='tail' style={[fontstyles.blackh2, { color: themeColors.mainTextColor }]}>{userData.name ? TruncatedTextComponent(userData.name, 15) : "UserName"} </Text>
                      <Ionicons color={themeColors.mainTextColor} name="chevron-down" size={24} style={{ textAlign: 'center', textAlignVertical: 'bottom', top: 3 }} />
                    </View>
                    {/* <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h4, { color: themeColors.textColor }]}>{userData.name ? 'you are a ' + userData.role : "UserRole"}</Text> */}
                  </View>
                  {/* {console.log(height)} */}
                </TouchableOpacity>
                <View className='address flex-row gap-2 items-center'>
                  {/* <TouchableOpacity onPress={() => { settype('lang'), show() }} style={{ backgroundColor: themeColors.secComponentColor, borderRadius: 10, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons color={themeColors.textColor} name="language" size={24} />
                  </TouchableOpacity> */}
                  <TouchableOpacity onPress={() => navigation.navigate('Profile', { userData })} style={{ backgroundColor: themeColors.mainTextColor, borderRadius: 10, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons color={themeColors.diffrentColorPerple} activeOpacity={1} name="person" size={24} />
                  </TouchableOpacity>
                </View>
              </View>



              <View className=' flex-1 justify-center'>
                <View onLayout={handleLayout} style={{}} className='px-4 mb-1 flex items-start justify-center'>
                  {/* TextStyles.TextStyles.h1,  */}
                  {/* {console.log(height)} */}
                  <Text style={[fontstyles.entryUpper, { color: themeColors.mainTextColor }]}>Discover the </Text>
                  <View className='flex-row'>
                    <Text style={[fontstyles.h1, { color: themeColors.diffrentColorOrange }]}>Best Meal </Text>
                    <Text style={[fontstyles.h1, { color: themeColors.mainTextColor }]}>for you</Text>
                  </View>
                </View>

                <View style={{ height: Dimensions.get('window').height * 0.07 }} className='searchBodyContainer mt-5 flex-row justify-between mx-3'>
                  <TouchableOpacity className=' flex-1' onPress={() => show_UpModelScreen()}>
                    <SearchBox />
                  </TouchableOpacity>
                  <TouchableOpacity className=' ml-3' style={{ backgroundColor: themeColors.secComponentColor, borderRadius: 15, width: Dimensions.get('window').height * 0.07, height: Dimensions.get('window').height * 0.07, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() =>
                      navigation.navigate('MessUserNavigationStack')
                    }
                  >
                    <Ionicons color={themeColors.diffrentColorOrange} name="mic" size={24} className='searchIcon' />
                  </TouchableOpacity>
                </View>

                {/* <Popular flatListRef={flatListRef} data={featuredData} viewabilityConfig={viewabilityMenuConfig} /> */}
                <View className='mt-4' style={{ height: Dimensions.get('window').height * 0.20 }}>
                  {outletsNEW.length > 0 &&
                    <SlideContainor flatListRef={flatListRef} data={featuredData} viewabilityConfig={viewabilityMenuConfig} />
                  }
                </View>

                <View className='mx-4 pt-3 overflow-hidden' >
                  <Titles title={"What’s on your heart?"} width={30} />
                </View>

                <View style={{ height: Dimensions.get('window').height * 0.22 }} >
                  <PopularMenuContainor data={popularMenu} />
                </View>
              </View>

            </Animated.View>
          </View>

          <View style={[styles.verticalScrollContainer, { backgroundColor: themeColors.backGroundColor }]}>
            <View>
              <View className='mx-4 pt-6 overflow-hidden' style={{ height: Dimensions.get('window').height * 0.08 }}>
                <Titles title={"All Restaurants"} width={60} />
              </View>

              {/* <View style={styles.renderItem2container}>
              <View>
                <FlatList
                  data={campusShops}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}
                  columnWrapperStyle={{
                    justifyContent: 'space-around'
                  }}
                  renderItem={({ item }) => <ListCard_S item={item} />}
                  keyExtractor={(item, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </View> */}

              {/* <FlatList
                data={outletsNEW}
                renderItem={({ item, index }) => <ListCard_Self2 themeColors={themeColors} item={item} index={index} />} // ListCard_O && ListCard_Z
                keyExtractor={(item, index) => `${index}_${item.id}`}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              /> */}
              <FlatList
                data={sortedOutlets}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
              />

              <View className=' items-center justify-center' style={{ height: Dimensions.get('window').height * 0.12 }}>
                <Text
                  style={[fontstyles.boldh2, { color: themeColors.mainTextColor }]}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >
                  Exciting Updates Coming Soon!
                </Text>
                <Text
                  className=' text-center'
                  style={[fontstyles.h4, { color: themeColors.textColor }]}
                  numberOfLines={3}
                  ellipsizeMode='tail'
                >
                  We're working on bringing you fresh
                  choices.
                </Text>
              </View>
            </View>

          </View>

        </Animated.ScrollView>

        <View>
          {(!cartItemsNEW || cartItemsNEW.length === 0 || !cartItemsNEW[cartItemsNEW.length - 1]) ?
            null
            :
            <LinearGradient
              className=' absolute p-2 w-full bottom-0'
              colors={['transparent', themeColors.backGroundColor, themeColors.backGroundColor]}>
              <FirstStoreComponent fontstyles={fontstyles} updatedCartWithDetails={cartItemsNEW} Modelshow={show} settype={settype} />
            </LinearGradient>
          }
        </View>
        {AlertWrapper()}
        {RenderModel({ type: { type } })}
        {RenderModel_UpModelScreen()}
      </View>

    </SafeAreaView>
    // </KeyboardAvoidingView>
  );
};

const styles = {
  grayscale: {
    filter: 'grayscale(100%)',  // For web CSS approach
    // On React Native, you might need an image filter library or use a more creative workaround.
  },
  line: {
    width: 60,
    height: 1,
    backgroundColor: '#D1D5DB', // Equivalent to bg-gray-200
  },

  bodyContainer: {
    flex: 1,
    backgroundColor: "black" // bg color
  },
  bodyBGContainer: {
    position: 'absolute',
    height: Dimensions.get('window').height * 0.3,
    width: "100%",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: "white", // bg color
  },

  staticContainer: {
    // height: Dimensions.get('window').height * 0.67,
    // marginTop: -1000,
    // paddingTop: 1000,
    alignItems: 'center',
    overflow: 'hidden',
    flex: 1,
    position: 'absolute',
  },

  // searchInputTxt: {
  //   width: '73%',
  //   height: '100%',
  //   // padding: 14,
  //   paddingLeft: 14,
  //   textAlignVertical: 'center',
  //   fontSize: 16, // font size
  //   backgroundColor: '#e2c625', // bg color
  //   borderRadius: 14,
  // },
  searchIcon: {
    height: '100%',
    width: '20%',
    // padding: 14,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#e2c625', // bg color
    borderRadius: 14,
  },

  verticalScrollContainer: {
    // marginTop: Dimensions.get('window').height * 0.1,
    // minHeight: Dimensions.get('window').height * 3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    // backgroundColor: 'white',
    // backgroundColor: Colors.dark.colors.backGroundColor, // bg color
  },
  content: {
    color: '#006769',
    alignItems: 'center',
    justifyContent: 'center',
  },



  // Common Styling
  // button: {
  //   borderRadius: 8,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   width: 70,
  //   paddingVertical: 8, // Adjust padding instead of fixed height
  //   // paddingHorizontal: 10, // Add padding for horizontal space
  //   backgroundColor: '#114232',
  // },
  // buttonTxt: {
  //   color: '#F7F6BB',
  //   textAlign: 'center',
  //   fontSize: 14,
  //   fontWeight: '500',
  // },
  // NormalTxt: {
  //   color: "#FCDC2A",
  //   fontWeight: '500',
  //   fontSize: 14,
  // },
  // BoldTxt: {
  //   fontWeight: '700',
  //   marginBottom: 8,
  //   fontSize: 16,
  //   color: "#F7F6BB",
  // },
  // text: {
  //   margin: 24,
  //   fontSize: 58,
  // },
  // button: {
  //   borderRadius: 8,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   width: '100%',
  //   height: '30%',
  //   paddingVertical: 8, // Adjust padding instead of fixed height
  //   // paddingHorizontal: 10, // Add padding for horizontal space
  //   backgroundColor: '#114232',
  // },
  // buttonTxt: {
  //   color: '#F7F6BB',
  //   textAlign: 'center',
  //   fontSize: 14,
  //   fontWeight: '500',
  // },
  banner: scrollA => ({
    height: BANNER_H,
    backGroundColor: 'red',
    width: '200%',
    transform: [
      {
        translateY: scrollA.interpolate({
          inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H],
          outputRange: [-0, 0, BANNER_H * 0.99, -BANNER_H * 0.5], // Adjust to bring back into view
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
};

export default OutletHomeScreen;