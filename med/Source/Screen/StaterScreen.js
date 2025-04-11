import * as React from 'react';
import {
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Animated,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import Constants from 'expo-constants';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Colors from '../Components/Colors';
import Size from '../Components/Size';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { useContext } from 'react';
import TextStyles from '../Style/TextStyles';

const { width } = Dimensions.get('window');
const AnimatedAntDesign = Animated.createAnimatedComponent(AntDesign);
const DURATION = 1000;
const TEXT_DURATION = DURATION * 0.8;

const colors = [
  {
    initialBgColor: Colors.dark.colors.componentColor,
    bgColor: Colors.dark.colors.componentColor,
    nextBgColor: Colors.dark.colors.diffrentColorOrange,
  },
  {
    initialBgColor: Colors.dark.colors.componentColor,
    bgColor: Colors.dark.colors.diffrentColorOrange,
    nextBgColor: Colors.dark.colors.backGroundColor,
  },
  {
    initialBgColor: Colors.dark.colors.diffrentColorOrange,
    bgColor: Colors.dark.colors.backGroundColor,
    nextBgColor: Colors.dark.colors.secComponentColor,
  },
];

const quotes = [
  {
    normaltitle: 'Welcome to',
    quote: 'Foodie Fiesta! 🍔🍕🥗',
    author: "Indulge in a culinary adventure with an incredible selection of dishes from the best spots in town. Discover new flavors and enjoy your all-time favorites, all in one place!",
  },
  {
    normaltitle: "Customize 👨‍🍳🧤🍽️",
    quote: "to Your Heart's Content",
    author: 'Make every meal uniquely yours with a plethora of add-ons! Whether you crave extra cheese, spicy sauces, or a healthy side, tailor your order to perfection.',
  },
  {
    normaltitle: "Pick up your meal 📆⏳🕜👀",
    quote: "without waiting ",
    author: "Say goodbye to long waits and hello to convenience! Pick up your food exactly when you want it, ensuring it's fresh and hot every time.",
  },
];

const Circle = ({ onPress, index, quotes, animatedValue, animatedValue2 }) => {
  const { initialBgColor, nextBgColor, bgColor } = colors[index];
  const inputRange = [0, 0.001, 0.5, 0.501, 1];
  const backgroundColor = animatedValue2.interpolate({
    inputRange,
    outputRange: [
      initialBgColor,
      initialBgColor,
      initialBgColor,
      bgColor,
      bgColor,
    ],
  });

  const dotBgColor = animatedValue2.interpolate({
    inputRange: [0, 0.001, 0.5, 0.501, 0.9, 1],
    outputRange: [
      bgColor,
      bgColor,
      bgColor,
      initialBgColor,
      initialBgColor,
      nextBgColor,
    ],
  });

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        styles.container,
        { backgroundColor },
      ]}
    >
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: dotBgColor,
            transform: [
              { perspective: 200 },
              {
                rotateY: animatedValue2.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: ['0deg', '-90deg', '-180deg'],
                }),
              },
              {
                scale: animatedValue2.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 6, 1],
                }),
              },
              {
                translateX: animatedValue2.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, width * 0.01, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity onPress={onPress}>
          <Animated.View
            style={[
              styles.button,
              {
                transform: [
                  {
                    scale: animatedValue.interpolate({
                      inputRange: [0, 0.05, 0.5, 1],
                      outputRange: [1, 0, 0, 1],
                    }),
                  },
                  {
                    rotateY: animatedValue.interpolate({
                      inputRange: [0, 0.5, 0.9, 1],
                      outputRange: ['0deg', '180deg', '180deg', '180deg'],
                    }),
                  },
                ],
                opacity: animatedValue.interpolate({
                  inputRange: [0, 0.05, 0.9, 1],
                  outputRange: [1, 0, 0, 1],
                }),
              },
            ]}
          >
            <AnimatedAntDesign name='arrowright' size={28} color={'white'} />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

export default function StaterScreen() {
  const navigation = useNavigation();
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const animatedValue2 = React.useRef(new Animated.Value(0)).current;
  const sliderAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const inputRange = [...Array(quotes.length).keys()];
  const [index, setIndex] = React.useState(0);

  const { fontFamilies } = useContext(GlobalStateContext);

  const animate = (i) =>
    Animated.parallel([
      Animated.timing(sliderAnimatedValue, {
        toValue: i,
        duration: TEXT_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue2, {
        toValue: 1,
        duration: DURATION,
        useNativeDriver: false,
      }),
    ]);

  const onPress = () => {
    if (index === quotes.length - 1) {
      navigation.navigate("LoginNavigationStack");
    } else {
      animatedValue.setValue(0);
      animatedValue2.setValue(0);
      animate((index + 1) % colors.length).start();
      setIndex((index + 1) % colors.length);
    }
  };
  if (!fontFamilies) {
    return null;
  }

  const fontstyles = TextStyles();

  return (
    <View className='w-full h-full pt-32'>
      {/* <StatusBar hidden /> */}
      <Circle
        index={index}
        onPress={onPress}
        quotes={quotes}
        animatedValue={animatedValue}
        animatedValue2={animatedValue2}
      />
      <Animated.View
        style={{
          flexDirection: 'row',
          transform: [
            {
              translateX: sliderAnimatedValue.interpolate({
                inputRange,
                outputRange: quotes.map((_, i) => -i * width * 2),
              }),
            },
          ],
          opacity: sliderAnimatedValue.interpolate({
            inputRange: [...Array(quotes.length * 2 + 1).keys()].map(
              (i) => i / 2
            ),
            outputRange: [...Array(quotes.length * 2 + 1).keys()].map((i) =>
              i % 2 === 0 ? 1 : 0
            ),
          }),
        }}
      >
        {quotes.slice(0, colors.length).map(({ quote, author, normaltitle }, i) => {
          return (
            <View className='p-3' style={{ paddingRight: width, width: width * 2 }} key={i}>
                <StatusBar backgroundColor='transparent'/>

              <Text
                style={[fontstyles.entryUpper, {color: colors[i].nextBgColor }]}
              >
                {normaltitle}
              </Text>
              <Text
                className=' pt-1'  style={[fontstyles.h1, {color: colors[i].nextBgColor }]}
              >
                {quote}
              </Text>
              <Text
                className=' pt-5'
                style={[fontstyles.h3, {
                  color: Colors.dark.colors.mainTextColor,
                }]}
              >
                {author}
              </Text>
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingTop: Constants.statusBarHeight,
    padding: 8,
    paddingBottom: 50,
  },
  button: {
    height: 70,
    width: 70,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    marginRight: 20,
    backgroundColor: 'turquoise',
    width: 70,
    height: 70,
    borderRadius: 50,
  },
});
