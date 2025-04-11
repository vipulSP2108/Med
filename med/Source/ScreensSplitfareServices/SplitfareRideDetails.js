import { View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import TextStyles from '../Style/TextStyles';
import { ThemeContext } from '../Context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { API_BASE_URL, JOINRIDE_ENDPOINT } from '../Constants/Constants';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '../Helper/formatDate';
import { GlobalStateContext } from '../Context/GlobalStateContext';

export default function SplitfareRideDetails({ route }) {
    const { details, fromLocation, toLocation, goingDate, peopleCount } = route.params;
    const { userData } = useContext(GlobalStateContext);

    const fontstyles = TextStyles();
    const { themeColors } = useContext(ThemeContext);
    const navigation = useNavigation();

    const [creatorList, setCreatorList] = useState(true);
    const [passengerList, setPassengerList] = useState(false);

    const joinRide = async (rideId) => {
        try {
            const response = await fetch(`${API_BASE_URL}:${JOINRIDE_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userData,
                    rideId,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'You have joined the ride successfully!');
                navigation.navigate('SplitfareOrders')
                // navigation.navigate('SplitfareMainScreen')
                // fetchRides();
            } else {
                Alert.alert('Error', data.message || 'Error joining the ride');
            }
        } catch (error) {
            console.error('Error joining the ride:', error);
            Alert.alert('Error', 'There was an error joining the ride');
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: themeColors.backGroundColor }}>
            <StatusBar
                barStyle={themeColors.backGroundColor === '#1C1C1E' ? 'light-content' : 'dark-content'}
                backgroundColor={themeColors.componentColor}
            />
            <ScrollView className=' gap-2'>
                <View className=' p-5' style={[{ backgroundColor: themeColors.componentColor, elevation: 5 }]}>
                    <Text className=' mb-7' style={[fontstyles.boldh2, {color: themeColors.mainTextColor}]}>On {formatDate(goingDate)} </Text>
                    <View className=' flex-row w-full justify-between'>
                        <View className=' flex-row flex-1 pr-2'>
                            <View>
                                <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.mainTextColor }]}>{details.goingTime}</Text>
                            </View>
                            <View className=' overflow-auto w-5 -ml-[1px] mr-[4px]'>
                                <Ionicons color={themeColors.mainTextColor} name='git-pull-request' size={50} />
                            </View>
                            <View className='justify-between bottom-[1.5px] flex-1'>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[fontstyles.h5_bold, { color: themeColors.mainTextColor }]}>
                                    {details.StartingPoint}
                                </Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[fontstyles.h5_bold, { color: themeColors.mainTextColor }]}>
                                    {details.destination}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className=' p-5 flex-row justify-between items-center' style={[{ backgroundColor: themeColors.componentColor, elevation: 5 }]}>
                    <View className=' flex-row items-center'>
                        <Text style={[fontstyles.h5_bold, { fontSize: 22, color: themeColors.mainTextColor }]} >Per Passenger </Text>
                        <Text style={[fontstyles.h6, { fontSize: 16, color: themeColors.diffrentColorPerple }]}>({details.mode})</Text>
                    </View>
                    <View>
                        <View className=' flex-row'>
                            {(details.mode == 'split' && details.priceIsApprox) && <Text className=' -mt-[1px]' style={[fontstyles.h5_bold, { color: themeColors.textColor }]} >approx:   </Text>}
                            <Text style={[fontstyles.number, { fontSize: 20, color: themeColors.mainTextColor }]}>
                                ₹ {(details.agreedPrice / (details.candidatesFilled + 1)).toFixed(2)}
                            </Text>
                            {/* <Text style={[fontstyles.number, { fontSize: 20, color: themeColors.secondaryTextColor }]}>
                                ₹ {details.finalPricePerPerson.toFixed(2).split('.')[0]}
                            </Text>
                            <Text className=' mt-[2.4px]' style={[fontstyles.number, { fontSize: 13, color: themeColors.secondaryTextColor }]}>
                                .{details.finalPricePerPerson.toFixed(2).split('.')[1]}
                            </Text> */}
                        </View>
                    </View>
                </View>

                <View className=' p-5' style={[{ backgroundColor: themeColors.componentColor, elevation: 5 }]}>
                    <TouchableOpacity onPress={() => { setCreatorList(!creatorList) }} className=' flex-row items-center justify-between'>
                        <Text style={[fontstyles.h5_bold, { fontSize: 22, color: themeColors.mainTextColor }]}>Creator Details</Text>
                        <Ionicons name={creatorList ? 'caret-up' : 'caret-down'} size={18} color={themeColors.textColor} />
                    </TouchableOpacity>

                    {creatorList && <View className='flex-row items-center'>
                        <Ionicons style={{ marginTop: 7, marginRight: 7 }} name='person-circle' size={35} color={themeColors.textColor} />
                        <View>
                            <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.textColor }]}>{details.rideCreator.name}</Text>
                            <View className=' flex-row'>
                                <Text style={[fontstyles.h6, { color: themeColors.textColor }]}>Deleted: {details.rideCreatorStats.deleteRideCount}, </Text>
                                <Text style={[fontstyles.h6, { color: themeColors.textColor }]}>Completed: {details.rideCreatorStats.complitedRideCountAsOwner - details.rideCreatorStats.deleteRideCount}, </Text>
                                <Text style={[fontstyles.h6, { color: themeColors.textColor }]}>Complaints: {details.rideCreatorStats.complentCount}</Text>
                            </View>
                        </View>
                    </View>}

                    <TouchableOpacity onPress={() => { setPassengerList(!passengerList) }} className=' mt-5 flex-row items-center justify-between'>
                        <Text style={[fontstyles.h5_bold, { fontSize: 22, color: themeColors.mainTextColor }]}>Passenger Details</Text>
                        <Ionicons name={passengerList ? 'caret-up' : 'caret-down'} size={18} color={themeColors.textColor} />
                    </TouchableOpacity>
                    {passengerList && (details.passengers.length == 0 ?
                        (
                            <Text style={[fontstyles.h5_5, { color: themeColors.textColor }]}>No passenger has joined yet!</Text>
                        ) : (
                            details.passengers.map((passenger) => (
                                <View className='flex-row items-center' key={passenger.userID?._id}>
                                    <Ionicons
                                        style={{ marginTop: 7, marginRight: 7 }}
                                        name='person-circle'
                                        size={35}
                                        color={themeColors.textColor}
                                    />
                                    <View>
                                        <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.textColor }]}>
                                            {passenger?.userId?.name}
                                        </Text>
                                        <View className=' flex-row'>
                                            <Text style={[fontstyles.h6, { color: themeColors.textColor }]}>leaved: {passenger.userStats.leftRideCount}, </Text>
                                            <Text style={[fontstyles.h6, { color: themeColors.textColor }]}>Completed: {passenger.userStats.complitedRideCountAsPassager - passenger.userStats.leftRideCount}, </Text>
                                            <Text style={[fontstyles.h6, { color: themeColors.textColor }]}>Complaints: {passenger.userStats.complentCount}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        ))}

                    <TouchableOpacity
                        className='border-[1.4px] flex-row mt-5 p-3 rounded-full items-center justify-center '
                        style={[{ borderColor: themeColors.secComponentColor }]}
                        onPress={() => Linking.openURL(`tel:${details.rideCreator.phone}`)}  // Join the ride when pressed
                    >
                        <Ionicons name='call' size={20} color={themeColors.diffrentColorPerple} />
                        <Text className=' -mt-1 ml-2' style={[fontstyles.h3, { color: themeColors.diffrentColorPerple }]}>Contact Creator</Text>
                    </TouchableOpacity>
                </View>


                <View className=' p-5 mb-5' style={[{ backgroundColor: themeColors.componentColor, elevation: 5 }]}>

                    <Text style={[fontstyles.h5_bold, { fontSize: 22, color: themeColors.mainTextColor }]}>
                        Ride Details:
                    </Text>

                    <View className='brounded-lg shadow-md mt-2'>
                        <View className='flex-row justify-between mb-1'>
                            <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.textColor }]}>
                                Total Space:
                            </Text>
                            <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.mainTextColor }]}>
                                {details.totalCandidates}
                            </Text>
                        </View>

                        <View className='flex-row justify-between mb-1'>
                            <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.textColor }]}>
                                Total Candidates Filled:
                            </Text>
                            <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.mainTextColor }]}>
                                {details.candidatesFilled}
                            </Text>
                        </View>

                        <View className='flex-row justify-between mb-1'>
                            <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.textColor }]}>
                                Total Candidates Needed:
                            </Text>
                            <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.mainTextColor }]}>
                                {details.candidatesNeeded}
                            </Text>
                        </View>

                        <View className='flex-row justify-between'>
                            <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.textColor }]}>
                                Agreed Price:
                            </Text>
                            <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.mainTextColor }]}>
                                {details.agreedPrice}
                            </Text>
                        </View>
                    </View>

                    {details.additionalDetails &&
                        <View>
                            <Text style={[fontstyles.h5_bold, { fontSize: 20, color: themeColors.mainTextColor }]}>
                                AdditionalDetails:
                            </Text>
                            <Text className=' mt-2' style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.textColor }]}>
                                {details.additionalDetails}
                            </Text>
                        </View>
                    }
                </View>

            </ScrollView>

            <View className=' py-3 px-5' style={[{ backgroundColor: themeColors.componentColor, elevation: 10 }]}>
                <TouchableOpacity
                    className=' p-4 rounded-full items-center justify-center'
                    style={[{ backgroundColor: themeColors.diffrentColorPerple }]}
                    onPress={() => joinRide(details._id)}  // Join the ride when pressed
                >
                    {/* <Text className='-mt-1' style={[fontstyles.h3, { color: themeColors.backGroundColor }]}>
                        Book for {peopleCount} {peopleCount > 1 ? 'Passengers' : 'Passenger'}
                    </Text> */}
                    <Text className='-mt-1' style={[fontstyles.h3, { color: 'white' }]}>
                        Book for 1 Passenger
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
