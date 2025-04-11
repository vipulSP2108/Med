// setHistory(prevHistory => [...prevHistory, { itemWithoutName, items: restOfItems }]);
import { View, Text, TouchableOpacity, StatusBar, ImageBackground, StyleSheet, Dimensions, ScrollView, Platform, Button, Alert, Linking, RefreshControl } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import Colors from '../Components/Colors'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { LinearGradient } from "expo-linear-gradient";
import Icons from '../Components/Icons'
import { GlobalStateContext } from '../Context/GlobalStateContext'
import TextStyles from '../Style/TextStyles'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { API_BASE_URL, CHANGEORDERSTATUS_ENDPOINT, DECLINEORDER_ENDPOINT, ORDERSBUYER_ENDPOINT } from '../Constants/Constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import useCustomAlert from '../Components/Alerthook'
import ToastNotification from '../Components/ToastNotification'
import BounceText from '../Components/BounceText'
import { ThemeContext } from '../Context/ThemeContext'
import { ActivityIndicator } from 'react-native'

const ListCard_Self1 = ({ themeColors, index, showToast, setShowToast, showAlert, fontstyles, item, outletsNEW, fetchOrders, History, setHistory }) => {

  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const navToDetails = (item) => {
    navigation.navigate("Details", { Data: item });
  };
  const [showDetails, setShowDetails] = useState(null);

  const getRemainingTime = (startTime, timer) => {
    const targetTime = new Date(startTime).getTime() + timer * 60000; // startTime + timer in milliseconds
    const currentTime = new Date().getTime();
    const remainingTime = targetTime - currentTime;

    if (remainingTime <= 0) {
      return { minutes: 0, seconds: 0 };
    }

    const remainingMinutes = Math.floor(remainingTime / 60000);
    const remainingSeconds = Math.floor((remainingTime % 60000) / 1000);

    const remainingTime_inPersent = ((remainingMinutes * 60) / (timer * 60)) * 100

    return { minutes: remainingMinutes, seconds: remainingSeconds, persent: remainingTime_inPersent };
  };

  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const { minutes, seconds } = getRemainingTime(item.startTime, item.timer);
      setTimeLeft({ minutes, seconds });
    }, 1000);

    // Cleanup interval on unmount or when countdown reaches zero
    return () => clearInterval(interval);
  }, [item.startTime, item.timer]);

  useFocusEffect(
    useCallback(() => {
      // Reset animation values or state if needed
      setShowDetails(null);
    }, [])
  );

  const { minutes, seconds, persent } = getRemainingTime(item.startTime, item.timer); // Calculate the remaining time
  const persentBackgroundColor = persent;

  const declineOrder = async (orderId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}:${DECLINEORDER_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, userRole: 'Buyer' }),
      });

      const data = await response.json();
      if (data.status === 'ok') {
        fetchOrders();
      } else {
        fetchOrders();
        console.error('Error declining order:', data);
        showAlert({
          title: "Order Already Accepted",
          message: data.data || "The store has already accepted your order. Please contact them to check if cancellation is possible.",
          codeMassage: { code: '409', text: '📦 Too late! Try contacting the store.' },
        });
      }
    } catch (error) {
      console.error('Error declining order:', error);
      showAlert({
        title: "Server Issue",
        message: "We couldn’t decline the order due to a server issue. Please try again shortly.",
        codeMassage: { code: '503', text: '⚙️ Server’s taking a nap. Retry soon!' },
      });
    }
    setLoading(false);
  };

  // console.log(item)
  return (
    <Animated.View entering={FadeInDown.delay(index * 100).springify().damping(12)}>
      {/* <TouchableOpacity onPress={() => { navToDetails(outletsNEW.find(shop => shop.name === item.items.name)) }}> */}

      {loading &&
        <View style={{ backgroundColor: themeColors.backGroundColor, opacity: 0.90 }} className=' h-full w-full items-center justify-center absolute z-50 pb-8'>
          <ActivityIndicator size={70} color={themeColors.diffrentColorOrange} />
        </View>
      }

      <View className='flex-row drop-shadow-2xl rounded-xl overflow-hidden' style={[styles.foodItemCollectionContainer, { backgroundColor: themeColors.shadowcolor, elevation: 10, }]}>


        <LinearGradient
          start={{ x: 0.4, y: -0.1 }} end={{ x: 0.8, y: 0.9 }}
          colors={['transparent', themeColors.backGroundColor]}
          className=' -ml-1 flex-1 '
        >
          <TouchableOpacity onPress={() => { navToDetails(outletsNEW.find(shop => shop.name === item.items.name)) }}>

            <View className='px-3 py-2 flex-row items-center'>
              <View className=' w-2/5 h-32 rounded-xl overflow-hidden'>
                <ImageBackground
                  // source={require('./../Data/banner.jpg')}
                  source={item.items.image ?
                    { uri: item.items.image, method: 'POST', headers: { Pragma: 'no-cache' } } :
                    require('./../../assets/store.jpg')}
                  defaultSource={require('./../../assets/store.jpg')}
                  className=' w-full h-full mr-2'
                  alt="Logo"
                >
                  <LinearGradient
                    start={{ x: 0.0, y: 0.75 }} end={{ x: 0.3, y: 1.4 }}
                    className='overflow-hidden h-full w-full'
                    colors={['transparent', 'black']}
                  />
                  <View className='absolute bottom-2 right-2'>
                    <View className='flex-row justify-center items-center'>
                      <View className='flex-row justify-center items-center'>
                        {item.items.type === "PureVeg" && <Ionicons name="leaf" size={16} color={'#00ff00'} />}
                        <Text className='ml-1 text-gray-300' style={[fontstyles.h5]}>{item.items.type}</Text>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
                {/* {console.log(item.items)} */}
              </View>
              <View className=' ml-2'>
                <Text numberOfLines={1} ellipsizeMode='middle' style={[fontstyles.boldh2, { color: themeColors.mainTextColor }]}>
                  {item.items.name}
                </Text>
                <View className='flex-row items-center -mt-2' >
                  {/* <Text style={{ color: themeColors.textColor }} className='text-sm '>{item.storeDetails.type}</Text>
                <Ionicons style={{ marginTop: 4, paddingHorizontal: 4 }} name="ellipse" size={5} color={themeColors.textColor} /> */}
                  {/* <Text style={[fontstyles.boldh2, { color: themeColors.textColor }]}>{item.storeDetails.menutype}</Text> */}
                  {/* <Ionicons style={{ marginTop: 4, paddingHorizontal: 4 }} name="compass" size={21} color={themeColors.diffrentColorPerple} /> */}
                  <Text style={[fontstyles.h5, { color: themeColors.diffrentColorPerple }]}>{item.items.location}</Text>
                </View>
                <View className='flex-row py-2 mt-2'>
                  <View className=' px-4 rounded-md' style={{ backgroundColor: themeColors.subbackGroundColor, paddingVertical: 8, borderWidth: 0, borderColor: themeColors.diffrentColorOrange }}>
                    {/* <Text className='font-light text-base' style={{ color: themeColors.textColor }}> */}
                    <Text style={[fontstyles.number, { color: themeColors.mainTextColor }]}>
                      {item.items.orders.length} {item.items.orders.length > 1 ? 'items' : 'item'}
                    </Text>
                    {/* </Text> */}
                  </View>

                  <View className='flex-row ml-2 items-center'>
                    <Text style={[fontstyles.h5, { color: themeColors.diffrentColorOrange }]}>₹</Text>
                    <Text style={[fontstyles.h3, { color: themeColors.mainTextColor }]}> {item.totalPrice}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => setShowDetails(!showDetails)} className='  -mb-2 -mr-4 flex-row absolute w-1/3 h-[45%] right-0 bottom-0 items-end justify-end pb-4 pr-6'>
                {/* <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { color: themeColors.textColor }]} className='underline mr-1'>view full order</Text> */}
                <Ionicons className=' bottom-0 right-0' name={showDetails ? 'caret-up' : 'caret-down'} size={16} color={themeColors.diffrentColorOrange} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>


          {showDetails && item.items.orders.map((cartItem, index) => (
            <TouchableOpacity key={`${index}_${cartItem.id}`}
            // onPress={() => navigation.navigate('YettoUpdate')}
            >
              <View className='px-3 flex-row justify-between items-center'>
                <View className='flex-row py-2'>
                  <View className=' w-14 h-12 rounded-l-xl overflow-hidden'>
                    <ImageBackground
                      source={cartItem.image ?
                        { uri: cartItem.image, method: 'POST', headers: { Pragma: 'no-cache' } } :
                        require('./../../assets/menu.jpg')}
                      defaultSource={require('./../../assets/menu.jpg')}

                      className=' w-full h-full mr-2'
                      alt="Logo"
                    >
                      {/* <LinearGradient
                    start={{ x: 0.0, y: 0.25 }} end={{ x: 0.3, y: 1.1 }}
                    className='overflow-hidden h-full w-full'
                    colors={['transparent', 'black']}
                  /> */}
                    </ImageBackground>
                  </View>
                  <View className=' w-36 h-12 rounded-r-xl pl-3 pr-5 flex-row items-center' style={{ backgroundColor: themeColors.subbackGroundColor, marginLeft: 4 }}>
                    <Text style={[fontstyles.h4, { color: themeColors.diffrentColorOrange }]}>₹</Text>
                    <Text style={[fontstyles.boldh2, { color: themeColors.mainTextColor }]}>  {cartItem.price}</Text>
                  </View>
                </View>
                <View className='h-14 rounded-r-xl pl-3 pr-5 flex-row items-center' style={{ marginLeft: 4 }}>
                  <Text style={[fontstyles.boldh2, { color: themeColors.diffrentColorOrange }]}>X</Text>
                  <Text style={[fontstyles.boldh2, { color: themeColors.mainTextColor }]}>  {cartItem.quantity}</Text>
                </View>
                <Text style={[fontstyles.boldh2, { color: themeColors.diffrentColorOrange }]}>{cartItem.price * cartItem.quantity}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* <View className='my-6 px-4' key={index}>
              <View className='flex-row justify-between -mb-2'>
                <View>
                  <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor }]}>Order Status</Text>
                  <Text style={[fontstyles.h4, { color: themeColors.textColor }]}>{item.status == 'Scheduled' ? 'Waiting for Approval.' : item.status}</Text>
                </View>
                <View className='items-end'>
                  <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor }]}>Total Amount</Text>
                  <Text style={[fontstyles.number, { fontSize: 16, color: themeColors.diffrentColorOrange }]}>₹ {item.totalPrice.toFixed(2)}</Text>
                </View>
              </View>
            </View> */}
          <View className='p-3'>
            <View className='  flex-row gap-2'>
              {item.status == 'Scheduled' ?
                <TouchableOpacity className='flex-1 h-12 rounded-l-xl flex items-center justify-center overflow-hidden'
                  style={[
                    {
                      paddingVertical: 10,
                      backgroundColor: themeColors.diffrentColorPerpleBG,
                    },
                  ]}
                  onPress={() => {
                    declineOrder(item._id); // Decline the order
                  }}
                >
                  <Text style={[fontstyles.number]} className="text-black text-center uppercase mr-2">
                    Cancel Order
                  </Text>
                </TouchableOpacity>
                :
                <View className='flex-1 h-12 rounded-l-xl flex items-center justify-center overflow-hidden'
                  style={[
                    {
                      paddingVertical: 10,
                      backgroundColor: themeColors.diffrentColorPerpleBG,
                    },
                  ]}
                >
                  <Text style={[fontstyles.number]} className="text-black text-center uppercase mr-2">
                    {item.status == 'Prepared' ? 'Receive your order' : item.status == 'Accepted' ? 'Outlet is on your Order' : 'Outlet is filing Complaint'}
                  </Text>
                  {item.status == 'Accepted' &&
                    <Text style={[fontstyles.number]} className="text-black text-center">
                      ({minutes}m {seconds}s)
                    </Text>
                  }
                  <View
                    style={{
                      backgroundColor: themeColors.diffrentColorPerple,
                      width: `${persentBackgroundColor}%`,
                    }}
                    className=" -z-10 absolute top-0 left-0 h-20"
                  />
                </View>
              }
              <TouchableOpacity
                onPress={
                  () => {
                    if (item.items.phone && item.items.phone.length == 10) {
                      Linking.openURL(`tel:${item.items.phone}`)
                        .catch((err) => console.error('Error opening phone dialer:', err));
                    } else {
                      setShowToast(true);

                      setTimeout(() => {
                        setShowToast(false);
                      }, 2500);
                      console.error("missing contant info")
                    }
                  }
                }
                style={{ backgroundColor: themeColors.diffrentColorGreen }}
                className='  w-12 bottom-0 right-0 rounded-r-xl items-center justify-center'>
                <Ionicons size={28} name='call' color={themeColors.componentColor} />
              </TouchableOpacity>
            </View>
            {/* getRemainingTime */}
          </View>
          {/* {console.log('item', item.items.name)} */}
        </LinearGradient>

        {/* <TouchableOpacity className=' items-center justify-center' onPress={onShowDetails}>
          <Ionicons name="chevron-forward-outline" size={28} color={themeColors.textColor} />
        </TouchableOpacity> */}

      </View>
      {/* </TouchableOpacity> */}
    </Animated.View>
  );
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function OrderHistory() {
  const { themeColors, toggleTheme } = useContext(ThemeContext);
  const [orders, setOrders] = useState([]);
  const [noOrders, setNoOrders] = useState(true);
  const { showAlert, AlertWrapper } = useCustomAlert();
  const navigation = useNavigation();
  const { userData, dateGroup, outletsNEW, History, setHistory } = useContext(GlobalStateContext);
  const [showDetails, setShowDetails] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const fetchOrders = async () => {
    const contactinfo = { contactinfo: userData.contactinfo };

    try {
      const response = await fetch(`${API_BASE_URL}:${ORDERSBUYER_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactinfo),
      });

      const data = await response.json();
      if (data.status === 'ok') {
        setOrders(data.data);
        setNoOrders(data.data.length === 0); // If no orders, set noOrders to true
      } else if (data.status === "alert") {
        setNoOrders(true); // No orders available, set noOrders to true
      } else {
        console.error('Error fetching orders: OrderHistory', data);
        showAlert({
          title: "Error Fetching Orders",
          message: data || "We couldn't retrieve your order history. Please check your connection and try again.",
          codeMassage: { code: '500', text: '📜 Lost in history? Let’s try again!' },
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
        setNoOrders(true); // In case of error, set noOrders to true
      }
    } catch (error) {
      console.error('Error fetching orders: OrderHistory', error);
      showAlert({
        title: "Server Issue",
        message: "We’re having trouble fetching your orders. Please try again after some time.",
        codeMassage: { code: '503', text: '⚡ Server’s on a break. Be right back!' },
      });
      setNoOrders(true); // In case of error, set noOrders to true
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [])

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(() => {
      fetchOrders();
    }, 60000); // Refresh orders every 60 seconds

    return () => clearInterval(intervalId);
  }, []);

  // console.log('dateordersGroup', orders)
  const fontstyles = TextStyles();

  const [refreshing, setRefreshing] = useState(false);
  const [swiped, setSwiped] = useState(true);

  const onRefresh = useCallback(async () => {
    setSwiped(false)
    setRefreshing(true);
    try {
      await fetchOrders(); // Wait for fetchOrders to finish
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setRefreshing(false); // Only set refreshing to false once fetchOrders is done
    }
  }, []);

  const [info, setInfo] = useState(false);
  return (
    <View className='h-full w-full' style={{ backgroundColor: themeColors.backGroundColor }}>
      <StatusBar
        // backgroundColor={'black'} 
        backgroundColor={themeColors.statusBarColor}
      />
      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl progressBackgroundColor={themeColors.mainTextColor} colors={[themeColors.diffrentColorOrange]} refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View>
          {(noOrders || orders.length == 0) ?
            <View className='flex-1 justify-center items-center p-2' style={{ height: Dimensions.get('window').height * 0.8 }}>
              <Text className='font-black text-xl text-center py-3' style={{ color: themeColors.mainTextColor }}>
                No Orders Placed Yet!
              </Text>
              <Text className='font-normal text-base text-center' style={{ color: themeColors.textColor }}>
                It looks like you haven’t placed any orders so far. Want to revisit your previous orders? You can always explore your past purchases and make some new delicious memories!
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('History')}
                className=' mt-4 items-center rounded-xl justify-center p-4'
                style={{ backgroundColor: themeColors.diffrentColorOrange }}
              >
                <Text style={[fontstyles.number, { color: themeColors.mainTextColor }]}>
                  View Order History
                </Text>
              </TouchableOpacity>
            </View>
            :
            <View className='mb-6 px-4'>
              {orders.map((item, index) => (
                <ListCard_Self1
                  themeColors={themeColors}
                  fetchOrders={fetchOrders}
                  History={History}
                  setHistory={setHistory}
                  showAlert={showAlert}
                  // changeOrderStatus={changeOrderStatus}
                  key={item.id} // or key={`${item.id}_${index}`} if item.id is not unique
                  index={index}
                  fontstyles={fontstyles}
                  item={item}
                  outletsNEW={outletsNEW}
                  showToast={showToast}
                  setShowToast={setShowToast}
                />
              ))}
            </View>
          }





        </View>
        {/* {dateGroup.map((item, index) => (
              <View key={index}>
                <ListCard_Self2 item={item} onShowDetails={() => handleShowDetails(index)} showDetails={showDetails === index} />
                {showDetails === index && <ListCard_Self3 item={item} />}
              </View>
            ))} */}
        {showToast && (
          <ToastNotification
            title="Contact Info Missing!"
            description="We couldn’t contact as phone number is not provided."
            showToast={showToast}
          />
        )}

        {AlertWrapper()}
      </ScrollView >

      {/* {info &&
        <View className=' px-4 rounded-l-xl rounded-tr-xl bg-white h-12 absolute bottom-0 right-4 mb-12 flex items-center justify-center'>
          <Text className=' -mt-1' style={[fontstyles.h5, { color: themeColors.textColor }]}> Swipe down to refresh</Text>
        </View>
      }
      <TouchableOpacity onPressIn={() => setInfo(true)} onPressOut={() => setInfo(false)} className='h-16 w-16 p-3 absolute right-0 bottom-0 items-end justify-end'>
        <Ionicons name='information-circle' size={30} color={themeColors.mainTextColor} />
      </TouchableOpacity> */}

      {/* <View className=' px-4 w-full rounded-l-xl rounded-tr-xl absolute bottom-0 mb-5 flex items-center justify-center'>
        <Text className=' -mt-1' style={[fontstyles.h5, { color: themeColors.textColor }]}> Swipe down to refresh</Text>
      </View> */}
      {swiped && <BounceText />}
    </View >
  )
}

const styles = StyleSheet.create({
  foodItemCollectionContainer: {
    marginTop: Dimensions.get('window').height * 0.02,
    gap: Dimensions.get('window').width * 0.04,
    borderRadius: 18,
  },
})