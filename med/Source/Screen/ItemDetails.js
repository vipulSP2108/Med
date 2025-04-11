import { View, Text, TouchableOpacity, ImageBackground, Dimensions, StyleSheet, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Colors from '../Components/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import FoodIcon from '../Components/FoodIcon';
import FoodTypeIcon from '../Components/FoodTypeIcon';
import { ScrollView } from 'react-native-gesture-handler';
import { createShimmerPlaceHolder } from 'expo-shimmer-placeholder'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextStyles from '../Style/TextStyles';
import useIncrementHandler from '../Components/handleIncrement';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { useNavigation } from '@react-navigation/native';
import CheckOut from '../Components/Checkout';
import { ThemeContext } from '../Context/ThemeContext';
import { ADDRATINGS_ENDPOINT, API_BASE_URL, GIVERATINGS_ENDPOINT } from '../Constants/Constants';
import getFormattedRatingCount from '../Components/getFormattedRatingCount';

const ShimmerPlaceholder = createShimmerPlaceHolder(LinearGradient)

const content = [
    { "name": "Calories", "size": "-----" },
    { "name": "Protein", "size": "-----" },
    { "name": "Carbohydrates", "size": "-----" },
    { "name": "Fats", "size": "-----" },
    { "name": "Sodium", "size": "-----" },
    { "name": "Fiber", "size": "-----" },
    { "name": "Sugar", "size": "-----" }
    // { "name": "Calories", "size": "450 grams(g)" },
    // { "name": "Protein", "size": "30 grams(g)" },
    // { "name": "Carbohydrates", "size": "40 grams(g)" },
    // { "name": "Fats", "size": "18 grams(g)" },
    // { "name": "Sodium", "size": "950 milligrams(mg)" },
    // { "name": "Fiber", "size": "3 grams(g)" },
    // { "name": "Sugar", "size": "2 grams(g)" }
];

export default DetailView = ({ route }) => {
    const { Data, dataWithoutMenu } = route.params;
    const fontstyles = TextStyles();
    const { cartItemsNEW, userData } = useContext(GlobalStateContext);
    const navigation = useNavigation();
    const { themeColors, toggleTheme } = useContext(ThemeContext);
    const { handleIncrement } = useIncrementHandler();
    const { handleDecrement } = useIncrementHandler();

    const [data, setData] = useState(null);
    const [dataHotel, setDataHotel] = useState(null);
    const [liked, setLiked] = useState(false); // Default as false, will set this correctly in useEffect
    const shimmerColors = [themeColors.secComponentColor, themeColors.componentColor, themeColors.secComponentColor];
    const shimmerColors2 = [themeColors.componentColor, themeColors.secComponentColor, themeColors.componentColor];

    const handleLike = async () => {
        setLiked(prevLiked => !prevLiked); // Toggle the liked state

        // Get existing liked items from AsyncStorage
        const likedItems = JSON.parse(await AsyncStorage.getItem('likedItems')) || [];

        if (!liked) {
            // If not liked, add the current item
            likedItems.push({ data, dataHotel });
            await AsyncStorage.setItem('likedItems', JSON.stringify(likedItems));
            console.log("Item liked and saved!");
        } else {
            // If already liked, remove the current item
            const updatedLikedItems = likedItems.filter(item => item.data._id !== data._id);
            await AsyncStorage.setItem('likedItems', JSON.stringify(updatedLikedItems));
            console.log("Item unliked and removed.");
        }
    };

    const [rating, setRating] = useState(0);

    const fetchUserRatings = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}:${GIVERATINGS_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ contactinfo: userData.contactinfo }),
            });

            const responses = await response.json();

            // If response is successful, set the ratings
            if (responses.status === 'ok') {
                // console.log()
                responses.ratings.map((liked, index) => {
                    if (data?._id == liked.itemId && dataHotel?._id == liked.outletId) {
                        setRating(liked.rating)
                    }
                })
                // data.ratings.map()
                // setRatings(data.ratings); // Set ratings to state
            } else {
                // If there was an error fetching ratings, show an alert
                Alert.alert('Error', data.message || 'There was an issue fetching your ratings');
            }
        } catch (error) {
            console.error('Error fetching user ratings:', error);
            Alert.alert('Error', 'An error occurred while fetching your ratings');
        } finally {
            setLoading(false);  // Stop the loading spinner when done
        }
    };

    useEffect(() => {
        fetchUserRatings();
    }, [userData, rating, data, dataHotel]);

    const handleRatingChange = async (newRating) => {
        // Set the new rating in state
        setRating(newRating);

        // Prepare the data to send to the backend API
        const ratingData = {
            contactinfo: userData.contactinfo, // The user's unique identifier (can be phone number or email)
            itemId: data?._id,             // The outlet ID
            outletId: dataHotel?._id,          // The item ID
            rating: newRating                // The rating value (1-5)
        };

        console.log(ratingData)
        // Send the rating to the backend API
        try {
            const response = await fetch(`${API_BASE_URL}:${ADDRATINGS_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ratingData),
            });

            const result = await response.json();

            // Check if the response is successful
            if (result.status === 'ok') {
                console.log('rating Added')
                // Alert.alert('Success', 'Your rating has been submitted successfully!');
            } else {
                Alert.alert('Error', result.message || 'There was an error submitting your rating');
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            Alert.alert('Error', 'An error occurred while submitting your rating');
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => handleRatingChange(i)}>
                    <Ionicons
                        name={i <= rating ? 'star' : 'star-outline'}
                        size={30}
                        color={i <= rating ? 'gold' : 'gray'}
                    />
                </TouchableOpacity>
            );
        }
        return stars;
    };

    useEffect(() => {
        // Show shimmer initially
        setVisible(false);

        // Check if item is already liked when the component loads
        const checkLikedStatus = async () => {
            const likedItems = JSON.parse(await AsyncStorage.getItem('likedItems')) || [];
            const isLiked = likedItems.some(item => item.data._id === Data._id); // Check if current item is in likedItems
            setLiked(isLiked); // Set liked state based on check
        };
        checkLikedStatus(); // Call the function to check liked status

        // Simulate data fetch
        setTimeout(() => {
            // setData(Data); // Replace with actual data fetch
            setData(Data)
            setDataHotel(dataWithoutMenu)
            setVisible(true);
        }, 200); // Adjust timing as necessary
    }, [Data, dataWithoutMenu]);

    const [visible, setVisible] = React.useState(false);
    const [quantityEs, setQuantityEs] = useState();

    return (
        <View key={`${data?.item}`} className=' w-full h-full' style={{ backgroundColor: themeColors.backGroundColor }}>
            {!visible && <>
                <View className=' w-full h-full'>
                    <View className='h-96 w-full'>
                        <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className=' h-full w-full mr-2 mt-5 mb-3 rounded-md overflow-hidden justify-between' style={{ backgroundColor: themeColors.componentColor, borderBottomRightRadius: 100 }} />
                        <View className=' absolute flex-row mx-4 -bottom-14 z-50 '>
                            <ShimmerPlaceholder shimmerColors={shimmerColors2} visible={visible} className='mr-2 mt-5 mb-3 rounded-md overflow-hidden justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.060, width: Dimensions.get('window').height * 0.13 }} />
                            <ShimmerPlaceholder shimmerColors={shimmerColors2} visible={visible} className='mr-2 mt-5 mb-3 rounded-md overflow-hidden justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.060, width: Dimensions.get('window').height * 0.060 }} />
                            <ShimmerPlaceholder shimmerColors={shimmerColors2} visible={visible} className='mr-1 mt-5 mb-3 rounded-md overflow-hidden justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.060, width: Dimensions.get('window').height * 0.060 }} />
                            <ShimmerPlaceholder shimmerColors={shimmerColors2} visible={visible} className='mr-2 mt-5 mb-3 rounded-md overflow-hidden justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.060, width: Dimensions.get('window').height * 0.060 }} />
                        </View>
                    </View>

                    <ShimmerPlaceholder shimmerColors={shimmerColors} visible={visible} className='mt-14 mb-3 w-full overflow-hidden justify-between' style={{ backgroundColor: themeColors.componentColor, height: Dimensions.get('window').height * 0.20 }} />
                    <Text numberOfLines={1} ellipsizeMode='clip' style={{ color: themeColors.textColor }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>
                    <Text numberOfLines={6} ellipsizeMode='tail' className='font-semibold text-base p-3 text-center' style={{ color: themeColors.textColor }}>
                        Please note that all nutritional information provided is estimated and may vary based on portion size, preparation methods, and ingredient sourcing. The content and descriptions are set by the restaurant and may contain allergens or other dietary considerations. {`\n`}For specific dietary needs or concerns, please consult with the restaurant staff directly.
                    </Text>
                </View>
            </>}

            <TouchableOpacity onPress={handleLike} className=' absolute top-0 right-0 h-16 w-16 items-center justify-center z-50 rounded-bl-[50%] bg-black'>
                <TouchableOpacity onPress={handleLike}>
                    <Ionicons name={liked ? "heart" : "heart-outline"} size={34} color={liked ? 'red' : themeColors.textColor} />
                </TouchableOpacity>
            </TouchableOpacity>

            <ScrollView>
                <View className=' h-96' style={{ borderBottomRightRadius: 100, backgroundColor: themeColors.secComponentColor }} >
                    <ImageBackground
                        source={data?.image ?
                            { uri: data?.image, method: 'POST', headers: { Pragma: 'no-cache' } } :
                            require('./../../assets/menu.jpg')}
                        defaultSource={require('./../../assets/menu.jpg')}
                        alt="Logo"
                        className='h-full overflow-hidden'
                        style={{ borderBottomRightRadius: 100 }}
                    >
                        <LinearGradient
                            start={{ x: 0.3, y: 0.4 }} end={{ x: 0.1, y: 1 }}
                            className='overflow-hidden h-full w-full'
                            colors={['transparent', themeColors.backGroundColor]}
                        ></LinearGradient>
                    </ImageBackground>
                    <View className='w-full absolute bottom-0 p-4'>
                        <View className=' flex-row w-full'>
                            <View>
                                <Text className=' font-black text-4xl' style={{ color: themeColors.mainTextColor }}>
                                    {data?.item}
                                </Text>
                                <View className='py-4'>
                                    {/* <LongStarIcon rating={data?.rating} ratingcount={data?.ratingcount} gaps={20} border={0} size={20} backGround={'transparent'} /> */}
                                </View>
                            </View>
                        </View>
                        <View className='absolute mx-4 -bottom-6 flex-row'>
                            <Text className=' font-black text-xl py-2 px-4 rounded-md mr-2' style={{ color: themeColors.mainTextColor, backgroundColor: themeColors.diffrentColorOrange }}>
                                Rs. {data?.price}
                            </Text>
                            <View className='flex-row'>
                                {
                                    data?.type &&
                                    <FoodIcon key={`${data?.type}`} style={{ backgroundColor: 'black' }} type={data?.type} size={22} padding={7} />
                                }
                                {
                                    data?.category?.split('_').map((part, index) => (
                                        <FoodTypeIcon key={`${index}_${part}`} type={part} size={25} padding={7} textShow={false} />
                                    ))
                                }
                            </View>
                        </View>
                    </View>
                </View>

                <View className='mt-9'>
                    <View className=' p-4 py-7 mb-2' style={{ backgroundColor: themeColors.componentColor }}>
                        <Text className=' font-black text-xl mb-2' style={{ color: themeColors.mainTextColor, }}>
                            Know Your Dish
                        </Text>
                        <Text className=' font-normal text-base' style={{ color: themeColors.textColor, }}>
                            {data?.description}
                        </Text>
                    </View>

                    <View className=' p-4 py-7 mb-2' style={{ backgroundColor: themeColors.componentColor }}>
                        <Text className=' font-black text-xl mb-2' style={{ color: themeColors.mainTextColor }}>
                            Nutrition Facts
                        </Text>
                        {content.map((item, index) => (
                            <View key={`${index}_${item.name}`}>
                                <View className=' flex-row justify-between mt-3'>
                                    <Text className=' font-bold text-base' style={{ color: themeColors.mainTextColor }}>{item.name}</Text>
                                    <Text className=' font-normal text-base' style={{ color: themeColors.textColor }}>{item.size}</Text>
                                </View>
                                <Text numberOfLines={1} ellipsizeMode='clip' style={{ color: themeColors.textColor }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>
                            </View>
                        ))}
                    </View>

                    <View className=' p-4 py-7 mb-2' style={{ backgroundColor: themeColors.componentColor }}>

                        <Text className='font-black text-xl mb-2' style={{ color: themeColors.mainTextColor }}>
                            Rate This Dish
                        </Text>
                        <View className="flex-row">
                            {renderStars(rating)}
                        </View>

                        <View className="mt-4">
                            <Text className='text-base' style={{ color: themeColors.textColor }}>
                                <Text className="font-bold" style={{ color: themeColors.mainTextColor }}>
                                {/* Current Rating: {Math.round(Math.round(data?.rating * 10) / 5) * 0.5 || "N/A"} STAR */}
                                    Current Rating: {Math.round(data?.rating * 10)/10 || "N/A"} STAR
                                </Text>
                                {/* {" "}({data?.ratingcount} ratings) */}
                                {" "}({getFormattedRatingCount(data?.ratingcount)} ratings)
                            </Text>
                        </View>
                    </View>
                </View>

                <View className=' p-4 py-7 mt-2' style={{ backgroundColor: themeColors.componentColor }}>
                    <Text className=' font-black text-xl mb-2' style={{ color: themeColors.mainTextColor, }}>
                        Disclaimer
                    </Text>
                    <Text className=' font-normal text-base' style={{ color: themeColors.textColor, }}>
                        Please note that all nutritional information provided is estimated and may vary based on portion size, preparation methods, and ingredient sourcing. The content and descriptions are set by the restaurant and may contain allergens or other dietary considerations. {`\n`}For specific dietary needs or concerns, please consult with the restaurant staff directly.
                    </Text>
                </View>
            </ScrollView>

            <View className=' absolute bottom-0 bg-transparent w-full'>
                {quantityEs != 0 && cartItemsNEW.map((item, index) => (
                    // console.log('item', item),
                    item.id === dataHotel?.id ? ( //dataWithoutMenu.id
                        <CheckOut item={item} navigation={navigation} quantityEs={quantityEs} index={index} />
                    ) : null
                ))}
                <View className='p-5 flex rounded-t-2xl flex-row items-center w-full justify-between' style={{ backgroundColor: themeColors.subbackGroundColor }}>
                    <View>
                        <View className=' flex-row'>
                            <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor }]}>Add to</Text>
                        </View>
                        <Text className='font-medium text-base' style={[fontstyles.number, { color: themeColors.textColor }]}>Cart</Text>
                    </View>
                    <View
                        style={[styles.button, { backgroundColor: themeColors.subbackGroundColor, borderColor: themeColors.textColor, borderWidth: 1 }]}
                        className='h-10 w-[50%] flex-row overflow-hidden'
                    >
                        {(() => {
                            // Find the hotel in the cart
                            const hotel = cartItemsNEW.find(hotel => hotel.id === dataWithoutMenu?.id);
                            // // Find the item in the hotel's orders if the hotel exists
                            const orderItem = hotel ? hotel.orders.find(order => order.item === data?.item) : null;
                            const quantity = orderItem ? orderItem.quantity : 0;
                            if (quantity != quantityEs) setQuantityEs(quantity)
                            return quantity > 0 ? (
                                <>
                                    <TouchableOpacity onPress={() => handleDecrement(data.id, data.id, data, dataWithoutMenu)} className='z-10 left-0 absolute w-6/12 items-center'>
                                        <Ionicons color={themeColors.textColor} name={'remove'} size={22} />
                                    </TouchableOpacity>
                                    <Text className='uppercase text-xl font-black text-center' style={{ color: themeColors.diffrentColorGreen }}>{quantity}</Text>
                                    <TouchableOpacity onPress={() => handleIncrement(data.id, data.id, data, dataWithoutMenu)} className='z-10 right-0 absolute w-6/12 items-center'>
                                        <Ionicons color={themeColors.textColor} name={'add'} size={22} />
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <TouchableOpacity className=' w-full ' onPress={() => handleIncrement(data.id, data.id, data, dataWithoutMenu)}>
                                    <View style={[styles.button, { backgroundColor: themeColors.subbackGroundColor }]}>
                                        <Text style={[fontstyles.number, { fontSize: 16, color: themeColors.diffrentColorGreen }]}>ADD</Text>
                                    </View>
                                    <Text className='-top-2 right-2 absolute text-xl font-medium' style={{ color: themeColors.textColor }}>+</Text>
                                </TouchableOpacity>
                            );
                        })()}
                    </View>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        // paddingVertical: 8, // Adjust padding instead of fixed height
        // paddingHorizontal: 10, // Add padding for horizontal space
        // backgroundColor: '#114232',
    },
})