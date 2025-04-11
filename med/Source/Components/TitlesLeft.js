import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import Colors from './Colors'
import { ThemeContext } from '../Context/ThemeContext';

export default function TitlesLeft({ fontstyles, title, height, color }) {
  const { themeColors, toggleTheme } = useContext(ThemeContext);

  return (
    <View className=' flex-row items-center justify-center w-full relative pt-3'>
      <Text className=' uppercase pr-3 tracking-[4]' style={[fontstyles.number, { color: themeColors.mainTextColor }]}>{title}</Text>
      <View style={{ height: height, backgroundColor: color, flex: 1 }} />
    </View>
  )
}