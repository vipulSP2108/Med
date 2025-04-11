import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { ThemeContext } from '../Context/ThemeContext';
import TruncatedTextComponent from './TruncatedTextComponent';
import { Ionicons } from '@expo/vector-icons';
import TextStyles from '../Style/TextStyles';

export default function Navbar() {
    const fontstyles = TextStyles();
    const navigation = useNavigation();
    const { themeColors, toggleTheme } = useContext(ThemeContext);
    const { userData } = useContext(GlobalStateContext);
    const navToPage = (page) => {
        navigation.navigate(page);
    };
    return (
        <View className='searchBodyContainer flex-row justify-between pt-2' style={{ marginHorizontal: Dimensions.get('window').width * 0.03 }}>
            <TouchableOpacity activeOpacity={1} onPress={() => navToPage('SelectAddress')} className='address flex-row gap-2 items-center w-9/12'>
                <View>
                    <Ionicons color={themeColors.diffrentColorOrange} name="earth" size={30} className='searchIcon' style={{ textAlign: 'center', textAlignVertical: 'center', marginTop: 7 }} />
                </View>
                <View>
                    <View className=' flex-row'>
                        {/* {console.log(userData.name)} */}
                        <Text ellipsizeMode='tail' style={[fontstyles.blackh2, { color: themeColors.mainTextColor }]}>{userData?.name ? TruncatedTextComponent(userData?.name, 15) : "UserName"} </Text>
                        <Ionicons color={themeColors.mainTextColor} name="chevron-down" size={24} style={{ textAlign: 'center', textAlignVertical: 'bottom', top: 3 }} />
                    </View>
                    {/* <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h4, { color: themeColors.textColor }]}>{userData.name ? 'you are a ' + userData.role : "UserRole"}</Text> */}
                </View>
                {/* {console.log(height)} */}
            </TouchableOpacity>
            <View className='address flex-row gap-2 items-center'>
                {/* <TouchableOpacity onPress={() => { settype('lang'), show() }} style={{ backgroundColor: themeColors.secComponentColor, borderRadius: 10, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons color={themeColors.textColor} name="language" size={24} />
                  </TouchableOpacity> */}
                <TouchableOpacity onPress={() => navigation.navigate('Profile', { userData })} style={{ backgroundColor: themeColors.mainTextColor, borderRadius: 10, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons color={themeColors.diffrentColorPerple} activeOpacity={1} name="person" size={24} />
                </TouchableOpacity>
            </View>
        </View>
    )
}