import { Alert, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import FoodTypeIcon from './FoodTypeIcon';
import FoodIcon from './FoodIcon';
import LongStarIcon from './LongStarIcon';
import { useNavigation } from '@react-navigation/native';
import Colors from './Colors';
import Ionicons from "react-native-vector-icons/Ionicons";
import { FlatList } from 'react-native';
import useIncrementHandler from '../Components/handleIncrement';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ADDMENU_ENDPOINT, API_BASE_URL } from '../Constants/Constants';
import TextStyles from '../Style/TextStyles';
import Animated, { FadeInDown, SlideInUp } from 'react-native-reanimated';
import { useContext } from 'react';
import { ThemeContext } from '../Context/ThemeContext';



export const dropDown = (themeColors, index, fontstyles, menu, navigation, setOpenDropdowns, openDropdowns, handleChanges) => {

    // const fontstyles = TextStyles();
    // const { themeColors, toggleTheme } = useContext(ThemeContext);

    const toggleDropdown = (title) => {
        setOpenDropdowns(prevState => ({
            ...prevState,
            [title]: !prevState[title],
        }));
    };

    const renderDropdownItem = ({ index, item, title, navigation }) => {

        return (
            <Animated.View entering={FadeInDown.delay(index * 100).springify().damping(12)} key={`${item.item.id}_${index}`}>
                <View
                    className=' flex-row p-3 pb-6'

                >
                    <TouchableOpacity
                        className='w-6/12 h-full'
                        // activeOpacity={1}
                        onPress={() => { navigation.navigate('DetailView', { Data: item }) }}
                    >
                        <View className='flex-row'>
                            {
                                item.type &&
                                <FoodIcon style={{ backgroundColor: 'black' }} type={item.type} size={11} padding={2} />
                            }
                            {
                                item.category?.split('_').map((part, index) => (
                                    <FoodTypeIcon key={index} type={part} size={15} padding={3} textShow={false} />
                                ))
                            }
                        </View>
                        <Text numberOfLines={1} ellipsizeMode='middle' style={[fontstyles.blackh2, { color: themeColors.diffrentColorOrange }]}>
                            {item.item}
                        </Text>

                        <Text style={[fontstyles.number, { color: themeColors.mainTextColor }]}>₹{item.price}</Text>
                        <View className=' flex-row py-2'>
                            {item.rating &&
                                <LongStarIcon rating={item.rating} ratingcount={item.ratingcount} border={1} />}
                            <View className=' flex-row items-end'>
                                <Text style={[fontstyles.number, { color: themeColors.mainTextColor }]}>  {item.ratingcount}</Text>
                                <Text style={[fontstyles.h5, { color: themeColors.mainTextColor }]}> ratings</Text>
                            </View>
                        </View>

                        <Text numberOfLines={3} ellipsizeMode='middle' style={styles.descriptionText}>{item.description}</Text>
                    </TouchableOpacity>
                    <View className='w-6/12 p-2'>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { navigation.navigate('DetailView', { Data: item }) }}
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
                                {/* <LinearGradient
                        start={{ x: 0.0, y: 0.25 }} end={{ x: 0.3, y: 1.1 }}
                        className='overflow-hidden h-full w-full'
                        colors={['transparent', themeColors.backGroundColor]}
                    >
                    </LinearGradient> */}
                            </ImageBackground>
                        </TouchableOpacity>
                        <View
                            style={[styles.button, { backgroundColor: themeColors.componentColor, borderColor: item.status == true ? themeColors.diffrentColorGreen : themeColors.diffrentColorRed, borderWidth: 1 }]}
                            className=' absolute left-[18%] w-[74%] -bottom-2 h-9 flex-row overflow-hidden'
                        >
                            <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.componentColor }]}
                                onPress={() => handleChanges(title, 'status', !item.status, item.item)}
                                className=' h-full w-full'
                            // onPress={() => handleChange('type', 'PureVeg')}
                            >
                                <Text style={[fontstyles.h3, { marginBottom: -3, color: item.status == true ? themeColors.diffrentColorGreen : themeColors.diffrentColorRed }]}>{item.status == true ? 'In Stock' : 'Sold Out'}</Text>
                            {/* </TouchableOpacity> */}
                            <Text className=' top-0 right-2 absolute text-xl font-medium' style={{ color: themeColors.textColor }}>{item.status == true ? '+' : '-'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* {renderModal({ data: selectedItemData })} */}
                </View>
                <Text numberOfLines={1} ellipsizeMode='clip' style={{ color: themeColors.textColor }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>
            </Animated.View>
        )
    };

    // const { handleIncrement , handleDecrement } = useIncrementHandler(Items);

    return (
        <>
            <Animated.View key={`${menu.item}_${index}`} entering={FadeInDown.delay(index * 100).springify()} style={{ backgroundColor: themeColors.backGroundColor }}>
                <TouchableOpacity className=' mb-6 flex-row items-center justify-between p-3' style={[{ borderColor: themeColors.mainTextColor, backgroundColor: themeColors.componentColor }]} onPress={() => toggleDropdown(menu.title)}>
                    <Text style={[fontstyles.entryUpper, { color: themeColors.mainTextColor }]}>{menu.title}</Text>
                    <Ionicons color={themeColors.mainTextColor} name={openDropdowns[menu.title] ? "caret-up-outline" : "caret-down-outline"} size={20} />
                </TouchableOpacity>
                {openDropdowns[menu.title] && (
                    <FlatList
                        data={menu.items}
                        renderItem={({ item, index }) => renderDropdownItem({ index, item, title: menu.title, navigation })}
                        keyExtractor={item => item.id}
                    />
                )}
            </Animated.View >
        </>
    )
};


const styles = StyleSheet.create({
    descriptionText: {
        fontSize: 14,
        color: '#666',
    },
    button: {
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        // paddingVertical: 8, // Adjust padding instead of fixed height
        // paddingHorizontal: 10, // Add padding for horizontal space
        // backgroundColor: '#114232',
    },
});