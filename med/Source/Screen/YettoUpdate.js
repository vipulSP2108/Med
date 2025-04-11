import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Make sure to install this package if you haven't already
import Colors from "../Components/Colors";
import TextStyles from '../Style/TextStyles';
import { ThemeContext } from '../Context/ThemeContext';
import React, { useContext } from 'react'

export default function YettoUpdate() {
  const fontstyles = TextStyles();
    const { themeColors, toggleTheme } = useContext(ThemeContext);

  return (
    <View className=' flex-1 justify-center items-center p-2' style={{backgroundColor: themeColors.backGroundColor}}>
      {/* <MaterialIcons name="construction" size={64} color="gray" /> */}
      
      <Ionicons name={'paw'} size={42} color={themeColors.mainTextColor} />
      <Text className='text-center py-3' style={[fontstyles.blackh2, {color: themeColors.mainTextColor}]}>We're Working on It!</Text>
      <Text className='text-center' style={[fontstyles.h4, {color: themeColors.textColor}]}>
        This section is under development. We're working hard to bring you new features. Stay tuned!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
});
