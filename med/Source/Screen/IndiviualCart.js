import { View, Text, FlatList, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, ScrollView, Alert, TextInput, Switch, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import FoodIcon from '../Components/FoodIcon';
import Colors from '../Components/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import TruncatedTextComponent from '../Components/TruncatedTextComponent';
import { useNavigation } from '@react-navigation/native';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { removeStoreFromCart } from '../Components/removeStoreFromCart';
import useIncrementHandler from '../Components/handleIncrement';
import { API_BASE_URL, ORDERS_ENDPOINT } from '../Constants/Constants';
import TextStyles from '../Style/TextStyles';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import useShopStatus from '../Components/useShopStatus';
import useCustomAlert from '../Components/Alerthook';
import { Audio } from 'expo-av';
import { ThemeContext } from '../Context/ThemeContext';

const Cart = ({ route }) => {

  const { handleIncrement } = useIncrementHandler();
  const { handleDecrement } = useIncrementHandler();
  // const { storeName, items, storeDetails } = route.params;
  // const { item } = route.params;
  const { showAlert, AlertWrapper } = useCustomAlert();
  const { themeColors, toggleTheme } = useContext(ThemeContext);
  async function createOrder(orderData) {

    try {
      const response = await fetch(`${API_BASE_URL}:${ORDERS_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      // console.log(orderData)
      const result = await response.json();

      if (response.ok) {
        // console.log('Order created successfully:', result.data);
        return result.data;
      } else {
        // showAlert({
        //   title: "Ordering Blocked",
        //   message: "The outlet is not accepting orders from you due to restrictions. Please contact them for more details.",
        //   codeMassage: {
        //     code: '403',
        //     text: '🚫 Blocked! Reach out to the outlet.',
        //   },
        // });
        Alert.alert('Error creating order:', result.data || 'Error creating order')
        console.error('Error creating order:', result.data);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  }

  const { userData, outletsNEW, cartItemsNEW, setCartItems, setCartItemsNEW, campusShops, setcampusShops, History, setHistory } = useContext(GlobalStateContext);

  // cartItemsNEW.find((cart) => console.log(cart.name));
  const item = cartItemsNEW?.find((cart) => cart.name === route.params.item.name);
  // useEffect(() => {
  //   if (!item || item.length === 0) {
  //     navigation.navigate('OrderHistory');
  //   }
  // }, [item]);

  const [outletStatus, setOutletStatus] = useState(true);

  useEffect(() => {
    const outletSts = outletsNEW.find(shop => shop?.name === item?.name)
    const Shopstatus = useShopStatus(outletSts?.openingTime, outletSts?.closingTime, outletSts?.offDays, outletSts?.leaveDay);
    setOutletStatus(Shopstatus.state)
    updateCartItemsStatus(cartItemsNEW, outletsNEW);
  }, [outletsNEW]);

  const updateCartItemsStatus = () => {
    const updatedCartItems = cartItemsNEW.map(cartItem => {
      const outlet = outletsNEW.find(outlet => outlet.id === cartItem.id);
      if (outlet) {
        const updatedOrders = cartItem.orders.map(order => {
          const menu = outlet.menu.flatMap(menu => menu.items);
          const menuItem = menu.find(item => item.id === order.id);
          if (menuItem) {
            return {
              ...order,
              status: menuItem.status
            };
          }
          return order;
        });
        return {
          ...cartItem,
          orders: updatedOrders
        };
      }
      return cartItem;
    });
    setCartItemsNEW(updatedCartItems);
  };

  // useEffect(() => {
  //   if (!item) {
  //     navigation.goBack();
  //   }
  // }, [item]);


  // const totalPrice = item.orders ? item.orders.reduce((acc, order) => acc + (parseInt(order.price) * order.quantity), 0) : 0;
  const totalPrice = item?.orders
    ? item.orders.reduce((acc, order) => acc + (parseInt(order.price, 10) * order.quantity), 0)
    : 0;
  const totalQuantity = item?.orders.reduce((acc, order) => acc + order.quantity, 0);

  const today = new Date();
  // const yesterday = new Date();
  // yesterday.setDate(today.getDate() - 6);

  function getFormattedDate(dateObj) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const dayName = days[dateObj.getDay()];
    const monthName = months[dateObj.getMonth()];
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();

    const suffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    }

    return `${dayName}, ${monthName} ${day}${suffix(day)} ${year}`;
  }

  // console.log(storeName, items, totalPrice, storeDetails)
  const navigation = useNavigation();

  function calculateTotalQuantity(items) {
    let totalQuantity = 0;
    items.forEach(item => {
      totalQuantity += parseInt(item.quantity);
    });
    return totalQuantity;
  }

  const renderItem = ({ item, index }) => (
    <View key={`${index}-${item.id}`} className='p-3 py-6 overflow-hidden' style={{ backgroundColor: themeColors.componentColor }}>
      <View className='flex-row items-center' >
        {
          item.type &&
          <FoodIcon style={{ backgroundColor: 'black' }} type={item.type} size={8} padding={2} />
        }
        <View>
          <Text className='font-black text-base' style={{ color: themeColors.mainTextColor }}>{TruncatedTextComponent(item.item, 20)}</Text>
          <Text className='font-normal text-sm' style={{ color: themeColors.textColor }}>Quantity: {item.quantity} * ₹{item.price}</Text>
        </View>
      </View>
      <View className='absolute top-3 right-3 items-end'>
        <View
          style={[styles.button, { backgroundColor: themeColors.componentColor, borderColor: themeColors.textColor, borderWidth: 1 }]}
          className='h-8 w-20 flex-row overflow-hidden mb-1'
        >
          {item.quantity > 0 ? (
            <>
              <TouchableOpacity className='z-10 left-0 absolute w-6/12 items-center'>
                <Ionicons color={themeColors.textColor} name={'remove'} size={16} />
              </TouchableOpacity>
              <Text className=' uppercase text-base font-black text-center' >{item.quantity}</Text>
              {/* themeColors.diffrentColorGreen */}
              <TouchableOpacity className='z-10 right-0 absolute w-6/12 items-center'>
                <Ionicons color={themeColors.textColor} name={'add'} size={16} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.diffrentColorGreen }]} onPress={() => { handleIncrement(item.id, item.id, item, [...item.orders, item.id]) }}>
                <Text className=' uppercase text-base font-black' style={{ color: themeColors.diffrentColorGreen }}>Add</Text>
              </TouchableOpacity>
              <Text className=' top-0 right-2 absolute text-base font-medium' style={{ color: themeColors.diffrentColorGreen }}>+</Text>
            </>
          )}
        </View>
        <Text className='font-normal text-sm' style={{ color: themeColors.mainTextColor }}>₹{item.price * item.quantity}</Text>
      </View>
    </View>
  );

  const renderItem2 = ({ parcelActive, handleSwitchChange, item, index, hotelId, key }) => {

    return (
      <View key={`${hotelId}-${index}`} className=' pl-3 overflow-hidden' style={{ backgroundColor: themeColors.componentColor }}>

        {/* {console.log(`${index}-${item.id}`)} */}
        {index != 0 &&
          <Text className=' px-4 py-1' numberOfLines={1} ellipsizeMode='clip' style={{ color: themeColors.secComponentColor }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>
          // <View style={{ height: 1, backgroundColor: themeColors.secComponentColor }} className='  w-11/12 my-3 self-center mr-3' />
        }
        <View className='flex-row w-full'>
          {/* <View className=' absolute right-3 flex-row items-center -mt-2'>
            <Text className=' -mt-1 mr-1' style={[fontstyles.h3, { fontSize: 21, color: themeColors.textColor }]}>Parcel</Text>
            <TouchableOpacity onPress={() => handleSwitchChange(!parcelActive)}>
              <Ionicons
                name='toggle' size={38} style={{ transform: [{ rotate: parcelActive ? '0deg' : '180deg' }] }} color={parcelActive ? themeColors.diffrentColorPerple : themeColors.textColor}
              />
            </TouchableOpacity>
          </View> */}
          <View className=' w-3/12'>
            <ImageBackground
              source={item.image ?
                { uri: item.image, method: 'POST', headers: { Pragma: 'no-cache' } } :
                require('./../../assets/menu.jpg')}
              defaultSource={require('./../../assets/menu.jpg')}
              resizeMode="cover"
              alt="Logo"
              className='w-full h-20 border-2 rounded-lg overflow-hidden border-slate-950'
              style={{ borderWidth: 2, borderColor: themeColors.secComponentColor }}
            >
              <View className='absolute bottom-1 z-10 right-1'>
                {item.status ?
                  <Text className='uppercase' style={[fontstyles.number, { fontSize: 12, color: themeColors.diffrentColorGreen }]}>InStock</Text>
                  : <Text className='uppercase' style={[fontstyles.number, { color: themeColors.diffrentColorRed }]}>SoldOut</Text>
                }
              </View>
              <LinearGradient
                start={{ x: 0.0, y: 0.45 }} end={{ x: 0.4, y: 1.3 }}
                className='  h-full w-full'
                colors={['transparent', themeColors.backGroundColor]}
              >
              </LinearGradient>

            </ImageBackground>

          </View>
          <View className=' w-9/12 px-3'>
            <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.blackh2, { fontSize: 22, color: themeColors.mainTextColor }]}>{item.item}</Text>
            <Text className=' mt-1' style={[fontstyles.h6, { color: themeColors.textColor }]}>Quantity: {item.quantity} * ₹{item.price}</Text>
            <View className=' flex-row justify-between w-full'>
              <View className='flex-1 justify-end'>
                <Text style={[fontstyles.numberbigger, { color: themeColors.mainTextColor }]}>
                  ₹{item.price * item.quantity}
                </Text>
              </View>
              <View
                style={[styles.button, {
                  backgroundColor: themeColors.diffrentColorGreentrans,
                  borderColor: themeColors.diffrentColorGreen, borderWidth: 1
                }]}
                className='h-8 w-20 flex-row overflow-hidden mt-1 '
              >
                {/* hotelId */}
                {item.quantity > 0 ? (
                  <>
                    <TouchableOpacity onPress={() => { handleDecrement(item.id, item.id, item, { id: hotelId }) }} className='z-10 left-0 absolute w-6/12 items-center'>
                      <Ionicons color={themeColors.textColor} name={'remove'} size={16} />
                    </TouchableOpacity>
                    <Text className='text-base font-black text-center' style={{ color: item.status ? themeColors.diffrentColorGreen : themeColors.diffrentColorRed }}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => { handleIncrement(item.id, item.id, item, { id: hotelId }) }} className='z-10 right-0 absolute w-6/12 items-center '>
                      <Ionicons color={themeColors.textColor} name={'add'} size={16} />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.diffrentColorGreen }]} >
                      <Text className=' uppercase text-base font-black' style={{ color: themeColors.diffrentColorGreen }}>Add</Text>
                    </TouchableOpacity>
                    <Text className=' top-0 right-2 absolute text-base font-medium' style={{ color: themeColors.diffrentColorGreen }}>+</Text>
                  </>
                )}
              </View>

            </View>

          </View>
        </View>
      </View>
    );
  }


  const filteredItems = item?.orders.map(({ price, quantity, image, category }) => ({
    price,
    quantity,
    image,
    category
  }));

  const [massage, setMassage] = useState('')

  const [sound, setSound] = useState();
  const [loading, setLoading] = useState(false);


  async function playSound() {
    console.log('Loading Sound');
    /* @info */ const { sound } = await Audio.Sound.createAsync(
      /* @end */ require('../assets/sounds/cash.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await /* @info */ sound.playAsync(); /* @end */
  }

  useEffect(() => {
    return sound
      ? () => {
        console.log('Unloading Sound');
          /* @info Always unload the Sound after using it to prevent memory leaks.*/ sound.unloadAsync(); /* @end */
      }
      : undefined;
  }, [sound]);

  const handleProceedPayment = async (item) => {

    if (item.blocklist && item.blocklist.includes(userData.contactinfo)) {
      showAlert({
        title: "Ordering Blocked",
        message: "The outlet is not accepting orders from you due to restrictions. Please contact them for more details.",
        codeMassage: {
          code: '403',
          text: '🚫 Blocked! Reach out to the outlet.',
        },
      });
      return; // Ensures the function stops executing after showing the alert.
    }

    await updateCartItemsStatus(cartItemsNEW, outletsNEW);
    // console.log('item', item)
    const removeItemsWithStatusFalse = () => {
      item.orders = item.orders.filter(order => order.status == true);
    };
    const outOfStockItems = item.orders.some(order => order.status == false);
    console.log('--------------------------------------------------------------------------------------------', item.orders, outOfStockItems)

    if (outOfStockItems) {
      showAlert({
        title: "Out of Stock Items",
        message: "Your cart contains some out-of-stock items. Would you like to proceed with the available items or review your cart?",
        codeMassage: { code: '400', text: '⚠️ Some items are missing in your cart?' },
        buttons: [
          {
            text: "Review",
            onPress: () => {
              // Logic to review cart
              console.log("Reviewing cart...");
              navigation.navigate('Cart');
            },
            styleColor: '#FD4851',
          },
          {
            text: "Proceed",
            styleColor: '#2CD007',
            onPress: async () => {
              // Remove out-of-stock items
              removeItemsWithStatusFalse();

              // Process the order, only if there are items left in the cart
              const { orders, ...storeDetails } = item;
              const { name, username } = userData;

              if (orders.length !== 0) {
                // Ensure 'massage' and 'userData' are defined
                const orderData = {
                  id: Date.now().toString(),
                  items: item,
                  massage: massage,  // Ensure 'massage' is defined
                  totalPrice: item?.orders
                    ? item.orders.reduce((acc, order) => acc + (parseInt(order.price, 10) * order.quantity), 0)
                    : 0,
                  date: getFormattedDate(today), // Ensure 'getFormattedDate' is defined
                  status: 'Scheduled',
                  parcel: parcelActive,
                  name: userData,  // Ensure this is the correct data
                };

                // Wait for the order to be created
                const orderResult = await createOrder(orderData);

                if (orderResult) {
                  removeStoreFromCart(item.name, setCartItemsNEW);
                  navigation.navigate('Orders');
                } else {
                  showAlert({
                    title: "Order Failed",
                    message: "We couldn't place your order due to a server issue. Please try again later.",
                    codeMassage: { code: '500', text: '⚠️ Server glitch! Retry soon.' },
                  });
                }
              } else {
                // If no items are left, show alert
                showAlert({
                  title: "Out of Stock",
                  message: "Unfortunately, all items in your cart are out of stock. Please check back later.",
                  codeMassage: { code: '400', text: '🚫 Everything’s out of stock. Try again later!' },
                });
              }
            }
          }
        ],
        additional: [
          { head: "Review", head2: "navigate:null" },
          { head: "Proceed", head2: "continue with available" }
        ]
      });
    } else {
      const { orders, ...storeDetails } = item;  // Destructure to separate orders from the rest of the item properties
      // const { name, username } = userData;

      // createOrder({
      //   id: Date.now().toString(),
      //   items: item,
      //   // name: userData,    
      //   massage: massage,
      //   totalPrice: item?.orders
      //     ? item.orders.reduce((acc, order) => acc + (parseInt(order.price, 10) * order.quantity), 0)
      //     : 0,
      //   // Noformatdate: today,
      //   date: getFormattedDate(today),
      //   status: 'Scheduled', // waiting_for_acceptance
      //   parcel: parcelActive,
      //   name: userData,
      // })
      setLoading(true);

      let userDataCopy = { ...userData };
      delete userDataCopy.password;

      const orderData = {
        id: Date.now().toString(),
        items: item,
        massage: massage,  // Ensure 'massage' is defined
        totalPrice: item?.orders
          ? item.orders.reduce((acc, order) => acc + (parseInt(order.price, 10) * order.quantity), 0)
          : 0,
        date: getFormattedDate(today), // Ensure 'getFormattedDate' is defined
        status: 'Scheduled',
        parcel: parcelActive,
        name: userDataCopy,  // Ensure this is the correct data
      };

      // Wait for the order to be created
      const orderResult = await createOrder(orderData);

      if (orderResult) {
        await playSound();
        setTimeout(() => {
          removeStoreFromCart(item.name, setCartItemsNEW);
          navigation.navigate('Orders');
        }, 1000);
        // setLoading(false);
      } else {
        showAlert({
          title: "Order Failed",
          message: "We couldn't place your order due to a server issue. Please try again later.",
          codeMassage: { code: '500', text: '⚠️ Server glitch! Retry soon.' },
        });
        setLoading(false);
      }

      // 
    }
  };

  const fontstyles = TextStyles();

  const [parcelActive, setparcelActive] = useState(false);

  const handleSwitchChange = (value) => {
    setparcelActive(value);
    // item.parcel = value; // Update the item with the new parcel status
  };


  return (

    // View style={{backgroundColor: themeColors.backGroundColor}}
    <SafeAreaView className='h-full w-full' style={{ backgroundColor: themeColors.backGroundColor }}>
      {loading &&
        <View style={{ backgroundColor: themeColors.backGroundColor, opacity: 0.90 }} className=' h-full w-full items-center justify-center absolute z-50 pb-24'>
          <ActivityIndicator size={70} color={themeColors.diffrentColorOrange} />
        </View>
      }
      {/* <StatusBar backgroundColor={themeColors.subbackGroundColor} /> */}
      <StatusBar backgroundColor={themeColors.backGroundColor} />

      <ScrollView>
        <View className=' p-3 h-full' style={{ backgroundColor: themeColors.backGroundColor }}>

          <View className=' mb-4 pt-3 pb-2 rounded-xl overflow-hidden' style={{ backgroundColor: themeColors.componentColor }}>
            <View className='px-3 py-1 flex-row' >
              <Ionicons name="bag-check-outline" size={20} color={themeColors.mainTextColor} />
              <View className=' ml-3 flex-row'>
                <Text style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>You have </Text>
                <Text style={[fontstyles.numberbigger, { marginTop: 3, color: themeColors.mainTextColor }]}>
                  {totalQuantity} {totalQuantity > 1 ? 'items' : 'item'}
                </Text>
                <Text style={[fontstyles.h5, { color: themeColors.mainTextColor }]}> in your list</Text>
              </View>
            </View>
            <Text className=' px-4' numberOfLines={1} ellipsizeMode='clip' style={{ color: themeColors.secComponentColor }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>
            <View className='flex-row px-3 pt-2' >
              <Ionicons name="document-text-outline" size={20} color={themeColors.mainTextColor} />
              <View className=' ml-3'>
                <View className='flex-row'>
                  <Text style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>Note for the outlet </Text>
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


          <View style={{ backgroundColor: themeColors.componentColor }} className=' py-3 rounded-xl overflow-hidden'>
            {/* <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={(items) => `${items.id}-${items.item}`}
            /> */}
            {/* {console.log(items.item)} */}
            {item?.orders.map((items, index) => (
              renderItem2({ parcelActive: parcelActive, handleSwitchChange: handleSwitchChange, hotelId: item.id, item: items, index: index, key: `${item.id}-${index}` })
            ))}

            {/* {console.log(item)} */}
          </View>

          <View className=' mt-4 rounded-xl overflow-hidden' style={{ backgroundColor: themeColors.componentColor }}>
            <View className='px-3 pt-4 pb-2 flex-row' >
              <Ionicons name="timer-outline" size={20} color={themeColors.mainTextColor} />
              <View className=' ml-3 flex-row' style={{ marginTop: -2 }}>
                <Text style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>Average Time is </Text>
                <Text style={[fontstyles.numberbigger, { marginTop: 3, color: themeColors.mainTextColor }]}>20 mins</Text>
              </View>
            </View>
            <Text className=' px-4' numberOfLines={1} ellipsizeMode='clip' style={{ color: themeColors.secComponentColor }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>
            {/* <View className=' mx-4' style={{ height: 1, backgroundColor: themeColors.secComponentColor}} /> */}
            <View className='flex-row px-3 pt-1 items-center justify-between'>
              <View className=' flex-row'>
                <Ionicons name="restaurant-outline" size={20} color={themeColors.mainTextColor} />
                <Text className=' ml-3' style={[fontstyles.h5, { marginTop: -2, color: themeColors.mainTextColor }]}>Do you want Parcel?</Text>
              </View>
              <TouchableOpacity onPress={() => setparcelActive(!parcelActive)}>
                <Ionicons
                  name='toggle' size={34} style={{ transform: [{ rotate: parcelActive ? '0deg' : '180deg' }] }} color={parcelActive ? outletStatus !== 'open' ? themeColors.diffrentColorOrange : themeColors.diffrentColorGreen : themeColors.mainTextColor}
                />
              </TouchableOpacity>
            </View>
            <Text className=' px-4' numberOfLines={1} ellipsizeMode='clip' style={{ color: themeColors.secComponentColor }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>
            <View className='px-3 pb-4 pt-3'>
              <View className='flex-row' >
                <Ionicons name="receipt-outline" size={20} color={themeColors.mainTextColor} />
                <View className=' ml-3' style={{ marginTop: -4 }}>
                  <View className='flex-row'>
                    <Text style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>Total Bill </Text>
                    <Text style={[fontstyles.numberbigger, { marginTop: 2, color: themeColors.mainTextColor }]}>₹{totalPrice}</Text>
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
        <View>
          <View className=' flex-row'>
            <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor }]}>₹{totalPrice.toFixed(2)}</Text>
          </View>
          <Text className='font-medium text-base' style={[fontstyles.number, { color: themeColors.textColor }]}>TOTAL</Text>
        </View>
        {/* {console.log(today, getFormattedDate(today))} */}
        {/* {console.log(outletStatus, useShopStatus(item?.openingTime, item?.closingTime, item?.offDays, item?.leaveDay).state)} */}
        {
          item ? (
            // useShopStatus(item?.openingTime, item?.closingTime, item?.offDays, item?.leaveDay).state !== 'open' &&
            outletStatus !== 'open' &&
              // useShopStatus(item?.openingTime, item?.closingTime, item?.offDays, item?.leaveDay).state !== 'closingSoon' &&
              outletStatus !== 'closingSoon'
              ? (
                <TouchableOpacity
                  onPress={() =>
                    showAlert({
                      title: "Outlet Closed",
                      message: "The outlet is currently closed. Please check their operating hours or try again later.",
                      codeMassage: { code: '403', text: '🚪 Closed! Try again later.' },
                    })
                  }
                  className="p-3 flex-row justify-center items-center rounded-lg"
                  style={{
                    backgroundColor: themeColors.diffrentColorOrange,
                    width: Dimensions.get('window').width * 0.53
                  }}
                >
                  <Text style={[fontstyles.number, { fontSize: 18, color: 'white' }]}>
                    Store Closed
                  </Text>
                </TouchableOpacity>
              )
              : (
                <TouchableOpacity
                  onPress={() => handleProceedPayment(item)}
                  className="p-3 flex-row justify-center items-center rounded-lg"
                  style={{
                    backgroundColor: themeColors.diffrentColorGreen,
                    width: Dimensions.get('window').width * 0.53
                  }}
                >
                  <Text style={[fontstyles.number, { fontSize: 18, color: 'white' }]}>
                    Place Order
                  </Text>
                </TouchableOpacity>
              )
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('HomeScreen')}
              className="p-3 flex-row justify-center items-center rounded-lg"
              style={{
                backgroundColor: themeColors.diffrentColorRed,
                width: Dimensions.get('window').width * 0.53
              }}
            >
              <Text style={[fontstyles.number, { fontSize: 18, color: themeColors.mainTextColor }]}>
                Select Items
              </Text>
            </TouchableOpacity>
          )
        }
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: 8, // Adjust padding instead of fixed height
    // paddingHorizontal: 10, // Add padding for horizontal space
    // backgroundColor: '#114232',
  },
  // foodItemCollectionContainer: {
  //   marginHorizontal: Dimensions.get('window').width * 0.07,
  //   marginTop: Dimensions.get('window').height * 0.02,
  //   gap: Dimensions.get('window').width * 0.04,
  //   // backgroundColor: 'white',
  //   borderRadius: 18,
  // },
  // shadowProp: {
  //   backgroundColor: 'rgba(180, 180, 180, 0.1)',
  //   // shadowOffset: {
  //   //   width: 0,
  //   //   height: 12,
  //   // },
  //   // shadowOpacity: 0.58,
  //   // shadowRadius: 16.00,
  //   elevation: 30,

  // },
  // container: {
  //   flex: 1,
  //   padding: 10,
  //   // backgroundColor: '#fff',
  // },
  // storeTitle: {
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   marginVertical: 10,
  // },
  // itemText: {
  //   fontSize: 16,
  //   marginBottom: 5,
  // },
});

export default Cart;