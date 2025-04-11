import React, { useContext, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from './Colors';
import TextStyles from '../Style/TextStyles';
import { ThemeContext } from '../Context/ThemeContext';

const CheckOut = ({ item, navigation, quantityEs, index }) => {
    const fontstyles = TextStyles();
    const { themeColors, toggleTheme } = useContext(ThemeContext);
    // Create an animated value for the slide-in effect
    const slideAnim = useRef(new Animated.Value(-300)).current; // Start offscreen (to the left)
    const backgroundAnim = useRef(new Animated.Value(0)).current; // Start background with no width

    
    useEffect(() => {
        // Start the animation when the component is mounted
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0, // End at normal position (centered)
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(backgroundAnim, {
                toValue: 1, // Full width of the background
                duration: 500,
                useNativeDriver: false, // We can't animate width with useNativeDriver
            }),
        ]).start();
    }, []);

    return (
        <TouchableOpacity
            className=' bg-transparent'
            key={`${index}`}
            onPress={() => navigation.navigate('IndiviualCart', { item })}
        >
            <Animated.View
                className="flex-row items-center justify-between p-3"
                style={{
                    borderTopWidth: 2,
                    borderColor: themeColors.diffrentColorOrange,
                    backgroundColor: themeColors.diffrentColorOrangeWithBack,
                    transform: [{ translateX: slideAnim }],
                    overflow: 'hidden',
                }}
                key={`${index}_${item.id}`}
            >
                <Animated.View
                    style={{
                        width: backgroundAnim.interpolate({
                            inputRange: [0, 0.2, 0.4, 0.8,  1],
                            outputRange: ['0%', '0%', '0%', '60%', '100%'],
                        }),

                        
                        height: '100%',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                    }}
                />
                <Text
                    style={[
                        fontstyles.blackh2,
                        { color: themeColors.mainTextColor,
                            marginTop: -3,
                         },
                    ]}
                >
                    {quantityEs}
                    {quantityEs === 1 ? ' item' : ' items'} added
                </Text>
                <View className="flex-row items-center">
                    <Text
                        className=' -mt-1'
                        style={[fontstyles.h3, { color: themeColors.mainTextColor }]}
                    >
                        CheckOut
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('IndiviualCart', { item })}
                    >
                        <Ionicons
                            color={themeColors.mainTextColor}
                            name={'caret-forward-circle'}
                            size={22}
                        />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

export default CheckOut;
