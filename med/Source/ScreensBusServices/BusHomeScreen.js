import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StatusBar, SafeAreaView, TouchableOpacity, FlatList, Modal, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GOOGLE_SCRIPT_getBusSchedule } from './api/api';
import useCustomAlert from '../Components/Alerthook';
import { ThemeContext } from '../Context/ThemeContext';

export default function BusHomeScreen() {
    const { themeColors } = useContext(ThemeContext);
    const { showAlert } = useCustomAlert();
    const navigation = useNavigation();

    const [busSchedule, setBusSchedule] = useState(null);
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const [schedule, setSchedule] = useState(null); // Holds the selected route's schedule

    const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
    const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);

    useEffect(() => {
        fetch(GOOGLE_SCRIPT_getBusSchedule)
            .then(response => response.json())
            .then(data => setBusSchedule(data))
            .catch(error => console.error('Error fetching bus schedule:', error));

        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 60000); // Update every minute

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const locations = [
        { label: 'IITGN', value: 'IITGN' },
        { label: 'Rakshashakti Circle', value: 'Rakshashakti Circle' },
        { label: 'Kudasan', value: 'Kudasan' },
        { label: 'Visat Circle', value: 'Visat Circle' },
    ];

    // Function to filter and display schedules that are available from the current time onwards
    const filterSchedule = (scheduleData, currentTime) => {
        const filteredUpstream = scheduleData?.upstream?.filter(item => {
            const time = item.Motera || item.IITGN || item.Sector - 1; // Assuming the time we are comparing is either of these
            return time >= currentTime; // Filter schedules that are greater than or equal to the current time
        });
        const filteredDownstream = scheduleData?.downstream?.filter(item => {
            const time = item.Motera || item.IITGN || item.Sector - 1; // Similar assumption for downstream times
            return time >= currentTime;
        });

        return { upstream: filteredUpstream, downstream: filteredDownstream };
    };

    // Get Bus or Metro schedule based on From and To locations
    //   const getBusScheduleForRoute = (from, to) => {
    //     let busDetails = [];
    //     if (busSchedule) {
    //       const upstreamKey = from === 'Visat Circle' ? 'IITBus_VisattoIITGN' : 'IITBus_KudassantoIITGN';
    //       const downstreamKey = to === 'Visat Circle' ? 'IITBus_VisattoIITGN' : 'IITBus_KudassantoIITGN';

    //       const upstream = busSchedule[upstreamKey]?.upstream;
    //       const downstream = busSchedule[downstreamKey]?.downstream;

    //       if (upstream && downstream) {
    //         busDetails = { upstream, downstream };
    //       }
    //     }
    //     return busDetails;
    //   };

    // Mapping for location variants
    // const locationMapping = {
    //     "Visat Circle": "Motera",
    //     "Rakshashakti Circle": "GNLU"
    // };

    const getBusScheduleForRoute = (from, to) => {
        // Ensure correct location names
        // from = locationMapping[from] || from;
        // to = locationMapping[to] || to;

        // Initialize route and schedule
        let routeData = [];
        let isMetro = false;

        // Function to find direction of travel (upstream or downstream)
        // const getDirection = (routeDataKey, from, to) => {
        //     const routefrom = busSchedule[routeDataKey].downstream[0][from];
        //     const routeto = busSchedule[routeDataKey].downstream[0][to];

        //     const isUpstream = routefrom > routeto
        //     return isUpstream ? "upstream" : "downstream";
        // };

        // console.log(getDirection("IITBus_KudassantoIITGN", "Rakshashakti Circle", "IITGN"))

        const isInterchange = (from, to) => {
            if ((from === "Visat Circle" && to === "IITGN") || (from === "IITGN" && to === "Visat Circle")) {
                return true;
            }
            return false;
        }

        const upstreamRoute = ["Visat Circle", "Kudasan", "Rakshashakti Circle", "IITGN"];
        const getDirection = (from, to) => {
            let fromIndex = -1;
            let toIndex = -1;
        
            upstreamRoute.forEach((element, index) => {
                if (element === from) {
                    fromIndex = index;
                } else if (element === to) {
                    toIndex = index;
                }
            });
        
            if (fromIndex === -1 || toIndex === -1) {
                return "Invalid location(s)";
            }
        
            let direction = fromIndex < toIndex ? "upstream" : "downstream";
        
            let route;
            if (direction === "upstream") {
                route = upstreamRoute.slice(fromIndex, toIndex + 1);
            } else {
                route = upstreamRoute.slice(toIndex, fromIndex + 1).reverse();
            }
        
            return {
                direction: direction,
                route: route
            };
        };

        console.log('from', from, 'to', to);
        console.log(getDirection(from, to));
        console.log('isInterchange', isInterchange(from, to));
        
        // Function to get schedules
        const getSchedule = (routeKey, direction) => {
            const route = busSchedule[routeKey];
            return route[direction];
        };

        // Determine the appropriate transport
        if (from === "IITGN" && to === "Rakshashakti Circle") {
            routeData = getSchedule("IITBus_KudassantoIITGN", getDirection("IITBus_KudassantoIITGN", "IITGN", "Rakshashakti Circle"));
        } else if (from === "Rakshashakti Circle" && to === "Kudasan") {
            routeData = getSchedule("IITBus_KudassantoIITGN", getDirection("IITBus_KudassantoIITGN", "Rakshashakti Circle", "Kudasan"));
        } else if (from === "Visat Circle" && to === "Motera") {
            isMetro = true;
            routeData = getSchedule("Metro_MoteratoDholakuva", getDirection("Metro_MoteratoDholakuva", "Motera", "Sector-1"));
        } else if (from === "IITGN" && to === "Visat Circle") {
            // Combination of Bus and Metro
            const busScheduleData = getSchedule("IITBus_VisattoIITGN", getDirection("IITBus_VisattoIITGN", "IITGN", "Visat Circle"));
            const metroScheduleData = getSchedule("Metro_MoteratoDholakuva", getDirection("Metro_MoteratoDholakuva", "Sector-1", "Motera"));
            return { busSchedule: busScheduleData, metroSchedule: metroScheduleData };
        } else {
            return "No route found";
        }

        console.log(routeData)

        return {
            routeData: routeData,
            isMetro: isMetro
        };
    };

    const handleSearchRoute = () => {
        if (!fromLocation || !toLocation) {
            showAlert("Please select both From and To locations.");
            return;
        }

        const schedule = getBusScheduleForRoute(fromLocation, toLocation);

        // if (!schedule || schedule.upstream.length === 0 || schedule.downstream.length === 0) {
        //   showAlert('No schedule available for the selected route.');
        //   return;
        // }

        // // Filter schedule data for current time and onwards
        // const filteredSchedule = filterSchedule(schedule, currentTime);
        // setSchedule(filteredSchedule);
    };

    const renderDropdownItems = (locationList, selectLocation, closeDropdown) => (
        <FlatList
            data={locationList}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => {
                        selectLocation(item.value);
                        closeDropdown();
                    }}
                    style={{
                        padding: 15,
                        backgroundColor: themeColors.backgroundColor,
                        borderBottomWidth: 1,
                        borderBottomColor: themeColors.borderColor,
                    }}
                >
                    <Text style={{ color: themeColors.textColor, fontSize: 16 }}>
                        {item.label}
                    </Text>
                </TouchableOpacity>
            )}
        />
    );

    return (
        <SafeAreaView>
            <View className="h-full" style={{ backgroundColor: themeColors.backGroundColor }}>
                <StatusBar barStyle={themeColors.backGroundColor === '#1C1C1E' ? 'light-content' : 'dark-content'} backgroundColor={themeColors.bottomNav} />

                <Text style={{ color: themeColors.textColor, fontSize: 24, textAlign: 'center', marginVertical: 20 }}>
                    Bus Route Finder
                </Text>

                <View style={{ padding: 20 }}>
                    {/* From Location Dropdown */}
                    <Text style={{ color: themeColors.textColor, fontSize: 16, marginBottom: 10 }}>Select From Location</Text>
                    <TouchableOpacity
                        onPress={() => setIsFromDropdownOpen(!isFromDropdownOpen)}
                        style={{
                            height: 50,
                            justifyContent: 'center',
                            backgroundColor: '#ddd',
                            borderRadius: 5,
                            paddingHorizontal: 15,
                            marginBottom: 20,
                        }}
                    >
                        <Text style={{ color: themeColors.textColor, fontSize: 16 }}>
                            {fromLocation || 'Select From Location'}
                        </Text>
                    </TouchableOpacity>

                    {isFromDropdownOpen && (
                        <Modal
                            transparent
                            visible={isFromDropdownOpen}
                            onRequestClose={() => setIsFromDropdownOpen(false)}
                        >
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                }}
                                onPress={() => setIsFromDropdownOpen(false)}
                            >
                                <View
                                    style={{
                                        width: '80%',
                                        backgroundColor: themeColors.backGroundColor,
                                        borderRadius: 10,
                                        overflow: 'hidden',
                                    }}
                                >
                                    {renderDropdownItems(locations, setFromLocation, () => setIsFromDropdownOpen(false))}
                                </View>
                            </TouchableOpacity>
                        </Modal>
                    )}

                    {/* To Location Dropdown */}
                    <Text style={{ color: themeColors.textColor, fontSize: 16, marginBottom: 10 }}>Select To Location</Text>
                    <TouchableOpacity
                        onPress={() => setIsToDropdownOpen(!isToDropdownOpen)}
                        style={{
                            height: 50,
                            justifyContent: 'center',
                            backgroundColor: '#ddd',
                            borderRadius: 5,
                            paddingHorizontal: 15,
                            marginBottom: 20,
                        }}
                    >
                        <Text style={{ color: themeColors.textColor, fontSize: 16 }}>
                            {toLocation || 'Select To Location'}
                        </Text>
                    </TouchableOpacity>

                    {isToDropdownOpen && (
                        <Modal
                            transparent
                            visible={isToDropdownOpen}
                            onRequestClose={() => setIsToDropdownOpen(false)}
                        >
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                }}
                                onPress={() => setIsToDropdownOpen(false)}
                            >
                                <View
                                    style={{
                                        width: '80%',
                                        backgroundColor: themeColors.backGroundColor,
                                        borderRadius: 10,
                                        overflow: 'hidden',
                                    }}
                                >
                                    {renderDropdownItems(locations, setToLocation, () => setIsToDropdownOpen(false))}
                                </View>
                            </TouchableOpacity>
                        </Modal>
                    )}

                    {/* Display Current Time */}
                    <Text style={{ color: themeColors.textColor, fontSize: 16, marginBottom: 10 }}>
                        Current Time: {currentTime}
                    </Text>

                    {/* Search Button */}
                    <TouchableOpacity onPress={handleSearchRoute} style={{ backgroundColor: '#007bff', padding: 15, borderRadius: 5 }}>
                        <Text style={{ color: '#fff', textAlign: 'center', fontSize: 18 }}>
                            Find Route
                        </Text>
                    </TouchableOpacity>

                    {/* Display Schedule */}
                    {schedule && (
                        <ScrollView style={{ marginTop: 20 }}>
                            <Text style={{ color: themeColors.textColor, fontSize: 18, marginBottom: 10 }}>
                                Available Schedule:
                            </Text>

                            <Text style={{ color: themeColors.textColor, fontSize: 16, marginBottom: 5 }}>Upstream:</Text>
                            {schedule.upstream && schedule.upstream.length > 0 ? (
                                schedule.upstream.map((item, index) => (
                                    <Text key={index} style={{ color: themeColors.textColor, fontSize: 14 }}>
                                        {item.Motera || item.IITGN || item.Sector - 1}
                                    </Text>
                                ))
                            ) : (
                                <Text style={{ color: themeColors.textColor, fontSize: 14 }}>No upcoming buses</Text>
                            )}

                            <Text style={{ color: themeColors.textColor, fontSize: 16, marginTop: 10 }}>Downstream:</Text>
                            {schedule.downstream && schedule.downstream.length > 0 ? (
                                schedule.downstream.map((item, index) => (
                                    <Text key={index} style={{ color: themeColors.textColor, fontSize: 14 }}>
                                        {item.Motera || item.IITGN || item.Sector - 1}
                                    </Text>
                                ))
                            ) : (
                                <Text style={{ color: themeColors.textColor, fontSize: 14 }}>No upcoming buses</Text>
                            )}
                        </ScrollView>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}
