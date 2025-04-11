import { View, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar, Alert, RefreshControl } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { ThemeContext } from '../Context/ThemeContext';
import { API_BASE_URL, GETALLRIDES_ENDPOINT } from '../Constants/Constants';
import TextStyles from '../Style/TextStyles';
import { formatDate } from '../Helper/formatDate';

export default function SplitfareRides({ route }) {
    const { fromLocation, toLocation, goingDate, peopleCount } = route.params;
    const fontstyles = TextStyles();
    const { userData } = useContext(GlobalStateContext);

    const { themeColors } = useContext(ThemeContext);
    const navigation = useNavigation();
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDrawer, setOpenDrawer] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // Assuming userData is available through global state or context


    // Fetch all rides from the backend
    const fetchRides = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}:${GETALLRIDES_ENDPOINT}`);
            const data = await response.json();

            if (response.ok) {
                setRides(data.rides);
                if (data.message) {
                    Alert.alert(data.message);
                }
            } else {
                Alert.alert('Error', data.message || 'Error fetching rides');
            }
        } catch (error) {
            console.error('Error fetching rides:', error);
            Alert.alert('Error', 'There was an error fetching the rides');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Call fetchRides when the component mounts
    useEffect(() => {
        fetchRides();
    }, []);

    // Function to handle the pull-to-refresh action
    const onRefresh = () => {
        setRefreshing(true);
        fetchRides();
    };

    // Filter rides based on goingDate and peopleCount
    var filteredRides = rides.filter((ride) => {
        // Convert both ride's goingDate to the same format as goingDate (both are in a date format)
        const rideDate = new Date(ride.goingDate).toLocaleDateString();
        return rideDate === goingDate && peopleCount <= ride.candidatesNeeded;
    });

    // filteredRides = filteredRides.filter((ride) => {
    //     const isUserPartOfCreator = ride.rideCreator._id.toString() === userData._id.toString();
    //     const isUserPartOfPassenger = ride.passengers.some(passenger => passenger.userId._id.toString() === userData._id.toString());
    //     return!isUserPartOfPassenger && !isUserPartOfCreator;
    // });

    const renderRideItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('SplitfareRideDetails', { details: item, fromLocation, toLocation, goingDate, peopleCount })}
                className='mx-4 mt-3 rounded-2xl' style={{ backgroundColor: themeColors.componentColor, elevation: 5 }} >
                <View className=' p-3 flex-row w-full justify-between'>
                    <View className=' flex-row flex-1 pr-2'>
                        <View>
                            <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.mainTextColor }]}>{item.goingTime}</Text>
                        </View>
                        <View className=' overflow-auto w-5 -ml-[1px] mr-[4px]'>
                            <Ionicons color={themeColors.mainTextColor} name='git-pull-request' size={50} />
                        </View>
                        <View className='justify-between bottom-[1.5px] flex-1'>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={[fontstyles.h5_bold, { color: themeColors.mainTextColor }]}>
                                {item.StartingPoint}
                            </Text>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={[fontstyles.h5_bold, { color: themeColors.mainTextColor }]}>
                                {item.destination}
                            </Text>
                        </View>
                    </View>
                    <View className=' items-end '>
                        {/* {console.log(item)} */}
                        {/* {item.priceIsApprox ? 'Approx Price: ' : 'Price: '}  */}
                        <View className=' flex-row'>
                            <Text style={[fontstyles.number, { fontSize: 20, color: themeColors.mainTextColor }]}>
                                ₹{(item.agreedPrice / (item.candidatesFilled + 1)).toFixed(2).split('.')[0]}
                            </Text>
                            <Text className=' mt-[2.4px]' style={[fontstyles.number, { fontSize: 13, color: themeColors.textColor }]}>
                                .{(item.agreedPrice / (item.candidatesFilled + 1)).toFixed(2).split('.')[1]}
                            </Text>
                        </View>
                        <Text className=' -mt-2' style={[fontstyles.h6, { color: themeColors.diffrentColorPerple }]}>
                            {item.mode}
                        </Text>
                    </View>
                </View>
                <Text numberOfLines={1} ellipsizeMode='clip' style={{ color: themeColors.textColor }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>

                <View className='pb-3 px-3 flex-row items-center'>
                    <Ionicons style={{ marginTop: 7, marginRight: 7 }} name='person-circle' size={35} color={themeColors.textColor} />
                    <View>
                        <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.textColor }]}>{item.rideCreator.name}</Text>
                        <View className=' flex-row'>
                            <Text style={[fontstyles.h6, { color: themeColors.textColor }]}>Deleted Rides: {item.rideCreatorStats.deleteRideCount}, </Text>
                            <Text style={[fontstyles.h6, { color: themeColors.textColor }]}>Complaints: {item.rideCreatorStats.complentCount}</Text>
                        </View>
                    </View>
                </View>

                {/* <TouchableOpacity
                    style={[styles.viewDetailsButton, { backgroundColor: themeColors.buttonColor }]}
                    onPress={() => setOpenDrawer(openDrawer === item._id ? null : item._id)}  // Toggle drawer
                >
                    <Text style={{ color: themeColors.buttonTextColor }}>View Details</Text>
                </TouchableOpacity>

                 */}

                {openDrawer === item._id && (
                    <View style={[styles.drawer, { backgroundColor: themeColors.cardBackgroundColor }]}>
                        {item.passengers?.length > 0 ? (
                            item.passengers.map((passenger, index) => (
                                <View key={index} style={styles.passengerContainer}>
                                    <Text>{passenger.status}</Text>
                                    <Text>{passenger.userId.name}</Text>
                                    <TouchableOpacity onPress={() => `tel{passenger.userId.phone}`}>
                                        <Text style={{ color: themeColors.buttonColor }}>Call</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <Text>No passengers yet.</Text>
                        )}
                        {item.additionalDetails && <Text>{item.additionalDetails}</Text>}
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: themeColors.backGroundColor }}>
            <StatusBar
                barStyle={themeColors.backGroundColor === '#1C1C1E' ? 'light-content' : 'dark-content'}
                backgroundColor={themeColors.componentColor}
            />

            <View className=' py-3 px-4' style={{ backgroundColor: themeColors.componentColor }}>
                <View className=' flex-row items-center border-[1.3px] rounded-2xl px-2' style={{ borderColor: themeColors.secComponentColor }}>
                    {/* fromLocation, toLocation, goingDate, peopleCount */}
                    <View className=' pr-3'>
                        <Ionicons name="chevron-back" size={24} color={themeColors.textColor} />
                    </View>
                    <View className=' justify-center pt-2 pb-3'>
                        <View className=' flex-row items-center'>
                            <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.mainTextColor }]}>{fromLocation == '' ? 'From Location' : fromLocation}</Text>
                            <Ionicons style={{ paddingHorizontal: 4, marginBottom: -5 }} name="arrow-forward" size={16} color={themeColors.textColor} />
                            <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.mainTextColor }]}>{toLocation == '' ? 'To Location' : toLocation}</Text>
                        </View>
                        {/* {console.log(goingDate)} */}
                        <View className=' flex-row items-center'>
                            <Text style={[fontstyles.h5_5, { fontSize: 16, color: themeColors.textColor }]}>{formatDate(goingDate)}, </Text>
                            <Text style={[fontstyles.h5_5, { fontSize: 16, color: themeColors.textColor }]}>{peopleCount} {peopleCount === 1 ? 'passenger' : 'passengers'}</Text>
                        </View>
                    </View>
                </View>
            </View>


            <View >
                {loading ? (
                    <Text className=' p-4 text-center' style={[fontstyles.h4, { color: themeColors.mainTextColor }]}>Loading rides...</Text>
                ) : (
                    <View>
                        <FlatList
                            ListHeaderComponent={
                                filteredRides.length === 0 && (
                                    <Text className=' p-4 text-center' style={[fontstyles.h6, { color: themeColors.diffrentColorRed }]}>
                                        Sorry, no rides match the selected criteria. Try changing the criteria or create your own ride.
                                    </Text>
                                )
                            }
                            data={filteredRides}
                            ListFooterComponent={
                                <View className=' items-center mt-6'>
                                    <TouchableOpacity onPress={() => navigation.navigate('SplitfarCreateRide')} style={{ backgroundColor: themeColors.componentColor, borderColor: themeColors.secComponentColor }} className='px-8 py-3 border-[1px] items-center justify-center rounded-full'>
                                        <Text className=' -mt-1' style={[fontstyles.h5_bold, { color: themeColors.diffrentColorPerple }]}>Create a Ride</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            showsVerticalScrollIndicator={false}
                            renderItem={renderRideItem}
                            keyExtractor={(item) => item._id}
                            contentContainerStyle={styles.listContainer}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}  // Trigger fetchRides when refreshing
                                />
                            }
                        />
                    </View>
                )}
            </View>
        </View>
    );
}

// Styles for the screen
const styles = StyleSheet.create({
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    listContainer: {
        paddingBottom: 100,
    },
    rideCard: {
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    rideTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    rideDetails: {
        fontSize: 14,
        marginVertical: 2,
    },
    viewDetailsButton: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    drawer: {
        marginTop: 10,
        padding: 10,
        borderRadius: 5,
        elevation: 2,
    },
    passengerContainer: {
        marginBottom: 10,
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 30,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
});