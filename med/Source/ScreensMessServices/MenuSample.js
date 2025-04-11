import { StatusBar } from 'react-native';
import React, { useContext, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    Animated,
    ActivityIndicator,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import data from './data';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../Context/ThemeContext';
import TextStyles from '../Style/TextStyles';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import Colors from '../Components/Colors';

const { width, height } = Dimensions.get('window');
const LOGO_WIDTH = 220;
const LOGO_HEIGHT = 40;
const DOT_SIZE = 40;
const TICKER_HEIGHT = 40;
const CIRCLE_SIZE = width * 0.6;

export default function MenuSample({ route }) {
    const { defaultMealType, defaultDay } = route.params || {};
    const navigation = useNavigation();

    const scrollX = React.useRef(new Animated.Value(width*defaultDay)).current;

    const { themeColors, toggleTheme } = useContext(ThemeContext);
    const fontstyles = TextStyles();

    const { messMealData, userData } = useContext(GlobalStateContext)


    const [activeDay, setActiveDay] = useState(defaultDay);
    const [expandedMeal, setExpandedMeal] = useState([defaultMealType]);

    const toggleMealExpansion = (mealType) => {
        // Check if the meal type is already expanded
        if (expandedMeal.includes(mealType)) {
            // If it's expanded, remove it from the array
            setExpandedMeal(expandedMeal.filter(item => item !== mealType));
        } else {
            // If it's not expanded, add it to the array
            setExpandedMeal([...expandedMeal, mealType]);
        }
    };

    const getMealPlanData = () => {
        if (!messMealData) return [];
        const daysOfWeek = Object.keys(messMealData.breakfast_data);
        return daysOfWeek.map(day => ({
            day,
            meals: {
                breakfast: messMealData.breakfast_data[day],
                lunch: messMealData.lunch_data[day],
                snacks: messMealData.snacks_data[day],
                dinner: messMealData.dinner_data[day],
            },
        }));
    };

    const [daywiseData, setDaywiseData] = useState(getMealPlanData())

    const Ticker = ({ data, scrollX }) => {
        const inputRange = [-width, 0, width];
        const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [TICKER_HEIGHT, 0, -TICKER_HEIGHT],
        });
        return (
            <View style={[styles.tickerContainer, { backgroundColor: themeColors.statusBarColor }]}>
                <Animated.View style={{ transform: [{ translateY }] }}>
                    {data.map((day, index) => {
                        return (
                            <Text className=' w-full' style={[fontstyles.boldh2, styles.tickerText, { color: themeColors.mainTextColor }]} key={index}>
                                {day.day}
                            </Text>
                        );
                    })}
                </Animated.View>
            </View>
        );
    };

    const Pagination = ({ data, scrollX }) => {
        const inputRange = [-width, 0, width];
        const translateX = scrollX.interpolate({
            inputRange,
            outputRange: [-DOT_SIZE, 0, DOT_SIZE],
        });
        return (
            <View style={[styles.pagination]}>
                <Animated.View
                    style={[
                        styles.paginationIndicator,
                        {
                            borderColor: themeColors.diffrentColorOrange,
                            position: 'absolute',
                            // backgroundColor: 'red',
                            transform: [{ translateX }],
                        },
                    ]}
                />
                {data.map((day) => {
                    return (
                        <View key={day.day} style={styles.paginationDotContainer}>
                            {/* <View
                                style={[styles.paginationDot]}
                            /> */}
                            <Text style={[fontstyles.h5_bold, { color: 'white' }]} >{day.day.charAt(0).toUpperCase()}</Text>
                        </View>
                    );
                })}
            </View>
        );
    };

    const Circle = ({ scrollX, CIRCLE_SIZE }) => {
        return (
            <View className=' absolute bottom-0 top-0' style={[StyleSheet.absoluteFillObject, styles.circleContainer]}>
                {data.map(({ color }, index) => {
                    const inputRange = [
                        (index - 0.55) * width,
                        index * width,
                        (index + 0.55) * width,
                    ];
                    const scale = scrollX.interpolate({
                        inputRange,
                        outputRange: [0, 1, 0],
                        extrapolate: 'clamp',
                    });
                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0, 0.2, 0],
                    });
                    return (
                        <Animated.View
                            key={index}
                            style={[
                                styles.circle,
                                {
                                    width: CIRCLE_SIZE,
                                    height: CIRCLE_SIZE,
                                    borderRadius: CIRCLE_SIZE / 2,
                                    backgroundColor: color,
                                    opacity,
                                    transform: [{ scale }],
                                },
                            ]}
                        />
                    );
                })}
            </View>
        );
    };

    if (!messMealData) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView>
            <View className=' w-full' style={{ backgroundColor: themeColors.statusBarColor, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}>
                <Ticker data={daywiseData} scrollX={scrollX} />
            </View>
            <View className=' w-full' style={{ backgroundColor: themeColors.statusBarColor, position: 'absolute', bottom: -20, left: 0, right: 0, zIndex: 1 }}>
                <Pagination data={daywiseData} scrollX={scrollX} />
            </View>
            <ScrollView className=' h-full' style={{ backgroundColor: themeColors.componentColor }}>
                <View className=' pb-12' style={{ minHeight: height, backgroundColor: themeColors.backGroundColor }}
                >
                    <StatusBar barStyle={themeColors.backGroundColor == "#1C1C1E" ? 'light-content' : 'dark-content'} backgroundColor={themeColors.bottomNav} />
                    {/* <Circle scrollX={scrollX} />
                    <Circle scrollX={scrollX} />
                    <Circle scrollX={scrollX} /> */}
                    <Animated.FlatList
                        keyExtractor={(item) => item.day}
                        data={daywiseData}
                        // renderItem={({ item, index }) => (
                        //     <Item {...item} index={index} scrollX={scrollX} />
                        // )}
                        horizontal
                        pagingEnabled
                        initialScrollIndex={defaultDay} 
                        getItemLayout={(data, index) => (
                            { length: width, offset: width * index, index }
                        )}
                        showsHorizontalScrollIndicator={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: true }
                        )}
                        scrollEventThrottle={16}
                        renderItem={({ item, index }) => {
                            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
                            const inputRangeOpacity = [
                                (index - 0.5) * width,
                                index * width,
                                (index + 0.5) * width,
                            ];

                            const scale = scrollX.interpolate({
                                inputRange,
                                outputRange: [0, 1, 0],
                            });

                            const translateXHeading = scrollX.interpolate({
                                inputRange,
                                outputRange: [width * 0.1, 0, -width * 0.1],
                            });

                            const translateXDescription = scrollX.interpolate({
                                inputRange,
                                outputRange: [width * 0.7, 0, -width * 0.7],
                            });

                            const opacity = scrollX.interpolate({
                                inputRange: inputRangeOpacity,
                                outputRange: [0, 1, 0],
                            });
                            return (
                                <View className="w-screen mt-10" style={{ backgroundColor: themeColors.componentColor }} >
                                    {Object.keys(item.meals).map((mealType, index) => (
                                        <Animated.View
                                            style={[fontstyles.blackh2, styles.heading, { opacity, transform: [{ translateX: translateXHeading }], },]}
                                            // style={{ backgroundColor: themeColors.backGroundColor }} 
                                            key={mealType}>
                                            <TouchableOpacity
                                                className="my-2 border-b-2 flex-row items-center justify-between p-3"
                                                style={[{ borderColor: themeColors.mainTextColor, backgroundColor: themeColors.secComponentColor }]}
                                                onPress={() => toggleMealExpansion(mealType)}
                                            >
                                                <Animated.Text
                                                    style={[fontstyles.numberbigger, { fontSize: 16, color: themeColors.mainTextColor }]}
                                                >
                                                    {mealType.toUpperCase()}
                                                </Animated.Text>
                                                <Ionicons
                                                    color={themeColors.mainTextColor}
                                                    name={expandedMeal.includes(mealType) ? "caret-up-outline" : "caret-down-outline"}
                                                    size={20}
                                                />
                                            </TouchableOpacity>

                                            {expandedMeal.includes(mealType) && (
                                                <View className="mx-2 my-1 ">
                                                    {Object.keys(item.meals[mealType]).map((mealKey, idx) => (
                                                        <View key={idx}>
                                                            <Animated.Text
                                                                //  style={[{  },]} 
                                                                style={[
                                                                    fontstyles.h5_bold, styles.description,
                                                                    index === 3
                                                                        ? idx === item.meals[mealType].length
                                                                            ? fontstyles.h5_bold
                                                                            : idx === item.meals[mealType].length + 1
                                                                                ? fontstyles.h5_bold
                                                                                : fontstyles.h5
                                                                        : fontstyles.h5,
                                                                    {
                                                                        fontSize: 18, opacity, transform: [{ translateX: translateXDescription, },],
                                                                        color:
                                                                            index === 3
                                                                                ? idx === item.meals[mealType].length
                                                                                    ? themeColors.diffrentColorPerple
                                                                                    : idx === item.meals[mealType].length + 1
                                                                                        ? themeColors.diffrentColorRed
                                                                                        : themeColors.textColor
                                                                                : themeColors.textColor,
                                                                        padding: 2,
                                                                    },
                                                                ]}
                                                            >
                                                                {item.meals[mealType][mealKey]}
                                                            </Animated.Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            )}
                                        </Animated.View>
                                    ))}
                                </View>
                            );
                        }}


                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    itemStyle: {
        // backgroundColor: 'white',
        width,
        // height,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageStyle: {
        width: width * 0.75,
        height: width * 0.75,
        resizeMode: 'contain',
        flex: 1,
    },
    textContainer: {
        alignItems: 'flex-start',
        alignSelf: 'flex-end',
        flex: 0.5,
    },
    heading: {
        color: '#444',
        textTransform: 'uppercase',
        // fontSize: 24,
        // fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 5,
    },
    description: {
        color: '#fff',
        // fontWeight: '600',
        textAlign: 'left',
        width: width * 0.75,
        marginRight: 10,
        // fontSize: 16,
        // lineHeight: 16 * 1.5,
    },
    logo: {
        opacity: 0.9,
        height: LOGO_HEIGHT,
        width: LOGO_WIDTH,
        resizeMode: 'contain',
        position: 'absolute',
        left: 10,
        bottom: 10,
        transform: [
            { translateX: -LOGO_WIDTH / 2 },
            { translateY: -LOGO_HEIGHT / 2 },
            { rotateZ: '-90deg' },
            { translateX: LOGO_WIDTH / 2 },
            { translateY: LOGO_HEIGHT / 2 },
        ],
    },
    pagination: {
        borderRadius: 20,
        backgroundColor: 'black',
        position: 'absolute',
        right: 20,
        bottom: 40,
        flexDirection: 'row',
        height: DOT_SIZE,
    },
    paginationDot: {
        width: DOT_SIZE * 0.3,
        height: DOT_SIZE * 0.3,
        borderRadius: DOT_SIZE * 0.15,
    },
    paginationDotContainer: {
        width: DOT_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paginationIndicator: {
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
        borderWidth: 2,
    },
    tickerContainer: {
        // position: 'absolute',
        top: 8,
        // paddingVertical: 5,
        paddingLeft: 20,
        overflow: 'hidden',
        height: TICKER_HEIGHT,
    },
    tickerText: {
        paddingTop: 2,
        fontSize: TICKER_HEIGHT,
        lineHeight: TICKER_HEIGHT,
        textTransform: 'uppercase',
        // fontWeight: '800',
    },

    // circleContainer: {
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    circle: {

        position: 'absolute',
        top: '15%',
    },
});