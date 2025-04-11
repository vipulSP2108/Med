import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import FoodIcon from '../../Components/FoodIcon';
import FoodTypeIcon from '../../Components/FoodTypeIcon';
import TextStyles from '../../Style/TextStyles';
import LongStarIcon from '../../Components/LongStarIcon';
import { ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import getFormattedRatingCount from '../../Components/getFormattedRatingCount';


export const renderDropdownItem = ({ itemRefs, navigation, cartItemsNEW, Shopstatus, fontstyles, Data, themeColors, storename, item, title, ind, itemIndex, liked, setLiked }) => {

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
                                require('./../../../assets/menu.jpg')}
                            defaultSource={require('./../../../assets/menu.jpg')}
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