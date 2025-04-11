import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import TextStyles from '../Style/TextStyles';
import Colors from './Colors';

const BounceText = () => {
  const fontstyles = TextStyles();

  // Create a reference for translateY
  const bounceValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bounce = () => {
      Animated.loop(
        Animated.sequence([
        //   Animated.timing(bounceValue, {
        //     toValue: -10, // Move up
        //     duration: 600, // Duration of movement
        //     useNativeDriver: true,
        //   }),
          Animated.timing(bounceValue, {
            toValue: 10, // Move down
            duration: 600, // Duration of movement
            useNativeDriver: true,
          }),
          Animated.timing(bounceValue, {
            toValue: 0, // Return to normal position
            duration: 600, // Duration of movement
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    bounce(); // Start the bounce animation immediately after the component mounts
  }, [bounceValue]);

  return (
    <View className="px-4 w-full rounded-l-xl rounded-tr-xl absolute bottom-2 mb-5 flex items-center justify-center">
      <Animated.Text
        style={[
          fontstyles.h5,
          { color: Colors.dark.colors.textColor },
          { transform: [{ translateY: bounceValue }] }, // Apply the translateY bounce effect
        ]}
        className="-mt-1"
      >
        Swipe down to refresh
      </Animated.Text>
    </View>
  );
};

export default BounceText;
