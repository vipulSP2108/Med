import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, StatusBar, Alert, Switch, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { ThemeContext } from '../Context/ThemeContext';
import { API_BASE_URL, CREATERIDE_ENDPOINT } from '../Constants/Constants';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment'; // We use moment to format the date properly
import { Ionicons } from '@expo/vector-icons'; // For icons

export default function CreateRide() {
    const { userData } = useContext(GlobalStateContext); // Access the global user data
    const { themeColors } = useContext(ThemeContext);

    let userDataCopy = { ...userData };
    delete userDataCopy.password; // Remove password if exists for privacy

    // Define default values for the form fields
    const [totalCandidates, setTotalCandidates] = useState(4);
    const [candidatesFilled, setCandidatesFilled] = useState(0);
    const [candidatesNeeded, setCandidatesNeeded] = useState(4);
    const [priceIsApprox, setPriceIsApprox] = useState(true);
    const [agreedPrice, setAgreedPrice] = useState(25);
    const [splittedPrice, setSplittedPrice] = useState(25);
    const [goingDate, setGoingDate] = useState('2025-04-10');
    const [goingTime, setGoingTime] = useState('10:00 AM');
    const [StartingPoint, setStartingPoint] = useState('Location A');
    const [destination, setDestination] = useState('Location B');
    const [rideStatus, setRideStatus] = useState('active');
    const [additionalDetails, setAdditionalDetails] = useState('');

    const [rideCreator, setRideCreator] = useState(userDataCopy);
    const [passengers, setPassengers] = useState([]);

    const [personWithMe, setPersonWithMe] = useState(0);
    // Date and Time Picker states
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [isTimePickerVisible, setTimePickerVisible] = useState(false);

    const [errors, setErrors] = useState({
        StartingPoint: false,
        destination: false,
        agreedPrice: false,
        goingDate: false,
        goingTime: false,
        totalCandidates: false,
    });

    const [selectedMode, setSelectedMode] = useState('split'); // State to track the selected mode
    const [showModal, setShowModal] = useState(false); // Modal visibility for dropdown
    const [finalPricePerPerson, setFinalPricePerPerson] = useState(0); // For 'fixed' mode

    // Function to create a ride (API request)
    async function createRide(orderData) {
        try {
            const response = await fetch(`${API_BASE_URL}:${CREATERIDE_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Order created successfully');
            } else {
                Alert.alert('Error creating ride', result.message || 'An error occurred while creating the ride.');
            }
        } catch (error) {
            console.error('Error creating ride:', error);
            Alert.alert('Network Error', 'An error occurred while connecting to the server. Please try again.');
        }
    }

    // Validation function
    const validateForm = () => {
        const newErrors = {
            StartingPoint: StartingPoint.trim().length < 4,
            destination: destination.trim().length < 4,
            agreedPrice: agreedPrice <= 0 || isNaN(agreedPrice),
            goingDate: !goingDate.trim(),
            goingTime: !goingTime.trim(),
            totalCandidates: totalCandidates <= 0,
        };
        setErrors(newErrors);

        // If any error is true, return false to prevent form submission
        return !Object.values(newErrors).includes(true);
    };

    // Handle date selection
    const handleDateConfirm = (date) => {
        setGoingDate(moment(date).format('YYYY-MM-DD'));
        setDatePickerVisible(false);
    };

    // Handle time selection
    const handleTimeConfirm = (time) => {
        setGoingTime(moment(time).format('hh:mm A'));
        setTimePickerVisible(false);
    };

    // Handle form submission (ride creation)
    const handleSubmit = async () => {
        if (!validateForm()) {
            return; // Don't submit if validation fails
        }

        const orderData = {
            id: Date.now().toString(),
            totalCandidates,
            candidatesFilled,
            candidatesNeeded,
            priceIsApprox,
            agreedPrice,
            splittedPrice,
            goingDate,
            goingTime,
            StartingPoint,
            destination,
            rideStatus,
            passengers,
            rideCreator,
            additionalDetails,
            mode: selectedMode,
            finalPricePerPerson,
        };

        try {
            const orderResult = await createRide(orderData);
            if (orderResult) {
                Alert.alert('Success', 'Ride created successfully!');
            }
        } catch (error) {
            console.error('Error creating ride:', error);
        }
    };

    useEffect(() => {
        if(selectedMode == 'split'){
            setFinalPricePerPerson((agreedPrice / (personWithMe + 1))); // 1 for me
        }
    }, [selectedMode, agreedPrice, personWithMe])

    useEffect(() => {
        setCandidatesFilled(personWithMe + 1)
        setTotalCandidates(candidatesNeeded + personWithMe + 1)
    }, [candidatesNeeded, personWithMe])

    return (
        <View style={[styles.container, { backgroundColor: themeColors.backGroundColor }]}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <StatusBar
                    barStyle={themeColors.backGroundColor === '#1C1C1E' ? 'light-content' : 'dark-content'}
                    backgroundColor={themeColors.bottomNav}
                />

                <Text style={[styles.header, { color: themeColors.textColor }]}>Create a New Ride</Text>

                {/* Starting Point */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: themeColors.textColor }]}>Where will the ride begin? (e.g., your current location or a nearby landmark)</Text>
                    <TextInput
                        style={[styles.input, errors.StartingPoint && styles.errorInput]}
                        placeholder="Enter Starting Point"
                        value={StartingPoint}
                        onChangeText={setStartingPoint}
                    />
                    {errors.StartingPoint && <Text style={styles.errorText}>Starting point must be at least 4 characters long</Text>}
                </View>

                {/* Destination */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: themeColors.textColor }]}>Where are you heading? (e.g., the final stop or destination)</Text>
                    <TextInput
                        style={[styles.input, errors.destination && styles.errorInput]}
                        placeholder="Enter Destination"
                        value={destination}
                        onChangeText={setDestination}
                    />
                    {errors.destination && <Text style={styles.errorText}>Destination must be at least 4 characters long</Text>}
                </View>

                {/* Agreed Price */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: themeColors.textColor }]}>How much do you agree to pay for this ride?</Text>
                    <TextInput
                        style={[styles.input, errors.agreedPrice && styles.errorInput]}
                        placeholder="Enter Agreed Price"
                        value={String(agreedPrice)}
                        onChangeText={(text) => setAgreedPrice(Number(text))}
                        keyboardType="numeric"
                    />
                    {errors.agreedPrice && <Text style={styles.errorText}>Please enter a valid agreed price for the ride.</Text>}
                </View>

                {/* Mode Selection */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: themeColors.textColor }]}>How do you want to split the cost?</Text>
                    <TouchableOpacity onPress={() => setShowModal(true)} style={styles.dropdownButton}>
                        <Text style={[styles.buttonText, { color: themeColors.textColor }]}>
                            {selectedMode === 'split' ? 'Split' : 'Fixed'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Modal for Mode Selection */}
                <Modal visible={showModal} transparent={true} animationType="fade">
                    <TouchableOpacity style={styles.modalBackground} onPress={() => setShowModal(false)}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity onPress={() => { setSelectedMode('split'); setShowModal(false); }}>
                                <Text style={styles.modalOption}>Split</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setSelectedMode('fixed'); setShowModal(false); }}>
                                <Text style={styles.modalOption}>Fixed</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Final Price Per Person for Fixed Mode */}
                {selectedMode === 'fixed' && (
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: themeColors.textColor }]}>What is the final price each passenger will pay? (for fixed pricing)</Text>
                        <TextInput
                            style={[styles.input, errors.agreedPrice && styles.errorInput]}
                            placeholder="Enter Final Price"
                            value={String(finalPricePerPerson)}
                            onChangeText={(text) => setFinalPricePerPerson(Number(text))}
                            keyboardType="numeric"
                        />
                    </View>
                )}

                {/* {selectedMode === 'split' && ( */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: themeColors.textColor }]}>Are there additional passengers traveling with you? How many people will join you in the ride? (excluding yourself)</Text>
                        <TextInput
                            style={[styles.input, errors.agreedPrice && styles.errorInput]}
                            placeholder="Enter Person With you"
                            value={String(personWithMe)}
                            onChangeText={(text) => setPersonWithMe(Number(text))}
                            keyboardType="numeric"
                        />
                    </View>
                {/* )} */}

                {/* Going Date */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: themeColors.textColor }]}>When is the ride happening? (Select a date)</Text>
                    <TouchableOpacity style={styles.dateTimeButton} onPress={() => setDatePickerVisible(true)}>
                        <Text style={[styles.buttonText, { color: themeColors.textColor }]}>
                            {goingDate ? goingDate : 'Pick a Date'}
                        </Text>
                        <Ionicons name="calendar" size={24} color={themeColors.textColor} />
                    </TouchableOpacity>
                </View>

                {/* Going Time */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: themeColors.textColor }]}>At what time will you be leaving? (Select a time)</Text>
                    <TouchableOpacity style={styles.dateTimeButton} onPress={() => setTimePickerVisible(true)}>
                        <Text style={[styles.buttonText, { color: themeColors.textColor }]}>
                            {goingTime ? goingTime : 'Pick a Time'}
                        </Text>
                        <Ionicons name="time" size={24} color={themeColors.textColor} />
                    </TouchableOpacity>
                </View>

                {/* Total Candidates */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: themeColors.textColor }]}>How many total new passengers could join the ride (excluding you and your mates)?</Text>
                    <TextInput
                        style={[styles.input, errors.totalCandidates && styles.errorInput]}
                        placeholder="Enter Total Candidates"
                        value={String(candidatesNeeded)}
                        onChangeText={(text) => setCandidatesNeeded(Number(text))}
                        keyboardType="numeric"
                    />
    <Text style={[styles.label, { color: themeColors.textColor }]}>
        Total space available: {candidatesNeeded + personWithMe + 1}, with {personWithMe + 1} already filled.
    </Text>
                </View>

                {/* Price Is Approx */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: themeColors.textColor }]}>Is the price approximate or fixed?</Text>
                    <Switch
                        value={priceIsApprox}
                        onValueChange={setPriceIsApprox}
                        trackColor={{ true: themeColors.primary, false: themeColors.secondary }}
                    />
                </View>

                {/* Additional Details */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: themeColors.textColor }]}>Any other details you'd like to share about the ride? (Optional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Additional Details"
                        value={additionalDetails}
                        onChangeText={setAdditionalDetails}
                    />
                </View>

                {/* Submit Button */}
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit Ride Details</Text>
                </TouchableOpacity>

                {/* Date Picker Modal */}
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleDateConfirm}
                    onCancel={() => setDatePickerVisible(false)}
                />

                {/* Time Picker Modal */}
                <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    mode="time"
                    onConfirm={handleTimeConfirm}
                    onCancel={() => setTimePickerVisible(false)}
                />
            </ScrollView>
        </View>
    );
}

// Styles for the form
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    scrollView: {
        paddingBottom: 20,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        marginBottom: 6,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        borderRadius: 8,
        fontSize: 16,
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
    inputGroup: {
        marginBottom: 20,
    },
    dateTimeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dropdownButton: {
        padding: 10,
        backgroundColor: '#eee',
        borderRadius: 8,
        marginBottom: 10,
        textAlign: 'center',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: 300,
        height: 200,
    },
    modalOption: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
});
