import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Colors from '../Components/Colors';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import TextStyles from '../Style/TextStyles';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemeContext } from '../Context/ThemeContext';

const ListCard_Self3 = ({ item, themeColors, fontstyles, index, outletsNEW }) => {
    const navigation = useNavigation();
    const [showDetails, setShowDetails] = useState(null);
    useFocusEffect(
        useCallback(() => {
            // Reset animation values or state if needed
            setShowDetails(null);
        }, [])
    );

    const navToDetails = (item) => {
        navigation.navigate("Details", { Data: item });
    };

    return (
        <Animated.View entering={FadeInDown.delay(index * 100).springify().damping(12)}>
            <TouchableOpacity onPress={() => { navToDetails(outletsNEW.find(shop => shop.name === item.items.name)) }} className='flex-row drop-shadow-2xl overflow-hidden' style={[styles.foodItemCollectionContainer, { backgroundColor: themeColors.shadowcolor, }]}>
                <LinearGradient
                    start={{ x: 0.4, y: -0.1 }} end={{ x: 0.8, y: 0.9 }}
                    colors={['transparent', themeColors.backGroundColor]}
                    className=' -ml-1 flex-1'
                >
                    <View className='p-3 flex-row'>
                        <View className=' w-14 h-14 rounded-xl overflow-hidden'>
                            <ImageBackground
                                source={item.items.image ?
                                    { uri: item.items.image, method: 'POST', headers: { Pragma: 'no-cache' } } :
                                    require('./../../assets/store.jpg')}
                                defaultSource={require('./../../assets/store.jpg')}
                                className=' w-full h-full mr-2'
                                alt="Logo"
                            >
                                {/* <LinearGradient
                start={{ x: 0.0, y: 0.25 }} end={{ x: 0.3, y: 1.1 }}
                className='overflow-hidden h-full w-full'
                colors={['transparent', themeColors.backGroundColor]}
              ></LinearGradient> */}
                            </ImageBackground>
                        </View>
                        <View className=' flex-row ml-2'>
                            <View >
                                <Text numberOfLines={1} ellipsizeMode='middle' style={[fontstyles.boldh2, { color: themeColors.mainTextColor }]} >
                                    {item.items.name}
                                </Text>
                                <View className='flex-row items-center' >
                                    <Text style={[fontstyles.h5, { color: themeColors.textColor }]} className='text-sm pt-1'>{item.items.type}</Text>
                                    {/* <Ionicons style={{ marginTop: 4, paddingHorizontal: 4 }} name="ellipse" size={5} color={themeColors.textColor} />
                                    <Text style={{ color: themeColors.textColor }} className='text-sm'>{item.items.menutype}</Text> */}
                                    <Ionicons style={{ marginTop: 4, paddingHorizontal: 4 }} name="ellipse" size={5} color={themeColors.textColor} />
                                    <Text style={[fontstyles.h5, { color: themeColors.diffrentColorPerple }]} className='text-sm pt-1'>{item.items.location}</Text>
                                </View>
                            </View>
                        </View>
                        <View className=' absolute m-3 right-0'>
                            <View className='flex-row items-center justify-end'>
                                <Text className='text-2xl' style={[fontstyles.h5, { color: themeColors.diffrentColorOrange }]}>₹</Text>
                                <Text className='text-2xl' style={[fontstyles.h3, { color: themeColors.mainTextColor }]}> {item.itemWithoutName.totalPrice}</Text>
                            </View>
                            {/* backgroundColor: themeColors.subbackGroundColor, */}
                            <TouchableOpacity onPress={() => setShowDetails(!showDetails)} className='flex-row rounded-md ' style={{ paddingVertical: 8, borderWidth: 0, borderColor: themeColors.diffrentColorOrange }}>
                                <Text style={[fontstyles.number, { color: themeColors.mainTextColor }]}>
                                    {item.items.orders.length} {item.items.orders.length > 1 ? 'items' : 'item'}
                                </Text>
                                <View className=' items-end justify-end ml-1 '>
                                    {/* <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { color: themeColors.textColor }]} className='underline mr-1'>view full order</Text> */}
                                    <Ionicons className=' bottom-0 right-0' name={showDetails ? 'caret-up' : 'caret-down'} size={16} color={themeColors.diffrentColorOrange} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {showDetails && item.items.orders.map((cartItem, index) => (
                        <TouchableOpacity key={`${index}_${cartItem.id}`}
                        // onPress={() => navigation.navigate('YettoUpdate')}
                        >
                            <View className='px-3 flex-row justify-between items-center'>
                                <View className='flex-row py-2'>
                                    <View className=' w-14 h-12 rounded-l-xl overflow-hidden'>
                                        <ImageBackground
                                            source={{
                                                uri: cartItem.image, // item.image,
                                                method: 'POST',
                                                headers: {
                                                    Pragma: 'no-cache',
                                                },
                                            }}
                                            defaultSource={require('./../../assets/menu.jpg')}
                                            className=' w-full h-full mr-2'
                                            alt="Logo"
                                        >
                                            {/* <LinearGradient
                                        start={{ x: 0.0, y: 0.25 }} end={{ x: 0.3, y: 1.1 }}
                                        className='overflow-hidden h-full w-full'
                                        colors={['transparent', 'black']}
                                      /> */}
                                        </ImageBackground>
                                    </View>
                                    <View className=' w-36 h-12 rounded-r-xl pl-3 pr-5 flex-row items-center' style={{ backgroundColor: themeColors.subbackGroundColor, marginLeft: 4 }}>
                                        <Text style={[fontstyles.h4, { color: themeColors.diffrentColorOrange }]}>₹</Text>
                                        <Text style={[fontstyles.boldh2, { color: themeColors.mainTextColor }]}>  {cartItem.price}</Text>
                                    </View>
                                </View>
                                <View className='h-14 rounded-r-xl pl-3 pr-5 flex-row items-center' style={{ marginLeft: 4 }}>
                                    <Text style={[fontstyles.boldh2, { color: themeColors.diffrentColorOrange }]}>X</Text>
                                    <Text style={[fontstyles.boldh2, { color: themeColors.mainTextColor }]}>  {cartItem.quantity}</Text>
                                </View>
                                <Text style={[fontstyles.boldh2, { color: themeColors.diffrentColorOrange }]}>{cartItem.price * cartItem.quantity}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}

                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default function History() {
    const { themeColors, toggleTheme } = useContext(ThemeContext);
    const { History, setHistory, outletsNEW } = useContext(GlobalStateContext);
    const fontstyles = TextStyles();
    var dateG;
    console.log(History)

    return (
        <View className='h-full w-full mb-6 px-4' style={{ backgroundColor: themeColors.backGroundColor }}>
            <StatusBar backgroundColor={themeColors.subbackGroundColor} />
            <ScrollView showsVerticalScrollIndicator={false}>
                {History.length == 0 ? (
                    <View className=" flex h-full mt-36 w-full justify-center items-center p-2 " >
                        {/* <Ionicons name={'thumbs-down'} size={42} color={themeColors.mainTextColor} />
                        <Text className="font-black text-xl text-center py-3" style={{ color: themeColors.mainTextColor }}>
                            No Orders Yet? Seriously?
                        </Text>
                        <Text className="font-normal text-base text-center" style={{ color: themeColors.textColor }}>
                            You haven't placed any orders yet. Don't miss out on our amazing items! Go ahead and fill up this space with delicious memories!
                        </Text> */}
                        <Ionicons name={'sync'} size={42} color={themeColors.mainTextColor} />
                        <Text className="font-black text-xl text-center py-3" style={{ color: themeColors.mainTextColor }}>
                            New Features Coming Soon!
                        </Text>
                        <Text className="font-normal text-base text-center" style={{ color: themeColors.textColor }}>
                            We're working hard to bring you new and exciting updates! Stay tuned – amazing things are on their way!
                        </Text>
                    </View>
                ) : (
                    History.map((item, index) => {
                        if (dateG != item.itemWithoutName.date) {
                            dateG = item.itemWithoutName.date
                            return (
                                <View key={index}>
                                    <View className="mt-6">
                                        <View>
                                            <Text className=' text-center' style={[fontstyles.blackh2, { color: themeColors.mainTextColor }]}>
                                                Date
                                            </Text>
                                            <Text className=' text-center' style={[fontstyles.h4, { color: themeColors.textColor }]}>
                                                {item.itemWithoutName.date}
                                            </Text>
                                        </View>
                                        {/* <View className="flex-row justify-between -mb-2">
                                            <View>
                                                <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor }]}>
                                                    Date
                                                </Text>
                                                <Text style={[fontstyles.h4, { color: themeColors.textColor }]}>
                                                    {new Date(item.itemWithoutName.date.replace(/(\d)(st|nd|rd|th)/, '$1')).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </Text>
                                            </View>
                                            <View className="items-end">
                                                <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor }]}>
                                                    Total Amount
                                                </Text>
                                                <Text style={[fontstyles.number, { fontSize: 16, color: themeColors.diffrentColorOrange }]}>
                                                    ₹ {item.itemWithoutName.totalPrice}
                                                </Text>
                                            </View>
                                        </View> */}
                                    </View>
                                    <ListCard_Self3 item={item} themeColors={themeColors} fontstyles={fontstyles} index={index} outletsNEW={outletsNEW} /> {/* Render the ListCard_Self3 */}
                                </View>
                            );
                        }

                        // If the date matches, render ListCard_Self3 without the "Order Status" block
                        return <ListCard_Self3 key={index} themeColors={themeColors} item={item} fontstyles={fontstyles} index={index} outletsNEW={outletsNEW} />;
                    })
                )}

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    foodItemCollectionContainer: {
        marginTop: Dimensions.get('window').height * 0.02,
        gap: Dimensions.get('window').width * 0.04,
        borderRadius: 18,
        elevation: 10,
    },
})