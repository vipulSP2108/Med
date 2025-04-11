import { Image, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import React, { useContext } from 'react'
import Colors from './Colors'
import TruncatedTextComponent from './TruncatedTextComponent'
import FoodIcon from './FoodIcon'
import TextStyles from '../Style/TextStyles'
import { ThemeContext } from '../Context/ThemeContext'
// import { useNavigation } from '@react-navigation/native'

export default SlideItems = ({ item, navigation }) => {
    const fontstyles = TextStyles();
    // const navigation = useNavigation();
      const { themeColors, toggleTheme } = useContext(ThemeContext);

    return (
        <View className=' p-2' style={[styles.popularFeatureBodyContainer, {backgroundColor: themeColors.secComponentColor, }]}>
            <View style={styles.popularFeatureSplitContainer}>
                <Image
                    source={item.image ?
                        { uri: item.image, method: 'POST', headers: { Pragma: 'no-cache' } } :
                        require('./../../assets/store.jpg')}
                    defaultSource={require('./../../assets/store.jpg')}
                    style={[styles.popularFeatureImage, {borderColor: themeColors.componentColor,}]}
                    alt="Logo"
                />
                <View style={styles.popularFeaturesContent}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { color: themeColors.textColor }]}>{item.menuType[0]}</Text>
                    <Text  numberOfLines={1} ellipsizeMode='tail' className=' -mt-1' style={[fontstyles.boldh2, { color: themeColors.mainTextColor }]}>{item.name}</Text>
                    <TouchableOpacity
                        className='justify-center items-center rounded-md mt-1 px-3 py-1'
                        style={{
                            backgroundColor: themeColors.diffrentColorOrange,
                            alignSelf: 'flex-start',
                        }}
                        onPress={() => navigation.navigate("Details", { Data: item })}
                    >
                        <Text style={[fontstyles.number, {color:'white'}]}>Buy now</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    popularFeatureBodyContainer: {
        marginHorizontal: Dimensions.get('window').width * 0.03,  // should be applyed to all fixed items
        // marginTop: Dimensions.get('window').height * 0.04, // should be applyed to all fixed items
        height: Dimensions.get('window').height * 0.18,
        width: Dimensions.get('window').width * 0.94,
        // padding: 12,
        // bg color
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
    },
    popularFeatureSplitContainer: {
        flex: 1,
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    popularFeatureImage: {
        // resizeMode: 'contain',
        height: '100%',
        width: '55%', // Adjust width for responsiveness
        borderWidth: 2,
         // border color
        borderRadius: 14,
    },
    popularFeaturesContent: {
        flex: 1,
        padding: 7,
    },
    NormalTxt: {
        color: "#FCDC2A",
        fontWeight: '900',
        fontSize: 18,
    },
    BoldTxt: {
        fontWeight: '400',
        marginBottom: 8,
        fontSize: 21,
        color: "#F7F6BB",
    },
    text: {
        margin: 24,
        fontSize: 60,
    },
})