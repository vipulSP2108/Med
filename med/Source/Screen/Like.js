import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import React, { useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../Components/Colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import TextStyles from '../Style/TextStyles';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import ModelScreen from './ModelScreen';
import UpModelScreen from './UpModelScreen';
import { FirstStoreComponent } from '../Components/CartMainContainor';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { ThemeContext } from '../Context/ThemeContext';

export default function Like() {
  const [likedItems, setLikedItems] = useState([]);
  const navigation = useNavigation();
  const fontstyles = TextStyles();
  const { cartItemsNEW } = useContext(GlobalStateContext);
const { themeColors, toggleTheme } = useContext(ThemeContext);
  const [type, settype] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      const fetchLikedItems = async () => {
        const likedItems = JSON.parse(await AsyncStorage.getItem('likedItems')) || [];
        setLikedItems(likedItems);
      };

      fetchLikedItems();
    }, [])
  );

  const { show, hide, RenderModel } = ModelScreen();
  const { show_UpModelScreen, hide_UpModelScreen, RenderModel_UpModelScreen } = UpModelScreen();

  const renderItem2 = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index}
        style={{
          marginVertical: 10,
          marginHorizontal: 8,
          borderRadius: 12,
          backgroundColor: themeColors.componentColor,
        }}
        className=' w-[44%] items-center justify-center p-3 overflow-hidden'
        onPress={() => {
          navigation.navigate('DetailView', { Data: item.data, dataWithoutMenu: item.dataHotel })
          // navigation.navigate("Details", { Data: outletsNEW.find(shop => shop.name === item.storename), initialIndex: 1 });
        }}
      >
        <ImageBackground
          source={item.data.image ?
            { uri: item.data.image, method: 'POST', headers: { Pragma: 'no-cache' } } :
            require('./../../assets/menu.jpg')}
          defaultSource={require('./../../assets/menu.jpg')}
          className=' w-full rounded-md overflow-hidden'
          alt="Logo"
          resizeMode='cover'
          style={{ height: Dimensions.get('window').height * 0.14, flex: 1, justifyContent: 'center' }}
        >
          <LinearGradient
            start={{ x: 0.0, y: 0.25 }} end={{ x: 0.3, y: 1.1 }}
            className='overflow-hidden h-full w-full'
            colors={['transparent', themeColors.secComponentColor]}
          >
          </LinearGradient>
          <View className='absolute bottom-2 right-2'>
            <View className='flex-row justify-center items-center'>
              {item.data.type === "PureVeg" && <Ionicons name="leaf" size={16} color={themeColors.diffrentColorGreen} />}
              <Text className='ml-1' style={[fontstyles.h5, { color: themeColors.textColor }]}>{item.data.type}</Text>
            </View>
          </View>
        </ImageBackground>
        <View className='items-start mt-2'>
          <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h3, { fontSize: 21, color: themeColors.mainTextColor }]}>{item.data.item}</Text>
          <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { fontSize: 18, color: themeColors.textColor }]}>{item.dataHotel.name}</Text>
          {/* <Text className=' leading-3 pt-2' style={[fontstyles.h6, { color: themeColors.textColor }]}>{item.description}</Text> */}
          <View className=' flex-row justify-between w-full'>
            <View className='flex-1 justify-end mt-3'>
              <Text style={[fontstyles.number, { color: themeColors.mainTextColor }]}>
                ₹{item.data.price}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ borderTopLeftRadius: 12, backgroundColor: themeColors.diffrentColorOrange }} className=' w-12 h-12 absolute right-0 bottom-0 items-center justify-center'>
          <Text style={{ color: 'white' }} className=' text-2xl font-black'>+</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: themeColors.backGroundColor, flex: 1 }}>
      <StatusBar 
      backgroundColor={themeColors.statusBarColor}
      // backgroundColor={}
      />
      <ScrollView style={{ paddingHorizontal: 12 }} contentContainerStyle={{ paddingTop: 20 }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          {likedItems.length > 0 ? (
            likedItems.map((item, index) => renderItem2({ item, index }))
          ) : (
            <Text style={[fontstyles.h3, { color: themeColors.textColor, textAlign: 'center' }]}>
              You have no liked items yet.
            </Text>
          )}
        </View>
      </ScrollView>

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
      {RenderModel({ type: { type } })}
      {RenderModel_UpModelScreen()}
    </SafeAreaView>
  );
}
