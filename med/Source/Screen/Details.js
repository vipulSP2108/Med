import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView, Dimensions, ImageBackground, Modal, BackHandler, StatusBar, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import FoodIcon from '../Components/FoodIcon';
import FoodTypeIcon from '../Components/FoodTypeIcon';
import Colors from '../Components/Colors';
import TruncatedTextComponent from '../Components/TruncatedTextComponent';
import LongStarIcon from '../Components/LongStarIcon';
import { LinearGradient } from 'expo-linear-gradient';
import useShopStatus from '../Components/useShopStatus';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ModelScreen from './ModelScreen';

import { createShimmerPlaceHolder } from 'expo-shimmer-placeholder'
import { loadingScreenTxt } from '../Data/loadingScreenTxt';
import useIncrementHandler, { handleIncrement } from '../Components/handleIncrement';
import TextStyles from '../Style/TextStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckOut from '../Components/Checkout';
import { ThemeContext } from '../Context/ThemeContext';
import getFormattedRatingCount from '../Components/getFormattedRatingCount';
const ShimmerPlaceholder = createShimmerPlaceHolder(LinearGradient)

const DetailsScreen = ({ route }) => {
const { themeColors, toggleTheme } = useContext(ThemeContext);
    const { cartItemsNEW, outletsNEW, setCartItemsNEW, CartItems, setCartItems, updatedCartWithDetails } = useContext(GlobalStateContext);

    const flatListRef = useRef(null);
    const itemRefs = useRef([]);

    const dropdownRefs = useRef([]);

    const scrollViewRef = useRef(null);

    const { Data, initialIndex = 0 } = route.params || {};
    const [selectedIndex, setSelectedIndex] = useState(initialIndex);

    const handleScrollToIndex = (index) => {

        if (flatListRef.current) {
            try {
                flatListRef.current.scrollToIndex({
                    index,
                    animated: true,
                    viewPosition: 0.5
                });
            } catch (error) {
                console.error('Error scrolling to index:', error);
            }
        }
    };

    useEffect(() => {
        // handleScrollToItem(index, 1);
        handleScrollToIndex(selectedIndex)
    }, [selectedIndex]);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleScrollToIndex(selectedIndex);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // const flatListRefs = useRef([]);

    // const handleScrollToItem = (dropdownIndex, itemIndex) => {
    //     // Ensure the FlatList for the given dropdown is available
    //     const flatListRef = flatListRefs.current[dropdownIndex];
    //     if (flatListRef && itemRefs.current[dropdownIndex][itemIndex]) {
    //         // Scroll to the item in the dropdown
    //         flatListRef.scrollToIndex({
    //             index: itemIndex,
    //             animated: true,
    //         });
    //     }
    // };


    // useFocusEffect(
    //     React.useCallback(() => {
    //         const onBackPress = () => {
    //             navigation.navigate('HomeScreen'); // Replace 'Home' with your home screen route name
    //             return true; // Prevent default behavior
    //         };

    //         BackHandler.addEventListener('hardwareBackPress', onBackPress);

    //         return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    //     }, [navigation])
    // );

    const [data, setData] = useState(null);

    useEffect(() => {
        // Show shimmer initially
        setVisible(false);
        // Simulate data fetch
        setTimeout(() => {
            setData(Data); // Replace with actual data fetch
            setVisible(true);
        }, 100); // Adjust timing as necessary
    }, [Data]);
    // console.log('data', data)

    const [visible, setVisible] = React.useState(false)
    const shimmerColors = [themeColors.secComponentColor, themeColors.componentColor, themeColors.secComponentColor];

    // const show = () => setVisible(true);
    // const hide = () => setVisible(false);
    const { show, hide, RenderModel } = ModelScreen();

    const [menuItems, setMenuItems] = useState(Data.menu);
    // console.log(menuItems)
    const Shopstatus = useShopStatus(Data.openingTime, Data.closingTime, Data.offDays, Data.leaveDay);
    // const [HotelCartItems, setHotelCartItems] = useState([{hotelname}]);
    // menuItems.forEach((item) => console.log(item))

    const [openDropdowns, setOpenDropdowns] = useState(() => {
        const initialDropdowns = {};
        // Initialize all dropdowns to be open
        if (Array.isArray(menuItems)) {
            menuItems.forEach(menu => {
                initialDropdowns[menu.title] = true;
            })
        };
        // setVisible(true);
        return initialDropdowns;
    });

    // const { Openmodal, setOpenmodal, renderModal } = PopUp();

    const [vegBottom, setVegBottom] = useState(true);
    const [nonVegBottom, setNonVegBottom] = useState(true);
    const [eggBottom, setEggBottom] = useState(true);

    // Determine which filter to apply
    let filteredMenuItems = menuItems;

    if (vegBottom && nonVegBottom && eggBottom) {
        // Show all items if all categories are selected
        filteredMenuItems = menuItems;
    } else {
        // Filter based on what is selected
        filteredMenuItems = menuItems.map(item => {
            let filteredItems = item.items;

            if (vegBottom && !nonVegBottom && !eggBottom) {
                // Show only veg items
                filteredItems = filteredItems.filter(shop => shop.type === "PureVeg");
            }
            if (!vegBottom && nonVegBottom && !eggBottom) {
                // Show only non-veg items
                filteredItems = filteredItems.filter(shop => shop.type === "NonVeg");
            }
            if (!vegBottom && !nonVegBottom && eggBottom) {
                // Show only egg items (assuming Egg is a separate category)
                filteredItems = filteredItems.filter(shop => shop.type === "Veg");
            }
            if (vegBottom && nonVegBottom && !eggBottom) {
                // Show both veg and non-veg
                filteredItems = filteredItems.filter(shop => shop.type === "PureVeg" || shop.type === "NonVeg");
            }
            if (vegBottom && !nonVegBottom && eggBottom) {
                // Show both veg and egg
                filteredItems = filteredItems.filter(shop => shop.type === "PureVeg" || shop.type === "Veg");
            }
            if (!vegBottom && nonVegBottom && eggBottom) {
                // Show both non-veg and egg
                filteredItems = filteredItems.filter(shop => shop.type === "NonVeg" || shop.type === "Veg");
            }
            if (!vegBottom && !nonVegBottom && !eggBottom) {
                // Show both non-veg and egg
                filteredItems = [];
                // filteredItems = filteredItems.filter(shop => shop.type === "NonVeg" || shop.type === "Veg" || shop.type === "PureVeg")
            }
            if (!vegBottom && nonVegBottom && eggBottom) {
                // Show both non-veg and egg
                filteredItems = filteredItems.filter(shop => shop.type === "NonVeg" || shop.type === "Veg" || shop.type === "PureVeg");
            }

            return { ...item, items: filteredItems };
        });
    }

    const handleVegBottom = () => {
        if (nonVegBottom && !vegBottom) {
            setNonVegBottom(!nonVegBottom);
            setVegBottom(!vegBottom);
            setEggBottom(!eggBottom);
            return;
        }
        setVegBottom(!vegBottom);
    };


    const { handleIncrement } = useIncrementHandler();
    const { handleDecrement } = useIncrementHandler();
    const toggleDropdown = (title) => {
        setOpenDropdowns(prevState => ({
            ...prevState,
            [title]: !prevState[title],
        }));
    };

    const numbers = [11, 10, 9, 8, 7];

    const getRandomNumber = () => {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        return numbers[randomIndex];
    };

    const getRandomNumberlodding = (data) => {
        const randomIndex = Math.floor(Math.random() * data.length);
        return data[randomIndex];
    };


    const renderDropdownItem = ({ storename, item, title, ind, itemIndex, liked, setLiked }) => {
        const dataWithoutMenu = { ...Data };
        delete dataWithoutMenu.menu;

        const handleLike = async () => {
            const newLiked = !liked;  // Toggle liked status
            setLiked(newLiked);

            // Get existing liked items from AsyncStorage
            const likedItems = JSON.parse(await AsyncStorage.getItem('likedItems')) || [];

            if (newLiked) {
                // If not liked, add the current item
                likedItems.push(item);
                await AsyncStorage.setItem('likedItems', JSON.stringify(likedItems));
                console.log("Item liked and saved!");
            } else {
                // If already liked, remove the current item
                const updatedLikedItems = likedItems.filter(likedItem => likedItem._id !== item._id);
                await AsyncStorage.setItem('likedItems', JSON.stringify(updatedLikedItems));
                console.log("Item unliked and removed.");
            }
        };

        return (
            <View
                ref={(el) => {
                    if (!itemRefs.current[ind]) itemRefs.current[ind] = [];
                    itemRefs.current[ind][itemIndex] = el;
                }}
            >
                {/* {item.status ? null : <Text className=' absolute top-[40%] z-10 left-0 right-0 text-center' style={[fontstyles.h1, { fontSize: 70, marginTop: -30, color: themeColors.diffrentColorRed }]}>SoldOut</Text>} */}
                <View
                    // style={{ backgroundColor: 'rgba(355, 355, 355, 0.)' }}
                    className={`flex-row p-3 ${item.status ? 'pb-6' : 'opacity-40'}`}
                >
                    <TouchableOpacity
                        className='w-6/12 h-full'
                        // activeOpacity={1}
                        onPress={() => { item.status && navigation.navigate('DetailView', { Data: item, dataWithoutMenu }) }}
                    >
                        <View className='flex-row'>
                            {
                                item.type &&
                                <FoodIcon style={{ backgroundColor: 'black' }} type={item.type} size={11} padding={2} />
                            }
                            {
                                item.category?.split('_').map((part, index) => (
                                    <FoodTypeIcon key={`${index}_${part}`} type={part} size={15} padding={3} textShow={false} />
                                ))
                            }
                        </View>
                        <Text className=' pt-4' ellipsizeMode='middle' style={[fontstyles.blackh2, { lineHeight: 22, color: themeColors.mainTextColor }]}>
                            {item.item}
                        </Text>

                        <Text className=' pt-2' style={[fontstyles.numberbigger, { color: themeColors.mainTextColor }]}>₹{item.price}</Text>
                        <View className=' flex-row py-2'>
                            {item.rating &&
                                <LongStarIcon rating={item.rating} ratingcount={item.ratingcount} border={1} />}
                            <View className=' flex-row items-end mb-1'>
                                <Text style={[fontstyles.number, { color: themeColors.mainTextColor }]}> {getFormattedRatingCount(item?.ratingcount)}</Text>
                                <Text style={[fontstyles.h5, { color: themeColors.mainTextColor }]}> ratings</Text>
                            </View>
                        </View>

                        <Text className=' pt-1' ellipsizeMode='tail' style={[fontstyles.h6, { lineHeight: 16, color: themeColors.textColor}]}>{item.description}</Text>
                    </TouchableOpacity>
                    <View className='w-6/12 p-2'>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { item.status && navigation.navigate('DetailView', { Data: item, dataWithoutMenu }) }}
                        >
                            <ImageBackground
                                source={item.image ?
                                    { uri: item.image, method: 'POST', headers: { Pragma: 'no-cache' } } :
                                    require('./../../assets/menu.jpg')}
                                defaultSource={require('./../../assets/menu.jpg')}
                                resizeMode="cover"
                                alt="Logo"
                                className='rounded-3xl w-full h-36 border-2 overflow-hidden border-slate-950'
                                style={{ borderWidth: 2, borderColor: themeColors.secComponentColor }}
                            >
                                <View className=' absolute top-2 right-2'>
                                    <Ionicons color={themeColors.bbackGroundColor} name={'information-circle'} size={24} />
                                </View>
                                {/* <TouchableOpacity onPress={handleLike}>
                                    <Ionicons name={liked ? "heart" : "heart-outline"} size={34} color={liked ? 'red' : themeColors.textColor} />
                                  </TouchableOpacity> */}
                                {/* 
                                <LinearGradient
                                    start={{ x: 0.0, y: 0.25 }} end={{ x: 0.3, y: 1.1 }}
                                    className='overflow-hidden h-full w-full'
                                    colors={['transparent', themeColors.backGroundColor]}
                                >
                                </LinearGradient> 
                            */}
                            </ImageBackground>
                        </TouchableOpacity>
                        {/* <View
                            style={[styles.button, { backgroundColor: themeColors.componentColor, borderColor: themeColors.textColor, borderWidth: 1 }]}
                            className='absolute left-[18%] w-[74%] -bottom-2 h-9 flex-row overflow-hidden'
                        >
                            {(() => {
                                // Find the hotel in the cart
                                const hotel = cartItemsNEW.find(hotel => hotel.id === dataWithoutMenu.id);
                                // Find the item in the hotel's orders if the hotel exists
                                const orderItem = hotel ? hotel.orders.find(order => order.item === item.item) : null;
                                const quantity = orderItem ? orderItem.quantity : 0;

                                return quantity > 0 ? (
                                    <>
                                        <TouchableOpacity onPress={() => handleDecrement(item.id, title, item, dataWithoutMenu)} className='z-10 left-0 absolute w-6/12 items-center'>
                                            <Ionicons color={themeColors.textColor} name={'remove'} size={22} />
                                        </TouchableOpacity>
                                        <Text className='uppercase text-xl font-black text-center' style={{ color: themeColors.diffrentColorGreen }}>{quantity}</Text>
                                        <TouchableOpacity onPress={() => handleIncrement(item.id, title, item, dataWithoutMenu)} className='z-10 right-0 absolute w-6/12 items-center'>
                                            <Ionicons color={themeColors.textColor} name={'add'} size={22} />
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <>
                                        <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.componentColor }]} onPress={() => handleIncrement(item.id, title, item, dataWithoutMenu)}>
                                            <Text style={[fontstyles.number, { fontSize: 16, color: themeColors.diffrentColorGreen }]}>ADD</Text>
                                        </TouchableOpacity>
                                        <Text className='top-0 right-2 absolute text-xl font-medium' style={{ color: themeColors.textColor }}>+</Text>
                                    </>
                                );
                            })()}
                        </View> */}
                        {(item.status && !Shopstatus.text.includes('closed')) ?
                            <View
                                style={[styles.button, { backgroundColor: themeColors.componentColor, borderColor: themeColors.textColor, borderWidth: 1 }]}
                                className='absolute left-[18%] w-[74%] top-32 h-9 flex-row overflow-hidden'
                            >
                                {(() => {
                                    // Find the hotel in the cart
                                    const hotel = cartItemsNEW.find(hotel => hotel.id === dataWithoutMenu.id);
                                    // Find the item in the hotel's orders if the hotel exists
                                    const orderItem = hotel ? hotel.orders.find(order => order.item === item.item) : null;
                                    const quantity = orderItem ? orderItem.quantity : 0;

                                    return quantity > 0 ? (
                                        <>
                                            <TouchableOpacity onPress={() => handleDecrement(item.id, title, item, dataWithoutMenu)} className='z-10 left-0 absolute w-6/12 items-center'>
                                                <Ionicons color={themeColors.textColor} name={'remove'} size={22} />
                                            </TouchableOpacity>
                                            <Text className='uppercase text-xl font-black text-center' style={{ color: themeColors.diffrentColorGreen }}>{quantity}</Text>
                                            <TouchableOpacity onPress={() => handleIncrement(item.id, title, item, dataWithoutMenu)} className='z-10 right-0 absolute w-6/12 items-center'>
                                                <Ionicons color={themeColors.textColor} name={'add'} size={22} />
                                            </TouchableOpacity>
                                        </>
                                    ) : (
                                        <TouchableOpacity className=' w-full ' onPress={() => handleIncrement(item.id, title, item, dataWithoutMenu)}>
                                            <View style={[styles.button, { backgroundColor: themeColors.componentColor }]}>
                                                <Text style={[fontstyles.number, { fontSize: 16, color: themeColors.diffrentColorGreen }]}>ADD</Text>
                                            </View>
                                            <Text className='-top-2 right-2 absolute text-xl font-medium' style={{ color: themeColors.textColor }}>+</Text>
                                        </TouchableOpacity>
                                    );
                                })()}
                            </View>
                            : null}
                    </View>
                    {/* {renderModal({ data: selectedItemData })} */}
                </View>
                <Text numberOfLines={1} ellipsizeMode='clip' style={{ color: themeColors.textColor }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>
            </View>
        )
    };

    const renderMenuScroll = ({ typetitle, index }) => {
        const isSelected = selectedIndex === index; // Check if the current item is selected

        return (
            <TouchableOpacity
                key={`${index}_${typetitle}`}
                // style={{ padding: 12 }}
                className=' p-4 '
                onPress={() => {
                    setSelectedIndex(index);
                    // handleScrollToIndex(index);
                }}
            >
                <Text
                    style={[fontstyles.h3, {
                        marginTop: -8, color: isSelected ? themeColors.diffrentColorPerple : themeColors.textColor
                    }]}
                >
                    {typetitle}
                </Text>
            </TouchableOpacity>
        );
    }

    const renderDropdown = (storename, menu, ind, liked, setLiked) => (
        <View
            ref={(ref) => (dropdownRefs.current[ind] = ref)} // Set the ref for each dropdown section
            style={{ backgroundColor: themeColors.backGroundColor }}
        >
            <TouchableOpacity className=' mb-6 border-b-2 flex-row items-center justify-between p-3' style={[{ borderColor: themeColors.mainTextColor, backgroundColor: themeColors.secComponentColor }]} onPress={() => toggleDropdown(menu.title)}>
                <Text style={[fontstyles.entryUpper, { color: themeColors.mainTextColor }]}>{menu.title}</Text>
                <Ionicons color={themeColors.mainTextColor} name={openDropdowns[menu.title] ? "caret-up-outline" : "caret-down-outline"} size={20} />
            </TouchableOpacity>
            {openDropdowns[menu.title] && (
                <FlatList
                    data={menu.items.sort((a, b) => {
                        // Ensure available items (with status) come before sold-out ones (without status)
                        if (a.status && !b.status) return -1; // a comes first if it's available
                        if (!a.status && b.status) return 1;  // b comes first if it's available
                        return 0; // keep the order as is if both are either available or sold-out
                    })}
                    renderItem={({ item, index }) => renderDropdownItem({ storename, item, title: menu.title, ind: ind, itemIndex: index, liked, setLiked })}
                    keyExtractor={(item, index) => `${index}_${item.id}`}
                />
            )}
        </View>
    );

    const getShopImageSource = (state) => {
        switch (state) {
            case 'closed':
                return require('./../Data/closed.png');
            //   case 'closedForMaintenance':
            //     return require('./../Data/closedMaintenance.png');
            //   case 'open':
            //     return require('./../Data/opened.png');
            //   case 'openingSoon':
            //     return require('./../Data/openingSoon.png');
            case 'closingSoon':
                return require('./../Data/closingsoon.png');
            default:
                return null; // Or a default image
        }
    };

    const navigation = useNavigation();
    const fontstyles = TextStyles();

    const [liked, setLiked] = useState(false);


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#1c1c1e' }}>
            <View style={{ backgroundColor: themeColors.backGroundColor }}>
                <StatusBar barStyle={themeColors.backGroundColor == "#1C1C1E" ?'light-content' : 'dark-content'} backgroundColor={themeColors.bottomNav} />

                {!visible && <>
                    <View className=' w-full h-full'>
                        <View className='items-center'>
                            <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className='w-60 mb-1 mt-3 rounded-md overflow-hidden justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.040 }} />
                            <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className='w-48 my-1 rounded-md overflow-hidden justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.025 }} />
                            <View className='flex-row my-2'>
                                <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className='w-12 rounded-md overflow-hidden mr-3 justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.027, }} />
                                <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className='w-24 rounded-md overflow-hidden justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.027 }} />
                            </View>
                            <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className='w-60 my-1 rounded-md overflow-hidden justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.026 }} />
                            <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className=' h-3 mt-3 w-full' />
                            <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className='mt-5 mb-3 rounded-md overflow-hidden justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.070, width: Dimensions.get('window').width * 0.95 }} />
                        </View>
                        <Text numberOfLines={1} ellipsizeMode='clip' style={[{ color: themeColors.textColor }]}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>

                        <View className=' mt-3 px-2 flex-row'>
                            <View className='w-6/12 h-full overflow-hidden'>
                                <View className='flex-row my-1'>
                                    <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className='w-2/12 rounded-md overflow-hidden mr-3 justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.027, }} />
                                    <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className='w-4/12 rounded-md overflow-hidden justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.027 }} />
                                </View>
                                <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className='w-8/12 my-1 rounded-md overflow-hidden justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.028 }} />
                                <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className='w-2/12 my-1 rounded-md overflow-hidden mr-3 justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.025, }} />
                                <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className={`w-${getRandomNumber()}/12 my-1 rounded-md overflow-hidden justify-between`} style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.020 }} />
                                <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className={`w-${getRandomNumber()}/12 my-1 rounded-md overflow-hidden justify-between`} style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.020 }} />
                                <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className={`w-${getRandomNumber()}/12 my-1 rounded-md overflow-hidden justify-between`} style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.020 }} />
                            </View>
                            <View className='w-6/12 p-2'>
                                <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className='rounded-3xl w-full h-36 border-2 overflow-hidden border-slate-950' style={{ borderWidth: 2, borderColor: themeColors.secComponentColor }} />
                            </View>
                        </View>
                        <Text numberOfLines={1} ellipsizeMode='clip' style={{ color: themeColors.textColor }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>

                        <View className=' mt-3 px-2 flex-row'>
                            <View className='w-6/12 h-full overflow-hidden'>
                                <View className='flex-row my-1'>
                                    <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className='w-2/12 rounded-md overflow-hidden mr-3 justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.027, }} />
                                    <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className='w-4/12 rounded-md overflow-hidden justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.027 }} />
                                </View>
                                <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className='w-8/12 my-1 rounded-md overflow-hidden justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.028 }} />
                                <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className='w-2/12 my-1 rounded-md overflow-hidden mr-3 justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.025, }} />
                                <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className={`w-${getRandomNumber()}/12 my-1 rounded-md overflow-hidden justify-between`} style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.020 }} />
                                <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className={`w-${getRandomNumber()}/12 my-1 rounded-md overflow-hidden justify-between`} style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.020 }} />
                                <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className={`w-${getRandomNumber()}/12 my-1 rounded-md overflow-hidden justify-between`} style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.020 }} />
                            </View>
                            <View className='w-6/12 p-2'>
                                <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className='rounded-3xl w-full h-36 border-2 overflow-hidden border-slate-950' style={{ borderWidth: 2, borderColor: themeColors.secComponentColor }} />
                            </View>
                        </View>
                        <Text numberOfLines={1} ellipsizeMode='clip' style={{ color: themeColors.textColor }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>
                        <Text numberOfLines={3} ellipsizeMode='tail' className='font-semibold text-base px-5 text-center' style={{ color: themeColors.textColor }}>
                            {getRandomNumberlodding(loadingScreenTxt)}
                        </Text>
                    </View>
                </>}

                {visible &&
                    <FlatList
                        data={filteredMenuItems}
                        ref={flatListRef}
                        // ref={(ref, index) => (flatListRefs.current[index] = ref)} 
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => renderDropdown(Data.name, item, index, liked, setLiked)}
                        // renderItem={({ item }) => dropDown(item, navigation, setOpenDropdowns, openDropdowns, menuItems)}
                        keyExtractor={(item, index) => `${index}_${item.title}`}
                        ListHeaderComponent={
                            <>
                                <View className='w-full rounded-3xl items-center justify-center p-2' style={{ backgroundColor: themeColors.backGroundColor }}>
                                    <Text className='mb-1' style={[fontstyles.h1, { color: themeColors.mainTextColor }]}>{Data.name}</Text>
                                    <View className='flex-row justify-center items-center mb-3'>
                                        <View className='flex-row justify-center items-center mr-1'>
                                            {Data.type === "PureVeg" && <Ionicons name="leaf" size={16} color={themeColors.diffrentColorGreen} />}
                                            <Text style={[fontstyles.h5, { color: themeColors.textColor }]}> {Data.type}</Text>
                                        </View>
                                        {Data.menuType.map((item, index) => (
                                            <View key={`menuType-${index}`} className=' flex-row items-center'>
                                                {/* {console.log(index)} */}
                                                <Ionicons name="ellipse" size={5} color={themeColors.textColor} />
                                                <Text style={[fontstyles.h5, { color: themeColors.textColor }]}> {item} </Text>
                                            </View>
                                        ))}
                                    </View>

                                    <View className='flex-row justify-center items-center gap-2 mb-3'>
                                        <View className='flex-row justify-center items-center rounded-lg py-1 px-2' style={{ paddingVertical: 2, backgroundColor: themeColors.diffrentColorGreen }}>
                                            <Text className='mr-1' style={[fontstyles.number, { color: themeColors.backGroundColor }]}>{Data.rating.toFixed(1)}</Text>
                                            <Ionicons name="star" color={themeColors.backGroundColor} />
                                        </View>
                                        <Text style={[fontstyles.number, {
                                            color: themeColors.mainTextColor, borderBottomWidth: 1, borderBottomColor: themeColors.mainTextColor, borderStyle: 'dotted',
                                        }]}> {Data.ratingcount} ratings </Text>
                                    </View>

                                    <View className='flex-row justify-center items-center rounded-full py-1 px-2 mb-5' style={{ backgroundColor: themeColors.diffrentColorPerple }}>
                                        <Ionicons name="navigate-circle" size={24} color={themeColors.diffrentColorPerpleBG} />
                                        <Text className='mx-1' style={[fontstyles.number, { color: 'white' }]}>{Data.location} </Text>
                                    </View>
                                    <LinearGradient
                                        start={{ x: 0.1, y: 0.001 }} end={{ x: 0.1, y: 0.9 }}
                                        colors={[Shopstatus.color[0], Shopstatus.color[1]]}
                                        className=' rounded-2xl p-5 pt-7' style={{ height: Dimensions.get('window').height * 0.13 }}>
                                        <Text className=' text-center' style={[fontstyles.number, { color: themeColors.mainTextColor }]}>
                                            {Shopstatus.text}
                                        </Text>
                                    </LinearGradient>
                                </View>
                                <View className='flex-row justify-between pb-4 px-4'>
                                    {Data.type === 'Mixed' &&
                                        <View className='flex-row gap-3'>
                                            <TouchableOpacity onPress={() => handleVegBottom()} className='flex-row justify-center items-center rounded-lg py-3 p-2' style={{ borderColor: themeColors.secComponentColor, borderWidth: 1 }}>
                                                <View className={`absolute z-10 ${vegBottom ? 'right-0' : 'left-2'}`}>
                                                    <FoodIcon style={{ backgroundColor: 'black' }} type={'PureVeg'} size={10} padding={2} />
                                                </View>
                                                <View className='h-2 w-11 rounded-full' style={{ backgroundColor: vegBottom ? themeColors.diffrentColorGreen : themeColors.textColor }} />
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => { setNonVegBottom(!nonVegBottom) }} className='flex-row justify-center items-center rounded-lg py-3 px-2' style={{ borderColor: themeColors.secComponentColor, borderWidth: 1 }}>
                                                <View className={`absolute z-10 ${nonVegBottom ? 'right-0' : 'left-2'}`}>
                                                    <FoodIcon style={{ backgroundColor: 'black' }} type={'NonVeg'} size={10} padding={2} />
                                                </View>
                                                <View className='h-2 w-11 rounded-full' style={{ backgroundColor: nonVegBottom ? '#fca5a5' : themeColors.textColor }} />
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => { setEggBottom(!eggBottom) }} className='flex-row justify-center items-center rounded-lg py-3 px-2' style={{ borderColor: themeColors.secComponentColor, borderWidth: 1 }}>
                                                <View className={`absolute z-10 ${eggBottom ? 'right-0' : 'left-2'}`}>
                                                    <FoodIcon style={{ backgroundColor: 'black' }} type={'Veg'} size={10} padding={2} />
                                                </View>
                                                <View className='h-2 w-11 rounded-full' style={{ backgroundColor: eggBottom ? '#3F6212' : themeColors.textColor }} />
                                            </TouchableOpacity>
                                        </View>
                                    }
                                    {/* <View className='flex-row justify-center items-center rounded-xl py-1 px-2' style={{ borderColor: themeColors.textColor, borderWidth: 1 }}>
                                        <Text style={[fontstyles.number, { color: themeColors.mainTextColor }]}>Filter </Text>
                                        <Ionicons name="options-outline" size={18} color={themeColors.mainTextColor} />
                                    </View> */}
                                </View>
                            </>
                        }
                        ListFooterComponent={
                            <View className='p-3' style={{ backgroundColor: themeColors.backGroundColor, height: Dimensions.get('window').height * 0.9 }}>
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
                                            userId: Data.userId,
                                            name: Data.name
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
                                {Data?.Lic &&
                                    <View>
                                        <Image
                                            source={require("./../Data/fssai.png")}
                                            // defaultSource={require('./../../assets/store.jpg')}
                                            className='w-14 h-11'
                                            alt="Logo"
                                        />
                                        <Text style={[fontstyles.number, { color: themeColors.textColor }]}>Lic. No. {Data?.Lic}</Text>
                                    </View>
                                }
                            </View>
                        }
                        showsHorizontalScrollIndicator={false}
                    />}

                {/* MenuScrollView */}
                {visible &&
                    <>
                        <View className='absolute bottom-0 w-full'>
                            {cartItemsNEW.map((item, index) => (
                                // console.log('item', item),
                                item.id === Data.id ? ( //dataWithoutMenu.id
                                    <CheckOut item={item} navigation={navigation} quantityEs={item?.orders.reduce((acc, order) => acc + order.quantity, 0)} index={index} />
                                    // <TouchableOpacity key={`${index}`} onPress={() => navigation.navigate('IndiviualCart', { item })}>
                                    //     <View className=' flex-row items-center justify-between p-4' style={{ backgroundColor: themeColors.diffrentColorOrange }} key={`${index}_${item.id}`}>
                                    //         <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor }]}>
                                    //             {item?.orders.reduce((acc, order) => acc + order.quantity, 0)}
                                    //             {item?.orders.reduce((acc, order) => acc + order.quantity, 0) === 1 ? ' item' : ' items'} added
                                    //         </Text>
                                    //         <View className=' flex-row items-center'>
                                    //             <Text style={[fontstyles.h3, { color: themeColors.mainTextColor }]}>CheckOut </Text>
                                    //             <TouchableOpacity onPress={() => navigation.navigate('IndiviualCart', { item })}>
                                    //                 <Ionicons color={themeColors.mainTextColor} name={'caret-forward-circle'} size={22} />
                                    //             </TouchableOpacity>
                                    //         </View>
                                    //     </View>
                                    // </TouchableOpacity>
                                ) : null
                            ))}
                            <View className={`w-full bottom-0 border-t-2 flex-row items-center justify-between`} style={[{ height: Dimensions.get('window').height * 0.08, borderColor: themeColors.mainTextColor, backgroundColor: themeColors.componentColor }]}>
                                <FlatList
                                    data={Data.menu}
                                    renderItem={({ item, index }) => renderMenuScroll({ typetitle: item.title, index })}
                                    keyExtractor={(item, index) => `${index}_${item.title}`}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                />
                            </View>
                        </View>

                    </>
                }
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
    // centeredText: {
    //     color: themeColors.mainTextColor,
    //     position: 'absolute',
    //     left: 0,
    //     right: 0,
    //     // top: 0,
    //     bottom: 0,
    //     textAlign: 'center',
    //     textAlignVertical: 'center', // For Android to vertically center text
    // },
    button: {
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        // paddingVertical: 8, // Adjust padding instead of fixed height
        // paddingHorizontal: 10, // Add padding for horizontal space
        // backgroundColor: '#114232',
    },
});

export default DetailsScreen;