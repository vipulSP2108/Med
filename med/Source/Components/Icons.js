import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import Colors from './Colors'

// export default function StarIcon() {
//     return (
//         <View className={`rounded-full flex-row justify-center items-center bg-green-500`} style={{ width: Dimensions.get('window').height * 0.03, height: Dimensions.get('window').height * 0.03 }}>
//             <Ionicons style={{ paddingBottom: 2 }} name="star" size={15} color={Colors.dark.colors.mainTextColor} />
//         </View>
//     )
// }


const Icons = () => {

    const StarIcon = () => {
            return (
                <View className={`rounded-full flex-row justify-center items-center `} style={{  backgroundColor:Colors.dark.colors.diffrentColorGreen, width: Dimensions.get('window').height * 0.027, height: Dimensions.get('window').height * 0.027 }}>
                    <Ionicons style={{ paddingBottom: 2 }} name="star" size={13} color= 'white'/>
                    {/* {Colors.dark.colors.mainTextColor}  */}
                </View>
            )
        }

        function CarIcon() {
            return (
                <View className={`rounded-full flex-row justify-center items-center`} style={{ backgroundColor:Colors.dark.colors.diffrentColorPerple, width: Dimensions.get('window').height * 0.03, height: Dimensions.get('window').height * 0.03 }}>
                    <Ionicons name="footsteps" size={15} color='white' /> 
                    {/* Colors.dark.colors.mainTextColor */}
                </View>
            )
        }

    return { StarIcon, CarIcon };
};

export default Icons;

// Use
// Import and const { All Icons Types } = Icons();