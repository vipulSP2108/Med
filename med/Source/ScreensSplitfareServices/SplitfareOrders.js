import { View, Text, FlatList, StyleSheet, Alert, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { API_BASE_URL, DELETERIDE_ENDPOINT, GETUSERRIDES_ENDPOINT, LEFTRIDE_ENDPOINT } from '../Constants/Constants';
import { ThemeContext } from '../Context/ThemeContext';
import TextStyles from '../Style/TextStyles';
import { Ionicons } from '@expo/vector-icons';
import { formatDate2 } from '../Helper/formatDate2';

export default function SplitfareOrders() {

  const fontstyles = TextStyles();
  const { userData } = useContext(GlobalStateContext); // Assuming user data is provided through context
  const [memberRides, setMemberRides] = useState([]);
  const [creatorRides, setCreatorRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { themeColors } = useContext(ThemeContext);
  const [openDrawer, setOpenDrawer] = useState(null);

  const renderRideItem = ({ item, isPassanger }) => {
    // console.log()
    // candidatesFilled, candidatesNeeded, goingDate, passengers, priceIsApprox, rideStatus, totalCandidates
    return (
      <TouchableOpacity
        // onPress={() => navigation.navigate('SplitfareRideDetails', { details: item, fromLocation, toLocation, goingDate, peopleCount })}
        className='mt-3 rounded-2xl' style={{ backgroundColor: themeColors.componentColor, elevation: 5 }} >
        <View className=' flex-row justify-between px-3 pt-3'>
          <Text style={[fontstyles.h4, { color: themeColors.mainTextColor }]}>{formatDate2(item.item.goingDate)}</Text>
          {/* {console.log(formatDate2('2025-04-10T00:00:00.000Z'))} */}
          <Text style={[fontstyles.h4, { color: themeColors.mainTextColor }]}>{item.item.rideStatus}</Text>
        </View>
        <View className=' p-3 flex-row w-full justify-between'>
          <View className=' flex-row flex-1 pr-2'>
            <View>
              <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.mainTextColor }]}>{item.item.goingTime}</Text>
            </View>
            <View className=' overflow-auto w-5 -ml-[1px] mr-[4px]'>
              <Ionicons color={themeColors.mainTextColor} name='git-pull-request' size={50} />
            </View>
            <View className='justify-between bottom-[1.5px] flex-1'>
              <Text numberOfLines={1} ellipsizeMode="tail" style={[fontstyles.h5_bold, { color: themeColors.mainTextColor }]}>
                {item.item.StartingPoint}
              </Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={[fontstyles.h5_bold, { color: themeColors.mainTextColor }]}>
                {item.item.destination}
              </Text>
            </View>
          </View>
          <View className=' items-end '>
            {/* {console.log(item)} */}
            {/* {item.priceIsApprox ? 'Approx Price: ' : 'Price: '}  */}
            <View className=' flex-row'>
              <Text style={[fontstyles.number, { fontSize: 20, color: themeColors.mainTextColor }]}>
                ₹{item.item.finalPricePerPerson.toFixed(0)}
              </Text>
              <Text className=' mt-[2.4px]' style={[fontstyles.number, { fontSize: 13, color: themeColors.textColor }]}>
                .{item.item.finalPricePerPerson.toFixed(2).split('.')[1]}
              </Text>
            </View>
            <Text className=' -mt-2' style={[fontstyles.h6, { color: themeColors.diffrentColorPerple }]}>
              {item.item.mode}
            </Text>
          </View>
        </View>
        <Text numberOfLines={1} ellipsizeMode='clip' style={{ color: themeColors.textColor }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>

        <View className='pb-3 px-3 flex-row items-center'>
          <Ionicons style={{ marginTop: 7, marginRight: 7 }} name='person-circle' size={35} color={themeColors.textColor} />
          <View>
            <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.textColor }]}>{item?.rideCreator?.name}</Text>
            <View className=' flex-row'>
              <Text style={[fontstyles.h6, { color: themeColors.textColor }]}>Deleted Rides: {item?.rideCreatorStats?.deleteRideCount}, </Text>
              <Text style={[fontstyles.h6, { color: themeColors.textColor }]}>Complaints: {item?.rideCreatorStats?.complentCount}</Text>
            </View>
          </View>
        </View>

        <Text>{item.item.additionalDetails}</Text>
        {/*  */}
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

  // Fetch user rides (both member and creator rides)
  const fetchUserRides = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}:${GETUSERRIDES_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData._id,  // Sending userId from context or state
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMemberRides(data.memberRides);  // Set member rides
        setCreatorRides(data.creatorRides);  // Set creator rides
      } else {
        Alert.alert('Error', data.message || 'Error fetching user rides');
      }
    } catch (error) {
      console.error('Error fetching user rides:', error);
      Alert.alert('Error', 'There was an error fetching the user rides');
    } finally {
      setLoading(false);
      setRefreshing(false);  // Stop refreshing after data is fetched
    }
  };

  // console.log(memberRides, creatorRides)

  // Function to handle leaving a ride
  const leaveRide = async (rideId) => {
    try {
      const response = await fetch(`${API_BASE_URL}:${LEFTRIDE_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userData: userData,  // The user's ID
          rideId,               // The ride the user wants to leave
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', `You have left the ride successfully!\n\nYour stats: Left Rides: ${data.userStats.leftRideCount} | Blocked Until: ${data.userStats.blockedTill ? new Date(data.userStats.blockedTill).toLocaleDateString() : 'N/A'}`);
        // Optionally, refresh rides list after leaving
        fetchUserRides();
      } else {
        Alert.alert('Error', data.message || 'Error leaving the ride');
      }
    } catch (error) {
      console.error('Error leaving the ride:', error);
      Alert.alert('Error', 'There was an error leaving the ride');
    }
  };


  // Function to handle leaving a ride
  const deleteRide = async (rideId) => {
    try {
      const response = await fetch(`${API_BASE_URL}:${DELETERIDE_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userData: userData,  // The user's ID
          rideId,               // The ride the user wants to leave
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', `You have deleted the ride successfully!\n\nYour stats: deleted Rides: ${data?.userStats?.deleteRideCount} | Blocked Until: ${data?.userStats?.blockedTill ? new Date(data?.userStats?.blockedTill).toLocaleDateString() : 'N/A'}`);
        // Optionally, refresh rides list after leaving
        fetchUserRides();
      } else {
        Alert.alert('Error', data.message || 'Error leaving the ride');
      }
    } catch (error) {
      console.error('Error leaving the ride:', error);
      Alert.alert('Error', 'There was an error leaving the ride');
    }
  };

  // Call fetchUserRides when the component mounts
  useEffect(() => {
    fetchUserRides();
  }, []);

  // Function to handle pull-to-refresh action
  const onRefresh = () => {
    setRefreshing(true);  // Set refreshing to true when user pulls to refresh
    fetchUserRides();  // Re-fetch the rides when pulling down to refresh
  };

  // Render ride items
  // const renderRideItem = ({ item, isPassanger }) => (
  //   <View style={[styles.rideCard, { backgroundColor: themeColors.componentColor }]}>
  //     <Text style={[styles.rideTitle, { color: themeColors.mainTextColor }]}>
  //       Ride from {item.item.StartingPoint} to {item.item.destination}
  //     </Text>
  //     <Text style={[styles.rideDetails, { color: themeColors.textColor }]}>
  //       Date: {new Date(item.item.goingDate).toLocaleDateString()} | Time: {item.item.goingTime}
  //     </Text>
  //     <Text style={[styles.rideDetails, { color: themeColors.secondaryTextColor }]}>
  //       Type: ${item.item.mode}
  //     </Text>
  //     <Text style={[styles.rideDetails, { color: themeColors.textColor }]}>
  //       {item.item.priceIsApprox ? 'Approx Price: ' : 'Price: '}
  //       {/* ${item.item.agreedPrice} */}
  //       {item.item.finalPricePerPerson}
  //     </Text>
  //     {/* Add Leave button for passenger rides */}
  //     {isPassanger ?
  //       <TouchableOpacity
  //         style={[styles.leaveButton, { backgroundColor: themeColors.diffrentColorRed }]}
  //         onPress={() => leaveRide(item.item._id)}
  //       >
  //         <Text style={styles.leaveButtonText}>Leave Ride</Text>
  //       </TouchableOpacity>
  //       :
  //       <TouchableOpacity
  //         style={[styles.leaveButton, { backgroundColor: themeColors.diffrentColorRed }]}
  //         onPress={() => deleteRide(item.item._id)}
  //       >
  //         <Text style={styles.leaveButtonText}>Delete Ride</Text>
  //       </TouchableOpacity>
  //     }


  //   </View>
  // );

  return (
    <View style={[{ backgroundColor: themeColors.backGroundColor }]}>
      {/* <Text style={[styles.header, { color: themeColors.mainTextColor }]}>Your Rides</Text> */}

      {loading ? (
        <Text style={[styles.loadingText, { color: themeColors.textColor }]}>Loading rides...</Text>
      ) : (
        <ScrollView
        className=' p-4' 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}  // Trigger fetchUserRides when refreshing
              tintColor={themeColors.diffrentColorPerple}  // Color for the refresh spinner
            />
          }
        >
          {/* Member Rides Section */}
          {memberRides.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={[fontstyles.entryUpper, { color: themeColors.mainTextColor }]}>
                Your Rides as a Passenger
              </Text>
              <FlatList
                data={memberRides}
                isPassanger={true}
                // renderItem={renderRideItem}
                renderItem={(item) => renderRideItem({ item, isPassanger: true })}
                keyExtractor={(item) => item._id}
                style={styles.rideList}
              />
            </View>
          )}

          {/* Creator Rides Section */}
          {creatorRides.length > 0 && (
            <View >
              <Text style={[fontstyles.entryUpper, { color: themeColors.mainTextColor }]}>
                Your Rides as a Creator
              </Text>
              <FlatList
                data={creatorRides}
                isPassanger={false}
                renderItem={(item) => renderRideItem({ item, isPassanger: false })}
                keyExtractor={(item) => item._id}
                style={styles.rideList}
              />
            </View>
          )}

          {/* If no rides found in either section */}
          {memberRides.length === 0 && creatorRides.length === 0 && (
            <Text style={[styles.noRidesText, { color: themeColors.textColor }]}>
              You have no rides yet!
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rideCard: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#f7f7fb',
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
  rideList: {
    marginBottom: 10,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  noRidesText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  leaveButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
