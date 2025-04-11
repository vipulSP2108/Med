import { View, Text } from 'react-native';
import React, { useContext } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from './Colors';
import { ThemeContext } from '../Context/ThemeContext';

export default function LongStarIcon({ rating, ratingcount, border, gaps, size, backGround }) {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 != 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;
    const { themeColors, toggleTheme } = useContext(ThemeContext);

    return (
        <View style={{ padding: 1, gap: gaps ? gaps : 1, backgroundColor: backGround ? backGround : themeColors.secComponentColor }} className=' px-1 flex-row items-center rounded-md'>
            {[...Array(fullStars)].map((_, index) => (
                <Ionicons key={`full-${index}`} name={'star'} size={size ? size : 14} color={themeColors.diffrentColorYellow} />
            ))}
            {halfStars === 1 && (
                <Ionicons key={`half`} name={'star-half'} size={size ? size : 14} color={'#F4BE1B'} />
            )}
            {[...Array(emptyStars)].map((_, index) => (
                <Ionicons key={`empty-${index}`} name={'star-outline'} size={size ? size : 14} color={'#BCBDBB'} />
            ))}
            {/* <Text style={{ marginLeft: 4 }}>{rating}</Text> */}
        </View>
    );
}
