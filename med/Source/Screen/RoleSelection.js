// Seller Buyer

import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, BackHandler, Alert, StatusBar } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Colors from '../Components/Colors';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Size from '../Components/Size';
import TextStyles from '../Style/TextStyles';
import { ThemeContext } from '../Context/ThemeContext';

const SelectionScreen = () => {
  const { themeColors, toggleTheme } = useContext(ThemeContext);
  const handle_hardwareBackPress = () => {
    Alert.alert(
      "Leaving Already?",
      "Are you sure you want to miss out on the tasty experience ahead?",
      [{
        text: "No, Stay",
        onPress: () => null
      }, {
        text: "Yes, Exit",
        onPress: () => BackHandler.exitApp()
      }]);
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handle_hardwareBackPress)

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handle_hardwareBackPress)
      }
    })
  );

  const { userRole, setUserRole, fontFamilies } = useContext(GlobalStateContext);
  if (!fontFamilies) {
    return null;
  }

  const navigation = useNavigation();

  const handleSelectItem = async (item) => {
    setUserRole(item);
    await AsyncStorage.setItem('userRole', JSON.stringify(item));
  };

  const handleNavigate = () => {
    navigation.navigate('LoginScreen');
  };

  const fontstyles = TextStyles();

  return (
    <View className='p-4 pt-8 h-full' style={{ backgroundColor: themeColors.backGroundColor }}>
      <StatusBar backgroundColor={themeColors.backGroundColor} />

      <View className=' h-full justify-center'>
        <Text style={[fontstyles.entryUpper, { color: themeColors.mainTextColor }]}>Choose your</Text>
        <Text style={[fontstyles.h1, { color: themeColors.diffrentColorOrange }]}>role to continue.</Text>
        <Text className=' py-10' style={[fontstyles.h4, { color: themeColors.textColor }]}>
          Please choose your role to continue and enjoy a seamless experience tailored to your needs.
        </Text>
        <View className=' mt-10'>
          <TouchableOpacity
            className='inputContainer mt-5 flex-row items-center justify-center px-4 h-14 border-solid border-2 rounded-full'
            style={{ borderColor: userRole === 'Buyer' ? themeColors.diffrentColorOrange : themeColors.secComponentColor, backgroundColor: userRole === 'Buyer' ? themeColors.componentColor : themeColors.backGroundColor }}
            onPress={() => handleSelectItem('Buyer')}
          >
            <Text style={[fontstyles.boldh2, { color: userRole !== 'Seller' ? themeColors.mainTextColor : themeColors.textColor }]}>Buyer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='inputContainer mt-5 flex-row items-center justify-center px-4 h-14 border-solid border-2 rounded-full'
            style={{ borderColor: userRole === 'Seller' ? themeColors.diffrentColorOrange : themeColors.secComponentColor, backgroundColor: userRole === 'Seller' ? themeColors.componentColor : themeColors.backGroundColor }}
            onPress={() => handleSelectItem('Seller')}
          >
            <Text style={[fontstyles.boldh2, { color: userRole === 'Seller' ? themeColors.mainTextColor : themeColors.textColor }]}>Seller</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ borderColor: themeColors.secComponentColor, backgroundColor: themeColors.diffrentColorOrange }}
            onPress={handleNavigate}
            disabled={!userRole}
            className='inputContainer mt-8 flex-row items-center justify-center px-4 h-14 border-solid border-2 rounded-full'
          >
            <Text style={[fontstyles.boldh2, { color: themeColors.mainTextColor }]}>Procced</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SelectionScreen;