import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { View, Text, Modal, TextInput, Image, TouchableOpacity, Dimensions, FlatList, KeyboardAvoidingView, Platform, BackHandler, Keyboard, StatusBar } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Colors from '../Components/Colors';
import { Ionicons } from '@expo/vector-icons';
import { mockCampusMenu } from "../Data/mockCampusMenu";
import SearchBox from "../Components/SearchBox";
import TitlesLeft from '../Components/TitlesLeft';
import PopularMenuContainor from "../Components/PopularMenuContainor";
import { ListCard_Menu_Self2, ListCard_Self2, ListCard_Z } from '../Components/ListCards';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextStyles from '../Style/TextStyles';
import Animated, { SlideInUp, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native';
import { ThemeContext } from '../Context/ThemeContext';

export default function ModelScreen() {
    const navigation = useNavigation();
    const { themeColors, toggleTheme } = useContext(ThemeContext);

    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    // const fadeAnim = useRef(new Animated.Value(0)).current;
    // const [campusShops, setCampusShops] = useState();
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [filteredData, setFilteredData] = useState(selectedCategory == 0 ? segregatedDataList : campusShops);
    const [ShowingOptions, setShowingOptions] = useState(true);
    const [searches, setSearches] = useState({ menu: [], outlet: [] });
    // const [campusMenu, setCampusMenu] = useState([]);

    const { CartItems, popularMenu, segregatedDataList, campusMenu, campusShops, outletsNEW, updatedCartWithDetails } = useContext(GlobalStateContext);

    const show_UpModelScreen = () => setVisible(true);
    const hide_UpModelScreen = () => { setValue(''), setVisible(false) };

    // Load searches from AsyncStorage when the component mounts
    useEffect(() => {
        const loadSearches = async () => {
            try {
                const savedSearches = await AsyncStorage.getItem('searches');
                if (savedSearches !== null) {
                    setSearches(JSON.parse(savedSearches));
                }
            } catch (error) {
                console.error('Failed to load searches from storage:', error);
            }
        };
        loadSearches();
    }, []);

    // Save searches to AsyncStorage whenever it changes
    useEffect(() => {
        const saveSearches = async () => {
            try {
                await AsyncStorage.setItem('searches', JSON.stringify(searches));
            } catch (error) {
                console.error('Failed to save searches to storage:', error);
            }
        };
        saveSearches();
    }, [searches]);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                handleSearch('') // HomeScreen
                navigation.navigate('BuyerNavigationStack'); // Replace 'Home' with your home screen route name
                return true; // Prevent default behavior
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [navigation])
    );

    // useEffect(() => {
    //     if (!isFocused && value === '') {
    //         Animated.timing(fadeAnim, {
    //             toValue: 1,
    //             duration: 500,
    //             useNativeDriver: true,
    //         }).start();
    //     } else {
    //         Animated.timing(fadeAnim, {
    //             toValue: 0,
    //             duration: 500,
    //             useNativeDriver: true,
    //         }).start();
    //     }
    // }, [isFocused, value]);

    // useEffect(() => {
    //     fetchFeatures();
    // }, []);

    useEffect(() => {

        const interval = setInterval(() => {

            setCurrentIndex((prevIndex) => (prevIndex + 1));
        }, 3000); // Change every 3 seconds (adjust as needed)

        return () => clearInterval(interval);
    }, []);

    const featuredShop = outletsNEW ? outletsNEW.filter(item => item.featured === "true") : [];
    // const featuredMenu = segregatedDataList ? segregatedDataList.filter(item => item.featured === "true") : [];
    const featuredMenu = segregatedDataList ? segregatedDataList.filter(item =>
        item.availability.some(avail => avail.menutype === 'Popular')
    ) : [];

    const buffer = 0;

    const handleSearch = (text) => {
        // if (text == 0) {
        //     setShowingOptions(false);
        // }
        // else {
        setShowingOptions(true);
        // }

        setValue(text);
        const filtered = selectedCategory === 0
            ? segregatedDataList.filter(item => item.name.toLowerCase().includes(text.toLowerCase()))
            : outletsNEW.filter(item => item.name.toLowerCase().includes(text.toLowerCase()));

        setFilteredData(filtered);
    };

    let placeholderText = 'Search';

    if (selectedCategory === 0) {
        if (segregatedDataList && segregatedDataList.length > currentIndex) {
            if (currentIndex + 1 === segregatedDataList.length) {
                setCurrentIndex(0);
            }
            placeholderText = `Search "${segregatedDataList[currentIndex].name}"`;
        }
    } else {
        if (outletsNEW && outletsNEW.length > currentIndex) {
            if (currentIndex + 1 === outletsNEW.length) {
                setCurrentIndex(0);
            }
            placeholderText = `Search "${outletsNEW[currentIndex].name}"`;
        }
    }

    const handleMenuPress = (index) => {
        setValue('')
        setSelectedCategory(index);
        const filtered = index === 0
            ? segregatedDataList.filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
            : outletsNEW.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));

        setFilteredData(filtered);
    };

    const fontstyles = TextStyles();

    const renderMenuScroll = ({ item, index }) => {
        const isSelected = selectedCategory === index; // Check if the current item is selected

        return (
            <TouchableOpacity
                key={index}
                // style={{ padding: 12 }}
                className=' px-4'
                onPress={() => handleMenuPress(index)} // Update the selected index on press
            >
                <Text
                    style={[fontstyles.h3, {
                        color: isSelected ? themeColors.diffrentColorPerple : themeColors.textColor
                    }]}
                    className='text-lg font-semibold'
                >
                    {item}
                </Text>
            </TouchableOpacity>
        );
    }

    const storeYourSerchers = (searchItem) => {
        const category = selectedCategory === 0 ? 'menu' : 'outlet';
        if (!searches[category].includes(searchItem)) {
            const newSearches = [searchItem, ...searches[category]];
            if (newSearches.length > 3) {
                newSearches.pop();
            }
            setSearches((prevSearches) => ({
                ...prevSearches,
                [category]: newSearches,
            }));
        }
    };

    const recentSearches = selectedCategory === 0 ? searches.menu : searches.outlet;

    const RenderModel_UpModelScreen = () => (
        <SafeAreaView>
            <StatusBar backgroundColor={themeColors.backGroundColor} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}>
                <Modal
                    visible={visible}
                    onRequestClose={hide_UpModelScreen}
                    animationType="fade"
                    transparent
                >
                    <View className=' w-full h-full' style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                        {value.length > 0 ? null : <TouchableOpacity style={{ flex: 1 }} onPress={() => { hide_UpModelScreen() }} />}

                        <View className={`${value.length > 0 ? 'h-full' : 'absolute rounded-b-2xl'} w-full top-0 pb-5`} style={{ maxHeight: 750, backgroundColor: themeColors.backGroundColor }}>
                            {/* <View className=' absolute w-full top-0 pb-5' style={{ maxHeight: 750, borderBottomRightRadius: 21, borderBottomLeftRadius: 21, backgroundColor: themeColors.backGroundColor }}> */}
                            <View className='searchBodyContainer px-3 pt-3 flex-row justify-between pb-3'>
                                <View className='searchInputTxt justify-center rounded-xl text-base px-3 w-[83%]' style={{ backgroundColor: themeColors.secComponentColor, height: 50 }}>
                                    <Ionicons
                                        color={themeColors.diffrentColorOrange}
                                        name="search"
                                        size={24}
                                        style={styles.icon}
                                    />
                                    <TextInput
                                        maxLength={50} ellipsizeMode='middle'
                                        autoFocus={true}
                                        style={[styles.textInput, { color: themeColors.mainTextColor, backgroundColor: themeColors.secComponentColor, paddingLeft: 40 }]}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        value={value}
                                        onChangeText={handleSearch}
                                        placeholder={placeholderText}
                                        placeholderTextColor={themeColors.textColor}
                                    />
                                    {value.length > 0 &&
                                        <View className=' absolute h-full right-3 items-center justify-center'>
                                            <TouchableOpacity
                                                onPress={() => handleSearch('')}
                                                className='rounded-full p-1 items-center justify-center'
                                                style={{ backgroundColor: themeColors.componentColor }}
                                            >
                                                <Ionicons
                                                    name="add-outline"
                                                    style={{ transform: [{ rotate: '45deg' }] }}
                                                    size={18}
                                                    color={themeColors.mainTextColor}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    }
                                </View>
                                <TouchableOpacity style={{ backgroundColor: themeColors.secComponentColor, borderRadius: 15, width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }} onPress={() => { hide_UpModelScreen(), navigation.navigate('YettoUpdate') }}>
                                    <Ionicons color={themeColors.diffrentColorOrange} name="mic" size={24} className='searchIcon' />
                                </TouchableOpacity>
                                {/* <TouchableOpacity onPress={() => { hide_UpModelScreen(), navigation.navigate('YettoUpdate') }}>
                                    <Ionicons color={themeColors.diffrentColorOrange} name="mic" size={24} className='searchIcon' style={{ backgroundColor: themeColors.secComponentColor, borderRadius: 15, width: 50, height: 50, textAlign: 'center', textAlignVertical: 'center' }} />
                                </TouchableOpacity> */}
                            </View>
                            {/* <View className='w-full bottom-0 flex-row items-center right-0' style={[{ height: Dimensions.get('window').height * 0.08, borderColor: themeColors.mainTextColor, backgroundColor: themeColors.backGroundColor }]}>
                                <FlatList
                                    data={['Menu', 'Outlets']}
                                    renderItem={({ item, index }) => renderMenuScroll({ item, index })}
                                    keyExtractor={(item, index) => index.toString()}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                />
                            </View> */}
                            {value.length == 0 && (
                                <>
                                    <View className='w-full bottom-0 flex-row items-center right-0' style={[{ height: Dimensions.get('window').height * 0.08, borderColor: themeColors.mainTextColor, backgroundColor: themeColors.backGroundColor }]}>
                                        <FlatList
                                            data={['Menu', 'Outlets']}
                                            renderItem={({ item, index }) => renderMenuScroll({ item, index })}
                                            keyExtractor={(item, index) => index.toString()}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                        />
                                    </View>
                                    <View className=' px-3 overflow-hidden'>
                                        <View className=' overflow-hidden'>
                                            <TitlesLeft title="Your Search" height={2} fontstyles={fontstyles} color={themeColors.mainTextColor} />
                                        </View>
                                        <View className='flex-row pt-7 pb-1 w-full gap-3' style={{ flexWrap: 'wrap' }}>
                                            {recentSearches.map((search, index) => (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        Keyboard.dismiss();
                                                        if (selectedCategory == 1) {
                                                            hide_UpModelScreen();
                                                            // storeYourSerchers(item.name);
                                                            // console.log(search);
                                                            navigation.navigate("Details", { Data: outletsNEW.find(shop => shop.name === search) });
                                                        } else {
                                                            handleSearch(search);
                                                            // storeYourSerchers(item.name);
                                                            setShowingOptions(false);
                                                        }
                                                    }}
                                                    // onPress={() => { handleSearch(search), setShowingOptions(false) }} 
                                                    key={index} className='flex-row items-center rounded-full' style={{ paddingVertical: 1, paddingHorizontal: 5, backgroundColor: themeColors.secComponentColor }}
                                                >
                                                    <Ionicons color={themeColors.diffrentColorOrange} name="timer-outline" size={20} className='searchIcon' />
                                                    <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5_5, { marginBottom: 1, color: themeColors.mainTextColor }]} className='justify-center'> {search}  </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                </>
                            )}
                            {/* <SlideContainor flatListRef={flatListRef} data={featuredShop//featuredMenu} viewabilityConfig={viewabilityMenuConfig} /> */}
                            {ShowingOptions ? (
                                value.length > 0 && (
                                    // <KeyboardAvoidingView
                                    //     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                    //     style={{ flex: 1 }}>
                                    <FlatList
                                        data={filteredData}
                                        // keyboardDismissMode='none'
                                        keyboardShouldPersistTaps='handled'
                                        keyExtractor={(item, index) => index.toString()}
                                        ListHeaderComponent={
                                            <View className='w-full bottom-0 flex-row items-center right-0' style={[{ height: Dimensions.get('window').height * 0.08, borderColor: themeColors.mainTextColor, backgroundColor: themeColors.backGroundColor }]}>
                                                <FlatList
                                                    data={['Menu', 'Outlets']}
                                                    renderItem={({ item, index }) => renderMenuScroll({ item, index })}
                                                    keyExtractor={(item, index) => index.toString()}
                                                    horizontal
                                                    showsHorizontalScrollIndicator={false}
                                                />
                                            </View>
                                        }
                                        renderItem={({ item, index }) => (
                                            <Animated.View entering={FadeInUp.delay(index * 70).springify().damping(12)}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        Keyboard.dismiss();
                                                        if (selectedCategory == 1) {
                                                            hide_UpModelScreen();
                                                            storeYourSerchers(item.name);
                                                            navigation.navigate("Details", { Data: item });
                                                        } else {
                                                            handleSearch(item.name);
                                                            storeYourSerchers(item.name);
                                                            setShowingOptions(false);
                                                        }
                                                    }}
                                                    key={item.id} className='p-2 mt-3 flex-row items-center'
                                                >
                                                    <Image
                                                        source={item.image ?
                                                            { uri: item.image, method: 'POST', headers: { Pragma: 'no-cache' } } :
                                                            require('./../../assets/menu.jpg')}
                                                        defaultSource={require('./../../assets/menu.jpg')}
                                                        className='w-12 h-12 rounded-full mr-2'
                                                        alt="Logo"
                                                    />
                                                    <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h4, { color: themeColors.mainTextColor }]} className='justify-center'>{item.name}</Text>
                                                </TouchableOpacity>
                                            </Animated.View>
                                        )}
                                    />
                                    
                                    // </KeyboardAvoidingView>
                                )
                            ) : (
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    keyboardDismissMode='on-drag'
                                    data={filteredData} //campusShops
                                    // renderItem={({ item }) => <ListCard_Z themeColors={themeColors} item={item} />}
                                    renderItem={({ item }) => value.length > buffer ? <ListCard_Menu_Self2 themeColors={themeColors} item={item} hide_Model={hide_UpModelScreen} /> : null}
                                    keyExtractor={(item, index) => index.toString()}
                                    ListHeaderComponent={
                                        <>
                                            {/* <View className=' pr-2 overflow-hidden'>
                                                <TitlesLeft title="Popular Options" height={2} fontstyles={fontstyles} color={themeColors.mainTextColor} />
                                            </View> */}
                                            {/* featuredMenu featuredShop */}
                                            {/* <PopularMenuContainor data={popularMenu} /> */}
                                            {/* <PopularMenuContainor data={selectedCategory == 0 ? featuredMenu : featuredShop} /> */}
                                            {
                                                value.length > buffer ?
                                                    <View className=' pr-2 overflow-hidden'>
                                                        <TitlesLeft title="Search Results" height={2} fontstyles={fontstyles} color={themeColors.mainTextColor} />
                                                    </View>

                                                    : null
                                            }
                                        </>
                                    }
                                />
                            )}


                        </View>
                        {/* <View className='w-full bottom-0 border-t-2 flex-row items-center right-0' style={[{ height: Dimensions.get('window').height * 0.08, borderColor: themeColors.mainTextColor, backgroundColor: themeColors.componentColor }]}>
                        <FlatList
                            data={['Menu', 'Outlets']}
                            renderItem={({ item, index }) => renderMenuScroll({ item, index })}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    </View> */}
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );

    return { show_UpModelScreen, hide_UpModelScreen, RenderModel_UpModelScreen };
}



const styles = {
    textInput: {
        flex: 1,
        paddingLeft: 60,
        fontSize: 16,
        borderRadius: 15,
        fontWeight: "600",

    },
    icon: {
        position: 'absolute',
        left: 15,
        zIndex: 1,
    },
    // popularFeatureBodyContainer: {
    //     marginHorizontal: Dimensions.get('window').width * 0.03,  // should be applyed to all fixed items
    //     // marginTop: Dimensions.get('window').height * 0.04, // should be applyed to all fixed items
    //     height: Dimensions.get('window').height * 0.18,
    //     width: Dimensions.get('window').width * 0.94,

    //     borderWidth: 2,
    //     backgroundColor: themeColors.componentColor, // bg color
    //     borderColor: themeColors.secComponentColor,
    // },
    // popularFeatureSplitContainer: {
    //     flex: 1,
    //     height: '100%',
    //     flexDirection: 'row',
    //     alignItems: 'center',
    // },
    // popularFeaturesContent: {
    // flex: 1,
    // padding: 7,
    // },
    text: {
        margin: 24,
        fontSize: 60,
    },
}