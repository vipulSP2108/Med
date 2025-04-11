import { StyleSheet, Text, View, FlatList, Dimensions, TouchableOpacity, Image, ImageBackground } from 'react-native';
import React, { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from './Colors';
import TruncatedTextComponent from './TruncatedTextComponent';
import TextStyles from '../Style/TextStyles';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { ThemeContext } from '../Context/ThemeContext';

export default PopularMenuContainer = ({ data }) => {
    const { outletsNEW } = useContext(GlobalStateContext);
    const { themeColors, toggleTheme } = useContext(ThemeContext);

    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(true);

    const navToDetails = (item, initialIndex) => {
        navigation.navigate("Details", { Data: outletsNEW.find(shop => shop.name === item.storeName), initialIndex: initialIndex });
    };

    const fontstyles = TextStyles();

    const renderItem = ({ item, index }) => {
        const isLastItem = index === data.length - 1;

        return (
            <Animated.View entering={FadeInRight.delay(index * 100).springify()} style={[styles.foodItemCollectionContainer, isLastItem && { marginRight: 15 }]}>
                {/*  */}
                <TouchableOpacity onPress={() => navToDetails(item, item.categoryIndex)}>
                    <View className='overflow-hidden' style={[styles.foodItemContainer, { backgroundColor: themeColors.textColor }]}>
                        <ImageBackground
                            source={item.image ?
                                { uri: item.image, method: 'POST', headers: { Pragma: 'no-cache' } } :
                                require('./../../assets/menu.jpg')}
                            defaultSource={require('./../../assets/menu.jpg')}
                            // onLoadStart={() => setIsLoading(true)}
                            // onLoadEnd={() => setIsLoading(false)}
                            // source={item.image}
                            className=' h-full w-full overflow-hidden'
                            alt="Logo"
                            resizeMode='cover'
                            style={{ flex: 1, justifyContent: 'center', }}
                        >
                            {/* {isLoading && (
                                <Image
                                    source={require('./../../assets/favicon.png')}
                                    style={{ flex: 1, justifyContent: 'center' }}
                                    resizeMode='cover'
                                    defaultSource={require('./../../assets/menu.jpg')}
                                />
                            )} */}
                            <LinearGradient
                                start={{ x: 0.60, y: 0.65 }} end={{ x: 0.50, y: 1.1 }}
                                className='overflow-hidden h-full w-full'
                                colors={['transparent', 'black']}>
                                <View className='absolute bottom-1 p-2'>
                                    <Text numberOfLines={1} ellipsizeMode='tail' className='text-gray-300' style={[fontstyles.h5_5]}>
                                        {item.storeName}
                                    </Text>
                                    <Text numberOfLines={1} ellipsizeMode='tail' className='-mb-1' style={[fontstyles.h5_bold, { color: 'white' }]}>
                                        {item.item}
                                    </Text>
                                </View>
                            </LinearGradient>
                        </ImageBackground>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    }

    return (
        <FlatList
            horizontal
            data={data}
            renderItem={({ item, index }) => renderItem({ item, index })}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    foodItemCollectionContainer: {
        marginLeft: Dimensions.get('window').width * 0.035,
        marginTop: Dimensions.get('window').height * 0.02,
        gap: Dimensions.get('window').width * 0.02,
    },
    foodItemContainer: {

        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        height: Dimensions.get('window').height * 0.20,
        width: Dimensions.get('window').height * 0.153,
    },
    txt: {
        color: '#40A578',
    },
});
