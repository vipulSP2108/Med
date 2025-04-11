import React, { useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { ThemeContext } from '../Context/ThemeContext';
import TextStyles from '../Style/TextStyles';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import getFormattedRatingCount from '../Components/getFormattedRatingCount';
import { useNavigation } from '@react-navigation/native';

const MessMenu = ({route}) => {
    const { defaultMealType, defaultDay } = route.params || {}; 
    const navigation = useNavigation();

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
            <View className=' h-full' style={{ backgroundColor: themeColors.backGroundColor }}>
                <StatusBar barStyle={themeColors.backGroundColor == "#1C1C1E" ? 'light-content' : 'dark-content'} backgroundColor={themeColors.bottomNav} />
                <FlatList
                    data={[getMealPlanData()[activeDay]]}
                    keyExtractor={(item) => item.day}
                    renderItem={({ item }) => (
                        <View>
                            {Object.keys(item.meals).map((mealType, index) => (
                                <View
                                    // ref={(ref) => (dropdownRefs.current[ind] = ref)} // Set the ref for each dropdown section
                                    style={{ backgroundColor: themeColors.backGroundColor }}
                                >
                                    <TouchableOpacity className=' my-2 border-b-2 flex-row items-center justify-between p-3' style={[{ borderColor: themeColors.mainTextColor, backgroundColor: themeColors.secComponentColor }]} onPress={() => toggleMealExpansion(mealType)}>
                                        <Text style={[fontstyles.numberbigger, { fontSize: 16, color: themeColors.mainTextColor }]}>{mealType.toUpperCase()}</Text>
                                        <Ionicons color={themeColors.mainTextColor} name={expandedMeal.includes(mealType) ? "caret-up-outline" : "caret-down-outline"} size={20} />
                                    </TouchableOpacity>
                                    {expandedMeal.includes(mealType) && (
                                        <View className=' mx-2 my-1'>
                                            {Object.keys(item.meals[mealType]).map((mealKey, idx) => (
                                                <View key={idx}>
                                                    <Text style={[index == 3 ? idx == mealType.length ? fontstyles.h5_bold : idx == mealType.length + 1 ? fontstyles.h5_bold : fontstyles.h5 : fontstyles.h5, {color: index == 3 ? idx == mealType.length ? themeColors.diffrentColorPerple : idx == mealType.length + 1 ? themeColors.diffrentColorRed : themeColors.textColor : themeColors.textColor, padding: 2}]}>
                                                        {/* <Text style={[fontstyles.numberbigger, {color: themeColors.mainTextColor}]}>{mealKey}: </Text> */}
                                                        {item.meals[mealType][mealKey]}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}
                    ListFooterComponent={
                        <View className='p-3 mb-36' style={{ backgroundColor: themeColors.backGroundColor, }}>
                            <View className='gap-3' >
                                <Text style={[fontstyles.boldh2, { color: themeColors.textColor }]}>
                                    Disclaimer:
                                </Text>
                                <Text style={[fontstyles.number, { color: themeColors.textColor }]}>
                                    Be mindful of portion sizes, especially when dining out, as restaurant portions are often larger than necessary.
                                </Text>
                                <Text style={[fontstyles.number, { color: themeColors.textColor }]}>
                                    Not all fats are bad. Omega-3 fatty acids, found in fish, flaxseeds, and walnuts, are beneficial for heart health.
                                </Text>
                                <Text style={[fontstyles.number, { color: themeColors.textColor }]}>
                                    The average adult needs about 8 cups (2 liters) of water per day, but individual needs may vary based on activity level, climate, and overall health.
                                </Text>
                                <Text style={[fontstyles.number, { color: themeColors.textColor }]}>
                                    An average active adult requires 2,000 kcal of energy per day; however, calorie needs may vary.
                                </Text>
                            </View>
                            <View className='mt-7' style={{ height: 1, backgroundColor: themeColors.textColor }} />
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("ComplaintOfOutlet", {
                                        userId: userData.userId,
                                        name: userData.name
                                    });
                                }}
                                className='flex-row justify-between items-center py-3'
                            >
                                <View className='flex-row items-center'>
                                    <Ionicons color={'red'} name={'alert-circle-outline'} size={22} />
                                    <Text style={[fontstyles.h4, { color: 'red' }]}> Report an issue with the menu</Text>
                                </View>
                                <Ionicons color={'red'} name={'caret-forward-outline'} size={22} />
                            </TouchableOpacity>
                            <View className='mb-7' style={{ height: 1, backgroundColor: themeColors.textColor }} />
                        </View>
                    }
                />

                <View className='absolute bottom-0 w-full'>
                    <View className={`w-full bottom-0 border-t-2 flex-row items-center justify-between`} style={[{ height: Dimensions.get('window').height * 0.08, borderColor: themeColors.mainTextColor, backgroundColor: themeColors.componentColor }]}>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            data={getMealPlanData()}
                            keyExtractor={(item) => item.day}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    key={`${index}_${item.day}`}
                                    className=' p-4'
                                    onPress={() => setActiveDay(index)}
                                >
                                    <Text
                                        style={[fontstyles.h3, {
                                            marginTop: -8, color: activeDay == index ? themeColors.diffrentColorPerple : themeColors.textColor
                                        }]}
                                    >
                                        {item.day}
                                    </Text>
                                    {/* <View className='absolute flex bg-slate-950 h-4 w-16 -bottom-3 rounded-lg items-center justify-center'/> */}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 10,
    },
    mealType: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dropdown: {
        marginTop: 5,
        paddingLeft: 15,
    },
    mealKey: {
        fontWeight: 'bold',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MessMenu;