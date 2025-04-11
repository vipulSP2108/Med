const BANNER_H = Dimensions.get('window').height * 0.50;
const Gradient_H = Dimensions.get('window').height * 0.5;

import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList, Animated, Dimensions, ImageBackground, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../Components/Colors'; // Adjust path as needed
import { API_BASE_URL, ADDOUTLET_ENDPOINT, USEROUTLETS_ENDPOINT } from '../Constants/Constants';
// import { ADDOUTLET_ENDPOINT, USEROUTLETS_ENDPOINT, API_BASE_URL // Adjust paths/constants
import SearchBox from "../Components/SearchBox";

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Titles from '../Components/Titles';
import FoodIcon from '../Components/FoodIcon';
import FoodTypeIcon from '../Components/FoodTypeIcon';
import LongStarIcon from '../Components/LongStarIcon';
import { dropDown } from '../Components/dropDown';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from '../Context/ThemeContext';

const YouRestorent = {
    "name": "Amul Store",
    "shopkippername": "Anil Mehta",
    "upiId": "amulstore@upi",
    "featured": "false",
    "type": "Veg",
    "menutype": "Dessert",
    "menu": [
        {
            "title": "Desserts",
            "items": [
                { "stutus": "true", "id": "1", "rating": "4.0", "ratingcount": "200", "item": "Amul TriCone", "price": "50", "description": "Creamy frozen dessert in various flavors.", "type": "Veg", "category": "Cold_Dessert", "image": "https://i.pinimg.com/736x/33/e6/ff/33e6ff011d887758fa255ea000d3be4c.jpg", "quantity": "0", "longdescription": "Delicious creamy ice cream in a variety of flavors, perfect for a sweet treat." },
                { "stutus": "false", "id": "2", "rating": "3.8", "ratingcount": "150", "item": "Amul Chocominis", "price": "40", "description": "Rich and indulgent chocolate.", "type": "Veg", "category": "Cold_Dessert", "image": "https://www.shutterstock.com/shutterstock/photos/1878842344/display_1500/stock-photo-india-april-chocolate-brand-amul-chocominis-1878842344.jpg", "quantity": "0", "longdescription": "Rich, bite-sized chocolates, perfect for chocolate lovers." }
            ]
        }, {
            "title": "Beverages",
            "items": [
                { "stutus": "true", "id": "1", "rating": "4.2", "ratingcount": "250", "item": "Amul Kool", "price": "70", "description": "Refreshing shake made with milk and flavorings.", "type": "Veg", "category": "Cold_Beverage", "image": "https://www.shutterstock.com/shutterstock/photos/1257639893/display_1500/stock-photo-pune-india-september-amul-kool-on-white-background-shot-in-studio-1257639893.jpg", "quantity": "0", "longdescription": "Refreshing milk-based drink available in various flavors." }
            ]
        }, {
            "title": "Beveragess",
            "items": [
                { "stutus": "true", "id": "1", "rating": "4.2", "ratingcount": "250", "item": "Amul Kool", "price": "70", "description": "Refreshing shake made with milk and flavorings.", "type": "Veg", "category": "Cold_Beverage", "image": "https://www.shutterstock.com/shutterstock/photos/1257639893/display_1500/stock-photo-pune-india-september-amul-kool-on-white-background-shot-in-studio-1257639893.jpg", "quantity": "0", "longdescription": "Refreshing milk-based drink available in various flavors." }
            ]
        }, {
            "title": "Beverwages",
            "items": [
                { "stutus": "true", "id": "1", "rating": "4.2", "ratingcount": "250", "item": "Amul Kool", "price": "70", "description": "Refreshing shake made with milk and flavorings.", "type": "Veg", "category": "Cold_Beverage", "image": "https://www.shutterstock.com/shutterstock/photos/1257639893/display_1500/stock-photo-pune-india-september-amul-kool-on-white-background-shot-in-studio-1257639893.jpg", "quantity": "0", "longdescription": "Refreshing milk-based drink available in various flavors." }
            ]
        }, {
            "title": "Beveragaes",
            "items": [
                { "stutus": "true", "id": "1", "rating": "4.2", "ratingcount": "250", "item": "Amul Kool", "price": "70", "description": "Refreshing shake made with milk and flavorings.", "type": "Veg", "category": "Cold_Beverage", "image": "https://www.shutterstock.com/shutterstock/photos/1257639893/display_1500/stock-photo-pune-india-september-amul-kool-on-white-background-shot-in-studio-1257639893.jpg", "quantity": "0", "longdescription": "Refreshing milk-based drink available in various flavors." }
            ]
        }
    ],
    "location": "Emiet Hostel",
    "locationdetailed": "Emiet Hostel",
    "rating": "4.0",
    "ratingcount": "300",
    "image": "https://www.iitgn.ac.in/student/lifeoncampus/facilities/images/thumb/amulstore.jpg",
    "details": "The Amul Store at the campus is a one-stop shop for a variety of dairy products including milk, cheese, ice cream, and other popular Amul products.",
    "openingtime": "10:00 am",
    "closingtime": "10:00 pm",
    "offdays": "None",
    "leaveDay": "None"
}

