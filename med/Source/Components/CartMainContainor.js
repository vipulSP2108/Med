import React, { useContext } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Colors from '../Components/Colors';
import { Ionicons } from '@expo/vector-icons';
import TruncatedTextComponent from '../Components/TruncatedTextComponent';
import { useNavigation } from '@react-navigation/native';
import ModelScreen from '../Screen/ModelScreen';
import { removeStoreFromCart } from './removeStoreFromCart';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { styled } from 'nativewind';
import { ThemeContext } from '../Context/ThemeContext';

export const FirstStoreComponent = ({ fontstyles, updatedCartWithDetails, Modelshow, settype }) => {
  // const { CartItems, updatedCartWithDetails } = useContext(GlobalStateContext);
  const navigation = useNavigation();
  const { themeColors, toggleTheme } = useContext(ThemeContext);
  const { outletsNEW, setCartItemsNEW, setCartItems, campusShops, setcampusShops, cartItemsNEW } = useContext(GlobalStateContext);

  const updatedCartWithDetailsLength = updatedCartWithDetails.length;

  // console.log('Updated Cart Items:', JSON.stringify(updatedCartWithDetails, null, 2));

  // const { storeName, storeDetails, items, orders } = updatedCartWithDetails[updatedCartWithDetailsLength - 1];
  const Data = updatedCartWithDetails[updatedCartWithDetailsLength - 1];

  const totalPrice = Data.orders?.reduce((acc, order) => acc + (parseInt(order.price) * order.quantity), 0);
  const totalItems = Data.orders?.reduce((acc, order) => acc + order.quantity, 0);
  // const totalItems = items.reduce((total, item) => total + parseInt(item.quantity, 10), 0);

  const navToDetails = (item) => {
    navigation.navigate("Details", { Data: item });
  };

  return (
    <View key={Data.id}>
      {updatedCartWithDetailsLength - 1 != 0 ?
        <>
          <TouchableOpacity
            onPress={() => {
              settype('cart');
              Modelshow();
            }}
            className=' absolute flex-row rounded-full -mt-3 p-1 px-2 items-center z-50'
            style={{
              backgroundColor: themeColors.componentColor,
              shadowColor: themeColors.shadowcartColor, // Replace with your desired glow color
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 10,
              elevation: 5.1,
              borderWidth: 1,
              // borderColor: 'rgba(255, 255, 255, 0.3)',
              borderColor: themeColors.secComponentColor,
              justifyContent: 'center',
              alignItems: 'center',
              top: '50%',
              left: '50%',
              transform: [{ translateX: -50 }, { translateY: -50 }],
            }}
          >
            <Text style={[fontstyles.number, { color: themeColors.diffrentColorOrange }]}>+{updatedCartWithDetailsLength - 1} more </Text>
            <Ionicons name='caret-up' color={themeColors.diffrentColorOrange} size={16} />
          </TouchableOpacity>
          <View
            // key={storeName}
            style={{
              backgroundColor: themeColors.componentColor,
              shadowColor: themeColors.shadowcartColor, // Replace with your desired glow color
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 10,
              elevation: 5,
              borderWidth: 1,
              borderColor: themeColors.secComponentColor,
              // borderColor: 'rgba(255, 255, 255, 0.3)', // Adjust the color and opacity for a glowing border
            }}
            className=' rounded-xl p-4 mx-3 -my-6 flex-row'
          // style={{ backgroundColor: themeColors.secComponentColor }}
          />
        </>
        :
        null
      }
      <View
        key={cartItemsNEW.id}
        style={{
          height: Dimensions.get('window').height * 0.10,
          backgroundColor: themeColors.componentColor,
          shadowColor: themeColors.shadowcartColor, // Replace with your desired glow color
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 10,
          elevation: 5,
          borderWidth: 1,
          borderColor: themeColors.secComponentColor,
          // borderColor: 'rgba(255, 255, 255, 0.3)', // Adjust the color and opacity for a glowing border
          padding: Dimensions.get('window').width * 0.02,
        }}
        className=' rounded-xl flex-row items-center shadow-xl shadow-black'
      // style={{
      //           backgroundColor: themeColors.shadowcolor,
      //           elevation: 5,
      // }}
      >
        <Image
          // source={require('./../Data/banner.jpg')}
          source={Data.image ?
            { uri: Data.image, method: 'POST', headers: { Pragma: 'no-cache' } } :
            require('./../../assets/store.jpg')}
          defaultSource={require('./../../assets/store.jpg')}
          className=' w-12 h-12 rounded-full mr-2'
          alt="Logo"
        />
        <View style={{ width: Dimensions.get('window').width * 0.36 }}>
          <Text className=' pb-1' style={[ fontstyles.h3, { color: themeColors.mainTextColor }]} numberOfLines={1} ellipsizeMode='tail'>
            {TruncatedTextComponent(Data.name, 13)}
          </Text>
          <TouchableOpacity onPress={() => { navToDetails(outletsNEW.find(shop => shop.id === Data.id)) }} className=' flex-row items-center'>
            <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { color: themeColors.textColor }]} className='underline -mt-2'>
            view full menu
            </Text>
            <Ionicons name='caret-forward' size={16} color={themeColors.diffrentColorOrange} />
          </TouchableOpacity>
        </View>
        <View className='flex-row gap-x-1 absolute right-2 top-2 h-full'>
          <TouchableOpacity
            className='justify-center items-center rounded-lg m-1'
            style={{ width: Dimensions.get('window').width * 0.30, backgroundColor: themeColors.diffrentColorOrange }}
            onPress={() => navigation.navigate('IndiviualCart', { item: Data })}
          >
            <View className=' flex-row items-center justify-center'>
              <Text style={[fontstyles.number, { color: 'white' }]}>
                {/* {items.reduce((total, item) => total + parseInt(item.quantity, 10), 0)} {' '}
                {items.reduce((total, item) => total + parseInt(item.quantity, 10), 0) === 1 ? 'item' : 'items'} */}
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </Text>
              <Ionicons
                style={{ transform: [{ rotate: '90deg' }], margin: -3 }}
                name="remove-outline"
                size={16}
                color={'white'}
              />
              <Text style={[fontstyles.number, { color: 'white' }]}>
                ₹{totalPrice}
              </Text>
            </View>
            <Text style={[fontstyles.h5, { color: 'white' }]}>
              CheckOut
            </Text>
          </TouchableOpacity>
          <View style={{ width: Dimensions.get('window').width * 0.08 }} className=' items-center justify-center'>
            <TouchableOpacity
              onPress={() => removeStoreFromCart(Data.name, setCartItemsNEW)}
              className=' rounded-full p-1 items-center justify-center'
              style={{ backgroundColor: themeColors.secComponentColor }}
            >
              <Ionicons
                name="add-outline"
                style={{ transform: [{ rotate: '45deg' }] }}
                size={18}
                color={themeColors.mainTextColor}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};