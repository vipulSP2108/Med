const GOOGLE_SCRIPT_BookSlot = 'https://script.google.com/macros/s/AKfycbzvpxaLNfraLGZgR8xSJ-H1BGEQzIpaEppiWUYXFja4tz2FchwFSip9o8G4njKmLs69/exec'
const GOOGLE_SCRIPT_GetAvalableSlot = 'https://script.google.com/macros/s/AKfycbxkR19XdcxEayv0hYgI_9V2jqvbGhJUi7nBi2BhQTGljfkInOEzFRfto1PjwS6DW0Bt/exec'

import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList, StyleSheet, ActivityIndicator, Image, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ThemeContext } from "../Context/ThemeContext";
import useCustomAlert from "../Components/Alerthook";
import { GlobalStateContext } from "../Context/GlobalStateContext";

const DoctorDetailsScreen = () => {
    const route = useRoute();
    const { showAlert, AlertWrapper } = useCustomAlert();
    const { userData } = useContext(GlobalStateContext);
    const { themeColors, toggleTheme } = useContext(ThemeContext);
    const navigation = useNavigation();

    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState();
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(route.params?.selectedDate || '');
    const [doctorName, setDoctorName] = useState(route.params?.doctorName || "Dr. John Doe");

    const [loading, setLoading] = useState(false);  // Add loading state

    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        const selectDate = new Date(selectedDate.datefull);

        const formatted = selectDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        });

        // Remove the comma from the formatted string
        const formattedWithoutCommas = formatted.replace(/,/g, '');

        setFormattedDate(formattedWithoutCommas); // Update the state
    }, [selectedDate]);

    useEffect(() => {
        const today = new Date();
        const nextDates = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(today.getDate() + i);
            return {
                datefull: date,
                day: date.toLocaleString("en-US", { weekday: "short" }),
                date: date.getDate().toString().padStart(2, "0"),
            };
        });
        setDates(nextDates);
        setSelectedDate(route.params?.selectedDate); // Select today's date by default
    }, []);

    // Extract parameters from navigation
    const {
        specialization = "General Physician",
        rating = "5.0",
        OffDays = ["Sunday"],
        Time = "09:00 To 12:00",
        Category = "General",
        OffDates = ["Mon Jan 1 2025"],
    } = route.params || {};

    const getAvailableSlots = async () => {
        if (!selectedDate) {
            console.error("No selected date provided.");
            return;
        }

        setLoading(true);  // Start loading

        try {
            const response = await fetch(GOOGLE_SCRIPT_GetAvalableSlot, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    passedDate: selectedDate.datefull.toString(),  // Make sure this is the correct format for the API
                    doctorName: doctorName,
                }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const text = await response.text(); // Get raw response text
            try {
                const data = JSON.parse(text); // Attempt to parse the JSON response
                setAvailableSlots(data);
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
            }
        } catch (error) {
            console.error("Error fetching available slots:", error);
        } finally {
            setLoading(false);  // Stop loading once data is fetched or error occurs
        }
    };

    useEffect(() => {
        if (selectedDate) {
            getAvailableSlots();
        }
    }, [selectedDate, doctorName]); // Re-run if selectedDate or doctorName changes

    const availableDates = ["Tue 11", "Wed 12", "Thu 13", "Fri 14"];

    const renderItem = ([slot, isAvailable], index) => (
        <TouchableOpacity
            onPress={() => handleSlotSelect(slot)}
            key={index}
            style={[styles.gridItem, { backgroundColor: selectedSlots == slot ? themeColors.diffrentColorPerple : isAvailable ? themeColors.diffrentColorRed : themeColors.diffrentColorPerpleBG, opacity: isAvailable ? 0.5 : 1 }]} // Adjust opacity for unavailable slots
            disabled={isAvailable} // Disable button if not available
        >
            <Text style={styles.slotText}>{slot}</Text>
        </TouchableOpacity>
    );

    const handleSlotSelect = (slot) => {
        // Select or deselect the slot
        setSelectedSlots(slot);
    };

    const [isLoadingFinal, setIsLoadingFinal] = useState(false);
    // console.log(selectedDate.datefull)
    // console.log(formattedDate, selectedSlots, doctorName)

    const handleSubmit = async () => {

        const userEmail = userData.contactinfo

        if (!selectedDate || !selectedSlots || !doctorName) {
            showAlert({
                title: "Selection Required",
                message: "Date and slot are missing. Please select them again to proceed.",
                codeMassage: { code: '400', text: '📅 Pick a date & slot first!' },
                // buttons: [
                //     {
                //       icon: 'shield-checkmark',
                //       text: "Ok",
                //       onPress: () => null,
                //       styleColor: '#2CD007'
                //     }
                // ]
            });

            // Alert.alert('Error', 'Please enter both a date, doctorName and a slot.');
            return;
        }

        setIsLoadingFinal(true); // Show loading spinner

        try {
            // Send data to the Google Apps Script using fetch
            const response = await fetch(GOOGLE_SCRIPT_BookSlot, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: formattedDate,
                    slot: selectedSlots,
                    doctorName: doctorName,
                    userEmail: userEmail,
                }),
            });

            // console.log(selectedSlots, formattedDate, response)
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const text = await response.text();
            // console.log('text', text)
            try {
                const data = JSON.parse(text);
                // console.log('data', data)
                if (!data.message.includes('Error')) {
                    Alert.alert(data.message);
                    navigation.navigate('MedicalOrders');
                }
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                showAlert({
                    title: "Booking Failed",
                    message: "We couldn't book your appointment due to a server issue. Please try again later.",
                    codeMassage: { code: '500', text: '⚡ Server’s down! Retry soon.' },
                });
            }

        } catch (error) {
            console.error('Error posting to Google Sheets:', error);
            showAlert({
                title: "Slot Booking Failed",
                message: "We couldn't book your slot. Please try again. If the issue persists, take a screenshot and report it.",
                codeMassage: { code: '400', text: '📸 Retry & send a screenshot!' },
                additional: [
                    { head: "error", head2: error },
                ]
            });
        } finally {
            getAvailableSlots();
            setIsLoadingFinal(false); // Hide loading spinner
        }
    };

    const setDiffDate = (selectedDate) => {
        // console.log(selectedDate);
        const formattedSelectedDate = new Date(selectedDate.datefull).toLocaleString("en-US", { weekday: 'long' });
        const offDays = route.params?.OffDays.map(day => day.toLowerCase());
        const offDates = route.params?.OffDates.map(date => new Date(date).toLocaleDateString());

        // console.log(offDays, offDates);

        if (offDates.includes(selectedDate.datefull.toLocaleDateString())) {
            showAlert({
                title: "Doctor Unavailable",
                message: `The doctor is on leave. \nDoctor’s off dates: ${offDates.join(', ')}`,
                codeMassage: { code: '403', text: '🩺 Doc’s off! Check on different Date.' },
            });
        }
        else if (offDays.includes(formattedSelectedDate.toLowerCase())) {
            const offDaysRange = `${offDays[0]} to ${offDays[offDays.length - 1]}`;
            showAlert({
                title: "Doctor Unavailable",
                message: `The doctor is off on the selected date. \nTheir off days are from ${offDaysRange}`,
                codeMassage: { code: '403', text: '🩺 No appointments! Doc’s off.' },
            });
        }
        else {
            setSelectedDate(selectedDate);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#F5F7FB" }}>
            <ScrollView >

                <View>
                    <Image
                        source={{ uri: route.params?.doctorImage }} // Placeholder image
                        className=' w-full h-72'
                    // style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 130}}
                    />
                </View>

                <View className=' p-3'>
                    <View className=' flex-row justify-between'>
                        <View>
                            <Text style={{ fontSize: 24, fontWeight: "bold" }}>{doctorName}</Text>
                            <Text style={{ fontSize: 18, color: "gray" }}>{specialization}</Text>
                        </View>
                        <View className=' bg-slate-200 px-4 items-center justify-center rounded-full'>
                            <Text style={{ fontSize: 16 }}>⭐ {rating}</Text>
                        </View>
                    </View>

                    <Text style={{ marginTop: 20, fontSize: 18, fontWeight: "bold" }}>Available this Weeks</Text>

                    {/* Date Selector */}
                    <View className="py-4">
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={dates}
                            keyExtractor={(item) => item.date}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => setDiffDate(item)}
                                    style={{
                                        // width: 35,
                                        // height: 35,
                                        borderRadius: 20,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: selectedDate.date === item.date ? "white" : "rgba(255, 255, 255, 0.3)",
                                    }}
                                    className=' flex-row px-3 py-4 rounded-full'
                                >
                                    <Text className=' mr-2' style={{ color: selectedDate.date === item.date ? themeColors.mainTextColor : themeColors.textColor }}>{item.day}</Text>
                                    {/* , opacity: selectedDate.date === item.date ? 1 : 0.6 */}
                                    <Text style={{ color: selectedDate.date === item.date ? themeColors.mainTextColor : themeColors.textColor, fontWeight: "bold" }}>{item.date}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>

                    <Text style={{ marginTop: 20, fontSize: 18, fontWeight: "bold" }}>Available time slots</Text>

                    {/* Loading Indicator */}
                    {loading ? (
                        <ActivityIndicator size="large" color="#0066FF" />
                    ) : (
                        <FlatList
                            data={Object.entries(availableSlots?.availability || {})} // Convert object to an array of key-value pairs
                            renderItem={({ item, index }) => renderItem(item, index)}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={4}
                            columnWrapperStyle={styles.row}
                        />
                    )}
                </View>
            </ScrollView>

            <View className=' absolute p-2 bottom-0 w-full bg-white flex-row justify-between'>
                <View className=' mr-4'>
                    {/* {console.log(selectedDate.)} */}
                    <Text>Day: {selectedDate.day} {selectedDate.date}</Text>
                    <Text>Slot: {selectedSlots} </Text>
                    {/* - {selectedSlots + 5} */}
                </View>
                <TouchableOpacity
                    onPress={handleSubmit}
                    style={{ flex: 1, padding: 15, backgroundColor: "#0066FF", borderRadius: 10, alignItems: "center" }}
                >
                    <Text style={{ color: "white", fontSize: 18 }}>{isLoadingFinal ? 'Booking...' : 'Book appointment'}</Text>
                </TouchableOpacity>
            </View>
            {AlertWrapper()}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        justifyContent: 'space-evenly', // Space out items evenly in a row
    },
    gridItem: {
        width: '22%',
        paddingVertical: 14, // Fixed height for each grid item
        justifyContent: 'center',
        backgroundColor: "#E0EFFF",
        margin: 5,
        borderRadius: 10,
        alignItems: 'center', // Centers the text horizontally
    },
});

export default DoctorDetailsScreen;