export default function Details_Seller({ navigation, handleChange }) {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [cuisine, setCuisine] = useState('');
const { themeColors, toggleTheme } = useContext(ThemeContext);
    // const [outlets, setOutlets] = useState([]);

    // useEffect(() => {
    //     getUserOutlets();
    // }, []);

    // const getUserOutlets = async () => {
    //     try {
    //         const token = await AsyncStorage.getItem("token");
    //         const response = await fetch(`${API_BASE_URL}:${USEROUTLETS_ENDPOINT}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ token: token })
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok ' + response.statusText);
    //         }

    //         const data = await response.json();
    //         setOutlets(data.data);
    //     } catch (error) {
    //         console.error('Error fetching user outlets:', error);
    //     }
    // };

    const [outlets, setOutlets] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            getUserOutlets();
        }, [])
    );

    const getUserOutlets = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}:${USEROUTLETS_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: token })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const data = await response.json();
            setOutlets(data.data);
        } catch (error) {
            console.error('Error fetching user outlets:', error);
        }
    };

    // const handleSubmit = async () => {
    //     if (!name || !location || !cuisine) {
    //         Alert.alert("All fields are required");
    //         return;
    //     }

    //     try {
    //         const token = await AsyncStorage.getItem("token");
    //         const OutletData = { name, location, cuisine, token };

    //         const response = await fetch(`${API_BASE_URL}:${ADDOUTLET_ENDPOINT}`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify(OutletData)
    //         });

    //         const data = await response.json();
    //         if (data.status === "ok") {
    //             Alert.alert("Outlet added successfully");
    //             getUserOutlets(); // Refresh the outlets list
    //         } else {
    //             Alert.alert(data.data);
    //         }
    //     } catch (error) {
    //         console.error("Error adding outlet:", error);
    //     }
    // };

    // const scrollA = useRef(new Animated.Value(0)).current;

    const [openDropdowns, setOpenDropdowns] = useState(() => {
        const initialDropdowns = {};
        // Initialize all dropdowns to be open
        if (Array.isArray(YouRestorent)) {
            menuItems.forEach(menu => {
                initialDropdowns[menu.title] = true;
            })
        };
        // setVisible(true);
        return initialDropdowns;
    });

    const navToEditRestorent = () => {
        navigation.navigate('EditMain', { outlet: outlets[0] })
        // navigation.navigate('EditRestorent')
    }

    const navToEditMain = () => {
        navigation.navigate('EditMain', { outlet: null })
    }

    return (

        <View style={[styles.verticalScrollContainer, {backgroundColor: themeColors.backGroundColor}]}>
            {/* ---------------------- Added ---------------------- */}

            <View style={{ height: Dimensions.get('window').height * 0.08 }}>
                <Titles title={"Your Offerings"} width={60} />
            </View>

            <View className='searchBodyContainer flex-row justify-between my-3' style={{ marginHorizontal: Dimensions.get('window').width * 0.03 }}>
                <TouchableOpacity className='w-[83%]' onPress={() => show_UpModelScreen()}>
                    <SearchBox />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('YettoUpdate')}>
                    <Ionicons color={themeColors.diffrentColorOrange} name="mic" size={24} className='searchIcon' style={{ backgroundColor: themeColors.secComponentColor, borderRadius: 15, width: 50, height: 50, textAlign: 'center', textAlignVertical: 'center' }} />
                </TouchableOpacity>
            </View>
            <View className='flex-row gap-x-2 py-4 px-2 mt-3'>
                <View className='flex-row justify-center items-center rounded-xl py-2 px-2' style={{ borderColor: themeColors.textColor, borderWidth: 1 }}>
                    <Text className='font-semibold text-base' style={{ color: themeColors.mainTextColor }}>All Items </Text>
                    <Text className='font-light text-sm' style={{ color: themeColors.textColor }}>(12)</Text>
                    {/* <Ionicons name="options-outline" size={18} color={themeColors.mainTextColor} /> */}
                </View>
                <View className='flex-row justify-center items-center rounded-xl py-2 px-2' style={{ borderColor: themeColors.textColor, borderWidth: 1 }}>
                    <Text className='font-semibold text-base' style={{ color: themeColors.mainTextColor }}>In Stock </Text>
                    <Text className='font-light text-sm' style={{ color: themeColors.textColor }}>(12)</Text>
                </View>
                <View className='flex-row justify-center items-center rounded-xl py-1 px-2' style={{ borderColor: themeColors.textColor, borderWidth: 1 }}>
                    <Text className='font-semibold text-base' style={{ color: themeColors.mainTextColor }}>Sold Out </Text>
                    <Text className='font-light text-sm' style={{ color: themeColors.textColor }}>(12)</Text>
                </View>
            </View>

            <FlatList
                data={outlets.map(outlet => outlet.menu).flat()} // Flattening the menu arrays of all outlets into a single array
                renderItem={({ item }) => dropDown(themeColors, item, navigation, setOpenDropdowns, openDropdowns, handleChange)}
                keyExtractor={(item, index) => index.toString()} // Example key extractor, adjust as needed
                showsHorizontalScrollIndicator={false}
            />
            {/* ---------------------- Added ---------------------- */}
        </View>
    );

    // return (
    //     <View style={{ backgroundColor: themeColors.backGroundColor }}>
    //         <ListCard_Self2 item={YouRestorent} />
    //     </View>
    //     // <View style={styles.container}>
    //     //     <TextInput
    //     //         style={styles.textInput}
    //     //         placeholder="Enter Outlet Name"
    //     //         placeholderTextColor={themeColors.textColor}
    //     //         value={name}
    //     //         onChangeText={setName}
    //     //     />
    //     //     <TextInput
    //     //         style={styles.textInput}
    //     //         placeholder="Enter Location"
    //     //         placeholderTextColor={themeColors.textColor}
    //     //         value={location}
    //     //         onChangeText={setLocation}
    //     //     />
    //     //     <TextInput
    //     //         style={styles.textInput}
    //     //         placeholder="Enter Cuisine"
    //     //         placeholderTextColor={themeColors.textColor}
    //     //         value={cuisine}
    //     //         onChangeText={setCuisine}
    //     //     />
    //     //     <TouchableOpacity onPress={handleSubmit} style={styles.addButton}>
    //     //         <Text style={styles.addButtonText}>ADD</Text>
    //     //     </TouchableOpacity>
    //     //     <FlatList
    //     //         data={outlets}
    //     //         keyExtractor={(item) => item._id}
    //     //         renderItem={({ item }) => (
    //     //             <View style={styles.outletItem}>
    //     //                 <Text style={styles.outletText}>{item.name} - {item.location} - {item.cuisine}</Text>
    //     //             </View>
    //     //         )}
    //     //     />
    //     // </View>
    // );
}

