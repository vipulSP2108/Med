import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import Colors from './Colors';
import TextStyles from '../Style/TextStyles';
import { ThemeContext } from '../Context/ThemeContext';

export default function Titles({title, width}) {
    const fontstyles = TextStyles();
              const { themeColors, toggleTheme } = useContext(ThemeContext);
    

    return (
        <View className=' flex-row items-center justify-center w-full relative'>
            <View style={[styles.line, {width: width}]} />
            <Text className=' uppercase px-3 tracking-[4]' style={[fontstyles.number, {color: themeColors.mainTextColor}]}>{title}</Text>
            <View style={[styles.line, {width: width}]} />
        </View>
    );
};

const styles = {
    line: {
        height: 3,
        backgroundColor: '#D1D5DB',
      },
}