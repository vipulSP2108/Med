import React, { useContext, useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
// import,{ FadeInUp, FadeOutUp } from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialIcons"
import Colors from "./Colors";
import TextStyles from "../Style/TextStyles";
import { ThemeContext } from "../Context/ThemeContext";

export default ToastNotification = ({ title, description, showToast }) => {
    const { themeColors, toggleTheme } = useContext(ThemeContext);

    const slideAnim = useRef(new Animated.Value(-100)).current; // Initial value for the animation
    const fontstyles = TextStyles();

    useEffect(() => {
        if (showToast) {
            // Define the slide-in animation
            const slideIn = Animated.timing(
                slideAnim,
                {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true, // Enable native driver for better performance
                }
            );

            // Define a delay
            const delay = Animated.delay(3000); // 3 seconds delay

            // Define the slide-out animation
            const slideOut = Animated.timing(
                slideAnim,
                {
                    toValue: -100,
                    duration: 250,
                    useNativeDriver: true,
                }
            );

            // Sequence the animations
            Animated.sequence([slideIn, delay, slideOut]).start();
        }
    }, [showToast]);

    return (
        <Animated.View
            // entering={FadeInUp}
            // exiting={FadeOutUp}
            className='border-l-4'
            style={{
                borderColor: themeColors.diffrentColorOrange,
                transform: [{ translateY: slideAnim }],
                top: 30,
                left: '5%',
                backgroundColor: themeColors.componentColor,
                width: '90%',
                position: 'absolute',
                borderRadius: 5,
                padding: 10,
                // gap: 10,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                shadowColor: '#003049',
                shadowOpacity: 0.4,
                shadowRadius: 2,
                shadowOffset: { width: 0, height: 1 },
                elevation: 2,
            }}
        >
            {/* <Icon name="info" size={30} color={themeColors.mainTextColor} /> */}
            <View className=' flex-auto'>
                <Text style={[fontstyles.h3, { color: themeColors.diffrentColorOrange }]}>{title}</Text>
                <Text className=' pt-3 ' style={[fontstyles.h5, { lineHeight: 19, color: themeColors.textColor }]}>{description}</Text>
            </View>
        </Animated.View>
    )
}