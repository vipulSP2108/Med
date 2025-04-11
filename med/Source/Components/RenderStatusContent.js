import React, { useContext } from 'react';
import { TouchableOpacity, Image, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from './Colors';
import { ThemeContext } from '../Context/ThemeContext';

export default RenderStatusContent = ({ item, selected, setSelected }) => {
    const { themeColors, toggleTheme } = useContext(ThemeContext);
    return(
    <TouchableOpacity
        onPress={() => setSelected(item.status)}
        className="rounded-lg items-center px-3 py-4 mb-3 overflow-hidden flex-row"
        style={{ backgroundColor: selected === item.name ? themeColors.textColor : themeColors.secComponentColor }}
    >
        <Ionicons name={selected === item.name ? 'radio-button-on-outline' : 'radio-button-off-outline'} size={20} color={selected === item.name ? themeColors.backGroundColor : themeColors.mainTextColor} />
        <Text className="font-black text-xl" style={{ color: selected === item.name ? themeColors.backGroundColor : themeColors.mainTextColor }}>
            {` ${item.status}`}
        </Text>
    </TouchableOpacity>
);}