const styles = StyleSheet.create({
    // descriptionText: {
    //     fontSize: 14,
    //     color: '#666',
    // },
    // button: {
    //     borderRadius: 8,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     // paddingVertical: 8, // Adjust padding instead of fixed height
    //     // paddingHorizontal: 10, // Add padding for horizontal space
    //     // backgroundColor: '#114232',
    // },
    // container: {
    //     flex: 1,
    //     backgroundColor: 'black',
    //     padding: 20,
    // },
    // textInput: {
    //     height: 40,
    //     borderColor: 'gray',
    //     borderWidth: 1,
    //     borderRadius: 5,
    //     marginBottom: 10,
    //     paddingHorizontal: 10,
    //     color: 'white',
    // },
    // addButton: {
    //     backgroundColor: themeColors.diffrentColorOrange,
    //     borderRadius: 10,
    //     paddingVertical: 15,
    //     alignItems: 'center',
    // },
    // addButtonText: {
    //     fontSize: 18,
    //     fontWeight: 'bold',
    //     color: themeColors.mainTextColor,
    // },
    // outletItem: {
    //     backgroundColor: 'grey',
    //     padding: 10,
    //     marginVertical: 5,
    //     borderRadius: 5,
    // },
    // outletText: {
    //     color: 'white',
    // },
    // // shadowProp: {
    //     // backgroundColor: 'rgba(180, 180, 180, 0.1)',
    //     // shadowOffset: {
    //     //   width: 0,
    //     //   height: 12,
    //     // },
    //     // shadowOpacity: 0.58,
    //     // shadowRadius: 16.00,
    //     elevation: 30,

    // },
    verticalScrollContainer: {
        // marginTop: Dimensions.get('window').height * 0.1,
        // minHeight: Dimensions.get('window').height * 3,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flex: 1,
        // backgroundColor: 'white',
        // , // bg color
    },

    banner: scrollA => ({
        height: BANNER_H,
        backGroundColor: 'red',
        width: '200%',
        transform: [
            {
                translateY: scrollA.interpolate({
                    inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H],
                    outputRange: [-0, 0, BANNER_H * 0.99, -BANNER_H * 0.5], // Adjust to bring back into view
                }),
            },
            // {
            //   scale: scrollA.interpolate({
            //     inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H + 1],
            //     outputRange: [2, 1, 0.5, 0.5],
            //   }),
            // },
        ],
    }),
});
