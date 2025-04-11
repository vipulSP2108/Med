// RenderCartItem.js
import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TruncatedTextComponent from './TruncatedTextComponent';
import Colors from './Colors';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { removeStoreFromCart } from './removeStoreFromCart';
import TextStyles from '../Style/TextStyles';
import { ThemeContext } from '../Context/ThemeContext';

export default RenderCartItem = ({ item, setVisible, navigation }) => {
  // const { cartItemsNEW, outletsNEW, storeName, storeDetails, items } = item;
  const { outletsNEW, setCartItems, campusShops, setcampusShops, setCartItemsNEW } = useContext(GlobalStateContext);
    const { themeColors, toggleTheme } = useContext(ThemeContext);

  const navToDetails = (item) => {
    setVisible(false);
    navigation.navigate("Details", { Data: item });
  };

  const totalPrice = item.orders?.reduce((acc, order) => acc + (parseInt(order.price) * order.quantity), 0);
  const totalItems = item.orders?.reduce((acc, order) => acc + order.quantity, 0);

  const fontstyles = TextStyles();
  return (
    <View
      key={item.id}
      className='rounded-xl p-2 mb-3 flex-row bottom-0'
      style={{ backgroundColor: themeColors.secComponentColor }}
    >
      <Image
        source={item.image ?
          { uri: item.image, method: 'POST', headers: { Pragma: 'no-cache' } } :
          require('./../../assets/store.jpg')}
        defaultSource={require('./../../assets/store.jpg')}
        className='w-12 h-12 rounded-full mr-2'
        alt="Logo"
      />
      <View>
        <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h3, { color: themeColors.mainTextColor }]}>
        {/* {item.name} */}
        {TruncatedTextComponent(item.name,11)}
        </Text>
        <TouchableOpacity onPress={() => navToDetails(outletsNEW.find(shop => shop.id === item.id))} className='flex-row items-center'>
          <Text style={[fontstyles.h5, { color: themeColors.textColor }]} className=' underline'>
            view full menu
          </Text>
          <Ionicons name='caret-forward' size={16} color={themeColors.diffrentColorOrange} />
        </TouchableOpacity>
      </View>
      <View className='flex-row gap-x-2 absolute right-2 top-2 h-full'>
        <TouchableOpacity
          className='justify-center items-center rounded-lg'
          style={{ width: Dimensions.get('window').width * 0.3, backgroundColor: themeColors.diffrentColorOrange }}
          onPress={() => {
            setVisible(false);
            navigation.navigate('IndiviualCart', { item });
          }}
        >
          <View className='flex-row items-center justify-center'>
            <Text style={[fontstyles.number, { color: themeColors.mainTextColor }]}>
              {/* {items.reduce((total, item) => total + parseInt(item.quantity, 10), 0)} {' '}
              {items.reduce((total, item) => total + parseInt(item.quantity, 10), 0) === 1 ? 'item' : 'items'} */}
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </Text>
            <Ionicons
              style={{ transform: [{ rotate: '90deg' }], margin: -3 }}
              name="remove-outline"
              size={16}
              color={themeColors.mainTextColor}
            />
            <Text style={[fontstyles.number, { color: themeColors.mainTextColor }]}>
              ₹{totalPrice}
            </Text>
          </View>
          <Text style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>
            CheckOut
          </Text>
        </TouchableOpacity>
        <View className='items-center justify-center'>
          <TouchableOpacity
            onPress={() => removeStoreFromCart(item.name, setCartItemsNEW)}
            className='rounded-full p-1 items-center justify-center'
            style={{ backgroundColor: themeColors.componentColor }}
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
  );
};